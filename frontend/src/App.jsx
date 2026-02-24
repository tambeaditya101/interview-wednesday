import RecentSearches from './components/RecentSearches';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import { useWeather } from './hooks/useWeather';

export default function App() {
  const {
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
  } = useWeather();

  return (
    <main className='app-shell'>
      <section className='app-hero'>
        <p className='app-badge'>MERN Weather Dashboard</p>
        <h1>Find weather instantly</h1>
        <p className='app-subtitle'>
          Search by city, pick suggestions quickly, and track your recent
          lookups with pagination.
        </p>
      </section>

      <section className='panel'>
        <SearchForm
          onSearch={searchCity}
          loading={loading}
          suggestions={citySuggestions}
          suggestionsLoading={suggestionsLoading}
          onQueryChange={loadCitySuggestions}
          onClearSuggestions={clearCitySuggestions}
        />
      </section>

      {error && <p className='error'>{error}</p>}

      <WeatherCard weather={weather} />

      <section className='panel'>
        <RecentSearches
          cities={recentCities}
          onCityClick={searchCity}
          pagination={recentPagination}
          onPrevPage={goToPrevRecentPage}
          onNextPage={goToNextRecentPage}
          onPageSizeChange={setRecentPageSize}
        />
      </section>
    </main>
  );
}
