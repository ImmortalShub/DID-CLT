// agent.js

const { createAgent } = require('@veramo/core');
const { DIDManager } = require('@veramo/did-manager');
const { KeyManager } = require('@veramo/key-manager');
const { KeyManagementSystem } = require('@veramo/kms-local');
const { DIDResolverPlugin } = require('@veramo/did-resolver');
const { Resolver } = require('did-resolver');
const { getResolver: ethrDidResolver } = require('ethr-did-resolver');
const { Entities, KeyStore, DIDStore } = require('@veramo/data-store');
const { DataSource } = require('typeorm');
const { EthrDIDProvider } = require('@veramo/did-provider-ethr');

// 1. Setup your local database connection using DataSource (NOT createConnection)
const dbConnection = new DataSource({
  type: 'sqlite',
  database: './database.sqlite', // or any path you want
  synchronize: true,             // auto-create tables
  entities: Entities,
});

async function setupAgent() {
  try {
    // 2. Initialize database
    await dbConnection.initialize();
    console.log('✅ Database connected successfully');

    // 3. Create the agent
    const agent = createAgent({
      plugins: [
        new KeyManager({
          store: new KeyStore(dbConnection),
          kms: {
            local: new KeyManagementSystem(),
          },
        }),
        new DIDManager({
          store: new DIDStore(dbConnection),
          defaultProvider: 'did:ethr:goerli',
          providers: {
            'did:ethr:goerli': new EthrDIDProvider({
              defaultKms: 'local',
              network: 'goerli', // test network
              rpcUrl: 'https://rpc.goerli.linea.build', // or use infura/alchemy
            }),
          },
        }),
        new DIDResolverPlugin({
          resolver: new Resolver({
            ...ethrDidResolver({
              networks: [
                { name: 'goerli', rpcUrl: 'https://rpc.goerli.linea.build' },
              ],
            }),
          }),
        }),
      ],
    });

    return agent;
  } catch (error) {
    console.error('❌ Error during agent setup:', error);
    throw error; // Rethrow the error so it can be handled in create-did.js
  }
}

module.exports = setupAgent;  // Exporting the async function for use elsewhere
