let { getBooks, getBookById, getReviews, gerReviewById } = require('./book.js');
const express = require('express');
const app = express();
app.use(express.json);

app.get('/api/books', async (req, res) => {
  try {
    let books = await getBooks();
    if (books.length === 0) {
      return res.status4(404).json({ message: 'No books found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let book = await getBookById(id);
    if (book.length === 0) {
      return res.status(404).json({ message: 'No book found with this id' });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    let allReviews = await getReviews();
    if (allReviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    return res.status(200).json(allReviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let review = await gerReviewById(id);
    if (review.length === 0) {
      return res
        .status(404)
        .json({ message: 'No review found with this id', id });
    }
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = { app };
