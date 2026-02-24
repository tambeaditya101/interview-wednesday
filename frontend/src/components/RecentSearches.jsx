import { memo, useMemo } from 'react';

function RecentSearches({
  cities,
  onCityClick,
  pagination,
  onPrevPage,
  onNextPage,
  onPageSizeChange,
}) {
  const canGoPrev = pagination.page > 1 && pagination.totalPages > 0;
  const canGoNext = pagination.page < pagination.totalPages;

  const renderedCities = useMemo(
    () =>
      cities.map((entry) => (
        <li key={`${entry.displayCity}-${entry.searchedAt}`}>
          <button type='button' onClick={() => onCityClick(entry.displayCity)}>
            {entry.displayCity}
            {entry.country ? `, ${entry.country}` : ''}
          </button>
        </li>
      )),
    [cities, onCityClick],
  );

  return (
    <section className='recent-searches'>
      <div className='recent-header'>
        <h3>Recent Searches</h3>
        <span>{pagination.totalItems} total</span>
      </div>

      {cities.length === 0 ? (
        <p>No recent searches yet.</p>
      ) : (
        <ul>{renderedCities}</ul>
      )}

      {pagination.totalPages > 1 && (
        <div className='recent-pagination'>
          <button type='button' onClick={onPrevPage} disabled={!canGoPrev}>
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button type='button' onClick={onNextPage} disabled={!canGoNext}>
            Next
          </button>
        </div>
      )}

      <div className='recent-page-size'>
        <label htmlFor='recent-page-size'>Page size:</label>
        <select
          id='recent-page-size'
          value={pagination.limit}
          onChange={(event) => onPageSizeChange(event.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </section>
  );
}

export default memo(RecentSearches);
