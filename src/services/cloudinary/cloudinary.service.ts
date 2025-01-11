import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { EResourceType } from 'src/interface';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    dir: string,
    resourceType: EResourceType,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: dir, // Папка, куда сохраняются изображения
            resource_type: resourceType, // Тип ресурса (image)
          },
          (error, result) => {
            if (error) {
              reject(new Error('Ошибка загрузки на Cloudinary'));
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer); // Передача буфера в Cloudinary
    });
  }

  getOptimizedImageUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      width: 400,
      height: 400,
      crop: 'fill', // Оптимизация размера изображения
      quality: 'auto', // Автоматическое качество
    });
  }
}
