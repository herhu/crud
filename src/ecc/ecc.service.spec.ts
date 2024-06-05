import { Test, TestingModule } from '@nestjs/testing';
import { EccService } from './ecc.service';

describe('EccService', () => {
  let service: EccService;

  beforeEach(async () => {
    process.env.ECC_PUBLIC_KEY = '259fc0db122179dee2ecc37606962c15337302031c46bf8ec10adba068a1a939';
    process.env.ECC_PRIVATE_KEY = '0515fd0b312d40a61463e949b3ce7f5c204d030711a12518d774f3d604a79b4b';

    const module: TestingModule = await Test.createTestingModule({
      providers: [EccService],
    }).compile();

    service = module.get<EccService>(EccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a key pair', () => {
    const keyPair = service.generateKeyPair();
    expect(keyPair).toHaveProperty('privateKey');
    expect(keyPair).toHaveProperty('publicKey');
  });

  it('should encrypt and decrypt a note', () => {
    const note = 'test note';
    const encryptedNote = service.encrypt(note);
    const decryptedNote = service.decrypt(encryptedNote);

    expect(decryptedNote).toEqual(note);
  });

  it('should return a predefined public key', () => {
    expect(service.predefinedPublicKey).toBe(process.env.ECC_PUBLIC_KEY);
  });

  it('should return a predefined private key', () => {
    expect(service.predefinedPrivateKey).toBe(process.env.ECC_PRIVATE_KEY);
  });

  it('should throw error if data is tampered during decryption', () => {
    const note = 'test note';
    const encryptedNote = service.encrypt(note);
    const tamperedEncryptedNote = encryptedNote.replace(/.$/, '0'); // Tamper with the encrypted data

    expect(() => service.decrypt(tamperedEncryptedNote)).toThrow();
  });
});
