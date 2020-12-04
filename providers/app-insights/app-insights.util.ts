import * as azure from '@pulumi/azure';
import { DeploymentContext } from '../../core/deployment-context';

export class AppInsightsUtil {
  static create(rootName: string, resourceGroup: azure.core.ResourceGroup) {
    const name = `AI-${DeploymentContext.Prefix}-${rootName}`.toUpperCase();
    const appInsights = new azure.appinsights.Insights(name, {
      name: name,
      resourceGroupName: resourceGroup.name,

      applicationType: 'web',
    });

    return appInsights;
  }
}
