
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#heroUsage")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

d3.csv("../data/sf_shock_data_time_played(percent).csv").then(function (data) {
    const subgroups = data.columns.slice(1);

    const groups = data.map(d => d.player);

    const nestedGroups = d3.group(data, d => d.player);

    console.log(groups);
    console.log(subgroups)

    const xScale = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(0));

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale));

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, xScale.bandwidth()])
        .padding([0.05])

    // const color = d3.scaleOrdinal()
    //     .domain(subgroups)
    //     .range(['#e41a1c','#377eb8','#4daf4a'])

    // svg.selectAll(".bar")
    //     .data(data)
    //     .enter()
    //     .append("rect")
    //     //.style
    //     .attr("x", function (d) {return xScale()})
    //     .attr("y", d => yScale(d.percent))
    //     .attr("height", d => height - yScale(d.percent))
    //     .attr("width", xScale.bandwidth())
    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.player)}, 0)`)
        .selectAll("rect")
        .data(function(d) {
            return subgroups.map(function(key) {
                return {
                    key: key, value: d[key]
                };
            });
        })
        .join("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => yScale(d.value))
    //     //.attr("fill", d => color(d.key));
})