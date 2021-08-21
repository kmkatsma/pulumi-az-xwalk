import * as pulumi from '@pulumi/pulumi';
import * as authorization from '@pulumi/azure-native/authorization';
import { IDeploymentContext } from '../../core/deployment-context';
import { RoleMember } from './role-member.provider';

export const DIRECTORY_READ_ROLE_ID = '6392d0b7-088f-431c-87d7-63200f32c759';
export const DIRECTORY_READ_NAME = 'DirectoryReader';

export class RoleMemberUtil {
  static setRoleMember(
    userId: pulumi.Input<string>,
    roleId: pulumi.Input<string>,
    roleName: string,
    dependsOnResource: any,
    deploymentContext: IDeploymentContext
  ) {
    const roleMemberName = `${deploymentContext.Stack}${roleName}`;
    const roleMember = new RoleMember(
      roleMemberName,
      {
        userId,
        roleId,
        deploymentContext,
      },
      { dependsOn: dependsOnResource }
    );

    /*const roleAssignment = new authorization.RoleAssignment(roleMemberName, {
      principalId: userId, //' 7',
      principalType: 'ServicePrincipal', // 'User',
      roleAssignmentName: roleMemberName, // ' ',
      roleDefinitionId: roleId,
      // '/ ',
      scope: '/',
    });*/
  }
}
