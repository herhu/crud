import { Module } from '@nestjs/common';
import { SecretNoteService } from './secret-note.service';
import { SecretNoteController } from './secret-note.controller';

@Module({
  providers: [SecretNoteService],
  controllers: [SecretNoteController]
})
export class SecretNoteModule {}
