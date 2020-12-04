import * as azure from '@pulumi/azure';
import { DeploymentContext } from '../../core/deployment-context';

export class ResourceGroupUtil {
  static createResourceGroup(groupNameRoot: string, region?: string) {
    if (!region) {
      region = DeploymentContext.DefaultRegion;
    }
    const name = `RG-${DeploymentContext.Prefix}-${groupNameRoot}-${region}-${DeploymentContext.Stack}`.toUpperCase();

    const resourceGroup = new azure.core.ResourceGroup(name, {
      name: name,
      location: region,
    });
    DeploymentContext.setResourceGroup(resourceGroup);
    return resourceGroup;
  }
}
