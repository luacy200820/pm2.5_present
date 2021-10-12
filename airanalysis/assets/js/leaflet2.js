// 時間動態圖
L.TimeDimension.Layer.GeoJson.GeometryCollection = L.TimeDimension.Layer.GeoJson.extend({

    // Do not modify features. Just return the feature if it intersects
    // the time interval
    _getFeatureBetweenDates: function (feature, minTime, maxTime) {
        var featureStringTimes = this._getFeatureTimes(feature);
        if (featureStringTimes.length == 0) {
            return feature;
        }
        var featureTimes = [];
        for (var i = 0, l = featureStringTimes.length; i < l; i++) {
            var time = featureStringTimes[i]
            if (typeof time == 'string' || time instanceof String) {
                time = Date.parse(time.trim());
            }
            featureTimes.push(time);
        }

        if (featureTimes[0] > maxTime || featureTimes[l - 1] < minTime) {
            return null;
        }
        return feature;
    },

});

L.timeDimension.layer.geoJson = function (layer, options) {
    return new L.TimeDimension.Layer.GeoJson(layer, options);
};

// 初始值
function init() {
    document.getElementById('weathermap').innerHTML = "<div id='map'></div>";
    var cities = new L.LayerGroup();
    var air_heat = new L.LayerGroup();
    var gov = new L.LayerGroup();
    var restaurants = new L.LayerGroup();
    var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
        thunLink = '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = '&copy; ' + osmLink + ' Contributors',
        landUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        thunAttrib = '&copy; ' + osmLink + ' Contributors & ' + thunLink;


    var minimal = L.tileLayer(osmUrl, { attribution: osmAttrib }),
        // midnight = L.tileLayer(cmUrl, { styleId: 999, attribution: cmAttr }),
        motorways = L.tileLayer(landUrl, { attribution: thunAttrib });

    var map = L.map('map', {
        center: [23.4752, 120.4474],
        zoom: 13,
        zoomOffset: -1,
        layers: [minimal, cities],
        zoomControl: false,
        gestureHandling: true
    });
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);
    L.Control.geocoder().addTo(map);
    var baseLayers = {
        "街道圖": minimal,
        "灰階圖": motorways
    };
    var positions = [];
    world[0].forEach(function (point) {
        positions.push([point[1], point[0]]);
    });
    var scope = L.polyline(positions, { color: 'black' , opacity: 0.4 }).addTo(air_heat);
    var scope1 = L.polyline(positions, { color: 'black', opacity: 0.4  }).addTo(restaurants);
    map.fitBounds(scope.getBounds());
    map.fitBounds(scope1.getBounds());


    //根据scope边界线，生成范围信息，heatmap 計算方法
    var xlim = [scope.getBounds()._southWest.lng, scope.getBounds()._northEast.lng];
    var ylim = [scope.getBounds()._southWest.lat, scope.getBounds()._northEast.lat];
    var xlim1 = [scope1.getBounds()._southWest.lng, scope1.getBounds()._northEast.lng];
    var ylim1 = [scope1.getBounds()._southWest.lat, scope1.getBounds()._northEast.lat];

    function douglas(points){
        var K = function (a, b, c, d) {
            var a1 = document.getElementById(a);
            if (a1 != null)
                return a1;
            else {
                a = document.createElement(a);
                for (var i in c) {
                    a.style[i] = c[i];
                }

                return a;
            }
        };
        K.isArr = function (object) {
            return object && typeof object === 'object' &&
                typeof object.length === 'number' &&
                typeof object.splice === 'function' &&
                //判断length属性是否是可枚举的 对于数组 将得到false
                !(object.propertyIsEnumerable('length'));
        }

        
        var DouglasPeucker = {
            getProcessPoints: function (points, tolerance) {
                
                if (!K.isArr(points) || !points.length) { //当points不是数组或没有值时，直接返回一个空数组
                    return [];
                }
                if (points.length < 3) return points; //小于3个点时不抽稀，因为1个或2个点无法进行抽稀
                var firstPoint = 0,
                    lastPoint = points.length - 1; //取开始点与结束点的下标
                var pointIndexsToKeep = []; //保存需要点下标的数组
                pointIndexsToKeep.push(firstPoint);
                pointIndexsToKeep.push(lastPoint); //开始与结束不进行处理，直接保留
                while (points[firstPoint] == points[lastPoint]) { //处理闭合情况，闭合时，强制断开
                    lastPoint--;
                }
                this.reduce(points, firstPoint, lastPoint, tolerance, pointIndexsToKeep); //抽稀
                var resultPoints = []; //返回的点数组
                pointIndexsToKeep.sort(function (a, b) { //排序，这个可排可不排
                    return a - b;
                });
                for (var i = 0; i < pointIndexsToKeep.length; i++) {
                    resultPoints.push(points[pointIndexsToKeep[i]]);
                }
                return resultPoints;
            },
            reduce: function (points, firstPoint, lastPoint, tolerance, pointIndexsToKeep) {
                
                var maxDis = 0,
                    idxFarthest = 0; //定义最大长度及最远点的下标
                for (var i = firstPoint, dis; i < lastPoint; i++) {
                    dis = this.perpendicularDistance(points[firstPoint], points[lastPoint], points[i]); //获取当前点到起点与
                    if (dis > maxDis) { //保存最远距离
                        maxDis = dis;
                        idxFarthest = i;
                    }
                }
                if (maxDis > tolerance && idxFarthest != 0) { //如果最远距离大于临界值
                    pointIndexsToKeep.push(idxFarthest);
                    this.reduce(points, firstPoint, idxFarthest, tolerance, pointIndexsToKeep);
                    this.reduce(points, idxFarthest, lastPoint, tolerance, pointIndexsToKeep);
                }
            },
            perpendicularDistance: function (beginPoint, endPoint, comparePoint) {
                var area = Math.abs(0.5 * (beginPoint.x * endPoint.y + endPoint.x * comparePoint.y + comparePoint.x * beginPoint.y -
                    endPoint.x * beginPoint.y - comparePoint.x * endPoint.y - beginPoint.x * comparePoint.y));
                var bottom = Math.sqrt(Math.pow(beginPoint.x - endPoint.x, 2) + Math.pow(beginPoint.y - endPoint.y, 2));
                var height = area / bottom * 2;
                return height;
            }
        };
        // Helper.renderPointsTo(DouglasPeucker.getProcessPoints(points, 14), 'processAfter');
        var point2 =DouglasPeucker.getProcessPoints(points, 0.017);
        // console.log(point2);

        return point2;
    }

    //进行克里金插值
    function loadkriging() {

        $.getJSON('geo.php', function (points) {

            var canvas = document.getElementById("canvasMap");
            canvas.width = 1000;
            canvas.height = 1000;
            var n = points.length;

            var t = [];//数值
            var x = [];//经度
            var y = [];//纬度

            for (var i = 0; i < n; i++) {
                t.push(points[i].attributes.TN_);
                x.push(points[i].geometry.x);
                y.push(points[i].geometry.y);
            }
            var muti = 0.6;
            //对数据集进行训练
            var variogram = kriging.train(t, x, y, "exponential", 0, 350);

            //使用variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值,最后一个参数，是插值格点精度大小
            var grid = kriging.grid(world, variogram, (ylim[1] - ylim[0]) / 180);
            // console.log(grid);

            var colors = ["#99CC00", "#A3D100", "#ADD600", "#B8DB00", "#C2E000", "#CCE600", "#D6EB00", "#E0F000", "#EBF500", "#F5FA00", "#FFFF00", "#FFF500", "#FFEB00", "#FFE000", "#FFD600", "#FFCC00", "#FFC200", "#FFB800", "#FFAD00", "#FFA300", "#FF9900", "#FF8A00", "#FF7A00", "#FF6B00", "#FF5C00", "#FF4D00", "#FF3D00", "#FF2E00", "#FF1F00", "#FF0F00", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000s", "#9900FF"];

            kriging.plot(canvas, grid, [xlim[0], xlim[1]], [ylim[0], ylim[1]], colors, muti);
            var imageBounds = [[ylim[0], xlim[0]], [ylim[1], xlim[1]]];
            // console.log(imageBounds);
            L.imageOverlay(returnImgae(), imageBounds, { opacity: 0.6 }).addTo(air_heat);
        });

        $.getJSON('cov.php', function (points) {

            var point2 = douglas(points);
            // var point2=points;
            var canvas = document.getElementById("canvasMap");
            canvas.width = 1000;
            canvas.height = 1000;
            var n = point2.length;
            // console.log(point2);
            var t = [];//数值
            var x = [];//经度
            var y = [];//纬度
            
            for (var i = 0; i < n; i++) {
                t.push(point2[i].value);
                x.push(point2[i].x);
                y.push(point2[i].y);
            }


            //对数据集进行训练
            var variogram = kriging.train(t, x, y, "exponential", 0, 350);

            //使用variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值,最后一个参数，是插值格点精度大小
            var grid = kriging.grid(world, variogram, (ylim1[1] - ylim1[0]) / 180);
            var multi = 0.58;

            var colors = ["#99CC00", "#A3D100", "#ADD600", "#B8DB00", "#C2E000", "#CCE600", "#D6EB00", "#E0F000", "#EBF500", "#F5FA00", "#FFFF00", "#FFF500", "#FFEB00", "#FFE000", "#FFD600", "#FFCC00", "#FFC200", "#FFB800", "#FFAD00", "#FFA300", "#FF9900", "#FF8A00", "#FF7A00", "#FF6B00", "#FF5C00", "#FF4D00", "#FF3D00", "#FF2E00", "#FF1F00", "#FF0F00", "#FF0000", "#F5001A", "#EB0033", "#E0004D", "#D60066", "#CC0080", "#C20099", "#B800B3", "#AD00CC", "#A300E6", "#9900FF"];
            // console.log(grid);
            kriging.plot(canvas, grid, [xlim1[0], xlim1[1]], [ylim1[0], ylim1[1]], colors, multi);
            var imageBounds = [[ylim1[0], xlim1[0]], [ylim1[1], xlim1[1]]];
            // console.log(imageBounds);
            L.imageOverlay(returnImgae(), imageBounds, { opacity: 0.6 }).addTo(restaurants);
        });

    }
    //将canvas对象转换成image的URL
    function returnImgae() {
        var mycanvas = document.getElementById("canvasMap");
        return mycanvas.toDataURL("image/png");
    }

    loadkriging();
    // Overlay layers are grouped
    var groupedOverlays = {
        "顯示測站": {
            "空氣盒子": cities,
            "微型感測器": gov,
        },
        "熱力圖":{
            "空氣盒子": air_heat,
            "微型感測器": restaurants,
        }
    };
    // 判斷熱力圖呈現是否互斥
    map.on('overlayadd', function(eo) {
        if (eo.group.name ===  "熱力圖" && eo.name ==='微型感測器' ) {
            // console.log(eo.group.id);
          setTimeout(function() {
            map.removeLayer(air_heat)
          }, 10);
        } else if (eo.group.name ===  "熱力圖" &&eo.name === '空氣盒子') {
            // console.log(eo.group);
          setTimeout(function() {
            map.removeLayer(restaurants)
          }, 10);
        }
      });
      //空氣盒子測站地理位置
    $.getJSON('geojson.php', function (geojson) {
        // console.log(geojson.gps_lon)
        L.geoJson(geojson, {
            onEachFeature: onEachFeature,
            pointToLayer: createCircleMarker

        }).addTo(cities);
        light(geojson);
    });
    //政府感測器的資料
    $.getJSON('real.json', function (geojson) {
        // console.log(geojson)
        L.geoJson(geojson, {
            onEachFeature: onEachFeatureGov,
            pointToLayer: createCircleGov,
        }).addTo(gov);

    });

    L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);

    var command = new L.control({
        position: 'bottomleft'
    });

    command.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info_legend', document.getElementById("legend-container"));
        div.innerHTML = "" +
            "<div class='legend-title'>空氣品質</div>" +
            "<div class='legend-scale'>" +
            "<ul class='legend-labels flex-column'>" +
            "<li><span style='background:#8B0A50; color:white;'>>250.5</span>危害</li>" +

            "<li><span style='background:#9932CC;color:white;'>250.4</span>非常不健康</li>" +

            "<li><span style='background:#FF0000;color:white;'>150.5</span>不健康</li>" +

            "<li><span style='background:#FF7F00;color:white;'>54.5</span>易敏感</li>" +

            "<li><span style='background:#FFFF00;color:black;'>35.5</span>普通</li>" +

            "<li><span style='background:#00FF00;color:black;'><15.5</span>良</li>" +
            "<li><span style='background:black;color:white;'>NaN</span>無數據</li>" +

            "</ul>" +
            "</div>";
        return div;
    };
    command.addTo(map);

}


