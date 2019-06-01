function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    var arr = Object.entries(response)

    // table to append metadata
    var table = metadata.append("tb")

    for (i = 0; i < arr.length; i++) { 
      table.append("tr").text(arr[i][0]+": "+arr[i][1])
      .style("font-size", "12px")
      .style("font-weight", "bold");
    }
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(response) {
      
      var data = [];

      //for loop to create array of dictionary items
      for (i = 0; i < response.otu_ids.length; i++) { 

        var dict = {
          otu_id: response.otu_ids[i],
          otu_label: response.otu_labels[i],
          sample_value: response.sample_values[i]
        };

        data.push(dict);
      }

    //Sorts descending based on sample_values
    data.sort(function compareFunction(first_obj, second_obj) {
      firstNum = first_obj.sample_value;
      secondNum = second_obj.sample_value;
    return secondNum - firstNum;
    });

    //slice data to get top 10
    top_ten = data.slice(0,10)

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      text: response.otu_labels,
      marker: {
        color: response.otu_ids,
        opacity: [1, 0.8, 0.6, 0.4],
        size: response.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Belly Bubble',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart: Working Pie Chart

    pie_id = top_ten.map(chart_data => chart_data.otu_id);
    pie_values = top_ten.map(chart_data => chart_data.sample_value);
    pie_hover = top_ten.map(chart_data => chart_data.otu_label);

    var trace2 = {
      labels: pie_id,
      values: pie_values,
      text: pie_hover,
      hoverinfo: 'text',
      textinfo: 'percent',
      type: 'pie'
    };
  
    var data = [trace2];

    var layout = {
      height: 500,
      width: 600,
      title: "Belly BioDiversity",
    };

    Plotly.newPlot("pie", data, layout);

    });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
