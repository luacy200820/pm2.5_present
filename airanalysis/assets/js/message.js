var apoche;

var csv_max = "http://163.27.46.1/airanalysis/air/max_value.csv";
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



find_max(csv_max);
get_date();

function get_date(){
  var today=new Date();
  var currentyear =today.getFullYear();
  var title = "2019~"+currentyear+" | PM2.5每小時數據";
  $('#range').text(title);
}

function find_max(file) {
    $.ajax({
        url: file,
        success: function (data) {
            var air_data = data.split(/\r?\n|\r/);
            var table_data;

            for (var count = 0; count < air_data.length - 1; count++) {
                var cell_data = air_data[count].split(",");
                for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
                    if (count != 0) {
                        table_data = cell_data[cell_count];
                    }
                }
            }

            var token = device_id.indexOf(table_data);
            $('#station').text(device_name[token]);
            var json_url = "http://163.27.46.1/airanalysis/air/modify/" + table_data + ".csv";
            highchart(json_url);
            var json_sort = "http://163.27.46.1/airanalysis/air/sort/" + table_data + ".csv";
            highsort(json_sort);
            var json_where = "http://163.27.46.1/airanalysis/air/device.csv";
            findwhere(json_where, table_data);
        }
    });
}


function highchart(file) {
    Highcharts.setOptions({ global: { useUTC: false } });
    var chart = null;
    var ob = [];
    // 获取 CSV 数据并初始化图表
    d3.csv(file, function (error, result) {
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key).getTime();
            return Math.floor(epoch_seconds);
        }
        // console.log(result);
        for (var i = 0; i < result.length; i++) {

            // get date and miles
            var apoche = date_to_epoch(result[i]['Date']).toString();
            apoche = parseFloat(apoche);

            var miles = parseFloat(result[i]['PM2.5']);

            if (miles < 0) miles = 0;
            ob.push([apoche, miles]);

        }
        // console.log((ob));
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'box',
                type: 'line'
            },
            title: { text: '' },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%Y<br/>%m%d',
                    week: '%Y<br/>%m-%d',
                    month: '%Y<br/>%m',
                    year: '%Y'
                },
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            },
            yAxis: {
                title: {
                    text: '濃度指數',
                    // rotation: 0//让标签旋转-45°
                },
                min: 0,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
                plotBands: [{ // Light air
                    from: 0,
                    to: 15.4,
                    color: 'rgba(0, 255, 0, 0.3)',
                    fillOpacity: 0.8,
                    label: {
                        text: '良',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // Light breeze
                    from: 15.5,
                    to: 35.4,
                    color: 'rgba(255, 255, 0, 0.3)',
                    label: {
                        text: '普通',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // Gentle breeze
                    from: 35.4,
                    to: 54.5,
                    color: 'rgba(255, 127, 0, 0.3)',
                    fillOpacity: 0.8,
                    label: {
                        text: '易敏感',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // Moderate breeze
                    from: 54.4,
                    to: 150.5,
                    color: 'rgba(255, 0, 0, 0.3)',
                    fillOpacity: 0.8,
                    label: {
                        text: '不健康',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // High wind
                    from: 150.4,
                    to: 250.5,
                    color: 'rgba(153, 50, 204, 0.3)',
                    fillOpacity: 0.8,
                    label: {
                        text: '非常不健康',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // High wind
                    from: 250.4,
                    to: 500.5,
                    color: 'rgba(139, 10, 80, 0.3)',
                    fillOpacity: 0.8,
                    label: {
                        text: '危害',
                        style: {
                            color: '#606060'
                        }
                    }
                }]
            },
            series: [{
                name: "PM2.5",
                data: ob
            }
            ],
            tooltip: {
                split: false,
                shared: true,
                animation: true,
                xDateFormat: '%Y-%m-%d %H:%M',

            },

            credits: {
                enabled: false //不显示LOGO
            },
            exporting: {
                enabled: false //用来设置是否显示‘打印’,'导出'等
            },
            plotOptions: {
                line: {
                    connectNulls: true,//该设置会连接空值点
                },
                // series: {

                //     pointStart: Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, new Date().getUTCDate()-1, new Date().getUTCHours()+1 , 0, 0),
                //     pointInterval: 3600 * 1000 // one hour
                // },

            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        }
                    }
                }]
            }
        });
    });
}

function highsort(file) {
    $.ajax({
        url: file,
        success: function (data) {
            var air_data = data.split(/\r?\n|\r/);
            var table_data;

            for (var count = 0; count < air_data.length - 1; count++) {
                var cell_data = air_data[count].split(",");
                if (count == 1) {

                    table_data = cell_data[0].toString() + "點";
                    var modify = table_data.indexOf(':');
                    var show = table_data.substring(0, modify);
                    show += "點";
                }
            }
            $('#sort').text(show);
        }
    });
}

function findwhere(file, station) {
    $.ajax({
        url: file,
        success: function (data) {
            var air_data = data.split(/\r?\n|\r/);
            var lat, lon;

            for (var count = 0; count < air_data.length - 1; count++) {
                var cell_data = air_data[count].split(",");
                for (var cell_count = 0; cell_count < cell_data.length; cell_count += 4) {
                    if (count != 0) {
                        if (cell_data[cell_count] == station) {
                            lon = cell_data[cell_count + 2];
                            lat = cell_data[cell_count + 3];
                            console.log(lat, lon);
                        }
                        // table_data = cell_data[cell_count] ;
                        // console.log(cell_data[cell_count]);
                    }
                }
            }


            L.circle([lat, lon], 180, {
                color: 'red',
                fillColor: '#f03'
            }).addTo(map);
            // $('#sort').text(lon);
        }
    });
}

var map = L.map('map').setView([23.4752, 120.4574], 13);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,

}).addTo(map);