$(document).ready(function () {


    $("#dynamic").click(function () {
        // if (map != undefined) { map.remove(); }
        if (this.map) {
            this.map.remove();
        }
        document.getElementById('weathermap').innerHTML = "<div id='map'></div>";
        var endDate = new Date();
        endDate.setUTCMinutes(0, 0, 0);
        map = new L.map('map', {
            fullscreenControl: true,
            timeDimensionControl: true,
            timeDimensionOptions: {
                timeInterval: "P2W/" + endDate.toISOString(),
            },
            timeDimensionControlOptions: {
                timeZones: ["Local"],
                loopButton: true,
                playerOptions: {
                    buffer: 0,
                    transitionTime: 250,
                    loop: true,
                }
            },
            timeDimension: true,
            center: [23.4752, 120.4574],
            zoom: 13,
            // layers: [minimal, id],
            zoomControl: false,
            gestureHandling: true
        });
        var zoomHome = L.Control.zoomHome();
        zoomHome.addTo(map);

        $.getJSON('showhour.php', function (geojson) {
            var geoJsonLayer = L.geoJson(geojson, {
                onEachFeature: onEachTimeFeature,
                pointToLayer: createTimeCircleMarker
            });
            map.fitBounds(geoJsonLayer.getBounds());
            var geoJsonTimeLayer = L.timeDimension.layer.geoJson(geoJsonLayer, {
                updateTimeDimension: true,
                updateTimeDimensionMode: 'replace',
                duration: 'PT5M',
            });
            geoJsonTimeLayer.addTo(map);
        });
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',

        }).addTo(map);

        var command = new L.control({
            position: 'bottomright'
        });

        command.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info_legend', document.getElementById("legend-container"));

            div.innerHTML = "" +
                "<div class='legend-title'>空氣品質</div>" +
                "<div class='legend-scale'>" +
                "<ul class='legend-labels flex-column'>" +
                "<li><span style='background:#8B0A50; color:white;'>>250.5</span>危害</li>" +

                "<li><span style='background:#9932CC;color:white;'>250.4</span>非常不健康</li>" +

                "<li><span style='background:#FF0000;color:white;'>150.5</span>不健康</li>" +

                "<li><span style='background:#FF7F00;color:white;'>54.5</span>易敏感</li>" +

                "<li><span style='background:#FFFF00;color:black;'>35.5</span>普通</li>" +

                "<li><span style='background:#00FF00;color:black;'><15.5</span>良</li>" +
                "<li><span style='background:black;color:white;'>NaN</span>無數據</li>" +

                "</ul>" +
                "</div>";
            return div;
        };
        command.addTo(map);

    });
    $("#static").click(function () {
        // map.off();
        // if (map != undefined) { map.remove(); }
        if (this.map) {
            this.map.remove();
        }
        document.getElementById('weathermap').innerHTML = "<div id='map'></div>";

        init();

    });
    init();
});
 //跑馬燈
