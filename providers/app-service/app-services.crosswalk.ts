import * as resources from '@pulumi/azure-native/resources';
import * as insights from '@pulumi/azure-native/insights';
import * as web from '@pulumi/azure-native/web';
import * as pulumi from '@pulumi/pulumi';
import {
  IDeploymentContext,
  DeploymentSetting,
} from '../../core/deployment-context';
import {
  AppServiceUtil,
  IAppServiceContainerOptions,
} from './app-service.util';
import {
  SqlDatabaseState,
  SqlServerBuilderState,
} from '../sql-server/sql-server.config';
import {
  AppServiceConfig,
  AppServiceSize,
  AppServiceStandardConfig,
  AppServiceState,
  AppServiceTier,
} from './app-service.config';
//import { StorageAccountUtil } from '../storage-account/storage-account.util';

export class AppServiceBuilder {
  static createAppServicePlan(
    deploymentContext: IDeploymentContext,
    resourceGroup: resources.ResourceGroup,
    planSize?: AppServiceSize,
    planTier?: AppServiceTier
  ) {
    this.setDefaults(deploymentContext, planSize, planTier);

    const appServicePlan = AppServiceUtil.createAppServicePlan(
      deploymentContext,
      deploymentContext.Settings[DeploymentSetting.PLAN_TIER],
      deploymentContext.Settings[DeploymentSetting.PLAN_SIZE],
      resourceGroup
    );
    return appServicePlan;
  }

  private static setDefaults(
    deploymentContext: IDeploymentContext,
    planSize?: AppServiceSize,
    planTier?: AppServiceTier
  ) {
    if (planSize) {
      process.env.PLAN_SIZE = planSize;
    }
    if (planTier) {
      process.env.PLAN_TIER = planTier;
    }
    deploymentContext.Settings[DeploymentSetting.PLAN_SIZE] = process.env
      .PLAN_SIZE
      ? process.env.PLAN_SIZE
      : AppServiceSize.F1;

    deploymentContext.Settings[DeploymentSetting.PLAN_TIER] = process.env
      .PLAN_TIER
      ? process.env.PLAN_TIER
      : AppServiceTier.Free;
  }

  static createAppService(
    appServiceNameRoot: string,
    deploymentContext: IDeploymentContext,
    resourceGroup: resources.ResourceGroup,
    plan: web.AppServicePlan,
    insightsComponent: insights.Component,
    dbState: SqlServerBuilderState,
    clientId: pulumi.Output<string>,
    origin: pulumi.Output<string>,
    containerOptions?: IAppServiceContainerOptions
  ) {
    const appServiceName = `${appServiceNameRoot}API`;
    const state = new AppServiceState();
    const api = AppServiceUtil.createAppService(
      appServiceName,
      deploymentContext,
      plan,
      resourceGroup,
      this.buildConfig(
        deploymentContext,
        dbState,
        clientId,
        insightsComponent,
        origin
      ),
      origin,
      containerOptions
    );
    state.app = api;
    state.url = pulumi.interpolate`https://${api.name}.azurewebsites.net`;
    state.name = api.name;
    return state;
  }

  private static buildConfig(
    deploymentContext: IDeploymentContext,
    dbState: SqlServerBuilderState,
    clientId: pulumi.Output<string>,
    insightsComponent: insights.Component,
    origin: pulumi.Output<string>
  ) {
    const appServiceConfig = this.buildCustomConfig(
      deploymentContext,
      dbState,
      clientId,
      origin
    );

    const sharedConfig: AppServiceStandardConfig = {
      NODE_ENV: 'production',
      APPINSIGHTS_INSTRUMENTATIONKEY: insightsComponent.instrumentationKey,
      APPLICATIONINSIGHTS_CONNECTION_STRING: pulumi.interpolate`InstrumentationKey=${insightsComponent.instrumentationKey}`,
      ApplicationInsightsAgent_EXTENSION_VERSION: '~2',
      NODE_TLS_REJECT_UNAUTHORIZED: '1',
      XDT_MicrosoftApplicationInsights_Mode: 'default',
    };

    const config = Object.assign(appServiceConfig, sharedConfig);

    return config;
  }

  static buildCustomConfig(
    deploymentContext: IDeploymentContext,
    dbState: SqlServerBuilderState,
    clientId?: pulumi.Output<string>,
    origin?: pulumi.Output<string>
  ) {
    const tenantId = deploymentContext.Settings[DeploymentSetting.TENANT_ID];

    const appServiceConfig: AppServiceConfig = {
      AD_DOMAIN: '',
      DB_NAME: dbState.sqlDatabaseState.name,
      // DB_PASSWORD: dbState.sqlConfig.password,
      DB_TYPE: 'mssql',
      DB_URL: dbState.sqlServerState.dbUrl,
      //DB_USER: dbState.sqlConfig.username,
      PORT: '3000',
      TENANT_ID: tenantId,
      USER_GROUP_ID:
        deploymentContext.Settings[DeploymentSetting.USER_GROUP_ID],
      IDENTITY_ENDPOINT: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
      ISSUER: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      CLIENT_ID: clientId,
      ARM_CLIENT_ID:
        deploymentContext.Settings[DeploymentSetting.ARM_CLIENT_ID],
      ARM_CLIENT_SECRET:
        deploymentContext.Settings[DeploymentSetting.ARM_CLIENT_SECRET],
      ORIGIN: origin,
    };
    return appServiceConfig;
  }
}
