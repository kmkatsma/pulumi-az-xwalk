import { SqlDatabaseCrosswalk } from '../../providers/sql-server/sql-database.crosswalk';
import { FunctionAppCrosswalk } from '../../providers/app-service/function-app.crosswalk';
import { AppServiceCrosswalk } from '../../providers/app-service/app-services.crosswalk';
import { StorageAccountCrosswalk } from '../../providers/storage-account/storage-account.crosswalk';
import { AppInsightsUtil } from '../../providers/app-insights/app-insights.util';
import { DeploymentContext } from '../../core/deployment-context';
import { ResourceGroupUtil } from '../../providers/resource-group/resource-group.util';

process.env.ARM_CLIENT_ID = '';
process.env.ARM_CLIENT_SECRET = '';
process.env.ARM_TENANT_ID = '';
process.env.ARM_SUBSCRIPTION_ID = '';
DeploymentContext.initialize();

/******************************************************
 * FUNCTIONS
 ******************************************************/
const rgNameRoot = 'Functions';
const functionRg = ResourceGroupUtil.createResourceGroup(rgNameRoot);

const appInsights = AppInsightsUtil.create(rgNameRoot, functionRg);

const functionPlan = AppServiceCrosswalk.createFunctionServicePlan(rgNameRoot);

const functionRootName = 'SYSTEM';
const functionSA = StorageAccountCrosswalk.createFunctionAppSA(
  functionRootName
);
const dbState = SqlDatabaseCrosswalk.createDbState('ocw', 'shared');

FunctionAppCrosswalk.createDotNetFunctionApp(
  functionRootName,
  functionPlan,
  appInsights,
  functionSA,
  dbState,
  null
);
//pulumi up
//pulumi refresh
