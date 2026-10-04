import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../../shared/response/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const { message, errors } = this.normalizeError(exceptionResponse);

    if (status >= 500) {
      this.logger.error(message, exception instanceof Error ? exception.stack : undefined);
    }

    const body: ApiErrorResponse = {
      success: false,
      message,
      errors,
    };

    response.status(status).json(body);
  }

  private normalizeError(exceptionResponse: string | object) {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse, errors: [] };
    }

    const payload = exceptionResponse as Record<string, unknown>;
    const rawMessage = payload.message;
    const message = Array.isArray(rawMessage)
      ? 'Validation failed'
      : rawMessage?.toString() ?? 'Unexpected error';

    return {
      message,
      errors: Array.isArray(rawMessage) ? rawMessage : [],
    };
  }
}
