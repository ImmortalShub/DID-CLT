// create-did.js

const setupAgent = require('./agent.js');  // Using require instead of import

async function createDID() {
  try {
    const agent = await setupAgent();  // Ensure we're awaiting the agent setup

    const identifier = await agent.didManagerCreate();  // DID creation step

    console.log('✅ DID created successfully:', identifier);
  } catch (error) {
    console.error('❌ Error creating DID:', error);
  }
}

createDID();
