// src/ecc/ecc.service.ts

import { Injectable } from '@nestjs/common';
import * as elliptic from 'elliptic';
import * as crypto from 'crypto';

@Injectable()
export class EccService {
  private ec: elliptic.ec;
  predefinedPublicKey: string;
  predefinedPrivateKey: string;

  constructor() {
    this.ec = new elliptic.ec('curve25519');
    this.predefinedPublicKey = process.env.ECC_PUBLIC_KEY;
    this.predefinedPrivateKey = process.env.ECC_PRIVATE_KEY;
  }

  // Function to hash the shared secret
  private hashSharedSecret(sharedSecret: any): Buffer {
    return crypto.createHash('sha256').update(sharedSecret.toString(16)).digest();
  }

  // Function to encrypt data
  public encrypt(data: string): string {
    const keyPair = this.ec.keyFromPublic(this.predefinedPublicKey, 'hex');
    const ephemeralKeyPair = this.ec.genKeyPair();
    const sharedSecret = ephemeralKeyPair.derive(keyPair.getPublic());
    const key = this.hashSharedSecret(sharedSecret);

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${ephemeralKeyPair.getPublic('hex')}|${iv.toString('hex')}|${authTag}|${encrypted}`;
  }

  // Function to decrypt data
  public decrypt(encryptedData: string): string {
    const [ephemeralPublicKey, iv, authTag, encrypted] = encryptedData.split('|');
    const keyPair = this.ec.keyFromPrivate(this.predefinedPrivateKey, 'hex');
    const ephemeralKeyPair = this.ec.keyFromPublic(ephemeralPublicKey, 'hex');
    const sharedSecret = keyPair.derive(ephemeralKeyPair.getPublic());
    const key = this.hashSharedSecret(sharedSecret);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
