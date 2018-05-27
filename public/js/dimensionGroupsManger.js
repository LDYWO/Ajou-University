function AddGroup() {
    d3.select(".dimension-groups-box")
        .style("display","block")
        .append("div")
        .attr("class","group"+groupcount)
        .attr("id",groupcount);
    groupcount++;

    d3.selectAll("#group-select option").remove();

    var option = document.createElement("option");
    option.text = 'select group';
    option.value =100;
    option.id='select-default';
    var select = document.getElementById("group-select");
    select.appendChild(option);

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