import { memo, useMemo } from 'react';

function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  const metrics = useMemo(
    () => [
      {
        label: 'Temperature',
        value: `${Math.round(weather.temperature)}°C`,
      },
      {
        label: 'Feels Like',
        value: `${Math.round(weather.feelsLike)}°C`,
      },
      {
        label: 'Humidity',
        value: `${weather.humidity}%`,
      },
      {
        label: 'Pressure',
        value: `${weather.pressure} hPa`,
      },
      {
        label: 'Wind',
        value: `${weather.windSpeed} m/s`,
      },
    ],
    [weather],
  );

  return (
    <section className='weather-card'>
      <header className='weather-card-header'>
        <div>
          <p className='weather-kicker'>Current conditions</p>
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p className='condition'>
            {weather.condition} - {weather.description}
          </p>
        </div>
        <div className='weather-primary'>
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
            />
          )}
          <strong>{Math.round(weather.temperature)}°C</strong>
        </div>
      </header>

      <div className='weather-grid'>
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(WeatherCard);
