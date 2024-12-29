// we will write the test using jest so insall it using npm install --save-dev jest
const { getBooks, getBookById, addBooK } = require('../book');
describe('Book Function', () => {
  it('should get all book', () => {
    let books = getBooks();
    expect(books.length).toBe(4);
    expect(books).toEqual([
      { id: 1, title: '1984', author: 'George Orwell' },
      { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
      { id: 4, title: 'To Kill a Mokingbird', author: 'Harper Lee' },
    ]);
  });

  it('should retun a book by id', () => {
    let book = getBookById(1);
    expect(book).toEqual({ id: 1, title: '1984', author: 'George Orwell' });
  });

  it('should return undefined for book id that does not exist', () => {
    let book = getBookById(199);
    expect(book).toBeUndefined();
  });

  it('should add a new book', () => {
    let newBook = { id: 5, title: 'New Title', author: 'F.S. Home' };
    let newBookAdded = addBooK(newBook);
    expect(newBook).toEqual({
      id: 5,
      title: 'New Title',
      author: 'F.S. Home',
    });
    const lenOfBooks = getBooks().length;
    expect(lenOfBooks).toBe(5);
  });
});
