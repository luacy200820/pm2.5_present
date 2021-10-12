
var loc = location.href;
var n1 = loc.length;
var n2 = loc.indexOf("=");
var id = decodeURI(loc.substr(n2+1,n1-n2));

var json_url = "";
json_url = "http://163.27.46.1/airanalysis/air/day/" + id + ".csv";
var device_id = [
        '74DA38E2B4CA', '74DA38B05396', '74DA38E69B38', '74DA38C7D388', '74DA38E69E36',
        '74DA38C7CEA0', '74DA38E2B6E8', '74DA38C7CEAE', '74DA38E2B588', '74DA38AF47B0',
        '74DA38B0522C', '08BEAC028A12', '74DA38B053B2', '74DA38B053C2', '74DA38C7CEAC',
        '74DA38EBF886', '74DA38C7CEB4', '74DA38B0539E', '74DA38B05456', '74DA38B053D8',
        '74DA38C7CEA6', '74DA38B0535E', '74DA38E69C3C', '74DA38C7D46C', '74DA38E2B530',
        '74DA38B05454', '74DA38F6FF94', '74DA38E69C9E', '74DA38C7CEB6', '74DA38EBF902',
        '74DA38C7CEC6', '74DA38E2B6FC', '74DA38C7CEA4', "74DA38B053A4", "74DA38E69E24",
        "74DA38E69B30", "74DA38E69CE4", "74DA38B053D6", "74DA38C7D5A2", "74DA38C7CEB8",
   '74DA38C7CEA8','74DA38B053BA','08BEAC028762','08BEAC028764','08BEAC028768',
   '08BEAC02877A','74DA38EBF7F2','08BEAC245F56',"08BEAC02868A","08BEAC028628"
           ,"08BEAC0286A0","08BEAC028688"
    ];
   var device_name = ['北社尾公園旁', '嘉義市宏仁女中', '維新路', '嘉義市僑平國小', 'Addison',
 '嘉義市港坪國小', '榴槤之家', '嘉義市育人國小', 'Yu室內', 'KT', '嘉義市民生國中', '永慶不動產嘉義林森店',
 '嘉義市立大業國民中', '嘉義市輔仁中學', '嘉義市立興安國小', 'RayHome', '嘉義市宣信國小', '嘉義市東吳高職',
 '嘉義市立南興國中', '74DA38B053D8', '嘉義市-蘭潭國小', 'NCYU_EMP_01', '人文新境牙醫診所', '嘉義市文雅國小',
 '綠築山莊', '74DA38B05454', '隱居', 'Hoanya', '嘉義市大同國小', 'third brother food', '嘉義市民族國小',
 'Motacila alba 崇文天下中庭', '嘉義市林森國民小學', '嘉義市立北興國中', 'lianghome', 'ws-air', '金龍街',
 '嘉義市-國立嘉義高中', '崇文國小空氣盒子', '嘉義市垂楊國小', '精忠國小','仁義空氣盒子','Wenchangpark',
 'Temple','109mtes-eastmarket','mtes601','MTES','嘉義市立民族國小','mtes 603','mtes604','mtes602','mtes music'];

var token=device_id.indexOf(id);

// $("#heatmap1").text(id);

$("#heatmap").text(device_name[token]);
 heatmap(json_url);

 get_date();

 function get_date(){
   var today=new Date();
   var currentyear =today.getFullYear();
   var title = "2019~"+currentyear+" | PM2.5每日熱力圖";
   $('#range').text(title);
 }


function heatmap(json_url) {

    var ob = {};
    // function date_to_epoch(key) {
    //     var epoch_seconds = new Date(key).getTime();
    //     return Math.floor(epoch_seconds / 1000);
    // }
    // if (result != undefined && result.length) {
    //     // console.log(result);
    //     for (var i = 0; i < result.length; i++) {

    //         // get date and miles
    //         var apoche = date_to_epoch(result[i][0]).toString();
    //         var miles = parseFloat(result[i][1]);
    //         // // set date and miles
    //         ob[apoche.toString()] = miles;

    //         // console.log(miles);
    //     }

    //     var json_string = JSON.stringify(ob);
    //     data = JSON.parse(json_string);
    //     // console.log((data));
    //     var cal = new CalHeatMap();

    //     cal.init({
    //         itemSelector: "#cal-heatmap",
    //         itemName: ["μm<br/>", "μm"],
    //         displayLegend: false,
    //         cellSize: 20,
    //         tooltip: true,
    //         data: data,
    //         start: new Date(2019, 11),
    //         // id: "graph_c",
    //             domain: "month",			// Group data by month
    //             subDomain: "day",		// Split each month by days
    //         legend: [0, 20, 40, 60, 80, 100],
    //         subDomainTextFormat: "%d",
    //         // subDomainTextFormat: "%-H",
    //         // subDomainDateFormat: "%-I%p",

    //         legendCellSize: 15,
    //         browsing: true,
    //         animationDuration: 1000,
    //         // What to call when selector buttons are clicked
    //         nextSelector: "#domain-highlight-next-selector",
    //         previousSelector: "#domain-highlight-previous-selector",

    //         range: 6,
    //         cellPadding: 5,

    //     });
    // }

    d3.csv(json_url, function (error, result) {
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key).getTime();
            return Math.floor(epoch_seconds / 1000);
        }
        if (result != undefined && result.length) {
          //  console.log(result);
            for (var i = 0; i < result.length; i++) {
                var miles=0;
                // get date and miles
                var apoche = date_to_epoch(result[i]['Date']).toString();
                if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                    miles=-1;
                 }
                else miles = parseFloat(result[i]['PM2.5']);
                // set date and miles
                ob[apoche.toString()] = miles;
            }

            var json_string = JSON.stringify(ob);
            data = JSON.parse(json_string);
            var cal = new CalHeatMap();

            cal.init({
                itemName: ["μm<br/>", "μm<br/>"],
                subDomainTitleFormat: {
                    empty: '尚未有資料<br/>{date}',
                    filled: "{count} {name} {date}"
                },
                subDomainDateFormat: "%Y年 %m月 %d日",
                domainLabelFormat: "%Y/%m",
                displayLegend: false,
                cellSize: 20,
                tooltip: true,
                data: data,
                start: new Date(new Date().getFullYear(), new Date().getMonth()-7),
                // id: "graph_c",
                domain: "month",			// Group data by month
                subDomain: "day",			// Split each month by days
                range: 8,					// Just display 3 months
	// Custom threshold for the scale
                legend: [-1, 15.5, 35.5, 54.5, 150.5,250.5, 500.5],
                subDomainTextFormat: "%d",
                //   nextSelector: "#domainDynamicDimension-next",
                //   previousSelector: "#domainDynamicDimension-previous",
                legendCellSize: 15,
                cellpadding: 1,
                browsing: true,
                animationDuration: 1000,
                cellRadius: 2,
                // What to call when selector buttons are clicked
                nextSelector: "#domain-highlight-next-selector",
                previousSelector: "#domain-highlight-previous-selector",
            });
        }
    });
}
