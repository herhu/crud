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
  findOne(@Param() params: IdDto): Promise<string> {
    return this.secretNoteService.findOne(params);
  }

  @Get(':id/encrypted')
  findOneEncrypted(@Param() params: IdDto): Promise<SecretNote> {
    return this.secretNoteService.findOneEncrypted(params);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSecretNoteDto: UpdateSecretNoteDto): Promise<SecretNote> {
    const idDto: IdDto = { id: parseInt(id, 10) };
    return this.secretNoteService.update(idDto, updateSecretNoteDto);
  }

  @Delete(':id')
  remove(@Param() params: IdDto): Promise<void> {
    return this.secretNoteService.remove(params);
  }
}
