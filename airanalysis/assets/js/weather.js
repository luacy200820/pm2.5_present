var openUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-229F9085-1A9D-4F17-9423-80C883849C33&locationName=%E5%98%89%E7%BE%A9%E5%B8%82";
var xhr = new XMLHttpRequest();
xhr.open('GET', openUrl, true);
xhr.onload = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            var data = JSON.parse(this.responseText);

            // document.getElementById('station').innerHTML = data.records.location[0].locationName;
            // document.getElementById('humidity').innerHTML = data.records.location[0].weatherElement[1].time[0].parameter.parameterName+"%";
            document.getElementById('temperature_low').innerHTML = data.records.location[0].weatherElement[2].time[0].parameter.parameterName + "˚C";
            // document.getElementById('temperature_high').innerHTML = data.records.location[0].weatherElement[4].time[0].parameter.parameterName+"C";

            var weather = data.records.location[0].weatherElement[0].time[0].parameter.parameterValue;
            var decr = "目前天氣 " + data.records.location[0].weatherElement[0].time[0].parameter.parameterName;
            document.getElementById("weather_dec").innerHTML = decr;
            // document.getElementById('how').innerHTML = "描述"+data.records.location[0].weatherElement[0].time[0].parameter.parameterName;
            // document.getElementById('station').innerHTML = "測站: "+data.records.location[5].locationName;                    
            // var hum =data.records.location[5].weatherElement[4].elementValue;
            // hum=hum*100;
            // document.getElementById('humidity').innerHTML = "濕度: "+ hum + "%";
            // console.log(weather);
            // console.log(decr);
            switch (weather) {
                case "1":
                    $("#img1").show();
                    break;
                case "2":
                    $("#img6").show();
                    break;
                case "3":
                    $("#img6").show();
                    break;
                case "4": case "5": case "6": case "7":
                    $("#img5").show();
                    break;
                case "8":case "16":
                    $("#img4").show();
                    break;
                case "9": case "23": case "10": case "11":
                    $("#img3").show();
                    break;            
                case "18":
                    $("#img7").show();
                    break;
                case "17":
                    $("#img3").show();
                    break;
                case "22":
                    $("#img3").show();
                    break;
                case "19": case "20": case "21":
                    $("#img4").show();
                    break;
                default:
                    $("#img1").show();
                    break;

            }
        } else {
            document.getElementById('station').innerHTML = 'error (' + 'station' + ')';
        }
    }
};
xhr.send();
