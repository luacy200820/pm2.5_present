var map = L.map('map').setView([23.4752, 120.4574], 12);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 17,
}).addTo(map);

var count_staion = 0;
var arr = [];
function onEachFeature(feature, layer) {
  var name = feature.properties.station;
  if (name == '嘉義市民族國小') name = 'school-1';
  else if (name == '嘉義市立民族國小') name = 'school-2';
  else if (name == 'mtes601') name = '601-1';
  else if (name == 'MTES') name = '601-2';
  else if (name == 'mtes 603' ) name = '603';
  else if (name == 'mtes604') name = '604';
  else if (name == 'mtes602') name = '602';

    var popupContent = name + '</br></br><button class="add-button">加入</button>&emsp;<button class="del-button">刪除</button>';
    var station_id = name;
    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    // layer.bindPopup(popupContent);
    layer.bindPopup(popupContent).on("popupopen", () => {
        $(".add-button").on("click", e => {
            e.preventDefault();
            var id1 = "空氣盒子: " + station_id;
            if (count_staion < 5) {

                var token = arr.indexOf(feature.properties.device_id);
                if (token < 0) {
                    $("#uli").append("<p>" + id1 + "</p>");
                    arr.push(feature.properties.device_id);
                    count_staion++;
                    // console.log(arr);
                    layer.setStyle({
                        fillColor: "#FF0000"
                    });

                }
            }
            map.closePopup();
        });
        $(".del-button").on("click", e => {
            e.preventDefault();
            var token = arr.indexOf(feature.properties.device_id);
            if (token >= 0) {
                // console.log(token);
                arr.splice(token, 1);
                count_staion--;
                layer.setStyle({
                    fillColor: "#66B3FF"
                });
                var del_index = "#uli p:eq(" + token + ")";
                $(del_index).remove();
            }
            map.closePopup();
        });
        $("#reset").on("click", e => {

            layer.setStyle({
                radius: 7,
                fillColor: "#66B3FF",
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,

            });
        });
    });

    //  layer.on('click',onClick);
}
function onEachFeatureGov(feature, layer) {
    var popupContent = '測站:' + feature.properties.locationId + '</br>地方:' + feature.properties.area + '</br></br><button class="add-button">加入</button>&emsp;<button class="del-button">刪除</button>';
    var device = feature.properties.deviceId;
    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    // layer.bindPopup(popupContent);
    layer.bindPopup(popupContent).on("popupopen", () => {
        $(".add-button").on("click", e => {
            e.preventDefault();
            var name = "感測器: " + feature.properties.locationId;
            var id1 = device.toString();
            // console.log(id1);

            if (count_staion < 5) {

                var token = arr.indexOf(id1);
                if (token < 0) {
                    $("#uli").append("<p>" + name + "</p>");
                    arr.push(id1);
                    count_staion++;
                    // console.log(arr);
                    layer.setStyle({
                        fillColor: "#FF0000"
                    });

                }
            }
            map.closePopup();
        });
        $(".del-button").on("click", e => {
            e.preventDefault();
            var id1 = device.toString();
            var token = arr.indexOf(id1);

            if (token >= 0) {
                // console.log(token);
                arr.splice(token, 1);
                count_staion--;
                layer.setStyle({
                    fillColor: "#FFCBB3"
                });
                var del_index = "#uli p:eq(" + token + ")";
                $(del_index).remove();
            }
            map.closePopup();
        });
        $("#reset").on("click", e => {

            layer.setStyle({
                fillColor: "#FFCBB3",
                fillOpacity: 0.9,
                color: "black",
                weight: 2,
                shape: "triangle",
                radius: 6

            });
        });
    });

    //  layer.on('click',onClick);
}
var id = "", id2 = "", id3 = "", id4 = "", id5 = "";
var id_tw = "", id2_tw = "", id3_tw = "", id4_tw = "", id5_tw = "";
$(document).ready(function () {
    $(function () {

        var start = moment().subtract(1, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('YYYY/M/D') + '~' + end.format('YYYY/M/D'));
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                '近一天': [moment().subtract(1, 'day'), moment()],
                '近七天': [moment().subtract(6, 'day'), moment()],
                '近一個月': [moment().subtract(1, 'month'), moment()],
                '近三個月': [moment().subtract(3, 'month'), moment()],
                '近六個月': [moment().subtract(6, 'month'), moment()],
                '近一年': [moment().subtract(1, 'year'), moment()],
            },
            locale: {
                applyLabel: '確認',
                cancelLabel: '取消',
                fromLabel: '從',
                toLabel: '到',
                weekLabel: 'W',
                customRangeLabel: '自行選擇區段',
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            }
        }, cb);

        cb(start, end);

    });
    var a = document.body.scrollWidth;
    var noshowicon = 1; //0是有資料,1無資料
    $(window).resize(function () {
        var wdth = $(window).width();
        $("#compare").click(function () {
            if (noshowicon === 0) {
                if (wdth <= 1023) { //719
                    document.getElementById('show').style.display = 'block';
                }
                else document.getElementById('show').style.display = 'none';
            }
        });
        if (wdth > 1023) {
            document.getElementById('show').style.display = 'none';
        }
        else if (wdth <= 1023 && noshowicon === 0) {
            document.getElementById('show').style.display = 'block';
        }
    });
    $("#icon").click(function () {
        $("html,body").animate({ scrollTop: $("#box").offset().top }, 500);
    });
    $("#reset").click(function () {
        $("#uli p").remove();
        id = "", id2 = "", id3 = "", id4 = "", id5 = "";
        id_tw = "", id2_tw = "", id3_tw = "", id4_tw = "", id5_tw = "";
        count_staion = 0;
        arr = [];
        document.getElementById('show').style.display = 'none';

    });
    $("#compare").click(function () {
        if (count_staion < 2) {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-bottom-left",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "3000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr.warning('<h1>少於2個測站</h1>', '重新選擇一次');
        }
        else {
            var time = $("#reportrange span").text();
            var start_time = (time.split("~"))[0];
            var end_time = (time.split("~"))[1];
            // console.log(start_time);


            var Today = new Date();
            Today1 = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate();


            var d1 = new Date(Date.parse(start_time));
            var d2 = new Date(Date.parse(end_time));
            var d3 = (d2 - d1) / 86400000;
            var end, begin;
            // console.log(d1, d2, d3);

            var c1 = new Date(Date.parse(start_time)).getHours();
            // var c2 = new Date
            var accury_start;
            if (Today1 == end_time && (d3 < 2 && d3 >= 1)) {
                var accury_end = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate() + " " + Today.getHours() + ":00:00";
                if (Today.getHours() =='23'){
                    accury_start = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + (Today.getDate() ) + " "  + "00:00:00";
                }
                else
                     accury_start = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + (Today.getDate() - 1) + " " + (Today.getHours() + 1) + ":00:00";
                start_time = accury_start;
                end_time = accury_end;
            }
            else if ((Today1 != end_time) && (d3 < 2 && d3 >= 1)) {
                // console.log("in");
                end = d2.getFullYear() + "/" + (d2.getMonth() + 1) + "/" + (d2.getDate() - 1) + " " + "23:00:00";
                end_time = end;
                begin = d1.getFullYear() + "/" + (d1.getMonth() + 1) + "/" + (d1.getDate()) + " " + "00:00:00";
                start_time = begin;
            }
            else if (d3 === 0) {
                toasthit("請至少選擇兩天 </br> 如:2020/5/20~2020/5/21");
                document.getElementById('show').style.display = 'none';
            }
            var aa = new Date(Date.parse(end_time));

            var isovertime = aa.getFullYear() + "/" + (aa.getMonth() + 1) + "/" + (aa.getDate());

            var sum = Date.parse(Today1) - Date.parse(isovertime);
            if (noshowicon === 0) {
                if (a <= 1007) {
                    document.getElementById('show').style.display = 'block';
                }
                else document.getElementById('show').style.display = 'none';
            }
            $("#box").empty();
            $("#bar").empty();
            // $("#tre")
            document.getElementById('tresult').style.display = 'none';

            var $da = $("#uli p:eq(0)");
            id = $da.text();
            // console.log($da.text());
            var $da2 = $("#uli p:eq(1)");
            id2 = $da2.text();
            var $da3 = $("#uli p:eq(2)");
            id3 = $da3.text();
            var $da4 = $("#uli p:eq(3)");
            id4 = $da4.text();
            var $da5 = $("#uli p:eq(4)");
            id5 = $da5.text();

            var station1 = arr[0];
            var station2 = arr[1];
            if (arr.length >= 3) {
                var station3 = arr[2];
                if (arr.length >= 4) {
                    var station4 = arr[3];
                    if (arr.length >= 5) {
                        var station5 = arr[4];
                    }
                    else var station5 = "";
                }
                else {
                    var station4 = station5 = "";
                }
            }
            else {
                var station3 = station4 = station5 = "";
            }
            // console.log(station1, station2, station3);
            Highcharts.setOptions({
                global: { useUTC: false },
            });
            console.log(start_time, end_time, isovertime, Today1,d3);
            if (d3 < 2  && (sum >= 0)) { //用小時呈現
                // console.log("hour");
                connectsql(start_time, end_time);
                // console.log(start_time,end_time);
            }
            else if (d3 >= 2 && (sum >= 0)) { //用天呈現
                connectsql_day(start_time, end_time);
            }
            else if (sum < 0) {
                toasthit("時間錯誤 </br>檢查時間是否大於今天");
                document.getElementById('show').style.display = 'none';
            }
            function dotline(data) {
                // console.log(data);
                var after = [], pre, cur, dashStyle, value;
                for (var i = 1; i < data.length; i++) {
                    pre = data[i - 1][1];
                    cur = data[i][1];
                    dashStyle = '';

                    if (isNaN(pre) && !isNaN(cur)) {
                        dashStyle = 'dot';
                        value = data[i - 1][0];
                    }
                    else if (isNaN(cur) && !isNaN(pre)) {
                        dashStyle = 'solid';
                        value = data[i][0];
                    }


                    if (dashStyle) {
                        after.push({
                            dashStyle: dashStyle,
                            value: value
                        }
                        )
                    }
                }
                return after;
            }
            function change(data) {
                var after = [], tmp;
                for (var i = 0; i < data.length; i++) {
                    var apoche = parseFloat(data[i][0]);
                    tmp = parseFloat(data[i][1]);
                    after.push([apoche, tmp]);
                }
                return after;
            }
            function connectsql(start_time, end_time) {
                // console.log(start_time, end_time);
                // console.log(station1,station2);
                $.ajax({
                    type: 'POST',
                    url: 'http://163.27.46.1/airanalysis/chart_mysql.php',
                    data: {
                        // "day": what_day,
                        "start": start_time,
                        "end": end_time,
                        "first": station1,
                        "second": station2,
                        "third": station3,
                        "four": station4,
                        "five": station5
                    },
                    success: function (data) {
                        // console.log(data);
                        var find_1 = data.indexOf('[');
                        // var find_2 = data.indexOf('.');
                        var id1 = data.substring(find_1 - 1);
                        // console.log(id1);
                        if (typeof (data) === 'string') {
                            show_fir = JSON.parse(id1);
                        }
                        if (id3 != "") {
                            trans3 = change(show_fir[0][2]);
                            if (id4 != "") {
                                trans4 = change(show_fir[0][3]);
                                if (id5 != "") {
                                    trans5 = change(show_fir[0][4]);
                                }
                            }
                        }
                        trans1 = change(show_fir[0][0]);
                        trans2 = change(show_fir[0][1]);

                        var is_empty = [], tmp = 0, nothavedata = 0;
                        for (var i = 0; i < arr.length; i++) {
                            is_empty[i] = show_fir[0][i].length;
                            if (is_empty[i] === 0) {
                                tmp++;
                            }
                        }
                        // console.log(tmp,arr.length);
                        if (tmp === arr.length) {
                            nothavedata = 1;
                            noshowicon = 1;
                        }
                        if (nothavedata === 0) {  //判斷時間內有無資料
                            noshowicon = 0;
                            if (a < 1023) document.getElementById('show').style.display = 'block';
                            var chart = Highcharts.chart('box', {
                                title: {
                                    text: 'PM2.5濃度分析'
                                },
                                yAxis: {
                                    title: {
                                        text: '空氣濃度'
                                    },
                                    min: 0,
                                    minorGridLineWidth: 0,
                                    gridLineWidth: 0,
                                    alternateGridColor: null,
                                    plotBands: [{ // Light air
                                        from: 0,
                                        to: 15.5,
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
                                        from: 35.5,
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
                                        from: 54.5,
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
                                        from: 150.5,
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
                                        from: 250.5,
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

                                xAxis: {
                                    type: 'datetime',
                                    dateTimeLabelFormats: {
                                        day: '%Y<br/>%m%d',
                                        week: '%Y<br/>%m-%d',
                                        month: '%Y<br/>%m',
                                        year: '%Y'
                                    },

                                    // label: {
                                    //     connectorAllowed: false
                                    // },
                                    crosshair: true,
                                },

                                legend: {
                                    enabled: true
                                },
                                plotOptions: {
                                    series: {
                                        label: {
                                            connectorAllowed: false
                                        },
                                        marker: {
                                            enabled: false
                                        },
                                        events: {
                                            legendItemClick: function () {
                                                // return false 即可禁止图例点击响应
                                                return false;
                                            }
                                        }
                                    }
                                },
                                tooltip: {
                                    split: false,
                                    shared: true,
                                    animation: true,
                                    xDateFormat: '%Y-%m-%d %H點',
                                    valueSuffix: ' μg/m³'
                                },

                                series: [{
                                    name: id,
                                    data: trans1,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans1), //判斷虛線還是實線
                                    color: "#4A4AFF"
                                },
                                {
                                    name: id2,
                                    data: trans2,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans2), //判斷虛線還是實線
                                    color: "#000000"
                                }],
                                credits: {
                                    enabled: false //不显示LOGO
                                },
                                exporting: {
                                    enabled: false //用来设置是否显示‘打印’,'导出'等
                                },
                                responsive: {
                                    rules: [{
                                        condition: {
                                            maxWidth: 600
                                        },
                                        chartOptions: {
                                            legend: {
                                                layout: 'horizontal',
                                                align: 'center',
                                                verticalAlign: 'bottom'
                                            }
                                        }
                                    }]
                                }

                            });

                            if (id3 != "") {
                                chart.addSeries({
                                    name: id3,
                                    data: trans3,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans3), //判斷虛線還是實線
                                    color: "#930093"
                                });
                                if (id4 != "") {
                                    chart.addSeries({
                                        name: id4,
                                        data: trans4,
                                        zoneAxis: 'x',
                                        connectNulls: true,
                                        zones: dotline(trans4), //判斷虛線還是實線
                                        color: "#EA0000"
                                    });
                                    if (id5 != "") {
                                        chart.addSeries({
                                            name: id5,
                                            data: trans5,
                                            zoneAxis: 'x',
                                            connectNulls: true,
                                            zones: dotline(trans5), //判斷虛線還是實線
                                            color: "#FFFF37",
                                            color: "#D9B300"
                                        });
                                    }
                                }
                            }
                        }
                        else if (nothavedata === 1) {
                            toasthit("此區段間沒資料");
                        }
                        if (id3 != "") {
                            id_arr = [];
                            id_arr.push(id, id2, id3);
                            if (id4 != "") {
                                id_arr = [];
                                id_arr.push(id, id2, id3, id4);
                            }
                            if (id5 != "") {
                                id_arr = [];
                                id_arr.push(id, id2, id3, id4, id5);
                            }
                        }
                        else {
                            id_arr = [];
                            id_arr.push(id, id2);
                            // console.log(id_arr);
                        }
                        // console.log(id_arr);
                        if (nothavedata === 0) {
                            var chart = Highcharts.chart('bar', {
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: 'PM2.5等級統計'
                                },
                                xAxis: {
                                    categories: id_arr
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: '空氣品質狀態'
                                    }
                                },
                                tooltip: {
                                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>' +
                                        '({point.percentage:.0f}%)<br/>',
                                    //:.0f 表示保留 0 位小数，详见教程：https://www.hcharts.cn/docs/basic-labels-string-formatting
                                    shared: true
                                },
                                credits: {
                                    enabled: false //不显示LOGO
                                },
                                exporting: {
                                    enabled: false //用来设置是否显示‘打印’,'导出'等
                                },

                                plotOptions: {
                                    column: {
                                        stacking: 'percent'
                                    },
                                    series: {
                                        pointWidth: 40,
                                        events: {
                                            legendItemClick: function () {
                                                // return false 即可禁止图例点击响应
                                                return false;
                                            }
                                        }
                                    }
                                },
                                series: [{
                                    name: '沒數據',
                                    data: show_fir[1][0],
                                    color: "#000000"
                                }, {
                                    name: '優良',
                                    data: show_fir[1][1],
                                    color: "#8CEA00"
                                }, {
                                    name: '普通',
                                    data: show_fir[1][2],
                                    color: "#EAC100"
                                }, {
                                    name: '對敏感人不健康',
                                    data: show_fir[1][3],
                                    color: "#FF8000"
                                }, {
                                    name: '不健康',
                                    data: show_fir[1][4],
                                    color: "#EA0000"
                                }, {
                                    name: '非常不健康',
                                    data: show_fir[1][5],
                                    color: "#930093"
                                }, {
                                    name: '有害',
                                    data: show_fir[1][6],
                                    color: "#930000"
                                }]
                            });
                        }
                        else if (nothavedata === 1) {
                            document.getElementById('show').style.display = 'none';
                        }

                    }, error: function (msg) {
                        alert("error");
                    }

                });
            }
            function connectsql_day(start_time, end_time) {
                $.ajax({
                    type: 'POST',
                    url: 'http://163.27.46.1/airanalysis/chart_mysql_day.php',
                    data: {
                        // "day": what_day,
                        "start": start_time,
                        "end": end_time,
                        "first": station1,
                        "second": station2,
                        "third": station3,
                        "four": station4,
                        "five": station5
                    },
                    success: function (data) {
                        // console.log(data);
                        var find_1 = data.indexOf('[');
                        // var find_2 = data.indexOf('.');
                        var id1 = data.substring(find_1 - 1);
                        // console.log(id1);
                        if (typeof (data) === 'string') {
                            show_fir = JSON.parse(id1);
                        }
                        // console.log(show_fir[0][0]);
                        if (id3 != "") {
                            trans3 = change(show_fir[0][2]);
                            if (id4 != "") {
                                trans4 = change(show_fir[0][3]);
                                if (id5 != "") {
                                    trans5 = change(show_fir[0][4]);
                                }
                            }
                        }
                        trans1 = change(show_fir[0][0]);
                        trans2 = change(show_fir[0][1]);
                        var is_empty = [], tmp = 0, nothavedata = 0;
                        for (var i = 0; i < arr.length; i++) {
                            is_empty[i] = show_fir[0][i].length;
                            if (is_empty[i] === 0) {
                                tmp++;
                            }
                        }
                        // console.log(tmp,arr.length);
                        if (tmp === arr.length) {
                            nothavedata = 1;
                            noshowicon = 1;
                        }
                        if (nothavedata === 0) {
                            noshowicon = 0;
                            if (a < 1023) document.getElementById('show').style.display = 'block';
                            var chart = Highcharts.chart('box', {

                                title: {
                                    text: 'PM2.5濃度分析'
                                },
                                yAxis: {
                                    title: {
                                        text: '空氣濃度'
                                    },
                                    min: 0,
                                    minorGridLineWidth: 0,
                                    gridLineWidth: 0,
                                    alternateGridColor: null,
                                    plotBands: [{ // Light air
                                        from: 0,
                                        to: 15.5,
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
                                        from: 35.5,
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
                                        from: 54.5,
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
                                        from: 150.5,
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
                                        from: 250.5,
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
                                xAxis: {
                                    type: 'datetime',
                                    dateTimeLabelFormats: {
                                        day: '%Y<br/>%m%d',
                                        week: '%Y<br/>%m-%d',
                                        month: '%Y<br/>%m',
                                        year: '%Y'
                                    },
                                    crosshair: true,
                                },

                                legend: {
                                    enabled: true
                                },

                                plotOptions: {
                                    series: {
                                        label: {
                                            connectorAllowed: false
                                        },
                                        marker: {
                                            enabled: false
                                        },
                                        events: {
                                            legendItemClick: function () {
                                                // return false 即可禁止图例点击响应
                                                return false;
                                            }
                                        }
                                    }
                                },
                                tooltip: {
                                    split: false,
                                    shared: true,
                                    animation: true,
                                    xDateFormat: '%Y-%m-%d',
                                    valueSuffix: ' μg/m³'
                                },

                                series: [{
                                    name: id,
                                    data: trans1,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans1), //判斷虛線還是實線
                                    color: "#4A4AFF"
                                },
                                {
                                    name: id2,
                                    data: trans2,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans2), //判斷虛線還是實線
                                    color: "#000000"
                                }],
                                credits: {
                                    enabled: false //不显示LOGO
                                },
                                exporting: {
                                    enabled: false //用来设置是否显示‘打印’,'导出'等
                                },
                                responsive: {
                                    rules: [{
                                        condition: {
                                            maxWidth: 600
                                        },
                                        chartOptions: {
                                            legend: {
                                                layout: 'horizontal',
                                                align: 'center',
                                                verticalAlign: 'bottom'
                                            }
                                        }
                                    }]
                                }

                            });
                            if (id3 != "") {
                                chart.addSeries({
                                    name: id3,
                                    data: trans3,
                                    zoneAxis: 'x',
                                    connectNulls: true,
                                    zones: dotline(trans3), //判斷虛線還是實線
                                    color: "#930093"
                                });
                                if (id4 != "") {
                                    chart.addSeries({
                                        name: id4,
                                        data: trans4,
                                        zoneAxis: 'x',
                                        connectNulls: true,
                                        zones: dotline(trans4), //判斷虛線還是實線
                                        color: "#EA0000"
                                    });
                                    if (id5 != "") {
                                        chart.addSeries({
                                            name: id5,
                                            data: trans5,
                                            zoneAxis: 'x',
                                            connectNulls: true,
                                            zones: dotline(trans5), //判斷虛線還是實線
                                            color: "#D9B300"
                                        });
                                    }
                                }
                            }
                        }
                        else if (nothavedata === 1) {
                            toasthit("此區段間無資料");
                            document.getElementById('show').style.display = 'none';
                        }
                        if (id3 != "") {
                            id_arr = [];
                            id_arr.push(id, id2, id3);
                            if (id4 != "") {
                                id_arr = [];
                                id_arr.push(id, id2, id3, id4);
                            }
                            if (id5 != "") {
                                id_arr = [];
                                id_arr.push(id, id2, id3, id4, id5);
                            }
                        }
                        else {
                            id_arr = [];
                            id_arr.push(id, id2);
                            // console.log(id_arr);
                        }
                        if (nothavedata === 0) {
                            var chart = Highcharts.chart('bar', {
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: 'PM2.5等級統計'
                                },
                                xAxis: {
                                    categories: id_arr
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: '空氣品質狀態'
                                    }
                                },
                                tooltip: {
                                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>' +
                                        '({point.percentage:.0f}%)<br/>',
                                    //:.0f 表示保留 0 位小数，详见教程：https://www.hcharts.cn/docs/basic-labels-string-formatting
                                    shared: true
                                },
                                credits: {
                                    enabled: false //不显示LOGO
                                },
                                exporting: {
                                    enabled: false //用来设置是否显示‘打印’,'导出'等
                                },

                                plotOptions: {
                                    column: {
                                        stacking: 'percent'
                                    },
                                    series: {
                                        pointWidth: 40,
                                        events: {
                                            legendItemClick: function () {
                                                // return false 即可禁止图例点击响应
                                                return false;
                                            }
                                        }
                                    }

                                },
                                series: [{
                                    name: '沒數據',
                                    data: show_fir[1][0],
                                    color: "#000000"
                                }, {
                                    name: '優良',
                                    data: show_fir[1][1],
                                    color: "#8CEA00"
                                }, {
                                    name: '普通',
                                    data: show_fir[1][2],
                                    color: "#EAC100"
                                }, {
                                    name: '對敏感人不健康',
                                    data: show_fir[1][3],
                                    color: "#FF8000"
                                }, {
                                    name: '不健康',
                                    data: show_fir[1][4],
                                    color: "#EA0000"
                                }, {
                                    name: '非常不健康',
                                    data: show_fir[1][5],
                                    color: "#930093"
                                }, {
                                    name: '有害',
                                    data: show_fir[1][6],
                                    color: "#930000"
                                }]
                            });
                        }

                    }, error: function (msg) {
                        alert("error");
                    }

                });
            }
        }
    });

});

