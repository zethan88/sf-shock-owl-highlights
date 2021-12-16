const margin = {top: 50, right: 60, bottom: 50, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.left - margin.right;

const svg = d3.select("#perform")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("../data/sf_shock_data_player_perform_sum.csv").then(function (data) {
    const colorScale = d3.scaleOrdinal()
        .range(["#FC4C02", "#75787B"])
        .domain(["All Damage Done", "Healing Done"]);

    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, d => d.stat_amount)]);

    console.log(d3.extent(data, d => d.stat_amount));

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .append("text");

    //for damage
    const yScale1 = d3.scaleOrdinal()
        .range([0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400])
        .domain(d3.map(data, function (d) {
            if (d.stat_name === "All Damage Done") {
                return d.player;
            }
        }));
    svg.append("g")
        .call(d3.axisLeft(yScale1).tickFormat(function (d) {return d;}))
        .attr('stroke-width', 0)

    //for heal
    const yScale2 = d3.scaleOrdinal()
        .range([0, 400, 440, 480, 520, 560, 600, 640, 680])
        .domain(d3.map(data, function (d) {
            if (d.stat_name === "Healing Done") {
                return d.player;
            }
        }));
    svg.append("g")
        .call(d3.axisLeft(yScale2).tickFormat(function (d) {return d;}))
        .attr('stroke-width', 0)

    console.log(d3.map(data, function (d) {
        if (d.stat_name === "All Damage Done") {return d.player;}}));

    console.log(d3.map(data, function (d) {
        if (d.stat_name === "Healing Done") {return d.player;}}));

    //add bars for damage
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("id", "bar1")
        .attr("y", function (d) {return yScale1(d.player);})
        .attr("height", 35)
        .attr("fill", "#FC4C02")
        .attr("width", function (d) {return xScale(0);})
        .attr("x", function (d) {return xScale(0);})
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", d3.rgb("#FC4C02").darker(1))
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.stat_amount)
                .style("left", (event.pageX - 50) + "px")
                .style("top", (event.pageY - 25) + "px")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", "#FC4C02")
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //add bars for healing
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("id", "bar2")
        .attr("y", function (d) {return yScale2(d.player);})
        .attr("height", 35)
        .attr("fill", "#75787B")
        .attr("width", function (d) {return xScale(0);})
        .attr("x", function (d) {return xScale(0);})
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", d3.rgb("#75787B").darker(1))
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.stat_amount)
                .style("left", (event.pageX - 50) + "px")
                .style("top", (event.pageY - 25) + "px")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", "#75787B")
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.selectAll("rect[id='bar1']")
        .transition()
        .duration(800)
        .attr("x", function (d) {return xScale(0);})
        .attr("width", function (d) {
            if (d.stat_name === "All Damage Done") {return xScale(d.stat_amount);}})
        .delay(function(d,i){console.log(i) ; return(i*100)});

    svg.selectAll("rect[id='bar2']")
        .transition()
        .duration(800)
        .attr("x", function (d) {return xScale(0);})
        .attr("width", function (d) {
            if (d.stat_name === "Healing Done") {return xScale(d.stat_amount);}})
        .delay(function(d,i){console.log(i) ; return(i*100)});

    svg.append("g")
        .append("text")
        .style("text-anchor", "end")
        .attr("y", -35)
        .attr("x", 455)
        .attr("stroke", "gray")
        .attr("font-size", "18px")
        .text("Player Performance Based on Sum of All Damage Done & Healing Done");

    svg.append("g")
        .append("text")
        .attr("x", 415)
        .attr("y", 720)
        .attr("stroke", "gray")
        .attr("font-size", "14px")
        .text("All Damage Done and Heal Done Point Scale");

    svg.append("g")
        .append("text")
        .attr("x", -150)
        .attr("y", -50)
        .attr("fill", "#FC4C02")
        .attr("font-size", "14px")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("All Damage Done");

    svg.append("g")
        .append("text")
        .attr("x", -500)
        .attr("y", -50)
        .attr("fill", "#75787B")
        .attr("font-size", "14px")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Healing Done");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(480,-50)");

    const legend = d3.legendColor()
        .shapeWidth(30)
        .cells(2)
        .orient("vertical")
        .scale(colorScale);

    svg.select(".legend")
        .call(legend)
        .selectAll("text")
        .attr("font-size", "14px")
        .attr("stroke", "gray");
})