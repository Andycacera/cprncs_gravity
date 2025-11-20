import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JsonDbService } from '../../common/json-db/json-db.service';

describe('UsersService', () => {
  let service: UsersService;
  let _jsonDbService: JsonDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, JsonDbService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    _jsonDbService = module.get<JsonDbService>(JsonDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(_jsonDbService).toBeDefined();
  });
});
