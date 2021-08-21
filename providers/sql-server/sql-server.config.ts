import * as pulumi from '@pulumi/pulumi';
import * as sql from '@pulumi/azure-native/sql';

export interface SqlServerConfig {
  username: string;
  password: string;
}

/*export class SqlDatabaseState {
  name!: string;
  sqlConfig!: { username: string; password: string };
  dbUrl!: pulumi.Output<string>;

  constructor() {
    this.sqlConfig = { username: '', password: '' };
  }
}*/

export interface SqlServerState {
  server: sql.Server;
  adminGroupName: string;
  adminGroupId: pulumi.Output<string>;
  dbUrl: pulumi.Output<string>;
}

export interface SqlDatabaseState {
  name: string;
  database: sql.Database;
  dbWriterGroupName: string;
  dbWriterGroupId: pulumi.Output<string>;
}

export interface SqlServerBuilderState {
  sqlServerState: SqlServerState;
  sqlDatabaseState: SqlDatabaseState;
}
