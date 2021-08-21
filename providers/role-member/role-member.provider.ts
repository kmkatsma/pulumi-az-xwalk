import * as pulumi from '@pulumi/pulumi';
import { PulumiUtil } from '../../core/pulumi.util';
import {
  RoleMemberArgs,
  RoleMemberInputs,
  RoleMemberProviderArgs,
} from './role-member.models';
import { GraphUtil } from '../../az-access/graph.util';
import {
  DeploymentSetting,
  IDeploymentContext,
} from '../../core/deployment-context';

export class RoleMemberProvider implements pulumi.dynamic.ResourceProvider {
  Input = RoleMemberInputs;

  public async check(
    olds: RoleMemberArgs,
    news: RoleMemberArgs
  ): Promise<pulumi.dynamic.CheckResult> {
    const failures: any[] = [];

    console.log(
      'check olds',
      olds[RoleMemberInputs.roleId],
      olds[RoleMemberInputs.userId]
    );
    PulumiUtil.validateInput(this.Input.roleId, news, failures);
    PulumiUtil.validateInput(this.Input.userId, news, failures);

    return { inputs: news, failures };
  }

  public async diff(
    id: pulumi.ID,
    olds: RoleMemberArgs,
    news: RoleMemberArgs
  ): Promise<pulumi.dynamic.DiffResult> {
    const replaces = [];
    console.log('diff');

    if (
      PulumiUtil.hasDiffs(olds, news, [this.Input.roleId, this.Input.userId])
    ) {
      console.log('changes true');
      return { changes: true };
    }

    return { changes: false };
  }

  public async create(
    inputs: RoleMemberArgs
  ): Promise<pulumi.dynamic.CreateResult> {
    console.log('execute create', inputs[this.Input.roleId]);

    //const deploymentContext = initializeContext({ groupRootName: 'SHRD' });
    //console.log('execute create context', deploymentContext);
    await GraphUtil.addRoleMember(
      inputs[this.Input.roleId],
      inputs[this.Input.userId],
      undefined,
      {
        ARM_CLIENT_SECRET:
          inputs.deploymentContext.Settings[
            DeploymentSetting.ARM_CLIENT_SECRET
          ],
        ARM_CLIENT_ID:
          inputs.deploymentContext.Settings[DeploymentSetting.ARM_CLIENT_ID],
        TENANT_ID:
          inputs.deploymentContext.Settings[DeploymentSetting.TENANT_ID],
      }
    );

    return {
      id: `${inputs[this.Input.userId]}`,
      outs: { ...inputs },
    };
  }

  async update(
    id: any,
    olds: any,
    news: RoleMemberArgs
  ): Promise<pulumi.dynamic.CreateResult> {
    console.log('execute update', id);

    //const deploymentContext = initializeContext({ groupRootName: 'SHRD' });

    return {
      id: `${news[this.Input.userId]}`,
      outs: { ...news },
    };
  }
}

export class RoleMember extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    args: RoleMemberProviderArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(new RoleMemberProvider(), name, args, opts);
  }
}
