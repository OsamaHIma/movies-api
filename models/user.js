const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    movies: [
      {
        movies: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
        },
        watched: Boolean,
      },
    ],
    watchlist: [
      {
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
        },
        watched: Boolean,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = mongoose.model("user", Schema);

module.exports = UserSchema;
