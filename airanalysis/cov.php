<?php
$isNext = True;
$expand="expand";
$a = "$";
$url ="https://sta.ci.taiwan.gov.tw/STA_AirQuality_EPAIoT/v1.0/Datastreams?".$a."expand=Thing,Observations(".$a."orderby=phenomenonTime%20desc;".$a."top=1)&".$a."filter=Thing/properties/city%20eq%20%27%E5%98%89%E7%BE%A9%E5%B8%82%27%20and%20name%20eq%27PM2.5%27&".$a."count=true";
$index = array();
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
        $kind = $content['value'][$i]['name'];
        if ($kind == "PM2.5"){
            if (isset($content['value'][$i]['observedArea'])){
                $lon = $content['value'][$i]['observedArea']['coordinates'][0];
                $lat = $content['value'][$i]['observedArea']['coordinates'][1];
                $nodata =$content['value'][$i]['Observations'];
                if (count($nodata) !=0){  $pm = $content['value'][$i]['Observations'][0]['result'];}
                else $pm=0;
               
                $feature = array (  
                 
                       
                        'x' => $lon,  //經度
                        'y'=> $lat,
                        'value' => $pm
                );
                array_push($index,$feature);
               
            }
        }
    }
}
echo json_encode($index);
