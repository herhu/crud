import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteService } from './secret-note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './secret-note.entity';
import { EccService } from '../ecc/ecc.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SecretNoteService', () => {
  let service: SecretNoteService;
  let repository: Repository<SecretNote>;
  let eccService: EccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretNoteService,
        {
          provide: getRepositoryToken(SecretNote),
          useClass: Repository,
        },
        {
          provide: EccService,
          useValue: {
            encrypt: jest.fn((data) => `encrypted-${data}`),
            decrypt: jest.fn((data) => data.replace('encrypted-', '')),
            predefinedPublicKey: 'publicKey',
          },
        },
      ],
    }).compile();

    service = module.get<SecretNoteService>(SecretNoteService);
    repository = module.get<Repository<SecretNote>>(getRepositoryToken(SecretNote));
    eccService = module.get<EccService>(EccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new note', async () => {
    const note = 'test note';
    const encryptedNote = `encrypted-${note}`;
    const createdNote = { id: 1, note: encryptedNote, ephemeralPublicKey: 'publicKey' };

    jest.spyOn(repository, 'create').mockReturnValue(createdNote as any);
    jest.spyOn(repository, 'save').mockResolvedValue(createdNote as any);

    const result = await service.create(note);

    expect(result).toEqual(createdNote);
    expect(eccService.encrypt).toHaveBeenCalledWith(note);
    expect(repository.create).toHaveBeenCalledWith({ note: encryptedNote, ephemeralPublicKey: 'publicKey' });
    expect(repository.save).toHaveBeenCalledWith(createdNote);
  });

  it('should find all notes', async () => {
    const notes = [{ id: 1, createdAt: new Date() }];
    jest.spyOn(repository, 'find').mockResolvedValue(notes as any);

    const result = await service.findAll();

    expect(result).toEqual(notes);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one note by id', async () => {
    const note = { id: 1, note: 'encrypted-test note' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(note as any);

    const result = await service.findOne(1);

    expect(result).toEqual('test note');
    expect(eccService.decrypt).toHaveBeenCalledWith(note.note);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if note not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should find one encrypted note by id', async () => {
    const note = { id: 1, note: 'encrypted-test note', ephemeralPublicKey: 'publicKey' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(note as any);

    const result = await service.findOneEncrypted(1);

    expect(result).toEqual(note);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a note', async () => {
    const note = 'updated note';
    const encryptedNote = `encrypted-${note}`;
    const updatedNote = { id: 1, note: encryptedNote, ephemeralPublicKey: 'publicKey' };

    jest.spyOn(repository, 'preload').mockResolvedValue(updatedNote as any);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedNote as any);

    const result = await service.update(1, note);

    expect(result).toEqual(updatedNote);
    expect(eccService.encrypt).toHaveBeenCalledWith(note);
    expect(repository.preload).toHaveBeenCalledWith({ id: 1, note: encryptedNote, ephemeralPublicKey: 'publicKey' });
    expect(repository.save).toHaveBeenCalledWith(updatedNote);
  });

  it('should throw NotFoundException if note to update not found', async () => {
    jest.spyOn(repository, 'preload').mockResolvedValue(null);

    await expect(service.update(1, 'updated note')).rejects.toThrow(NotFoundException);
  });

  it('should remove a note', async () => {
    const note = { id: 1, note: 'encrypted-test note' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(note as any);
    jest.spyOn(repository, 'remove').mockResolvedValue(note as any);

    await service.remove(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repository.remove).toHaveBeenCalledWith(note);
  });

  it('should throw NotFoundException if note to remove not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
