const express = require("express");
const mongoose = require("mongoose");
const booksRoutes = require("./routes/books-routes");
const usersRoutes = require("./routes/users-routes");
const reviewsRoutes = require("./routes/reviews-routes");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Book Review API is working!",
  });
});

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running and MongoDB connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
