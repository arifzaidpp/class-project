import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class AdminModule {}

