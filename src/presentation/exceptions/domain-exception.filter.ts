import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { ZodValidationException, ZodSerializationException } from "nestjs-zod";
import { getLogger } from "@/observability/logging";

import { BusinessRuleError, DomainError, NotFoundError, RepositoryError, ValidationError } from "@/domain/exceptions";
import { DatabaseError, DuplicateError, NoFieldsToUpdateError } from "@/infrastructure/db/exceptions";

const logger = getLogger("ExceptionFilter");

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // Handle ZodValidationException (from ZodValidationPipe)
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      if (zodError instanceof ZodError) {
        const errors = this.formatZodErrors(zodError);

        logger.warn(
          {
            msg: "Zod validation error",
            method: request.method,
            url: request.url,
            body: request.body,
            errors,
          },
          "Request validation failed"
        );

        response.status(400).send({
          error: "ValidationError",
          message: "Request validation failed",
          errors,
        });
        return;
      }
    }

    // Handle ZodSerializationException (from ZodSerializerInterceptor)
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      if (zodError instanceof ZodError) {
        const errors = this.formatZodErrors(zodError);

        logger.warn(
          {
            msg: "Zod serialization error",
            method: request.method,
            url: request.url,
            errors,
          },
          "Response serialization failed"
        );

        response.status(exception.getStatus()).send({
          error: "SerializationError",
          message: "Response data failed validation",
          errors,
        });
        return;
      }
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle BadRequestException (often from validation)
      if (status === 400) {
        let message: string | string[] = "Bad Request";
        if (typeof exceptionResponse === "object" && "message" in exceptionResponse) {
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

        response.status(400).send({
          error: "BadRequest",
          message: Array.isArray(message) ? message.join(", ") : message,
        });
        return;
      }

      response.status(status).send(exceptionResponse);
      return;
    }

    // Handle domain exceptions
    if (exception instanceof ValidationError) {
      response.status(400).send({
        error: "ValidationError",
        message: exception.message,
        field: exception.field,
      });
      return;
    }

    if (exception instanceof BusinessRuleError) {
      response.status(422).send({
        error: "BusinessRuleError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof NotFoundError) {
      response.status(404).send({
        error: "NotFoundError",
        message: exception.message,
        entityType: exception.entityType,
        identifier: exception.identifier,
      });
      return;
    }

    if (exception instanceof DuplicateError) {
      response.status(409).send({
        error: "DuplicateError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof NoFieldsToUpdateError) {
      response.status(400).send({
        error: "NoFieldsToUpdateError",
        message: exception.message,
      });
      return;
    }

    if (exception instanceof DatabaseError || exception instanceof RepositoryError) {
      response.status(500).send({
        error: "DatabaseError",
        message: "An internal database error occurred",
      });
      return;
    }

    if (exception instanceof DomainError) {
      response.status(500).send({
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
    response.status(500).send({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });
  }

  /**
   * Formats Zod errors into a structured array of field errors.
   * Each error includes the field path, validation message, and error code.
   */
  private formatZodErrors(zodError: ZodError): { path: string; message: string; code: string }[] {
    return zodError.issues.map((issue) => ({
      path: issue.path.length > 0 ? issue.path.join(".") : "root",
      message: issue.message,
      code: issue.code,
    }));
  }
}
