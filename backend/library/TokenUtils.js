const { importSPKI, jwtVerify } = require('jose');

// PEM certificate
const pemCertificate = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzIKQ+V528e3nGaOL72XA
avmL2HAXwdG5+0Cg2X+ezPfSn2U+DxbYOKFyHXfdCj4ocgF1MKk1ECUDhMlZ6vsl
m7ZPuq9Nus6cYeBxSFdKXaC+vI0hpghkGwAl7a6YT4HAbZ3qs+T7My5gaeuXI1j+
8KBOXK8VRDormzQlI0Q+qbfqUSMCNBMsknxFWfgxvvXSBqEOV2Yq0hbp+JSrsB1S
9DefmvNmxUKLDQ65MmInZ7HqfE+ocWt6H0ba9zISCgjSEs4m0fY6fr99EhuQ9vKX
GcxQfvu2qAOHz0te4yQ67xoUGWzMCmZG3TUTfYz+kFVCSJSrmSnTzkppffio7ooA
owIDAQAB
-----END PUBLIC KEY-----`;

async function verifyAndDecodeToken(token) {
  try {
    // Extract the public key from the PEM certificate using jose package
    const publicKey = await importSPKI(pemCertificate, 'RS256');

    // Verify the ID token using the public key
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ['RS256'],
    });
    return payload; // The payload contains the claims from the token
  } catch (error) {
    console.error('Error verifying and decoding token:', error.message);
    throw error;
  }
}

module.exports = { verifyAndDecodeToken };
