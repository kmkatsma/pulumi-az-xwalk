import * as azure from '@pulumi/azure';
import * as pulumi from '@pulumi/pulumi';
import {
  DeploymentContext,
  DeploymentSetting,
} from '../../core/deployment-context';
import { AppServiceUtil } from './app-service.util';
import { SqlDatabaseState } from '../sql-server/sql-server.config';
import {
  AppServiceSize,
  AppServiceState,
  AppServiceTier,
} from './app-service.config';

export interface AppServiceConfig {
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_TYPE: string;
  DB_USER: string;
  NODE_ENV: string;
  PORT: string;
  XDT_MicrosoftApplicationInsights_Mode: string;
  NODE_TLS_REJECT_UNAUTHORIZED: string;
  TENANT_ID: string;
  IDENTITY_ENDPOINT: string;
  ISSUER: string;
  CLIENT_ID: pulumi.Output<string>;
  ADMIN_CLIENT_ID: string;
  ADMIN_APP_SECRET: string;
  USER_GROUP_ID: string;
  APPINSIGHTS_INSTRUMENTATIONKEY?: pulumi.Output<string>;
  APPLICATIONINSIGHTS_CONNECTION_STRING?: pulumi.Output<string>;
}

export class AppServiceCrosswalk {
  static createFunctionServicePlan(rgNameRoot: string) {
    const rg = DeploymentContext.getCurrentResourceGroup();
    const name = `ASP-${DeploymentContext.Prefix}-${rgNameRoot}-${DeploymentContext.Stack}`.toUpperCase();
    const functionPlan = new azure.appservice.Plan(name, {
      name: name,
      location: rg.location,
      resourceGroupName: rg.name,
      reserved: true,
      kind: 'FunctionApp',
      sku: {
        tier: 'Dynamic',
        size: 'Y1',
      },
    });

    return functionPlan;
  }

  static createAppServicePlan(
    appRootName: string,
    planSize?: AppServiceSize,
    planTier?: AppServiceTier
  ) {
    this.setDefaults(planSize, planTier);

    const appServicePlan = AppServiceUtil.createAppServicePlan(
      appRootName,
      DeploymentContext.Settings[DeploymentSetting.PLAN_TIER],
      DeploymentContext.Settings[DeploymentSetting.PLAN_SIZE],
      DeploymentContext.getCurrentResourceGroup()
    );
    return appServicePlan;
  }

  private static setDefaults(
    planSize?: AppServiceSize,
    planTier?: AppServiceTier
  ) {
    if (planSize) {
      process.env.PLAN_SIZE = planSize;
    }
    if (planTier) {
      process.env.PLAN_TIER = planTier;
    }
    DeploymentContext.Settings[DeploymentSetting.PLAN_SIZE] = process.env
      .PLAN_SIZE
      ? process.env.PLAN_SIZE
      : AppServiceSize.F1;

    DeploymentContext.Settings[DeploymentSetting.PLAN_TIER] = process.env
      .PLAN_TIER
      ? process.env.PLAN_TIER
      : AppServiceTier.Free;
  }

  static createAppService(
    nameRoot: string,
    plan: azure.appservice.Plan,
    insights: azure.appinsights.Insights,
    dbState: SqlDatabaseState,
    clientId: pulumi.Output<string>,
    origin: pulumi.Output<string>
  ) {
    const appServiceNameRoot = `${nameRoot}API`;
    const state = new AppServiceState();
    const adminAPI = AppServiceUtil.createAppService(
      appServiceNameRoot,
      plan,
      DeploymentContext.getCurrentResourceGroup(),
      this.buildConfig(dbState, clientId, insights, origin),
      origin
    );
    state.url = pulumi.interpolate`https://${adminAPI.name}.azurewebsites.net`;
    state.name = adminAPI.name;
    return state;
  }

  private static buildConfig(
    dbState: SqlDatabaseState,
    clientId: pulumi.Output<string>,
    insights: azure.appinsights.Insights,
    origin: pulumi.Output<string>
  ) {
    const tenantId = DeploymentContext.Settings[DeploymentSetting.TENANT_ID];
    const appServiceConfig: AppServiceConfig = {
      DB_NAME: dbState.name,
      DB_PASSWORD: dbState.sqlConfig.password,
      DB_TYPE: 'mssql',
      DB_USER: dbState.sqlConfig.username,
      NODE_ENV: 'production',
      PORT: '3000',
      NODE_TLS_REJECT_UNAUTHORIZED: '1',
      XDT_MicrosoftApplicationInsights_Mode: 'default',
      TENANT_ID: tenantId,
      USER_GROUP_ID:
        DeploymentContext.Settings[DeploymentSetting.USER_GROUP_ID],
      IDENTITY_ENDPOINT: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
      ISSUER: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      CLIENT_ID: clientId,
      ADMIN_CLIENT_ID:
        DeploymentContext.Settings[DeploymentSetting.ADMIN_CLIENT_ID],
      ADMIN_APP_SECRET:
        DeploymentContext.Settings[DeploymentSetting.ADMIN_APP_SECRET],
    };

    const config = {
      AD_DOMAIN: '`%23EXT%23%40kmkatsmagmail.onmicrosoft.com',
      ADMIN_CLIENT_ID: appServiceConfig.ADMIN_CLIENT_ID,
      ADMIN_APP_SECRET: appServiceConfig.ADMIN_APP_SECRET,
      APPINSIGHTS_INSTRUMENTATIONKEY: insights.instrumentationKey,
      APPLICATIONINSIGHTS_CONNECTION_STRING: pulumi.interpolate`InstrumentationKey=${insights.instrumentationKey}`,
      ApplicationInsightsAgent_EXTENSION_VERSION: '~2',
      CLIENT_ID: appServiceConfig.CLIENT_ID,
      DB_NAME: appServiceConfig.DB_NAME,
      DB_PASSWORD: appServiceConfig.DB_PASSWORD,
      DB_TYPE: appServiceConfig.DB_TYPE,
      DB_USER: appServiceConfig.DB_USER,
      DB_URL: dbState.dbUrl,
      IDENTITY_ENDPOINT: appServiceConfig.IDENTITY_ENDPOINT,
      ISSUER: appServiceConfig.ISSUER,
      NODE_ENV: appServiceConfig.NODE_ENV,
      NODE_TLS_REJECT_UNAUTHORIZED: '1',
      ORIGIN: origin,
      PORT: appServiceConfig.PORT,
      TENANT_ID: appServiceConfig.TENANT_ID,
      XDT_MicrosoftApplicationInsights_Mode:
        appServiceConfig.XDT_MicrosoftApplicationInsights_Mode,
    };
    return config;
  }
}
