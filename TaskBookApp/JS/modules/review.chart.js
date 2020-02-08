const loader = document.querySelector( '.loader' );

// Get the container that will hold the chart:
const container = document.querySelector("#taskbook-chart");

// Define some colors:
const chartColors = {
	red: 'rgb(255, 99, 132)',
	blue: 'rgb(54, 162, 235)'
};

var color = Chart.helpers.color;

// Parse level values into human readable strings:
function getLevel(objectLevel) {
    let level = objectLevel;
  
    switch (level) {
      case -2:
        return 'Very stressed';
        break;
      case -1:
        return 'Somewhat stressed';
        break;
      case 0:
        return 'Neutral';
        break;
      case 1:
        return 'Somewhat relaxed';
        break;
      case 2:
        return 'Very relaxed';
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
        taskData.preLevel.push(object[i].cmb2.taskbook_rest_metabox.taskbook_pre_level-2);
        taskData.postLevel.push(object[i].cmb2.taskbook_rest_metabox.taskbook_post_level-2);
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
            backgroundColor: color(chartColors.red).rgbString(),
            borderColor: chartColors.red,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: false,
            data: taskData.preLevel,
        }, {
            label: 'Post-task',
            backgroundColor: color(chartColors.blue).rgbString(),
            borderColor: chartColors.blue,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: false,
            data: taskData.postLevel
        }]
  
    };
  
      // Draw out the chart with the following settings:
    var chart = new Chart(container, {
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
                        max: 2,
                        min: -2,
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
    container.addEventListener( 'click', handleClick, false );
  
    loader.style.display = 'none';
}

const getChart = ( taskRoute ) => {
    
    // Display the loading spinner as we wait for the response. 
    loader.style.display = 'block';
    
    let requestRoute = `${taskRoute}?per_page=100`;

	fetch( requestRoute , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem( 'taskAppToken' )
            }
        })
        .then( response => response.json() )
        .then( taskObjects => generateChart( taskObjects ) )
        .catch( (error) => {
            console.error('Fetch error:', error);
            // Stop the spinner.
            loader.style.display = 'none';
        });
}

// Make getChart() avaialble to other script files.
export default getChart;