import config from './modules/config.js';
import token from './modules/auth.js';
import logout from './modules/logout.js';
import getChart from './modules/review.chart.js';

// Check for a logout event.
logout();

/**
 * If the user is authenticated, get the task list,
 * else, jump to the login view.
 */
if ( token === null ) {
    window.location = `${window.location.origin}/login.html`;
} else {
	getChart( config.taskRoute );
}