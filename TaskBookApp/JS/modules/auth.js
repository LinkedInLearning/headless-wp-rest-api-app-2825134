import config from './config.js';

/**
 * Capture and use the OAuth2 token
 * 
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 * 
 * @package Taskbook
 */

/**
 * Remove hash with token from the address bar.
 */
function removeHash() { 
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

// Get token from session storage.
let token = sessionStorage.getItem(config.tokenName);

// Get the current query string.
const queryString = window.location.hash.substr(1);
let urlParams = new URLSearchParams(queryString);
let newToken = urlParams.get('access_token');

// Get the current time.
let currentTime = Math.round((new Date()).getTime() / 1000);

// Check if the current time is later than the token expiry.
if ( currentTime > sessionStorage.getItem('tokenExpiry') ) {
    sessionStorage.removeItem(config.tokenName);
    token = null;
}

/**
 * Check if the browser has a token or if there's on in the query string.
 */
if ( token === null && newToken === null ) {
    // If no, go to the login page.
    window.location = `${window.location.origin}/login.html`;
} else {
    // If yes...
    if ( token === null ) {
        // ... but there's no token in sessionStorage, add one ...
        sessionStorage.setItem( config.tokenName, newToken );
        // ... and set tokenExpiry for 1 hour from now ...
        sessionStorage.setItem( 'tokenExpiry', (Math.round((new Date()).getTime() / 1000))+3600 );
        // ... and remove the hashed query string from the address bar ...
        removeHash();
    }

    // Get the token from sessionStorage
    token = sessionStorage.getItem(config.tokenName);
    
}

// Export token for use in other scripts.
export default token;
