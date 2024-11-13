import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'crypto';

@Injectable()
export class TraceService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<
    Map<string, any>
  >();

  run(callback: () => void) {
    const store = new Map<string, any>();
    store.set('traceId', randomUUID());
    this.asyncLocalStorage.run(store, callback);
  }

  get traceId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get('traceId') : undefined;
  }
}
