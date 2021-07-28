import { create_fertility_heatmap } from "./fertility_cohort.js";
import { show_children_distribution } from "./numchildren.js";
import * as utils from "./utils.js";

let step = utils.add_step_slider('p#step-value', 'div#step-slider');
let years_range = utils.add_range_slider('p#slider-value-range', 'div#slider-range').step(1);

create_fertility_heatmap(years_range, step);
show_children_distribution(years_range, step);
years_range
    .on("end", function () {
        d3.selectAll("#fertility-chart > *")
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i % 5 * 100

            })
            .style("opacity", 0)
            .remove();
        create_fertility_heatmap(years_range, step);

        d3.selectAll("#numchildren-chart > *")
            .transition().duration(1000).style("opacity", 0).remove();
        show_children_distribution(years_range, step);
    });

step
    .on("end", function () {
        d3.selectAll("#fertility-chart > *")
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i % 5 * 100

            })
            .style("opacity", 0)
            .remove();
        create_fertility_heatmap(years_range, step);

        d3.selectAll("#numchildren-chart > *")
            .transition().duration(1000).style("opacity", 0).remove();
        show_children_distribution(years_range, step);
    })

d3.select("#select-age")
    .on("change", function () {
        d3.selectAll("#fertility-chart > *")
            .transition()
            .duration(2000)
            .style("opacity", 0)
            .remove();
        create_fertility_heatmap(years_range, step);

        d3.selectAll("#numchildren-chart > *")
            .transition()
            .duration(2000)
            .style("opacity", 0)
            .remove();
        show_children_distribution(years_range, step, show_childless);
    });