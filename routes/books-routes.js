const express = require("express");
const booksControllers = require("../controllers/books-controllers");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Get all books",
  });
});

router.get("/", booksControllers.getBooks);
router.post("/", booksControllers.createBook);

module.exports = router;
