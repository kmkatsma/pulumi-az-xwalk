import { GraphUtil } from '../../az-access/graph.util';
import { AzureAdApp } from '../../az-access/graph.models';
import {
  DeploymentContext,
  DeploymentSetting,
} from '../../core/deployment-context';
import {
  AppRegistrationAuthorizationInputs,
  AppRegistrationTagKey,
  AppRegistrationType,
} from './app-registration.config';

export class AppRegistrationAuthorizationUtil {
  static Input = AppRegistrationAuthorizationInputs;

  static async executeUpdate(inputs: any) {
    const token = await GraphUtil.getToken(
      DeploymentContext.Settings[DeploymentSetting.ADMIN_APP_SECRET],
      DeploymentContext.Settings[DeploymentSetting.ADMIN_CLIENT_ID],
      DeploymentContext.Settings[DeploymentSetting.TENANT_ID]
    );

    const app: AzureAdApp = await GraphUtil.getApplication(
      inputs[this.Input.appId],
      token
    );
    const body: AzureAdApp = { web: { redirectUris: [] } };

    //assign authorized app
    if (inputs[this.Input.type] === AppRegistrationType.Api) {
      this.configureApiApp(inputs, body, app);
    }

    //spa
    if (inputs[this.Input.type] === AppRegistrationType.Spa) {
      this.configureSpaApp(body, app);
    }

    //update application
    await this.updateApplication(inputs, body, app, token);

    return;
  }

  private static configureApiApp(
    inputs: any,
    body: AzureAdApp,
    existingApp: AzureAdApp
  ) {
    if (existingApp.tags && existingApp.tags.length === 0) {
      body.tags = ['notApiConsumer', 'webApi'];
    } else {
      body.tags = existingApp.tags;
    }
    this.trySetPreauth(inputs, existingApp);

    body.api = existingApp.api;
    if (body.api) {
      body.api.requestedAccessTokenVersion = 2;
    }

    //handle implicit flow
    if (body.web) {
      body.web.implicitGrantSettings = {
        enableAccessTokenIssuance: false,
        enableIdTokenIssuance: false,
      };
    }
    if (existingApp.api) {
      console.log('preauth', existingApp.api.preAuthorizedApplications);
    }
  }

  private static configureSpaApp(body: AzureAdApp, existingApp: AzureAdApp) {
    body.tags = ['apiConsumer', 'singlePageApp'];

    //handle implicit flow
    if (existingApp.web) {
      existingApp.web.implicitGrantSettings = {
        enableAccessTokenIssuance: true,
        enableIdTokenIssuance: true,
      };
    }
    body.web = existingApp.web;
  }

  private static async updateApplication(
    inputs: any,
    body: AzureAdApp,
    app: AzureAdApp,
    token: string
  ) {
    if (
      body.api ||
      body.tags ||
      body.web ||
      body.oauth2AllowIdTokenImplicitFlow ||
      body.oauth2AllowImplicitFlow
    ) {
      await this.tryRemoveSecret(inputs, body, app, token);
      await this.tryAddSecret(inputs, body, app, token);
      await GraphUtil.updateApplication(inputs[this.Input.appId], body, token);
    }
  }

  private static async tryAddSecret(
    inputs: any,
    body: AzureAdApp,
    app: AzureAdApp,
    token: string
  ) {
    console.log('try add secret', inputs[this.Input.secret], app.tags);
    if (
      inputs[this.Input.secret] &&
      app.tags &&
      app.tags.indexOf(AppRegistrationTagKey.HasSecret) < 0
    ) {
      console.log('adding secret');
      const secretValue = await GraphUtil.addPassword(
        inputs[this.Input.appId],
        'api secret',
        token
      );
      if (body.tags) {
        console.log('adding tages');
        body.tags.push(AppRegistrationTagKey.HasSecret);
        body.tags.push(
          `${AppRegistrationTagKey.SecretKeyId}:${secretValue.keyId}`
        );
      }
    }
  }
  private static async tryRemoveSecret(
    inputs: any,
    body: AzureAdApp,
    app: AzureAdApp,
    token: string
  ) {
    console.log('try remove secret', inputs[this.Input.secret], app.tags);
    if (
      !inputs[this.Input.secret] &&
      app.tags &&
      app.tags.indexOf(AppRegistrationTagKey.HasSecret) >= 0
    ) {
      let keyId = '';
      app.tags.forEach((p) => {
        if (p.startsWith(AppRegistrationTagKey.SecretKeyId)) {
          const values = p.split(':');
          keyId = values[1];
        }
      });
      console.log('keyid', keyId);
      if (keyId) {
        await GraphUtil.deletePassword(inputs[this.Input.appId], keyId, token);
        body.tags = ['notApiConsumer', 'webApi'];
      }
    }
  }

  private static trySetPreauth(inputs: any, existingApp: AzureAdApp) {
    if (
      inputs[this.Input.authorizedApp] &&
      inputs[this.Input.authorizedScope] &&
      existingApp.api &&
      existingApp.api.oauth2PermissionScopes &&
      existingApp.api.oauth2PermissionScopes.length > 0
    ) {
      const permId = existingApp.api.oauth2PermissionScopes[0].id;
      existingApp.api.preAuthorizedApplications = [
        {
          appId: inputs[this.Input.authorizedApp],
          delegatedPermissionIds: [permId],
        },
      ];
    }
  }

  static createAppRegistrationOutput(inputs: any) {
    return {
      outs: { ...inputs },
    };
  }
}