function light(data) {
    var bye = cal();
    var msg = "";
    var msg1 = "",msg2="";
    var station = [];

        var perfect = 0, good = 0, sen = 0, nothealth = 0, varynot = 0, die = 0, nodata = 0;

        // console.log((data.length));
        for (var i = 0; i < data.length; i++) {
            var apoche = parseFloat(data[i]["properties"]["pm25"]);
            //console.log(apoche);
            if (apoche >= 0 && apoche < 15.4) { perfect++; }
            else if (apoche < 35.5 && apoche >= 15.4) { good++; }
            else if (apoche < 54.5 && apoche >= 35.4) { sen++; }
            else if (apoche < 150.5 && apoche >= 54.4) { nothealth++; }
            else if (apoche < 250.5 && apoche >= 150.4) { varynot++; }
            else if (apoche >= 250.5) { die++; }
            else if (apoche == -1) { nodata++; }
            if (apoche >= 54.4) {
                var name = data[i]["properties"]["station"];

                if (name == '嘉義市民族國小') name = 'school-1';
                else if (name == '嘉義市立民族國小') name = 'school-2';
                else if (name == 'mtes601') name = '601-1';
                else if (name == 'MTES') name = '601-2';
                else if (name == 'mtes 603' ) name = '603';
                else if (name == 'mtes604') name = '604';
                else if (name == 'mtes602') name = '602';

                station.push(name);
            }
        }

        msg1 = "空氣盒子&nbsp&nbsp現在優良測站共&nbsp&nbsp" + perfect + "&nbsp處&nbsp&nbsp||&nbsp&nbsp" + "普通等級共&nbsp&nbsp" + good + "&nbsp處&nbsp&nbsp";
        if (sen > 0) {
            msg1 += "||&nbsp&nbsp易敏感等級共&nbsp&nbsp" + sen + "&nbsp處&nbsp&nbsp";
        }
        if (nothealth > 0) {
            msg1 += "||&nbsp&nbsp不健康等級共&nbsp&nbsp" + nothealth + "&nbsp處&nbsp&nbsp";
        }
        if (varynot > 0) {
            msg1 += "||&nbsp&nbsp非常不健康等級共&nbsp&nbsp" + varynot + "&nbsp處&nbsp&nbsp";
        }
        if (die > 0) {
            msg1 += "||&nbsp&nbsp危害等級共&nbsp&nbsp" + die + "&nbsp處&nbsp&nbsp";
        }

    if (bye ==1) {
        msg = "附近有寺廟者 &nbsp&nbsp 小心空汙";
    }
    if (station!=""){
        msg2="測站濃度較不健康&nbsp:&nbsp&nbsp"+station;
    }
    // console.log(station);
    document.getElementById("Hday").innerHTML = msg;
    document.getElementById("dection").innerHTML = msg1;
    document.getElementById("where_station").innerHTML = msg2;


}
//農曆判斷
function cal() {
    var sWeek = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var dNow = new Date();
    var CalendarData = new Array(100); var madd = new Array(12); var tgString = "甲乙丙丁戊己庚辛壬癸"; var dzString = "子丑寅卯辰巳午未申酉戌亥"; var numString = "一二三四五六七八九十"; var monString = "正二三四五六七八九十冬腊"; var weekString = "日一二三四五六"; var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪"; var cYear, cMonth, cDay, TheDate;
    CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B,
        0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
        0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
    madd[0] = 0; madd[1] = 31; madd[2] = 59; madd[3] = 90;
    madd[4] = 120; madd[5] = 151; madd[6] = 181; madd[7] = 212;
    madd[8] = 243; madd[9] = 273; madd[10] = 304; madd[11] = 334;
    function GetBit(m, n) { return (m >> n) & 1; }
    function e2c() {
        TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
        var total, m, n, k;
        var isEnd = false;
        var tmp = TheDate.getFullYear();
        total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38; if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) { total++; } for (m = 0; ; m++) { k = (CalendarData[m] < 0xfff) ? 11 : 12; for (n = k; n >= 0; n--) { if (total <= 29 + GetBit(CalendarData[m], n)) { isEnd = true; break; } total = total - 29 - GetBit(CalendarData[m], n); } if (isEnd) break; } cYear = 1921 + m; cMonth = k - n + 1; cDay = total; if (k == 12) { if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) { cMonth = 1 - cMonth; } if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) { cMonth--; } }
    }
    function GetcDateString() {
        var tmp = ""; tmp += tgString.charAt((cYear - 4) % 10);
        tmp += dzString.charAt((cYear - 4) % 12);
        tmp += "年 ";
        if (cMonth < 1) { tmp += "(闰)"; tmp += monString.charAt(-cMonth - 1); } else { tmp += monString.charAt(cMonth - 1); } tmp += "月"; tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
        if (cDay % 10 != 0 || cDay == 10) { tmp += numString.charAt((cDay - 1) % 10); } return tmp;
    }
    function GetLunarDay(solarYear, solarMonth, solarDay) {
        if (solarYear < 1921 || solarYear > 2020) {
            return "";
        } else { solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11; e2c(solarYear, solarMonth, solarDay); return GetcDateString(); }
    }
    var D = new Date();
    var yy = D.getFullYear();
    var mm = D.getMonth() + 1;
    var dd = D.getDate();
    var ww = D.getDay();
    var ss = parseInt(D.getTime() / 1000);
    function getFullYear(d) {// 修正firefox下year错误
        yr = d.getYear(); if (yr < 1000)
            yr += 1900; return yr;
    }
    function showDate() {
        var sValue = getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月" + dNow.getDate() + "日" + " " + sWeek[dNow.getDay()] + " ";
        sValue += GetLunarDay(yy, mm, dd);
        if ((sValue.search("初一") != -1) == true || ((sValue.search("初十五") != -1) == true)) {
            holiday = "1"; //拜拜

        } else {
            holiday = "2";
        }
        return holiday;
    };
    // window.onload = showDate;
    var ans = showDate();
    // console.log(ans);
    return ans;
}


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


