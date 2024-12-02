import { Controller, Get } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AppService } from '@src/AppService';

@Controller()
export class AppController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello() {
    this.logger.info('Hello world');
    return (await this.appService.getHello()) + ' Web 09 Backend';
  }
}
