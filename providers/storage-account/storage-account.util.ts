import * as storage from '@pulumi/azure-native/storage';
import * as resources from '@pulumi/azure-native/resources';
import { IDeploymentContext } from '../../core/deployment-context';
import {
  defaultSAOptions,
  StorageAccountState,
  StorageAccountType,
  StorageOptions,
} from './storage-account.config';

export class StorageAccountUtil {
  static createName(
    rootName: string,
    type: string,
    deploymentContext: IDeploymentContext
  ) {
    return `${type}${deploymentContext.Prefix}${deploymentContext.groupRootName}${rootName}${deploymentContext.Stack}`.toLowerCase();
  }

  static createStaticWebsiteSA(
    rootName: string,
    resourceGroup: resources.ResourceGroup,
    deploymentContext: IDeploymentContext
  ) {
    const saName = this.createName(rootName, 'sa', deploymentContext);

    const storageAccount = new storage.StorageAccount(saName, {
      accountName: saName,
      resourceGroupName: resourceGroup.name,
      enableHttpsTrafficOnly: true,
      kind: storage.Kind.StorageV2,
      sku: {
        name: storage.SkuName.Standard_LRS,
      },
    });

    //TODO: CDN option
    return storageAccount;
  }

  static createStaticWebsite(
    state: StorageAccountState,
    resourceGroup: resources.ResourceGroup
  ) {
    const staticWebsite = new storage.StorageAccountStaticWebsite(state.name, {
      accountName: state.account.name,
      resourceGroupName: resourceGroup.name,
      indexDocument: 'index.html',
      error404Document: 'index.html',
    });
    return staticWebsite;
  }

  static createStorageAccount(
    rootName: string,
    resourceGroup: resources.ResourceGroup,
    deploymentContext: IDeploymentContext,
    optionsOverride?: StorageOptions
  ) {
    if (!optionsOverride) {
      optionsOverride = defaultSAOptions;
    }

    let saName = this.createName(
      rootName,
      StorageAccountType.StorageAccount,
      deploymentContext
    );
    if (optionsOverride?.isHnsEnabled) {
      saName = this.createName(
        rootName,
        StorageAccountType.ADLS,
        deploymentContext
      );
    }

    const storageAccount = new storage.StorageAccount(saName, {
      accountName: saName,
      resourceGroupName: resourceGroup.name,
      isHnsEnabled: optionsOverride?.isHnsEnabled ?? false,
      enableHttpsTrafficOnly: true,
      kind: storage.Kind.StorageV2,
      sku: {
        name: storage.SkuName.Standard_LRS,
      },
    });
    return storageAccount;
  }

  static createFunctionAppSA(
    functionAppRootName: string,
    resourceGroup: resources.ResourceGroup,
    deploymentContext: IDeploymentContext
  ) {
    const saState = new StorageAccountState();
    const fullRootName = `${StorageAccountType.FunctionApp}${functionAppRootName}`;
    saState.account = StorageAccountUtil.createStorageAccount(
      fullRootName,
      resourceGroup,
      deploymentContext
    );
    saState.name = StorageAccountUtil.createName(
      fullRootName,
      StorageAccountType.StorageAccount,
      deploymentContext
    );
    return saState;
  }
}
