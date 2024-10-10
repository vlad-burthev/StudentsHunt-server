import { Response } from 'express';

interface IError {
  res: Response;
  message: string | string[];
  error: string;
  statusCode: number;
}

interface IResponse<T> {
  res: Response;
  data: T;
  statusCode: number;
}

export class HttpResponseHandler {
  static error({ res, message, error, statusCode }: IError) {
    return res.status(statusCode).json({
      message: Array.isArray(message) ? message : [message],
      error: error || 'Internal server error',
      statusCode: statusCode || 500,
    });
  }

  static response<T>({ res, data, statusCode }: IResponse<T>) {
    return res.status(statusCode).json(data);
  }
}
