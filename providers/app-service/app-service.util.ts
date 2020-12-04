import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure';
import { DeploymentContext } from '../../core/deployment-context';

export class AppServiceUtil {
  static createAppServicePlan(
    rootName: string,
    tier: string,
    size: string,
    resourceGroup: azure.core.ResourceGroup
  ) {
    const name = `ASP-${DeploymentContext.Prefix}-${rootName}-${DeploymentContext.Stack}-01`.toUpperCase();

    const appServicePlan = new azure.appservice.Plan(name, {
      name: name,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      kind: 'Linux',
      reserved: true,
      sku: {
        tier: tier,
        size: size,
      },
    });

    return appServicePlan;
  }

  static createAppService(
    rootName: string,
    appServicePlan: azure.appservice.Plan,
    resourceGroup: azure.core.ResourceGroup,
    appServiceConfig: any,
    origin: pulumi.Output<string>
  ) {
    const name = `AS-${DeploymentContext.Prefix}-${rootName}-${DeploymentContext.Stack}`.toUpperCase();

    const appService = new azure.appservice.AppService(
      name,
      {
        name: name,
        resourceGroupName: resourceGroup.name,
        location: resourceGroup.location,
        appServicePlanId: appServicePlan.id,
        siteConfig: {
          cors: { allowedOrigins: [origin], supportCredentials: true },
        },
        logs: {
          httpLogs: { fileSystem: { retentionInDays: 14, retentionInMb: 35 } },
        },
        appSettings: appServiceConfig,
      },
      { ignoreChanges: ['appSettings'] }
    );

    return appService;
  }

  static createFunctionApp(
    rootName: string,
    appServicePlan: azure.appservice.Plan,
    resourceGroup: azure.core.ResourceGroup,
    storageAccount: azure.storage.Account,
    appServiceConfig: any,
    connectionStrings: any,
    osType: string,
    origin: pulumi.Output<string> | null
  ) {
    const name = `FA-${DeploymentContext.Prefix}-${rootName}-${DeploymentContext.Stack}`.toUpperCase();
    let siteConfig = {};
    if (origin) {
      siteConfig = {
        alwaysOn: false,
        cors: { allowedOrigins: [origin], supportCredentials: true },
        httpsOnly: true,
      };
    } else {
      siteConfig = {
        alwaysOn: false,
        httpsOnly: true,
      };
    }

    const appService = new azure.appservice.FunctionApp(
      name,
      {
        name: name,
        resourceGroupName: resourceGroup.name,
        location: resourceGroup.location,
        appServicePlanId: appServicePlan.id,
        httpsOnly: true,
        appSettings: appServiceConfig,
        version: '~3',
        storageAccountName: storageAccount.name,
        storageAccountAccessKey: storageAccount.primaryAccessKey,
        osType: osType,
        connectionStrings: connectionStrings,
        siteConfig: siteConfig,
      },
      { ignoreChanges: ['appSettings'] }
    );

    return appService;
  }
}
