import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteService } from './secret-note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './secret-note.entity';
import * as bcrypt from 'bcryptjs';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('SecretNoteService', () => {
  let service: SecretNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretNoteService,
        {
          provide: getRepositoryToken(SecretNote),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests for create, findAll, findOne, update, and remove methods
});
