import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { HttpError } from 'src/common/exception/http.error';
import { FindAllRoomQueryDto } from './dto/findAll-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto, files: Express.Multer.File[]) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw HttpError({ code: 'Category not found' });
    }
    let imageUrls: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueName + path.extname(file.originalname);
        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          'rooms',
          filename,
        );

        // uploads/rooms papkasini tekshirib, yo‘q bo‘lsa yaratish
        const dir = path.dirname(uploadPath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        try {
          // Faylni diskka yozish
          fs.writeFileSync(uploadPath, file.buffer);
        } catch (error) {
          throw HttpError({ 
            code: 'FILE_UPLOAD_FAILED', 
            message: `Failed to save file: ${filename}`,
          });
        }

        imageUrls.push(`/uploads/rooms/${filename}`);
      }
    }
    const room = await this.prisma.room.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        amenities: dto.amenities,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });
    return room;
  }

  async findAll(dto: FindAllRoomQueryDto) {
    {
      const { limit = 10, page = 1, title, categoryId } = dto;

      const [data, total] = await this.prisma.$transaction([
        this.prisma.room.findMany({
          where: {
            title: {
              contains: title?.trim() || '',
            },
            categoryId: categoryId ? Number(categoryId) : undefined,
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            images: true,
            category: true, // Agar kategoriya ma'lumotlarini ham olish kerak bo'lsa
          },
        }),
        this.prisma.room.count({
          where: {
            title: {
              contains: title?.trim() || '',
            },
            categoryId: categoryId ? Number(categoryId) : undefined,
          },
        }),
      ]);

      return {
        total,
        page,
        limit,
        data,
      };
    }
  }
  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        images: true, // Agar rasm ma'lumotlarini ham olish kerak bo'lsa
        category: true, // Agar kategoriya ma'lumotlarini ham olish kerak bo'lsa
      },
    });
    if (!room) {
      throw HttpError({ code: 'Room not found' });
    }
    return room;
  }

  async update(id: number, dto: UpdateRoomDto, files: Express.Multer.File[]) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { images: true }, // kerak bo‘lsa qo‘shamiz
    });
  
    if (!room) {
      throw HttpError({ code: 'Room not found' });
    }
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw HttpError({ code: 'Category not found' });
      }
    }
    if (dto.deleteImages && dto.deleteImages.length > 0) {
      for (const imageId of dto.deleteImages) {
        const image = await this.prisma.image.findUnique({
          where: { id: imageId },
        });
  
        if (!image) {
          throw HttpError({ code: `Image with id ${imageId} not found` });
        }
  
        const imagePath = path.join(process.cwd(), image.url); 
  
        try {
          fs.unlinkSync(imagePath);
        } catch (e) {
          console.warn(`Failed to delete file: ${imagePath}`);
        }
  
        await this.prisma.image.delete({
          where: { id: imageId },
        });
      }
    }
    let imageUrls: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueName + path.extname(file.originalname);
        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          'rooms',
          filename,
        );

        // uploads/rooms papkasini tekshirib, yo‘q bo‘lsa yaratish
        const dir = path.dirname(uploadPath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        try {
          // Faylni diskka yozish
          fs.writeFileSync(uploadPath, file.buffer);
        } catch (error) {
          throw new Error(`Failed to save file: ${filename}`);
        }

        imageUrls.push(`/uploads/rooms/${filename}`);
      }
    }
  
    const updatedRoom = await this.prisma.room.update({
      where: { id },
      data: {
        title: dto.title ?? room.title,
        description: dto.description ?? room.description,
        price: dto.price ?? room.price,
        categoryId: dto.categoryId ?? room.categoryId,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
        amenities: dto.amenities ?? room.amenities,
      },
      include: {
        images: true,
      },
    });
  
    return updatedRoom;
  }
  
  async remove(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        images: true, 
      },
    });
    if (!room) {    
      throw HttpError({ code: 'Room not found' });
    }


    for (const image of room.images) {
      const imagePath = path.join(process.cwd(), image.url);
      try {
        fs.unlinkSync(imagePath);
      } catch (e) {
        console.warn(`Failed to delete file: ${imagePath}`);
      }
    }


    await this.prisma.room.delete({
      where: { id },
    });
  }
}
