import * as resources from '@pulumi/azure-native/resources';
import * as insights from '@pulumi/azure-native/insights';
import { IDeploymentContext } from '../../core/deployment-context';

export class AppInsightsUtil {
  static create(
    deploymentContext: IDeploymentContext,
    resourceGroup: resources.ResourceGroup
  ) {
    const name = `AI-${deploymentContext.Prefix}-${deploymentContext.groupRootName}`.toUpperCase();

    const appInsights = new insights.Component(name, {
      applicationType: 'web',
      flowType: 'Bluefield',
      kind: 'web',
      location: 'Central US',
      requestSource: 'rest',
      resourceGroupName: resourceGroup.name,
      resourceName: name,
    });

    return appInsights;
  }
}
