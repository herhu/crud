import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNoteService } from './secret-note.service';
import { SecretNote } from './secret-note.entity';
import { EccService } from '../ecc/ecc.service';
import { CreateSecretNoteDto, UpdateSecretNoteDto, IdDto } from './dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockSecretNoteRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

const mockEccService = () => ({
  encrypt: jest.fn().mockReturnValue('encryptedData'),
  decrypt: jest.fn().mockReturnValue('decryptedData'),
  predefinedPublicKey: 'mockedPublicKey',
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SecretNoteService', () => {
  let service: SecretNoteService;
  let repository: MockRepository<SecretNote>;
  let eccService: EccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretNoteService,
        { provide: getRepositoryToken(SecretNote), useFactory: mockSecretNoteRepository },
        { provide: EccService, useFactory: mockEccService },
      ],
    }).compile();

    service = module.get<SecretNoteService>(SecretNoteService);
    repository = module.get<MockRepository<SecretNote>>(getRepositoryToken(SecretNote));
    eccService = module.get<EccService>(EccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a secret note', async () => {
      const createSecretNoteDto: CreateSecretNoteDto = { note: 'test note' };
      const encryptedData = 'encryptedData';
      const savedNote = { id: 1, note: encryptedData, ephemeralPublicKey: eccService.predefinedPublicKey };

      repository.create.mockReturnValue(savedNote);
      repository.save.mockResolvedValue(savedNote);

      const result = await service.create(createSecretNoteDto);

      expect(repository.create).toHaveBeenCalledWith({
        note: encryptedData,
        ephemeralPublicKey: eccService.predefinedPublicKey,
      });
      expect(repository.save).toHaveBeenCalledWith(savedNote);
      expect(result).toEqual(savedNote);
    });

    it('should throw an error if note is empty', async () => {
      const createSecretNoteDto: CreateSecretNoteDto = { note: '' };

      await expect(service.create(createSecretNoteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all secret notes', async () => {
      const notes = [{ id: 1, createdAt: new Date() }];
      repository.find.mockResolvedValue(notes);

      const result = await service.findAll();

      expect(result).toEqual(notes);
    });
  });

  describe('findOne', () => {
    it('should return a decrypted note', async () => {
      const note = { id: 1, note: 'encrypted note' };
      repository.findOne.mockResolvedValue(note);
      const idDto: IdDto = { id: 1 };

      const result = await service.findOne(idDto);

      expect(result).toEqual('decryptedData');
    });

    it('should throw an error if note not found', async () => {
      repository.findOne.mockResolvedValue(null);
      const idDto: IdDto = { id: 1 };

      await expect(service.findOne(idDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneEncrypted', () => {
    it('should return an encrypted note', async () => {
      const note = { id: 1, note: 'encrypted note' };
      repository.findOne.mockResolvedValue(note);
      const idDto: IdDto = { id: 1 };

      const result = await service.findOneEncrypted(idDto);

      expect(result).toEqual(note);
    });

    it('should throw an error if note not found', async () => {
      repository.findOne.mockResolvedValue(null);
      const idDto: IdDto = { id: 1 };

      await expect(service.findOneEncrypted(idDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the secret note', async () => {
      const idDto: IdDto = { id: 1 };
      const updateSecretNoteDto: UpdateSecretNoteDto = { note: 'updated note' };
      const encryptedData = 'encryptedData';
      const updatedNote = { id: 1, note: encryptedData, ephemeralPublicKey: eccService.predefinedPublicKey };

      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedNote);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedNote);
      jest.spyOn(eccService, 'encrypt').mockReturnValue(encryptedData);

      const result = await service.update(idDto, updateSecretNoteDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedNote);
      expect(result).toEqual(updatedNote);
    });

    it('should throw an error if note not found', async () => {
      const idDto: IdDto = { id: 1 };
      const updateSecretNoteDto: UpdateSecretNoteDto = { note: 'updated note' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(idDto, updateSecretNoteDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if note content is empty', async () => {
      const idDto: IdDto = { id: 1 };
      const updateSecretNoteDto: UpdateSecretNoteDto = { note: '' };

      await expect(service.update(idDto, updateSecretNoteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete the secret note', async () => {
      const note = { id: 1, note: 'encrypted note' };
      repository.findOne.mockResolvedValue(note);
      repository.remove.mockResolvedValue(undefined);
      const idDto: IdDto = { id: 1 };

      await service.remove(idDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(note);
    });

    it('should throw an error if note not found', async () => {
      repository.findOne.mockResolvedValue(null);
      const idDto: IdDto = { id: 1 };

      await expect(service.remove(idDto)).rejects.toThrow(NotFoundException);
    });
  });
});
