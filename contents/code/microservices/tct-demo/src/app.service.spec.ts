import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let app: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    app = module.get<AppService>(AppService);
  });

  it('Trả về UUID', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    const result = app.getRandomValue();
    expect(result).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
    );
  });

  it('Trả về null', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = app.getRandomValue();
    expect(result).toBeNull();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
