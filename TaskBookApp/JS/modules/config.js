/**
 * Configuration for OAuth2 and REST API requests.
 * 
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 */

const rootURL = '';

const config = {
    rootURL: rootURL,
    taskRoute: `${rootURL}/wp-json/wp/v2/tasks/`,
    authURI: `${rootURL}/oauth/authorize`,
    clientID: '',
    responseType: 'token',
    tokenName: 'taskAppToken'
}

export default config ;