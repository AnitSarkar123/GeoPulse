const mongoose = require("mongoose");

const SavedNewsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The original event id from the news pipeline
    eventId: {
      type: String,
      required: true,
    },
    // Full snapshot of the event so it can be displayed even if removed from cache
    eventData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    // Optional location data for geospatial queries
    location: {
      type: {
        type: String,
        enum: ['Point'], 
      },
      coordinates: {
        type: [Number], 
      }
    }
  },
  {
    timestamps: false,
  }
);

// Prevent a user saving the same event twice
SavedNewsSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// 2dsphere index to optimize MongoDB geospatial queries
SavedNewsSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("SavedNews", SavedNewsSchema);
