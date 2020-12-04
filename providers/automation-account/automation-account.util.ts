import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure';

//TODO
/*
const exampleResourceGroup = new azure.core.ResourceGroup(
  'exampleResourceGroup',
  { location: 'West Europe' }
);
const exampleAccount = new azure.automation.Account('exampleAccount', {
  location: exampleResourceGroup.location,
  resourceGroupName: exampleResourceGroup.name,
  skuName: 'Basic',
  tags: {
    environment: 'development',
  },
});

const exampleCredential = new azure.automation.Credential('exampleCredential', {
  resourceGroupName: exampleResourceGroup.name,
  automationAccountName: exampleAccount.name,
  username: 'example_user',
  password: 'example_pwd',
  description: 'This is an example credential',
});
*/
