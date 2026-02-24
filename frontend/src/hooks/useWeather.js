import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCitySuggestions,
  getRecentCities,
  getWeatherByCity,
} from '../services/weatherApi';

const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;
const RECENT_CACHE_TTL_MS = 60 * 1000;
const SUGGESTION_CACHE_TTL_MS = 5 * 60 * 1000;

const isCacheValid = (cacheEntry, ttlMs) => {
  if (!cacheEntry) {
    return false;
  }

  return Date.now() - cacheEntry.timestamp < ttlMs;
};

export const useWeather = () => {
  const weatherCacheRef = useRef(new Map());
  const recentCacheRef = useRef(new Map());
  const suggestionCacheRef = useRef(new Map());
  const suggestionRequestIdRef = useRef(0);

  const [weather, setWeather] = useState(null);
  const [recentCities, setRecentCities] = useState([]);
  const [recentPagination, setRecentPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [error, setError] = useState('');

  const loadRecentCities = useCallback(
    async (targetPage = 1, targetLimit = recentPagination.limit) => {
      const pageKey = `${targetPage}:${targetLimit}`;
      const cachedRecentPage = recentCacheRef.current.get(pageKey);

      if (isCacheValid(cachedRecentPage, RECENT_CACHE_TTL_MS)) {
        setRecentCities(cachedRecentPage.value.items);
        setRecentPagination(cachedRecentPage.value.pagination);
        return;
      }

      try {
        const response = await getRecentCities(targetPage, targetLimit);
        setRecentCities(response.items);
        setRecentPagination(response.pagination);
        recentCacheRef.current.set(pageKey, {
          timestamp: Date.now(),
          value: response,
        });
      } catch {
        setRecentCities([]);
        setRecentPagination((previous) => ({
          ...previous,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }));
      }
    },
    [recentPagination.limit],
  );

  useEffect(() => {
    loadRecentCities(1, recentPagination.limit);
  }, [loadRecentCities, recentPagination.limit]);

  const searchCity = useCallback(
    async (city) => {
      const normalizedCity = city.trim().toLowerCase();

      if (!normalizedCity) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const cachedWeather = weatherCacheRef.current.get(normalizedCity);
        const weatherData = isCacheValid(cachedWeather, WEATHER_CACHE_TTL_MS)
          ? cachedWeather.value
          : await getWeatherByCity(city);

        if (!isCacheValid(cachedWeather, WEATHER_CACHE_TTL_MS)) {
          weatherCacheRef.current.set(normalizedCity, {
            timestamp: Date.now(),
            value: weatherData,
          });
        }

        setWeather(weatherData);
        recentCacheRef.current.clear();
        await loadRecentCities(1, recentPagination.limit);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to fetch weather right now. Try again.',
        );
      } finally {
        setLoading(false);
      }
    },
    [loadRecentCities, recentPagination.limit],
  );

  const goToNextRecentPage = useCallback(async () => {
    if (!recentPagination.hasNextPage) {
      return;
    }

    await loadRecentCities(recentPagination.page + 1, recentPagination.limit);
  }, [loadRecentCities, recentPagination.hasNextPage, recentPagination.page]);

  const goToPrevRecentPage = useCallback(async () => {
    if (!recentPagination.hasPrevPage) {
      return;
    }

    await loadRecentCities(recentPagination.page - 1, recentPagination.limit);
  }, [loadRecentCities, recentPagination.hasPrevPage, recentPagination.page]);

  const setRecentPageSize = useCallback(
    async (nextLimit) => {
      const parsedLimit = Number.parseInt(nextLimit, 10);

      if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
        return;
      }

      setRecentPagination((previous) => ({
        ...previous,
        page: 1,
        limit: parsedLimit,
      }));

      await loadRecentCities(1, parsedLimit);
    },
    [loadRecentCities],
  );

  const loadCitySuggestions = useCallback(async (query) => {
    const trimmedQuery = query.trim();
    const normalizedQuery = trimmedQuery.toLowerCase();

    if (trimmedQuery.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const cachedSuggestions = suggestionCacheRef.current.get(normalizedQuery);
    if (isCacheValid(cachedSuggestions, SUGGESTION_CACHE_TTL_MS)) {
      setCitySuggestions(cachedSuggestions.value);
      return;
    }

    setSuggestionsLoading(true);
    const requestId = suggestionRequestIdRef.current + 1;
    suggestionRequestIdRef.current = requestId;

    try {
      const suggestions = await getCitySuggestions(trimmedQuery, 5);
      if (suggestionRequestIdRef.current !== requestId) {
        return;
      }

      setCitySuggestions(suggestions);
      suggestionCacheRef.current.set(normalizedQuery, {
        timestamp: Date.now(),
        value: suggestions,
      });
    } catch {
      if (suggestionRequestIdRef.current !== requestId) {
        return;
      }

      setCitySuggestions([]);
    } finally {
      if (suggestionRequestIdRef.current === requestId) {
        setSuggestionsLoading(false);
      }
    }
  }, []);

  const clearCitySuggestions = useCallback(() => {
    setCitySuggestions([]);
    setSuggestionsLoading(false);
  }, []);

  return {
    weather,
    recentCities,
    recentPagination,
    loading,
    suggestionsLoading,
    citySuggestions,
    error,
    searchCity,
    loadCitySuggestions,
    clearCitySuggestions,
    goToNextRecentPage,
    goToPrevRecentPage,
    setRecentPageSize,
  };
};
