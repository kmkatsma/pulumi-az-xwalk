import * as pulumi from '@pulumi/pulumi';
import * as resource from '@pulumi/azure-native/resources';
import * as web from '@pulumi/azure-native/web';
import { IDeploymentContext } from '../../core/deployment-context';

export interface IAppServiceContainerOptions {
  port: string;
  containerImage: string;
  adminPassword: string | pulumi.Output<string>;
  adminUsername: string | pulumi.Output<string>;
  loginServer: pulumi.Output<string>;
}

export class AppServiceUtil {
  static createAppServicePlan(
    deploymentContext: IDeploymentContext,
    tier: string,
    size: string,
    resourceGroup: resource.ResourceGroup
  ) {
    const name = `ASP-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${deploymentContext.Stack}-01`.toUpperCase();

    const appServicePlan = new web.AppServicePlan(name, {
      name: name,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      kind: 'Linux',
      reserved: true,
      sku: {
        tier: tier,
        name: size,
      },
    });

    return appServicePlan;
  }

  static createAppService(
    appServiceNameRoot: string,
    deploymentContext: IDeploymentContext,
    appServicePlan: web.AppServicePlan,
    resourceGroup: resource.ResourceGroup,
    appServiceConfig: any,
    origin: pulumi.Output<string>,
    containerOptions?: IAppServiceContainerOptions
  ) {
    const name = `AS-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${appServiceNameRoot}-${deploymentContext.Stack}`.toUpperCase();

    if (containerOptions) {
      const containerSettings = {
        WEBSITES_ENABLE_APP_SERVICE_STORAGE: 'false',
        DOCKER_REGISTRY_SERVER_URL: pulumi.interpolate`https://${containerOptions.loginServer}`,
        DOCKER_REGISTRY_SERVER_USERNAME: containerOptions.adminUsername,
        DOCKER_REGISTRY_SERVER_PASSWORD: containerOptions.adminPassword,
        WEBSITES_PORT: containerOptions.port,
      };
      appServiceConfig = Object.assign(appServiceConfig, containerSettings);
    }

    const appService = new web.WebApp(
      name,
      {
        name: name,
        resourceGroupName: resourceGroup.name,
        location: resourceGroup.location,
        serverFarmId: appServicePlan.id,
        siteConfig: {
          cors: { allowedOrigins: [origin], supportCredentials: true },
          linuxFxVersion: containerOptions?.containerImage,
          appSettings: appServiceConfig,
        },
        httpsOnly: true,
        identity: {
          type: 'SystemAssigned',
        },

        //logs: {
        //  httpLogs: { fileSystem: { retentionInDays: 14, retentionInMb: 35 } },
        //},
      }
      // { ignoreChanges: ['appSettings'] }
    );

    return appService;
  }

  /*
  
const imageInDockerHub = 'microsoft/azure-appservices-go-quickstart';
const getStartedApp = new azure.appservice.AppService(
  'as-ocw-sample-container',
  {
    resourceGroupName: resourceGroup.name,
    appServicePlanId: plan.id,
    appSettings: {
      WEBSITES_ENABLE_APP_SERVICE_STORAGE: 'false',
      DOCKER_REGISTRY_SERVER_URL: pulumi.interpolate`https://${registry.loginServer}`,
      DOCKER_REGISTRY_SERVER_USERNAME: registry.adminUsername,
      DOCKER_REGISTRY_SERVER_PASSWORD: registry.adminPassword,
      WEBSITES_PORT: '3000', // Our custom image exposes port 80. Adjust for your app as needed.
    },
    siteConfig: {
      alwaysOn: true,
      linuxFxVersion: `DOCKER|${imageInDockerHub}`,
    },
    httpsOnly: true,
  },
  { ignoreChanges: ['siteConfig'] }
);

export const getStartedEndpoint = pulumi.interpolate`https://${getStartedApp.defaultSiteHostname}`;
*/

  /*static createFunctionServicePlan(deploymentContext: IDeploymentContext) {
    const rg = DeploymentContext.getCurrentResourceGroup();
    const name = `ASP-${DeploymentContext.Prefix}-${rgNameRoot}-${DeploymentContext.Stack}`.toUpperCase();
    const functionPlan = new web.AppServicePlan(name, {
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

  static createFunctionApp(
    rootName: string,
    runtime: FunctionAppRuntime,
    appServicePlan: web.AppServicePlan,
    resourceGroup: azure_native.resources.ResourceGroup,
    storageAccount: azure_native.storage.StorageAccount,
    appServiceConfig: any,
    connectionStrings: any,
    osType: string,
    origin?: pulumi.Output<string>
  ) {
    const name = `FA-${DeploymentContext.Prefix}-${rootName}-${DeploymentContext.Stack}`.toUpperCase();
    let siteConfig = {};
    if (origin) {
      siteConfig = {
        alwaysOn: false,
        cors: { allowedOrigins: [origin], supportCredentials: true },
        //httpsOnly: true,
        appSettings: appServiceConfig,
      };
    } else {
      siteConfig = {
        alwaysOn: false,
        //httpsOnly: true,
        appSettings: appServiceConfig,
      };
    }
    console.log('connection strings', connectionStrings);
    const appService = new web.WebApp(
      name,
      {
        name: name,
        resourceGroupName: resourceGroup.name,
        location: resourceGroup.location,
        serverFarmId: appServicePlan.id,
        httpsOnly: true,
        // version: '~3',
        // storageAccountName: storageAccount.name,
        // storageAccountAccessKey: storageAccount.primaryAccessKey,
        //  osType: osType,
        // connectionStrings: connectionStrings,
        siteConfig: siteConfig,
      },
      { ignoreChanges: ['appSettings'] }
    );

    return appService;
  }*/
}
