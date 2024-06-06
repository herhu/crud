import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secret-note.controller';
import { SecretNoteService } from './secret-note.service';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;
  let service: SecretNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [
        {
          provide: SecretNoteService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findOneEncrypted: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
    service = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new note', async () => {
    const note = 'test note';
    const createdNote = {
      id: 1,
      note: 'encrypted-test note',
      ephemeralPublicKey: 'publicKey',
    };
    jest.spyOn(service, 'create').mockResolvedValue(createdNote as any);

    const result = await controller.create(note);

    expect(result).toEqual(createdNote);
    expect(service.create).toHaveBeenCalledWith(note);
  });

  it('should find all notes', async () => {
    const notes = [{ id: 1, createdAt: new Date() }];
    jest.spyOn(service, 'findAll').mockResolvedValue(notes as any);

    const result = await controller.findAll();

    expect(result).toEqual(notes);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one note by id', async () => {
    const note = 'test note';
    jest.spyOn(service, 'findOne').mockResolvedValue(note);

    const result = await controller.findOne('1');

    expect(result).toEqual(note);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should find one encrypted note by id', async () => {
    const note = {
      id: 1,
      note: 'encrypted-test note',
      ephemeralPublicKey: 'publicKey',
    };
    jest.spyOn(service, 'findOneEncrypted').mockResolvedValue(note as any);

    const result = await controller.findOneEncrypted('1');

    expect(result).toEqual(note);
    expect(service.findOneEncrypted).toHaveBeenCalledWith(1);
  });

  it('should update a note', async () => {
    const note = 'updated note';
    const updatedNote = {
      id: 1,
      note: 'encrypted-updated note',
      ephemeralPublicKey: 'publicKey',
    };
    jest.spyOn(service, 'update').mockResolvedValue(updatedNote as any);

    const result = await controller.update('1', note);

    expect(result).toEqual(updatedNote);
    expect(service.update).toHaveBeenCalledWith(1, note);
  });

  it('should remove a note', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    const result = await controller.remove('1');

    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
