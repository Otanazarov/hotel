import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FindAllRoomQueryDto } from './dto/findAll-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @DecoratorWrapper('Create Room', true, [Role.Admin])
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
      },
      fileFilter: (req, file, cb) => {
        // Faqat rasm fayllarini qabul qilish
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  )
  create(
    @Body() createFormDto: CreateRoomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomsService.create(createFormDto, files || []);
  }

  @Get()
  @DecoratorWrapper('Find All Rooms')
  findAll(@Query() dto: FindAllRoomQueryDto) {
    return this.roomsService.findAll(dto);
  }

  @Get(':id')
  @DecoratorWrapper('Get Room by ID')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Room', true, [Role.Admin])
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, 
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomsService.update(+id, updateRoomDto, files || []);
  } 

  @Delete(':id')
  @DecoratorWrapper('Delete Room', true, [Role.Admin])
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.roomsService.remove(+id);
  }
}
