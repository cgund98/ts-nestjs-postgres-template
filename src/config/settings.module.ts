import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { getSettings, type Settings } from "./settings";

export const SETTINGS_TOKEN = "SETTINGS";

/**
 * Settings module providing application configuration.
 * This module is global so Settings can be injected anywhere in the app.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SETTINGS_TOKEN,
      useFactory: (): Settings => {
        return getSettings();
      },
    },
  ],
  exports: [SETTINGS_TOKEN],
})
export class SettingsModule {}
