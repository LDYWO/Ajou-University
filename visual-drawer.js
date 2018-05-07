var root = d3.select('#renderer').append('svg');
var windowWidth = $(window).width();
var windowHeight = $(window).height();

var pi = Math.PI;
var twoPi = pi * 2;

var re = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\(\=]/gi;
var groupcount = 0;
var current_available_dimensions=[];

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

            var numericProps = [];
            for (property in dataset[0]) {
                if (isNumeric(dataset[0][property])) {
                    numericProps.push(property);
                }
            }
            console.log(numericProps);

            current_available_dimensions=[];
            for(var i=0;i<numericProps.length;i++){
                current_available_dimensions[i] = numericProps[i].replace(re, "");
            }
            console.log(current_available_dimensions);

            d3.select(".dimensions-box")
                .style("display","block");

            addToDimensions(numericProps, ".dimensions-box");

            //adding all data attributes to tooltip table
            //addToTable(Object.keys(dataset[0]), "#tooltip", "tooltipAttribute", "checkbox");

            //find categorical vars
            var categoricalVars = [];
            for (property in dataset[0]) {
                if (allValuesOf(dataset, property).length <= 10) {
                    categoricalVars.push(property);
                    console.log(property);
                }
            }

            Vis.appendNodes(dataset);
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

/* Event fired on the drag target */
document.ondragstart = function(event) {
    event.dataTransfer.setData("Text", event.target.id);
};
/* Events fired on the drop target */
document.ondragover = function(event) {
    event.preventDefault();
};
document.ondrop = function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));

    var groupname = $('.dimension-groups-box').find('#'+data).parent().prop('className');
    var groupid = $('.dimension-groups-box').find('#'+data).parent().prop('id');

    var dimensionnames =  [];

    $('.'+groupname).children().each(function(){
        dimensionnames[dimensionnames.length] = $(this).attr('id');
    });

    switch($('.'+groupname).children().length){
        case 0:
        case 1:
            Vis.drawDimension(data,groupid,groupname);
            break
        case 2:
        case 3:
            d3.select('.group0')
            .style("height","30px");
            break
        case 4:
            d3.select('.group0')
            .style("height",30+6*($('.group0').children().length)+"px");
        case 7:
            d3.select('.group0')
                .style("height",60+4*($('.group0').children().length)+"px");
            break
    }

    Vis.updateDimensionLabel(groupid,dimensionnames);

    var group0_dmnames =  [];
    var group1_dmnames =  [];
    var group2_dmnames =  [];
    var group3_dmnames =  [];
    var group4_dmnames =  [];
    var group5_dmnames =  [];

    for(var i=0;i<6;i++){
        $('.group'+i).children().each(function(){
            switch (i){
                case 0:
                    group0_dmnames[group0_dmnames.length] = $(this).attr('id');
                    break
                case 1:
                    group1_dmnames[group1_dmnames.length] = $(this).attr('id');
                    break
                case 2:
                    group2_dmnames[group2_dmnames.length] = $(this).attr('id');
                    break
                case 3:
                    group3_dmnames[group3_dmnames.length] = $(this).attr('id');
                    break
                case 4:
                    group4_dmnames[group4_dmnames.length] = $(this).attr('id');
                    break
                case 5:
                    group5_dmnames[group5_dmnames.length] = $(this).attr('id');
                    break
            }
        });
    }

    Vis.updateDimensionLabel(0,group0_dmnames);
    Vis.updateDimensionLabel(1,group1_dmnames);
    Vis.updateDimensionLabel(2,group2_dmnames);
    Vis.updateDimensionLabel(3,group3_dmnames);
    Vis.updateDimensionLabel(4,group4_dmnames);
    Vis.updateDimensionLabel(5,group5_dmnames);


};
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

