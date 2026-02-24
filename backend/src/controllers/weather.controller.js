import {
  fetchCitySuggestions,
  fetchCurrentWeatherByCity,
} from '../services/openWeather.service.js';
import {
  getRecentSearches,
  saveRecentSearch,
} from '../services/recentSearch.service.js';
import { normalizeCity } from '../utils/normalize.js';

export const getWeatherByCity = async (req, res, next) => {
  try {
    const city = normalizeCity(req.query.city || '');

    if (!city || city.trim().length < 2) {
      return res.status(400).json({
        message: 'Valid city is required',
      });
    }

    const weatherData = await fetchCurrentWeatherByCity(city);
    const weatherCity = normalizeCity(weatherData.name || city);
    const weatherCountry = weatherData.sys?.country || null;
    const canonicalCityKey = `${weatherCity.toLowerCase()}::${
      weatherCountry ? weatherCountry.toLowerCase() : ''
    }`;

    await saveRecentSearch({
      city: canonicalCityKey,
      displayCity: weatherCity,
      country: weatherCountry,
    });

    return res.status(200).json({
      success: true,
      data: {
        city: weatherData.name,
        country: weatherData.sys?.country || null,
        temperature: weatherData.main?.temp,
        feelsLike: weatherData.main?.feels_like,
        humidity: weatherData.main?.humidity,
        pressure: weatherData.main?.pressure,
        windSpeed: weatherData.wind?.speed,
        condition: weatherData.weather?.[0]?.main,
        description: weatherData.weather?.[0]?.description,
        icon: weatherData.weather?.[0]?.icon,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentCities = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10);
    const limit = Number.parseInt(req.query.limit, 10);
    const recentSearches = await getRecentSearches({ page, limit });

    return res.status(200).json({
      success: true,
      data: recentSearches.items,
      pagination: recentSearches.pagination,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCitySuggestions = async (req, res, next) => {
  try {
    const query = normalizeCity(req.query.q || '');
    const limit = Number.parseInt(req.query.limit, 10);

    if (!query) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const suggestions = await fetchCitySuggestions(
      query,
      Number.isFinite(limit) ? limit : 5,
    );

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return next(error);
  }
};
