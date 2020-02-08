/**
 * Configuration for OAuth2 and REST API requests.
 * 
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 */

const rootURL = 'http://restapp.local';

const config = {
    rootURL: rootURL,
    taskRoute: `${rootURL}/wp-json/wp/v2/tasks/`,
    authURI: `${rootURL}/oauth/authorize`,
    clientID: 'EsMj0TRomCYQ2HSp0AialxHT18csceXAl2sznkm0',
    responseType: 'token',
    tokenName: 'taskAppToken'
}

export default config ;