function onEachFeature(feature, layer) {
    // $("#container").empty();
    Highcharts.setOptions({ global: { useUTC: false } });
    var day;
    var air = feature.properties.pm25;
    var hum = feature.properties.hum;
    var tem = feature.properties.tem;
    if (air == -999) {
        air = "NaN";
    }
    if (hum == -999) {
        hum = "NaN";
    }
    if (tem == -999) {
        tem = "NaN";
    }
    var name = feature.properties.station;
    if (name == '嘉義市民族國小') name = 'school-1';
    else if (name == '嘉義市立民族國小') name = 'school-2';
    else if (name == 'mtes601') name = '601-1';
    else if (name == 'MTES') name = '601-2';
    else if (name == 'mtes 603' ) name = '603';
    else if (name == 'mtes604') name = '604';
    else if (name == 'mtes602') name = '602';

    var popupContent = '<p style="font-size:130%;"><i class="fas fa-street-view"></i>&emsp;' + name + "<br>PM2.5: " + air + " μg/m<sup>3</sup> || 氣溫: " + tem + " ˚C || 濕度: " + hum + " %" + '</p><div class="d-flex"> <button class="day-button"style="min-width:105px;margin-bottom:5px;">近24小時</button>  <button class="week-button"style="min-width:105px;margin-bottom:5px; margin-left:0.25em;">近7天</button> <button class="mon-button "style="min-width:105px;margin-left:0.25em; margin-bottom:5px ;">近30天</button></div>' + '<p><div id="container" style="min-width: 200px; height: 200px; margin: 0 auto">請選擇時間</div> </p> ';
    // <p> ' + feature.properties.pm25 + '</p>
    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    var id_device = feature.properties.device_id;
    layer.bindPopup(popupContent, { minWidth: 340 ,autoClose:true}).on("popupopen", function(e) {
// console.log(e.target._popup)
        var chart = null;

            show24hr(id_device);
        $(".week-button").on("click", e => {
            e.preventDefault();
            var chart = null;
            showmsg(id_device, 7);
        });
        $(".mon-button").on("click", e => {
            e.preventDefault();
            var chart = null;
            showmsg(id_device, 30);
        });
        $(".day-button ").on("click", e => {
            e.preventDefault();
            var chart = null;
            show24hr(id_device);

        });

    });

    // layer.on('click', onClick);

}
//缺失值畫點圖，實際值畫實線
function dotline(data) {
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
//24 小時內的資料
function show24hr(station) {
    // console.log("!!!!");
    var ob = [];
    var json_hour = "http://163.27.46.1/airanalysis/air/modify/" + station + ".csv";
    var count_nul = 0;
    // 获取 CSV 数据并初始化图表
    d3.csv(json_hour, function (error, result) {
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key.replace(/\-/g,"/")).getTime();
            return Math.floor(epoch_seconds);
        }
        for (var i = 0; i < result.length; i++) {
            // get date and miles
            var apoche = date_to_epoch(result[i]['Date']).toString();
            apoche = parseFloat(apoche);
            // console.log(new Date(result[i]['Date'].replace(/\-/g,"/")).getTime());
            if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                count_nul++;
            } else {
                var miles = parseFloat(result[i]['PM2.5']);

            }
            ob.push([apoche, miles]);
        }

        if (count_nul >= 24) {
            $("#container").text("近期無資料");
        }
        else {
            // console.log((ob));
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'line'
                },
                title: { text: '' },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%Y<br/>%m%d',
                        week: '%Y<br/>%m-%d',
                        month: '%Y<br/>%m',
                        year: '%Y'
                    }
                    , crosshair: true,
                },
                tooltip: {
                    split: false,
                    shared: true,
                    animation: true,
                    xDateFormat: '%Y-%m-%d %H時',
                    valueSuffix: ' μg/m³'
                },
                yAxis: {
                    title: {
                        text: ''
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
                series: [{
                    name: "PM2.5",
                    data: ob,
                    showInLegend: true,
                    zoneAxis: 'x',
                    connectNulls: true,
                    zones: dotline(ob), //判斷虛線還是實線
                }
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
                    series: {
                        events: {
                            legendItemClick: function () {
                                // return false 即可禁止图例点击响应
                                return false;
                            }
                        }
                    }
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 330
                        },

                    }]
                }
            });
        }
    });

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

