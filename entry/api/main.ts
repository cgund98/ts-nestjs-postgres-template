import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "@/presentation/app.module";
import { DomainExceptionFilter } from "@/presentation/exceptions/domain-exception.filter";
import { getSettings } from "@/config/settings";
import { getLogger } from "@/observability/logging";
import { UserController } from "@/presentation/user/user.controller";

const settings = getSettings();
const logger = getLogger("API");

async function bootstrap(): Promise<void> {
  const paramTypes = Reflect.getMetadata("design:paramtypes", UserController.prototype, "patchUser");
  if (paramTypes === undefined) {
    throw new Error("Unable to infer param types for UserController.patchUser. Make sure you aren't running with tsx");
  }

  try {
    logger.info({ environment: settings.ENVIRONMENT, msg: "Starting API server" });

    const app = await NestFactory.create(AppModule, {
      logger: settings.LOG_LEVEL === "debug" ? ["debug", "log", "warn", "error"] : ["log", "warn", "error"],
    });

    // Set global prefix
    app.setGlobalPrefix("api");

    // Set up exception filter
    app.useGlobalFilters(new DomainExceptionFilter());

    // Set up Swagger
    const config = new DocumentBuilder()
      .setTitle("NestJS PostgreSQL Template")
      .setVersion("0.1.0")
      .addServer("/")
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
    });
    SwaggerModule.setup("docs", app, document);

    const port = process.env.PORT ? Number(process.env.PORT) : 8000;
    const host = process.env.HOST ?? "0.0.0.0";

    await app.listen(port, host);
    logger.info({ port, host, msg: "API server started" });
  } catch (error) {
    logger.error({ err: error, msg: "Failed to start API server" });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  logger.info({ msg: "Received SIGTERM, shutting down gracefully" });
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info({ msg: "Received SIGINT, shutting down gracefully" });
  process.exit(0);
});

// Run bootstrap if this file is executed directly
if (require.main === module) {
  bootstrap().catch((error: unknown) => {
    logger.error({ err: error, msg: "Unhandled error in bootstrap" });
    process.exit(1);
  });
}
