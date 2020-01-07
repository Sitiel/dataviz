

function drawSizeEvolutionChart(apps, apps_to_draw) {

	let sizeEvolutionChart = d3.select("#size-evolution-chart-placeholder").selectAll('*').remove();
	let svg = d3.select("#size-evolution-chart-placeholder")
		.append("svg")
		.attr("width", "100%")
		.attr("height", "800px")
		.append("g");
	
	svg.selectAll("*").remove();
	
	let jsizeEvolutionChart = $("#size-evolution-chart-placeholder");
	let width = jsizeEvolutionChart.width();
	let height = jsizeEvolutionChart.height();
	let defaultTransition = "easeQuad";
	let defaultTransitionDuration = 200;
	
	// Create scales
	let xScale = d3.scaleLinear().range([50, width - 50]).domain([
		d3.min(Object.values(apps), app => d3.min(app["versions"], a => moment(a[0], "DD-MM-YYYY").unix())),
		d3.max(Object.values(apps), app => d3.max(app["versions"], a => moment(a[0], "DD-MM-YYYY").unix()))]);
	let yScale = d3.scaleLinear().range([10, height - 100]).domain([d3.max(Object.values(apps), app => d3.max(app["versions"], a => a[1])), 0]);
	
	let defs = svg.append("defs");
	
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	svg.append("g")
		.call(d3.axisLeft(yScale))
		.attr("transform", "translate(50, 0)");
	
	svg.append("g")
		.call(d3.axisBottom(xScale)
			.tickFormat(d => moment(new Date(d)).format("DD/MM/YYYY")))
		.attr("transform", `translate(0, ${height - 100})`)
		.selectAll("text")
		.attr("transform", "translate(20, 20) rotate(45)");

	for (let appName in apps) {
		if(apps_to_draw.indexOf(appName) == -1)
			continue;
		let versions = apps[appName]["versions"];
		// Sort versions
		versions.sort(function (a, b) {
			return moment(a[0], "DD-MM-YYYY").unix() - moment(b[0], "DD-MM-YYYY").unix();
		});

		var path = svg.append("path")
			.datum(versions)
			.attr("d", d3.line()
					.x(function (d) {
						return xScale(moment(d[0], "DD-MM-YYYY").unix())
					})
					.y(function (d) {
						return yScale(d[1])
					}))
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 3);

			var totalLength = path.node().getTotalLength();

			path.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
				.duration(1000)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0)
	}

}
