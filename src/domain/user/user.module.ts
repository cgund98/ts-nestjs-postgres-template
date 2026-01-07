import { Module } from "@nestjs/common";

import { UserService } from "@/domain/user/service";
import { KyselyUserRepository } from "@/domain/user/repo/kysely";
import type { UserRepository } from "@/domain/user/repo/base";
import type { KyselyContext } from "@/infrastructure/db/kysely/context";
import type { TransactionManager } from "@/infrastructure/db/transaction-manager";
import type { EventPublisher } from "@/infrastructure/messaging/publisher/base";
import { MessagingModule } from "@/infrastructure/messaging/messaging.module";
import { TRANSACTION_MANAGER_TOKEN, EVENT_PUBLISHER_TOKEN, USER_REPOSITORY_TOKEN } from "@/infrastructure/di/tokens";

/**
 * User domain module providing UserService and UserRepository.
 */
@Module({
  imports: [MessagingModule],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: KyselyUserRepository,
    },
    {
      provide: UserService,
      useFactory: (
        txManager: TransactionManager<KyselyContext>,
        eventPublisher: EventPublisher,
        userRepository: UserRepository<KyselyContext>
      ): UserService<KyselyContext> => {
        return new UserService(txManager, eventPublisher, userRepository);
      },
      inject: [TRANSACTION_MANAGER_TOKEN, EVENT_PUBLISHER_TOKEN, USER_REPOSITORY_TOKEN],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
