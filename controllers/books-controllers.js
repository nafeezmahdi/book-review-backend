const Book = require("../models/book");
const HttpError = require("../models/http-error");

const getBooks = async (req, res, next) => {
  let books;

  try {
    books = await Book.find();
  } catch (err) {
    return next(new HttpError("Fetching books failed.", 500));
  }

  res.json({
    books: books.map((book) => book.toObject({ getters: true })),
  });
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;

  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find book.", 500),
    );
  }

  if (!book) {
    return next(new HttpError("Could not find book for this id.", 404));
  }

  res.json({
    book: book.toObject({ getters: true }),
  });
};

const createBook = async (req, res, next) => {
  const { title, author, genre, description, image } = req.body;

  const createdBook = new Book({
    title,
    author,
    genre,
    description,
    image,
  });

  try {
    await createdBook.save();
  } catch (err) {
    return next(new HttpError("Creating book failed.", 500));
  }

  res.status(201).json({
    book: createdBook.toObject({ getters: true }),
  });
};

const updateBook = async (req, res, next) => {
  const { title, author, genre, description, image } = req.body;

  const bookId = req.params.bid;

  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update book.", 500),
    );
  }

  if (!book) {
    return next(new HttpError("Could not find book for this id.", 404));
  }

  book.title = title;
  book.author = author;
  book.genre = genre;
  book.description = description;
  book.image = image;

  try {
    await book.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update book.", 500),
    );
  }

  res.status(200).json({
    book: book.toObject({ getters: true }),
  });
};

const deleteBook = async (req, res, next) => {
  const bookId = req.params.bid;

  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete book.", 500),
    );
  }

  if (!book) {
    return next(new HttpError("Could not find book for this id.", 404));
  }

  try {
    await book.deleteOne();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete book.", 500),
    );
  }

  res.status(200).json({
    message: "Deleted book.",
  });
};

exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
