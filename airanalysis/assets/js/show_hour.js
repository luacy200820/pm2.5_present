
var loc = location.href;
var n1 = loc.length;
var n2 = loc.indexOf("=");
var id = decodeURI(loc.substr(n2 + 1, n1 - n2));
var name_id = "";
var json_url = "";
json_url = "http://163.27.46.1/airanalysis/air/hour/" + id + ".csv";
var json_hour = "http://163.27.46.1/airanalysis/air/modify/" + id + ".csv";
var json_sort = "http://163.27.46.1/airanalysis/air/sort/" + id + ".csv";
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


var token = device_id.indexOf(id);

var modify, year, mon, day;

$("#heatmap").text(device_name[token]);
$("#datepicker").datepicker($.datepicker.regional["zh-TW"]);

$(document).ready(function () {
    var Today=new Date();
    var day =Today.getFullYear()+"/"+(Today.getMonth()+1)+"/"+Today.getDate();

    $("#datepicker").val(day);
    $("#test").click(function () {
        var a = $("#datepicker").val();

        var istrue = dateValidationCheck(a);
        if (istrue == true){
            var dateObj = new Date(Date.parse(a)); // yyyy/mm/dd

            var theYear = dateObj.getFullYear();
            var theMonth = dateObj.getMonth();
            var theDay = dateObj.getDate();

        // console.log(year, mon);

        $("#cal-heatmap").empty();

        heatmap(json_url, theYear, theMonth, theDay);
        }

    });
});
get_date();

function get_date(){
  var today=new Date();
  var currentyear =today.getFullYear();
  var title = "2019~"+currentyear+" | PM2.5每小時熱力圖";
  $('#range').text(title);
}
//判斷日期是否正確
function dateValidationCheck(str) {
    var re = new RegExp("^([0-9]{4})[./]{1}([0-9]{1,2})[./]{1}([0-9]{1,2})$");
    var strDataValue;
    var limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var infoValidation = true;
    if ((strDataValue = re.exec(str)) != null) {
      var i;
      i = parseFloat(strDataValue[1]);
      if (i <= 0 || i > 9999) { /*年*/
        infoValidation = false;
      }

      i = parseFloat(strDataValue[2]);
      if (i <= 0 || i > 12) { /*月*/
        infoValidation = false;
      }
      i = parseFloat(strDataValue[3]);
      if (i <= 0 || i > 31) { /*日*/
        infoValidation = false;
      }
      i = parseFloat(strDataValue[1]);
      var isLeap = new Date (i,1,29).getDate() ===29;
      if (isLeap){
          limitInMonth[1]=29;

      }
    //   console.log(isLeap);
      i = parseFloat(strDataValue[2]);//月
      j = parseFloat(strDataValue[3]); //日
      if (j <= limitInMonth[i-1]){
          infoValidation = true;
      }
      else
          infoValidation = false;
    } else {

            infoValidation = false;
    }
    if (!infoValidation) {
    //   alert("請輸入 YYYY/MM/DD 日期格式");
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.warning('<h4>請輸入 YYYY/MM/DD 日期格式</h4>', '重新選擇一次');
    }
    return infoValidation;
  }
