// Define SVG area dimensions
var svgWidth = 700;
var svgHeight = 450;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);

    //configuring y axis

    var healthCare = data.map(d=>parseFloat(d.healthcare));
    var healthCareMax = Math.max(...healthCare);
    console.log(healthCareMax);

    var yScale = d3.scaleLinear()
        .domain([0, healthCareMax+2])
        .range([chartHeight, 0]);

    //configuring x axis

    var poverty = data.map(d=>parseFloat(d.poverty));
    var povertyMax = Math.max(...poverty);
    console.log(povertyMax);

    var xScale = d3.scaleLinear()
        .domain([0, povertyMax+2])
        .range([0, chartWidth]);

    //drawing axes

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", d=>xScale(parseFloat(d.poverty)))
          .attr("cy", d=>yScale(parseFloat(d.healthcare)))
          .attr("r", 5)
          .style("fill", "#69b3a2")

});