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
    this.logger.error('AppController.getHello의 에러 로그입니다.');
    return (await this.appService.getHello()) + ' Web 09 Backend';
  }
}
