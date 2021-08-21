import * as pulumi from '@pulumi/pulumi';
import * as resources from '@pulumi/azure-native/resources';
import { IDeploymentContext } from '../../core/deployment-context';
import { StorageAccountUtil } from './storage-account.util';
import {
  StorageAccountState,
  StorageAccountType,
} from './storage-account.config';

export class StorageAccountBuilder {
  static createStaticSite(
    rootName: string,
    prodUrl: string,
    deploymentContext: IDeploymentContext,
    resourceGroup: resources.ResourceGroup
  ) {
    const saRootName = `${rootName}UI`;
    const saState = new StorageAccountState();

    saState.account = StorageAccountUtil.createStaticWebsiteSA(
      saRootName,
      resourceGroup,
      deploymentContext
    );
    saState.name = StorageAccountUtil.createName(
      saRootName,
      StorageAccountType.StorageAccount,
      deploymentContext
    );
    saState.url = pulumi.interpolate`https://${saState.name}.z19.web.core.windows.net`;
    if (deploymentContext.Stack.toUpperCase() === 'PROD') {
      saState.url = pulumi.output(prodUrl);
    }

    StorageAccountUtil.createStaticWebsite(saState, resourceGroup);
    // Web endpoint to the website

    return saState;
  }
}
