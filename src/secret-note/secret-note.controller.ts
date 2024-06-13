import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SecretNoteService } from './secret-note.service';
import { SecretNote } from './secret-note.entity';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { CreateSecretNoteDto, UpdateSecretNoteDto, IdDto } from './dto';

@ApiTags('secret-notes')
@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiBasicAuth()
  create(
    @Body() createSecretNoteDto: CreateSecretNoteDto,
  ): Promise<SecretNote> {
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
  update(
    @Param('id') id: string,
    @Body() updateSecretNoteDto: UpdateSecretNoteDto,
  ): Promise<SecretNote> {
    const idDto: IdDto = { id: parseInt(id, 10) };
    return this.secretNoteService.update(idDto, updateSecretNoteDto);
  }

  @Delete(':id')
  remove(@Param() params: IdDto): Promise<{message: string}> {
    return this.secretNoteService.remove(params);
  }
}
