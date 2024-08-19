import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionEmailService {
  encrypt(email: string, secretKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey),
      iv,
    );
    let encrypted = cipher.update(email, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }

  decrypt(encryptedEmail: string, secretKey: string): string {
    const iv = Buffer.from(encryptedEmail.slice(0, 32), 'hex');
    const encryptedText = encryptedEmail.slice(32);
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey),
      iv,
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
