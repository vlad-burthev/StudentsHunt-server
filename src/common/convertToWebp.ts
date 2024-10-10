import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export class ConvertToWebp {
  private static uploadDir = path.join('src', '..', 'uploads');
  private static avatarDir = path.join(this.uploadDir, 'avatars');
  private static imagesDir = path.join(this.uploadDir, 'images');

  private static avatarName = '';
  private static imageNames: string[] = [];

  static async convertAvatar(res: Response, avatar: Express.Multer.File) {
    try {
      console.log(this.avatarDir, this.imagesDir);

      this.avatarName = uuidv4() + '.webp';
      const avatarPath = path.join(this.avatarDir, this.avatarName);

      // Конвертация в WebP + Сохранение
      await sharp(avatar[0].buffer).webp({ quality: 80 }).toFile(avatarPath);
      return this.avatarName;
    } catch (err) {
      throw Error(err);
    }
  }

  static async convertImages(images: Express.Multer.File[]) {
    for (const image of images) {
      try {
        const imageName = uuidv4() + '.webp';
        const imagePath = path.join(this.imagesDir, imageName);

        // Конвертация в WebP + Сохранение
        await sharp(image.buffer).webp({ quality: 80 }).toFile(imagePath);

        this.imageNames.push(imageName);
      } catch (err) {
        throw Error(err);
      }
    }
    return this.imageNames;
  }

  static async deleteImages(avatar: string, images: [string]) {
    fs.unlink(`${this.avatarDir}/${avatar}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('File does not exist.');
        } else {
          throw err;
        }
      } else {
        console.log('File deleted!');
      }
    });
    for (let image of images) {
      fs.unlink(`${this.imagesDir}/${image}`, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.error('File does not exist.');
          } else {
            throw err;
          }
        } else {
          console.log('File deleted!');
        }
      });
    }
  }
}
