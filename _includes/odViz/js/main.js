var width = 900,
height = 600;
d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
};

var centroids = {
			"Brevard":     {name: "Brevard",      x: -80.7439,   y: 28.263207, landUse: [{type: "residential", area: 526169317.21}, {type: "commercial", area:105493176.70}, {type: "recreational", area:10759859.60},   {type: "institutional", area:16959198.90}, {type: "agriculture", area:554116492.15},  {type: "public", area:764573723.28},  {type: "other", area:122135270.06}]},
			"Indian River":{name: "Indian River", x: -80.615701, y: 27.692808, landUse: [{type: "residential", area: 171909092.68}, {type: "commercial", area:23915750.89},  {type: "recreational", area:13607913.75},   {type: "institutional", area:6056124.64},  {type: "agriculture", area:583129780.61},  {type: "public", area:432252521.90},  {type: "other", area:16910492.40}]},
			"Lake":        {name: "Lake",         x: -81.711296, y: 28.761468, landUse: [{type: "residential", area: 607597472.49}, {type: "commercial", area:88056690.30},  {type: "recreational", area:15871813.28},   {type: "institutional", area:25101801.37}, {type: "agriculture", area:812492976.21},  {type: "public", area:1162364567.08}, {type: "other", area:266408756.53}]},
			"Orange":      {name: "Orange",       x: -81.323475, y: 28.514421, landUse: [{type: "residential", area: 645131757.78}, {type: "commercial", area:216121756.45}, {type: "recreational", area:192566200.46},  {type: "institutional", area:28656149.69}, {type: "agriculture", area:563578163.29},  {type: "public", area:636400446.49},  {type: "other", area:143073381.73}]},
			"Osceola":     {name: "Osceola",      x: -81.149495, y: 28.062663, landUse: [{type: "residential", area: 297200895.37}, {type: "commercial", area:59512438.00},  {type: "recreational", area:258555734.63},  {type: "institutional", area:10126315.39}, {type: "agriculture", area:2339271963.27}, {type: "public", area:594803061.97},  {type: "other", area:214119520.19}]},
			"Polk":        {name: "Polk",         x: -81.697676, y: 27.948864, landUse: [{type: "residential", area: 646056491.79}, {type: "commercial", area:283231689.58}, {type: "recreational", area:18361131.30},   {type: "institutional", area:22452760.62}, {type: "agriculture", area:1921438738.05}, {type: "public", area:1194148514.30}, {type: "other", area:1227615342.40}]},
			"Seminole":    {name: "Seminole",     x: -81.236303, y: 28.716975, landUse: [{type: "residential", area: 345240440.94}, {type: "commercial", area:56858967.82},  {type: "recreational", area:106802082.25},  {type: "institutional", area:13556838.54}, {type: "agriculture", area:88741392.41},   {type: "public", area:120631201.10},  {type: "other", area:26972537.85}]},
			"Sumter":      {name: "Sumter",       x: -82.081,    y: 28.70482,  landUse: [{type: "residential", area: 130834621.53}, {type: "commercial", area:23214683.27},  {type: "recreational", area:82870374.26},   {type: "institutional", area:5473241.88},  {type: "agriculture", area:756307854.53},  {type: "public", area:410947998.64},  {type: "other", area:45690714.59}]},
			"Volusia":     {name: "Volusia",      x: -81.192353, y: 29.060733, landUse: [{type: "residential", area: 635447612.27}, {type: "commercial", area:102042413.77}, {type: "recreational", area:45631593.75},   {type: "institutional", area:19086008.37}, {type: "agriculture", area:918005465.86},  {type: "public", area:933972559.97},  {type: "other", area:142983582.30}]}
};

//range of node.x, map to page width
var vx = d3.scale.linear().range([0.1*width, 0.6*width])
vx.domain([d3.min(d3.entries(centroids), function(d){return d.value.x}), d3.max(d3.entries(centroids), function(d){return d.value.x})])

//range of node.y, map to page height
var vy = d3.scale.linear().range([0.9*height, 0.22*height])
vy.domain([d3.min(d3.entries(centroids), function(d){return d.value.y}), d3.max(d3.entries(centroids), function(d){return d.value.y})])

for (var node in centroids){
	 if (centroids.hasOwnProperty(node)){
	 	centroids[node].x = vx(centroids[node].x);
	 	centroids[node].y = vy(centroids[node].y);
	 	centroids[node].fixed = true;
	 }		 
}


////////////////////////tooltip///////////////////////////
var tooltip = d3.select("body").append("div")	
   .attr("class", "tooltip")				
   .style("opacity", 0);

