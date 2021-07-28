
import * as utils from "./utils.js";

// let colour_scheme = {
//     "zero": "#7077FF", "one": "#B4CA95",
//     "two": "#FFFA5C", "three": "#E38339",
//     "four+": "#D95356"
// };

export function draw_lineplot(svg, step, age, from, to, colours, tooltip, width) {
    let data;
    d3.csv("./data/numchildren_2d.csv").then(function (raw_data) {
        // console.log(raw_data);
        raw_data.forEach(function (d) {
            d.mothersdob = (+d.mothersdob);
            d.age = +d.age;
            d.percentage = +d.percentage;
            d.filtered_percentage = +d.filtered_percentage;
            d.year = (+d.year);
        })
        console.log(raw_data);
        data = raw_data.filter(function (d) {
            // return d.age >= from && d["year"] <= to;
            return (d.age == age && (d.year >= from && d.year <= to));
        });
        data = data.filter((d) => (d.year % step.value() == 0));
        let years = data.map(d => d.year);
        let subgroups = data.map(d => d.variable);
        let y = d3.scaleLinear()
            /*
                I decided against cutting the y axis
            */
            // .domain([d3.min(y_domain), d3.max(y_domain)])
            .domain([0, 1])
            .range([200, 0])
            .nice();

        svg.append("g")
            // .call(d3.axisLeft(y).tickFormat(d => d + "%"));
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(".0%"))
                .tickSize(5)
                .ticks(10));

        /*
        
            Create grid
        
        */

        svg.append("g")
            .attr("class", "y-grid-lines")
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .ticks(10)
                .tickFormat(""))
            .style("stroke-dasharray", "1 2")
            .style("color", "#c9c9c9");


        let x = d3.scaleLinear()
            .domain([from, to])
            .nice()
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + 200 + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.format("d")));


        svg.append("g")
            .attr("class", "x-grid-lines")
            .attr("transform", "translate(0," + 200 + ")")
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickSize(-200)
                .tickFormat(""))
            .style("stroke-dasharray", "1 2")
            .style("color", "#c9c9c9");

        d3.selectAll("#numchildren-chart")
            .style("opacity", 0)
            .transition()
            .duration(5000)
            .style("opacity", 1);
        // Three function that change the tooltip when user hover / move / leave a cell
        // Add the points

        svg
            .append("g")
            .selectAll("dot")
            .data(data, function (d) {
                // console.log(d.year + ':' + d.value);
                return d.year + ':' + d.percentage;
            })
            .join("circle")
            .attr("class", "number_of_children")
            .attr("id", function (d) {
                return d.variable;
            })
            .attr("cx", d => x(d.year))
            .attr("r", 6)
            .attr("stroke", "#c9c9c9")
            .attr("stroke-width", 1)
            .attr("fill", function (d) {
                return colours(d.variable)
            })
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .99);

                tooltip.html(d.variable + "<br>" + d.year + ": " + (d.percentage * 100).toFixed(0) + "%")
                    .style('left', (event.pageX) + 'px')
                    .style('top', ((event.pageY) - 28) + 'px');
                d3.selectAll(this)
                    .style("stroke", "black")
                    .style("stroke-width", "1px");
            }
            )
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .style("stroke", "transparent")
                    .style("stroke-width", "0px");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            /* 
            
                Animate the dots appearing 
     
            */
            .attr("cy", d => y(0))
            .transition()
            .duration(4000)
            .attr("cy", d => y(d.percentage));

    })
}

// if (type == "plot") {
//     draw_lineplot(svg, data, colours, tooltip, width);
// }
// else {
//     draw_barchart(svg, data, colours, tooltip, width, show_childless);


