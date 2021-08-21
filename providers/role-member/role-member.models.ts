import * as pulumi from '@pulumi/pulumi';
import { IDeploymentContext } from '../../core/deployment-context';

export enum RoleMemberInputs {
  roleId = 'roleId',
  userId = 'userId',
}

export interface RoleMemberProviderArgs {
  [RoleMemberInputs.roleId]: pulumi.Input<string>;
  [RoleMemberInputs.userId]: pulumi.Input<string>;
  deploymentContext: IDeploymentContext;
}

export interface RoleMemberArgs {
  [RoleMemberInputs.roleId]: string;
  [RoleMemberInputs.userId]: string;
  deploymentContext: IDeploymentContext;
}
