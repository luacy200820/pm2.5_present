<?PHP
 date_default_timezone_set("Asia/Taipei");

 $device_id = array(
    '74DA38E2B4CA', '74DA38B05396', '74DA38E69B38', '74DA38C7D388', '74DA38E69E36',
    '74DA38C7CEA0', '74DA38E2B6E8', '74DA38C7CEAE', '74DA38E2B588', '74DA38AF47B0',
    '74DA38B0522C', '08BEAC028A12', '74DA38B053B2', '74DA38B053C2', '74DA38C7CEAC',
    '74DA38EBF886', '74DA38C7CEB4', '74DA38B0539E', '74DA38B05456', '74DA38C7CEA6',
    '74DA38B0535E', '74DA38E69C3C', '74DA38C7D46C', '74DA38E2B530','74DA38F6FF94',
    '74DA38E69C9E', '74DA38C7CEB6', '74DA38EBF902','74DA38C7CEC6', '74DA38E2B6FC', '74DA38C7CEA4', "74DA38B053A4", "74DA38E69E24", "74DA38E69B30", "74DA38E69CE4", "74DA38B053D6", "74DA38C7D5A2", "74DA38C7CEB8", '74DA38C7CEA8','74DA38B053BA','08BEAC028762','08BEAC028764','08BEAC028768'
);
$device_name = array('北社尾公園旁', '嘉義市宏仁女中', '維新路', '嘉義市僑平國小', 'Addison', '嘉義市港坪國小', '榴槤之家', '嘉義市育人國小', 'Yu室內', 'KT', '嘉義市民生國中', '永慶不動產嘉義林森店', '嘉義市立大業國民中', '嘉義市輔仁中學', '嘉義市立興安國小', 'RayHome', '嘉義市宣信國小', '嘉義市東吳高職', '嘉義市立南興國中', '嘉義市-蘭潭國小', 'NCYU_EMP_01', '人文新境牙醫診所', '嘉義市文雅國小', '綠築山莊', '隱居', 'Hoanya', '嘉義市大同國小', 'third brother food', '嘉義市民族國小', 'Motacila alba 崇文天下中庭', '嘉義市林森國民小學', '嘉義市立北興國中', 'lianghome', 'ws-air', '金龍街', '嘉義市-國立嘉義高中', '崇文國小空氣盒子', '嘉義市垂楊國小', '精忠國小','仁義空氣盒子','Wenchangpark','Temple','109mtes-eastmarket');
// echo count($device_id);
$geojson = array(
    "type"=>"FeatureCollection",
    "features"=>array());

for ($item = 0; $item<count($device_id);$item ++){

    $fname ="http://163.27.46.1/airanalysis/air/hour/".$device_id[$item].".csv";
    $id ="http://163.27.46.1/airanalysis/air/device.csv";

    // $geojson = array();
  
    $lon = "";
    $lat ="";
    $name ="";
    $pm = array();

    //$size=filesize($tmp)+1; 
    $fn=fopen($fname,"r");
    $id_list=fopen($id,"r");
    while($row=fgetcsv($id_list,",")){
        if ($row[0] == $device_id[$item]){
            $lon = $row[2];
            $lat = $row[3];
            $name_ch =mb_convert_encoding($row[1],"utf-8","big5");
        }  
    } 
    // echo $fname;
    fclose($id_list);
    $row_sum =0;
    $nodata =0;
    $notshow = 0;
    $number_tem = 0;
    $number_hum = 0;
    while($row=fgetcsv($fn,",")){ 
        $row_sum++;
        if (is_numeric($row[3])) {
            $number_pm = floatval($row[3]);
            if ($number_pm < 0) {
                $number_pm = 0;
            }
        } else {
            $number_pm = $row[3];
        }
        if (is_numeric($row[1])) {
            $number_hum = floatval($row[1]);
            if ($number_hum < 0) {
                $number_hum = 0;
            }
        } else {
            $number_hum = $row[1];
        }
        if (is_numeric($row[2])) {
           
            $number_tem = floatval($row[2]);
            if ($number_tem < 0) {
                $number_tem = 0;
            }
        } else {
            $number_tem = $row[2];
        }
        $epoch =(strtotime($row[0]))*1000;
        $pm[] = array(
            $epoch, $number_pm,$number_hum, $number_tem
        );

    }
    fclose($fn); 
    $con = $row_sum -24;
    // for ($i = $con;$i < $row_sum;$i++){
    //     if (!is_numeric($pm[$i][1])){
    //         $nodata ++;
    //     }
    // }
    // if ($nodata == 24) $notshow =1; //24小時都沒資料不要顯示
    // else $notshow=0;

    // if ($notshow == 0){
        for ($i = $con;$i < $row_sum;$i++){

            $feature = array(
                'type'=> 'Feature',
                'geometry' => array(
                    'type' => 'MultiPoint',
                    'coordinates' => array([$lon, $lat])
                ),
                'properties' => array(
                    'pm25'=> $pm[$i][1],
                    'time' => $pm[$i][0],
                    'che_name' => $name_ch,
                    'tem' =>$pm[$i][3],
                    'hum' =>$pm[$i][2]
                )
                );
                array_push($geojson['features'],$feature);
        }
    }
// }
header('Content-type: application/json');

echo json_encode($geojson, JSON_NUMERIC_CHECK); 

?>