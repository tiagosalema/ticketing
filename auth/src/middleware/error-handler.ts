import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
/**
 * As soon as this function is used as middleware Express will know it is
 * an error handler function because it has 4 arguments
 * https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 *
 * @returns an object with 2 properties: a message and a field
 */

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serialiseErrors() });
  }
  console.log('Something went wrong');
  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
