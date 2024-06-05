// src/secret-note/secret-note.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './secret-note.entity';
import { EccService } from '../ecc/ecc.service';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private secretNoteRepository: Repository<SecretNote>,
    private readonly eccService: EccService,
  ) {}

  async create(note: string): Promise<SecretNote> {
    const encryptedData = this.eccService.encrypt(note);
    const newNote = this.secretNoteRepository.create({ note: encryptedData, ephemeralPublicKey: this.eccService.predefinedPublicKey });
    return this.secretNoteRepository.save(newNote);
  }

  async findAll(): Promise<Partial<SecretNote>[]> {
    const notes = await this.secretNoteRepository.find();
    return notes.map(note => ({ id: note.id, createdAt: note.createdAt }));
  }

  async findOne(id: number): Promise<string> {
    const note = await this.secretNoteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.eccService.decrypt(note.note);
  }

  async findOneEncrypted(id: number): Promise<SecretNote> {
    const note = await this.secretNoteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(id: number, newNote: string): Promise<SecretNote> {
    const encryptedData = this.eccService.encrypt(newNote);
    const note = await this.secretNoteRepository.preload({ id, note: encryptedData, ephemeralPublicKey: this.eccService.predefinedPublicKey });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.secretNoteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.secretNoteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    await this.secretNoteRepository.remove(note);
  }
}
