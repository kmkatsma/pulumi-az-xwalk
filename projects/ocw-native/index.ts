import * as pulumi from '@pulumi/pulumi';
import * as azad from '@pulumi/azuread';
import { initializeContext } from '../../core/deployment-context';
import { ResourceGroupUtil } from '../../providers/resource-group/resource-group.util';
import { AppInsightsUtil } from '../../providers/app-insights/app-insights.util';
import { AppServiceBuilder } from '../../providers/app-service/app-services.crosswalk';
import { SqlServerBuilder } from '../../providers/sql-server/sql-database.crosswalk';
import { StorageAccountBuilder } from '../../providers/storage-account/storage-account.crosswalk';
import { AppRegistrationsBuilder } from '../../providers/app-registration/app-registration.crosswalk';
import {
  DIRECTORY_READ_NAME,
  DIRECTORY_READ_ROLE_ID,
  RoleMemberUtil,
} from '../../providers/role-member/role-member.util';

//VARIABLES TO SET
const deploymentContext = initializeContext({ groupRootName: 'SHRD' });
deploymentContext.Stack = pulumi.getStack();

const sharedRg = ResourceGroupUtil.createResourceGroup(deploymentContext);
export let resourceGroupName = sharedRg.name;
deploymentContext.resourceGroup = sharedRg;

const appInsights = AppInsightsUtil.create(deploymentContext, sharedRg);
const appServicePlan = AppServiceBuilder.createAppServicePlan(
  deploymentContext,
  sharedRg
  //AppServiceSize.B1,
  //AppServiceTier.Basic
);
const devopsSpId = ' '; //objectId for az devops from
//az ad sp show --id    - the ad id for devops app not visible in portal UI

/**********************************************************
 * DATABASE
 **********************************************************/
const dbState = SqlServerBuilder.createServerWithDatabase(
  'OCW',
  sharedRg,
  deploymentContext,
  devopsSpId
);
//export const dbPassword = dbState.sqlConfig.password;
export const dbUrl = dbState.sqlServerState.dbUrl;
export const dbServerPrincipalId = dbState.sqlServerState.server.identity.apply(
  (t) => t?.principalId ?? ''
);
export const dbWriterGroupName = dbState.sqlDatabaseState.dbWriterGroupName;
export const dbWriterGroupId = dbState.sqlDatabaseState.dbWriterGroupId;
export const dbServerAdminGroupId = dbState.sqlServerState.adminGroupId;

//add db MSI principle to directory readers

/*RoleMemberUtil.setRoleMember(
  dbServerPrincipalId,
  DIRECTORY_READ_ROLE_ID,
  DIRECTORY_READ_NAME,
  dbState.sqlServerState.server,
  deploymentContext
);*/

/***********************************************************
 * Website SA
 ***********************************************************/
const websiteSA = StorageAccountBuilder.createStaticSite(
  'WEBSITE',
  `https://www.${deploymentContext.ProdDomainRoot}`.toLowerCase(),
  deploymentContext,
  sharedRg
);

export const staticEndpoint = websiteSA.account.primaryEndpoints.web;

/*************************************************************
 * ADMIN COMPONENTS
 *************************************************************/
const adminRoot = 'Admin';
const adminSAState = StorageAccountBuilder.createStaticSite(
  adminRoot,
  `https://${adminRoot}.${deploymentContext.ProdDomainRoot}`.toLowerCase(),
  deploymentContext,
  sharedRg
);
export const adminSAName = adminSAState.name;
export const adminOrigin = adminSAState.url;

const adminAppState = AppRegistrationsBuilder.createApps(
  deploymentContext.Namespace,
  adminRoot,
  adminOrigin,
  deploymentContext
);
export let adminUIAppClientId = adminAppState.uiAppClientId;
export let adminUIAppId = adminAppState.uiAppId;
export let adminApiAppClientId = adminAppState.apiAppClientId;
export let adminApiAppId = adminAppState.apiAppId;
export let adminApiResourceScope = adminAppState.apiResourceScope;

const adminAppServiceState = AppServiceBuilder.createAppService(
  adminRoot,
  deploymentContext,
  sharedRg,
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
const appSAState = StorageAccountBuilder.createStaticSite(
  appRoot,
  `https://${appRoot}.${deploymentContext.ProdDomainRoot}`,
  deploymentContext,
  sharedRg
);
export const appOrigin = appSAState.url;
export const appSAName = appSAState.name;

const appAppServiceState = AppRegistrationsBuilder.createApps(
  deploymentContext.Namespace,
  appRoot,
  appOrigin,
  deploymentContext
);
export let appUIAppClientId = appAppServiceState.uiAppClientId;
export let appUIAppId = appAppServiceState.uiAppId;
export let appApiAppClientId = appAppServiceState.apiAppClientId;
export let appApiAppId = appAppServiceState.apiAppId;
export let appApiResourceScope = appAppServiceState.apiResourceScope;

const appAPIState = AppServiceBuilder.createAppService(
  appRoot,
  deploymentContext,
  sharedRg,
  appServicePlan,
  appInsights,
  dbState,
  appApiAppClientId,
  appOrigin
);
export let appAPIUrl = appAPIState.url;
export let appAPIName = appAPIState.name;

//assign app managed identity to database group
const writerGroupAssignment = new azad.GroupMember(
  'GRP-SQL-WRITER-OCW-SHRD-DEV-MEMBER',
  {
    groupObjectId: dbState.sqlDatabaseState.dbWriterGroupId,
    memberObjectId: appAPIState.app.identity.apply((t) => t?.principalId ?? ''),
  }
);
