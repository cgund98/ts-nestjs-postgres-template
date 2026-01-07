import { Module, PipeTransform } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { SettingsModule } from "@/config/settings.module";
import { DatabaseModule } from "@/infrastructure/db/database.module";
import { MessagingModule } from "@/infrastructure/messaging/messaging.module";
import { UserModule } from "@/presentation/user/user.module";
import { HealthModule } from "@/presentation/health/health.module";

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
  providers: [
    {
      provide: APP_PIPE,
      useFactory: (): PipeTransform => new ZodValidationPipe(),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
