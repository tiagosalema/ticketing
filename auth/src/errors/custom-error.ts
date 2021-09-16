export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serialiseErrors(): { message: string; field?: string }[];
}
