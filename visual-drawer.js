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

           // addToTable(categoricalVars, "#colorGroup", "colorAttribute", "radio");
            /*
            vis.loadData(dataset);
            vis.setVars([]);
            vis.setTooltipVars([]);
            vis();*/
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

    switch($('.group0').children().length){
        case 0:
        case 1:
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
