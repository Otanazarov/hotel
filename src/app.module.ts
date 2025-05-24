import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AdminModule, PrismaModule],
})
export class AppModule {}
