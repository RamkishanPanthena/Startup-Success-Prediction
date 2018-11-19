
function chooseModel(){
	var x = document.getElementById("modelname").value;
	
	if (x === "model2"){
		document.getElementById("smallbox").style.visibility="hidden";
		document.getElementById("smallbox4").style.visibility="visible";
	}
	if (x === "model3") {
		document.getElementById("smallbox").style.visibility="hidden";
		document.getElementById("smallbox4").style.visibility="hidden";
	}
	if (x === "model1") {
		document.getElementById("smallbox").style.visibility="visible";
		document.getElementById("smallbox4").style.visibility="visible";
	}
}

 function connectFlask() {
  var url = "http://127.0.0.1:5000/roc_curve/"
  var modelname = document.getElementById("modelname").value;
  var max_depth = document.getElementById("depth").value;
  var max_leaf_nodes = document.getElementById("leaf").value;
  var n_estimators = document.getElementById("estimators").value;
  var learning_rate = document.getElementById("lr").value;
  
  if (learning_rate==="") {
	learning_rate = .0001;
  }
  
  if (n_estimators==="") {
	n_estimators = 10;
  }
  
  url1 = url.concat("m=").concat(modelname).concat("/d=").concat(max_depth).concat("/l=").concat(max_leaf_nodes).concat("/n=").concat(n_estimators).concat("/c=").concat(learning_rate);
  

  d3.json(url1).then(function(data) {
    drawRoc(data);
  });
}




function drawRoc(data){

var w = 800;
var h = 450;
var padding = 50;
    
var xScale = d3.scaleLinear()
    .domain([0,1])
    .range([0, w/2])

var yScale = d3.scaleLinear()
    .domain([0,1])
    .range([h-h/10, 0]);

d3.select("#chart1")
	.selectAll("*")
	.remove();
   
var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", w + padding)
    .attr("height", h + padding)
    .attr("align","center-right")
    .append("g")
    .attr("transform", "translate(" + 275 + "," + padding + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h-h/10) + ")")
    .call(d3.axisBottom(xScale));

svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); 

var rocline = d3.line()
   .x(function(d) { return xScale(d.fpr)})
   .y(function(d) { return yScale(d.tpr)});
    
svg.append("path")
    .datum(data) 
    .attr("class", "line") 
    .attr("d", rocline);

svg.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(0))
    .attr("x2", xScale(1))
    .attr("y2", yScale(1))
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "8,8");
            
  
svg.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", (padding + 380))
    .attr("x",180)
    .attr("dy", "1em")
    .text("False Positive Rate ");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (padding/.9))
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .text("True Positive Rate ");
} 


function visualize(){
	
	//Width and height
	var w = 1200;
	var h = 600;
	//Define map projection
	var projection = d3.geoAlbersUsa()
						   .translate([w/2-w/12, h/2])
						   .scale([1200]);
	//Define path generator
	var path = d3.geoPath()
					 .projection(projection);
					 
	//Define quantize scale to sort data values into buckets of color
	var color = d3.scaleQuantize()
						.range(['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(166,217,106)','rgb(26,150,65)']);
						//Colors derived from ColorBrewer, by Cynthia Brewer, and included in
						//https://github.com/d3/d3-scale-chromatic
	
	//Remove previous svg elements
	d3.select("#chart1")
	.selectAll("*")
	.remove();
	//Create SVG element
	var svg = d3.select("#chart1")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
				
	var url = "http://127.0.0.1:5000/viz/"
	var modelname = document.getElementById("modelname").value;
	var learning_rate = document.getElementById("lr").value;
	var max_depth = document.getElementById("depth").value;
	var max_leaf_nodes = document.getElementById("leaf").value;
	var n_estimators = document.getElementById("estimators").value;
	
	if (learning_rate==="") {
	learning_rate = .0001;
  }
  
  if (n_estimators==="") {
	n_estimators = 10;
  }
  
  url1 = url.concat("m=").concat(modelname).concat("/d=").concat(max_depth).concat("/l=").concat(max_leaf_nodes).concat("/n=").concat(n_estimators).concat("/c=").concat(learning_rate);
  
  
			d3.csv(url1).then(function(data) {
				//Set input domain for color scale
				color.domain([
					d3.min(data, function(d) { return d.mean_prob_companies_acquired_by_state; }),
					d3.max(data, function(d) { return d.mean_prob_companies_acquired_by_state; })
				]);
				//Load in GeoJSON data
				d3.json("..\\us-states.json").then(function(json) {
					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					for (var i = 0; i < data.length; i++) {
				
						//Grab state name
						var dataState = data[i].State;
						
						//Grab data value, and convert from string to float
						var dataValue = parseFloat(data[i].mean_prob_companies_acquired_by_state);
						
						//Grab data value, and convert from string to float
						var dataAcquired = parseFloat(data[i].count_prob_companies_acquired_by_state);
						
						//Grab data value, and convert from string to float
						var dataClosed = parseFloat(data[i].count_prob_companies_closed_by_state);
						
				
						//Find the corresponding state inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {
						
							var jsonState = json.features[j].properties.name;
				
							if (dataState == jsonState) {
						
								//Copy the data value into the JSON
								json.features[j].properties.value = dataValue;
								json.features[j].properties.acquired = dataAcquired;
								json.features[j].properties.closed = dataClosed;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}
					//Bind data and create one path per GeoJSON feature
					svg.selectAll("path")
					   .data(json.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .style("fill", function(d) {
					   		//Get data value
					   		var value = d.properties.value;
					   		
					   		if (value) {
					   			//If value exists…
						   		return color(value);
					   		} else {
					   			//If value is undefined…
						   		return "#ccc";
					   		}
					   })
					   .style("fill-opacity", 1)
					   .style("stroke", "#a9a9a9")
					   .style("stroke-width", 1.5)
					   .on("mouseover", function(d) {
					//Get this bar's x/y values, then augment for the tooltip
					//Update the tooltip position and value
					var coordinates = d3.mouse(this);
					var xPosition = coordinates[0] + w/15;
					var yPosition = coordinates[1] + h/3;
					var format = d3.format(".4f");
					
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#state")
						.text(d.properties.name);
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#acquired")
						.text("Startups predicted to be acquired: " + d.properties.acquired);
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#closed")
						.text("Startups predicted to be closed: " + d.properties.closed);
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#prob")
						.text("Mean probability of startups to be acquired: " + format(d.properties.value));
			   
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
			   })
			   .on("mouseout", function() {
			   
					//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
					
			   });
			
				});
			var linear = d3.scaleQuantize()
			  .domain([
					d3.min(data, function(d) { return d.mean_prob_companies_acquired_by_state; }),
					d3.max(data, function(d) { return d.mean_prob_companies_acquired_by_state; })
				])
			  .range(['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(166,217,106)','rgb(26,150,65)']);

			var svg = d3.select("svg");

			svg.append("g")
			  .attr("class", "legendLinear")
			  .attr("transform", "translate(1000,200)");

			var legendLinear = d3.legendColor()
			  .shape('rect')
			  .shapeWidth(50)
			  .shapePadding(5)
			  .orient('vertical')
			  .ascending(true)
			  .scale(linear)
			  ;

			svg.select(".legendLinear")
			  .call(legendLinear);
			});
}