function showmsg(station, d) {
    var count_nul = 0, ob = [];
    // console.log(station,d);
    $.ajax({
        type: 'POST',
        url: 'http://163.27.46.1/airanalysis/leaflet_line.php',
        data: {
            "day": d,
            "device": station
        },
        success: function (data) {
            // console.log(data);
            var modify = data.indexOf('[');
            var show = data.substring(modify);
            if (typeof show === 'string') {
                show = JSON.parse(show);
            }
            var after = [], tmp;
            for (var i = 0; i < show.length; i++) {
                var apoche = parseFloat(show[i][0]);
                tmp = parseFloat(show[i][1]);
                if (parseFloat(show[i][1]).toString() == 'NaN') {
                    count_nul++;
                }
                after.push([apoche, tmp]);
            }

            if (count_nul >= d) {
                $("#container").text("近期無資料");
            }
            else {

                // show = change(show);
                // console.log(typeof (show));
                // console.log(show);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
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
                    yAxis: {
                        title: {
                            text: ''
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

                    series: [{
                        name: "pm25",
                        data: after,
                        showInLegend: true,
                        zoneAxis: 'x',
                        connectNulls: true,
                        zones: dotline(after), //判斷虛線還是實線
                    }
                    ],
                    tooltip: {
                        split: false,
                        shared: true,
                        animation: true,
                        xDateFormat: '%Y-%m-%d',
                        valueSuffix: ' μg/m³'
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
                        series: {
                            events: {
                                legendItemClick: function () {
                                    // return false 即可禁止图例点击响应
                                    return false;
                                }
                            }
                        }

                    },

                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 330
                            },

                        }]
                    }
                });
            }
        }, error: function (msg) {
            $("#container").text("系統忙線中...");
        }

    });


}

