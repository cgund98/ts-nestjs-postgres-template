import { Module } from "@nestjs/common";

import type { Settings } from "@/config/settings";
import { SNSPublisher, type EventPublisher } from "@/infrastructure/messaging/publisher/index";
import { SETTINGS_TOKEN, EVENT_PUBLISHER_TOKEN } from "@/infrastructure/di/tokens";

/**
 * Messaging module providing event publisher.
 */
@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER_TOKEN,
      useFactory: (settings: Settings): EventPublisher => {
        const topicArn = settings.DEFAULT_EVENT_TOPIC_ARN;
        if (!topicArn) {
          throw new Error("Default event topic ARN must be configured");
        }
        return new SNSPublisher(settings, topicArn);
      },
      inject: [SETTINGS_TOKEN],
    },
  ],
  exports: [EVENT_PUBLISHER_TOKEN],
})
export class MessagingModule {}

