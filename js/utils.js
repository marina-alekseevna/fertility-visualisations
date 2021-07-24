export let starting_range = [1950, 2000];


export function add_range_slider(range_p, slider_div, starting_range = [1950, 2000], width = 400, displayed_range = range, colour = '#51527D') {

    var sliderRange = d3
        .sliderBottom()
        .min(d3.min(displayed_range))
        .max(d3.max(displayed_range))
        .width(width - 50)
        .tickFormat(d3.format(".4"))
        .ticks(11)
        .default(starting_range)
        .fill(colour)
        .on('onchange', val => {
            d3.select(range_p).text(val.map(d3.format('.4')).join('-'));
        });

    var gRange = d3
        .select(slider_div)
        .append('svg')
        .attr('width', width)
        .attr('height', 68)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gRange.call(sliderRange);

    d3.select(range_p).text(
        sliderRange
            .value()
            .map(d3.format('.4'))
            .join('-')
    );

    return sliderRange;
};


export function add_step_slider(p, div, width = 400, range = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2004]) {
    var sliderStep = d3
        .sliderBottom()
        .min(d3.min(range))
        .max(d3.max(range))
        .width(width - 50)
        .tickFormat(d3.format('.2'))
        .ticks(20)
        .step(1)
        .default(35)
        .on('onchange', val => {
            d3.select(p).text(d3.format('.2')(val));
        });

    var gStep = d3
        .select(div)
        .append('svg')
        .attr('width', width)
        .attr('height', 68)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gStep.call(sliderStep);

    d3.select(p).text(d3.format('.2')(sliderStep.value()));

    return sliderStep;
};

export var margin = { top: 80, right: 40, bottom: 30, left: 40 };

export var colour_scheme = {
    "zero": "#7077FF", "one": "#B4CA95",
    "two": "#FFFA5C", "three": "#E38339",
    "four+": "#D95356"
}

export var range = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2004];