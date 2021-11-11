import { Injectable } from '@nestjs/common';

import { COMMANDS } from './app.const';

import { BotService } from '../bot/bot.service';
import { UpdateDTO } from '../bot/bot.dto';
import { Update } from '../bot/bot.types';

import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class AppService {
  constructor(
    private readonly botService: BotService,
    private readonly quizService: QuizService,
  ) {}

  async onUpdate(updateDto: UpdateDTO): Promise<void> {
    const update = await this.botService.processUpdate(updateDto);

    if (update.command) {
      await this.onCommand(update);
    } else if (update.messageText) {
      await this.onTextMessage(update);
    }
  }

  async onCommand(update: Update): Promise<void> {
    if (update.command === COMMANDS.START) {
      const { welcomeMessage, firstQuestion } = await this.quizService.start(
        update.user.id,
      );
      await this.botService.sendMessage(welcomeMessage, update.chatId);
      await this.botService.sendMessageWithButtons(
        firstQuestion.text,
        firstQuestion.options,
        update.chatId,
      );
    }
  }

  async onTextMessage(update: Update): Promise<void> {
    const status = await this.quizService.getStatus(update.user.id);

    if (status === 'in_progress') {
      try {
        const nextMessage = await this.quizService.putAnswer(
          update.user.id,
          update.messageText,
        );

        if (nextMessage) {
          await this.botService.sendMessageWithButtons(
            nextMessage.text,
            nextMessage.options,
            update.chatId,
          );
        } else {
          const result = await this.quizService.getResult(update.user.id);
          await this.botService.sendMessage(result, update.chatId);
        }
      } catch (err) {
        return;
      }
    }
  }
}
