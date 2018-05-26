/**
 * Created by igorcorrea on 03/12/2015.
 */

function RvCircle() {
    this.path;
    this.x;
    this.y;
    this.r;
    this.instanceRadius;
    this.thickness;
    this.color;
    this.da = [];
    this.daGroup;
    this.daLabelGroup;
    this.contribution;
    this.dragging = false;
    this.arc = 0;
    this.createPath = function (groupname) {

        d3.select("#" + groupname + "path").remove();

        arc = d3.svg.arc()
            .innerRadius(this.r)
            .outerRadius(this.r + this.thickness)
            .startAngle(0)
            .endAngle(twoPi);

        this.path = parentG.append("path")
            .attr("d", arc)
            .attr('id', groupname + "path")
            .attr("fill", this.color);
    }

    this.initializeDaInfo = function (headers, data, dimensionnames,name) {
        var unscaledX;
        var unscaledY;
        var daCount = dimensionnames.length;

        for (var i = 0; i < daCount; i++) {
            var thisDa = new Da();
            thisDa.arc = i / daCount * twoPi;
            thisDa.weight = initial_weight;

            unscaledX = Math.cos(thisDa.arc);
            unscaledY = Math.sin(thisDa.arc);

            thisDa.key = dimensionnames[i];
            thisDa.r = 7;

            thisDa.x = unscaledX * (this.r)//this.x + unscaledX * (this.r + thisDa.r / 2);
            thisDa.y = unscaledY * (this.r) //this.y + unscaledY * (this.r + thisDa.r / 2);

            thisDa.anchorForceX = unscaledX * (this.r)//this.x + unscaledX * (this.r + thisDa.r / 2);
            thisDa.anchorForceY = unscaledY * (this.r) //this.y + unscaledY * (this.r + thisDa.r / 2);

            thisDa.labelX = unscaledX*(this.r)//this.x + unscaledX * (this.r + thisDa.r);
            thisDa.labelY = unscaledY*(this.r)-15//(this.y + unscaledY * (this.r + thisDa.r)) - 15;

            //console.log(this.instanceRadius);

            if (this.instanceRadius !== undefined) {
                thisDa.scaledX = unscaledX * (this.instanceRadius - thisDa.r / 2);
                thisDa.scaledY = unscaledY * (this.instanceRadius - thisDa.r / 2);
            }
            else {
                thisDa.scaledX = unscaledX * (this.r - thisDa.r / 2);
                thisDa.scaledY = unscaledY * (this.r - thisDa.r / 2);
            }

            thisDa.color = "white";

            thisDa.scale = d3.scale.linear()
                .domain([
                    d3.min(data, function (d) {
                        return +d[thisDa.key]
                    }),
                    d3.max(data, function (d) {
                        return +d[thisDa.key]
                    })
                ])
                .range([0, 1]);

            console.log(thisDa.getInfo());

            thisDa.dimensionnames = dimensionnames;
            thisDa.anchorname = name;

            this.da[i] = thisDa;

        }
    }

    this.getScaledR = function () {

        if (this.instanceRadius !== undefined) {

            return this.instanceRadius;
        }

        return this.r;
    }
    this.createDaGroup = function (groupname,name) {

        d3.selectAll("#" + name + "labelcircle").remove();
        d3.selectAll("#" + name + "labeltext").remove();

        d3.selectAll("." + groupname + "labelcircle").remove();
        d3.selectAll("." + groupname + "labeltext").remove();

        this.daGroup = parentG.append("g");
        this.daGroup.selectAll("circle")
            .data(this.da)
            .enter()
            .append("circle")
            .attr('class', groupname + 'labelcircle')
            .attr('id',name+'labelcircle')
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .attr("fill", function (d) {
                return d.color;
            })
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        this.daLabelGroup = parentG.append("g");
        this.daLabelGroup.selectAll("text")
            .data(this.da)
            .enter()
            .append("text")
            .attr('class', groupname + 'labeltext')
            .attr('id',name+'labeltext')
            .attr("x", function (d) {
                return d.labelX;
            })
            .attr("y", function (d) {
                return d.labelY;
            })
            .text(function (d) {
                return d.key;
            })
            .attr("fill", "black")
            .style("font-family", "verdana")
            .style("font-size", 12)
            .attr("text-anchor", "middle")
        ;
    }

    this.updateInst = function (instantly, rv) {

        if(instantly){
            var cur_rv = rv.da;
            var maxDist = 0;

            _.forEach(this.instGroup, function (n) {
                var somaX = 0;
                var somaY = 0;

                _.forEach(cur_rv, function (rvanhor) {
                    somaX += rvanhor.anchorForceX * n.data[rvanhor.key];
                    somaY += rvanhor.anchorForceY * n.data[rvanhor.key];
                })

                var dist = Math.sqrt(somaX * somaX + somaY * somaY);
                if (maxDist < dist) maxDist = dist;
            });

            _.forEach(this.instGroup, function (p) {
                var somaX = 0, somaY = 0;
                _.forEach(cur_rv, function (rvanhor) {
                    somaX += rvanhor.anchorForceX * p.data[rvanhor.key];
                    somaY += rvanhor.anchorForceY * p.data[rvanhor.key];
                })
                p.circle.transition().duration(1000).attr({
                    cx: somaX / maxDist * ($('svg').height() / 2 - 30 * groupcount),
                    cy: somaY / maxDist * ($('svg').height() / 2 - 30 * groupcount),
                });
                if (groupcount == 0)
                    p.circle.attr({
                        r: 0,
                    });
                else {
                    p.circle.attr({
                        r: 2,
                    });
                }
            });
        }


    }
}