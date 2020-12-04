import axios from 'axios';
import * as qs from 'qs';
import {
  AzAdInvitationResponse,
  AzAdInvitedUser,
  AzAdPasswordCredential,
  AzAdPasswordCredentialData,
  AzureAdApp,
} from './graph.models';
import { AzSettingsUtil } from './as-settings.util';
import { AzureSettingsKeys } from './az-settings.config';

export class GraphUtil {
  private static getHeaderConfig(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  static async getToken(
    secret?: string,
    adminClientId?: string,
    tenantId?: string
  ) {
    const APP_SECRET = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.ADMIN_APP_SECRET,
      secret
    );
    const ADMIN_CLIENT_ID = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.ADMIN_CLIENT_ID,
      adminClientId
    );
    const TENANT_ID = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.TENANT_ID,
      tenantId
    );

    const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

    const postData = {
      client_id: ADMIN_CLIENT_ID,
      scope: MS_GRAPH_SCOPE,
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

  static async addToGroup(id: string, token?: string) {
    const GROUP_ID = AzSettingsUtil.getAZSetting(
      AzureSettingsKeys.USER_GROUP_ID
    );
    const GROUP_ENDPOINT = `https://graph.microsoft.com/v1.0/groups/${GROUP_ID}/members/$ref`;
    const body = {
      '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${id}`,
    };
    if (!token) {
      token = await this.getToken();
    }
    console.log('token', token);
    let response: any;

    try {
      response = await axios.post(
        GROUP_ENDPOINT,
        body,
        this.getHeaderConfig(token)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
    console.log('add group response', response.data);
  }

  static async inviteUser(emailAddress: string): Promise<AzAdInvitedUser> {
    const INVITE_ENDPOINT = 'https://graph.microsoft.com/v1.0/invitations';
    const token = await this.getToken();

    const body = {
      invitedUserEmailAddress: emailAddress,
      inviteRedirectUrl: 'https://www.opencasework.com',
      sendInvitationMessage: true,
      //customizedMessageBody
    };

    let inviteResponse: AzAdInvitationResponse;
    let response: any;

    try {
      response = await axios.post(
        INVITE_ENDPOINT,
        body,
        this.getHeaderConfig(token)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }

    console.log('invite response', response.data);
    inviteResponse = response.data;
    return inviteResponse.invitedUser;
  }

  static async deleteUser(userId: string) {
    const URL = `https://graph.microsoft.com/v1.0/users/${userId}`;
    const token = await this.getToken();

    const response = await axios.delete(URL, this.getHeaderConfig(token));
    console.log(response.data);
    return;
  }

  static async getUser(email: string) {
    const AD_DOMAIN = AzSettingsUtil.getAZSetting(AzureSettingsKeys.AD_DOMAIN);
    const principalName = `${email.replace('@', '_')}${AD_DOMAIN}`;
    const URL = `https://graph.microsoft.com/v1.0/users/${principalName}`;
    const token = await this.getToken();

    try {
      const response = await axios.get(URL, this.getHeaderConfig(token));
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }

  static async getApplication(id: string, token?: string) {
    const URL = `https://graph.microsoft.com/v1.0/applications/${id}`;
    if (!token) {
      token = await this.getToken();
    }

    try {
      const response = await axios.get(URL, this.getHeaderConfig(token));
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }

  static async updateApplication(id: string, app: AzureAdApp, token?: string) {
    const URL = `https://graph.microsoft.com/v1.0/applications/${id}`;
    if (!token) {
      token = await this.getToken();
    }
    console.log('app to save', app);
    try {
      const response: any = await axios.patch(
        URL,
        app,
        this.getHeaderConfig(token)
      );
      //console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }

  static async addPassword(
    id: string,
    name: string,
    token?: string
  ): Promise<AzAdPasswordCredentialData> {
    const URL = `https://graph.microsoft.com/v1.0/applications/${id}/addPassword`;
    if (!token) {
      token = await this.getToken();
    }
    try {
      const body: AzAdPasswordCredential = {
        displayName: name,
        endDateTime: '2035-01-01T00:00:00Z',
      };
      const response: any = await axios.post(
        URL,
        body,
        this.getHeaderConfig(token)
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async deletePassword(
    id: string,
    keyId: string,
    token?: string
  ): Promise<AzAdPasswordCredentialData> {
    const URL = `https://graph.microsoft.com/v1.0/applications/${id}/removePassword`;
    if (!token) {
      token = await this.getToken();
    }
    try {
      const body = {
        keyId: keyId,
      };
      const response: any = await axios.post(
        URL,
        body,
        this.getHeaderConfig(token)
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
