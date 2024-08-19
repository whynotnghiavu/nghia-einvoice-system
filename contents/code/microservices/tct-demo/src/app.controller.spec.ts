import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    appController = moduleRef.get<AppController>(AppController);
  });

  it('Tạo thành công', () => {
    const uuid = 'uuid-uuid-uuid-uuid-uuid';
    jest.spyOn(appService, 'getRandomValue').mockReturnValue(uuid);

    expect(() => appController.getRandomValue()).toThrowError(
      new HttpException(
        {
          uuid,
          statusCode: HttpStatus.CREATED,
          message: 'Tạo thành công',
        },
        HttpStatus.OK,
      ),
    );
  });

  it('Không được chấp nhận', () => {
    jest.spyOn(appService, 'getRandomValue').mockReturnValue(null);

    expect(() => appController.getRandomValue()).toThrowError(
      new HttpException(
        {
          uuid: null,
          statusCode: HttpStatus.OK,
          message: 'Không được chấp nhận',
        },
        HttpStatus.OK,
      ),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
