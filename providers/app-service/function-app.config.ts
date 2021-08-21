import * as pulumi from '@pulumi/pulumi';
import * as azure_native from '@pulumi/azure-native';
import { AppServiceConfig } from './app-service.config';

export enum FunctionAppRuntime {
  DotNet = 'dotnet',
  Node = 'node',
}

export interface FunctionAppStandardConfig {
  APPINSIGHTS_INSTRUMENTATIONKEY: pulumi.Output<string>;
  APPLICATIONINSIGHTS_CONNECTION_STRING: pulumi.Output<string>;
  FUNCTIONS_EXTENSION_VERSION: string;
  FUNCTIONS_WORKER_RUNTIME: string;
  MSDEPLOY_RENAME_LOCKED_FILES: string;
  SCM_DO_BUILD_DURING_DEPLOYMENT: boolean;
  WEBSITE_RUN_FROM_PACKAGE: '1' | '0';
  WEBSITE_ENABLE_SYNC_UPDATE_SITE: '1' | '0';
  FUNCTIONS_WORKER_PROCESS_COUNT?: string;
  NODE_ENV?: string;
}

export interface FunctionAppCustomConfig extends AppServiceConfig {
  CONNECTION_STRING?: pulumi.Output<string>;
}

export interface FunctionAppGroupOptions {
  origin?: pulumi.Output<string>;
  insights?: azure_native.insights.Component;
}
