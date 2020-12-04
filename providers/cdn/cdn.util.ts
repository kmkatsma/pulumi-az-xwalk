// Web endpoint to the website
/*export const staticEndpoint = storageAccount.primaryWebEndpoint;

// We can add a CDN in front of the website
const cdn = new azure.cdn.Profile(`website-cdn-${stack}`, {
  resourceGroupName: resourceGroup.name,
  sku: 'Standard_Microsoft',
});

const endpoint = new azure.cdn.Endpoint(`website-cdn-ep-${stack}`, {
  resourceGroupName: resourceGroup.name,
  profileName: cdn.name,
  originHostHeader: storageAccount.primaryWebHost,
  origins: [
    {
      name: 'blobstorage',
      hostName: storageAccount.primaryWebHost,
    },
  ],
});

// CDN endpoint to the website.
// Allow it some time after the deployment to get ready.
export const cdnEndpoint = pulumi.interpolate`https://${endpoint.hostName}/`;
*/
