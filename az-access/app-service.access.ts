import axios from 'axios';
import * as qs from 'qs';
import { AzureStringDictionary } from './management.models';
import { AzSettingsUtil } from './as-settings.util';
import axiosRetry from 'axios-retry';
import { AzureSettingsKeys } from './az-settings.config';

export class AppServiceAccess {
  constructor() {
    axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });
    // An Optional options for initializing the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics#configuration-options
  }

  private getHeaderConfig(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getToken(secret?: string, adminClientId?: string, tenantId?: string) {
    const APP_SECRET = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.ADMIN_APP_SECRET,
      secret
    );
    const ADMIN_CLIENT_ID = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.ADMIN_CLIENT_ID,
      adminClientId
    );
    const TENANT_ID = AzSettingsUtil.getAZSetting(AzureSettingsKeys.TENANT_ID);

    //Get V1 Oauth token - requires the account to have contributor rights to actually
    const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/token`;
    const postData = {
      client_id: ADMIN_CLIENT_ID,
      resource: 'https://management.azure.com',
      client_secret: APP_SECRET,
      grant_type: 'client_credentials',
    };

    axios.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded';

    let token = '';
    let response: any;
    try {
      response = await axios.post(TOKEN_ENDPOINT, qs.stringify(postData));
    } catch (e) {
      console.log(e);
      throw e;
    }

    console.log('graph token', response.data);
    token = response.data.access_token;

    return token;
  }

  async getAppSettings(
    appName: string,
    resourceGroup: string,
    subscriptionId: string,
    token?: string
  ): Promise<AzureStringDictionary> {
    const URL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${appName}/config/appsettings/list?api-version=2019-08-01`;
    if (!token) {
      token = await this.getToken();
    }
    try {
      const response: any = await axios.post(
        URL,
        undefined,
        this.getHeaderConfig(token)
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }

  async saveAppSettings(
    appName: string,
    resourceGroup: string,
    subscriptionId: string,
    appSettings: AzureStringDictionary,
    token?: string
  ): Promise<AzureStringDictionary> {
    const URL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${appName}/config/appsettings?api-version=2019-08-01`;

    if (!token) {
      token = await this.getToken();
    }
    try {
      const response: any = await axios.put(
        URL,
        appSettings,
        this.getHeaderConfig(token)
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }
}
