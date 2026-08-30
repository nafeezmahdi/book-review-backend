const express = require("express");

const { check } = require("express-validator");

const reviewsControllers = require("../controllers/reviews-controllers");

const router = express.Router();

router.get("/book/:bid", reviewsControllers.getReviewsByBookId);

router.get("/user/:uid", reviewsControllers.getReviewsByUserId);

router.get("/:rid", reviewsControllers.getReviewById);

router.post(
  "/",
  [
    check("rating").isInt({ min: 1, max: 5 }),
    check("comment").isLength({ min: 3 }),
  ],
  reviewsControllers.createReview,
);

router.patch(
  "/:rid",
  [
    check("rating").isInt({ min: 1, max: 5 }),
    check("comment").isLength({ min: 3 }),
  ],
  reviewsControllers.updateReview,
);

router.delete("/:rid", reviewsControllers.deleteReview);

module.exports = router;
