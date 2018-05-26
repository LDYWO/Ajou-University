var selectList_point =[];
var selected_data=[];

function createRadar(point){
    selectList_point[selectList_point.length]=point;
}

function drawRadar(item_attr_val) {

    var item = item_attr_val;

    RadarChart.defaultConfig.color = function() {};
    RadarChart.defaultConfig.radius = 3;
    RadarChart.defaultConfig.w = 190;
    RadarChart.defaultConfig.h = 190;

    var margin = {
        top: 10,
        right: 25,
        bottom: 15,
        left: 40
    };
    var group_dma=[];

    var width = 240 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    var subview = d3.select("#subview");

    var chart = RadarChart.chart();
    var cfg = chart.config({
        containerClass: 'radar-chart', // target with css, the default stylesheet targets .radar-chart
        w: 190,
        h: 190,
        factor: 0.8,
        factorLegend: 0.95,
        levels: 3,
        maxValue: 0,
        minValue: 0,
        radians: 2 * Math.PI,
        color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
        axisLine: true,
        axisText: true,
        circles: true,
        radius: 0,
        open: false,  // whether or not the last axis value should connect back to the first axis value
                      // if true, consider modifying the chart opacity (see "Style with CSS" section above)
        axisJoin: function (d, i) {
            return d.className || i;
        },
        tooltipFormatValue: function (d) {
            return d;
        },
        tooltipFormatClass: function (d) {
            return d;
        },
        transitionDuration: 300,
        facet: false,
        levelScale: 0.85,
        labelScale: 5.0,
        facetPaddingScale: 2.1,
        showLevels: true,
        showLevelsLabels: true,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showVertices: true,
        showPolygons: true,
        polygonAreaOpacity: 0.3,
        polygonStrokeOpacity: 1,
        polygonPointSize: 4,
        legendBoxSize: 50,
        legendPosition: {x: 20, y: 20},
        paddingX: 10,
        paddingY: 30
    });

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

    d3.select("#radarChart").remove();

    var svg = d3.select('.radar-chart').append('svg').attr("id","radarChart");
    svg.attr('width', 190).attr('height', 190);
    svg.append('g').classed('single', 1).datum(selected_data).call(chart);

    appendRadarChartLegend();
    /*var polygon =  d3.select("#radarChart").selectAll(".area").data(data, cfg.axisJoin);
    polygon
        .on("click", function () {
            var pname = this.getAttribute('class').substring(24,this.getAttribute('class').length);
            console.log(pname);
            _.forEach(points,function (p) {
                if(p.data["Name"]==pname){
                    var perfume_name = subview.select("#perfume-name").data(["Name"]);
                    perfume_name.exit().remove();
                    perfume_name.enter().append("p");
                    perfume_name.text("Name").style("font-weight","bold").style("margin-left","10px").style("margin-top","10px")
                    perfume_name.append("text").text(": "+p.data["Name"]).style("font-weight","normal");

                    var perfume_brand = subview.select("#perfume-brand").data(["Designer"]);
                    perfume_brand.exit().remove();
                    perfume_brand.enter().append("p");
                    perfume_brand.text("Brand").style("font-weight","bold").style("margin-left","10px")
                    perfume_brand.append("text").text(": "+p.data["Designer"]).style("font-weight","normal");

                    var perfume_gender = subview.select("#perfume-gender").data(["Gender"]);
                    perfume_gender.exit().remove();
                    perfume_gender.enter().append("p");
                    perfume_gender.text("Gender").style("font-weight","bold").style("margin-left","10px")
                    perfume_gender.append("text").text(": "+p.data["Gender"]).style("font-weight","normal");


                    var data =[{"name": "love","value": p.data["love"]}, {"name": "like","value": p.data["like"]},{"name": "dislike","value": p.data["dislike"]}];

                    //sort bars based on value
                    data = data.sort(function (a, b) {
                        return d3.ascending(a.value, b.value);
                    });

                    d3.select("#barchart").remove();

                    var svg = subview.select("#perfume-vote").append("svg").attr("id","barchart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(5,15)");

                    subview.select("#barchart").append("text").text("Vote").attr("transform", "translate(10,"+margin.top+")").style("font-weight","bold");

                    var x = d3.scale.linear()
                        .range([0, width-120])
                        .domain([0, d3.max(data, function (d) {
                            return d.value;
                        })]);

                    var y = d3.scale.ordinal()
                        .rangeRoundBands([height-30, 0], 1)
                        .domain(data.map(function (d) {
                            return d.name;
                        }));

                    //make y axis to show bar names
                    var yAxis = d3.svg.axis()
                        .scale(y)
                        //no tick marks
                        .tickSize(0)
                        .orient("left");

                    var gy = svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(40,0)")
                        .call(yAxis);

                    var bars = svg.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("g");

                    //append rects
                    bars.append("rect")
                        .style("fill","#d3d3d3")
                        .attr("class", "bar")
                        .attr("y", function (d) {
                            return y(d.name)-10;
                        })
                        .attr("height", 20)
                        .attr("x", 50)
                        .attr("width", function (d) {
                            return x(d.value);
                        });

                    //add a value label to the right of each bar
                    bars.append("text")
                        .attr("class", "label")
                        //y position of the label is halfway down the bar
                        .attr("y", function (d) {
                            return y(d.name);
                        })
                        //x position is 3 pixels to the right of the bar
                        .attr("x", function (d) {
                            return x(d.value) + 60;
                        })
                        .text(function (d) {
                            return d.value.substring(0,4);
                        });
                }
            });
        })
        .on('mouseover', function (){
            $(this).css('opacity','0.7')
        })
        .on('mouseout', function(){
            $(this).css('opacity','1.0')
        });*/
}
function redrawRadar(reselected_data) {
    RadarChart.defaultConfig.color = function() {};
    RadarChart.defaultConfig.radius = 3;
    RadarChart.defaultConfig.w = 190;
    RadarChart.defaultConfig.h = 190;

    var margin = {
        top: 10,
        right: 25,
        bottom: 15,
        left: 40
    };
    var group_dma=[];

    var width = 240 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    var subview = d3.select("#subview");

    var chart = RadarChart.chart();
    var cfg = chart.config({
        containerClass: 'radar-chart', // target with css, the default stylesheet targets .radar-chart
        w: 190,
        h: 190,
        factor: 0.8,
        factorLegend: 0.95,
        levels: 3,
        maxValue: 0,
        minValue: 0,
        radians: 2 * Math.PI,
        color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
        axisLine: true,
        axisText: true,
        circles: true,
        radius: 0,
        open: false,  // whether or not the last axis value should connect back to the first axis value
                      // if true, consider modifying the chart opacity (see "Style with CSS" section above)
        axisJoin: function (d, i) {
            return d.className || i;
        },
        tooltipFormatValue: function (d) {
            return d;
        },
        tooltipFormatClass: function (d) {
            return d;
        },
        transitionDuration: 300,
        facet: false,
        levelScale: 0.85,
        labelScale: 5.0,
        facetPaddingScale: 2.1,
        showLevels: true,
        showLevelsLabels: true,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showVertices: true,
        showPolygons: true,
        polygonAreaOpacity: 0.3,
        polygonStrokeOpacity: 1,
        polygonPointSize: 4,
        legendBoxSize: 50,
        legendPosition: {x: 20, y: 20},
        paddingX: 10,
        paddingY: 30
    });

    d3.select("#radarChart").remove();

    var svg = d3.select('.radar-chart').append('svg').attr("id","radarChart");
    svg.attr('width', 190).attr('height', 190);
    svg.append('g').classed('single', 1).datum(reselected_data).call(chart);

    appendRadarChartLegend();
}

function appendRadarChartLegend() {
    d3.selectAll('.radar-chart-legend svg').remove();
    var contaioner = d3.select('.radar-chart-legend').append('svg')
    var color_g = contaioner.append("g")
        .attr("id","radarchart-colorInfor");

    console.log(selected_data)
    var legendcolor=d3.scale.category10()
    for(var i=0;i<selected_data.length;i++){
        var shift =i*9+3;
        var shift_text =(i+1)*9;
        color_g
            .append("rect")
            .attr({
                width:5,
                height:5,
            })
            .attr("transform","translate(20," +shift+ ")")
            .style("fill",function(d) { return legendcolor(selected_data[i].className); });
        shift=i*20+15;
        color_g
            .append('text')
            .text(selected_data[i].className)
            .attr("transform","translate(30," +shift_text+ ")")
            .style('font-size','9px');
    }
}