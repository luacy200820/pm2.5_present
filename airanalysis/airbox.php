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
        "08BEAC028768", "74DA38EBF902", "08BEAC028764", "08BEAC028762", "74DA38C7CEC6"
    );
    $device_name = array("東市場大樓", "三哥肉鬆", "孔子廟", "文昌公園", "民族國小");
    $a = array();
    $obj = json_decode($arr, true);

    $b = $obj["feeds"];
    $len = count($b);
    $have = array();
    // echo gettype($len);
    for ($i = 0; $i < $len; $i++) {
        for ($j = 0; $j < count($device_id); $j++) {
            $result = $obj["feeds"][$i]['device_id'];
            if ($result == $device_id[$j]) {
                array_push($have, $result);
                $pm25 = $obj["feeds"][$i]['s_d0'];
                $name = $device_name[$j];
                if ($pm25 <= 0) {
                    $pm25 = 0;
                }
                // $datetime = date ("Y-m-d H:i:s" , mktime(date('H')+6, date('i'), date('s'), date('m'), date('d'), date('Y'))) ;
                date_default_timezone_set("Asia/Shanghai");
                // echo "当前时间是 " . date("h:i:sa");
                $datetime = date("Y-m-d H:i:s");
                // $name = $obj["feeds"][$i]["SiteName"];
                $feature = array(
                    "type"=> "Feature",
                    "properties"=> array(
                       " device_id" => $result,
                        "station"=> $name,
                        "pm25" => $pm25,
                    
                    )
                );

                array_push($a, $feature);
            }
        }
    }
    $c = json_encode($a);
    echo $c;
} else {
    echo ("Fail");
}
