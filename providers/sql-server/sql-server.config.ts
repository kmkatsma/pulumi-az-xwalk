import * as pulumi from '@pulumi/pulumi';

export interface SqlServerConfig {
  username: string;
  password: string;
}

export class SqlDatabaseState {
  name!: string;
  sqlConfig!: { username: string; password: string };
  dbUrl!: pulumi.Output<string>;

  constructor() {
    this.sqlConfig = { username: '', password: '' };
  }
}
