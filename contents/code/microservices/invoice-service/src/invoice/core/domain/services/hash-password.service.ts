import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
const scryptAsync = promisify(scrypt);

@Injectable()
export class HashPasswordService {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  async compare(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    const [hashed, salt] = hashedPassword.split('.');
    const buf = (await scryptAsync(plainPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashed;
  }
}
