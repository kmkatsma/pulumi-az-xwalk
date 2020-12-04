import * as pulumi from '@pulumi/pulumi';
import { PulumiUtil } from '../../core/pulumi.util';
import {
  AppRegistrationAuthorizationArgs,
  AppRegistrationAuthorizationInputs,
  AppRegistrationType,
} from './app-registration.config';
import { AppRegistrationAuthorizationUtil } from './app-registration-authorization.util';

class AppRegistrationAuthorizationProvider
  implements pulumi.dynamic.ResourceProvider {
  Input = AppRegistrationAuthorizationInputs;

  public async check(
    olds: any,
    news: any
  ): Promise<pulumi.dynamic.CheckResult> {
    const failures: any[] = [];

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
    olds: any,
    news: any
  ): Promise<pulumi.dynamic.DiffResult> {
    const replaces = [];

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
      return { changes: true };
    }
    return { changes: false };
  }

  public async create(inputs: any): Promise<pulumi.dynamic.CreateResult> {
    console.log('execut create', inputs);

    await AppRegistrationAuthorizationUtil.executeUpdate(inputs);

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
    news: any
  ): Promise<pulumi.dynamic.CreateResult> {
    console.log('execute update', id);

    await AppRegistrationAuthorizationUtil.executeUpdate(news);

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
    args: AppRegistrationAuthorizationArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(
      new AppRegistrationAuthorizationProvider(),
      name,
      {
        ...args,
      },
      opts
    );
  }
}
