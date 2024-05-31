import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SecretNoteService } from './secret-note.service';
import { SecretNote } from './secret-note.entity';

@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  create(@Body('note') note: string): Promise<SecretNote> {
    return this.secretNoteService.create(note);
  }

  @Get()
  findAll(): Promise<Partial<SecretNote>[]> {
    return this.secretNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<string> {
    return this.secretNoteService.findOne(+id);
  }

  @Get(':id/encrypted')
  findOneEncrypted(@Param('id') id: string): Promise<SecretNote> {
    return this.secretNoteService.findOneEncrypted(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('note') note: string): Promise<SecretNote> {
    return this.secretNoteService.update(+id, note);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.secretNoteService.remove(+id);
  }
}
