import * as azure from '@pulumi/azure';
import { DeploymentContext } from '../../core/deployment-context';
import { SqlServerConfig } from './sql-server.config';

export class SqlServerUtil {
  static getServerName(rootName: string) {
    return `SQL-${DeploymentContext.Prefix}-${rootName}-${DeploymentContext.Stack}`.toLowerCase();
  }
  static createServer(
    rootName: string,
    sqlServerConfig: SqlServerConfig,
    resourceGroup: azure.core.ResourceGroup
  ) {
    // Get the password to use for SQL from config.
    const name = this.getServerName(rootName);

    const sqlServer = new azure.sql.SqlServer(name, {
      name: name,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      administratorLogin: sqlServerConfig.username,
      administratorLoginPassword: sqlServerConfig.password,
      version: '12.0',
    });
    return sqlServer;
  }

  static createDatabase(
    dbName: string,
    serviceObjective: string,
    sqlServer: azure.sql.SqlServer,
    resourceGroup: azure.core.ResourceGroup
  ) {
    const database = new azure.sql.Database(dbName, {
      name: dbName,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      serverName: sqlServer.name,
      requestedServiceObjectiveName: serviceObjective,
    });

    return database;
  }
}
