import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { UserChatEntity } from './user.types';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop(
    raw({
      chatId: { type: Number, required: true },
      messages: [
        {
          messageId: { type: Number, required: true },
          text: { type: String, required: true },
          date: { type: Number, required: true },
          isBot: { type: Boolean, require: true },
        },
      ],
    }),
  )
  chat: UserChatEntity;
}

export const UserSchema = SchemaFactory.createForClass(User);
