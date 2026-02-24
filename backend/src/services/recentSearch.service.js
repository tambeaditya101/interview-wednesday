import { RecentSearch } from '../models/RecentSearch.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const saveRecentSearch = async ({ city, displayCity, country }) => {
  const latestSearch = await RecentSearch.findOneAndUpdate(
    { city },
    {
      city,
      displayCity,
      country,
      searchedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  await RecentSearch.deleteMany({
    city,
    _id: { $ne: latestSearch._id },
  });
};

export const getRecentSearches = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
} = {}) => {
  const sanitizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : DEFAULT_PAGE;
  const sanitizedLimit = Number.isFinite(limit)
    ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)))
    : DEFAULT_LIMIT;

  const skip = (sanitizedPage - 1) * sanitizedLimit;

  const [result] = await RecentSearch.aggregate([
    { $sort: { searchedAt: -1 } },
    {
      $group: {
        _id: {
          displayCity: { $toLower: '$displayCity' },
          country: { $toLower: { $ifNull: ['$country', ''] } },
        },
        displayCity: { $first: '$displayCity' },
        country: { $first: '$country' },
        searchedAt: { $first: '$searchedAt' },
      },
    },
    { $sort: { searchedAt: -1 } },
    {
      $facet: {
        items: [
          { $skip: skip },
          { $limit: sanitizedLimit },
          { $project: { _id: 0, displayCity: 1, country: 1, searchedAt: 1 } },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const totalItems = result?.totalCount?.[0]?.count || 0;
  const totalPages =
    totalItems === 0 ? 0 : Math.ceil(totalItems / sanitizedLimit);

  return {
    items: result?.items || [],
    pagination: {
      page: sanitizedPage,
      limit: sanitizedLimit,
      totalItems,
      totalPages,
      hasNextPage: sanitizedPage < totalPages,
      hasPrevPage: sanitizedPage > 1,
    },
  };
};
