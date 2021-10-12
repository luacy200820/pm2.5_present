<?php

// $lines = gzfile('https://pm25.lass-net.org/data/last-all-airbox.json.gz');
$fp = gzopen("https://pm25.lass-net.org/data/last-all-airbox.json.gz", "r");
if ($fp) {
    $data = array();
    $arr = " ";
    $lines = gzfile('https://pm25.lass-net.org/data/last-all-airbox.json.gz');
    foreach ($lines as $line) {
        $arr = $arr . $line;
    }

$device_id = array(
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
    );
    $device_name = array('北社尾公園旁', '嘉義市宏仁女中', '維新路', '嘉義市僑平國小', 'Addison',
	'嘉義市港坪國小', '榴槤之家', '嘉義市育人國小', 'Yu室內', 'KT', '嘉義市民生國中', '永慶不動產嘉義林森店', 
	'嘉義市立大業國民中', '嘉義市輔仁中學', '嘉義市立興安國小', 'RayHome', '嘉義市宣信國小', '嘉義市東吳高職',
	'嘉義市立南興國中', '74DA38B053D8', '嘉義市-蘭潭國小', 'NCYU_EMP_01', '人文新境牙醫診所', '嘉義市文雅國小',
	'綠築山莊', '74DA38B05454', '隱居', 'Hoanya', '嘉義市大同國小', 'third brother food', '嘉義市民族國小', 
	'Motacila alba 崇文天下中庭', '嘉義市林森國民小學', '嘉義市立北興國中', 'lianghome', 'ws-air', '金龍街', 
	'嘉義市-國立嘉義高中', '崇文國小空氣盒子', '嘉義市垂楊國小', '精忠國小','仁義空氣盒子','Wenchangpark',
	'Temple','109mtes-eastmarket','mtes601','MTES','嘉義市立民族國小','mtes 603','mtes604','mtes602','mtes music');
    $a = array();
    $obj = json_decode($arr, true);

    $b = $obj["feeds"];
    $len = count($b);

    // echo gettype($len);
    for ($i = 0; $i < $len; $i++) {
        for ($j = 0; $j < count($device_id); $j++) {
            $result = $obj["feeds"][$i]['device_id'];
            if ($result == $device_id[$j]) {
                $lon = $obj["feeds"][$i]['gps_lon'];
                $lat = $obj["feeds"][$i]['gps_lat'];
                $hum = $obj["feeds"][$i]['s_h0'];
                $tem = $obj["feeds"][$i]['s_t0'];
                $pm25 = $obj["feeds"][$i]['s_d0'];
                $pm1 = $obj["feeds"][$i]['s_d2'];
                $pm10 = $obj["feeds"][$i]['s_d1'];
                $name = $device_name[$j];
                // $name = $obj["feeds"][$i]["SiteName"];
                $feature = array(
                   
                    'geometry' => array(
                       
                        'x' => $lon,  //經度
                        'y'=> $lat
                    ),
                    'attributes' => array(
                        'FID' => $name,
                        'NAME' => $result,
                        
                        'TN_' => $pm25,
                        
                    )
                );

                array_push($a, $feature);

            }
        }
    }
    $c = json_encode($a);
    echo $c;

} else {
    echo ("fail");
}
