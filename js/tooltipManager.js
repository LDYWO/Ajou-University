/**
 * Created by igorcorrea on 03/12/2015.
 */

setupTooltip = function(headers, headersClass, csv) {

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    tooltip.append("div")
        .attr("class", "label");

    var pc = createParCoords(csv, headers);
    pc.colorAll = true;

    rvInst.instGroup.selectAll("circle").on("mouseover", function (d) {

        d.mouseOver = 1;
        tooltip.html(getInstanceStr(d, headers, headersClass));

        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");

        tooltip.style("display", "block");
        tooltip.transition().duration(150).style("opacity", .9)
        d3.select(this).attr("stroke", "black");
        d3.select(this).attr("stroke-width", 3);

        colorAll = false;
        pc.data(csv).alpha(1).render();
    });

    rvInst.instGroup.selectAll("circle").on("mouseout", function (d) {
        d.mouseOver = 0;
        d3.select(this).attr("stroke-width", 0);
        tooltip.transition().duration(150).style("opacity", 0);
        tooltip.style("display", "none");
        colorAll = true;
        pc.data(csv).alpha(0.4).render();
    });


    rvInst.instGroup.selectAll("circle").on("mousemove", function (d) {
        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");
    });
    return pc;
}

getInstanceStr = function (d, headers, headersClass) {
    var str = "";
    for (var i = 0; i < headers.length; i++) {
        str = str + "<p>" + headers[i].key + ": " + d[headers[i].key] + "</p>"
    }
    for (var i = 0; i < headersClass.length; i++) {
        str = str + "<p>" + headersClass[i].key + ": " + Math.round(d[headersClass[i].key] * 100) / 100 + "</p>"
    }
    return str;
}

createParCoords = function(csv, headers){

    var dataAttributes = csv.map(function(d){
        var e = {};
        e.class = d.class;
        e.mouseOver = d.mouseOver;
        for (var i = 0; i < headers.length; i++) {
            e[headers[i].key.toString()] = +d[headers[i].key.toString()];
        }
        return e;
    });

    //if(parcoords == undefined) {
    console.log("inicializando");
    parcoords = d3.parcoords()("#parc");
    //}
    //else
    //    console.log("já inicializado");

    parcoords
        .data(dataAttributes)
        .hideAxis(["class", "mouseOver"])
        .alpha(0.4)
        .color(function(d){
            //console.log(color(d.class));
            if (colorAll){
                return color(d.class);
            }
            else {
                return (d.mouseOver == 1)? color(d.class): "rgba(100,100,100,0.1)";
            }

        })
        .render()
        .createAxes()
        .reorderable();

    return parcoords;
}