import * as pulumi from '@pulumi/pulumi';
import { AppRegistrationUtil } from './app-registration.util';
import { AppRegistrationState } from './app-registration.config';

export class AppRegistrationsCrosswalk {
  static createApps(
    namespace: string,
    appRootName: string,
    origin: pulumi.Output<string>
  ) {
    const state = new AppRegistrationState();

    //UI APP REG
    const adminUIApp = AppRegistrationUtil.createUIAppRegistration(
      appRootName,
      namespace,
      origin,
      state
    );

    //UPDATE UI AUTH FIELDS
    AppRegistrationUtil.configureUIAppRegistrationAuthorization(
      appRootName,
      adminUIApp,
      state
    );

    //API APP REG
    const adminAdApp = AppRegistrationUtil.createApiAppRegistration(
      namespace,
      appRootName,
      state
    );

    //UPDATE API App Reg with authorizations/secret
    AppRegistrationUtil.configureApiAppRegistrationAuthorization(
      appRootName,
      adminAdApp,
      state
    );

    return state;
  }
}
