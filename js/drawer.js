var color = d3.scale.category10();
var useClass = true;

var pi = Math.PI;
var twoPi = pi * 2;
var arc;

var shitfPressed = false;
var colorAll = true;
var svgContainer;
var instGroup=[];

var daPositions = [];
var labelPositions = [];

var headers = [];

var classIndex;

var headersClass = [];
var classNames = [];
var parcoords;
var csvdata;
var contribSlider;

var rv0,rv1,rv2,rv3,rv4,rv5;

var categoricalVars;
var numericProps;

var groupcount=0;
var re = /[ \{\}\[\]\/?.,;:|\)*~`!^\-+┼<>@\#$%&\'\"\\(\=]/gi;

svgContainer = d3.select("#chart")
    .append("svg")
    .attr("transform", "translate(0,0)");
var parentG=svgContainer.append('g')
    .attr("transform", "translate(" + $('svg').width() / 2 + ", " + $('svg').height() / 2 + ")");

var svgWidth = $('svg').width();
var svgHeight = $('svg').height();

var allValuesOf = function(data, variable) {
    var values = [];
    for (var i=0; i<data.length; i++){
        if (!values.includes(data[i][variable])) {
            values.push(data[i][variable]);
        }
    }
    return values;
};
var isNumeric = function( n ) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function destroyCurrent(){
    svgContainer.selectAll("*").remove();

    color = d3.scale.category10();

    d3.selectAll("#parc").remove();
    d3.selectAll("#sliderContainer").append("div")
        .attr("id", "parc")
        .attr("class", "parcoords")
        .style("width","650px")
        .style("height","350px");

}
function startRadviz(fileName) {

    rv0 = new RvCircle();
    rv1 = new RvCircle();
    rv2 = new RvCircle();
    rv3 = new RvCircle();
    rv4 = new RvCircle();
    rv5 = new RvCircle();

    if(fileName == undefined) {
        //fileName = "iris madeup.csv";
        fileName = "iris naive bayes.csv";

    }

    d3.select("body")
        .on("keydown", function () {
            shitfPressed = d3.event.shiftKey;
            if (d3.event.char == "c".charCodeAt(0)) {
                rvInst.instGroup.selectAll(".selected").classed("selected", false);
            }
        })
        .on("keyup", function () {
            shitfPressed = d3.event.shiftKey;
        })

    // SETUP BRUSH
    function setupBrush(csv) {
        var brush = d3.svg.polybrush()
            .x(d3.scale.linear().range([0, svgWidth]))
            .y(d3.scale.linear().range([0, svgHeight]))

            .on("brush", function () {
                // set the 'selected' class for the circle

                rvInst.instGroup.selectAll("circle").classed("selected", function (d) {

                    var x = d3.select(this).attr("cx");
                    var y = d3.select(this).attr("cy");

                    if (brush.isWithinExtent(x, y)) {
                        d3.select(this).classed("selected", true);
                        d.mouseOver = 1;

                        return true;
                    } else {
                        d3.select(this).classed("selected", false);
                        d.mouseOver = 0;

                    }

                });
                colorAll = false;
                parcoords.data(csv).alpha(1).render();
            });

        svgContainer.append("g")
            .attr("class", "brush")
            .call(brush);

    }

    d3.csv(fileName, function (csv) {

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

        daPositions = [];
        labelPositions = [];
        headers = d3.entries(csv[0]);

        classIndex = headers.indexOf("class");
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].key.toString() == "class") {
                classIndex = i;
                break;
            }
        }

        //setupBrush(csv);

        headers = headers.slice(0, classIndex);
        headersClass = d3.entries(csv[0]);
        headersClass = headersClass.slice(classIndex + 1, headersClass.length - 1);

        csv = csv.map(function (d) {
            d.mouseOver = "false";
            return d;
        });

        numericProps = [];
        categoricalVars = [];

        d3.selectAll("option").remove();
        d3.select("#color-select").append("option").text("Color");

        for (property in csv[0]) {
            if (allValuesOf(csv, property).length <= 5) {
                categoricalVars.push(property);
            }
            else{

                if (isNumeric(csv[0][property])) {
                    numericProps.push(property);
                }

            }
        }

        var springConstants = numericProps.map(function(){return d3.scale.linear().range([0, 1]);});
        springConstants.forEach(function(element, index, array){
            element.domain(d3.extent(csv, function(d){return +d[numericProps[index]];}));
        });
        var list=[];
        _.forEach(csv,function (d) {
            list = springConstants.map(function(element, index, array){
                return element(d[numericProps[index]]);
            });

            for(var i =0;i<numericProps.length;i++){
                d[numericProps[i]] = list[i];
            }

        });

        addToDimensions(numericProps, ".dimensions-box");

        csvdata=csv;

        initializeInstGroup(csvdata);

        rv0.x = svgWidth / 2;
        rv0.y = svgHeight / 2;
        rv0.thickness = 4;
        rv0.contribution = 1;
        rv0.r = $('svg').height()/2-30 ;

        rv1.x = svgWidth / 2;
        rv1.y = svgHeight / 2;
        rv1.r = $('svg').height()/2-30 - 1 * 20;
        rv1.thickness = 4;
        rv1.contribution = 1;

        rv2.x = svgWidth / 2;
        rv2.y = svgHeight / 2;
        rv2.r = $('svg').height()/2-30 - 2 * 20;
        rv2.thickness = 4;
        rv2.contribution = 1;

        rv3.x = svgWidth / 2;
        rv3.y = svgHeight / 2;
        rv3.r = $('svg').height()/2-30 - 3 * 20;
        rv3.thickness = 4;
        rv3.contribution = 1;

        rv4.x = svgWidth / 2;
        rv4.y = svgHeight / 2;
        rv4.r = $('svg').height()/2-30 - 4 * 20;
        rv4.thickness = 4;
        rv4.contribution = 1;

        rv5.x = svgWidth / 2;
        rv5.y = svgHeight / 2;
        rv5.r = $('svg').height()/2-30 - 5 * 20;
        rv5.thickness = 4;
        rv5.contribution = 1;

    });

}
function fileRead() {
    var file = document.getElementById("csv").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            var dataUrl = evt.target.result;
            // The following call results in an "Access denied" error in IE.
            //CsvUrl(dataUrl);
            startRadviz(dataUrl);
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
function initializeInstGroup(data) {

    instGroup = _.map(data, function (n) {
        return {
            circle: parentG.append("g")
                .append('circle').attr({
                    cx: 0,
                    cy: 0,
                    r: 0,
                    fill: '#000',
                    id: 'points',
                }),
            data: n,

        };
    });

}
function updateNode(cur_rvs,instantly) {
    var index = [];
    for(var i=0;i<cur_rvs.length;i++){
        if(cur_rvs[i].length==0){
            index[index.length]=i;
        }
    }
    for (var i = index.length -1; i >= 0; i--)
        cur_rvs.splice(index[i],1);


    var maxDist = 0;
    _.forEach(instGroup, function (n) {
        var x = 0;
        var y = 0;

        _.forEach(cur_rvs, function (dimension) {
            _.forEach(dimension, function (d) {
                x += d.x * n.data[d.key];
                y += d.y * n.data[d.key];
            })

        });
        var dist = Math.sqrt(x * x + y * y);
        if (maxDist < dist) maxDist = dist;
    });


    _.forEach(instGroup, function (p) {
        var x = 0, y = 0;
        _.forEach(cur_rvs, function (dimension) {
            _.forEach(dimension, function (d) {
                x += d.x * p.data[d.key];
                y += d.y * p.data[d.key];
            })
        });
        if (!instantly) {
            p.circle.transition().duration(1000).attr({
                cx: x/ maxDist * ($('svg').height()/2-25*groupcount),
                cy: y/ maxDist * ($('svg').height()/2-25*groupcount),
            });
        }
        else {
            p.circle.attr({
                cx: x/ maxDist * ($('svg').height()/2-25*groupcount),
                cy: y/ maxDist * ($('svg').height()/2-25*groupcount),
            });
        }

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
                break
            case 1:
                d3.select('.group'+i)
                    .style("height","30px");
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

    var cur_rvs =[];
    if(groupid==0){
        rv0.color = $('.'+groupname).css("background-color");
        rv0.createPath(groupname);
        rv0.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv0.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);

        }
        else
        {rv0.updateInst(false,dimensionnames,rv0);}
        setupDragBehaviour(rv0,dimensionnames);
    }
    else if(groupid==1){
        rv1.color = $('.'+groupname).css("background-color");
        rv1.createPath(groupname);
        rv1.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv1.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);
        }
        else
            rv1.updateInst(false,rv1);
        setupDragBehaviour(rv1,dimensionnames);
    }
    else if(groupid==2){
        rv2.color = $('.'+groupname).css("background-color");
        rv2.createPath(groupname);
        rv2.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv2.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);
        }
        else
            rv2.updateInst(false,rv2);
        setupDragBehaviour(rv2,dimensionnames);
    }
    else if(groupid==3){
        rv3.color = $('.'+groupname).css("background-color");
        rv3.createPath(groupname);
        rv3.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv3.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);
        }
        else
            rv3.updateInst(false,rv3);
        setupDragBehaviour(rv3,dimensionnames);
    }
    else if(groupid==4){
        rv4.color = $('.'+groupname).css("background-color");
        rv4.createPath(groupname);
        rv4.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv4.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);
        }
        else
            rv4.updateInst(false,rv4);
        setupDragBehaviour(rv4,dimensionnames);
    }
    else if(groupid==5){
        rv5.color = $('.'+groupname).css("background-color");
        rv5.createPath(groupname);
        rv5.initializeDaInfo(headers,csvdata,dimensionnames,data);
        rv5.createDaGroup(groupname,data);

        if(!rv0.da.length||!rv1.da.length||!rv2.da.length
            ||!rv3.da.length||!rv4.da.length||!rv5.da.length){
            cur_rvs.push(rv0.da,rv1.da,rv2.da,rv3.da,rv4.da,rv5.da);
            updateNode(cur_rvs,false);
        }
        else
            rv5.updateInst(false,rv5);
        setupDragBehaviour(rv5,dimensionnames);
    }
};

