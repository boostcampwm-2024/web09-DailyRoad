import { repl } from '@nestjs/core';
import { AppModule } from '@src/AppModule';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  await repl(AppModule);
}

initializeTransactionalContext();
bootstrap();
