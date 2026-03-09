import "dotenv/config";
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const WatchHistorySchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    title: { type: String },
    watchedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarImage: {
      type: String,
      required: true,
    },
    watchHistory: {
      type: [WatchHistorySchema],
      default: [],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.methods.addToWatchHistory = async function (entry, cap = 50) {
  await this.model("User").updateOne(
    { _id: this._id },
    {
      $pull: { watchHistory: { movie: entry.movie } },
      $push: {
        watchHistory: {
          $each: [entry],
          $position: 0,
          $slice: cap,
        },
      },
    },
  );
};

UserSchema.methods.isPasswordCorrect = async function (password) {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

UserSchema.index({ "watchHistory.movie": 1 });

export const User = mongoose.model("User", UserSchema);
