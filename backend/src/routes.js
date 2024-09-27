// src/routes.js
const express = require('express');
const OAuthClient = require('./OAuthClient');
const router = express.Router();
const { importSPKI, jwtVerify } = require('jose');

// Initialize OAuth client with required parameters
const oauth = new OAuthClient(
  'si_CHgOiIiudCkk',
  'wmkg_daBbSNAHrfO50kyskLtMyA',
  'http://localhost:4000/oauth/callback',  // Redirect URI
  'https://testshubham.miniorange.in/moas/idp/openidsso',    // Authorization URL
  'https://testshubham.miniorange.in/moas/rest/oauth/token'         // Token URL
);

// Route to initiate the login process (POST request from frontend)
router.post('/login', (req, res) => {
  const state = 'someRandomState';  
  const authUrl = oauth.getAuthorizationUrl(state);
  res.json({ authUrl });
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
  
    try {
      // Exchange code for token
      const tokenResponse = await oauth.exchangeCodeForToken(code);
      
      // Verify and decode the ID token
      const decodedPayload = await verifyAndDecodeToken(tokenResponse.id_token);
        console.log("token decoded ...")
      res.json({
        decodedPayload
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify token', details: error.message });
    }
  });


  async function verifyAndDecodeToken(token) {
    try {
      // Load the PEM certificate (ensure to replace with your actual PEM file path)
      const pemCertificate = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzIKQ+V528e3nGaOL72XA
avmL2HAXwdG5+0Cg2X+ezPfSn2U+DxbYOKFyHXfdCj4ocgF1MKk1ECUDhMlZ6vsl
m7ZPuq9Nus6cYeBxSFdKXaC+vI0hpghkGwAl7a6YT4HAbZ3qs+T7My5gaeuXI1j+
8KBOXK8VRDormzQlI0Q+qbfqUSMCNBMsknxFWfgxvvXSBqEOV2Yq0hbp+JSrsB1S
9DefmvNmxUKLDQ65MmInZ7HqfE+ocWt6H0ba9zISCgjSEs4m0fY6fr99EhuQ9vKX
GcxQfvu2qAOHz0te4yQ67xoUGWzMCmZG3TUTfYz+kFVCSJSrmSnTzkppffio7ooA
owIDAQAB
-----END PUBLIC KEY-----`;
      
  
      // Extract the public key from the PEM certificate using jose package
      const publicKey = await importSPKI(pemCertificate, 'RS256');
  
      // Verify the ID token using the public key
      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: ['RS256'], // Use the correct algorithm
      });
      return payload; // The payload contains the claims from the token
 
    } catch (error) {
      console.error('Error verifying and decoding token:', error.message);
      throw error;
    }
  }
  

module.exports = router;
