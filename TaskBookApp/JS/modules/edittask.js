import config from './config.js';

// Get the current URL and grab the value from the task query parameter:
var urlParams = new URLSearchParams( window.location.search );
const taskID = urlParams.get( 'task' );
console.info( 'Task ID: ', taskID );


function generateFormData( newTask ) {
	let formData;
	if ( newTask ) {
		formData = {
			"status": "private",
			"title": document.querySelector( 'input[name=title]' ).value,
			"content": document.querySelector( 'textarea[name=description]' ).value,
			"cmb2": {
                "taskbook_rest_metabox": {
                    "taskbook_prediction": document.querySelector( 'textarea[name=prediction]' ).value,
                    "taskbook_pre_level": document.querySelector( 'input[name=pre-level]:checked' ).value
                }
			}
		};
	} else {
		formData = {
			"cmb2": {
                "taskbook_rest_metabox": {
                    "taskbook_outcome": document.querySelector( 'textarea[name=outcome]' ).value,
                    "taskbook_post_level": document.querySelector('input[name=post-level]:checked' ).value
                }
			}
		};
    }
    console.log(formData)
    return formData;

}

function submitTask( newTask ) {

    // Get the form data.
    let formData = generateFormData( newTask );

    // Build a request route.
	let requestRoute = config.taskRoute;
	if ( !newTask ) {
		requestRoute = requestRoute + taskID;
    }
    
    // Send a POST request with the form data to the route.
    fetch( requestRoute, {
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem( config.tokenName )
            }
        })
        .then( response => response.json() )
        .then( () => {
            if ( newTask ) {
                window.location = window.location.origin;
            } else {
                window.location.reload();
            }

        })
        .catch( (error) => {
            console.error('Fetch error:', error);
            // Stop the spinner.
            loader.style.display = 'none';
        });

}

const monitorFormSubmit = ( newTask ) => {

    // Get the task form (if any).
    const taskForm = document.querySelector( '#task-form' );
    
    // If there is a task form to display, monitor the Update Task button.
    if ( taskForm ) {
        taskForm.addEventListener( 'submit', ( event ) => {
            event.preventDefault();
            submitTask( newTask );
        });
    }

}

export default monitorFormSubmit;