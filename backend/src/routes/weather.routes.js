import { Router } from 'express';
import {
  getCitySuggestions,
  getRecentCities,
  getWeatherByCity,
} from '../controllers/weather.controller.js';

const router = Router();

router.get('/', getWeatherByCity);
router.get('/recent', getRecentCities);
router.get('/suggestions', getCitySuggestions);

export default router;
