import type { BaseEvent } from "@/infrastructure/messaging/base";

export interface EventPublisher {
  publish(event: BaseEvent): Promise<void>;
}
