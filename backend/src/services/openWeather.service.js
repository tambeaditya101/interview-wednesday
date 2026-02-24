import axios from 'axios';
import { env } from '../config/env.js';

const weatherClient = axios.create({
  baseURL: env.openWeatherBaseUrl,
  timeout: 8000,
});

export const fetchCurrentWeatherByCity = async (city) => {
  try {
    const response = await weatherClient.get('/weather', {
      params: {
        q: city,
        appid: env.openWeatherApiKey,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      const rateLimitError = new Error(
        'Weather service rate limited. Try later.',
      );
      rateLimitError.statusCode = 503;
      throw rateLimitError;
    }

    if (error.response?.status === 404) {
      const notFoundError = new Error('City not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const apiError = new Error('Failed to fetch weather from provider');
    apiError.statusCode = 502;
    throw apiError;
  }
};

export const fetchCitySuggestions = async (query, limit = 5) => {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: trimmedQuery,
          limit,
          appid: env.openWeatherApiKey,
        },
        timeout: 8000,
      },
    );

    const uniqueSuggestions = new Map();

    for (const item of response.data || []) {
      const key =
        `${item.name}-${item.state || ''}-${item.country || ''}`.toLowerCase();

      if (!uniqueSuggestions.has(key)) {
        const parts = [item.name, item.state, item.country].filter(Boolean);
        uniqueSuggestions.set(key, {
          name: item.name,
          state: item.state || null,
          country: item.country || null,
          displayName: parts.join(', '),
          query: [item.name, item.country].filter(Boolean).join(', '),
        });
      }
    }

    return Array.from(uniqueSuggestions.values());
  } catch (error) {
    if (error.response?.status === 429) {
      const rateLimitError = new Error(
        'Weather service rate limited. Try later.',
      );
      rateLimitError.statusCode = 503;
      throw rateLimitError;
    }

    const apiError = new Error(
      'Failed to fetch city suggestions from provider',
    );
    apiError.statusCode = 502;
    throw apiError;
  }
};
