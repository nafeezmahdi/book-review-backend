const Book = require("../models/book");
const HttpError = require("../models/http-error");

const getBooks = async (req, res, next) => {
  let books;

  try {
    books = await Book.find();
  } catch (err) {
    return next(new HttpError(`Fetching books failed`, 500));
  }

  res.json({
    books: books.map((book) => book.toObject({ getters: true })),
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

exports.getBooks = getBooks;
exports.createBook = createBook;
