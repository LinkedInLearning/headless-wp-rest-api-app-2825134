import config from './config.js';

/**
 * Script for loading the Task list.
 *
 * Constant RESTROUTE and variable token inherited from oauth.js.
 */

// Get some DOM elements for later.
const taskList = document.querySelector( '.task-list ul' );
const loader = document.querySelector( '.loader' );
const more = document.querySelector( '.more' );

// Pagination count starts at page 2 and moves up.
let pageCount = 1;

/**
 * Display date property for new tasks, modified property for completed tasks.
 * Make displayed dates human readable.
 *
 * Called from within the foreach loop and applied to individual task objects.
 * 
 * @param object task - The current task object.
 */
function getDate( task ) {

	let date;
	let options = {
		weekday: "long",
		year:    "numeric",
		month:   "short",
		day:     "numeric",
		hour:    "2-digit",
        minute:  "2-digit",
        timeZone: "America/Los_Angeles"
	};

	if ( !task.modified ) {
		let taskDate = new Date(task.date);
		date = 'Task created <time datetime="' + task.date + '">' + taskDate.toLocaleDateString("en-US", options) + '</time>';
	} else {
		let taskModified = new Date(task.modified);
		date = 'Task updated <time datetime="' + task.modified + '">' + taskModified.toLocaleDateString("en-US", options) + '</time>';
	}

	return date;
}

/**
 * Load more tasks when browser is scrolled to the more button.
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
function morePostsTrigger() {

    const observer = new IntersectionObserver( function( entries, self ) {
        entries.forEach( entry => {
            if ( entry.isIntersecting ) {

                // Disconnect IntersectionObserver after first reveal.
                self.disconnect();

                // Bump up pageCount:
                pageCount++;

                // Get new tasks for the task list:
                getTaskList( `${config.taskRoute}?page=${pageCount}` );
                
            }
        });
    });
    observer.observe( document.querySelector( '.more' ) );

}


/**
 * Render HTML output for the task list.
 *
 * @param object taskObjectList - List of post objects.
 */
function createTaskList( taskObjectList ) {
    
    // Test to see if there are tasks to display.
    if ( taskObjectList.code != undefined ) {
        console.info( `No more tasks loaded becase ${taskObjectList.code}.` );
    } else {
        taskObjectList.forEach( taskObject => {
            let completed = taskObject.task_status === 'Completed' ? 'class="completed"' : '';
            let navListItem = document.createElement( 'li' );
            navListItem.innerHTML = `
                <a href="single.html?task=${taskObject.id}" ${completed}>
                    <h2 class="task-title">${taskObject.title.rendered}</h2>
                    <div class="task-date">${getDate(taskObject)}</div>
                    <div class="task-status">${taskObject.task_status}</div>
                </a>`;
            taskList.append(navListItem);
        });

        // Show 'more' button.
        more.style.display = 'block';
        morePostsTrigger();
    }
    
    // Stop the spinner.
    loader.style.display = 'none';

}


/**
 * Fetch 10 tasks based on the provided listRoute.
 * 
 * @param string listRoute - Request route for the REST API.
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
const getTaskList = ( listRoute ) => {

    // Remove the Load More Tasks button.
    more.style.display = 'none';
    
    // Display the loading spinner as we wait for the response. 
	loader.style.display = 'block';

    // Fetch the 10 latest tasks.


}

// Make getTaskList() avaialble to other script files.
export default getTaskList;
