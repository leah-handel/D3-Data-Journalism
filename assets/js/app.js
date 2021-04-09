
function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
  svgArea.remove();
  }

  // Define SVG area dimensions
  var svgWidth = window.innerWidth*.85;
  var svgHeight = window.innerHeight*.8;

  // Define the chart's margins as an object
  var chartMargin = {
   top: 30,
   right: 50,
    bottom: 125,
    left: 100
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

  // creating axis labels

  var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);

  xLabels.append("text")
    .attr("dy", "2.5em")
    .classed("active", true)
    .style('text-anchor', 'middle')  //https://stackoverflow.com/questions/16620267/how-to-center-text-in-a-rect-element-in-d3
    .text("% In Poverty")
    .attr("value", "poverty");

  xLabels.append("text")
    .attr("dy", "4em")
    .classed("inactive", true)
    .style('text-anchor', 'middle') 
    .text("Median Age")
    .attr("value", "age");

  xLabels.append("text")
    .attr("dy", "5.5em")
    .classed("inactive", true)
    .style('text-anchor', 'middle') 
    .text("Median Household Income")
    .attr("value", "income");

  var yLabels = chartGroup.append("g")
    .attr("transform",`rotate(-90) translate(-${chartHeight/2}, 0)`); 
    
    // multiple transforms: https://groups.google.com/g/d3-js/c/8iS5OdLjUuM?pli=1
    
  yLabels.append("text")
    .attr("dy", "-2em")
    .classed("active", true)
    .style('text-anchor', 'middle')
    .text("% Lacking Healthcare")
    .attr("value", "healthcare");

  yLabels.append("text")
    .attr("dy", "-3.5em")
    .classed("inactive", true)
    .style('text-anchor', 'middle')
    .text("% Smoke")
    .attr("value", "smoke");

  yLabels.append("text")
    .attr("dy", "-5em")
    .classed("inactive", true)
    .style('text-anchor', 'middle')
    .text("% Obese")
    .attr("value", "obese");

  //variables to use to make scales, axes, circles

  var xSelection = "poverty";
  var ySelection = "healthcare";



  d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
    
    // y scale using y axis variable

    var yData = data.map(d=>parseFloat(d[ySelection]));
    console.log(yData);

    var yScale = d3.scaleLinear()
        .domain([d3.min(yData)-2, d3.max(yData)+2])
        .range([chartHeight, 0]);

    //x scale using x axis variable

    var xData = data.map(d=>parseFloat(d[xSelection]));
    console.log(xData);

    var xScale = d3.scaleLinear()
        .domain([d3.min(xData)-1, d3.max(xData)+2])
        .range([0, chartWidth]);

    //drawing axes

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);


    //chartGroup.selectAll(".circle")
        //.data(data)
        //.enter()
        //.append("circle")
          //.attr("cx", d=>xScale(parseFloat(d.poverty)))
          //.attr("cy", d=>yScale(parseFloat(d.healthcare)))
          //.attr("r", 8)
          //.style("fill", "#69b3a2");

    //chartGroup.selectAll("g")
    //  .data(data)
    //  .enter()
    //  .append("text")
    //  .attr("x", d=>xScale(parseFloat(d.poverty)))
    //  .attr("y", d=>yScale(parseFloat(d.healthcare)))
    //  .attr("dy", ".35em")
    //  .text(d=>d.abbr)

    //state abbreviations using the d3 annotations library, code from here: https://bl.ocks.org/susielu/625aa4814098671290a8c6bb88a6301e

    var badgeAnnotations = data.map(d => {return {
      subject: {
        text: d.abbr,
        radius: 10
      },
      color: "#3c096c",
      type: d3.annotationBadge,
      x: xScale(parseFloat(d[xSelection])),
      y: yScale(parseFloat(d[ySelection]))
    }
    });
        
    var makeAnnotations = d3
      .annotation()
      .type(d3.annotationLabel)
      .annotations([...badgeAnnotations]);
        
    chartGroup.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);



  });

}

makeResponsive();

d3.select(window).on("resize", makeResponsive);