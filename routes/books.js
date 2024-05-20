const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./books.json");

const readBooks = () => {
    const booksData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(booksData);
};

const saveBooks = (books) => {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2), "utf8");
};

// GET /books
router.get("/", (req, res) => {
    const books = readBooks();
    res.json(books);
});

// GET /books/:id
router.get("/:id", (req, res) => {
    const books = readBooks();
    const book = books.find((book) => book.id == req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Kitob topilmadi" });
    }
});

// POST /books
router.post("/", (req, res) => {
    const books = readBooks();
    const { title, author } = req.body;
    if (books.find((book) => book.title === title)) {
        res.status(400).json({ message: "Bu nomdagi kitob mavjud" });
        return;
    }
    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author,
    };
    books.push(newBook);
    saveBooks(books);
    res.status(200).json(newBook);
});

// PUT /books/:id
router.put("/:id", (req, res) => {
    const books = readBooks();
    const bookIndex = books.findIndex((book) => book.id == req.params.id);
    if (bookIndex !== -1) {
        const { title, author } = req.body;
        books[bookIndex] = { id: parseInt(req.params.id), title, author };
        saveBooks(books);
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: "Kitob topilmadi" });
    }
});

// DELETE /books/:id
router.delete("/:id", (req, res) => {
    const books = readBooks();
    const bookIndex = books.findIndex((book) => book.id == req.params.id);
    if (bookIndex !== -1) {
        const deleteBook = books.splice(bookIndex, 1);
        saveBooks(books);
        res.json(deleteBook[0]);
    } else {
        res.status(404).json({ message: "Kitob topilmadi" });
    }
});

module.exports = router;
