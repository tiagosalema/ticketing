import { CustomError } from './custom-error';

export class DatabaseConnnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super('Error connecting to the database...');

    Object.setPrototypeOf(this, DatabaseConnnectionError.prototype);
  }

  serialiseErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