var Vis = new function () {

    this.redrawdimensions = [];
    this.dimensions = [];
    this.Weightdimensions = [];
    var that = this;
    var parentG = root.append('g');
    var dimensionCount = 0;

    this.drawDimension = function (name, groupid, groupname) {

        var g = root.append('g');
        var r = $('svg').height()/2-15 - groupid * 20;

        var arc = d3.svg.arc()
            .innerRadius(r-5)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(twoPi);
        g.append("path")
            .attr("d", arc)
            .attr('id',groupname)
            .attr("fill", $('.'+groupname).css("background-color"))
            .attr("transform","translate(" + $('svg').width()/2 + ", " + $('svg').height()/2 + ")");
    };

    this.updateDimensionLabel = function (groupid, dimensionnames) {
        var r = $('svg').height()/2-15 - groupid * 20;

        var theta = 0;
        for(var j=0;j<dimensionnames.length;j++){
            d3.selectAll("#"+dimensionnames[j]+'label').remove();
            theta = j/dimensionnames.length * twoPi;

            var x = $('svg').width()/2 + Math.cos(theta) * (r + 2);
            var y = $('svg').height()/2 + Math.sin(theta) * -(r + 2);

            var labelX = $('svg').width()/2 +  Math.cos(theta) * (r + 8);
            var labelY = ($('svg').height()/2 - (Math.sin(theta) * (r+ 8)));
            var circlelabelX = $('svg').width()/2 +  Math.cos(theta) * (r-2);
            var circlelabelY = ($('svg').height()/2 - (Math.sin(theta) * (r-2)));

            root.append("g")
                .append("circle")
                .attr('id',dimensionnames[j]+'label')
                .attr("cx", circlelabelX)
                .attr("cy", circlelabelY)
                .attr("r", 4)
                .attr("fill","#757475");

            root.append('g').append("text")
                .attr("x", labelX)
                .attr("y", labelY)
                .attr("fill", "black")
                .attr('id',dimensionnames[j]+'label')
                .style("font-family", "verdana")
                .style("font-size", 8)
                .attr("text-anchor", "middle")
                .text(dimensionnames[j]);
        }

    }

    this.updateDimensionData = function (keys, rotate) {
        for (var i=0; i<that.dimensions.length; i++) {
            for (var j=0; j<that.dimensions[i].length; j++) {
                if (that.dimensions[i][j].array_name[0]==keys[0]){
                    that.dimensions[i][j].x = that.dimensions[i][j].x*Math.cos(rotate*Math.PI/180) - that.dimensions[i][j].y*Math.sin(rotate*Math.PI/180);
                    that.dimensions[i][j].y =  that.dimensions[i][j].x*Math.sin(rotate*Math.PI/180) + that.dimensions[i][j].y*Math.cos(rotate*Math.PI/180);
                    that.Weightdimensions[i][j].x = that.Weightdimensions[i][j].x*Math.cos(rotate*Math.PI/180) - that.Weightdimensions[i][j].y*Math.sin(rotate*Math.PI/180);
                    that.Weightdimensions[i][j].y =  that.Weightdimensions[i][j].x*Math.sin(rotate*Math.PI/180) + that.Weightdimensions[i][j].y*Math.cos(rotate*Math.PI/180);
                }
            }
        }
    };

    this.appendNodes = function (nodes) {
        parentG.append('circle').attr({
            cx:0,
            cy:0,
            r:220,
            fill:"#fff",
            id:"pointsgroup",
        });
        points = _.map(nodes, function (n) {
            return {
                circle: parentG.append('circle').attr({
                    cx: 0,
                    cy: 0,
                    r: 2,
                    fill: '#000',
                    id:'points',
                }),
                data: n,

            };
        });
        that.updateNodes();
    };

    this.updateNodes = function () {
        var maxDist = 0;
        _.forEach(points, function (n) {
            var x = 0;
            var y = 0;

            _.forEach(that.dimensions, function (dimension) {
                _.forEach(dimension, function (d) {
                    x += d.x * n.data[d.name];
                    y += d.y * n.data[d.name];
                })
            });

            var dist = Math.sqrt(x * x + y * y);
            if (maxDist < dist) maxDist = dist;
        });

        _.forEach(points, function (p) {
            var x = 0, y = 0;

            _.forEach(that.dimensions, function (dimension) {
                _.forEach(dimension, function (d) {
                    x += d.x * p.data[d.name];
                    y += d.y * p.data[d.name];
                })
            });
            p.circle.transition().duration(1000).attr({
                cx: x / maxDist * ((windowWidth-150)/7-20),
                cy: y / maxDist * ((windowWidth-150)/7-20),
            });
            if(dimensionCount==0)
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

    this.removeDimension = function (keys,name) {

        d3.select('.selection').remove();
        d3.selectAll('#selectList #perfume-list').remove();

        var rmindex = 0;
        _.forEach(that.dimensions, function (dimension) {
            _.forEach(dimension, function (d) {
                _.forEach(keys, function (key) {
                    if(d.name==key){
                        rmindex = that.dimensions.indexOf(dimension);
                    }
                })
            })
        });

        that.dimensions.splice(rmindex,1);

        dimensionCount--;
        for(e in keys){
            root.selectAll("#"+keys[e]).remove();
            root.selectAll("#"+name).remove();
        }

        if(dimensionCount>=1){
            that.redraw();
        }

        that.updateNodes();
    };

    return this;
};