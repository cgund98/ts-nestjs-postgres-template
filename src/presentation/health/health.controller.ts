import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import type { Settings } from "@/config/settings";
import { SETTINGS_TOKEN } from "@/infrastructure/di/tokens";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(@Inject(SETTINGS_TOKEN) private readonly settings: Settings) {}

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  getHealth(): { status: string; environment?: string } {
    return {
      status: "healthy",
      environment: this.settings.ENVIRONMENT,
    };
  }
}
