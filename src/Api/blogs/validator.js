import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: { errorMessage: "Category is a mandatory field." },
  },
  author: {
    name: {
      in: ["body.author"],
      isString: {
        errorMessage:
          "Author name is a mandatory field and needs to be a String.",
      },
    },
  },
};

export const checksBooksSchema = checkSchema(blogSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during blog validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