year = new Date().getFullYear();
mon = new Date().getMonth();
day = new Date().getDate() - 15;
heatmap(json_url, year, mon, day);
highchart(json_hour);
highsort(json_sort);
function heatmap(json_url, Tyear, Tmon, Tday) {

    var ob = {};
    // console.log(json_url);
    d3.csv(json_url, function (error, result) {
        // console.log(result);
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key).getTime();
            return Math.floor(epoch_seconds / 1000);
        }
        if (result != undefined && result.length) {
            // console.log(result);
            for (var i = 0; i < result.length; i++) {
                var miles = 0;
                // get date and miles
                var apoche = date_to_epoch(result[i]['Date']).toString();
                if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                    miles = -1;
                }
                else
                    miles = parseFloat(result[i]['PM2.5']);
                // set date and miles
                ob[apoche.toString()] = miles;
            }

            var json_string = JSON.stringify(ob);
            data = JSON.parse(json_string);
            // console.log(data);
            var cal = new CalHeatMap();

            cal.init({
                itemSelector: "#cal-heatmap",
                itemName: ["μm<br/>", "μm<br/>"],
                subDomainTitleFormat: {
                    empty: '尚未有資料<br/>{date}',
                    filled: "{count} {name} {date}"
                },
                displayLegend: false,
                cellSize: 20,
                tooltip: true,
                data: data,
                start: new Date(Tyear, Tmon, Tday),
                domain: "day",			// Group data by month
                subDomain: "hour",			// Split each month by days
                legend: [-1, 15.5, 35.5, 54.5, 150.5, 250.5, 500],
                // subDomainTextFormat: "%d",
                subDomainTextFormat: "%-H",
                subDomainDateFormat: "%Y年 %m月 %d日 %-H時",
                domainLabelFormat: "%m/%d",
                // subDomainDateFormat: "%-I%p",
                cellRadius: 2,
                legendCellSize: 15,
                browsing: true,
                animationDuration: 1000,
                // What to call when selector buttons are clicked
                nextSelector: "#domain-highlight-next-selector",
                previousSelector: "#domain-highlight-previous-selector",
                rowLimit: 12,
                range: 16,
                cellPadding: 7,


            });
        }
    });
}
function highchart(file) {
    Highcharts.setOptions({ global: { useUTC: false } });
    var chart = null;
    var ob = [];
    var get_hum = [], get_tem = [], get_pm1 = [], get_pm10 = [];

    var count_nul = 0;
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
            if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                count_nul++;
            } else {
                var miles = parseFloat(result[i]['PM2.5']);
                var hum = parseFloat(result[i]['Humidity']);
                var tem = parseFloat(result[i]['Temperature']);
                var pm1 = parseFloat(result[i]['PM1']);
                var pm10 = parseFloat(result[i]['PM10']);
                if (miles < 0) miles = 0;
                if (hum < 0) hum = 0;
                if (tem < 0) tem = 0;
                if (pm1 < 0) pm1 = 0;
                if (pm10 < 0) pm10 = 0;
            }

            // set date and miles
            // ob[apoche.toString()] = miles;
            ob.push([apoche, miles]);
            get_pm1.push([apoche, pm1]);
            get_pm10.push([apoche, pm10]);
            get_hum.push([apoche, hum]);
            get_tem.push([apoche, tem]);
        }

        if (count_nul >= 24) {
            $("#box").text("近期無資料");
        }
        else {
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
                    }
                },
                series: [{
                    name: "PM2.5",
                    data: ob
                },
                {
                    name: "PM1",
                    data: get_pm1
                },
                {
                    name: "PM10",
                    data: get_pm10
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
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'box_other',
                    // type: 'line'
                    zoomType: 'xy'
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
                // yAxis: {
                //     title: {
                //         text: '天氣指數',
                //     }
                // },
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}°C',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontWeight:"bold"
                        }
                    },
                    title: {
                        text: '溫度',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontWeight:"bold"
                        }
                    },

                    opposite: true
                }, { // second yAxis
                    gridLineWidth: 0,
                    title: {
                        text: '濕度',
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontWeight:"bold"
                        }
                    },
                    labels: {
                        format: '{value} %',
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontWeight:"bold"
                        }
                    },
                    max: 100,
                    min:0,
                    // opposite: true
                }],
                series: [

                    {
                        name: "溫度",
                        data: get_tem,
                        type: 'spline',
                        tooltip: {
                            valueSuffix: ' °C'
                        }
                    },  {
                        name: "濕度",
                        data: get_hum,
                        type: 'spline',
                        yAxis: 1,
                        dashStyle: 'shortdot',
                        tooltip: {
                            valueSuffix: ' %'
                        }

                    },
                ],
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
                },
                tooltip: {
                    split: false,
                    shared: true,
                    animation: true,
                    xDateFormat: '%Y-%m-%d %H:%M',

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
        }
    });
}

function highsort(file) {
    var isdate = 1;
    $.ajax({
        url: file,
        success: function (data) {
            var air_data = data.split(/\r?\n|\r/);
            var table_data = '<table id="customers">';

            for (var count = 0; count < air_data.length - 1; count++) {
                var cell_data = air_data[count].split(",");
                table_data += '<tr>';

                for (var cell_count = 0; cell_count < cell_data.length; cell_count += 3) {
                    if (count === 0) {
                        if (cell_data[cell_count] == "Date") {
                            table_data += '<th>' + "日期" + '</th>';
                        } else if (cell_data[cell_count] == "PM2.5") {
                            table_data += '<th>' + "PM2.5(μm)" + '</th>';
                        }
                    }
                    else {
                        if (isdate == 1) {
                            var modify = cell_data[cell_count].indexOf(':');
                            var show = cell_data[cell_count].substring(0, modify);
                            table_data += '<td>' + show + "時" + '</td>';
                            isdate = isdate * -1;
                        }
                        else if (isdate == -1) {
                            if (parseFloat(cell_data[cell_count]).toString() == 'NaN')
                                table_data += '<td>' + "無數據" + '</td>';
                            else {
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                            }
                            isdate = isdate * -1;
                        }
                    }
                }
                table_data += '</tr>';
            }
            table_data += '</table>';
            $('#sort_table').html(table_data);
        }
    });
}
