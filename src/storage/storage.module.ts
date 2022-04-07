import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  imports: [ConfigModule],
  exports: [ StorageService ]
})
export class StorageModule {}
