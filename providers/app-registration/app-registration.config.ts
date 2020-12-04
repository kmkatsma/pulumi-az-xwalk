import * as pulumi from '@pulumi/pulumi';

export enum AppRegistrationAuthorizationInputs {
  appId = 'appId',
  type = 'type',
  authorizedApp = 'authorizedApp',
  authorizedScope = 'authorizedScope',
  secret = 'secret',
  appRegistrationName = 'appRegistrationName',
}

export interface AppRegistrationAuthorizationArgs {
  [AppRegistrationAuthorizationInputs.appId]: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.type]: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.authorizedApp]?: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.authorizedScope]?: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.secret]?: pulumi.Input<boolean>;
  [AppRegistrationAuthorizationInputs.appRegistrationName]: string;
}

export enum AppRegistrationType {
  Api = 'api',
  Spa = 'spa',
}

export class AppRegistrationState {
  uiAppClientId!: pulumi.Output<string>;
  uiAppId!: pulumi.Output<string>;
  apiAppClientId!: pulumi.Output<string>;
  apiAppId!: pulumi.Output<string>;
  apiResourceScope!: string;
}

export enum AppRegistrationTagKey {
  HasSecret = 'hasSecret',
  SecretKeyId = 'secret-key-id',
}
