const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  book: { type: mongoose.Types.ObjectId, required: true, ref: "Book" },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Review", reviewSchema);
