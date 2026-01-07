import { Module } from "@nestjs/common";

import { UserModule as DomainUserModule } from "@/domain/user/user.module";
import { UserController } from "./user.controller";

/**
 * User presentation module.
 */
@Module({
  imports: [DomainUserModule],
  controllers: [UserController],
})
export class UserModule {}
