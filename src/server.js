import bookRouter from "./Api/books/index.js";
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();
const port = 3001;

const middLeware = (request, respose, next) => {
  console.log(
    `Request method ${request.method} -- url ${request.url} -- ${new Date()}`
  );
  next();
};

server.use(cors());
server.use(middLeware);
server.use(express.json());

server.use("/blogpost", middLeware, bookRouter);

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("I am working on port", port);
});
