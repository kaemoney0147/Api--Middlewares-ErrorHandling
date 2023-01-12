import PdfPrinter from "pdfmake";

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
