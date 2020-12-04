import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure';

export interface StorageOptions {
  index: number;
  isStaticWebsite: boolean;
  pulumiArgs: azure.storage.AccountArgs;
}

export const defaultArgs: azure.storage.AccountArgs = {
  resourceGroupName: '',
  accountReplicationType: 'LRS',
  accountTier: 'Standard',
  accountKind: 'StorageV2',
};

export const defaultSAOptions: StorageOptions = {
  index: 1,
  isStaticWebsite: false,
  pulumiArgs: defaultArgs,
};

export enum StorageAccountType {
  StorageAccount = 'sa',
  FunctionApp = 'fa',
  ADLS = 'adls',
}

export class StorageAccountState {
  name!: string;
  url!: pulumi.Output<string>;
  account!: azure.storage.Account;
}
