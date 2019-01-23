
/**
 * This is an example of how the gcp-metadata npm modules asks for service
 * accounts.  This is one piece of the pizza.
 */
async function http() {
  const gaxios = require('gaxios');
  const res = await gaxios.request({
    url: 'http://metadata.google.internal./computeMetadata/v1/instance/service-accounts/?recursive=true',
    method: 'GET',
    headers: {
      'Metadata-Flavor': 'Google'
    }
  });
  console.log(res.data);
}
// http().catch(console.error);

/**
 * This shows how the auth library and gcp-metadata talk to the metadata
 * service.  This is the one that hits
 */
async function metadata() {
  const gcp = require('gcp-metadata');
  const isAvailable = await gcp.isAvailable();
  console.log(`available: ${isAvailable}`);
}
//metadata().catch(console.error);

/**
 * This is an example of putting it all together.  This matches what most
 * client libraries are going to do.
 */
async function listVMs() {
  const {google} = require('googleapis');
  const compute = google.compute('v1');
  const authClient = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/compute',
      'https://www.googleapis.com/auth/compute.readonly',
    ],
  });
  const projectId = await google.auth.getProjectId();
  const result = await compute.instances.aggregatedList({
    auth: authClient,
    project: projectId,
  });
  const vms = result.data;
  console.log('VMs:', vms);
}
listVMs().catch(console.error);
