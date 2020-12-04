export interface AzAdPasswordCredential {
  displayName?: string; //	String	Friendly name for the password. Optional.
  endDateTime?: string; //	DateTimeOffset	The date and time at which the password expires represented using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 would look like this: '2014-01-01T00:00:00Z'. Optional. The default value is "startDateTime + 2 years".
  startDateTime?: string;
}

export interface AzAdPasswordCredentialData {
  displayName?: string; //	String	Friendly name for the password. Optional.
  endDateTime?: string; //	DateTimeOffset	The date and time at which the password expires represented using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 would look like this: '2014-01-01T00:00:00Z'. Optional. The default value is "startDateTime + 2 years".
  startDateTime?: string;
  hint: string;
  keyId: string;
  secretText: string;
}

export interface AzAdInvitationResponse {
  id: string;
  invitedUser: AzAdInvitedUser;
}

export interface AzAdInvitedUser {
  id: string;
}

export interface AzAdUser {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

export interface AzureAdApp {
  api?: AzureAdAPI;
  web?: AzureAdWeb;
  tags?: string[];
  oauth2AllowIdTokenImplicitFlow?: boolean;
  oauth2AllowImplicitFlow?: boolean;
}

export interface AzureAdAPI {
  preAuthorizedApplications?: AzureAdPreAuthorizedApplication[];
  oauth2PermissionScopes?: Oauth2PermissionScopes[];
  requestedAccessTokenVersion?: number;
}

export interface AzureAdWeb {
  implicitGrantSettings?: AzureAdWebImplicitGrantSettings;
  redirectUris: string[];
}

export interface AzureAdWebImplicitGrantSettings {
  enableIdTokenIssuance: boolean; //	Boolean	Specifies whether this web application can request an ID token using the OAuth 2.0 implicit flow.
  enableAccessTokenIssuance: boolean;
}

export interface AzureAdPreAuthorizedApplication {
  appId: string;
  delegatedPermissionIds: string[];
}

export interface Oauth2PermissionScopes {
  adminConsentDescription: string;
  adminConsentDisplayName: string;
  id: string;
  isEnabled: boolean;
  type: string;
  userConsentDescription: string;
  userConsentDisplayName: string;
  value: string;
}
