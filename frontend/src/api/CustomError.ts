interface CustomErrorOptions {
  code: number;
  status: number;

  message: string;
  userMessage: string;
  path?: string;
}

export class CustomError extends Error {
  code: number;
  status: number;
  userMessage: string;
  path?: string;

  constructor(options: CustomErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.status = options.status;
    this.userMessage = options.userMessage;

    Object.assign(this, options);
  }
}
