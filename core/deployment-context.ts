import * as azure from '@pulumi/azure';
import * as pulumi from '@pulumi/pulumi';

export enum DeploymentSetting {
  DATABASE_LEVEL = 'DATABASE_LEVEL',
  PLAN_TIER = 'PLAN_TIER',
  PLAN_SIZE = 'PLAN_SIZE',
  TENANT_ID = 'TENANT_ID',
  USER_GROUP_ID = 'USER_GROUP_ID',
  ADMIN_CLIENT_ID = 'ADMIN_CLIENT_ID',
  ADMIN_APP_SECRET = 'ADMIN_APP_SECRET',
}

export class DeploymentContext {
  static Prefix = 'OCW'; //SET custom value for your prefix
  static Namespace = 'OpenCaseWork'; //set for your full app name
  static ProdDomainRoot = 'opencasework.com'; //set for your domain for prod
  static Stack = pulumi.getStack();
  static DefaultRegion = azure.Locations.CentralUS;
  static Settings: any = {};
  private static TenantId = ''; //set using outside ave pulumi
  private static UserGroupId = '';
  private static ADMIN_CLIENT_ID = ''; //set using outside ave pulumi
  private static ADMIN_APP_SECRET = ''; //set using outside ave pulumi
  private static currentSubId: string;
  private static currentResourceGroup: azure.core.ResourceGroup;

  static setSubscription(name: string) {}

  static setSubscriptionId(id: string) {
    this.currentSubId = id;
  }

  static setResourceGroup(name: azure.core.ResourceGroup) {
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
  }

  /***********************************************************************
   * Read environment variables, or can use defaults if not set
   * Need the SP to have AZ Graph/Management API permissions
   ***********************************************************************/
  static initialize() {
    DeploymentContext.Settings[DeploymentSetting.TENANT_ID] = process.env
      .ARM_TENANT_ID
      ? process.env.ARM_TENANT_ID
      : DeploymentContext.TenantId;

    DeploymentContext.Settings[DeploymentSetting.USER_GROUP_ID] = process.env
      .USER_GROUP_ID
      ? process.env.USER_GROUP_ID
      : DeploymentContext.UserGroupId;

    DeploymentContext.Settings[DeploymentSetting.ADMIN_APP_SECRET] = process.env
      .ARM_CLIENT_SECRET
      ? process.env.ARM_CLIENT_SECRET
      : DeploymentContext.ADMIN_APP_SECRET;

    DeploymentContext.Settings[DeploymentSetting.ADMIN_CLIENT_ID] = process.env
      .ARM_CLIENT_ID
      ? process.env.ARM_CLIENT_ID
      : DeploymentContext.ADMIN_CLIENT_ID;
  }
}
