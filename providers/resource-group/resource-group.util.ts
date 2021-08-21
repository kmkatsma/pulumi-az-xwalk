import * as resources from '@pulumi/azure-native/resources';
import { IDeploymentContext } from '../../core/deployment-context';

export class ResourceGroupUtil {
  static createResourceGroup(
    deploymentContext: IDeploymentContext,
    region?: string
  ) {
    if (!region) {
      region = deploymentContext.DefaultRegion;
    }
    const name = `RG-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${region}-${deploymentContext.Stack}`.toUpperCase();

    const resourceGroup = new resources.ResourceGroup(name, {
      resourceGroupName: name,
      location: region,
    });
    //DeploymentContext.setResourceGroup(resourceGroup);
    return resourceGroup;
  }
}
