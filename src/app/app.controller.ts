import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateDTO } from '../bot/bot.dto';
import { ConfigService } from '@nestjs/config';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post(`webhook/:key`)
  async webhook(
    @Body() body: UpdateDTO,
    @Param('key') key: string,
  ): Promise<void> {
    if (this.configService.get<string>('TG_BOT_API_KEY') === key) {
      await this.appService.onUpdate(body);
    }
  }

  @Get('health')
  health(): string {
    return 'OK';
  }
}