export function draw_barchart(svg, step, age, from, to, colours, tooltip, width, show_childless) {

    let bar_chart_datasets = [
        "./data/filtered_numchildren_percentages_normalised.csv",
        "./data/numchildren_percentages_normalised.csv"
    ];
    console.log("Show Childless: " + show_childless);
    d3.csv(bar_chart_datasets[show_childless]).then(function (raw_data) {
        raw_data.forEach(function (d) {
            d.year = (+d.year);
            d.age = +d.age;
            d["one"] = +d["one"];
            d["two"] = +d["two"];
            d["three"] = +d["three"];
            d["four"] = +d["four"];
            if (show_childless == 1) {
                d["zero"] = +d["zero"];
            }
            else {
                d["zero"] = 0;
            }
        })
        raw_data;
        let data = raw_data.filter(function (d) {
            // return d.age >= from && d["year"] <= to;
            return (d.age == age && (d.year >= from && d.year <= to));
        });
        data = data.filter((d) => (d.year % step.value() == 0));
        let years = data.map(d => d.year);

        let subgroups = Object.keys(data[0]).slice(2);
        console.log(subgroups);
        let groups = data.map(d => d.year);
        console.log(groups);
        /*
        
            Add bars
        
        */
        let x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", `translate(0, ${200})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([200, 0]);
        svg.append("g")
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(".0%")));

        let stackedData = d3.stack()
            .keys(subgroups)
            (data)
        console.log(stackedData);

        /*
          Highlight a specific subgroup when hovered
        */

        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => colours(d.key))
            .attr("class", d => "myRect " + d.key) // Add a class to each subgroup: their name
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.year))
            .attr("y", d => y(d[1]))

            .attr("width", x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", function (event, d) { // What happens when user hover a bar

                // what subgroup are we hovering?
                const subGroupName = d3.select(this.parentNode).datum().key

                // Reduce opacity of all rect to 0.2
                d3.selectAll(".myRect").style("opacity", 0.2)

                // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
                d3.selectAll("." + subGroupName).style("opacity", 1)
            })
            .on("mouseleave", function (event, d) { // When user do not hover anymore

                // Back to normal opacity: 1
                d3.selectAll(".myRect")
                    .style("opacity", 1)
            })

            .transition()
            .duration(3000)
            .attr("height", d => y(d[0]) - y(d[1]));
        console.log(stackedData);
    })
}


export function read_data(years_range, step, show_childless) {

    let age = +document.getElementById('select-age').value;
    let from = +years_range.value()[0];
    let to = +years_range.value()[1];
    let type = document.getElementById("type").value;
    let width = document.getElementById("numchildren-chart").offsetWidth - utils.margin.left - utils.margin.right;
    console.log("Year: " + years_range.value() + ", age: " + typeof (age));

    // console.log(data.columns);
    let svg = d3.select("#numchildren-chart")
        .append("svg")
        .attr("width", width + utils.margin.left + utils.margin.right)
        .attr("height", (to - from) * 20.1 + utils.margin.top + utils.margin.bottom)
        .attr("id", "#numchildren-lineplot")
        .append("g")
        .attr("transform",
            "translate(" + utils.margin.left + "," + 100 + ")");

    // create a tooltip
    let tooltip = d3.select("#numchildren-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip");


    /*
 
        Define colours for dots
 
        console.log(Object.keys(utils.colour_scheme));
        console.log(Object.values(utils.colour_scheme));
 
    */

    let colours = d3.scaleOrdinal()
        .domain(Object.keys(utils.colour_scheme))
        .range(Object.values(utils.colour_scheme));


    /*
 
        Add legend for colours
 
    */

    let legendOrdinal = d3.legendColor()

        .shape("path")
        .shapePadding(2)
        .shapeWidth(30)
        // .style("font-size", "10px")
        .orient('horizontal')
        //use cellFilter to hide the "e" cell
        // .cellFilter(function (d) { return d.label !== "e" })
        .scale(d3.scaleOrdinal()
            .domain(["zero", "one", "two", "three", "four+"])
            .range(Object.values(utils.colour_scheme)));


    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (0.68 * width) + ",-40)")
        .attr("font-size", "10px");

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Fertility Distribution");

    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Share of women having N children");


    if (type == "plot") {
        draw_lineplot(svg, step, age, from, to, colours, tooltip, width);
    }
    else {
        draw_barchart(svg, step, age, from, to, colours, tooltip, width, show_childless);
    }
}


export function show_children_distribution(years_range, step) {

    let width = document.getElementById("numchildren").offsetWidth - utils.margin.left - utils.margin.right;
    console.log("WIDTH N " + width);
    let show_childless = 1;
    let file_path = "./data/numchildren_2d.csv";
    read_data(years_range, step, show_childless);

    d3.select("#hide_childless").
        on("click", function (d) {
            show_childless = 0;
            if (document.getElementById("type").value == "plot") {
                d3.selectAll("#zero")
                    .transition()
                    .duration(1000)
                    .attr("r", 0);
            }
            else {
                d3.selectAll("#numchildren-chart > *")
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();
                read_data(years_range, step, show_childless);
            }
        });
    d3.select("#show_childless").
        on("click", function (d) {
            show_childless = 1;
            if (document.getElementById("type").value == "plot") {
                d3.selectAll("#zero")
                    .transition()
                    .duration(1000)
                    .attr("r", 6);
            }
            else {
                d3.selectAll("#numchildren-chart > *")
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();
                read_data(years_range, step, show_childless);
            }
            // read_data(file_path, years_range, step, 1);

        });
    d3.select("#select-age")
        .on("change", function () {
            d3.selectAll("#numchildren-chart > *")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();
            read_data(years_range, step, show_childless);
        });
    d3.select("#type")
        .on("change", function () {
            d3.selectAll("#numchildren-chart > *")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();
            read_data(years_range, step, show_childless);
        });

};

export * from "./numchildren.js";