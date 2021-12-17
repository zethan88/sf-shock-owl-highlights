const margin = {top: 50, right: 110, bottom: 50, left: 110},
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.left - margin.right;

//svg div element on HTML
const svg = d3.select("#teamperform")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//load data for use
d3.csv("../data/grand_finals_data_obj_time.csv").then(function (data) {
    //x scale
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, 1200]);
    svg.append("g")
        .attr("transform", `translate(0, ${height - 23.75})`)
        .call(d3.axisBottom(xScale));

    //y scale setup
    const teamRange = [0, 47.5, 95, 142.5, 190, 237.5, 285, 332.5];
    const teams = d3.map(data, d => d.team);
    const yScale = d3.scaleOrdinal()
        .range(teamRange)
        .domain(teams.map((team, index) => index + team))
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .text((team) => team.substr(1));

    //draw lines
    svg.selectAll(".line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => xScale(d.stat_amount))
        .attr("y1", d => yScale([0, 47.5, 95, 142.5, 190, 237.5, 285, 332.5]))
        .attr("x2", d => xScale(0))
        .attr("y2", d => yScale([0, 47.5, 95, 142.5, 190, 237.5, 285, 332.5]))
        .attr("stroke", "grey");

    //plot dots
    svg.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.stat_amount))
        .attr("cy", d => yScale([0, 47.5, 95, 142.5, 190, 237.5, 285, 332.5]))
        .attr("r", "4.5")
        .style("fill", "#FC4C02");

    //labels and titles
    svg.selectAll(".labels")
        .data(data)
        .enter()
        .append("text")
        .attr("font-size", "12px")
        .attr("stroke", "gray")
        .attr("text-anchor", "start")
        .attr("x", d => xScale(d.stat_amount) + 10)
        .attr("y", d => yScale([0, 47.5, 95, 142.5, 190, 237.5, 285, 332.5]) + 3)
        .text(function (d) {return d3.format(".2f")(d.stat_amount);});

    svg.append("g")
        .append("text")
        .attr("x", -50)
        .attr("y", -10)
        .attr("stroke", "gray")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("———CONTROL———");

    svg.append("g")
        .append("text")
        .attr("x", -50)
        .attr("y", 85)
        .attr("stroke", "gray")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("———HYBRID———");

    svg.append("g")
        .append("text")
        .attr("x", -50)
        .attr("y", 180)
        .attr("stroke", "gray")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("———ASSAULT———");

    svg.append("g")
        .append("text")
        .attr("x", -50)
        .attr("y", 275)
        .attr("stroke", "gray")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("———PAYLOAD———");

    svg.append("g")
        .append("text")
        .attr("x", -110)
        .attr("y", -30)
        .attr("stroke", "gray")
        .attr("font-size", "18px")
        .text("Team Comparison Based On Objective Time (in seconds)");

    svg.append("g")
        .append("text")
        .attr("x", 515)
        .attr("y", height + 10)
        .attr("stroke", "gray")
        .attr("font-size", "14px")
        .text("Seconds");

})