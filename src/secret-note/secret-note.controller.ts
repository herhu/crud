import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SecretNoteService } from './secret-note.service';
import { SecretNote } from './secret-note.entity';
import { CreateSecretNoteDto, UpdateSecretNoteDto, IdDto } from './dto';

@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  create(@Body() createSecretNoteDto: CreateSecretNoteDto): Promise<SecretNote> {
    return this.secretNoteService.create(createSecretNoteDto);
  }

  @Get()
  findAll(): Promise<Partial<SecretNote>[]> {
    return this.secretNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<string> {
    return this.secretNoteService.findOne({ id });
  }

  @Get(':id/encrypted')
  findOneEncrypted(@Param('id') id: number): Promise<SecretNote> {
    return this.secretNoteService.findOneEncrypted({ id });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateSecretNoteDto: UpdateSecretNoteDto): Promise<SecretNote> {
    return this.secretNoteService.update({ id }, updateSecretNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.secretNoteService.remove({ id });
  }
}