function createCircleMarker(feature, latlng) {
    // Change the values of these options to change the symbol's appearance

    var pm25 = feature.properties.pm25;
    var color;
    if (pm25 < 15.5 && pm25 >= 0) { color = "#00FF00"; }
    else if (pm25 < 35.5 && pm25 >= 15.5) { color = "#FFFF00"; }
    else if (pm25 < 54.5 && pm25 >= 35.5) { color = "#FF7F00"; }
    else if (pm25 < 150.5 && pm25 >= 54.4) { color = "#FF0000"; }
    else if (pm25 < 250.5 && pm25 >= 150.5) { color = "#9932CC"; }
    else if (pm25 >= 250.5) { color = "#8B0A50"; }
    else if (pm25 == -1) {
        color = "black";
    }
    let options = {
        radius: 8,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    return new L.circleMarker(latlng, options);
}

function createCircleGov(feature, latlng) {
    // Change the values of these options to change the symbol's appearance

    var pm25 = feature.properties.pm25;
    var color;
    if (pm25 < 15.5 && pm25 >= 0) { color = "#00FF00"; }
    else if (pm25 < 35.5 && pm25 >= 15.5) { color = "#FFFF00"; }
    else if (pm25 < 54.5 && pm25 >= 35.5) { color = "#FF7F00"; }
    else if (pm25 < 150.5 && pm25 >= 54.4) { color = "#FF0000"; }
    else if (pm25 < 250.5 && pm25 >= 150.5) { color = "#9932CC"; }
    else if (pm25 >= 250.5) { color = "#8B0A50"; }
    else if (pm25 == -1) {
        color = "black";
    }

    return new L.shapeMarker(latlng, {
        fillColor: color,
        fillOpacity: 0.9,
        color: "black",
        weight: 2,
        shape: "triangle",
        radius: 9
    });
}

function onEachFeatureGov(feature, layer) {
    Highcharts.setOptions({ global: { useUTC: false } });

    var air = feature.properties.pm25;
    var popupContent = '<p style="font-size:130%;"><i class="fas fa-street-view"></i>&emsp;' +feature.properties.locationId + "<br>PM2.5: " + air + " μg/m<sup>3</sup>  " + '</p><div class="d-flex"> <button class="day-button"style="min-width:105px;margin-bottom:5px;">近24小時</button>  <button class="week-button"style="min-width:105px;margin-bottom:5px;margin-left:0.25em;">近7天</button> <button class="mon-button "style="min-width:105px; margin-bottom:5px ;;margin-left:0.25em;">近30天</button></div>' + '</p><div id="container" style="min-width: 200px; height: 190px; margin: 0 auto"></div> <p> ';
    // <p> ' + feature.properties.pm25 + '</p>
    var id1 = feature.properties.station;
    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    // layer.bindPopup(popupContent);
    layer.bindPopup(popupContent, { minWidth: 370 }).on("popupopen", () => {

        Highcharts.setOptions({ global: { useUTC: false } });
        var chart = null;
        showgov24hr(id1);

        $(".week-button").on("click", e => {
            e.preventDefault();
            var chart = null;
            showgovmsg(id1, 7);
        });
        $(".mon-button").on("click", e => {
            e.preventDefault();
             var chart = null;

            showgovmsg(id1, 30);
        });
        $(".day-button ").on("click", e => {
            e.preventDefault();
            var chart = null;
            showgov24hr(id1);

        });
    });
}

function onEachTimeFeature(feature, layer) {
    var popupContent = "<br> 測站名稱 : " + feature.properties.che_name + "<br> PM2.5: " + feature.properties.pm25 + " μg/m3<br> 氣溫: " + feature.properties.tem + " ˚C<br> 濕度: " + feature.properties.hum + " %";
    var popupContent2 = '<p style="font-size:130%;">' + feature.properties.name + '<div class="d-flex1"> <button class="day-button" style="min-width: 120px;">24 hr</button>   <button class="week-button" style="min-width: 120px;">7 Days</button> <button class="week-button style="min-width: 120px;">30 Days</button></div>' + '</p><div id="container" style="min-width: 350px; height: 190px; margin: 0 auto"></div> <p> ' + feature.properties.pm25 + '</p>';
    layer.bindPopup(popupContent);

    layer.on('mouseover', function (e) {
        this.openPopup();
    });
    layer.on('mouseout', function (e) {
        this.closePopup();
    });
}

function showgov24hr(station) {
    var ob = [];
    var json_hour = "http://163.27.46.1/airanalysis/compare/data/" + station + ".csv";
    // console.log(json_hour);
    var count_nul = 0;
    // 获取 CSV 数据并初始化图表
    d3.csv(json_hour, function (error, result) {
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key.replace(/\-/g,"/")).getTime();
            return Math.floor(epoch_seconds);
        }
        var len = result.length;
        for (var i = len - 24; i <len ; i++) {

            // get date and miles
            var apoche = date_to_epoch(result[i]['time']).toString();
            apoche = parseFloat(apoche);
            //console.log(apoche);
            if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                count_nul++;
            } else {
                var miles = parseFloat(result[i]['PM2.5']);
            }
            ob.push([apoche, miles]);
        }
        // console.log(ob);

        if (count_nul >= 24) {
            $("#container").text("近期無資料");
        }
        else {
            // console.log((ob));
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'line'
                },
                title: { text: '' },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%Y<br/>%m%d',
                        week: '%Y<br/>%m-%d',
                        month: '%Y<br/>%m',
                        year: '%Y'
                    }
                    , crosshair: true,
                },
                tooltip: {
                    split: false,
                    shared: true,
                    animation: true,
                    xDateFormat: '%Y-%m-%d %H:%M',
                    valueSuffix: ' μg/m³'
                },
                yAxis: {
                    title: {
                        text: ''
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
                series: [{
                    name: "PM2.5",
                    data: ob,
                    showInLegend: true,
                    zoneAxis: 'x',
                    connectNulls: true,
                    zones: dotline(ob), //判斷虛線還是實線
                }
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
                    series: {
                        events: {
                            legendItemClick: function () {
                                // return false 即可禁止图例点击响应
                                return false;
                            }
                        }
                    }

                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 330
                        },

                    }]
                }
            });
        }
    });

}
function showgovmsg(station, d) {
    var ob = [];
    var json_hour = "http://163.27.46.1/airanalysis/compare/day/" + station + ".csv";
    // console.log(json_hour);
    var count_nul = 0;
    // 获取 CSV 数据并初始化图表
    d3.csv(json_hour, function (error, result) {
        function date_to_epoch(key) {
            var epoch_seconds = new Date(key.replace(/\-/g,"/")).getTime();
            // console.log(epoch_seconds);
            return Math.floor(epoch_seconds);
        }
        var len = result.length;
        for (var i = len - d; i <len ; i++) {
            // get date and miles
            var apoche = date_to_epoch(result[i]['time']).toString();
            apoche = parseFloat(apoche);
            // console.log(result[i]['time']);
            if (parseFloat(result[i]['PM2.5']).toString() == 'NaN') {
                count_nul++;
            } else {
                var miles = parseFloat(result[i]['PM2.5']);

            }
            ob.push([apoche, miles]);
        }
        // console.log(ob);

        if (count_nul >= d) {
            $("#container").text("近期無資料");
        }
        else {
            // console.log((ob));
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'line'
                },
                title: { text: '' },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%Y<br/>%m%d',
                        week: '%Y<br/>%m-%d',
                        month: '%Y<br/>%m',
                        year: '%Y'
                    }
                    , crosshair: true,
                },
                tooltip: {
                    split: false,
                    shared: true,
                    animation: true,
                    xDateFormat: '%Y-%m-%d',
                    valueSuffix: ' μg/m³'
                },

                yAxis: {
                    title: {
                        text: ''
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
                series: [{
                    name: "PM2.5",
                    data: ob,
                    showInLegend: true,
                    zoneAxis: 'x',
                    connectNulls: true,
                    zones: dotline(ob), //判斷虛線還是實線
                }
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
                    series: {
                        events: {
                            legendItemClick: function () {
                                // return false 即可禁止图例点击响应
                                return false;
                            }
                        }
                    }

                },

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 330
                        },

                    }]
                }
            });
        }
    });

}
function createTimeCircleMarker(feature, latlng) {
    // Change the values of these options to change the symbol's appearance

    var pm25 = feature.properties.pm25;
    // console.log(feature.properties.time);
    var color, fill_color;
    var Opacity;
    if (pm25 < 15.5 && pm25 >= 0) { color = "black"; fill_color = "#00FF00"; Opacity = 0.8; }
    else if (pm25 < 35.5 && pm25 >= 15.5) { color = "black";  fill_color = "#FFFF00"; Opacity = 0.8;}
    else if (pm25 < 54.5 && pm25 >= 35.5) { color = "black";fill_color = "#FF7F00"; Opacity = 0.8;  }
    else if (pm25 < 150.5 && pm25 >= 54.4) { color = "black"; fill_color = "#FF0000"; Opacity = 0.8;}
    else if (pm25 < 250.5 && pm25 >= 150.5) { fill_color = "#9932CC"; Opacity = 0.8; color = "black"; }
    else if (pm25 >= 250.5) {  fill_color = "#8B0A50"; Opacity = 0.8; color = "black"; }
    else if (pm25 == "NaN") {
        fill_color = "black"; Opacity = 0.8; color = "white";
    }

    let options = {
        radius: 9,
        fillColor: fill_color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: Opacity,

    }


    return L.circleMarker(latlng, options);
}
