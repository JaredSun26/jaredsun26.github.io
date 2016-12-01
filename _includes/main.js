
// get the data
d3.csv("/data/force_directed.csv", function(error, links) {

	var nodes = {
				'Brevard':     {name: 'Brevard',      x: -80.7439,   y: 28.263207, fixed: true},
				'Indian River':{name: 'Indian River', x: -80.615701, y: 27.692808, fixed: true},
				'Lake':        {name: 'Lake',         x: -81.711296, y: 28.761468, fixed: true},
				'Orange':      {name: 'Orange',       x: -81.323475, y: 28.514421, fixed: true},
				'Osceola':     {name: 'Osceola',      x: -81.149495, y: 28.062663, fixed: true},
				'Polk':        {name: 'Polk',         x: -81.697676, y: 27.948864, fixed: true},
				'Seminole':    {name: 'Seminole',     x: -81.236303, y: 28.716975, fixed: true},
				'Sumter':      {name: 'Sumter',       x: -82.081,    y: 28.70482,  fixed: true},
				'Volusia':     {name: 'Volusia',      x: -81.192353, y: 29.060733, fixed: true}
	};
	
	var width = 1200,
	height = 800;

	//Set the range of x, map to [0.1, 0.9] width
	var vx = d3.scale.linear().range([0.1*width, 0.9*width])
	vx.domain([d3.min(d3.entries(nodes), function(d){return d.value.x}), d3.max(d3.entries(nodes), function(d){return d.value.x})])
	
	//Set the range of y, map to [0.9, 0.1] height
	var vy = d3.scale.linear().range([0.9*height, 0.1*height])
	vy.domain([d3.min(d3.entries(nodes), function(d){return d.value.y}), d3.max(d3.entries(nodes), function(d){return d.value.y})])
	
	for (var node in nodes){
		 if (nodes.hasOwnProperty(node)){
		 	nodes[node].x = vx(nodes[node].x);
		 	nodes[node].y = vy(nodes[node].y);
		 	nodes[node].fixed = true;
		 }		 
	}

	// Load the links and set the source and target
	links.forEach(function(link) {
		link.source = nodes[link.source];
		link.target = nodes[link.target];
		link.value = +link.value;
	});

	console.log(nodes);
	
	// Set the range
	var  v = d3.scale.linear().range([5, 85]);
 
	// Scale the range of the data
	v.domain([0, d3.max(links, function(d) { return d.value; })]);



	links.forEach(function(link) {
		if (v(link.value) <= 25) {
			link.type = "1quarters";
		} else if (v(link.value) <= 45 && v(link.value) > 25) {
			link.type = "half";
		} else if (v(link.value) <= 65 && v(link.value) > 45) {
			link.type = "3quarters";
		} else if (v(link.value) <= 85 && v(link.value) > 65) {
			link.type = "one";
		}
	});



	var width = 1200,
		height = 800;

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([width, height])
		//.linkDistance(400)
		.charge(-300)
		.start();

	var svg = d3.select("#chart-area").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	//Function to create the unique id for each link gradient
	function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

	//Create the gradients definitions for each kubj
	var grads = svg.append("defs").selectAll("linearGradient")
	.data(force.links())
    .enter().append("linearGradient")
    //Create the unique ID for this specific source-target pairing
	.attr("id", getGradID)
	.attr("gradientUnits", "userSpaceOnUse")
	//Find the location where the source link starts
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	//Find the location where the target link starts 
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; })
	
	var sourceColor = '#1F2D86'
	var destinationColor = '#FFFFDD'

	grads.append("stop").attr("offset", "0%").attr("stop-color", sourceColor);
    grads.append("stop").attr("offset", "100%").attr("stop-color", destinationColor);
	
	
	// add the links
	var path = svg.append("svg:g").selectAll(".path")
		.data(force.links())
		.enter().append("svg:path")
		.attr("class", "link")
		.style('opacity', 0.7)
		.style("stroke-width", function(d){return v(d.value)/5;})
		.style("stroke", function(d){ return "url(#" + getGradID(d) + ")"; });
	
	
	// define the nodes
	var node = svg.selectAll("node")
		.data(force.nodes())
		.enter().append("g")
		.attr("class", "node")
	

	// add the text to nodes
	node.append("text")
		.attr("x", 12)
		.attr("dy", ".35em")
		.style("font-size","20px")
		.text(function(d) { return d.name; });

	// link hover on
	path.on('mouseover', function(d){
		node.select('circle')
		.style('fill', function(e){
		if (e === d.source || e === d.target)
			return 'black'
		else
			return 'blue'
		})
		d3.select(this).style('opacity', 1)

		div.transition()		
           .duration(200)		
           .style("opacity", .9);		
        div.html('From '+d.source.name+' to '+ d.target.name+'<br/>'+'Flow: '+d.value.toFixed(1))	
           .style("left", (d3.event.pageX) + "px")		
           .style("top", (d3.event.pageY - 28) + "px");	
	})

	// link hover off
	path.on('mouseout', function(d){
		node.select('circle').style('fill', 'blue')
		d3.select(this).style('opacity', 0.7)
		div.transition()		
           .duration(500)		
           .style("opacity", 0);	
	})
	
	// node hover on:
	node.on('mouseover', function(d) {
  		path
  		.style('opacity', function(l) {
    	if (d !== l.source && d !== l.target)
     		 return 0.1;
    	});
	})

	// node hover off:
	node.on('mouseout', function() {
  		d3.selectAll("path").style('opacity', 0.7);
	});
		
	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);



	// add the nodes
	node.append("circle")
		.attr('class', 'centroid')
		.attr("r", 8)

	// add the curvy lines
	force.on('tick', function() {
		path
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


		node
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"; });
		

	})

	
	////////////////////////////////////Pie Chart//////////////////////////////////////
	var pieRadius = 50

	var arc = d3.svg.arc()
    			.outerRadius(pieRadius)

	var pie = d3.layout.pie()
    			.sort(null)
    			.value(function(d){return d;});

	var piesvg = d3.select("#chart-area").append("svg")
    			.attr("width", 200)
    			.attr("height", 200)
  				.append("g")
    			//.attr("transform", "translate(" + width*0.1 + "," + height*0.5 + ")");


 	var g = piesvg.selectAll(".arc")
      			.data(pie([12,324,343,23432]))
    			.enter()
    			.append("g")
      			.attr("class", "arc")
      			.append("path")
     			.attr("d", arc)
     			.style("fill", "red");




	
	
	//////////////////////////////////// Draw legend ///////////////////////////////

	var linearGradient = svg.append("defs").append("linearGradient")
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


	//Legend container
	var legendsvg = svg.append("g")
					.attr("class", "legendWrapper")
					.attr("transform", "translate(" + (0.1 * width) + "," + (0.95 * height) + ")")
	
	var legendWidth = 300
	var legendHeight = 10
	var radius = 8

	legendsvg.append('rect')
			 .attr('width', legendWidth)
			 .attr('height', legendHeight)
			 .style("fill", "url(#linear-gradient)");

	legendsvg.append('circle')
			 .attr('cx', 0)
			 .attr('cy', 0.5*legendHeight)
			 .attr('r', radius)

	legendsvg.append('circle')
			 .attr('cx', legendWidth)
			 .attr('cy', 0.5*legendHeight)
			 .attr('r', radius)	

	
	legendsvg.append('text')
			.attr('class', 'legendTitle')
			.attr("text-anchor", "middle")
			.attr('x', 0)
			.attr('y', -radius)
			.text("Origin");
			
	legendsvg.append('text')
			.attr('class', 'legendTitle')
			.attr("text-anchor", "middle")
			.attr('x', legendWidth)
			.attr('y', -radius)
			.text("Destination");
	
});

