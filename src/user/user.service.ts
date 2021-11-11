import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserDocument } from './user.schema';
import { UserChatEntity, UserInfo } from './user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async updateWithMessage(
    user: UserInfo,
    message: UserChatEntity,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { 'chat.chatId': message.chatId },
      {
        $set: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          'chat.chatId': message.chatId,
        },
        $push: {
          'chat.messages': {
            messageId: message.messages[0].messageId,
            text: message.messages[0].text,
            date: message.messages[0].date,
            isBot: message.messages[0].isBot,
          },
        },
      },
      { upsert: true },
    );
  }
}
