const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let authors = [
  { authorId: 1, name: 'George Orwell', book: '1984' },
  { authorId: 2, name: 'Aldous Huxley', book: 'Brave New World' },
  { authorId: 3, name: 'Ray Bradbury', book: 'Fahrenheit 451' },
];

function getAuthors() {
  return authors;
}
app.get('/authors', (req, res) => {
  res.json(getAuthors());
});

function getAuthorById(id) {
  return authors.find((obj) => obj.authorId === id);
}
app.get('/authors/details/:id', (req, res) => {
  let id = req.params.id;
  let author = getAuthorById(id);
  if (author) res.status(201).json(author);
  else res.status(404).json({ message: 'No author found with this id' });
});

function addAuthor(author) {
  authors.push(author);
  return author;
}
app.post('/authors/new', (req, res) => {
  let authorId = req.query.id;
  let name = req.query.name;
  let book = req.query.book;
  let addedAuthor = addAuthor({ authorId, name, book });
  res.status(201).json(addedAuthor);
});

module.exports = { app, getAuthors, getAuthorById, addAuthor };
