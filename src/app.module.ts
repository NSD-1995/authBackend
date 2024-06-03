import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ UsersModule,  MongooseModule.forRoot('mongodb://localhost/users')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
