
// set the dimensions and margins of the graph

// append the svg object to the body of the page
var margin = { top: 80, right: 40, bottom: 30, left: 40 };
var height = 300;
var width = document.getElementById("numchildren").offsetWidth - 80;
var svg = d3.select("#numchildren")
    .append("svg")
    .attr("width", 2 * width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("./data/numchildren.csv", function (data) {

    // List of subgroups = header of the csv files = soil condition here
    console.log(data);
    var subgroups = data.columns.slice(1)
    console.log(subgroups);
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) { return (d.group) }).keys()

    console.log(groups);
    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c', '#377eb8', '#4daf4a'])

    // Normalize the data -> sum of each group must be 100!
    console.log(data)
    dataNormalized = []
    data.forEach(function (d) {
        // Compute the total
        tot = 0
        for (i in subgroups) { name = subgroups[i]; tot += +d[name] }
        // Now normalize
        for (i in subgroups) { name = subgroups[i]; d[name] = d[name] / tot * 100 }
    })

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.group); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
})

