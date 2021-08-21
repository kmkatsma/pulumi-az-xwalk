import * as azure_native from '@pulumi/azure-native';
import * as azure_web from '@pulumi/azure-native/web';
import * as pulumi from '@pulumi/pulumi';
import { IDeploymentContext } from '../../core/deployment-context';
import { AppServiceUtil } from './app-service.util';
import { SqlDatabaseState } from '../sql-server/sql-server.config';
import { AppServiceState } from './app-service.config';
import { StorageAccountState } from '../storage-account/storage-account.config';
import { StorageAccountUtil } from '../storage-account/storage-account.util';
import {
  FunctionAppRuntime,
  FunctionAppStandardConfig,
  FunctionAppGroupOptions,
} from './function-app.config';
import { AppServiceBuilder } from './app-services.crosswalk';
import { AppInsightsUtil } from '../app-insights/app-insights.util';

/*export class FunctionAppBuilder {
  static createFunctionAppGroup(
    functionAppNameRoot: string,
    rgNameRoot: string,
    runtime: FunctionAppRuntime,
    dbState: SqlDatabaseState,
    options?: FunctionAppGroupOptions
  ) {
    const group = DeploymentContext.getCurrentResourceGroup();
    let insights: azure_native.insights.Component;
    if (options?.insights) {
      insights = options.insights;
    } else {
      insights = AppInsightsUtil.create(rgNameRoot, group);
    }
    const funcPlan = AppServiceUtil.createFunctionServicePlan(rgNameRoot);
    const funcSA = StorageAccountUtil.createFunctionAppSA(functionAppNameRoot);
    const funcApp = this.createFunctionApp(
      functionAppNameRoot,
      runtime,
      funcPlan,
      insights,
      funcSA,
      dbState,
      options?.origin
    );
  }

  static createFunctionApp(
    nameRoot: string,
    runtime: FunctionAppRuntime,
    plan: azure_web.AppServicePlan,
    insights: azure_native.insights.Component,
    storageAccount: StorageAccountState,
    dbState: SqlDatabaseState,
    origin?: pulumi.Output<string>
  ) {
    const group = DeploymentContext.getCurrentResourceGroup();

    const state = new AppServiceState();
    const functionApp = AppServiceUtil.createFunctionApp(
      nameRoot,
      runtime,
      plan,
      group,
      storageAccount.account,
      this.buildConfig(dbState, insights, runtime),
      this.buildConnections(dbState),
      'linux',
      origin
    );
    state.url = pulumi.interpolate`https://${functionApp.name}.azurewebsites.net`;
    state.name = functionApp.name;
  }

  static buildConnections(dbState: SqlDatabaseState): any[] {
    const connections = [
      {
        name: DeploymentContext.Prefix,
        type: 'SQLAzure',
        value: this.getConnectionString(dbState),
      },
    ];
    return connections;
  }

  private static getConnectionString(dbState: SqlDatabaseState) {
    //TODO: managed identity options - Server=tcp:xxxx;Database=OCW;
    const conn = pulumi.interpolate`Server=tcp:${dbState.dbUrl},1433;Initial Catalog=ocw;Persist Security Info=False;User ID=${dbState.sqlConfig.username};Password=${dbState.sqlConfig.password};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`;
    return conn;
  }

  private static getAppInsightsConnectionString(key: pulumi.Output<string>) {
    const conn = pulumi.interpolate`InstrumentationKey=${key};IngestionEndpoint=https://centralus-0.in.applicationinsights.azure.com/`;
    return conn;
  }

  static buildConfig(
    dbState: SqlDatabaseState,
    insights: azure_native.insights.Component,
    runtime: FunctionAppRuntime,
    clientId?: pulumi.Output<string>,
    origin?: pulumi.Output<string>
  ) {
    const appServiceConfig: FunctionAppStandardConfig = {
      APPINSIGHTS_INSTRUMENTATIONKEY: insights.instrumentationKey,
      APPLICATIONINSIGHTS_CONNECTION_STRING: this.getAppInsightsConnectionString(
        insights.instrumentationKey
      ),
      FUNCTIONS_EXTENSION_VERSION: '~3',
      FUNCTIONS_WORKER_RUNTIME: runtime,
      MSDEPLOY_RENAME_LOCKED_FILES: '1',
      SCM_DO_BUILD_DURING_DEPLOYMENT: false,
      WEBSITE_RUN_FROM_PACKAGE: '1',
      WEBSITE_ENABLE_SYNC_UPDATE_SITE: '0',
    };
    if (runtime === FunctionAppRuntime.Node) {
      appServiceConfig.NODE_ENV = 'production';
      appServiceConfig.FUNCTIONS_WORKER_PROCESS_COUNT = '10';
    }

    const customConfig = AppServiceBuilder.buildCustomConfig(
      dbState,
      clientId,
      origin
    );
    customConfig.CONNECTION_STRING = this.getConnectionString(dbState);

    const config = Object.assign(appServiceConfig, customConfig);
    return config;
  }
}*/
