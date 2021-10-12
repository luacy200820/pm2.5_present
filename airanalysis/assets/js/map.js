var width = 680
var height = 420


// The svg
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// Map and projection
var projection = d3.geoMercator()
    .center([120.447669286, 23.479173275])                // GPS of location to zoom on
    .scale(250000)                       // This is like the zoom
    .translate([width / 2, height / 2])

// Load external data and boot
d3.json("chiayi.json", function (data) {

    // Filter data
    data.features = data.features.filter(function (d) { console.log(d.properties.ISO3166); return d.properties.ISO3166 == "CYI" })

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", "#FFFFFF")
        .attr("fill-opacity", .6)
        .attr("stroke", "white")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "none")


    // Add a scale for bubble size
    var size = d3.scaleLinear()
        .domain([1, 100])  // What's in the data
        .range([2, 30])  // Size in pixel

    var size_large = d3.scaleLinear()
        .domain([1, 100])  // What's in the data
        .range([5, 33])  // Size in pixel
    
        
    var div = d3.select("body").append("div")
       .attr("class", "tooltip")
   
        .style("opacity", 0);

    // var div_show = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);
    

    var openUrl = "zip.php";
    d3.json(openUrl, function (error, marker) {
        if (error) return console.warn(error);


        console.log(marker)
        // marker.features = marker.features.filter(function (d) { console.log(d.geometry.coordinates); return d.geometry.coordinates })
        var elem = svg.selectAll("point")
            .data(marker)
        var elemEnter = elem.enter()
            .append("g")


        // .enter()
        var circle = elemEnter.append("circle")
            .attr('cx', function (d) { return projection([d.gps_lon, d.gps_lat])[0] })//lon:經度
            .attr('cy', function (d) { return projection([d.gps_lon, d.gps_lat])[1] })
            //.attr("r", function (d) { return size(d.AirBox.s_h0) })
            .attr("r", 8)
            .style("fill", function (d) {
                var set_color = d.s_d0
                if (set_color < 15 && set_color >= 0) { return "#00FF00" }
                else if (set_color < 35 && set_color >= 15) { return "#FFFF00" }
                else if (set_color < 54 && set_color >= 35) { return "#FF7F00" }
                else if (set_color < 150 && set_color >= 54) { return "#FF0000" }
                else if (set_color < 250 && set_color >= 150) { return "#9932CC" }
                else if (set_color >= 251) { return "#8B0A50" }
            })
            //      return color(d.AirBox.s_h0) })
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 2)
            .style("opacity", 0.8)//透明度

            //    .attr("fill-opacity", .2)
            .on("mouseover", function (d) {
                //console.log("just had a mouseover", d3.select(d));
                d3.select(this).attr("r", 14);
                div.transition()
                    .duration(200)
                    .style("display","block")
                   
                    .style("opacity", .9);
             
                div.html("測站: <br/>"+d.SiteName+"<br/>"+"PM2.5: "+d.s_d0 + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
            .on("click", function (d) {
           
                div_show.transition()		
                .duration(200)	
                // .style("display","block")	
                .style("opacity", .9);
                document.getElementById("air_data").innerHTML =d.s_d0;
                // div_show.html(d.s_d0 + "<br/>" )	
                // .style("left", (d3.event.pageX) + "px")
                // .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("r", 8).style("fill", function (d) {
                    var set_color = d.s_d0
                    if (set_color < 15 && set_color >= 0) { return "#00FF00" }
                    else if (set_color < 35 && set_color >= 15) { return "#FFFF00" }
                    else if (set_color < 54 && set_color >= 35) { return "#FF7F00" }
                    else if (set_color < 150 && set_color >= 54) { return "#FF0000" }
                    else if (set_color < 250 && set_color >= 150) { return "#9932CC" }
                    else if (set_color >= 251) { return "#8B0A50" }
                });
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }
            )
    })



})
