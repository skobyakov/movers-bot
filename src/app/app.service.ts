import { Injectable } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { UpdateDTO } from '../bot/bot.dto';
import { Update } from '../bot/bot.types';

@Injectable()
export class AppService {
  constructor(private botService: BotService) {}

  onUpdate(updateDto: UpdateDTO): void {
    const update: Update = this.botService.processUpdate(updateDto);
    console.log(update);
  }
}
