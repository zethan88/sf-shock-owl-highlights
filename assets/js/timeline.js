const margin = {top: 100, right: 30, bottom: 100, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//svg element
const svg = d3.select("#timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//time formatting
const parseTime = d3.timeParse("%b/%d/%y");

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//load data for use
d3.csv("../data/sf_shock_data_full_record.csv").then(function (data) {

    data.forEach(function (d) {
        d.Date = parseTime(d.date)
    });

    //x scale
    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(d3.map(data, function (d) {return d.date;}))
        .padding(0.09999)

    //call axis, ticks, and labels
    svg.append("g")
        .attr("transform", `translate(0, ${height/2})`)
        .call(d3.axisBottom(xScale)
            .tickValues([])
        )
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-90)")

    console.log(d3.map(data, function (d) {return d.date}));

    //y scale
    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(d3.extent(data, function (d) {return d.team1Score;}));

    svg.append("g")
        .attr("transform", `translate(0, ${-height/2})`)
        .call(d3.axisLeft(yScale)
            //.tickValues([])
            .tickValues(['0', '1', '2', '3', '4'])
            .tickFormat((d,i) => ['0', '1', '2', '3', '4'][i])
        );

    svg.append("g")
        .attr("transform", `translate(0, ${height/2})`)
        .call(d3.axisLeft(yScale)
            //.tickValues([])
            .tickValues(['4', '3', '2', '1', '0'])
            .tickFormat((d,i) => ['0', '1', '2', '3', '4'][i])
        );

    //enemy scores
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {return xScale(d.date);})
        .attr("y", function (d) {return -yScale(d.team2Score);})
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            if(d.team2Score === "0" && d.team1Score === "3") {
                return 0;
            }
            return height;})
        .attr("fill", "#75787B")
        .attr("transform", `translate(0, ${height/2})`)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", d3.rgb("#75787B").darker(1))
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.date +
                "<br/>" + d.team2 + " v. " + d.team1 +
                "<br/>" + d.team2Score + " - " + d.team1Score +
                "<br/>" + d.outcome)
                .style("left", (event.pageX - 50) + "px")
                .style("top", (event.pageY - 125) + "px")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", "#75787B")
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //sf shock scores
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {return xScale(d.date);})
        .attr("y", function (d) {return yScale(d.team1Score);})
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {return height - yScale(d.team1Score);})
        .attr("fill", "#FC4C02")
        .attr("transform", `translate(0, ${-height/2})`)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", d3.rgb("#FC4C02").darker(1))
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.date +
                "<br/>" + d.team1 + " v. " + d.team2 +
                "<br/>" + d.team1Score + " - " + d.team2Score +
                "<br/>" + d.outcome)
                .style("left", (event.pageX - 50) + "px")
                .style("top", (event.pageY - 125) + "px")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", "#FC4C02")
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // svg.selectAll("rect")
    //     .transition()
    //     .duration(800)
    //     .attr("y", function(d) { return yScale(d.team1Score); })
    //     .attr("height", function(d) { return height - yScale(d.team1Score); })
    //     .delay(function(d,i){console.log(i) ; return(i*100)})

    //titles
    svg.append("g")
        .append("text")
        .style("text-anchor", "end")
        .attr("y", -60)
        .attr("x", 150)
        .attr("fill", "#FC4C02")
        .attr("font-size", "18px")
        .text("San Francisco Shock");

    svg.append("g")
        .append("text")
        .style("text-anchor", "end")
        .attr("y", 170)
        .attr("x", 105)
        .attr("fill", "#75787B")
        .attr("font-size", "18px")
        .text("Enemy Teams");
})
