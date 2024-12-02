import { HttpStatus } from '@nestjs/common';

export type ExceptionType = {
  code: number;
  message: string;
  status: HttpStatus;
};
