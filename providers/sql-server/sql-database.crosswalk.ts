import * as sql from '@pulumi/azure-native/sql';
import * as resources from '@pulumi/azure-native/resources';
import * as pulumi from '@pulumi/pulumi';
import * as azad from '@pulumi/azuread';
import { IDeploymentContext } from '../../core/deployment-context';
import { SqlDatabaseState, SqlServerBuilderState } from './sql-server.config';
import { SqlServerUtil } from './sql-server.util';

//TODO
//knex use ad auth
//prod - geo-redundant backup
//prod - threat detection
//automation account + maintenance
//https://erikej.github.io/sqlserver/2021/01/25/azure-sql-advanced-deployment-part3.html

/*****************************************************
 * DATABASE
 * ***************************************************/
export class SqlServerBuilder {
  static createServerWithDatabase(
    databaseName: string,
    resourceGroup: resources.ResourceGroup,
    deploymentContext: IDeploymentContext,
    adminSpId: string
  ) {
    const sqlServerState = SqlServerUtil.createServer(
      deploymentContext,
      resourceGroup,
      adminSpId
    );

    const sqlDatabaseState = SqlServerUtil.createDatabase(
      databaseName,
      sqlServerState.server,
      resourceGroup,
      deploymentContext
    );

    //Azure services override uses 0.0.0.0
    const fwRule = new sql.FirewallRule(
      'Azure Services',
      {
        resourceGroupName: resourceGroup.name,
        serverName: sqlServerState.server.name,
        startIpAddress: '0.0.0.0',
        endIpAddress: '0.0.0.0',
      },
      { dependsOn: sqlServerState.server }
    );

    return { sqlServerState, sqlDatabaseState } as SqlServerBuilderState;
  }
}
