$(document).ready(function () {
    $("#cal_heatmap").click(function () {
        sendValue();
    });
    $("#info_east").click(function(){
      $("html,body").animate({scrollTop: $("#east").offset().top}, 500);
    });
    $("#info_west").click(function(){
      $("html,body").animate({scrollTop: $("#west").offset().top}, 500);
    });
    $("#back_home").click(function(){
      $("html,body").animate({scrollTop: $("#header").offset().top}, 500);
    });
  //   $(".btn_down").click(function () {
  //     downloadFile("http://localhost/a/hour/08BEAC028A12.csv");
  // });
    $(window).scroll(function () {
     
      var window_scroll = $(window).scrollTop();
      if ( window_scroll != 0) {
        document.getElementById('back_home').style.display = 'block';
    }
    else document.getElementById('back_home').style.display = 'none';
  
    });
})
function sendValue(){
    new_open=window.open("show.html","_blank");
  
}
function mon(name){

    location.href="show.html?"+"cal_heatmap="+encodeURI(name);
}
function hour(name){

    location.href="show_hour.html?"+"cal_heatmap="+encodeURI(name);
}
 
function downloadFile(filePath) {
  filePath = "http://163.27.46.1/airanalysis/air/hour/"+filePath+".csv";
  var xmlhttp;
  if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();//其他浏览器    
  }
  else if (window.ActiveXObject) {
      try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");//旧版IE    
      }
      catch (e) { }
      try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");//新版IE    
      }
      catch (e) { }
      if (!xmlhttp) {
          window.alert("不能創建XMLHttpRequest對象");
      }
  }
  yourFileURL = filePath;
  xmlhttp.open("GET", yourFileURL, false);
  xmlhttp.send();
  if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
          var link = document.createElement('a');
          link.href = filePath;
          link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
          link.click();
      }
  }
  else
      alert("文件不存在"); //url不存在     


}
(function(document) { //快速搜尋
    'use strict';
  
    // 建立 LightTableFilter
    var LightTableFilter = (function(Arr) {
  
      var _input;
  
      // 資料輸入事件處理函數
      function _onInputEvent(e) {
        _input = e.target;
        var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
        Arr.forEach.call(tables, function(table) {
          Arr.forEach.call(table.tBodies, function(tbody) {
            Arr.forEach.call(tbody.rows, _filter);
          });
        });
      }
  
      // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
      function _filter(row) {
        var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
        row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
      }
  
      return {
        // 初始化函數
        init: function() {
          var inputs = document.getElementsByClassName('light-table-filter');
          Arr.forEach.call(inputs, function(input) {
            input.oninput = _onInputEvent;
          });
        }
      };
    })(Array.prototype);
  
    // 網頁載入完成後，啟動 LightTableFilter
    document.addEventListener('readystatechange', function() {
      if (document.readyState === 'complete') {
        LightTableFilter.init();
      }
    });
  
  })(document);