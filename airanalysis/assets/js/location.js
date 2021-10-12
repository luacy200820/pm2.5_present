//设置地图加载的初始大小
var mymap = L.map('mapid').setView([51.505, -0.09], 3);
 
//如果地图加载的初始位置就想在用户所在位置的话就设置下面这个方法
//var mymap = L.map('mapid');
// mymap.locate({
//     setView : true
// });
 
//为地图加下标信息
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
 
L.tileLayer(osmUrl,
    {foo: 'bar', attribution: osmAttrib}).addTo(mymap);
	
L.control.layers(overlays).addTo(mymap);
	
 
//添加定位的control
mymap.addControl(L.control.locate({
    locateOptions: {
        enableHighAccuracy: true //说是精准定位，但其实我觉得没差
    },
    strings: {
        title: "Show me where I am, yo!"
    }
}));
