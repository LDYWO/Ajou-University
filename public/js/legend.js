showLegend = function(classNames, svgContainer) {
    svgContainer.selectAll("legendRect")
        .data(classNames)
        .enter()
        .append("rect")
        .attr("class", "legendRect")
        .attr("y", function(d, i) {
            return 30 + 30*i
        })
        .style("fill", function(d){return color(d)});

    svgContainer.selectAll("legendText")
        .data(classNames)
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("x", 30)
        .attr("y", function(d, i) {
            return 45 + 30*i
        })
        .text(function(d){ return d;})
}

