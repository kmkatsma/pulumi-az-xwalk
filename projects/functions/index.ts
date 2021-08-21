//import { SqlDatabaseBuilder } from '../../providers/sql-server/sql-database.crosswalk';
//import { FunctionAppBuilder } from '../../providers/app-service/function-app.crosswalk';
import { AppServiceBuilder } from '../../providers/app-service/app-services.crosswalk';
import { StorageAccountBuilder } from '../../providers/storage-account/storage-account.crosswalk';
import { AppInsightsUtil } from '../../providers/app-insights/app-insights.util';
//import { DeploymentContext } from '../../core/deployment-context';
import { ResourceGroupUtil } from '../../providers/resource-group/resource-group.util';
import { FunctionAppRuntime } from '../../providers/app-service/function-app.config';

/* 
DeploymentContext.initialize();*/

/******************************************************
 * FUNCTIONS
 ******************************************************/
const rgNameRoot = 'Functions';
const functionRootName = 'SYSTEM';

/*
const dbState = SqlDatabaseBuilder.createDbState('ocw', 'shared');
const functionRg = ResourceGroupUtil.createResourceGroup(rgNameRoot);
FunctionAppBuilder.createFunctionAppGroup(
  functionRootName,
  rgNameRoot,
  FunctionAppRuntime.DotNet,
  dbState
);*/

/*const functionPlan = AppServiceBuilder.createFunctionServicePlan(rgNameRoot);

const functionSA = StorageAccountBuilder.createFunctionAppSA(
  functionRootName
);

FunctionAppBuilder.createDotNetFunctionApp(
  functionRootName,
  functionPlan,
  appInsights,
  functionSA,
  dbState,
  null
);*/
//pulumi up
//pulumi refresh
