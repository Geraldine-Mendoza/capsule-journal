google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// creates html elements (look like list) correspoding to emotion selected on pie
function emEntries(emotion) {
    for(k in entries) {
        if(entries[k] && entries[k].emotion == emotion) {
            //document.getElementById('list-entries').innerHTML = 
        }
    }
}


function formatData() {
    // receive list of entries by person
    // [header x, header y]
    // [emotion string, number entries]
    let arrData = [['Emotion', 'Entries'], ['Happy', 0], ['Sad', 0], ['Confused', 0], ['Angry', 0], ['Excited', 0], ['Bored', 0], ['Scared', 0], ['None', 0]];
    console.log(entries);
    for(k in entries) {
        var entry = entries[k];
        switch(entry.emotion) {
            case Emotion.HAPPY: arrData[1][1] += 1; break;
            case Emotion.SAD: arrData[2][1] += 1; break;
            case Emotion.CONFUSED: arrData[3][1] += 1; 
            case Emotion.ANGRY: arrData[4][1] += 1;break;
            case Emotion.EXCITED: arrData[5][1] += 1;break;
            case Emotion.BORED: arrData[6][1] += 1;break;
            case Emotion.SCARED: arrData[7][1] += 1;break;
            case Emotion.NONE: arrData[8][1] += 1;break;
        }
    }
    return arrData;
}

async function drawChart() {
  
    let arrData = await formatData();
    console.log(arrData);
    var data = google.visualization.arrayToDataTable(arrData);

    var options = {
        enableInteractivity: true
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    
    // The select handler. Call the chart's getSelection() method
    function selectHandler() {
            if(!chart.getSelection) return;  
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
        var value = data.getValue(selectedItem.row, 0);
        console.log('The user selected ' + value);
        }
    }

    // Listen for the 'select' event, and call my function selectHandler() when
    // the user selects something on the chart.
    google.visualization.events.addListener(chart, 'select', selectHandler);

    chart.draw(data, options);
}