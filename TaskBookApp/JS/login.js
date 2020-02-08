import config from './modules/config.js';

/**
 * Login script.
 * 
 * When Login button is clicked, browser navigates to the WP login 
 * page with client_id and response_type in the URL query.
 * 
 * @package Taskbook
 */

const login = document.querySelector( '#login' );

login.addEventListener( 'click', () => {
    window.location = `${config.authURI}?client_id=${config.clientID}&response_type=${config.response}`;
});