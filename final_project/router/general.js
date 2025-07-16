const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Register the new user
  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];

  bookKeys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get all books using async callback function
function getAllBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(books);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

// Task 11: Get book by ISBN using Promises
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });
}

// Task 12: Get books by Author using async-await
async function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const bookKeys = Object.keys(books);
        const booksByAuthor = [];
        
        bookKeys.forEach(key => {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        });
        
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("No books found by this author"));
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

// Task 13: Get books by Title using async-await
async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const bookKeys = Object.keys(books);
        const booksByTitle = [];
        
        bookKeys.forEach(key => {
          if (books[key].title === title) {
            booksByTitle.push(books[key]);
          }
        });
        
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("No books found with this title"));
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

// Test routes for async/await and Promise functions

// Task 10: Get all books using async callback
public_users.get('/async/books', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

// Task 11: Get book by ISBN using Promises
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  
  getBookByISBN(isbn)
    .then(book => {
      return res.status(200).json(book);
    })
    .catch(error => {
      return res.status(404).json({message: error.message});
    });
});

// Task 12: Get books by Author using async-await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 13: Get books by Title using async-await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
