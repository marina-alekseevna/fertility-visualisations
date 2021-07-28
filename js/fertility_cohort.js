
import * as utils from "./utils.js";

export var data_sets = [
    {
        "Cumulative Fertility": "./data/cohort_2d.csv",
        "Total Fertility Rate": "./data/cohort_total_2d.csv"
    },
    {
        "Cumulative Fertility": [0, 90],
        "Total Fertility Rate": [0, 2]
    },
    {
        "Cumulative Fertility": "Share of women who had at least one live birth",
        "Total Fertility Rate": "Average number of live-born children"
    }
];


export function draw_heatmap(years_range, step, width, height) {

    var data_set = document.getElementById('select-fertility-data').value;
    console.log(years_range.value());
    var to = Math.floor(years_range.value()[1]);
    var from = Math.floor(years_range.value()[0]);

    console.log("data_set: " + data_set + ", to: " + to + ", from: " + from);

    var svg = d3.select("#fertility-chart")
        .append("svg")
        .attr("width", width + utils.margin.left + utils.margin.right)
        .attr("height", (to - from) * 18.05 + utils.margin.top + utils.margin.bottom)
        .attr("id", "#fertility-chart")
        .append("g")
        .attr("transform",
            "translate(" + utils.margin.left + "," + utils.margin.top + ")");

    d3.csv(data_sets[0][data_set]).then(function (raw_data) {

        raw_data.forEach(function (d) {
            d.year = +d.year;
            d.variable = +d.variable;
            d.value = +d.value;
            d.count = +d.count;
        })


        let data = raw_data.filter(function (d) {
            return d["year"] >= from && d["year"] <= to;


        });
        data = data.filter((d) => (d.year % step.value() == 0));
        console.log("STEP: " + step.value());
        to = d3.max(data, d => d.year);
        from = d3.min(data, d => d.year);

        console.log("from: " + from + " to: " + to);

        var ages = d3.map(data, function (d) { return d.variable; });
        var years = d3.map(data, function (d) { return d.year; });
        var counts = d3.map(data, function (d) { return d.count; });
        var num_years = [...new Set(years)].length + 1;

        var x = d3.scaleBand()
            .range([0, counts[counts.length - 1] * 16])
            .domain(ages);
        // .padding(0.05);

        console.log("w " + width + " h " + height);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + (num_years * 17.05) + ")")
            .call(
                d3.axisBottom(x)
                    .tickSizeInner(-5)
                    .tickSizeOuter(0)
                    .tickPadding(0))
            .attr("class", "fertility-axis")
            .attr("opacity", 0)
            .select(".domain").remove()



        // Build Y scales and axis:
        console.log("LOG LENGTH:" + years.length);
        var y = d3.scaleBand()
            .range([0, num_years * 17.05])
            .domain(years);
        // .padding(0.05);

        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSizeInner(-5)
                .tickSizeOuter(0)
                .tickPadding(10))
            .attr("class", "fertility-axis")
            .attr("opacity", 0)
            .select(".domain").remove()

        // Build color scale
        var colour_scale = d3.scaleSequential()
            // .interpolator(d3.interpolateInferno)
            .domain(data_sets[1][data_set])
            // .range(["#e5ddeb", "#59bd8b"])
            .range(["#7077ff", "#fffa5c"])

        var div = d3.select('#fertility-chart').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);


        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(" + (0.55 * width) + ",-40)");

        var legendLinear = d3.legendColor()
            .shapeWidth(30)
            .orient('horizontal')
            .scale(colour_scale);

        svg.select(".legendLinear")
            .call(legendLinear)
            .attr("font-size", "10px")
            .style("opacity", 0);

        // add the squares
        let heatmap_squares = svg.selectAll()
            .data(data, function (d) { return d.year + ':' + d.variable; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.variable) })
            .attr("y", function (d) { return y(d.year) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", 16)
            .attr("height", 16)
            .style("fill", function (d) { return colour_scale(d.value) })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0)
            .on('mouseover', function (event, d) {
                div.transition()
                    .duration(200)
                    .style('opacity', .99);
                if (data_set == "Cumulative Fertility") {
                    div.html("year: " + d.year + " <br> age: " + d.variable + " <br> given birth: " + d.value.toFixed(0) + "%")
                        .style('left', (event.pageX) + 'px')
                        .style('top', ((event.pageY) - 28) + 'px');
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", "1px");
                }
                else {
                    div.html("year: " + d.year + " <br> age: " + d.variable + " <br> tfr: " + d.value)
                        .style('left', (event.pageX) + 'px')
                        .style('top', ((event.pageY) - 28) + 'px');
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", "1px");
                }
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .style("stroke", "transparent")
                    .style("stroke-width", "0px");
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            })

        heatmap_squares
            .transition()
            .duration(4000)
            .delay(function (d, i) {
                return i % 3 * 200
            })
            .style("opacity", 1)

        // Add title to graph
        svg.append("text")
            .attr("class", "title")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .attr("opacity", 0)
            .text(data_set);

        // Add subtitle to graph

        svg.append("text")
            .attr("class", "subtitle")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "14px")
            .style("fill", "grey")
            .style("max-width", 400)
            .attr("opacity", 0)
            .text(data_sets[2][data_set]);


        d3.selectAll(".fertility-axis,.legendLinear,.subtitle,.title")
            // d3.selectAll("#fertility-chart > *")
            .transition()
            .duration(4000)
            .style("opacity", 1);


        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - utils.margin.left)
        //     .attr("x", 0 - (utils.margin.top))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Year");

    })
};


export function create_fertility_heatmap(years_range, step) {
    /*
        define chat's starting  parameters according to default values given in utils
    */
    var width = document.getElementById("fertility-chart").offsetWidth - utils.margin.left - utils.margin.right;
    var height = (utils.starting_range[1] - utils.starting_range[0]) * 20.1 + utils.margin.top + utils.margin.bottom;

    console.log("w " + width + " h " + height);
    /*
        add the slider necessary for selection of time ranges
    */

    draw_heatmap(years_range, step, width, height, step);

    /*
        define how changes will be made
    */
    d3.select('#select-fertility-data')
        .on('change', function () {
            d3.selectAll("#fertility-chart > *")
                .transition()
                .duration(1000)
                .delay(function (d, i) {
                    return i % 5 * 100

                })
                .style("opacity", 0)
                .remove();
            draw_heatmap(years_range, step, width, height);
        });
    d3.select('#select-age')
        .on('change', function () {
            d3.selectAll("#fertility-chart > *")
                .transition()
                .duration(1000)
                .delay(function (d, i) {
                    return i % 5 * 100

                })
                .style("opacity", 0)
                .remove();
            draw_heatmap(years_range, step, width, height);
        });
    // years_range
    //     .on("end", function () {
    //         d3.selectAll("#fertility-chart > *")
    //             .transition()
    //             .duration(1000)
    //             .delay(function (d, i) {
    //                 return i % 5 * 100

    //             })
    //             .style("opacity", 0)
    //             .remove();
    //         draw_heatmap(years_range, width, height);
    //     });

};

// export { create_fertility_heatmap };