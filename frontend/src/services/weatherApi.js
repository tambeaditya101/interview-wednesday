import { apiClient } from './apiClient';

export const getWeatherByCity = async (city) => {
  const response = await apiClient.get('/weather', { params: { city } });
  return response.data.data;
};

export const getRecentCities = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/weather/recent', {
    params: { page, limit },
  });

  return {
    items: response.data.data,
    pagination: response.data.pagination,
  };
};

export const getCitySuggestions = async (query, limit = 5) => {
  const response = await apiClient.get('/weather/suggestions', {
    params: { q: query, limit },
  });

  return response.data.data;
};
