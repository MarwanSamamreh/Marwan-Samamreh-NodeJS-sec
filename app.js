const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const booksRouter = require("./routes/books");
app.use("/books", booksRouter);

app.get("/", (req, res) => {
  res.render("homePage");
});

app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500 - Internal Server Error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
