<?PHP

// $fname ="http://localhost/download/data/day/08BEAC028764.csv";
$day = $_POST["day"];
$id =   $_POST["first"];
$id2 =   $_POST["second"];
$id3 =   $_POST["third"];
$id4 = $_POST["four"];
$id5 = $_POST["five"];
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
	$key = array_search($id,$device_name);
if ( $key == ""){
    $fname ="http://163.27.46.1/airanalysis/compare/day/".$id.".csv";
}
else {
    $id = $device_id[$key];
    $fname ="http://163.27.46.1/airanalysis/compare/day/".$id.".csv";
}
$key = array_search($id2,$device_name);
if ($key==""){
    $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id2.".csv";
     
}
else {
    $id2 = $device_id[$key];
    $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id2.".csv";
}

    // open csv file
    if (!($fp = fopen($fname, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key = fgetcsv($fp,",");
    $row_sum = 0;
    // parse csv rows into array
    $json = array();
        while ($row = fgetcsv($fp,",")) {
            $row_sum ++;

            if (is_numeric($row[3])){
                $number_pm = floatval($row[3]);
                if ($number_pm < 0) {
                    $number_pm = 0;
                } 
            }
            else {
                $number_pm = $row[3];
            }
            $epoch = (strtotime($row[0])-21600)*1000;
            $pm25[] = array(
                $epoch , $number_pm
            );              
    }
    if($day >$row_sum){
        $cal = 0;
    }
    else{
        $cal = $row_sum - $day;
    }
    for ($i = $cal; $i <$row_sum ; $i++) {
        $save[]=array( $pm25[$i][0],$pm25[$i][1]);
    }
    // release file handle
    fclose($fp);
    // encode array to json
    // echo  json_encode($pm25, JSON_UNESCAPED_UNICODE);
    
//第二測站
    if (!($fp1 = fopen($fname2, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key1 = fgetcsv($fp1,",");
    $row_sum = 0;
    // parse csv rows into array
    $json1 = array();
        while ($row1 = fgetcsv($fp1,",")) {
            $row_sum ++;
            // $epoch = (strtotime($row[0])-21600)*1000;
            // $json[] = array($epoch,$row[3]);
            if (is_numeric($row1[3])){
                $number_pm = floatval($row1[3]);
                if ($number_pm < 0) {
                    $number_pm = 0;
                } 
            }
            else {
                $number_pm = $row1[3];
            }
            $epoch = (strtotime($row1[0])-21600)*1000;
            $pm251[] = array(
                $epoch , $number_pm
            );              
    }
    if($day >$row_sum){
        $cal = 0;
    }
    else{
        $cal = $row_sum - $day;
    }
    for ($i = $cal; $i <$row_sum ; $i++)  {
        $save2[]=array( $pm251[$i][0],$pm251[$i][1]);
    }
    // release file handle
    fclose($fp1);


if($id3 != ""){
  
    $key = array_search($id3,$device_name);
    if ($key==""){
        $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id3.".csv";
    }
    else {
        $id3 = $device_id[$key];
        $fname2 ="http://163.27.46.1/airanalysis/compare/day/".$id3.".csv";
    }
    

    if (!($fp2 = fopen($fname2, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key2 = fgetcsv($fp2,",");
    $row_sum=0;
    // parse csv rows into array
    $json2 = array();
        while ($row2 = fgetcsv($fp2,",")) {
            $row_sum++;
            // $epoch = (strtotime($row[0])-21600)*1000;
            // $json[] = array($epoch,$row[3]);
            if (is_numeric($row2[3])){
                $number_pm = floatval($row2[3]);
                if ($number_pm < 0) {
                    $number_pm = 0;
                } 
            }
            else {
                $number_pm = $row2[3];
            }
            $epoch = (strtotime($row2[0])-21600)*1000;
            $pm252[] = array(
                $epoch , $number_pm
            );              
    }
    if($day >$row_sum){
        $cal = 0;
    }
    else{
        $cal = $row_sum - $day;
    }
    for ($i = $cal; $i <$row_sum ; $i++) {
        $save3[]=array( $pm252[$i][0],$pm252[$i][1]);
    }
    // release file handle
    fclose($fp2);
    if ($id4 !=""){
        $key = array_search($id4,$device_name);
        if ($key==""){
            $fname4="http://163.27.46.1/airanalysis/compare/day/".$id4.".csv";
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
        $worse4 = 0;
        $no4 = 0;

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
        for ($i = $cal; $i <$row_sum ; $i++) {
            $save4[]=array( $pm4[$i][0],$pm4[$i][1]);
        }
        fclose($fp4);

        if ($id5 != "") {
            $key = array_search($id5,$device_name);
            if ($key==""){
                $fname5="http://163.27.46.1/airanalysis/compare/day/".$id5.".csv";
            }
            else {
                $id5= $device_id[$key];
                $fname5="http://163.27.46.1/airanalysis/compare/day/".$id5.".csv";
            }
            

            if (!($fp5 = fopen($fname5, 'r'))) {
                die("Can't open file...");
            }
            //read csv headers
            $key5 = fgetcsv($fp5, ",");
            // parse csv rows into array
            $json5 = array();
            $row_sum = 0;

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
            for ($i =$cal; $i<$row_sum ; $i++) {
                $save5[]=array($pm5[$i][0],$pm5[$i][1]);
               
            }
            fclose($fp5);
            echo  json_encode([$save,$save2,$save3,$save4,$save5], JSON_UNESCAPED_UNICODE);
        } else {
            echo  json_encode([$save,$save2,$save3,$save4], JSON_UNESCAPED_UNICODE);
        }
    }
    else {
    echo  json_encode([$save,$save2,$save3], JSON_UNESCAPED_UNICODE);}
}
else{
    echo  json_encode([$save,$save2], JSON_UNESCAPED_UNICODE);
}
?>