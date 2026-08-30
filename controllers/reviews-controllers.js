const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const Review = require("../models/review");
const User = require("../models/user");
const Book = require("../models/book");

const HttpError = require("../models/http-error");

const createReview = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { rating, comment, book, creator } = req.body;

  let user;
  let existingBook;

  try {
    user = await User.findById(creator);
    existingBook = await Book.findById(book);
  } catch (err) {
    return next(new HttpError("Creating review failed.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user.", 404));
  }

  if (!existingBook) {
    return next(new HttpError("Could not find book.", 404));
  }

  const createdReview = new Review({
    rating,
    comment,
    book,
    creator,
  });

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await createdReview.save({
      session: sess,
    });

    user.reviews.push(createdReview);

    await user.save({
      session: sess,
    });

    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Creating review failed, please try again.", 500),
    );
  }

  res.status(201).json({
    review: createdReview.toObject({
      getters: true,
    }),
  });
};

const getReviewsByBookId = async (req, res, next) => {
  const bookId = req.params.bid;

  let reviews;

  try {
    reviews = await Review.find({
      book: bookId,
    }).populate("creator", "name email");
  } catch (err) {
    return next(new HttpError("Fetching reviews failed.", 500));
  }

  res.json({
    reviews: reviews.map((review) =>
      review.toObject({
        getters: true,
      }),
    ),
  });
};

const getReviewsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let reviews;

  try {
    reviews = await Review.find({
      creator: userId,
    }).populate("book");
  } catch (err) {
    return next(new HttpError("Fetching reviews failed.", 500));
  }

  res.json({
    reviews: reviews.map((review) =>
      review.toObject({
        getters: true,
      }),
    ),
  });
};

const getReviewById = async (req, res, next) => {
  const reviewId = req.params.rid;

  let review;

  try {
    review = await Review.findById(reviewId)
      .populate("creator", "name email")
      .populate("book");
  } catch (err) {
    return next(new HttpError("Could not find review.", 500));
  }

  if (!review) {
    return next(new HttpError("Review not found.", 404));
  }

  res.json({
    review: review.toObject({
      getters: true,
    }),
  });
};

const updateReview = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { rating, comment } = req.body;
  const reviewId = req.params.rid;

  let review;

  try {
    review = await Review.findById(reviewId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update review.", 500),
    );
  }

  if (!review) {
    return next(new HttpError("Could not find review for this id.", 404));
  }

  review.rating = rating;
  review.comment = comment;

  try {
    await review.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update review.", 500),
    );
  }

  res.status(200).json({
    review: review.toObject({
      getters: true,
    }),
  });
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.rid;

  let review;

  try {
    review = await Review.findById(reviewId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete review.", 500),
    );
  }

  if (!review) {
    return next(new HttpError("Could not find review for this id.", 404));
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await review.deleteOne({
      session: sess,
    });

    review.creator.reviews.pull(review);

    await review.creator.save({
      session: sess,
    });

    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete review.", 500),
    );
  }

  res.status(200).json({
    message: "Deleted review.",
  });
};

exports.createReview = createReview;
exports.getReviewById = getReviewById;
exports.getReviewsByBookId = getReviewsByBookId;
exports.getReviewsByUserId = getReviewsByUserId;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
