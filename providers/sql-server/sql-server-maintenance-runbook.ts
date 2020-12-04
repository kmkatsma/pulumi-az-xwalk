import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure';

//TODO!!!
/*const exampleResourceGroup = new azure.core.ResourceGroup(
  'exampleResourceGroup',
  { location: 'West Europe' }
);
const exampleAccount = new azure.automation.Account('exampleAccount', {
  location: exampleResourceGroup.location,
  resourceGroupName: exampleResourceGroup.name,
  skuName: 'Basic',
});
const exampleRunBook = new azure.automation.RunBook('exampleRunBook', {
  location: exampleResourceGroup.location,
  resourceGroupName: exampleResourceGroup.name,
  automationAccountName: exampleAccount.name,
  logVerbose: true,
  logProgress: true,
  description: 'This is an example runbook',
  runbookType: 'PowerShellWorkflow',
  publishContentLink: {
    uri:
      'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/c4935ffb69246a6058eb24f54640f53f69d3ac9f/101-automation-runbook-getvms/Runbooks/Get-AzureVMTutorial.ps1',
  },
});*/
