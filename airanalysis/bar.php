<?PHP

$id =   $_POST["first"];
$id2 =   $_POST["second"];
$id3 =  $_POST["three"];
$id4 = $_POST["four"];
$id5 = $_POST["five"];
$day =   $_POST["date"];

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
$key = array_search($id, $device_name);
// $id = $device_id[$key];
// $key = array_search($id2, $device_name);
// $id2 = $device_id[$key];
if ( $key == ""){
    $fname ="http://163.27.46.1/airanalysis/compare/day/".$id.".csv";
    
}
else {
    $id = $device_id[$key];
    $fname ="http://163.27.46.1/airanalysis/compare/day/".$id.".csv";
    // echo $fname;
}
$key = array_search($id2,$device_name);
if ($key==""){
    $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id2.".csv";
}
else {
    $id2 = $device_id[$key];
    $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id2.".csv";
}


// $fname = "http://163.27.46.1/airanalysis/air/day/".$id.".csv";
if (!($fp = fopen($fname, 'r'))) {
    die("Can't open file...");
}
//read csv headers
$key = fgetcsv($fp, ",");
// parse csv rows into array
$json = array();
$row_sum = 0;
$better = 0;
$worse = 0;
$no = 0;
$sick =0;
$die =0;
$normal =0;
$sensitive =0;


while ($row = fgetcsv($fp, ",")) {
    $row_sum++;
    // $epoch = (strtotime($row[0])-21600)*1000;
    // $json[] = array($epoch,$row[3]);
    if (is_numeric($row[3])) {
        $number_pm = floatval($row[3]);
        if ($number_pm < 0) {
            $number_pm = 0;
        }
    } else {
        $number_pm = $row[3];
    }
    $epoch = (strtotime($row[0]) - 21600) * 1000;
    $pm[] = array(
        $epoch, $number_pm
    );
}

if($day >$row_sum){
    $cal = 0;
}
else{
    $cal = $row_sum - $day;
}
for ($i = $row_sum - 1; $i >= $cal; $i--) {
    if (is_numeric($pm[$i][1])) {
        if ($pm[$i][1] >= 0 && $pm[$i][1] <= 15.4) {
            $better++;
        } else if ($pm[$i][1] >15.5 && $pm[$i][1] <=35.4) {
            $normal++;
        } else if ($pm[$i][1] >35.5&& $pm[$i][1]<=54.4){
            $sensitive++;
        } else if ($pm[$i][1] >54.5 && $pm[$i][1] <=150.4 ) {
            $worse++;
        }else if ($pm[$i][1] > 150.5 && $pm[$i][1] <=250.4 ) {
           $sick++;
        }else if ($pm[$i][1] > 250.5 ){
            $die++;
        }
    } else {
        $no++;
    }

    // $save[]=array( $pm[$i][0],$pm[$i][1]);
}
fclose($fp);

// $fname2 = "http://163.27.46.1/airanalysis/air/day/".$id2.".csv";

if (!($fp2 = fopen($fname2, 'r'))) {
    die("Can't open file...");
}
//read csv headers
$key2 = fgetcsv($fp2, ",");
// parse csv rows into array
$json2 = array();
$row_sum = 0;
$better2 = 0;
$worse2 = 0;
$no2 = 0;
$normal2=0;
$die2=0;
$sick2=0;
$sensitive2=0;

while ($row2 = fgetcsv($fp2, ",")) {
    $row_sum++;

    if (is_numeric($row2[3])) {
        $number_pm = floatval($row2[3]);
        if ($number_pm < 0) {
            $number_pm = 0;
        }
    } else {
        $number_pm = $row2[3];
    }
    $epoch = (strtotime($row2[0]) - 21600) * 1000;
    $pm2[] = array(
        $epoch, $number_pm
    );
}

if($day >$row_sum){
    $cal = 0;
}
else{
    $cal = $row_sum - $day;
}
for ($i = $row_sum - 1; $i >= $cal; $i--) {
    if (is_numeric($pm2[$i][1])) {
        if ($pm2[$i][1] >= 0 && $pm2[$i][1] <= 15.4) {
            $better2++;
        } else if ($pm2[$i][1] > 15.5 && $pm2[$i][1] <=35.4) {
            $normal2++;
        } else if ($pm2[$i][1] >35.5 && $pm2[$i][1]<=54.4){
            $sensitive2++;
        } else if ($pm2[$i][1] >54.5 && $pm2[$i][1] <=150.4 ) {
            $worse2++;
        }else if ($pm2[$i][1] > 150.5 && $pm2[$i][1] <=250.4 ) {
           $sick2++;
        }else if ($pm2[$i][1] > 250.5 ){
            $die2++;
        }
    } else {
        $no2++;
    }
}



