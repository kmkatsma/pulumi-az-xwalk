import { AzureSettingsKeys } from './az-settings.config';

export class AzSettingsUtil {
  constructor() {}

  static getAZSetting(key: AzureSettingsKeys, override?: string) {
    let val = this.get(key);
    if (override) {
      val = override;
    }
    if (!val || val.length === 0) {
      throw Error(`${key} environment variable required`);
    }
    return val;
  }

  private static get(key: string): string {
    const val = process.env[key];
    if (val) {
      return val;
    } else {
      return '';
    }
  }
}
