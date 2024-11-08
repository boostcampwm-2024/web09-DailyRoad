import { setupWorker } from 'msw/browser';
import { handlers } from './handler';

export const worker = setupWorker();
worker.use(...handlers);
