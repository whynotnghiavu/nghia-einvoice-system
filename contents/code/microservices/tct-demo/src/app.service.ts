import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  getRandomValue() {
    const ACCEPTANCE_RATE = 0.5;
    const random_choose = Math.random();

    if (random_choose < ACCEPTANCE_RATE) {
      return randomUUID();
    }

    return null;
  }
}
