import * as pulumi from '@pulumi/pulumi';
import * as web from '@pulumi/azure-native/web';

export class AppServiceState {
  url!: pulumi.Output<string>;
  name!: pulumi.Output<string>;
  app!: web.WebApp;
}

export enum AppServiceSize {
  F1 = 'F1',
  B1 = 'B1',
}

export enum AppServiceTier {
  Free = 'Free',
  Basic = 'Basic',
}

export interface AppServiceConfig {
  AD_DOMAIN?: string;
  ARM_CLIENT_SECRET?: string;
  ARM_CLIENT_ID?: string;
  CLIENT_ID?: pulumi.Output<string>;
  CONNECTION_STRING?: pulumi.Output<string>;
  DB_NAME?: string;
  DB_PASSWORD?: string;
  DB_TYPE?: string;
  DB_URL?: pulumi.Output<string>;
  DB_USER?: string;
  IDENTITY_ENDPOINT?: string;
  ISSUER?: string;
  ORIGIN?: pulumi.Output<string>;
  PORT?: string;
  TENANT_ID?: string;
  USER_GROUP_ID?: string;
}

export interface AppServiceStandardConfig {
  APPINSIGHTS_INSTRUMENTATIONKEY?: pulumi.Output<string>;
  APPLICATIONINSIGHTS_CONNECTION_STRING?: pulumi.Output<string>;
  ApplicationInsightsAgent_EXTENSION_VERSION: string;
  NODE_ENV: string;
  XDT_MicrosoftApplicationInsights_Mode: string;
  NODE_TLS_REJECT_UNAUTHORIZED: string;
}
