import config from './config.js';
import monitorFormSubmit from './edittask.js';

const loader = document.querySelector( '.loader' );

/**
 * Display human readable dates:
 * For in-progress taks, show just published date,
 * for completed tasks, show both published and modified dates.
 */
function getDate( task ) {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Los_Angeles"
    };

    let taskDate = new Date(task.date);
    let date = `<div class="task-date">Task created <time>${taskDate.toLocaleDateString("en-US", options)}</time></div>`;

    var modifiedDate = new Date(task.modified);
    let modified = '';
    // Set modified only if taskDate and modifiedDate are different:
    if ( task.date != task.modified ) {
        modified = `<div class="task-date">Task updated <time>${modifiedDate.toLocaleDateString("en-US", options)}</time></div>`
    }
    
    return date + modified;
}

/**
 * Convert stress level values to human readable strings.
 * 
 * @param string taskLevel - The current task level as a number.
 */
function getLevel( taskLevel ) {
	switch ( taskLevel ) {
		case '1':
			return 'Very stressed';
			break;
		case '2':
			return 'Somewhat stressed';
			break;
		case '3':
			return 'Neutral';
			break;
		case '4':
			return 'Somewhat relaxed';
			break;
		case '5':
			return 'Very relaxed';
			break;
	}
}

/**
 * Display Outcome depending on status:
 * If status is open, allow editing of Outcome + Post-level.
 * If status is closed, display Outcome + Post-level.
 */
function getOutcome( taskObject ) {

    let taskStatus = taskObject.task_status;
    console.log('getOutcome taskStatus: ', taskStatus);
    let outcome;

    if ( taskStatus === 'Completed' ) {
        outcome = `
            <div class="task-outcome">
                <h3 class="task-sub">Task Outcome</h3>
                <div class="task-block">
                    ${taskObject.cmb2.taskbook_rest_metabox.taskbook_outcome}
                </div>
                <h3 class="task-sub">Post-task stress level</h3>
                <div class="task-pre-level level">
                    ${getLevel( taskObject.cmb2.taskbook_rest_metabox.taskbook_post_level )}
                </div>
            </div>`;
    } else {
        outcome = `
        <form id="task-form" method="POST">
            <label for="outcome">
                <span class="label">Outcome</span>
                <div class="field-description">What actually happened?</div>
            </label>
            <textarea name="outcome" rows="10" cols="50" minlength="20" required></textarea>
            <fieldset class="stress-level">
                <legend class="label">Actual stress level</legend>
                <label for="1">
                    <input type="radio" name="post-level" value="1" id="1" required>
                    <span>Very Stressed</span>
                </label>
                <label for="2">
                    <input type="radio" name="post-level" value="2" id="2" required>
                    <span>Somewhat Stressed</span>
                </label>
                <label for="3">
                    <input type="radio" name="post-level" value="3" id="3" required>
                    <span>Neutral</span>
                </label>
                <label for="4">
                    <input type="radio" name="post-level" value="4" id="4" required>
                    <span>Somewhat Relaxed</span>
                </label>
                <label for="5">
                    <input type="radio" name="post-level" value="5" id="5" required>
                    <span>Very Relaxed</span>
                </label>
            </fieldset>
            <input type="submit" value="Update task">
        </form>`;
        
    }
    
    return outcome;
}

/**
 * Build the Task HTML based on REST data.
 */
function buildTask( taskObject ) {
    console.log(taskObject);

    let taskArticle = document.createElement( 'article' );
    taskArticle.classList.add( 'task' );

    taskArticle.innerHTML = `
        <h2 class="task-title">${taskObject.title.rendered}</h2>
        <div class="task-meta">
            ${getDate(taskObject)}
        </div>
        <div class="task-description task-block">
            ${taskObject.content.rendered}
        </div>
        <div class="task-prediction">
            <h3 class="task-sub">Task Prediction</h3>
            <div class="task-block">
                ${taskObject.cmb2.taskbook_rest_metabox.taskbook_prediction}
            </div>
            <h3 class="task-sub">Pre-task stress level</h3>
            <div class="task-pre-level level">
                ${getLevel( taskObject.cmb2.taskbook_rest_metabox.taskbook_pre_level )}
            </div>
        </div><!-- .task-prediction -->
        ${getOutcome( taskObject )}`;

    let main = document.querySelector( '.single-task' );
    main.append( taskArticle );

    return taskObject;
}

/**
 * Run an AJAX REST request with the help of JSO's jQuery wrapper.
 */

const getSingleTask = ( taskRoute, newTask ) => {

    if ( newTask ) {
        monitorFormSubmit( newTask );
    } else {
        // Display the loading spinner as we wait for the response. 
	    loader.style.display = 'block'; 

        fetch( taskRoute, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem( config.tokenName )
                }
            })
            .then( response => response.json() )
            .then( taskObject => buildTask( taskObject ) )
            .then( ( taskObject ) => {
                loader.style.display = 'none';
                monitorFormSubmit( newTask );
            } )
            .catch( (error) => {
                console.error('Fetch error:', error);
                // Stop the spinner.
                loader.style.display = 'none';
            });
    }
	
}

// Make getSingleTask() avaialble to other script files.
export default getSingleTask;