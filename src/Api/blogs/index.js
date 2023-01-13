import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { getBlog, writeBlogs } from "../../lib/fs-tools.js";
import { checksBooksSchema, triggerBadRequest } from "./validator.js";
import { sendRegistrationEmail } from "../../lib/email-tools.js";

const bookRouter = express.Router();
const { NotFound, Unauthorized, BadRequest } = httpErrors;

bookRouter.post(
  "/",
  // checksBooksSchema,
  triggerBadRequest,
  async (request, response, next) => {
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
      const arryOfBlofs = await getBlog();
      arryOfBlofs.push(newBlogs);
      writeBlogs(arryOfBlofs);
      sendRegistrationEmail(request.body.author.email);
      response.status(201).send({ id: newBlogs.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
bookRouter.get("/", async (request, response) => {
  try {
    const arryOfBlofs = await getBlog();
    const filterBooks = arryOfBlofs.filter(
      (blogs) => blogs.category === request.query.category
    );
    response.send(arryOfBlofs);
  } catch (error) {}
});
bookRouter.get("/:blogpostId", async (request, response, next) => {
  try {
    const blogs = await getBlog();
    const blog = blogs.find((blog) => blog.id === request.params.blogpostId);
    if (blog) {
      response.send(blog);
    } else {
      next(
        NotFound(
          `blogs with search id  ${request.params.blogpostId} is not found!`
        )
      );
    }
  } catch (error) {}
});

bookRouter.put("/:blogpostId", async (request, response) => {
  const blogs = await getBlog();
  const indexOfBooks = blogs.find(
    (blog) => blog.id === request.params.blogpostId
  );
  const existingBook = blogs[indexOfBooks];
  const updateBooks = {
    ...existingBook,
    ...request.body,
    updatedAt: new Date(),
  };
  blogs[indexOfBooks] = updateBooks;
  writeBlogs(blogs);
  response.send(updateBooks);
});

bookRouter.delete("/:blogpostId", (request, response) => {
  const blogs = getBlog();
  const remainingBlogs = blogs.filter(
    (blog) => blog.id !== request.params.blogpostId
  );
  writeBlogs(remainingBlogs);
  response.status(205).send();
});

export default bookRouter;
