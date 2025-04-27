// issue-vc.js - Issue a Verifiable Credential using the agent

const { agent } = require('./agent.js');  // Import the agent setup

async function issueCredential() {
  try {
    // Define the credential to be issued
    const credential = {
      issuer: {
        id: 'did:example:issuer', // Replace with the actual DID of the issuer
      },
      credentialSubject: {
        id: 'did:example:subject', // Replace with the DID of the subject
        name: 'Alice',
        degree: 'Computer Science',
      },
    };

    // If the agent has an available method for issuing VC
    if (agent.issueCredential) {
      console.log('Using issueCredential method');
      const result = await agent.issueCredential({
        credential,
        proofFormat: 'jwt', // You can choose 'ldp' or other formats
      });

      console.log('✅ Credential issued successfully:');
      console.log(JSON.stringify(result, null, 2));
      return result;
    } else {
      throw new Error('No suitable method for issuing credentials found on agent');
    }
  } catch (error) {
    console.log('❌ Error issuing credential:', error);
  }
}

// Run the function
issueCredential();