d3.select("#submit")
  .on("click", function() {
  	radio = d3.select("input[name = 'date']:checked").node().value;
  	switch(radio){
  		case "all":
  			day = 31;
  			break;
  		case "date":
  			day =  parseInt(d3.select("#datepicker").node().value.split("-")[2]);
  			break;
  		case "day":
  			day = d3.select("#weekday").node().value;
  			break;
  	}
	subClass = d3.select("#sub").node().value;
	tripPurp = d3.select("#purpose").node().value;

	fname = day + tripPurp + subClass + '.csv';
	//console.log(fname)
	map = d3.select("input[name = 'map']:checked").node().value;
	d3.select("#chart-area").attr("class", map);
    onChange(fname);
});
/////////////////////////link//////////////////////////////////////
// Set the range of link width
var maxWidth = 10, minWidth = 2;
var  v = d3.scale.linear().range([minWidth, maxWidth]);

/////////////////////////drawing svg///////////////////////////////
var svg = d3.select("#chart-area").append("svg")
		    .attr("width", width)
 			.attr("height", height);

////////////////////////pie chart//////////////////////////////////////
var w = 300
var h = 300

var outerRadius = 50;
var innerRadius = 0;

var pie = d3.layout.pie().value(function(d) {return d.area;}).sort(null);

// define arc generator
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
   	.outerRadius(outerRadius)

var pieColor = d3.scale.category10();
function tweenPie(b) {
		b.innerRadius = 0;
		var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
 		return function(t) { return arc(i(t)); };
}

// define the nodes
var radius = 6
var node = svg.append('g')
			    .attr("class", "nodes")
			  .selectAll("node")
				.data(d3.values(centroids))
			    .enter()
			  .append("g")
			    .attr("class", "node")

// add the text to nodes
node.append("text")
	.attr("x", 12)
	.attr("dy", ".35em")
	.style("font-size","15px")
	.text(function(d) { return d.name; });


// add circles and event; 
node.append("g")
	.attr("class", "pieWrapper")
	.attr("id", function(d){return "pie"+d.name.replace(/\s/g, '')})
	.on("click", function(d){  		
		d3.select(this).selectAll("g.arc").remove()
		tooltip.style("opacity", 0);
	});
node.append("circle")
	.attr("class", "centroid")
	.attr("r", radius)
	
node.attr("transform", function(d) {
	return "translate(" + d.x + "," + d.y + ")"; });



////////////////////////link fill/////////////////////////////////
var sourceColor = "#cc0000"
var destinationColor = "#00b8e6"
linkOpacity = 0.4
//Function to create the unique id for each link gradient
function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }


///////////////////////legend/////////////////////////////////////
var legendSvg = svg.append("g")
				.attr("class", "legend")
				.attr("transform", "translate(" + (0.67 * width) + "," + (0.15 * height) + ")")

var legendWidth = 250
var legendHeight = (maxWidth + minWidth)/2

var linearGradient = legendSvg.append("defs").append("linearGradient")
   					    .attr("id", "linear-gradient")
    						.attr("x1", "0%")
   						.attr("y1", "0%")
   						.attr("x2", "100%")
   						.attr("y2", "0%");
linearGradient.append("stop") 
   .attr("offset", "0%")   
   .attr("stop-color", sourceColor); //light blue
	//Set the color for the end (100%)
linearGradient.append("stop") 
   .attr("offset", "100%")   
   .attr("stop-color", destinationColor); //dark blue
	function roundTo(n , digit, ceiling = true){
	if (String(n).length > digit) {
   		var d = Math.pow(10, String(Math.round(n)).length-digit);
   		if (ceiling == true){
   			n = Math.ceil(n/d)*d; 
   		}
   		else n = Math.floor(n/d)*d;
	}
	return(n)
}

linkLegend = legendSvg.append('g')
  					  .attr("class", "linkLegend");

linkLegend.append("rect")
		  .attr("width", legendWidth)
		  .attr("height", legendHeight)
		  .attr("class", "linkSym")
		  .style("fill", "url(#linear-gradient)");

linkLegend.append("g")
		  .selectAll(".circle")
		    .data(["Origin", "Destination"])
		    .enter()
		  .append("circle")
		    .attr("class", "nodeSym")
		    .attr("cx", function(d, i){return legendWidth * i})
		    .attr("cy", 0.5*legendHeight)
		    .attr("r", radius)
		 
