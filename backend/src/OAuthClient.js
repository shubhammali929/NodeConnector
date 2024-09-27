const axios = require('axios');

class OAuthClient {
  constructor(clientId, clientSecret, redirectUri, authUrl, tokenUrl) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUrl = authUrl;
    this.tokenUrl = tokenUrl;
  }

  // Method to generate authorization URL
  getAuthorizationUrl(state) {
    return `${this.authUrl}?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
  }

  // Method to exchange authorization code for token
 // Method to exchange authorization code for token
async exchangeCodeForToken(authcode) {
  const tokenUrl = this.tokenUrl;
  
  // Build the token request payload
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', this.clientId);
  params.append('client_secret', this.clientSecret);
  params.append('redirect_uri', this.redirectUri);
  params.append('code', authcode);
  params.append('scope', 'openid');
  
  console.log("Token request parameters:", params.toString()); // Log the request parameters
  
  try {
    // Send the POST request with correct payload
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in token exchange request:", error.response?.data || error.message);
    throw error;
  }
}

  
}

module.exports = OAuthClient;
