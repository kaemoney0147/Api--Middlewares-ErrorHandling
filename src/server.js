import bookRouter from "./Api/blogs/index.js";
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import filesRouter from "./Api/files/index.js";
import { join } from "path";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT;
const publicFolderPath = join(process.cwd(), "./public");

const middLeware = (request, respose, next) => {
  console.log(
    `Request method ${request.method} -- url ${request.url} -- ${new Date()}`
  );
  next();
};
const urlList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || urlList.indexOf(origin) !== -1) {
      // If current origin is in the urlList you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};
server.use(express.static(publicFolderPath));
server.use(cors(corsOpts));
server.use(middLeware);
server.use(express.json());
/// endpoints
server.use("/blogpost", middLeware, bookRouter);
server.use("/blogpost", middLeware, filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("I am working on port", port);
});
