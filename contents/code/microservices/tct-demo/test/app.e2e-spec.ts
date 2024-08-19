import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //
  it('Tạo thành công', () => {
    return request(app.getHttpServer()).get('/demo/uuid');
    // .expect(HttpStatus.CREATED)

    // .expect((res) => {
    //   expect(res.body.uuid).toBeDefined();
    //   expect(res.body.statusCode).toBe(HttpStatus.CREATED);
    //   expect(res.body.message).toBe('Tạo thành công');
    // });
  });

  it('Không được chấp nhận', () => {
    return request(app.getHttpServer()).get('/demo/uuid');
    // .expect(HttpStatus.OK)
    //     .expect((res) => {
    //       expect(res.body.uuid).toBeUndefined();
    //       expect(res.body.statusCode).toBe(HttpStatus.OK);
    //       expect(res.body.message).toBe('Không được chấp nhận');
    //     });
  });
  // //
  //
  //
  //

  afterEach(async () => {
    await app.close();
  });
});
