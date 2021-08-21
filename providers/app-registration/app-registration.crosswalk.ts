import * as pulumi from '@pulumi/pulumi';
import { AppRegistrationUtil } from './app-registration.util';
import {
  AppRegistrationState,
  AppRegistrationType,
} from './app-registration.config';
import { IDeploymentContext } from '../../core/deployment-context';
import { AppRegistrationAuthorizationSettings } from './app-registration-authorization.provider';

export class AppRegistrationsBuilder {
  static createApps(
    namespace: string,
    appRootName: string,
    origin: pulumi.Output<string>,
    deploymentContext: IDeploymentContext
  ) {
    const state = new AppRegistrationState();

    //UI APP REG
    const adminUIApp = AppRegistrationUtil.createUIAppRegistration(
      appRootName,
      namespace,
      origin,
      state,
      deploymentContext
    );

    AppRegistrationUtil.configureUIAppRegistrationAuthorization(
      appRootName,
      adminUIApp,
      state,
      deploymentContext
    );

    //API APP REG
    const adminAdApp = AppRegistrationUtil.createApiAppRegistration(
      appRootName,
      namespace,
      deploymentContext,
      state
    );

    //UPDATE API App Reg with authorizations/secret
    AppRegistrationUtil.configureApiAppRegistrationAuthorization(
      appRootName,
      adminAdApp,
      state,
      deploymentContext
    );

    return state;
  }
}
