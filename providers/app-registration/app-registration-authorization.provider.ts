import * as pulumi from '@pulumi/pulumi';
import { PulumiUtil } from '../../core/pulumi.util';
import {
  AppRegistrationAuthorizationArgs,
  AppRegistrationAuthorizationInputs,
  AppRegistrationAuthorizationProviderArgs,
  AppRegistrationType,
} from './app-registration.config';
import { AppRegistrationAuthorizationUtil } from './app-registration-authorization.util';
import { initializeContext } from '../../core/deployment-context';

class AppRegistrationAuthorizationProvider
  implements pulumi.dynamic.ResourceProvider {
  Input = AppRegistrationAuthorizationInputs;

  public async check(
    olds: AppRegistrationAuthorizationArgs,
    news: AppRegistrationAuthorizationArgs
  ): Promise<pulumi.dynamic.CheckResult> {
    const failures: any[] = [];

    console.log(
      'check olds',
      olds[AppRegistrationAuthorizationInputs.appId],
      olds[AppRegistrationAuthorizationInputs.appRegistrationName],
      olds[AppRegistrationAuthorizationInputs.type],
      olds[AppRegistrationAuthorizationInputs.authorizedApp],
      olds[AppRegistrationAuthorizationInputs.authorizedScope]
    );
    PulumiUtil.validateInput(this.Input.appId, news, failures);
    PulumiUtil.validateInput(this.Input.type, news, failures);
    if (news[this.Input.type] === AppRegistrationType.Api) {
      PulumiUtil.validateInput(this.Input.authorizedApp, news, failures);
      PulumiUtil.validateInput(this.Input.authorizedScope, news, failures);
    }
    return { inputs: news, failures };
  }

  public async diff(
    id: pulumi.ID,
    olds: AppRegistrationAuthorizationArgs,
    news: AppRegistrationAuthorizationArgs
  ): Promise<pulumi.dynamic.DiffResult> {
    const replaces = [];
    console.log('diff');

    if (!id) {
      replaces.push(this.Input.appRegistrationName);
      return { replaces };
    }

    if (
      PulumiUtil.hasDiffs(olds, news, [
        this.Input.type,
        this.Input.secret,
        this.Input.authorizedApp,
        this.Input.authorizedScope,
      ])
    ) {
      console.log('changes true');
      return { changes: true };
    }
    console.log('changes');
    if (olds[AppRegistrationAuthorizationInputs.appId]) {
      return { changes: true };
    }
    return { changes: false };
  }

  public async create(
    inputs: AppRegistrationAuthorizationArgs
  ): Promise<pulumi.dynamic.CreateResult> {
    console.log('execute create', inputs[this.Input.appId]);

    //const deploymentContext = initializeContext({ groupRootName: 'SHRD' });
    //console.log('execute create context', deploymentContext);

    await AppRegistrationAuthorizationUtil.executeUpdate(
      inputs,
      inputs.deploymentContext
    );

    return {
      id: `${inputs[this.Input.appId]}`,
      outs: AppRegistrationAuthorizationUtil.createAppRegistrationOutput(
        inputs
      ),
    };
  }

  async update(
    id: any,
    olds: any,
    news: AppRegistrationAuthorizationArgs
  ): Promise<pulumi.dynamic.CreateResult> {
    console.log('execute update', id);

    //const deploymentContext = initializeContext({ groupRootName: 'SHRD' });

    await AppRegistrationAuthorizationUtil.executeUpdate(
      news,
      news.deploymentContext
    );

    return {
      id: `${news[this.Input.appId]}`,
      outs: AppRegistrationAuthorizationUtil.createAppRegistrationOutput(news),
    };
  }
}

export class AppRegistrationAuthorizationSettings extends pulumi.dynamic
  .Resource {
  constructor(
    name: string,
    args: AppRegistrationAuthorizationProviderArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(new AppRegistrationAuthorizationProvider(), name, args, opts);
  }
}
