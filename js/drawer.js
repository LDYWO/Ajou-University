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
var pre_csvdata;
var csvdata;
var contribSlider;
var newSeries={};

var rv0,rv1,rv2,rv3,rv4,rv5;

var categoricalVars;
var numericProps;
var charVars;

var colorVar=[];
var color;

var item_name;
var item_attr;

var groupcount=0;
var re = /[ \{\}\[\]\/?.,;:|*~`!^\-+┼<>@\#$%&\'\"\\=]/gi;

svgContainer = d3.select("#chart")
    .append("svg");

var parentG=svgContainer.append('g')
    .attr("transform", "translate(" + $('svg').width() / 2 + ", " + $('svg').height() / 2 + ")");

var pointsG = svgContainer.append('g')
    .attr("transform", "translate(" + $('svg').width() / 2 + ", " + $('svg').height() / 2 + ")");

var svgWidth = $('svg').width();
var svgHeight = $('svg').height();

var select_item_count = 0;
var pre_seleted_item_id =[];
var item_name_list =[];

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

CloseTooltip = function() {
    console.log("hello!");
    alert("hello");
};

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

    d3.csv(fileName, function (csv) {

        pre_csvdata = csv;

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

        headers = headers.slice(0, classIndex);
        headersClass = d3.entries(csv[0]);
        headersClass = headersClass.slice(classIndex + 1, headersClass.length - 1);

        /*csv = csv.map(function (d) {
            d.mouseOver = "false";
            return d;
        });*/

        numericProps = [];
        categoricalVars = [];
        charVars = [];

        d3.selectAll("option").remove();
        d3.select("#color-select").append("option").text("Color");

        for (property in csv[0]) {
            if (allValuesOf(csv, property).length <= 5) {
                categoricalVars.push(property);
                var option = document.createElement("option");
                option.text = property;
                option.value=allValuesOf(csv, property).length;
                option.id=property;
                var select = document.getElementById("color-select");
                select.appendChild(option);
            }
            else{

                if (isNumeric(csv[0][property])) {
                    numericProps.push(property);
                }
                else {
                    charVars.push(property)
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

    d3.selectAll("#group-select option").remove();

    _.forEach($('.dimension-groups-box').children(),function (grop) {
        var option = document.createElement("option");
        option.text = grop.getAttribute('class');
        option.value = grop.getAttribute('id');
        option.id = grop.getAttribute('class')+"comparison";
        var select = document.getElementById("group-select");
        select.appendChild(option);
    })
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
    parentG.append('circle').attr({
        cx:0,
        cy:0,
        r:$('svg').height()/2-15,
        fill:"#fff",
        id:"pointsgroup",
    });

    instGroup = _.map(data, function (n) {
        return {
            circle: pointsG
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
                cx: x/ maxDist * ($('svg').height()/2-35*groupcount),
                cy: y/ maxDist * ($('svg').height()/2-35*groupcount),
            });
        }
        else {
            p.circle.attr({
                cx: x/ maxDist * ($('svg').height()/2-35*groupcount),
                cy: y/ maxDist * ($('svg').height()/2-35*groupcount),
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

    appendNodesInfor(cur_rvs);
    dragRect();

}
function appendNodesInfor(cur_rvs) {

    var info = d3.select("#info");
    var name =[];

    _.forEach(instGroup, function (p) {

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

            _.forEach(cur_rvs, function (dimension) {
                _.forEach(dimension, function (d) {
                    name[name.length] = d.key;
                    var n = info.select("#numeric").selectAll("p").data(name);
                    n.exit().remove();
                    n.enter().append("p");
                    n.text(function (d) {
                        return d + ":  " + p.data[d]
                    });
                })
            });
            name =[];

            var x = parseInt(d3.select(this).attr("cx"));
            var y = parseInt(d3.select(this).attr("cy"));

            var coordinates = pointsG.node();
            var bbox = pointsG.node().getBoundingClientRect();
            x += bbox.left;
            y += bbox.top;

            info.style({
                left: (x + 25) + "px",
                top: (y) + "px",
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
function updateNodeColor(keys) {
    colorVar = keys;
    color = d3.scale.category10();

    if(colorVar!="Color"){
        _.forEach(instGroup, function (p) {
            p.circle
                .style("fill", function(d) { return color(p.data[colorVar]); });
        });
        appendNodesColorInfor(colorVar);
    }
    else{
        _.forEach(instGroup, function (p) {
            p.circle
                .style("fill", "#000");
        });
        removeNodesColorInfor();
    }

};
function appendNodesColorInfor(keys) {

    colorVar = keys;

    d3.select("#node-colorInfor").remove();

    var translate = $('svg').height()-100;
    var color_g = svgContainer.append("g")
        .attr("transform","translate(0," +translate+ ")")
        .attr("id","node-colorInfor");
    var legend_names=[];

    _.forEach(instGroup, function (p) {
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
function removeNodesColorInfor() {
    d3.select("#node-colorInfor").remove();
}
function removeDimension(groupname) {
    d3.select("#"+groupname+"path").remove();
    d3.select("."+groupname).remove();
    groupcount=$('.dimension-groups-box').children().length;
}
function selectItem(item) {

    var item_id = item.getAttribute('id');
    item_name = item.getAttribute('itemValue');
    item_attr = item.getAttribute('itemAttribute');
    var checked = item.getAttribute('class');

    if(checked=='not-checked'){
        select_item_count++;
        item.setAttribute('class','checked');
        if(select_item_count<=5)
        {
            pre_seleted_item_id.push(item_id);
            item_name_list.push({attr:item_attr,value:item_name});
            drawRadar(item_name_list);
        }
        else{
            $("#"+pre_seleted_item_id[pre_seleted_item_id.length-5]).prop('checked',false);
            $("#"+pre_seleted_item_id[pre_seleted_item_id.length-5]).attr('class','not-checked');

            pre_seleted_item_id.push(item_id);
            pre_seleted_item_id.splice(0,1);

            item_name_list=[];
            for(var i=0;i<pre_seleted_item_id.length;i++){
                item_name_list.push({attr:$('#'+pre_seleted_item_id[i]).attr('itemAttribute'),value:$('#'+pre_seleted_item_id[i]).attr('itemValue')});
            }

            selected_data.shift();

            drawRadar(item_name_list);
            select_item_count--;
        }
    }
    else{
        select_item_count--;
        console.log("count::"+select_item_count)
        item.setAttribute('class','not-checked');

        pre_seleted_item_id.splice(pre_seleted_item_id.indexOf(item_id),1);

        item_name_list=[];
        for(var i=0;i<pre_seleted_item_id.length;i++){
            item_name_list.push({attr:$('#'+pre_seleted_item_id[i]).attr('itemAttribute'),value:$('#'+pre_seleted_item_id[i]).attr('itemValue')});
        }
        var selected_group;

        function Data() {
            return{
                'className':'',
                'axes' : [],
            }
        }
        selected_data=[];
        _.forEach(selectList_point,function (p) {
            _.forEach(item_name_list,function (i) {
                // noinspection JSAnnotator
                if(p.data[i.attr]==i.value){
                    var data = Data();
                    data.className=p.data[i.attr];
                    selected_group=$("#group-select option:selected").text();
                    _.forEach($('.dimension-groups-box .'+selected_group).children(),function (group) {
                        data.axes.push({axis:group.getAttribute('id'),value:p.data[group.getAttribute('id')]});
                    })
                    selected_data.push(data);
                }
            })
        })
        redrawRadar(selected_data);
    }
}
function dragRect() {

    var selectionRect = {
        element			: null,
        previousElement : null,
        currentY		: 0,
        currentX		: 0,
        originX			: 0,
        originY			: 0,
        id              :"select_rect",
        setElement: function(ele) {
            this.previousElement = this.element;
            this.element = ele;
        },
        getNewAttributes: function() {
            var x = this.currentX<this.originX?this.currentX:this.originX;
            var y = this.currentY<this.originY?this.currentY:this.originY;
            var width = Math.abs(this.currentX - this.originX);
            var height = Math.abs(this.currentY - this.originY);

            if(width>100)
                width=100;
            if(height>100)
                height=100;

            return {
                x       : x,
                y       : y,
                width  	: width,
                height  : height
            };
        },
        getCurrentAttributes: function() {
            // use plus sign to convert string into number
            var x = +this.element.attr("x");
            var y = +this.element.attr("y");
            var width = +this.element.attr("width");
            var height = +this.element.attr("height");

            if(width>100)
                width=100;
            if(height>100)
                height=100;

            return {
                x1  : x,
                y1	: y,
                x2  : x + width,
                y2  : y + height
            };
        },
        getCurrentAttributesAsText: function() {
            var attrs = this.getCurrentAttributes();
            return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
        },
        init: function(newX, newY) {
            var rectElement = parentG.append("rect")
                .attr({
                    rx      : 4,
                    ry      : 4,
                    x       : 0,
                    y       : 0,
                    width   : 0,
                    height  : 0
                })
                .classed("selection", true);
            this.setElement(rectElement);
            this.originX = newX;
            this.originY = newY;
            this.update(newX, newY);
        },
        update: function(newX, newY) {
            this.currentX = newX;
            this.currentY = newY;
            this.element.attr(this.getNewAttributes());
        },
        focus: function() {
            this.element
                .style("background-color","#ffffff")
                .style("opacity","0.5")
                .style("stroke", "#888888")
                .style("stroke-dasharray","5")
                .style("stroke-width", "2");
        },
        remove: function() {
            this.element.remove();
            this.element = null;
        },
        removePrevious: function() {
            if(this.previousElement) {
                this.previousElement.remove();
            }
        }
    };

    var svg = d3.select("#pointsgroup");
    var clickTime = d3.select("#clicktime");
    var attributesText = d3.select("#attributestext");

    var count = 0;

    function add_item(p){
        // pre_set 에 있는 내용을 읽어와서 처리..
        var div = document.createElement('div');
        var ul = document.createElement('ul');
        var li = document.createElement('li');
        var span1 = document.createElement('span');
        var span3 = document.createElement('span');
        var span4 = document.createElement('span');
        var div2 = document.createElement('div');
        var label = document.createElement('label');
        var input = document.createElement('input');

        document.getElementById('count').textContent = count+1;

        ul.id ="item-list";
        ul.setAttribute("data",p.data);
        ul.className ="demo-list-control mdl-list";
        ul.style.height = "0.5%";
        ul.style.width="100%";
        ul.style.padding = "3px";
        ul.style.boxShadow=" 0 1px 5px 0 rgba(0,0,0,.12)";
        if(count==0){
            ul.style.marginTop ="-5px";
        }
        else{
            ul.style.marginTop ="-10px";
        }

        li.className ="mdl-list__item";
        li.style.padding = "0px";


        span1.className ="mdl-list__item-primary-content";
        span4.className="mdl-list__item-sub-title";

        var keys = Object.keys(p.data);
        var content = [];
        var names = [];

        for ( var i in keys) {
            _.forEach(charVars,function (cv) {
                if(keys[i]==cv){
                    content[content.length]= "\ "+keys[i]+ " : "+ p.data[keys[i]]+"\ ";
                    names[names.length]=keys[i];
                }

            })
        }

        span3.textContent = content;

        span3.style.marginLeft="15px";
        span3.style.fontSize="10px";

        input.id = "checkbox"+count;
        input.type ="checkbox";
        input.setAttribute('onclick','selectItem(this)');
        input.setAttribute('class','not-checked');
        input.setAttribute('itemValue',p.data[names[0]]);
        input.setAttribute('itemAttribute',names[0]);

        div2.className ="md-checkbox";
        label.htmlFor = "checkbox"+count;

        div2.appendChild(input);
        div2.appendChild(label);

        span1.appendChild(span3);
        span3.appendChild(span4);

        li.appendChild(span1);
        li.appendChild(div2);
        ul.appendChild(li);
        div.appendChild(ul);

        document.getElementById('selectList').appendChild(div);

        count++;
    }

    function remove_item(obj){
        // obj.parentNode 를 이용하여 삭제
        document.getElementById('selectList').removeChild(obj.parentNode);
    }

    function dragStart() {
        console.log("dragStart");
        document.getElementById('count').textContent = 0;
        count=0;
        pre_seleted_item_id=[];
        item_name_list=[];
        select_item_count=0;
        d3.selectAll('#selectList #item-list').remove();
        d3.select("#radarChart").remove();
        d3.select(".comparison-select-box").style("display","none");
        var p = d3.mouse(this);
        if(p[0]>-200&&p[1]<200
            &&p[0]<200&&p[1]>-200)
        {
            selectionRect.init(p[0], p[1]);
            selectionRect.removePrevious();
        }
    }

    function dragMove() {
        console.log("dragMove");
        var p = d3.mouse(this);
        if(p[0]>-200&&p[1]<200
            &&p[0]<200&&p[1]>-200)
        {
            selectionRect.update(p[0], p[1]);
        }
        attributesText
            .text(selectionRect.getCurrentAttributesAsText());
    }

    function dragEnd() {
        console.log("dragEnd");
        var finalAttributes = selectionRect.getCurrentAttributes();
        console.dir(finalAttributes);

        selectList_point=[];
        _.forEach(instGroup, function (p) {
            if(finalAttributes.x1<p.circle[0][0].getAttribute("cx")&&p.circle[0][0].getAttribute("cx")<finalAttributes.x2
                &&finalAttributes.y1<p.circle[0][0].getAttribute("cy")&&p.circle[0][0].getAttribute("cy")<finalAttributes.y2)
            {
                add_item(p);
                createRadar(p);
            }
        });

        if(finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1){
            console.log("range selected");
            // range selected
            d3.event.sourceEvent.preventDefault();
            selectionRect.focus();
        }
        else {
            console.log("single point");
            // single point selected
            selectionRect.remove();
            d3.selectAll('#selectList #item-list').remove();
            document.getElementById('count').textContent = 0;
            count=0;
            if($('ul').hasClass('clicked')){
                $(this).removeClass('clicked');
            }
            selected_data=[];
            select_item_count=0;
            item_name_list=[];
            d3.selectAll('.radar-chart-legend svg').remove();
            // trigger click event manually
            clicked();
        }
    }

    var dragBehavior = d3.behavior.drag()
        .on("drag", dragMove)
        .on("dragstart", dragStart)
        .on("dragend", dragEnd);

    svg.call(dragBehavior);

    function clicked() {
        var d = new Date();
        clickTime
            .text("Clicked at " + d.toTimeString().substr(0,8) + ":" + d.getMilliseconds());
    }

}
function removeSelectionBox() {
    item_name_list=[];
    d3.selectAll('.radar-chart-legend svg').remove();
    d3.selectAll('#selectList #item-list').remove();
    d3.select("#radarChart").remove();
    d3.select(".comparison-select-box").style("display","none");
    d3.select('#select_rect').remove();
    d3.select('.selection').remove();
    d3.selectAll('#selectList #item-list').remove();
    document.getElementById('count').textContent = 0;

    if($('ul').hasClass('clicked')){
        $(this).removeClass('clicked');
    }
    selected_data=[];
    select_item_count=0;
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

    removeSelectionBox();

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

$("select").on("change", function(){
    $( ".select-box option:selected" ).each(function() {
        var keys = $( this ).text();
        updateNodeColor(keys);
    });
}).trigger( "change" );
$("select").on("change", function(){
    $( ".group-select-box option:selected" ).each(function() {
        var selected_group;

        function Data() {
            return{
                'className':'',
                'axes' : [],
            }
        }
        selected_data=[];
        _.forEach(selectList_point,function (p) {
           _.forEach(item_name_list,function (i) {
                // noinspection JSAnnotator
               if(p.data[i.attr]==i.value){
                   var data = Data();
                    data.className=p.data[i.attr];
                    selected_group=$("#group-select option:selected").text();
                    _.forEach($('.dimension-groups-box .'+selected_group).children(),function (group) {
                        data.axes.push({axis:group.getAttribute('id'),value:p.data[group.getAttribute('id')]});
                    })
                    selected_data.push(data);
                }
            })
        })
        redrawRadar(selected_data);
    });
}).trigger( "change" );