linkLegend.append("g")
		  .selectAll(".text")
		    .data(["Origin", "Width of the link indicates flow","Destination"])
		    .enter()
		  .append("text")
		    .attr("class", "nodeLab")
		    .attr("text-anchor", "middle")
		    .attr("x", function(d, i) {return 0.5*i*legendWidth;})
		    .attr("y", -radius)
		    .text(function(d){return d;});


pieLabel = ["Residential", "Commercial", "Recreational", "Institutional", "Agriculture", "Public", "Other"]

pieLegend = legendSvg.append("g")
					 .attr("class", "pieLegend")
					 .attr("transform", "translate(" + 0.1*legendWidth + "," + (2*radius + 54) + ")");
pieLegend.append("text")
		 .text("Click node to display land use pie chart")
	  	 .style("font-weight", "bold")
	  
var rectHeight = 15, rectWidth = 0.1*legendWidth;
pieLegend.selectAll("rect")
	       .data(pieLabel)
	       .enter()
    	 .append("rect")
	  	   .attr("class", "pieSym")
	  	   .attr("height", rectHeight)
	  	   .attr("width", rectWidth)
	  	   .attr("x", 0.5*legendWidth)
	  	   .attr("y", function(d, i){return i*1.2*rectHeight+10;})
	  	   .attr("fill", function(d,i){return pieColor(i)});

pieLegend.selectAll("label")
  		     .data(pieLabel)
  		     .enter()
  		   .append("text")
  		     .attr("class", "pieLab")
  		     .attr("x", 0.5*legendWidth+1.5*rectWidth)
  		     .attr("y", function(d, i){return i*1.2*rectHeight+0.8*rectHeight+10;})
  		     //.attr("text-anchor", "middle")
  		     .text(function(d){return d;});
