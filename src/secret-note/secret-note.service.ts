import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './secret-note.entity';
import { EccService } from '../ecc/ecc.service';
import { CreateSecretNoteDto, UpdateSecretNoteDto, IdDto } from './dto';
import { SecretNoteNotFoundException, InvalidSecretNoteException } from '../exceptions/custom-exceptions';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private secretNoteRepository: Repository<SecretNote>,
    private readonly eccService: EccService,
  ) {}

  async create(createSecretNoteDto: CreateSecretNoteDto): Promise<SecretNote> {
    if (!createSecretNoteDto.note) {
      throw new InvalidSecretNoteException();
    }
    try {
      const encryptedData = this.eccService.encrypt(createSecretNoteDto.note);
      const newNote = this.secretNoteRepository.create({
        note: encryptedData,
        ephemeralPublicKey: this.eccService.predefinedPublicKey,
      });
      return await this.secretNoteRepository.save(newNote);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  async findAll(): Promise<Partial<SecretNote>[]> {
    try {
      const notes = await this.secretNoteRepository.find();
      return notes.map((note) => ({ id: note.id, createdAt: note.createdAt }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve notes');
    }
  }

  async findOne(idDto: IdDto): Promise<string> {
    const { id } = idDto;
    try {
      const note = await this.secretNoteRepository.findOne({ where: { id } });
      if (!note) {
        throw new SecretNoteNotFoundException(id);
      }
      return this.eccService.decrypt(note.note);
    } catch (error) {
      if (error instanceof SecretNoteNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve note');
    }
  }

  async findOneEncrypted(idDto: IdDto): Promise<SecretNote> {
    const { id } = idDto;
    try {
      const note = await this.secretNoteRepository.findOne({ where: { id } });
      if (!note) {
        throw new SecretNoteNotFoundException(id);
      }
      return note;
    } catch (error) {
      if (error instanceof SecretNoteNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve encrypted note');
    }
  }

  async update(idDto: IdDto, updateSecretNoteDto: UpdateSecretNoteDto): Promise<SecretNote> {
    const { id } = idDto;
    if (!updateSecretNoteDto.note) {
      throw new InvalidSecretNoteException();
    }
    try {
      const encryptedData = this.eccService.encrypt(updateSecretNoteDto.note);
      const note = await this.secretNoteRepository.preload({
        id,
        note: encryptedData,
        ephemeralPublicKey: this.eccService.predefinedPublicKey,
      });
      if (!note) {
        throw new SecretNoteNotFoundException(id);
      }
      return await this.secretNoteRepository.save(note);
    } catch (error) {
      if (error instanceof SecretNoteNotFoundException || error instanceof InvalidSecretNoteException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update note');
    }
  }

  async remove(idDto: IdDto): Promise<void> {
    const { id } = idDto;
    try {
      const note = await this.secretNoteRepository.findOne({ where: { id } });
      if (!note) {
        throw new SecretNoteNotFoundException(id);
      }
      await this.secretNoteRepository.remove(note);
    } catch (error) {
      if (error instanceof SecretNoteNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete note');
    }
  }
}
