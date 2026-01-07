import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response, Request } from "express";
import { getLogger } from "@/observability/logging";

import { BusinessRuleError, DomainError, NotFoundError, RepositoryError, ValidationError } from "@/domain/exceptions";
import { DatabaseError, DuplicateError, NoFieldsToUpdateError } from "@/infrastructure/db/exceptions";

const logger = getLogger("ExceptionFilter");

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle NestJS HttpException first
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle BadRequestException (often from validation)
      if (status === 400) {
        let message: string | string[] = "Bad Request";
        if (typeof exceptionResponse === "object" && exceptionResponse !== null && "message" in exceptionResponse) {
          message = (exceptionResponse as any).message;
        } else if (typeof exceptionResponse === "string") {
          message = exceptionResponse;
        }

        // Log validation errors for debugging
        logger.warn(
          {
            msg: "Validation error",
            method: request.method,
            url: request.url,
            body: request.body,
            validationErrors: message,
          },
          "Validation failed"
        );

        response.status(400).json({
          error: "BadRequest",
          message: Array.isArray(message) ? message.join(", ") : message,
        });
        return;
      }

      response.status(status).json(exceptionResponse);
      return;
    }

    // Handle domain exceptions
    if (exception instanceof ValidationError) {
      response.status(400).json({
        error: "ValidationError",
        message: exception.message,
        field: exception.field,
      });
      return;
    }

    if (exception instanceof BusinessRuleError) {
      response.status(422).json({
        error: "BusinessRuleError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof NotFoundError) {
      response.status(404).json({
        error: "NotFoundError",
        message: exception.message,
        entityType: exception.entityType,
        identifier: exception.identifier,
      });
      return;
    }

    if (exception instanceof DuplicateError) {
      response.status(409).json({
        error: "DuplicateError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof NoFieldsToUpdateError) {
      response.status(400).json({
        error: "NoFieldsToUpdateError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof DatabaseError || exception instanceof RepositoryError) {
      response.status(500).json({
        error: "DatabaseError",
        message: "An internal database error occurred",
      });
      return;
    }

    if (exception instanceof DomainError) {
      response.status(500).json({
        error: "DomainError",
        message: exception.message,
      });
      return;
    }

    // Log all errors before mapping to response types
    const error = exception instanceof Error ? exception : new Error(String(exception));
    logger.error(
      {
        err: error,
        msg: "Uncaught exception",
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
      },
      "Uncaught exception in request handler"
    );

    // Unknown error
    response.status(500).json({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });
  }
}
