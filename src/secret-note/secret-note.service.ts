import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './secret-note.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private secretNoteRepository: Repository<SecretNote>,
  ) {}

  async create(note: string): Promise<SecretNote> {
    const encryptedNote = await bcrypt.hash(note, 10);
    const newNote = this.secretNoteRepository.create({ note: encryptedNote });
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
    return await bcrypt.compare(note.note, note.note) ? note.note : '';
  }

  async findOneEncrypted(id: number): Promise<SecretNote> {
    const note = await this.secretNoteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(id: number, newNote: string): Promise<SecretNote> {
    const encryptedNote = await bcrypt.hash(newNote, 10);
    const note = await this.secretNoteRepository.preload({ id, note: encryptedNote });
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
