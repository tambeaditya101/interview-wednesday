import { memo, useEffect, useMemo, useState } from 'react';

function SearchForm({
  onSearch,
  loading,
  suggestions,
  suggestionsLoading,
  onQueryChange,
  onClearSuggestions,
}) {
  const [city, setCity] = useState('');
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  const shouldShowSuggestions = useMemo(
    () =>
      isSuggestionOpen &&
      city.trim() &&
      (suggestionsLoading || suggestions.length > 0),
    [isSuggestionOpen, city, suggestionsLoading, suggestions.length],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onQueryChange(city);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [city, onQueryChange]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
    onClearSuggestions();
    setIsSuggestionOpen(false);
    setCity('');
  };

  const handleSuggestionSelect = (suggestion) => {
    onSearch(suggestion.query);
    onClearSuggestions();
    setIsSuggestionOpen(false);
    setCity('');
  };

  return (
    <div className='search-box'>
      <form className='search-form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search city (e.g. London, Mumbai, Tokyo)'
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setIsSuggestionOpen(true);
          }}
          onFocus={() => setIsSuggestionOpen(true)}
          aria-label='City'
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Searching...' : 'Get Weather'}
        </button>
      </form>

      {shouldShowSuggestions && (
        <ul className='suggestion-list'>
          {suggestionsLoading ? (
            <li className='suggestion-item disabled'>Loading suggestions...</li>
          ) : (
            suggestions.map((suggestion) => (
              <li key={suggestion.displayName}>
                <button
                  type='button'
                  className='suggestion-item'
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion.displayName}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default memo(SearchForm);
