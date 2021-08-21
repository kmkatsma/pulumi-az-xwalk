import * as resource from '@pulumi/azure-native/resources';
import * as containerregistry from '@pulumi/azure-native/containerregistry';

export class ContainerRegistryUtil {
  static createRegistry(name: string, resourceGroup: resource.ResourceGroup) {
    const registry = new containerregistry.Registry(name, {
      resourceGroupName: resourceGroup.name,
      sku: { name: containerregistry.SkuName.Basic },
      adminUserEnabled: true,
    });
    return registry;
  }

  static async getRegistryCredentials(
    resourceGroupName: string,
    registryName: string
  ) {
    return await containerregistry.getRegistryCredentials({
      registryName,
      resourceGroupName,
    });
  }
}
