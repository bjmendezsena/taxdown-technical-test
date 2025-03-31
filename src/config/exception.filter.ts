import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

type TErrorResponse = {
  message: string;
  error: string;
  status: number;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      try {
        const status = exception?.getStatus() || 500;
        const { error } = exception.getResponse() as TErrorResponse;
        this.logger.error(exception.stack);

        return response.status(status).json({
          date: new Date().toISOString(),
          error: exception.message,
          code: error,
        });
      } catch (error) {
        this.logger.error(error);
      }
    }

    response.status(500).json({
      date: new Date().toISOString(),
      error: exception,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}
