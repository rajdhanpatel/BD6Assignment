let books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: 4, title: 'To Kill a Mokingbird', author: 'Harper Lee' },
];

let reviews = [{ id: 1, bookId: 1, content: 'Great Writing!' }];

function getBooks() {
  // return complete books array of objects
  return books;
}
function getBookById(id) {
  return books.find((book) => book.id === id);
}

function getReviews() {
  return reviews;
}

function gerReviewById(id) {
  return reviews.find((review) => review.id === id);
}
module.exports = { getBooks, getBookById, getReviews, gerReviewById };
