import express from "express";
import multer from "multer";
import { pipeline } from "stream";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  getBlog,
  writeBlogs,
  saveCoverImages,
  getBlogPostsJsonReadableStream,
} from "../../lib/fs-tools.js";
import json2csv from "json2csv";

const filesRouter = express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "BlogMartket",
    },
  }),
}).single("cover");

filesRouter.post(
  "/:blogpostId/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      // const originalFileExtension = extname(req.file.originalname);
      // const fileName = req.params.blogpostId + originalFileExtension;
      // console.log("this is filename", fileName);
      // await saveCoverImages(fileName, req.file.buffer);

      // const url = `http://localhost:3001/img/users/${fileName}`;

      console.log(req.file);
      const url = req.file.path;
      const blogs = await getBlog();
      const index = blogs.findIndex(
        (blog) => blog.id === req.params.blogpostId
      );
      //   updating the blog cover
      if (index !== -1) {
        const oldBlog = blogs[index];
        // const coverUpdate = { ...oldBlog, cover: url }
        const updatedBlog = { ...oldBlog, cover: url, updatedAt: new Date() };
        blogs[index] = updatedBlog;
        await writeBlogs(blogs);
      }
      res.send("Cover image updated");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/:id/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=blog.pdf");

  const { id } = req.params;
  const posts = await getBlog();
  console.log("this is pdf", posts);

  const postSelected = posts.find((post) => post.id === id);
  console.log("selectedPost", postSelected);
  if (postSelected !== null) {
    res.setHeader("Content-Disposition", "attachment; blog.pdf");
    const source = getPDFReadableStream(postSelected);
    // console.log("source", source);
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } else {
    console.log(`There is no blog post with this id: ${id}`);
  }
});

filesRouter.get("/blogPostCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogPosts.csv");
    const source = getBlogPostsJsonReadableStream();
    const transform = new json2csv.Transform({
      fields: ["title", "category", "id"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
