import express from "express";
import multer from "multer";
import { extname } from "path";
import { getBlog, writeBlogs, saveCoverImages } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:blogpostId/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.blogpostId + originalFileExtension;
      console.log("this is filename", fileName);
      await saveCoverImages(fileName, req.file.buffer);
      //   url to use for the mew image
      const url = `http://localhost:3001/img/users/${fileName}`;

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

export default filesRouter;
