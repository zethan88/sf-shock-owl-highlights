
var width = 400;
var height = 200;
var margin = {top: 45, right: 100, bottom: 20, left: 20};

var xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(xScale);

d3.csv("../data/sf_shock_data_time_played(percent).csv").then (function (data) {
    var uniquePlayers = Array.from(new Set(data.map(function (d) {
        return d.player;
    })));
    xScale.domain(uniquePlayers);

    var metrics = Array.from(
        d3.group(data, d => d.hero), ([key, value]) => ({key, value})
    );

    var svg = d3.select("#usage").selectAll("svg")
        .data(metrics)
        .enter()
        .append("svg")
        .attr("class", function (d) {return d.value[0].percent;});

    metrics.forEach(function (d, i) {
        yScale.domain([0, d3.max(d.value, function (c) {return c.percent;})]);

        d3.select("svg." + d.value[0].hero)
            .selectAll('.bar')
            .data(d.value)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(c) { return xScale(c.player); })
            .attr('width', xScale.bandwidth())
            .attr('y', function(c) { return yScale(c.percent); })
            .attr('height', function(c) { return height - yScale(c.percent); })
            .attr('fill', 'teal');

        d3.select("svg." + d.value[0].hero)
            .append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
    })
})

