import * as pulumi from '@pulumi/pulumi';
import * as sql from '@pulumi/azure-native/sql';
import * as resources from '@pulumi/azure-native/resources';
import * as azad from '@pulumi/azuread';
import {
  DeploymentSetting,
  IDeploymentContext,
} from '../../core/deployment-context';
import { SqlDatabaseState, SqlServerState } from './sql-server.config';

export class SqlServerUtil {
  static getServerAdminGroupName(deploymentContext: IDeploymentContext) {
    return `GRP-SQL-ADMIN-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${deploymentContext.Stack}`.toUpperCase();
  }
  static getDBWriterGroupName(deploymentContext: IDeploymentContext) {
    return `GRP-SQL-WRITER-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${deploymentContext.Stack}`.toUpperCase();
  }

  static getServerName(deploymentContext: IDeploymentContext) {
    return `SQL-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${deploymentContext.Stack}`.toLowerCase();
  }
  static createServer(
    deploymentContext: IDeploymentContext,
    resourceGroup: resources.ResourceGroup,
    adminSPId: string
  ) {
    const name = this.getServerName(deploymentContext);

    const adminGroupName = SqlServerUtil.getServerAdminGroupName(
      deploymentContext
    );
    const adminGroup = new azad.Group(adminGroupName, {
      name: adminGroupName,
    });
    const exampleGroupMember = new azad.GroupMember('GRP-SQL-ADMIN-MEMBER', {
      groupObjectId: adminGroup.id,
      memberObjectId: adminSPId,
    });

    const sqlServer = new sql.Server(name, {
      serverName: name,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      //administratorLogin: sqlServerConfig.username,
      //administratorLoginPassword: sqlServerConfig.password,
      administrators: {
        azureADOnlyAuthentication: true,
        login: adminGroupName,
        principalType: 'Application',
        sid: adminGroup.objectId,
        tenantId: deploymentContext.TenantId,
      },
      identity: {
        type: 'SystemAssigned',
      },
      version: '12.0',
    });
    return {
      server: sqlServer,
      adminGroupName: adminGroupName,
      adminGroupId: adminGroup.objectId,
      dbUrl: pulumi.interpolate`${pulumi.output(
        SqlServerUtil.getServerName(deploymentContext)
      )}.database.windows.net`,
    } as SqlServerState;
  }

  static createDatabase(
    dbName: string,
    sqlServer: sql.Server,
    resourceGroup: resources.ResourceGroup,
    deploymentContext: IDeploymentContext
  ) {
    deploymentContext.Settings[DeploymentSetting.DATABASE_LEVEL] = process.env
      .DATABASE_LEVEL
      ? process.env.DATABASE_LEVEL
      : 'Basic';

    const writerGroupName = SqlServerUtil.getDBWriterGroupName(
      deploymentContext
    );
    const writerGroup = new azad.Group(writerGroupName, {
      name: writerGroupName,
    });

    const database = new sql.Database(dbName, {
      databaseName: dbName,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      serverName: sqlServer.name,
      sku: { name: 'Basic' },
    });

    //return database;
    return {
      name: dbName,
      database: database,
      dbWriterGroupName: writerGroupName,
      dbWriterGroupId: writerGroup.objectId,
    } as SqlDatabaseState;
  }

  /*private static createDbState(
    databaseName: string,
    deploymentContext: IDeploymentContext
  ) {
    const sqlConfig: SqlDatabaseState = {
      name: databaseName,
      sqlConfig: { username: 'kmkatsma', password: '$$password123' },

    };
    return sqlConfig;
  }*/
}
