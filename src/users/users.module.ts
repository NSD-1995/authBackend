import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UsersController} from "./users.controller"
import {UsersService} from "./users.service"
import { UsersSchema,Users } from './users.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }],)
    ,AuthModule
  ],
  providers:[UsersService],
  controllers:[UsersController],
})
export class UsersModule {}
