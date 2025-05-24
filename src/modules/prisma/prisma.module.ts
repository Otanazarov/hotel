import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // bu bilan har qanday module ichida import qilmasdan ishlatish mumkin
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
