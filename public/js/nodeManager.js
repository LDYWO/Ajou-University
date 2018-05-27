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
                x += d.x * n.data[d.key]*(1/(1+Math.exp(-d.contribution)));
                y += d.y * n.data[d.key]*(1/(1+Math.exp(-d.contribution)));
            })

        });
        var dist = Math.sqrt(x * x + y * y);
        if (maxDist < dist) maxDist = dist;
    });


    _.forEach(instGroup, function (p) {
        var x = 0, y = 0;
        _.forEach(cur_rvs, function (dimension) {
            _.forEach(dimension, function (d) {
                x += d.x * p.data[d.key]*(1/(1+Math.exp(-d.contribution)));
                y += d.y * p.data[d.key]*(1/(1+Math.exp(-d.contribution)));
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
            drawRadar();
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

            drawRadar();
            select_item_count--;
        }
    }
    else{
        select_item_count--;
        if(select_item_count==0){
            d3.selectAll('.radar-chart-legend svg').remove();
            d3.select("#radarChart").remove();
        }
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
        if(select_item_count!=0){
            redrawRadar(selected_data);
        }

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
            $('#select-default').val("100").prop("selected", true);
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
    $('#select-default').val("100").prop("selected", true);

    if($('ul').hasClass('clicked')){
        $(this).removeClass('clicked');
    }
    selected_data=[];
    select_item_count=0;
}