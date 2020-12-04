import * as azure from '@pulumi/azure';
import * as pulumi from '@pulumi/pulumi';
import {
  DeploymentContext,
  DeploymentSetting,
} from '../../core/deployment-context';
import { SqlDatabaseState } from './sql-server.config';
import { SqlServerUtil } from './sql-server.util';

//TODO
//ad integrated auth
//   set admin
//   remove default admin
//   knex use ad auth
//generate password dynamically
//prod - geo-redundant backup
//prod - threat detection
//automation account + maintenance

/*****************************************************
 * DATABASE
 * ***************************************************/
export class SqlDatabaseCrosswalk {
  static createDatabase(databaseName: string, rootName: string) {
    const sharedRg = DeploymentContext.getCurrentResourceGroup();
    const dbState = this.createDbState(databaseName, rootName);

    const sqlServer = SqlServerUtil.createServer(
      rootName,
      dbState.sqlConfig,
      sharedRg
    );

    DeploymentContext.Settings[DeploymentSetting.DATABASE_LEVEL] = process.env
      .DATABASE_LEVEL
      ? process.env.DATABASE_LEVEL
      : 'Basic';

    const sqlDatabase = SqlServerUtil.createDatabase(
      databaseName,
      DeploymentContext.Settings[DeploymentSetting.DATABASE_LEVEL],
      sqlServer,
      sharedRg
    );

    //Azure services override uses 0.0.0.0
    const fwRule = new azure.sql.FirewallRule(
      'Azure Services',
      {
        resourceGroupName: sharedRg.name,
        serverName: sqlServer.name,
        startIpAddress: '0.0.0.0',
        endIpAddress: '0.0.0.0',
      },
      { dependsOn: sqlServer }
    );

    return dbState;
  }

  static createDbState(databaseName: string, appRootName: string) {
    const sqlConfig: SqlDatabaseState = {
      name: databaseName,
      sqlConfig: { username: 'kmkatsma', password: '$$password123' },
      dbUrl: pulumi.interpolate`${pulumi.output(
        SqlServerUtil.getServerName(appRootName.toUpperCase())
      )}.database.windows.net`,
    };
    return sqlConfig;
  }
}
