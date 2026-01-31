import mongoose, { Schema, models } from "mongoose";

const movieSchema = new Schema(
    {
        userId: { type: String, required: true }, // Relasi ke User
        title: { type: String, required: true },
        type: { type: String, default: "movie" }, // 'movie' or 'series'
        status: { type: String, default: "plan-to-watch" },
        rating: { type: Number, default: 0 },
        note: { type: String, default: "" },

        // Movie specifics
        totalMinutes: { type: Number, default: 0 },
        lastWatchedMinute: { type: Number, default: 0 },

        // Series specifics
        currentSeason: { type: Number, default: 1 },
        currentEpisode: { type: Number, default: 1 },
        totalEpisodes: { type: Number, default: 12 },
    },
    { timestamps: true }
);

const Movie = models.Movie || mongoose.model("Movie", movieSchema);
export default Movie;