var command = new L.control({
    position: 'bottomright'
});

// function myBrowser(){
//     var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字串
//     var isOpera = userAgent.indexOf("Opera") > -1;
//     if (isOpera) {
//         return "Opera"
//     }; //判斷是否Opera瀏覽器
//     if (userAgent.indexOf("Firefox") > -1) {
//         return "FF";
//     } //判斷是否Firefox瀏覽器
//     if (userAgent.indexOf("Chrome") > -1){
// 	  return "Chrome";
// 	}
//     if (userAgent.indexOf("Safari") > -1) {
//         return "Safari";
//     } //判斷是否Safari瀏覽器
//     if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
//        if (userAgent.indexOf("MSIE 6.0") > -1) { return "IE6"; }
//        if (userAgent.indexOf("MSIE 7.0") > -1) { return "IE7"; }
//        if (userAgent.indexOf("MSIE 8.0") > -1) { return "IE8"; }
//        if (userAgent.indexOf("MSIE 9.0") > -1) { return "IE9"; }
//        if (userAgent.indexOf("MSIE 10.0") > -1) { return "IE10"; }
//        return "IE";
//     } //判斷是否IE6-9瀏覽器
//     if (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1 && !isOpera) {
//        if (userAgent.indexOf("rv:10.0") > -1) { return "IE10"; }
//        if (userAgent.indexOf("rv:11.0") > -1) { return "IE11"; }
//        return "IE11";
//     } //判斷是否IE10-11瀏覽器
//     else
//     {
//        return userAgent;
//     }
// }


