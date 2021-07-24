import * as utils from "./utils.js";

let colour_scheme = {
    "zero": "#7077FF", "one": "#B4CA95",
    "two": "#FFFA5C", "three": "#E38339",
    "four+": "#D95356"
};


function draw_barchart(years_slider, width, height, unmerge, graph) {

    let svg = d3.select("#numchildren-chart")
        .append("svg")
        .attr("width", width + utils.margin.left + utils.margin.right)
        .attr("height", height + utils.margin.top + utils.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + utils.margin.left + "," + utils.margin.top + ")");

    let age = document.getElementById('select-age').value;



    console.log("Year: " + years_slider.value() + ", age: " + age);



}
function children_barchart() {
    let years_slider = utils.add_range_slider('p#numchildren-value-range', 'div#numchildren-slider-range');
    years_slider;

    let width = document.getElementById("numchildren-chart").offsetWidth - utils.margin.left - utils.margin.right;
    let height = 200;

    let unmerge = 1;
    let graph = 1;
    draw_barchart(years_slider, width, height);

    d3.select("#unmerge").
        on("click", function () {
            unmerge = unmerge * (-1);
            d3.selectAll("#numchildren-chart > *").transition().duration(200).remove();
            draw_barchart(years_slider, width, height, unmerge, graph);
        });
    d3.select("#graph").
        on("click", function () {
            graph = graph * (-1);
            d3.selectAll("#numchildren-chart > *").transition().duration(200).remove();
            draw_barchart(years_slider, width, height, unmerge, graph);
        });
    d3.select("#graph_childless,#show_childless,#select-age")
        .on("change", function () {
            d3.selectAll("#numchildren-chart > *").transition().duration(200).remove();
            draw_barchart(years_slider, width, height, unmerge, graph);
        });

    years_slider
        .on("end", function () {
            d3.selectAll("#numchildren-chart > *").transition().duration(200).remove();
            draw_barchart(years_slider, width, height, unmerge, graph);
        });

};

children_barchart();