import * as resources from '@pulumi/azure-native/resources';
import * as pulumi from '@pulumi/pulumi';

export enum DeploymentSetting {
  DATABASE_LEVEL = 'DATABASE_LEVEL',
  PLAN_TIER = 'PLAN_TIER',
  PLAN_SIZE = 'PLAN_SIZE',
  TENANT_ID = 'TENANT_ID',
  USER_GROUP_ID = 'USER_GROUP_ID',
  ARM_CLIENT_ID = 'ARM_CLIENT_ID',
  ARM_CLIENT_SECRET = 'ARM_CLIENT_SECRET',
  DEPLOY_CLIENT_ID = 'DEPLOY_CLIENT_ID',
}

export interface IDeploymentContext {
  Prefix: string;
  Namespace: string;
  ProdDomainRoot: string;
  Stack: string;
  DefaultRegion: string;
  Settings: Record<string, string>;
  TenantId: string;
  UserGroupId: string;
  ARM_CLIENT_ID: string;
  ARM_CLIENT_SECRET: string;
  currentSubId: string;
  groupRootName: string;
  resourceGroup?: resources.ResourceGroup;
}

/*export const DeploymentContext: IDeploymentContext = {
  Prefix: 'OCW', //SET custom value for your prefix
  Namespace: 'OpenCaseWork', //set for your full app name
  ProdDomainRoot: 'opencasework.com', //set for your domain for prod
  Stack: '',
  DefaultRegion: 'centralus',
  Settings: {},
  TenantId: '', //set using outside ave pulumi
  UserGroupId: '',
  ARM_CLIENT_ID: '', //set using outside ave pulumi
  ARM_CLIENT_SECRET: '', //set using outside ave pulumi
  currentSubId: '',
  //currentResourceGroup: azure.resources.ResourceGroup,
};*/
/*static setSubscription(name: string) {}

  static setSubscriptionId(id: string) {
    this.currentSubId = id;
  }

  static setResourceGroup(name: azure.resources.ResourceGroup) {
    this.currentResourceGroup = name;
  }

  static getCurrentResourceGroup() {
    if (!this.currentResourceGroup) {
      throw new Error('DeploymentContext.currentResourceGroup is not defined');
    }
    return this.currentResourceGroup;
  }

  static getCurrentSubcription() {
    if (!this.currentSubId) {
      throw new Error('DeploymentContext.currentSubId is not defined');
    }
    return this.currentSubId;
  }*/

/***********************************************************************
 * Read environment variables, or can use defaults if not set
 * Need the SP to have AZ Graph/Management API permissions
 ***********************************************************************/
export function initializeContext(options: { groupRootName: string }) {
  const deploymentContext: IDeploymentContext = {
    Prefix: 'OCW', //SET custom value for your prefix
    Namespace: 'OpenCaseWork', //set for your full app name
    ProdDomainRoot: 'opencasework.com', //set for your domain for prod
    DefaultRegion: 'centralus',
    Stack: pulumi.getStack(),
    Settings: {},
    TenantId: '', //set using outside ave pulumi
    UserGroupId: '',
    ARM_CLIENT_ID: '', //set using outside ave pulumi
    ARM_CLIENT_SECRET: '', //set using outside ave pulumi
    currentSubId: '',
    groupRootName: options.groupRootName,
    //currentResourceGroup: azure.resources.ResourceGroup,
  };
  process.env.ARM_CLIENT_ID = ' ';
  process.env.ARM_CLIENT_SECRET = '';
  process.env.ARM_TENANT_ID = ' ';
  process.env.ARM_SUBSCRIPTION_ID = ' ';

  /*deploymentContext.Settings[DeploymentSetting.DEPLOY_ACCOUNT_NAME] =
    'OCW-DEPLOY-SP-D1';*/
  deploymentContext.Settings[DeploymentSetting.DEPLOY_CLIENT_ID] =
    ' ';

  deploymentContext.Settings[DeploymentSetting.TENANT_ID] = process.env
    .ARM_TENANT_ID
    ? process.env.ARM_TENANT_ID
    : deploymentContext.TenantId;

  deploymentContext.Settings[DeploymentSetting.USER_GROUP_ID] = process.env
    .USER_GROUP_ID
    ? process.env.USER_GROUP_ID
    : deploymentContext.UserGroupId;

  deploymentContext.Settings[DeploymentSetting.ARM_CLIENT_SECRET] = process.env
    .ARM_CLIENT_SECRET
    ? process.env.ARM_CLIENT_SECRET
    : deploymentContext.ARM_CLIENT_SECRET;

  deploymentContext.Settings[DeploymentSetting.ARM_CLIENT_ID] = process.env
    .ARM_CLIENT_ID
    ? process.env.ARM_CLIENT_ID
    : deploymentContext.ARM_CLIENT_ID;
  return deploymentContext;
}
