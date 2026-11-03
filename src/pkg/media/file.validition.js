import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { AppError } from "../../lib/error/error.js";

export const allowedFields= {
    images: ['image/jpeg', 'image/png', 'image/jpg'],
    files: ['application/pdf', 'application/msword'],
    videos: ['video/mp4'],
    audios: ['audio/mp3']
}


// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (allowedTypes = allowedFields.images) =>
async (req, res, next) => {
    try {

      if(req.file.size > 5 * 1024 * 1024) { // 5MB limit
          return next(new AppError("File size exceeds 5MB limit", 400));
      }
      // get the file path
      const filePath = req.file.path;
    // read the file and return buffer
      const buffer = fs.readFileSync(filePath);
    // get the file type
      const type = await fileTypeFromBuffer(buffer);
    // validate
      if (!type || !allowedTypes.includes(type.mime)){
        fs.unlinkSync(filePath); // delete the file if invalid
        return next(new AppError("Invalid file type", 400));
      }

      return next();
  } catch (error) {
    return next(new AppError("Internal server error", 500));
  }
};