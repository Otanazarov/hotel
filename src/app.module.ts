import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CategoryModule } from './modules/category/category.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AdminModule, PrismaModule, CategoryModule, RoomsModule],
})
export class AppModule {}
