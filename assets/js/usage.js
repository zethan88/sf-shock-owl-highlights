
const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

d3.csv("../data/sf_shock_data_time_played(percent).csv").then(function (data) {
    const groupdata = d3.group(data, d => d.player)

    const allKeys = new Set(data.map(function (d) {return d.player;}))

    const svg = d3.select("#usage")
        .selectAll("svg")
        .data(groupdata)
        .enter()
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(function (d) {return d.hero}))
        .range([0, width])
        .padding([0.5]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(3));

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {return +d.percent;})])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5));

    const color = d3.scaleSequential()
        .interpolator(d3.interpolateBlues);

    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {return xScale(d.hero);})
        .attr("y", function (d) {return yScale(d.percent);})
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {return height - yScale(d.percent);})
        .attr("fill", function (d) {return color(d.percent);});

    svg.append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) {return(d[0])})


    // var heroes = Array.from(new Set(data.map(function (d) {
    //     return d.hero;
    // })));
    // xScale.domain(heroes);
    //
    // var metrics = Array.from(
    //     d3.group(data, d => d.player), ([key, value]) => ({key, value})
    // );
    //
    // var svg = d3.select("#usage").selectAll("svg")
    //     .data(metrics)
    //     .enter()
    //     .append("svg")
    //     .attr("class", function (d) {return d.value[0].percent;});
    //
    // metrics.forEach(function (d) {
    //     yScale.domain([0, d3.max(d.value, function (c) {return c.percent;})]);
    //
    //     d3.select("svg." + d.value[0].hero)
    //         .selectAll('.bar')
    //         .data(d.value)
    //         .enter()
    //         .append('rect')
    //         .attr('class', 'bar')
    //         .attr('x', function(c) { return xScale(c.hero); })
    //         .attr('width', xScale.bandwidth())
    //         .attr('y', function(c) { return yScale(c.percent); })
    //         .attr('height', function(c) { return height - yScale(c.percent); })
    //         .attr('fill', 'teal');
    //
    //     d3.select("svg." + d.value[0].hero)
    //         .append('g')
    //         .attr('transform', 'translate(0,' + height + ')')
    //         .call(xAxis)
    // })
})