// //以下是呼叫上面的函式
// var mb = myBrowser();

// document.write(navigator.userAgent);

// if ("FF" == mb) {
//     // alert("我是 Firefox");
// }

// if ("Chrome" == mb) {
//     // alert("我是 Chrome");
// }

// if ("Opera" == mb) {
//     // alert("我是 Opera");
// }

// if ("Safari" == mb) {
//     // alert("我是 Safari");
// }


command.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info_legend', document.getElementById("legend-container"));

    div.innerHTML = "" +
        "<div class='legend-title'>空氣測站</div>" +
        "<div class='legend-scale'>" +
        "<ul class='legend-labels d-flex flex-column'>" +
        "<li><svg xmlns='http://www.w3.org/2000/svg' version='1.1'><circle cx='6' cy='7' r='4' stroke='black'stroke-width='1' fill='#66B3FF'/></svg>空氣盒子</li>" +

        "<li><svg xmlns='http://www.w3.org/2000/svg' ><polygon points='1,10 6,0 11,10'style='fill:#FFCBB3;stroke:black;stroke-width:1'/></svg>微型感測器</li>" +
        "</ul>" +
        "</div>";
    return div;
};
command.addTo(map);

function toasthit(hint) {
    var detil = '<h1>' + hint + '</h1>';

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "3500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.warning(detil, '重新選擇一次');
}
function createCircleMarker(feature, latlng) {

    var color = "#66B3FF";

    let options = {
        radius: 7,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    return L.circleMarker(latlng, options);
}
$.getJSON('geojson.php', function (geojson) {
    // console.log(geojson.gps_lon)
    L.geoJson(geojson, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker

    }).addTo(map);
});


$.getJSON('air.geojson', function (geojson) {

    L.geoJson(geojson, {
        onEachFeature: onEachFeatureGov,
        pointToLayer: createCircleGov,
    }).addTo(map);

});
function createCircleGov(feature, latlng) {

    var color;
    color = "#FFCBB3";
    return L.shapeMarker(latlng, {
        fillColor: color,
        fillOpacity: 0.9,
        color: "black",
        weight: 2,
        shape: "triangle",
        radius: 6
    });
}
