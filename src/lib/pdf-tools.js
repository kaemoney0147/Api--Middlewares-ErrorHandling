import PdfPrinter from "pdfmake";
import { getPDFWritableStream } from "./fs-tools.js";
import { pipeline } from "stream";
import { promisify } from "util";

export const getPDFReadableStream = (postsArray) => {
  // Define font files
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [postsArray.title, postsArray.author.name, postsArray.category],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};

export const asyncPDFGeneration = async (postsArray) => {
  const source = getPDFReadableStream(postsArray);
  const destination = getPDFWritableStream("test.pdf");

  // normally pipeline function works with callbacks to tell when the stream is ended, we shall avoid using callbacks
  // pipeline(source, destination, err => {}) <-- BAD (callback based pipeline)
  // await pipeline(source, destination) <-- GOOD (promise based pipeline)

  // promisify is a (VERY COOL) tool that turns a callback based function (err first callback) into a promise based function
  // since pipeline is an error first callback based function --> we can turn pipeline into a promise based pipeline

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
