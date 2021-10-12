<?php
$isNext = True;
$expand="expand";
$a = "$";
$url ="https://sta.ci.taiwan.gov.tw/STA_AirQuality_EPAIoT/v1.0/Datastreams?".$a."expand=Thing,Observations(".$a."orderby=phenomenonTime%20desc;".$a."top=1)&".$a."filter=Thing/properties/city%20eq%20%27%E5%98%89%E7%BE%A9%E5%B8%82%27%20and%20name%20eq%27PM2.5%27&".$a."count=true";
$index = array();
$geojson = array();
// $start_time2 = microtime(true);
// sleep(2); 
while ($isNext){
    $handle = fopen($url,"rb");
    $content = "";
    while (!feof($handle)) {
        $content .= fread($handle, 10000);
    }
    fclose($handle);
    $content = json_decode($content,true);
   
    if (isset($content['@iot.nextLink'])){
        $url=$content['@iot.nextLink'];
        //   echo($url);
    }
    else { $isNext = false; }
    for ($i = 0;$i <count($content['value']);$i++){
        // $kind = $content['value'][$i]['name'];
        // if ($kind == "PM2.5"){
            if (isset($content['value'][$i]['observedArea'])){
                $lon = $content['value'][$i]['observedArea']['coordinates'][0];
                $lat = $content['value'][$i]['observedArea']['coordinates'][1];
                $nodata =$content['value'][$i]['Observations'];
                $station =$content['value'][$i]['Thing']['properties']['stationID'];
                $area =$content['value'][$i]['Thing']['properties']['areaDescription'];
                
                if (count($nodata) !=0){  $pm = $content['value'][$i]['Observations'][0]['result'];}
                else $pm=0;
                $id = $content['value'][$i]['Thing']['properties']['locationId'];
                $feature = array(
                'type' => 'Feature',
                'geometry' => array(
                    'type' => 'Point',
                    'coordinates' => array($lon,$lat)
                ),
                'properties' => array (
                    'pm25' => $pm,
                    'id' => $id,
                    "station" =>$station,
                    // "area" => $area
                )

                // $feature = array ( $lat,$lon ,$pm);
                );
                array_push($geojson,$feature);
              
            }
    //     }
    }
}
// $end_time2 = microtime(true);
// echo "start_time2：".$start_time2."秒<br />";
//     echo "end_time2：".$end_time2."秒<br />";
//     $time_total2 = $end_time2 - $start_time2;
//     echo "設定值為sleep(2)，執行了：".$time_total2."秒";
echo json_encode($geojson);

?>