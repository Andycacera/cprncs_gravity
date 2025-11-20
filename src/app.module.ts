import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { JsonDbModule } from './common/json-db/json-db.module';

@Module({
  imports: [UsersModule, JsonDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
