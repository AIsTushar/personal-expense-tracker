import multer from "multer";
import { fileFilter } from "./fileFilter";

// Use memory storage for uploading to DigitalOcean
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
});
