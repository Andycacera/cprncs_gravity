import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JsonDbService } from 'src/common/json-db/json-db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JsonDbService],
})
export class UsersModule {}
