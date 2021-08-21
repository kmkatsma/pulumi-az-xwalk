import * as pulumi from '@pulumi/pulumi';
import * as storage from '@pulumi/azure-native/storage';

export interface StorageOptions {
  index: number;
  isStaticWebsite: boolean;
  resourceGroupName: '';
  accountReplicationType: 'LRS';
  accountTier: 'Standard';
  accountKind: 'StorageV2';
  isHnsEnabled?: boolean;
}

export const defaultArgs = {
  resourceGroupName: '',
  accountReplicationType: 'LRS',
  accountTier: 'Standard',
  accountKind: 'StorageV2',
};

export const defaultSAOptions: StorageOptions = {
  index: 1,
  isStaticWebsite: false,
  resourceGroupName: '',
  accountReplicationType: 'LRS',
  accountTier: 'Standard',
  accountKind: 'StorageV2',
};

export enum StorageAccountType {
  StorageAccount = 'sa',
  FunctionApp = 'fa',
  ADLS = 'adls',
}

export class StorageAccountState {
  name!: string;
  url!: pulumi.Output<string>;
  account!: storage.StorageAccount;
}
