import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const bookSchema = {
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

export const checksBooksSchema = checkSchema(bookSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    // 2.1 If we have any error --> trigger error handler 400
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    // 2.2 Else (no errors) --> normal flow (next)
    next();
  }
};
