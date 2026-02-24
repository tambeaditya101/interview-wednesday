import mongoose from 'mongoose';

const recentSearchSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayCity: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: null,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

recentSearchSchema.index({ city: 1, searchedAt: -1 });
recentSearchSchema.index({ city: 1 }, { unique: true });

export const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);
