import * as pulumi from '@pulumi/pulumi';
import { DeploymentContext } from '../../core/deployment-context';
import { AppRegistrationsCrosswalk } from '../../providers/app-registration/app-registration.crosswalk';

process.env.ARM_CLIENT_ID = '';
process.env.ARM_CLIENT_SECRET = '';
process.env.ARM_TENANT_ID = '';
process.env.ARM_SUBSCRIPTION_ID = '';
DeploymentContext.initialize();
const adminRoot = 'PLAYTEST1';

/******************************************************
 * FUNCTIONS
 ******************************************************/
const adminAppState = AppRegistrationsCrosswalk.createApps(
  DeploymentContext.Namespace,
  adminRoot,
  pulumi.output('https://www.fakesite1.com')
);

//pulumi up
//pulumi refresh
