import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MicroservicesTctPort } from '../../../core/application/ports/tct/tct.port';

@Injectable()
export abstract class TctAdapter implements MicroservicesTctPort {
  async getId(): Promise<string> {
    const response = await axios.get(
      `http://${process.env.TCT_HOST}:${process.env.TCT_PORT}/api/demo/uuid`,
    );

    if (response.data) {
      return response.data;
    }

    return null;
  }
}