// release file handle
fclose($fp2);
// encode array to json
if ($id3 != "") {
    $key = array_search($id3,$device_name);
    if ($key==""){
        $fname3 ="http://163.27.46.1/airanalysis/compare/day/".$id3.".csv";
    }
    else {
        $id3 = $device_id[$key];
        $fname3 ="http://163.27.46.1/airanalysis/compare/day/".$id3.".csv";
    }


    if (!($fp3 = fopen($fname3, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key3 = fgetcsv($fp3, ",");
    // parse csv rows into array
    $json3 = array();
    $row_sum = 0;
    $better3 = 0;
    $normal3 =0;
    $sensitive3 =0;
    $die3=0;
    $sick3=0;
    $worse3 = 0;
    $no3 = 0;

    while ($row3 = fgetcsv($fp3, ",")) {
        $row_sum++;
        // $epoch = (strtotime($row[0])-21600)*1000;
        // $json[] = array($epoch,$row[3]);
        if (is_numeric($row3[3])) {
            $number_pm = floatval($row3[3]);
            if ($number_pm < 0) {
                $number_pm = 0;
            }
        } else {
            $number_pm = $row3[3];
        }
        $epoch = (strtotime($row3[0]) - 21600) * 1000;
        $pm3[] = array(
            $epoch, $number_pm
        );
    }
    if($day >$row_sum){
        $cal = 0;
    }
    else{
        $cal = $row_sum - $day;
    }
    for ($i = $row_sum - 1; $i >= $cal; $i--) {
        if (is_numeric($pm3[$i][1])) {
            if ($pm3[$i][1] >= 0 && $pm3[$i][1] <= 15.4) {
                $better3++;
            } else if ($pm3[$i][1] > 15.5 && $pm3[$i][1] <=35.4) {
                $normal3++;
            }else if ($pm3[$i][1] >35.5 && $pm3[$i][1]<=54.4){
                $sensitive3++;
            } else if ($pm3[$i][1] >54.5 && $pm3[$i][1] <=150.4 ) {
                $worse3++;
            }else if ($pm3[$i][1] > 150.5 && $pm3[$i][1] <=250.4 ) {
               $sick3++;
            }else if ($pm3[$i][1] > 250.5 ){
                $die3++;
            }
        } else {
            $no3++;
        }
    }
    fclose($fp3);
    if ($id4 != "") {
        $key = array_search($id4,$device_name);
        if ($key==""){
            $fname4 ="http://163.27.46.1/airanalysis/compare/day/".$id4.".csv";
        }
        else {
            $id4 = $device_id[$key];
            $fname4 ="http://163.27.46.1/airanalysis/compare/day/".$id4.".csv";
        }
        

        if (!($fp4 = fopen($fname4, 'r'))) {
            die("Can't open file...");
        }
        //read csv headers
        $key4 = fgetcsv($fp4, ",");
        // parse csv rows into array
        $json4 = array();
        $row_sum = 0;
        $better4 = 0;
        $normal4 =0;
        $sensitive4 =0;
        $worse4 = 0;
        $die4=0;
        $no4 = 0;
        $sick4= 0;

        while ($row4 = fgetcsv($fp4, ",")) {
            $row_sum++;
 
            if (is_numeric($row4[3])) {
                $number_pm = floatval($row4[3]);
                if ($number_pm < 0) {
                    $number_pm = 0;
                }
            } else {
                $number_pm = $row4[3];
            }
            $epoch = (strtotime($row4[0]) - 21600) * 1000;
            $pm4[] = array(
                $epoch, $number_pm
            );
        }
        if($day >$row_sum){
            $cal = 0;
        }
        else{
            $cal = $row_sum - $day;
        }
        for ($i = $row_sum - 1; $i >= $cal; $i--) {
            if (is_numeric($pm4[$i][1])) {
                if ($pm4[$i][1] >= 0 && $pm4[$i][1] <= 15.4) {
                    $better4++;
                } else if ($pm4[$i][1] > 15.5 && $pm4[$i][1] <=35.4) {
                    $normal4++;
                }else if ($pm4[$i][1] >35.5 && $pm4[$i][1]<=54.4){
                    $sensitive4++;
                } else if ($pm4[$i][1] >54.5 && $pm4[$i][1] <=150.4) {
                    $worse4++;
                }else if ($pm4[$i][1] > 150.5 && $pm4[$i][1] <=250.4 ) {
                   $sick4++;
                }else if ($pm4[$i][1] > 250.5 ){
                    $die4++;
                }
            } else {
                $no4++;
            }
        }
        fclose($fp4);

        if ($id5 != "") {
            $key = array_search($id5,$device_name);
            if ($key==""){
                $fname5 ="http://163.27.46.1/airanalysis/compare/day/".$id5.".csv";
            }
            else {
                $id5 = $device_id[$key];
                $fname5 ="http://163.27.46.1/airanalysis/compare/day/".$id5.".csv";
            }
            

            if (!($fp5 = fopen($fname5, 'r'))) {
                die("Can't open file...");
            }
            //read csv headers
            $key5 = fgetcsv($fp5, ",");
            // parse csv rows into array
            $json5 = array();
            $row_sum = 0;
            $better5 = 0;
            $normal5 =0;
            $sensitive5=0;
            $worse5 = 0;
            $die5=0;
            $sick5=0;
            $no5 = 0;

            while ($row5 = fgetcsv($fp5, ",")) {
                $row_sum++;
            
                if (is_numeric($row5[3])) {
                    $number_pm = floatval($row5[3]);
                    if ($number_pm < 0) {
                        $number_pm = 0;
                    }
                } else {
                    $number_pm = $row5[3];
                }
                $epoch = (strtotime($row5[0]) - 21600) * 1000;
                $pm5[] = array(
                    $epoch, $number_pm
                );
            }
            if($day >$row_sum){
                $cal = 0;
            }
            else{
                $cal = $row_sum - $day;
            }
            for ($i = $row_sum - 1; $i >= $cal; $i--) {
                if (is_numeric($pm5[$i][1])) {
                    if ($pm5[$i][1] >= 0 && $pm5[$i][1] <= 15.4) {
                        $better5++;
                    } else if ($pm5[$i][1] > 15.5 && $pm5[$i][1] <=35.4) {
                        $normal5++;
                    } else if ($pm5[$i][1] >35.5 && $pm5[$i][1]<=54.4){
                        $sensitive5++;
                    } else if ($pm5[$i][1] >54.5 && $pm5[$i][1] <=150.4 ) {
                        $worse5++;
                    }else if ($pm5[$i][1] > 150.5 && $pm5[$i][1] <=250.4 ) {
                       $sick5++;
                    }else if ($pm5[$i][1] > 250.5 ){
                        $die5++;
                    }
                } else {
                    $no5++;
                }
            }
            fclose($fp5);
            echo  json_encode([[$no, $no2, $no3, $no4, $no5], [$better, $better2, $better3, $better4, $better5],[$normal,$normal2,$normal3,$normal4,$normal5],[$sensitive,$sensitive2,$sensitive3,$sensitive4,$sensitive5], [$worse, $worse2, $worse3, $worse4, $worse5],[$sick,$sick2,$sick3,$sick4,$sick5],[$die,$die2,$die3,$die4,$die5]], JSON_UNESCAPED_UNICODE);
        } else {
            echo  json_encode([[$no, $no2, $no3, $no4], [$better, $better2, $better3, $better4],[$normal,$normal2,$normal3,$normal4],[$sensitive,$sensitive2,$sensitive3,$sensitive4], [$worse, $worse2, $worse3, $worse4],[$sick,$sick2,$sick3,$sick4],[$die,$die2,$die3,$die4]], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo  json_encode([[$no, $no2, $no3], [$better, $better2, $better3],[$normal,$normal2,$normal3],[$sensitive,$sensitive2,$sensitive3], [$worse, $worse2, $worse3],[$sick,$sick2,$sick3],[$die,$die2,$die3]], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo  json_encode([[$no, $no2], [$better, $better2],[$normal,$normal2],[$sensitive,$sensitive2], [$worse, $worse2],[$sick,$sick2],[$die,$die2]], JSON_UNESCAPED_UNICODE);

}