/////////////////////////submit button////////////////////////
function onChange(fname){
	//reset the charting area
	svg.selectAll("g.links").remove();
	svg.selectAll("g.flowLegend").remove();
	svg.selectAll("defs.linkFill").remove();

	// read the link data
	d3.csv("/data/"+fname, function(error, links) {
	// Load the links and set the source and target
	links.forEach(function(link) {
		link.source = centroids[link.source];
		link.target = centroids[link.target];
		link.value = +link.value;
	});
	
 
	// Scale the range of link width
	v.domain([d3.min(links, function(d) { return d.value; }), d3.max(links, function(d) { return d.value; })]);
	
	var force = d3.layout.force()
		.nodes(d3.values(centroids))
		.links(links)
		.start();
	
	//Create the gradients definitions for each link
	var grads = svg.append("defs")
			     .attr("class", "linkFill")
			   .selectAll("linearGradient")
               .data(links)
                 .enter()
               .append("linearGradient")
				 .attr("id", getGradID) //unique ID for this specific source-target pairing
			     .attr("gradientUnits", "userSpaceOnUse")
				 .attr("x1", function(d) { return d.source.x; })
				 .attr("y1", function(d) { return d.source.y; })
				 .attr("x2", function(d) { return d.target.x; })
				 .attr("y2", function(d) { return d.target.y; })

	grads.append("stop").attr("offset", "0%").attr("stop-color", sourceColor);
	grads.append("stop").attr("offset", "100%").attr("stop-color", destinationColor);

	
	
	// add the links
	var edge = svg.append("g")
				    .attr("class", "links")
				  .selectAll(".path")
					.data(links)
					.enter()
				  .append("path")
				    .attr("class", "link")
					.style("opacity", linkOpacity)
					.style("stroke-width", function(d){return v(d.value);})
					.style("stroke", function(d){ return "url(#" + getGradID(d) + ")"; })
	// add event listener
	edge
	.on("mouseover", function(d){
		//////////////mouse on this link/////////////////
		edge
		.transition("hideLinks")
		.duration(200)
		.style("opacity", function(l){
			if (l === d)
				return 0.9
			else return 0.1
		})
		
		// show the tooltip
		tooltip.transition("showLinkTt")		
          	   .duration(200)		
          	   .style("opacity", .9);		
       	tooltip.html("From "+d.source.name+" to "+ d.target.name+"<br/>"+"Flow: "+d.value.toFixed(1))	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
	})
	.on("mouseout", function(d){
		/////////////mouse out this link////////////////////
		//reset this link
		edge.transition("resetLinks").duration(200).style("opacity", linkOpacity)
			//hide the tooltip
		tooltip.transition("resetLinkTt").duration(200).style("opacity", 0);	
	})
	
	console.log(edge)

	////////////////////////////////////Pie Chart//////////////////////////////////////	
	d3.selectAll("circle.centroid").on("mouseover", function(d) {
			//////////////mouse on this node///////////////
           	var production = d3.sum(edge.data().map(function(l) {
           		if (d === l.source) {
           			return(l.value)
           		}                                               
            }));
            
           	var attraction = d3.sum(edge.data().map(function(l) {
           		if (d === l.target ){
           			return(l.value)
           		}                                               
            }));
			
			//show total generation and attraction
			
			tooltip.transition("showNodeTt")		
           		   .duration(200)		
           	 	   .style("opacity", .9);	
        	tooltip.html(d.name +"<br/>" +"Production: "+ production.toFixed(1) + "<br/>Attraction: " + attraction.toFixed(1))	
              		.style("left", (d3.event.pageX + 10) + "px")		
              		.style("top", (d3.event.pageY - 28) + "px");
              		
			//highlight the links from/to this node
  			edge
			.transition("resetLinks")
			.duration(200)
  			.style("opacity", function(l){
    			if (d !== l.source && d !== l.target)
     		 		return 0.1;
     		 	else return 0.9
    		});
		})
		.on("mouseout", function(d){
			//////////////mouse out this node////////////
			
			//reset the links
  			edge.style("opacity", linkOpacity);
  			//hide the tooltip
  			tooltip.style("opacity", 0);	
		})
		.on("click", function(d){
			///////////////click the node//////////////////////
			//show the pie chart
			//set up groups (id = pie+name)
			dataset = d.landUse
			pieSvg = d3.select("#pie"+d.name.replace(/\s/g, '')).style("opacity", 0.8)
			var arcs = pieSvg.selectAll("g.arc")
				  .data(pie(dataset))
				  .enter()
				  .append("g")
				  .attr("class", "arc")
				 
				//bind event listener
				arcs.on("mouseover", function(d){
					
           	   		var total = d3.sum(dataset.map(function(d) {               
              			return d.area;                                           
            		}));
            		var percent = Math.round(1000 * d.data.area / total) / 10;
            		tooltip.transition("PieTt")		
           	   			   .duration(200)		
           	   			   .style("opacity", .9);	
        			tooltip.html("Type: "+ d.data.type+ "<br/>"+ percent+"%")	
                		.style("left", (d3.event.pageX) + "px")		
                		.style("top", (d3.event.pageY - 28) + "px");	
					})
    			  .on("mouseout", function () {
    			// Hide the tooltip
    				tooltip.transition("PieTt").duration(200).style("opacity", 0);
				  });
			//display pie chart with animation
			arcs.append("path")
	   		.attr("fill", function(d,i){
	   				return pieColor(i);
	   		})
  	   		.transition("addPie")
      		.duration(800)
       		.attrTween("d", tweenPie)

		});


	edge
	.attr("d", function(d) {
		var dx = d.target.x - d.source.x,
			dy = d.target.y - d.source.y,
			dr = Math.sqrt(dx * dx + dy * dy);
		return "M" +
			d.source.x + "," +
			d.source.y + "A" +
			dr + "," + dr + " 0 0,1 " +
			d.target.x + "," +
			d.target.y;
		});
	d3.selectAll('g.nodes').moveToFront();
	d3.selectAll('circle.centroid').moveToFront();
	//})
	
	//////////////////////////////////// Draw legend ///////////////////////////////
	//Legend container
	minTick = roundTo(d3.min(links, function(d) { return d.value; }), 1, true)
	maxTick = roundTo(d3.max(links, function(d) { return d.value; }), 1, false)

	ticks = [minTick, roundTo((maxTick + minTick)/2, 2, true), maxTick]	
	if (!isNaN(minTick)){
		flowLegend = legendSvg.append("g")
							  .attr("class", "flowLegend")
	
		flowLegend.selectAll(".rect")
			    	.data(ticks)
			    	.enter()
			  	.append("rect")
			  		.attr("class", "flowSym")
			   		.attr("width", legendWidth * 0.3)
			     	.attr("height", function(d){return v(d)})
			     	.attr("x", function(d, i){return 0.35*i*legendWidth})
			     	.attr("y", 2*radius + v(maxTick));
			   
	 	flowLegend.selectAll(".text")
	 		     	.data(ticks)
	 		     	.enter()
	 		   	.append("text")
	 		     	.attr("class", "flowLab")
	 		     	.attr("x", function(d, i){return (0.15+i*0.35)*legendWidth})
	 		     	.attr("y", 2*radius + 3.5*v(maxTick))
	 		     	.attr("text-anchor", "middle")
	 		     	.text(function(d){return d;});

	}    
	});
}

onChange("31allall.csv")




