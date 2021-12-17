const margin = {top: 10, right: 100, bottom: 50, left: 100},
    width = 1250 - margin.left - margin.right,
    height = 1200 - margin.left - margin.right,
    pad = 0.2;

//x and y scales
const x = d3.scale.linear().range([0, width]);
const y0 = d3.scale.ordinal();

//set of heroes
const heroSet = ["Ana", "Bastion", "Baptiste", "Brigitte", "D.Va",
    "Doomfist", "Genji", "Hanzo", "Junkrat",
    "Lucio", "McCree", "Mei", "Mercy",
    "Moira", "Orisa", "Pharah", "Reaper",
    "Reinhardt", "Roadhog", "Sigma", "Soldier: 76",
    "Sombra", "Symmetra", "Torbjorn", "Tracer",
    "Widowmaker", "Winston", "Wrecking Ball", "Zarya",
    "Zenyatta"];

//color scale
const color = d3.scale.ordinal()
    .range(["#718ab3", "#7c8f7b", "#00FFFF", "#be736e", "#ed93c7",
        "#815049", "#97ef43", "#b9b48a", "#ecbd53",
        "#85c952", "#ae595c", "#6faced", "#ebe8bb",
        "#803c51", "#468c43", "#3e7dca", "#7d3e51",
        "#929da3", "#b68c52", "#3DB1A2", "#697794",
        "#7359ba", "#8ebccc", "#c0726e", "#d79342",
        "#9e6aa8", "#a2a6bf", "#C13000", "#e77eb6",
        "#ede582"])
    .domain(heroSet);

//y axis
const yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left")
    .tickSize(-width);

//x axis
const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10)
    .tickFormat(d3.format(".0%"));

//svg element
const svg = d3.select("#heroUsage")
    .append("svg")
    .attr("width", width + margin.right + margin.left + 100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// This moves the SVG over by m.left(110)
// and down by m.top (10)

//load data for use
d3.csv("../data/sf_shock_data_time_played(percent).csv", function(error, data) {

    data.forEach(function(d) {
        d.percent = +d.percent;
    });

    const barHeight = height / data.length;

    y0.domain(data.map(function(d) {
        return d.player;
    }));

    const y0Range = [0];
    const playerGroups = d3.nest()
        .key(function (d) {
            return d.player;
        })
        .rollup(function (d) {
            var barSpace = (barHeight * d.length);
            y0Range.push(y0Range[y0Range.length - 1] + barSpace);
            return d3.scale.ordinal()
                .domain(d.map(function (c) {
                    return c.hero
                }))
                .rangeRoundBands([0, barSpace], pad);
        })
        .map(data);

    y0.range(y0Range);

    x.domain([0, d3.max(data, function(d) {
        return d.percent;
    })]);

    //modify titles
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("class", "y axis")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .text(d => d + "————");

    //add bars
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", function(d) {
            for (let i = 0; i < heroSet.length; i++) {
                if (d.hero === heroSet[i]) {
                    return color(d.hero);
                }
            }
        })
        //.attr("x", 0)
        .attr("y", function(d) {
            return y0(d.player) + playerGroups[d.player](d.hero);
        })
        .attr("height", function(d) {
            return playerGroups[d.player].rangeBand();
        })
        .attr("width", function(d) {
            return x(d.percent);
        })
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("fill", "#75787B")
            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html(d.hero + "<br/>" + d3.format(".4%")(d.percent))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", function(d) {
                    for (let i = 0; i < heroSet.length; i++) {
                        if (d.hero === heroSet[i]) {
                            return color(d.hero);
                        }
                    }
                })
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //add labels
    var ls = svg.selectAll(".labels")
        .data(data)
        .enter().append("g");

    ls.append("text")
        .text(function(d) {
            return (d3.format(".4%")(d.percent));
        })
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .attr("x", function(d) {
            return x(d.percent) + 5;
        })
        .attr("y", function(d) {
            return y0(d.player) + playerGroups[d.player](d.hero) + playerGroups[d.player].rangeBand() / 2 + 4;
        })
        .attr("class", "label");

    ls.append("text")
        .text(function(d) {
            return (d.hero);
        })
        .attr("font-size", "11px")
        .attr("text-anchor", "end")
        .attr("x", -5)
        .attr("y", function(d) {
            return y0(d.player) + playerGroups[d.player](d.hero) + playerGroups[d.player].rangeBand() / 2;
        })
        .style("alignment-baseline", "middle")
        .attr("class", "label");

});