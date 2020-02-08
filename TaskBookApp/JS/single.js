import config from './modules/config.js';
import token from './modules/auth.js';
import logout from './modules/logout.js';
import getSingleTask from './modules/loadsingle.js';
import monitorFormSubmit from './modules/edittask.js';

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
	/**
	 * Calls getSingleTask and sets newTask.
	 */
	if ( taskID ) {
        // If we have a task ID, this is not a new task.
		let taskRoute = config.taskRoute + taskID;
		getSingleTask( taskRoute );
		
	} else {
        // If we don't have a task ID, this is a new task.
		monitorFormSubmit( true );
	}
}
