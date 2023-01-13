import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/users");
console.log("this is the datafolder", dataFolderPath);

const blogJsonPath = join(dataFolderPath, "blog.json");
console.log("this is blogjospath", blogJsonPath);

export const getBlog = () => readJSON(blogJsonPath);
export const writeBlogs = (arryOfBlofs) => writeJSON(blogJsonPath, arryOfBlofs);

export const saveCoverImages = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const getBlogPostsJsonReadableStream = () =>
  createReadStream(blogJsonPath);
export const getPDFWritableStream = (filename) =>
  createWriteStream(join(dataFolderPath, filename));
