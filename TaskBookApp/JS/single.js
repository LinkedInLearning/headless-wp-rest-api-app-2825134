import config from './modules/config.js';
import token from './modules/auth.js';
import logout from './modules/logout.js';
import getSingleTask from './modules/loadsingle.js';

// Get the current URL and grab the value from the task query parameter:
var urlParams = new URLSearchParams( window.location.search );
const taskID = urlParams.get( 'task' );
console.info( 'Task ID: ', taskID );

// Check for a logout event.
logout();


/**
 * If the user is authenticated, get the task list,
 * else, jump to the login view.
 */
if ( token === null ) {
    window.location = `${window.location.origin}/login.html`;
} else {
    let taskRoute = config.taskRoute + taskID;
    getSingleTask( taskRoute );
}
