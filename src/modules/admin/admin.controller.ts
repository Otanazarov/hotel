import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FindAllAdminQueryDto } from './dto/findAll-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @DecoratorWrapper('Register Admin')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  @DecoratorWrapper('Admin Login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Post('refresh')
  @DecoratorWrapper('Refresh Admin Token')
  refresh(@Body() refreshAdminDto: RefreshAdminDto) {
    return this.adminService.refresh(refreshAdminDto);
  }

  @Post('logout')
  @DecoratorWrapper('Admin Logout', true, [Role.Admin])
  logout(@Req() req: any) {
    return this.adminService.logout(req.user.id);
  }

  @Get()
  @DecoratorWrapper('Get All Admins', true, [Role.Admin])
  findAll(@Query() query: FindAllAdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  @DecoratorWrapper('Get Admin by ID', true, [Role.Admin])
  findOne(@Param('id',ParseIntPipe) id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Admin', true, [Role.Admin])
  update(
    @Param('id',ParseIntPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: any,
  ) {
    return this.adminService.update(+id, updateAdminDto, req.user.id);
  }

  // @Delete(':id')
  // @DecoratorWrapper('Delete Admin', true, [Role.Admin])
  // remove(@Param('id',ParseIntPipe) id: string) {
  //   return this.adminService.remove(+id);
  // }
}
