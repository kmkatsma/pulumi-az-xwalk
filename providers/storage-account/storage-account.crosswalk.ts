import * as pulumi from '@pulumi/pulumi';
import { DeploymentContext } from '../../core/deployment-context';
import { StorageAccountUtil } from './storage-account.util';
import {
  StorageAccountState,
  StorageAccountType,
} from './storage-account.config';

export class StorageAccountCrosswalk {
  static createStaticSite(rootName: string, prodUrl: string) {
    const saRootName = `${rootName}UI`;
    const saState = new StorageAccountState();

    saState.account = StorageAccountUtil.createStaticWebsiteSA(
      saRootName,
      DeploymentContext.getCurrentResourceGroup()
    );
    saState.name = StorageAccountUtil.createName(
      saRootName,
      StorageAccountType.StorageAccount
    );
    saState.url = pulumi.interpolate`https://${saState.name}.z19.web.core.windows.net`;
    if (DeploymentContext.Stack.toUpperCase() === 'PROD') {
      saState.url = pulumi.output(prodUrl);
    }
    return saState;
  }

  static createFunctionAppSA(functionAppRootName: string) {
    const saState = new StorageAccountState();
    const fullRootName = `${StorageAccountType.FunctionApp}${functionAppRootName}`;
    saState.account = StorageAccountUtil.createStorageAccount(
      fullRootName,
      DeploymentContext.getCurrentResourceGroup()
    );
    saState.name = StorageAccountUtil.createName(
      fullRootName,
      StorageAccountType.StorageAccount
    );
    return saState;
  }
}
