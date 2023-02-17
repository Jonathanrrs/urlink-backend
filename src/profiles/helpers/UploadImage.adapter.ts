import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'node:fs';
export class UploadImage {
  async upload(file: Express.Multer.File) {
    cloudinary.config({
      secure: true,
      api_key: process.env.CLOUDINARY_KEY,
      cloud_name: process.env.CLOUDINARY_NAME,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const upload = await cloudinary.uploader.upload(file.path, options);
      return upload;
    } catch (error) {
      throw new Error('There a error');
    }
  }

  async deleteFromFileSystem(file: Express.Multer.File) {
    try {
      await unlinkSync(file.path);
    } catch (error) {
      console.log(error);
    }
  }
}
