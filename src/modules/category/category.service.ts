import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { FindAllCategoryQueryDto } from './dto/findAll-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const categoryName = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (categoryName) {
      throw HttpError({ code: 'Category already exists' });
    }
    const category = await this.prisma.category.create({
      data: { name: createCategoryDto.name },
    });
    return category;
  }

  async findAll(dto: FindAllCategoryQueryDto) {
    const { limit = 10, page = 1, name } = dto;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: {
          name: {
            contains: name?.trim() || '',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.category.count({
        where: {
          name: {
            contains: name?.trim() || '',
          },
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

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw HttpError({ code: 'Category not found' });
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw HttpError({ code: 'Category not found' });
    }
    return await this.prisma.category.update({
      where: { id },
      data: { name: updateCategoryDto.name || category.name },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw HttpError({ code: 'Category not found' });
    }
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
