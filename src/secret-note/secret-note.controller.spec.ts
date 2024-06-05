import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secret-note.controller';
import { SecretNoteService } from './secret-note.service';
import { EccService } from '../ecc/ecc.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './secret-note.entity';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [
        SecretNoteService,
        EccService,
        {
          provide: getRepositoryToken(SecretNote),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});