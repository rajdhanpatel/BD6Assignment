let books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: 4, title: 'To Kill a Mokingbird', author: 'Harper Lee' },
];

function getBooks() {
  // return complete books array of objects
  return books;
}
function getBookById(id) {
  return books.find((book) => book.id === id);
}

function addBooK(newBookObj) {
  // we will push the book object in books array of obj with next unique id
  let newBookwithId = { id: books.length + 1, ...newBookObj };
  books.push(newBookwithId);
  return books;
}

module.exports = { getBooks, getBookById, addBooK };
