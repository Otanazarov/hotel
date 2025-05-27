import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoryQueryDto } from './dto/findAll-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @DecoratorWrapper('Create Category', true, [Role.Admin])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @DecoratorWrapper('Get All Categories')
  findAll(@Query() dto: FindAllCategoryQueryDto) {
    return this.categoryService.findAll(dto);
  }

  @Get(':id')
  @DecoratorWrapper('Get Category by ID')
  findOne(@Param('id',ParseIntPipe) id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Category', true, [Role.Admin])
  update(
    @Param('id',ParseIntPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @DecoratorWrapper('Delete Category', true, [Role.Admin])
  @ApiOperation({
    description: '🛑 Ogohlantirish: Ushbu kategoriya o‘chirilganda, unga biriktirilgan barcha xonalar (rooms) ham avtomatik ravishda o‘chiriladi.',
  })
  remove(@Param('id',ParseIntPipe) id: string) {
    return this.categoryService.remove(+id);
  }
}
