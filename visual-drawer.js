var groupcount = 0;
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

            var addToTable = function(propertyList, parent, name, type) {

                var inputlist = d3.select(parent).selectAll("g").data(propertyList);

                inputlist.exit().remove();

                var groups = inputlist.enter().append("g");
                groups.append("input");
                groups.append("text");

                inputlist.select("input")
                    .attr({
                        "type":type,
                        "value":function(d){return d},
                        "label":function(d){return d},
                        "name":name
                    });

                inputlist.select("text").text(function(d){return d}).append("p");
            };

            var numericProps = [];
            for (property in dataset[0]) {
                if (isNumeric(dataset[0][property])) {
                    numericProps.push(property);
                    console.log(property);
                }
            }
            d3.select(".dimensions-box")
                .style("display","block");

            addToTable(numericProps, "#numeric", "numericAttribute", "checkbox");

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

            addToTable(categoricalVars, "#colorGroup", "colorAttribute", "radio");
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
}
function AddGroup() {
    d3.select(".dimension-groups-box")
        .style("display","block")
        .append("div")
        .attr("class","group"+groupcount);
    groupcount++;
}