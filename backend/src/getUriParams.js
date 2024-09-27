// Function to extract all necessary OAuth parameters from the URL and session storage
export const getUriParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      grant_type: sessionStorage.getItem('grant_type'), // Get the grant type from sessionStorage
      random_state: urlParams.get('state'),            // Extract the 'state' from the URL
      error: urlParams.get('error'),                   // Extract the 'error' from the URL (if any)
      authCode: urlParams.get('code'),                 // Extract the 'code' from the URL (for authorization_code and pkce grant)
      accessToken: urlParams.get('access_token'),      // Extract the 'access_token' (for implicit grant)
      idToken: urlParams.get('id_token')               // Extract the 'id_token' (for implicit grant)
    };
  };
  