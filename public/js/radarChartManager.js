var selectList_point =[];
var selected_data=[];

function createRadar(point){
    selectList_point[selectList_point.length]=point;
}
function drawRadar() {
    RadarChart.defaultConfig.color = function() {};
    RadarChart.defaultConfig.radius = 3;
    RadarChart.defaultConfig.w = 170;
    RadarChart.defaultConfig.h = 170;

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
        w: 170,
        h: 170,
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
                var selected_group=$("#group-select option:selected").text();
                _.forEach($('.dimension-groups-box .'+selected_group).children(),function (group) {
                    data.axes.push({axis:group.getAttribute('id'),value:p.data[group.getAttribute('id')]});
                })
                selected_data.push(data);
            }
        })
    })

    d3.select("#radarChart").remove();

    var svg = d3.select('.radar-chart').append('svg').attr("id","radarChart");
    svg.attr('width', 170).attr('height', 170);
    svg.append('g').classed('single', 1).datum(selected_data).call(chart);

    appendRadarChartLegend();
}
function redrawRadar(reselected_data) {
    RadarChart.defaultConfig.color = function() {};
    RadarChart.defaultConfig.radius = 3;
    RadarChart.defaultConfig.w = 170;
    RadarChart.defaultConfig.h = 170;

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
        w: 170,
        h: 170,
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
    svg.attr('width', 170).attr('height', 170);
    svg.append('g').classed('single', 1).datum(reselected_data).call(chart);

    if(select_item_count!=0)
        appendRadarChartLegend();
}
function appendRadarChartLegend() {
    $( ".group-select-box option:selected" ).each(function() {
        if($(this).text()!='select group'){

            d3.selectAll('.radar-chart-legend svg').remove();
            var contaioner = d3.select('.radar-chart-legend').append('svg')
            var color_g = contaioner.append("g")
                .attr("id","radarchart-colorInfor");

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
    });
}