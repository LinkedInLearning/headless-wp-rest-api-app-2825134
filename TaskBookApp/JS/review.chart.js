/**
 * Custom configuration of Chart.js
 *
 * @link http://chartjs.org/docs
 */

// Get the container that will hold the chart:
const CONTAINER = document.querySelector("#taskbook-chart");

// Define some colors:
const CHARTCOLORS = {
	red: 'rgb(255, 99, 132)',
	blue: 'rgb(54, 162, 235)'
};

var color = Chart.helpers.color;

// Parse level values into human readable strings:
function getLevel(objectLevel) {
  let level = objectLevel;

  switch (level) {
    case 1:
      return 'Very stressed (1)';
      break;
    case 2:
      return 'Somewhat stressed (2)';
      break;
    case 3:
      return 'Neutral (3)';
      break;
    case 4:
      return 'Somewhat relaxed (4)';
      break;
    case 5:
      return 'Very relaxed (5)';
      break;
  }
}

/**
 * Create the chart.
 *
 * Called from getTasks().
 */
function generateChart(object) {
  // Capture task data in an object for easy retrieval:
  var taskData = new Object();
  taskData.xLabels = [];
  taskData.preLevel = [];
  taskData.postLevel = [];

  // Loop through the returned REST API object and populate object:
  for(var i=0; i<object.length; i++) {
      taskData.xLabels.push(object[i].id);
      taskData.preLevel.push(object[i].cmb2.taskbook_rest_metabox.taskbook_pre_level);
      taskData.postLevel.push(object[i].cmb2.taskbook_rest_metabox.taskbook_post_level);
  }
	// Reverse results to display the oldest first:
	taskData.xLabels.reverse();
	taskData.preLevel.reverse();
	taskData.postLevel.reverse();

	// Set up the bar chart data model:
  var barChartData = {
      xLabels: taskData.xLabels,
      yLabels: ['Very stressed', 'Somewhat stressed', 'Neutral', 'Somewhat relaxed', 'Very relaxed'],
      datasets: [
          {
          label: 'Pre-task',
          backgroundColor: color(CHARTCOLORS.red).rgbString(),
          borderColor: CHARTCOLORS.red,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          data: taskData.preLevel,
      }, {
          label: 'Post-task',
          backgroundColor: color(CHARTCOLORS.blue).rgbString(),
          borderColor: CHARTCOLORS.blue,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          data: taskData.postLevel
      }]

  };

	// Draw out the chart with the following settings:
  var chart = new Chart(CONTAINER, {
    type: 'line',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stress level visualization'
      },
      elements: {
				line: {
					tension: 0.000001
				}
			},
      scales: {
        yAxes: [{
          ticks: {
            max: 5,
            min: 1,
            stepSize: 1,
            // Dislay the human readable level values on the Y axes:
            callback: function(value, index, values) {
              return getLevel(value);
            }
          }
        }]
      },
			tooltips: {
				mode: 'index',
				intersect: true
			}

    }
  });

	/**
	 * Make chart elements link to individual tasks.
	 */
	function handleClick(event) {
		// Get the clicked chart element:
		let activeElement = chart.getElementAtEvent(event);
		// Do nothing if the click is not on a point on the chart:
		if ( !activeElement[0] ) {
			return;
		}
		// Get the index number of the clicked element:
		let elementID = activeElement[0]._index;
		// Get the post ID from the taskData.xLabels object array:
		let postID = taskData.xLabels[activeElement[0]._index];
		// Go to the selected task:
		window.location.href = '/single.html?task=' + postID;

	}
	// Add event listener for clicks on the chart:
	CONTAINER.addEventListener( 'click', handleClick, false );

}

/**
 * Send REST request for the 10 most recent tasks.
 */
function getTasks() {

  $('.single-task').append('<div class="loader"><img src="JS/spinner.svg" class="ajax-loader" /></div>');

  jso.ajax({
    dataType: 'json',
    url: RESTROUTE
  })

  .done(function(object){
    taskID = object.id;
    generateChart(object);
  })

  .fail(function() {
    console.error('REST error. Nothing returned for AJAX.');
  })

  .always(function() {
    $('.loader').remove();
  })
}

// Redirect to login page if the user is not authenticated:
if ( token !== null ) {
  getTasks();
} else {
  window.location.href = "/";
}
