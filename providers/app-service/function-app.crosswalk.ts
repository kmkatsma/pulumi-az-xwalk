import * as azure from '@pulumi/azure';
import * as pulumi from '@pulumi/pulumi';
import { DeploymentContext } from '../../core/deployment-context';
import { AppServiceUtil } from './app-service.util';
import { SqlDatabaseState } from '../sql-server/sql-server.config';
import { AppServiceState } from './app-service.config';
import { StorageAccountState } from '../storage-account/storage-account.config';

export class FunctionAppCrosswalk {
  static createDotNetFunctionApp(
    nameRoot: string,
    plan: azure.appservice.Plan,
    insights: azure.appinsights.Insights,
    storageAccount: StorageAccountState,
    dbState: SqlDatabaseState,
    origin: pulumi.Output<string> | null
  ) {
    const group = DeploymentContext.getCurrentResourceGroup();

    const state = new AppServiceState();
    const functionApp = AppServiceUtil.createFunctionApp(
      nameRoot,
      plan,
      DeploymentContext.getCurrentResourceGroup(),
      storageAccount.account,
      this.buildConfig(dbState, insights),
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

  static buildConfig(
    dbState: SqlDatabaseState,
    insights: azure.appinsights.Insights
  ) {
    const appServiceConfig = {
      APPINSIGHTS_INSTRUMENTATIONKEY: insights.instrumentationKey,
      APPLICATIONINSIGHTS_CONNECTION_STRING: pulumi.interpolate`InstrumentationKey=${insights.instrumentationKey};IngestionEndpoint=https://centralus-0.in.applicationinsights.azure.com/`,
      FUNCTIONS_EXTENSION_VERSION: '~3',
      FUNCTIONS_WORKER_RUNTIME: 'dotnet',
      MSDEPLOY_RENAME_LOCKED_FILES: '1',
      SCM_DO_BUILD_DURING_DEPLOYMENT: false,
      WEBSITE_RUN_FROM_PACKAGE: '1',
      WEBSITE_ENABLE_SYNC_UPDATE_SITE: '0',
      CONNECTION_STRING: this.getConnectionString(dbState),
    };
    return appServiceConfig;
  }
}
