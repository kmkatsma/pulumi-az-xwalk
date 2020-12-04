import { AppRegistrationsCrosswalk } from '../../providers/app-registration/app-registration.crosswalk';
import {
  AppServiceSize,
  AppServiceTier,
} from '../../providers/app-service/app-service.config';
import { SqlDatabaseCrosswalk } from '../../providers/sql-server/sql-database.crosswalk';
import { StorageAccountCrosswalk } from '../../providers/storage-account/storage-account.crosswalk';
import { AppServiceCrosswalk } from '../../providers/app-service/app-services.crosswalk';
import { AppInsightsUtil } from '../../providers/app-insights/app-insights.util';
import { DeploymentContext } from '../../core/deployment-context';
import { ResourceGroupUtil } from '../../providers/resource-group/resource-group.util';

//VARIABLES TO SET
process.env.ARM_CLIENT_ID = '';
process.env.ARM_CLIENT_SECRET = '';
process.env.ARM_TENANT_ID = '';
process.env.ARM_SUBSCRIPTION_ID = '';
DeploymentContext.Namespace = 'OpenCaseWork';
DeploymentContext.ProdDomainRoot = 'opencasework.com';
DeploymentContext.initialize();
const groupRootName = 'SHARED';

const sharedRg = ResourceGroupUtil.createResourceGroup(groupRootName);
export let resourceGroupName = sharedRg.name;
DeploymentContext.setResourceGroup(sharedRg);

const appInsights = AppInsightsUtil.create(groupRootName, sharedRg);
const appServicePlan = AppServiceCrosswalk.createAppServicePlan(
  groupRootName,
  AppServiceSize.B1,
  AppServiceTier.Basic
);

/**********************************************************
 * DATABASE
 **********************************************************/
const dbState = SqlDatabaseCrosswalk.createDatabase('OCW', groupRootName);
export const dbPassword = dbState.sqlConfig.password;
export const dbUrl = dbState.dbUrl;

/***********************************************************
 * Website SA
 ***********************************************************/
const websiteSA = StorageAccountCrosswalk.createStaticSite(
  'WEBSITE',
  `https://www.${DeploymentContext.ProdDomainRoot}`.toLowerCase()
);

/*************************************************************
 * ADMIN COMPONENTS
 *************************************************************/
const adminRoot = 'Admin';
const adminSAState = StorageAccountCrosswalk.createStaticSite(
  adminRoot,
  `https://${adminRoot}.${DeploymentContext.ProdDomainRoot}`.toLowerCase()
);
export const adminSAName = adminSAState.name;
export const adminOrigin = adminSAState.url;

const adminAppState = AppRegistrationsCrosswalk.createApps(
  DeploymentContext.Namespace,
  adminRoot,
  adminOrigin
);
export let adminUIAppClientId = adminAppState.uiAppClientId;
export let adminUIAppId = adminAppState.uiAppId;
export let adminApiAppClientId = adminAppState.apiAppClientId;
export let adminApiAppId = adminAppState.apiAppId;
export let adminApiResourceScope = adminAppState.apiResourceScope;

const adminAppServiceState = AppServiceCrosswalk.createAppService(
  adminRoot,
  appServicePlan,
  appInsights,
  dbState,
  adminApiAppClientId,
  adminOrigin
);
export let adminAPIUrl = adminAppServiceState.url;
export let adminAPIName = adminAppServiceState.name;

/*************************************************************
 * OCW APP SA
 *************************************************************/
const appRoot = 'App';
const appSAState = StorageAccountCrosswalk.createStaticSite(
  appRoot,
  `https://${appRoot}.${DeploymentContext.ProdDomainRoot}`
);
export const appOrigin = appSAState.url;
export const appSAName = appSAState.name;

const appAppServiceState = AppRegistrationsCrosswalk.createApps(
  DeploymentContext.Namespace,
  appRoot,
  appOrigin
);
export let appUIAppClientId = appAppServiceState.uiAppClientId;
export let appUIAppId = appAppServiceState.uiAppId;
export let appApiAppClientId = appAppServiceState.apiAppClientId;
export let appApiAppId = appAppServiceState.apiAppId;
export let appApiResourceScope = appAppServiceState.apiResourceScope;

const appAPIState = AppServiceCrosswalk.createAppService(
  appRoot,
  appServicePlan,
  appInsights,
  dbState,
  appApiAppClientId,
  appOrigin
);
export let appAPIUrl = appAPIState.url;
export let appAPIName = appAPIState.name;

/******************************************************
 * FUNCTIONS
 ******************************************************/
/*const functionRg = ResourceGroupUtil.createResourceGroup('Functions');
const functionRootName = 'SYSTEM';
const functionSA = OcwStorageAccounts.createFunctionAppSA(functionRootName);
OcwFunctionAppService.createFunctionApp(
  functionRootName,
  //appServicePlan,
  appInsights,
  functionSA,
  dbState
  // true
);*/
//pulumi up
//pulumi refresh
