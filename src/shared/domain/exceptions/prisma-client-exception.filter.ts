import { ArgumentsHost, Catch, Logger, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          date: new Date().toISOString(),
          code: exception.code,
          error: message,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
