import axios, { AxiosInstance } from 'axios';
import _chunk from 'lodash/chunk';
import { Injectable } from '@nestjs/common';
import { UpdateDTO } from './bot.dto';
import { Update } from './bot.types';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class BotService {
  private botApi: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.botApi = axios.create({
      baseURL: `https://api.telegram.org/bot${this.configService.get<string>(
        'TG_BOT_API_KEY',
      )}/`,
    });
  }

  async processUpdate(update: UpdateDTO): Promise<Update> {
    const parsedUpdate = this.parseMessage(update);

    const updatedUser = await this.userService.updateWithMessage(
      parsedUpdate.user,
      {
        chatId: parsedUpdate.chatId,
        messages: [
          {
            messageId: parsedUpdate.messageId,
            text: parsedUpdate.messageText || parsedUpdate.command || '',
            date: parsedUpdate.date,
            isBot: false,
          },
        ],
      },
    );

    return {
      ...parsedUpdate,
      user: { ...parsedUpdate.user, id: `${updatedUser._id}` },
    };
  }

  private parseMessage(update: UpdateDTO): Update {
    const user = {
      id: '',
      username: update.message.chat.username,
      firstName: update.message.chat.first_name,
      lastName: update.message.chat.last_name,
    };
    const messageId = update.message.message_id;
    const date = update.message.date;
    const chatId = update.message.chat.id;

    if (
      update.message.entities &&
      update.message.entities[0].type === 'bot_command'
    ) {
      const start = update.message.entities[0].offset;
      const end = start + update.message.entities[0].length;
      const command = update.message.text
        ? update.message.text.slice(start, end)
        : undefined;

      return { user, command, messageId, date, chatId };
    }

    return {
      user,
      messageId,
      chatId,
      date,
      messageText: update.message.text ?? undefined,
    };
  }

  async sendMessage(text: string, chatId: number): Promise<void> {
    await this.botApi.post('sendMessage', {
      chat_id: chatId,
      text,
      reply_markup: { remove_keyboard: true },
    });
  }

  async sendMessageWithButtons(
    text: string,
    options: string[],
    chatId: number,
  ): Promise<void> {
    await this.botApi.post('sendMessage', {
      chat_id: chatId,
      text,
      reply_markup: {
        keyboard: _chunk(options, 2).map((row) =>
          row.map((item) => ({ text: item })),
        ),
      },
    });
  }
}
