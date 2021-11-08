import { Injectable } from '@nestjs/common';
import { UpdateDTO } from './bot.dto';
import { Update } from './bot.types';

@Injectable()
export class BotService {
  processUpdate(update: UpdateDTO): Update {
    const user = {
      id: update.message.chat.id,
      username: update.message.chat.username,
      firstName: update.message.chat.first_name,
      lastName: update.message.chat.last_name,
    };

    if (
      update.message.entities &&
      update.message.entities[0].type === 'bot_command'
    ) {
      const start = update.message.entities[0].offset;
      const end = start + update.message.entities[0].length;
      const command = update.message.text
        ? update.message.text.slice(start, end)
        : undefined;
      return { user, command };
    }

    return { user, messageText: update.message.text ?? undefined };
  }
}
