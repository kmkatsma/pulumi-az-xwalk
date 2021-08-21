import {
  IDeploymentContext,
  initializeContext,
} from '../../core/deployment-context';
import { ContainerRegistryUtil } from '../../providers/container-registry/container-registry-util';
import { ResourceGroupUtil } from '../../providers/resource-group/resource-group.util';
import * as containerRegistry from '@pulumi/azure-native/containerregistry';

//VARIABLES TO SET
process.env.ARM_CLIENT_ID = ' ';
process.env.ARM_CLIENT_SECRET = ' ';
process.env.ARM_TENANT_ID = ' ';
process.env.ARM_SUBSCRIPTION_ID = ' ';

const groupRootName = 'GLOBAL';
const context = initializeContext({ groupRootName: 'GLOBAL' });

const globalRg = ResourceGroupUtil.createResourceGroup(context);
export let resourceGroupName = globalRg.name;
context.resourceGroup = globalRg;

export const r = ContainerRegistryUtil.createRegistry(
  'ocwcontainerregistry',
  globalRg
);
export const loginServer = r.loginServer;
