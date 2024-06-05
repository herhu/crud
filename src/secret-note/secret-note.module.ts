import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretNoteService } from './secret-note.service';
import { EccService } from '../ecc/ecc.service';
import { SecretNoteController } from './secret-note.controller';
import { SecretNote } from './secret-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecretNote])],
  providers: [SecretNoteService, EccService],
  controllers: [SecretNoteController],
})
export class SecretNoteModule {}
