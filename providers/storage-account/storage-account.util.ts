import * as azure from '@pulumi/azure';
import { ResourceGroup } from '@pulumi/azure/core';
import { DeploymentContext } from '../../core/deployment-context';
import {
  defaultSAOptions,
  StorageAccountType,
  StorageOptions,
} from './storage-account.config';

export class StorageAccountUtil {
  static createName(rootName: string, type: string) {
    return `${type}${DeploymentContext.Prefix}${rootName}${DeploymentContext.Stack}`.toLowerCase();
  }

  static createStaticWebsiteSA(
    rootName: string,
    resourceGroup: azure.core.ResourceGroup
  ) {
    const saName = this.createName(rootName, 'sa');

    const storageAccount = new azure.storage.Account(saName, {
      name: saName,
      resourceGroupName: resourceGroup.name,
      accountReplicationType: 'LRS',
      accountTier: 'Standard',
      accountKind: 'StorageV2',
      staticWebsite: {
        indexDocument: 'index.html',
        error404Document: 'index.html',
      },
    });

    //TODO: CDN option
    return storageAccount;
  }

  static createStorageAccount(
    rootName: string,
    resourceGroup: ResourceGroup,
    optionsOverride?: StorageOptions
  ) {
    if (!optionsOverride) {
      optionsOverride = defaultSAOptions;
    }

    let options: azure.storage.AccountArgs = Object.assign(
      {},
      optionsOverride.pulumiArgs
    );
    options = Object.assign(options, {
      resourceGroupName: resourceGroup.name,
    });

    let saName = this.createName(rootName, StorageAccountType.StorageAccount);
    if (options.isHnsEnabled) {
      saName = this.createName(rootName, StorageAccountType.ADLS);
    }
    options = Object.assign(options, { name: saName });
    return new azure.storage.Account(saName, options);
  }
}
