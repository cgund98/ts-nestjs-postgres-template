import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SettingsModule } from "@/config/settings.module";
import { DatabaseModule } from "@/infrastructure/db/database.module";
import { MessagingModule } from "@/infrastructure/messaging/messaging.module";
import { UserModule } from "@/presentation/user/user.module";
import { HealthModule } from "@/presentation/health/health.module";
import { APP_PIPE } from "@nestjs/core";

/**
 * Root application module.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SettingsModule, // Must be imported before modules that depend on Settings
    DatabaseModule,
    MessagingModule,
    UserModule,
    HealthModule,
  ],
  // Removed APP_PIPE - applying pipes directly to endpoints instead
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    },
  ],
})
export class AppModule {}
