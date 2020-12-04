// Copyright 2016-2018, Pulumi Corporation.  All rights reserved.

import * as pulumi from '@pulumi/pulumi';

export interface AppSettingsArgs {
  appServiceName: pulumi.Input<string>;
  settings: pulumi.Input<Record<string, string>>;
}

const appServiceName = 'appServiceName';

// There's currently a native way to enable the Static Web Site feature of a storage account with Pulumi.
// This provider was created when that wasn't available.
// It's kept for illustrative purpose only.
// A custom provider which wraps corresponding Azure CLI commands.
class AppSettingsProvider implements pulumi.dynamic.ResourceProvider {
  public async check(
    olds: any,
    news: any
  ): Promise<pulumi.dynamic.CheckResult> {
    const failures = [];

    if (news[appServiceName] === undefined) {
      failures.push({
        property: appServiceName,
        reason: `required property '${appServiceName}' missing`,
      });
    }

    return { inputs: news, failures };
  }

  public async diff(
    id: pulumi.ID,
    olds: any,
    news: any
  ): Promise<pulumi.dynamic.DiffResult> {
    const replaces = [];

    if (olds[appServiceName] !== news[appServiceName]) {
      replaces.push(appServiceName);
    }

    return { replaces };
  }

  public async create(inputs: any): Promise<pulumi.dynamic.CreateResult> {
    const { execSync } = require('child_process');
    const url = require('url');
    const id = inputs[appServiceName];

    // Helper function to execute a command, suppress the warnings from polluting the output, and parse the result as JSON

    // Install Azure CLI extension for storage (currently, only the preview version has the one we need)

    // Update the service properties of the storage account to enable static website and validate the result

    //if (!update.staticWebsite.enabled) {
    //  throw new Error(`Static website update failed: ${update}`);
    //}

    // Extract the web endpoint and the hostname from the storage account
    //const endpoint = executeToJson(
    //  `az storage account show -n "${accountName}" --query "primaryEndpoints.web"`
    //);
    //const hostName = url.parse(endpoint).hostname;

    // Files for static websites should be stored in a special built-in container called '$web', see https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website
    //const webContainerName = '$web';

    return {
      id: `${id}`,
      outs: {},
    };
  }
}

export class AppServiceAppSettings extends pulumi.dynamic.Resource {
  public readonly endpoint: pulumi.Output<string>;
  public readonly hostName: pulumi.Output<string>;
  public readonly webContainerName: pulumi.Output<string>;

  constructor(
    name: string,
    args: AppSettingsArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(
      new AppSettingsProvider(),
      name,
      {
        ...args,
        endpoint: undefined,
        hostName: undefined,
        webContainerName: undefined,
      },
      opts
    );
  }
}
