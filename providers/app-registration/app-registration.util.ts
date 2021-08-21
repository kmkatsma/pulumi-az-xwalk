import * as azuread from '@pulumi/azuread';
import * as pulumi from '@pulumi/pulumi';
import { IDeploymentContext } from '../../core/deployment-context';
import { AppRegistrationState } from './app-registration.config';
import { AppRegistrationAuthorizationSettings } from './app-registration-authorization.provider';
import { AppRegistrationType } from './app-registration.config';

export class AppRegistrationUtil {
  static createApiAppRegistration(
    appRootName: string,
    namespace: string,
    deploymentContext: IDeploymentContext,
    state: AppRegistrationState
  ) {
    const resourceName = `${appRootName}API`.toUpperCase();
    const consentDisplayName = `${deploymentContext.groupRootName}${namespace}.${appRootName}API`;
    const consentDisplayDescription = `Provides ${namespace} Functionality`;
    const appRegistrationName = `app-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${resourceName}-${deploymentContext.Stack}`.toUpperCase();

    const appReg = new azuread.Application(appRegistrationName, {
      name: appRegistrationName,
      availableToOtherTenants: false,
      identifierUris: [`api://${consentDisplayName}`],
      oauth2AllowImplicitFlow: false,
      oauth2Permissions: [
        {
          adminConsentDescription: consentDisplayDescription,
          adminConsentDisplayName: consentDisplayName,
          isEnabled: true,
          type: 'User',
          userConsentDescription: consentDisplayDescription,
          userConsentDisplayName: consentDisplayName,
          value: 'default',
        },
      ],
      requiredResourceAccesses: [
        {
          resourceAppId: '00000003-0000-0000-c000-000000000000',
          resourceAccesses: [
            {
              id: 'e1fe6dd8-ba31-4d61-89e7-88639da4683d',
              type: 'Scope',
            },
          ],
        },
      ],
      type: 'webapp/api',
    });
    state.apiAppClientId = appReg.applicationId;
    state.apiAppId = appReg.id;
    state.apiResourceScope = `api://${consentDisplayName}`;
    return appReg;
  }

  static configureApiAppRegistrationAuthorization(
    appRootName: string,
    apiApp: azuread.Application,
    state: AppRegistrationState,
    deploymentContext: IDeploymentContext
  ) {
    const apiRegistrationName = `${
      deploymentContext.groupRootName
    }${appRootName.toLowerCase()}ApiAppRegistration`;
    const appAuthorizationSettings = new AppRegistrationAuthorizationSettings(
      apiRegistrationName,
      {
        appId: state.apiAppId,
        type: AppRegistrationType.Api,
        authorizedApp: state.uiAppClientId,
        authorizedScope: state.apiResourceScope,
        appRegistrationName: apiRegistrationName,
        secret: true,
        deploymentContext,
      },
      { dependsOn: apiApp }
    );
  }

  static createUIAppRegistration(
    appRootName: string,
    namespace: string,
    origin: pulumi.Output<string>,
    state: AppRegistrationState,
    deploymentContext: IDeploymentContext
  ) {
    const resourceName = `${appRootName}UI`.toUpperCase();
    const consentDisplayName = `${deploymentContext.groupRootName}${namespace}.${appRootName}UI`;
    const consentDisplayDescription = `Provides ${namespace} UI Functionality`;
    const appRegistrationName = `app-${deploymentContext.Prefix}-${deploymentContext.groupRootName}-${resourceName}-${deploymentContext.Stack}`.toUpperCase();

    const replyUrls = [origin];
    if (deploymentContext.Stack.toUpperCase() === 'DEV') {
      replyUrls.push(pulumi.output('http://localhost:4200'));
    }

    const uiAppReg = new azuread.Application(appRegistrationName, {
      name: appRegistrationName,
      availableToOtherTenants: false,
      identifierUris: [`api://${consentDisplayName}`],
      oauth2AllowImplicitFlow: true,
      oauth2Permissions: [
        {
          adminConsentDescription: consentDisplayDescription,
          adminConsentDisplayName: consentDisplayName,
          isEnabled: true,
          type: 'User',
          userConsentDescription: consentDisplayDescription,
          userConsentDisplayName: consentDisplayName,
          value: 'default',
        },
      ],
      optionalClaims: {
        accessTokens: [
          {
            name: 'verified_primary_email',
            essential: false,
            additionalProperties: [],
          },
          {
            name: 'email',
            essential: false,
            additionalProperties: [],
          },
          {
            name: 'ipaddr',
            essential: false,
            additionalProperties: [],
          },
          {
            name: 'family_name',
            essential: false,
            additionalProperties: [],
          },
          {
            name: 'given_name',
            essential: false,
            additionalProperties: [],
          },
        ],
      },
      replyUrls: replyUrls,
      requiredResourceAccesses: [
        {
          resourceAppId: 'ded7e9a8-68dd-464e-bb4e-dcdfdb78a9b9',
          resourceAccesses: [
            {
              id: '1cb7daab-a224-41ae-bfef-a3ef9a06326a',
              type: 'Scope',
            },
          ],
        },
        {
          resourceAppId: '00000003-0000-0000-c000-000000000000',
          resourceAccesses: [
            {
              id: '64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0',
              type: 'Scope',
            },
            {
              id: '14dad69e-099b-42c9-810b-d002981feec1',
              type: 'Scope',
            },
            {
              id: 'e1fe6dd8-ba31-4d61-89e7-88639da4683d',
              type: 'Scope',
            },
          ],
        },
      ],
    });
    state.uiAppClientId = uiAppReg.applicationId;
    state.uiAppId = uiAppReg.id;
    return uiAppReg;
  }

  static configureUIAppRegistrationAuthorization(
    appRootName: string,
    uiApp: azuread.Application,
    state: AppRegistrationState,
    deploymentContext: IDeploymentContext
  ) {
    const appUIRegistrationName = `${
      deploymentContext.groupRootName
    }${appRootName.toLowerCase()}UIAppRegistration`;
    const adminUIAppRegiSettings = new AppRegistrationAuthorizationSettings(
      appUIRegistrationName,
      {
        appId: state.uiAppId,
        type: AppRegistrationType.Spa,
        appRegistrationName: appUIRegistrationName,
        deploymentContext,
      },
      { dependsOn: uiApp }
    );
  }
}
