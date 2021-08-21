import * as pulumi from '@pulumi/pulumi';
import { IDeploymentContext } from '../../core/deployment-context';

export enum AppRegistrationAuthorizationInputs {
  appId = 'appId',
  type = 'type',
  authorizedApp = 'authorizedApp',
  authorizedScope = 'authorizedScope',
  secret = 'secret',
  appRegistrationName = 'appRegistrationName',
  deploymentContext = 'deploymentContext',
}

export interface AppRegistrationAuthorizationProviderArgs {
  [AppRegistrationAuthorizationInputs.appId]: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.type]: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.authorizedApp]?: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.authorizedScope]?: pulumi.Input<string>;
  [AppRegistrationAuthorizationInputs.secret]?: pulumi.Input<boolean>;
  [AppRegistrationAuthorizationInputs.appRegistrationName]: pulumi.Input<
    string
  >;
  deploymentContext: IDeploymentContext;
}

export interface AppRegistrationAuthorizationArgs {
  [AppRegistrationAuthorizationInputs.appId]: string;
  [AppRegistrationAuthorizationInputs.type]: string;
  [AppRegistrationAuthorizationInputs.authorizedApp]?: string;
  [AppRegistrationAuthorizationInputs.authorizedScope]?: string;
  [AppRegistrationAuthorizationInputs.secret]?: boolean;
  [AppRegistrationAuthorizationInputs.appRegistrationName]: string;
  deploymentContext: IDeploymentContext;
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
