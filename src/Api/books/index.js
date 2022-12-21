import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksBooksSchema, triggerBadRequest } from "./validator.js";

const bookRouter = express.Router();

const bookJsonPath = join(dirname(fileURLToPath(import.meta.url)), "book.json");
const getBooks = () => JSON.parse(fs.readFileSync(bookJsonPath));
const writeBooks = (arryOfBlofs) =>
  fs.writeFileSync(bookJsonPath, JSON.stringify(arryOfBlofs));

bookRouter.post(
  "/",
  checksBooksSchema,
  triggerBadRequest,
  (request, response) => {
    try {
      const newBlogs = {
        ...request.body,
        // author: {
        //   name: request.body.value,
        //   avatar: `https://ui-avatars.com/api/?name=${request.body.author.name}`,
        // },
        id: uniqid(),
        createAt: new Date(),
      };
      const arryOfBlofs = getBooks();
      arryOfBlofs.push(newBlogs);
      writeBooks(arryOfBlofs);
      response.status(201).send({ id: newBlogs.id });
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.get("/", (request, response) => {
  const arryOfBlofs = getBooks();
  const filterBooks = arryOfBlofs.filter(
    (blogs) => blogs.category === request.query.category
  );
  response.send(arryOfBlofs);
});
bookRouter.get("/:blogpostId", (request, response) => {
  const books = getBooks();
  const book = books.find((book) => book.id === request.params.blogpostId);
  response.send(book);
});

bookRouter.put("/:blogpostId", (request, response) => {
  const books = getBooks();
  const indexOfBooks = books.find(
    (book) => book.id === request.params.blogpostId
  );
  const existingBook = books[indexOfBooks];
  const updateBooks = {
    ...existingBook,
    ...request.body,
    updatedAt: new Date(),
  };
  books[indexOfBooks] = updateBooks;
  response.send(updateBooks);
});

bookRouter.delete("/:blogpostId", (request, response) => {
  const books = getBooks();
  const remainingBooks = books.filter(
    (book) => book.id !== request.params.blogpostId
  );
  writeBooks(remainingBooks);
  response.status(205).send();
});

export default bookRouter;
