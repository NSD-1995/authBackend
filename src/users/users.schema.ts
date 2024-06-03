import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = Users & Document;

@Schema({ collection: 'usersdata' })
export class Users {

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
