import { repl } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  await repl(AppModule);
}

initializeTransactionalContext();
bootstrap();
