var root = d3.select('#renderer').append('svg');
var windowWidth = $(window).width();
var windowHeight = $(window).height();

var pi = Math.PI;
var twoPi = pi * 2;

var re = /[ \{\}\[\]\/?.,;:|\)*~`!^\-+┼<>@\#$%&\'\"\\(\=]/gi;
var groupcount = 0;
var current_available_dimensions=[];
var points = [];
var colorVar;
var color;

var allValuesOf = function(data, variable) {
    var values = [];
    for (var i=0; i<data.length; i++){
        if (!values.includes(data[i][variable])) {
            values.push(data[i][variable]);
        }
    }
    return values;
};
var CsvUrl = function( csvUrl ) {
    d3.csv(csvUrl,
        function(dataset){

            if(!dataset)
            {alert("Invalid data"); return;}

            //copied from: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
            var isNumeric = function( n ) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            var addToDimensions = function(propertyList, parent) {

                var inputlist = d3.select(parent).selectAll("g").data(propertyList);

                inputlist.exit().remove();

                var groups = inputlist.enter().append("g");
                groups.append("button");

                inputlist.select("button")
                    .attr({
                        "value":function(d){return d},
                        "label":function(d){return d},
                        "draggable":true,
                        "id":function(d){return d.replace(re, "");},
                    })
                    .style({
                        "background-color": "#757475",
                        "border": "none",
                        "color": "white",
                        "display": "inline-block",
                        "font-size": "7px",
                        "line-height": "normal",
                        "text-align": "center",
                        "cursor": "pointer",
                        "border-radius": ".25em",
                        "margin":"2%",
                        "padding": ".5em .75em",
                        "height":"20px",
                    });

                inputlist.select("button").text(function(d){return d}).append("p");
            };


            d3.select(".dimensions-box")
                .style("display","block");

            var numericProps = [];
            var categoricalVars = [];
            d3.selectAll("option").remove();
            d3.select("#color-select").append("option").text("Color");

            for (property in dataset[0]) {
                if (allValuesOf(dataset, property).length <= 5) {
                    categoricalVars.push(property);
                    var option = document.createElement("option");
                    option.text = property;
                    option.value=allValuesOf(dataset, property).length;
                    option.id=property;
                    var select = document.getElementById("color-select");
                    select.appendChild(option);
                }
                else{

                    if (isNumeric(dataset[0][property])) {
                        numericProps.push(property);
                    }

                }
            }

            current_available_dimensions=[];
            for(var i=0;i<numericProps.length;i++){
                current_available_dimensions[i] = numericProps[i].replace(re, "");
            }

            addToDimensions(numericProps, ".dimensions-box");


            var springConstants = numericProps.map(function(){return d3.scale.linear().range([0, 1]);});
            springConstants.forEach(function(element, index, array){
                element.domain(d3.extent(dataset, function(d){return +d[numericProps[index]];}));
            });
            var list=[];
            _.forEach(dataset,function (d) {
                list = springConstants.map(function(element, index, array){
                    return element(d[numericProps[index]]);
                });

                for(var i =0;i<numericProps.length;i++){
                    d[numericProps[i]] = list[i];
                }

            });

            Vis.appendNodes(dataset);
            Vis.removeNodesColorInfor();
        });
}

function fileRead() {
    var file = document.getElementById("csv").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            var dataUrl = evt.target.result;
            // The following call results in an "Access denied" error in IE.
            CsvUrl(dataUrl);
        };
        reader.readAsDataURL(file);
    }
    removeDimensionsButtons();
    removeDimensionGroups();
    groupcount=0;
}
function AddGroup() {
    d3.select(".dimension-groups-box")
        .style("display","block")
        .append("div")
        .attr("class","group"+groupcount)
        .attr("id",groupcount);
    groupcount++;
}
function removeDimensionsButtons(){
    $('#0').empty();
    $('#1').empty();
    $('#2').empty();
    $('#3').empty();
    $('#4').empty();
    $('#5').empty();
}
function removeDimensionGroups() {
    $('.dimension-groups-box').empty();
    d3.select('.dimension-groups-box')
        .style('display','none');
}

$(document).ready(function(){
    var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            // 파일명 추출
            var filename = $(this)[0].files[0].name;
        }
        else {
            // Old IE 파일명 추출
            var filename = $(this).val().split('/').pop().split('\\').pop();
        };

        $(this).siblings('.upload-name').val(filename);
    });
});
/* Event fired on the drag target */
function onDragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
};
/* Events fired on the drop target */
function onDragOver(event) {
    event.preventDefault();
};
function onDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));

    var groupname = $('.dimension-groups-box').find('#'+data).parent().prop('className');
    var groupid = $('.dimension-groups-box').find('#'+data).parent().prop('id');

    var dimensionnames =  [];

    $('.'+groupname).children().each(function(){
        dimensionnames[dimensionnames.length] = $(this).attr('id');
    });

    for(var i=0;i<6;i++){
        switch($('.group'+i).children().length){
            case 0:
                if(i==0){
                    Vis.group0_points=[];
                }
                else if(i==1){
                    Vis.group1_points=[];
                }
                else if(i==2){
                    Vis.group2_points=[];
                }
                else if(i==3){
                    Vis.group3_points=[];
                }
                else if(i==4){
                    Vis.group4_points=[];
                }
                else if(i==5){
                    Vis.group5_points=[];
                }
                Vis.removeDimension('group'+i);
                break
            case 1:
                d3.select('.group'+i)
                    .style("height","30px");
                Vis.drawDimension(data,groupid,groupname);
                break
            case 2:
                d3.select('.group'+i)
                    .style("height","30px");
                break
            case 3:
            case 4:
                d3.select('.group'+i)
                    .style("height","60px");
                break
            case 5:
            case 6:
            case 7:
                d3.select('.group'+i)
                    .style("height","90px");
                break
        }
    }

    var group0_dmnames =  [];
    var group1_dmnames =  [];
    var group2_dmnames =  [];
    var group3_dmnames =  [];
    var group4_dmnames =  [];
    var group5_dmnames =  [];

    var name="";

    for(var i=0;i<6;i++){
        $('.group'+i).children().each(function(){
            switch (i){
                case 0:
                    name=$(this).attr('id');
                    group0_dmnames[group0_dmnames.length] = $(this).attr('id');
                    break
                case 1:
                    name=$(this).attr('id');
                    group1_dmnames[group1_dmnames.length] = $(this).attr('id');
                    break
                case 2:
                    name=$(this).attr('id');
                    group2_dmnames[group2_dmnames.length] = $(this).attr('id');
                    break
                case 3:
                    name=$(this).attr('id');
                    group3_dmnames[group3_dmnames.length] = $(this).attr('id');
                    break
                case 4:
                    name=$(this).attr('id');
                    group4_dmnames[group4_dmnames.length] = $(this).attr('id');
                    break
                case 5:
                    name=$(this).attr('id');
                    group5_dmnames[group5_dmnames.length] = $(this).attr('id');
                    break
            }
        });
    }

    Vis.updateDimensionAnchor(0,group0_dmnames);
    Vis.updateDimensionAnchor(1,group1_dmnames);
    Vis.updateDimensionAnchor(2,group2_dmnames);
    Vis.updateDimensionAnchor(3,group3_dmnames);
    Vis.updateDimensionAnchor(4,group4_dmnames);
    Vis.updateDimensionAnchor(5,group5_dmnames);

    Vis.updateNodes();
    Vis.appendNodesInfor();

};

var Vis = new function () {

    this.redrawdimensions = [];
    this.dimensions = [];
    this.group0_points=[];
    this.group1_points=[];
    this.group2_points=[];
    this.group3_points=[];
    this.group4_points=[];
    this.group5_points=[];
    var that = this;
    var parentG = root.append('g').attr("transform","translate(" + $('svg').width()/2 + ", " + $('svg').height()/2 + ")");
    var g = root.append('g').append('g').attr("transform","translate(" + $('svg').width()/2 + ", " + $('svg').height()/2 + ")");
    var m0=0;

    this.drawDimension = function (name, groupid, groupname) {

        var r = $('svg').height()/2-15 - groupid * 20;

        var arc = d3.svg.arc()
            .innerRadius(r-5)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(twoPi);

        d3.select("#"+groupname+"path").remove();

        g.append("path")
            .attr("d", arc)
            .attr('id',groupname+"path")
            .attr("fill", $('.'+groupname).css("background-color"));
    };

    this.updateDimensionAnchor = function (groupid, dimensionnames) {

        var dm_point=[];
        var r = $('svg').height()/2-15 - groupid * 20;
        var theta = 0;

        if(dimensionnames.length!=0){
            for(var j=0;j<dimensionnames.length;j++){

                d3.selectAll("#"+dimensionnames[j]+'label').remove();

                theta = j/dimensionnames.length * twoPi;

                var x = Math.sin((Math.PI * 2)* j/dimensionnames.length+(Math.PI/dimensionnames.length)) * r;
                var y = -Math.cos((Math.PI * 2)*j/dimensionnames.length+(Math.PI/dimensionnames.length)) * r;

                var labelX = Math.cos(theta) * (r + 8);
                var labelY = (Math.sin(theta) * (r+ 8));
                var circlelabelX = Math.cos(theta) * (r-2);
                var circlelabelY = (Math.sin(theta) * (r-2));

                g.append("circle")
                    .attr('id',dimensionnames[j]+'label')
                    .attr("cx", circlelabelX)
                    .attr("cy", circlelabelY)
                    .attr("r", 4)
                    .attr("fill","#757475")
                    .style("cursor", "move");

                g.append("text")
                    .attr("x", labelX)
                    .attr("y", labelY)
                    .attr("fill", "black")
                    .attr('id',dimensionnames[j]+'label')
                    .style("font-family", "verdana")
                    .style("font-size", 8)
                    .style("cursor", "move")
                    .attr("text-anchor", "middle")
                    .text(dimensionnames[j]);

                dm_point[dm_point.length]={"x":circlelabelX,"y":circlelabelY,"name":dimensionnames[dm_point.length],"dimension_name":"group"+groupid,}

            }

            if(groupid==0)
            {
                that.group0_points=[];
                that.group0_points.push(dm_point);
            }
            else if(groupid==1)
            {
                that.group1_points=[];
                that.group1_points.push(dm_point);
            }
            else if(groupid==2)
            {
                that.group2_points=[];
                that.group2_points.push(dm_point);
            }
            else if(groupid==3)
            {
                that.group3_points=[];
                that.group3_points.push(dm_point);
            }
            else if(groupid==4)
            {
                that.group4_points=[];
                that.group4_points.push(dm_point);
            }
            else if(groupid==5)
            {
                that.group5_points=[];
                that.group5_points.push(dm_point);
            }

            that.dimensions=[that.group0_points,that.group1_points,that.group2_points,that.group3_points,that.group4_points,that.group5_points]
        }

    }

    this.appendNodes = function (nodes) {
        parentG.append('circle').attr({
            cx:0,
            cy:0,
            r:$('svg').height()/2-15,
            fill:"#fff",
            id:"pointsgroup",
        });
        points = _.map(nodes, function (n) {
            return {
                circle: parentG.append('circle').attr({
                    cx: 0,
                    cy: 0,
                    r: 0,
                    fill: '#000',
                    id:'points',
                }),
                data: n,

            };
        });
    };

    this.updateNodes = function () {

        var index = [];
        for(var i=0;i<that.dimensions.length;i++){
            if(that.dimensions[i].length==0){
                index[index.length]=i;
            }
        }
        for (var i = index.length -1; i >= 0; i--)
            that.dimensions.splice(index[i],1);

        var maxDist = 0;
        _.forEach(points, function (n) {
            var x = 0;
            var y = 0;

            _.forEach(that.dimensions, function (dimension) {
                    _.forEach(dimension, function (d) {
                        _.forEach(d,function (dma) {
                            x += dma.x * n.data[dma.name];
                            y += dma.y * n.data[dma.name];
                        })
                    })

            });
            var dist = Math.sqrt(x * x + y * y);
            if (maxDist < dist) maxDist = dist;
        });


        _.forEach(points, function (p) {
            var x = 0, y = 0;
            _.forEach(that.dimensions, function (dimension) {
                    _.forEach(dimension, function (d) {
                        _.forEach(d,function (dma) {
                            x += dma.x * p.data[dma.name];
                            y += dma.y * p.data[dma.name];
                        })
                    })
            });
            p.circle.transition().duration(1000).attr({
                cx: x/ maxDist * ($('svg').height()/2-25*groupcount),
                cy: y/ maxDist * ($('svg').height()/2-25*groupcount),
            });
            if(groupcount==0)
                p.circle.attr({
                    r:0,
                });
            else {
                p.circle.attr({
                    r:2,
                });
            }
        });

    };

    this.appendNodesInfor = function () {

        var info = d3.select("#info");
        var name =[];

        _.forEach(points, function (p) {

            p.circle.on("mouseover", function (d) {
                d3.select(this)
                    .classed("selected", true)
                    .attr("r", 8);

                if (colorVar.length!=0) {

                    if(colorVar!="Color"){
                        var colorCategory = info.select("#colorCategory").selectAll("p").data([colorVar]);
                        colorCategory.exit().remove();
                        colorCategory.enter().append("p");

                        colorCategory
                            .text(function (varName) {
                            return varName + ":  " + p.data[varName]
                            })
                            .style("color", function (varName) {
                                return color(p.data[varName]);
                            });
                    }
                    else{
                        info.select("#colorCategory").selectAll("p").remove();
                    }
                }

                _.forEach(that.dimensions, function (dimension) {
                    _.forEach(dimension, function (d) {
                        _.forEach(d,function (dma) {
                            name[name.length] = dma.name;
                            var n = info.select("#numeric").selectAll("p").data(name);
                            n.exit().remove();
                            n.enter().append("p");
                            n.text(function (d) {
                                return d + ":  " + p.data[d]
                            });
                        });
                    });
                });
                name =[];

                var coordinates = d3.mouse(root.node());
                var bbox = root.node().getBoundingClientRect();
                coordinates[0] += bbox.left;
                coordinates[1] += bbox.top;

                info.style({
                    left: (coordinates[0] + 25) + "px",
                    top: (coordinates[1] ) + "px",
                }).classed("hidden", false);
            })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .classed("selected", false)
                        .attr("r", 2);

                    var info = d3.select("#info");
                    info.classed("hidden", true);
                });
        });
    };

    this.updateNodeColor = function (keys) {
        colorVar = keys;
        color = d3.scale.category10();

        if(colorVar!="Color"){
            _.forEach(points, function (p) {
                p.circle
                    .style("fill", function(d) { return color(p.data[colorVar]); });
            });
            that.appendNodesColorInfor();
        }
        else{
            _.forEach(points, function (p) {
                p.circle
                    .style("fill", "#000");
            });
            that.removeNodesColorInfor();
        }

    };

    this.appendNodesColorInfor = function () {

        d3.select("#node-colorInfor").remove();

        var translate = $('svg').height()-100;
        var color_g = root.append("g")
            .attr("transform","translate(0," +translate+ ")")
            .attr("id","node-colorInfor");
        var legend_names=[];

        _.forEach(points, function (p) {
            legend_names[legend_names.length]=p.data[colorVar];
        });
        legend_names=legend_names.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

        for(var i=0;i<$("#color-select").val();i++){
            var shift =i*20+10;
                color_g
                    .append("circle")
                    .attr({
                        cx:2,
                        cy:2,
                        r:5,
                    })
                    .attr("transform","translate(20," +shift+ ")")
                    .style("fill",function(d) { return color(legend_names[i]); });
            shift=i*20+15;
            color_g
                .append('text')
                .text(legend_names[i])
                .attr("transform","translate(30," +shift+ ")")

        }
    }

    this.removeNodesColorInfor = function () {
        d3.select("#node-colorInfor").remove();
    }

    this.removeDimension = function (groupname) {
        d3.select("#"+groupname+"path").remove();
        d3.select("."+groupname).remove();
        groupcount=$('.dimension-groups-box').children().length;
    }

    return this;
};

$("select").on("change", function(){
    $( ".select-box option:selected" ).each(function() {
        var keys = $( this ).text();
        Vis.updateNodeColor(keys);
    });
}).trigger( "change" );