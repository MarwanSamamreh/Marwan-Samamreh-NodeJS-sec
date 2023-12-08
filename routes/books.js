const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const pug = require("pug");

const booksFile = path.join(__dirname, "../books/books.json");
const viewsPath = path.join(__dirname, "../views");

// GET all books
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(booksFile, "utf8");
    const books = JSON.parse(data);

    const renderBooks = pug.compileFile(path.join(viewsPath, "books.pug"));

    const html = renderBooks({ books });

    res.setHeader("Content-Type", "text/html");

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET book by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await fs.readFile(booksFile, "utf8");
    const books = JSON.parse(data);
    const book = books.find((b) => b.id === Number(id));

    if (!book) {
      res.status(404).send("Book not found");
      return;
    }

    const renderBookDetails = pug.compileFile(
      path.join(viewsPath, "bookDetails.pug")
    );

    const html = renderBookDetails({ book });

    res.setHeader("Content-Type", "text/html");

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// POST a new book
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Book name is required.");
  }

  try {
    let books = [];

    const fileExists = await fs
      .access(booksFile)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const data = await fs.readFile(booksFile, "utf8");
      books = JSON.parse(data);
    }

    const newId =
      books.reduce((maxId, book) => Math.max(maxId, book.id), 0) + 1;

    const newBook = {
      id: newId,
      name,
    };

    books.push(newBook);
    await fs.writeFile(booksFile, JSON.stringify(books, null, 2), "utf8");
    console.log("Book added successfully:", newBook);
    res.status(201).send("Book added successfully.");
  } catch (err) {
    console.error("Error reading or parsing books.json:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
