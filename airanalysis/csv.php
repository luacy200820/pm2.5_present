<?PHP

// $fname ="http://localhost/download/data/day/08BEAC028764.csv";

$id =   $_POST["first"];
$id1 =   $_POST["second"];
$id2 =   $_POST["third"];
$id3 = $_POST["four"];
$id4 = $_POST["five"];

$device_id = [
    '74DA38E2B4CA', '74DA38B05396', '74DA38E69B38', '74DA38C7D388', '74DA38E69E36',
    '74DA38C7CEA0', '74DA38E2B6E8', '74DA38C7CEAE', '74DA38E2B588', '74DA38AF47B0',
    '74DA38B0522C', '08BEAC028A12', '74DA38B053B2', '74DA38B053C2', '74DA38C7CEAC',
    '74DA38EBF886', '74DA38C7CEB4', '74DA38B0539E', '74DA38B05456',
    '74DA38C7CEA6', '74DA38B0535E', '74DA38E69C3C', '74DA38C7D46C', '74DA38E2B530',
    '74DA38F6FF94', '74DA38E69C9E', '74DA38C7CEB6', '74DA38EBF902',
    '74DA38C7CEC6', '74DA38E2B6FC', '74DA38C7CEA4', '74DA38B053A4', '74DA38E69E24',
    '74DA38E69B30', '74DA38E69CE4', '74DA38B053D6', '74DA38C7D5A2', '74DA38C7CEB8', '74DA38C7CEA8', '74DA38B053BA', '08BEAC028762', '08BEAC028764', '08BEAC028768'];

$device_name = ['北社尾公園旁', '嘉義市宏仁女中', '維新路', '嘉義市僑平國小', 'Addison', '嘉義市港坪國小', '榴槤之家', '嘉義市育人國小', 'Yu室內', 'KT', '嘉義市民生國中', '永慶不動產嘉義林森店', '嘉義市立大業國民中', '嘉義市輔仁中學', '嘉義市立興安國小', 'RayHome', '嘉義市宣信國小', '嘉義市東吳高職', '嘉義市立南興國中', '嘉義市-蘭潭國小', 'NCYU_EMP_01', '人文新境牙醫診所', '嘉義市文雅國小', '綠築山莊', '隱居', 'Hoanya', '嘉義市大同國小', 'third brother food', '嘉義市民族國小', 'Motacila alba 崇文天下中庭', '嘉義市林森國民小學', '嘉義市立北興國中', 'lianghome', 'ws-air', '金龍街', '嘉義市-國立嘉義高中', '崇文國小空氣盒子', '嘉義市垂楊國小', '精忠國小', '仁義空氣盒子', 'Wenchangpark', 'Temple', '109mtes-eastmarket'];
$key = array_search($id,$device_name);
$id = $device_id[$key];
$fname ="http://163.27.46.1/airanalysis/air/day/".$id.".csv";
$key1 = array_search($id1,$device_name);
$id1 = $device_id[$key1];
$fname1 ="http://163.27.46.1/airanalysis/air/day/".$id1.".csv";

// php function to convert csv to json format

    // open csv file
    if (!($fp = fopen($fname, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key = fgetcsv($fp,",");
    // parse csv rows into array
    $json = array();
        while ($row = fgetcsv($fp,",")) {

            // $epoch = (strtotime($row[0])-21600)*1000;
            // $json[] = array($epoch,$row[3]);
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
    // release file handle
    fclose($fp);
    // encode array to json
    echo  json_encode($pm25, JSON_UNESCAPED_UNICODE);
    echo "@";
//第二測站
    if (!($fp1 = fopen($fname1, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key1 = fgetcsv($fp1,",");
    // parse csv rows into array
    $json1 = array();
        while ($row1 = fgetcsv($fp1,",")) {

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
    // release file handle
    fclose($fp1);
    // encode array to json
    echo  json_encode($pm251, JSON_UNESCAPED_UNICODE);

if($id2 != ""){
    echo"%";
    $key2 = array_search($id2,$device_name);
    $id2 = $device_id[$key2];
    $fname2 ="http://163.27.46.1/airanalysis/air/day/".$id2.".csv";

    if (!($fp2 = fopen($fname2, 'r'))) {
        die("Can't open file...");
    }
    //read csv headers
    $key2 = fgetcsv($fp2,",");
    // parse csv rows into array
    $json2 = array();
        while ($row2 = fgetcsv($fp2,",")) {

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
    // release file handle
    fclose($fp2);
    // encode array to json
    echo  json_encode($pm252, JSON_UNESCAPED_UNICODE);

    if ($id3 !=""){
        echo"&";
        $key3 = array_search($id3,$device_name);
        $id3 = $device_id[$key3];
        $fname3 ="http://163.27.46.1/airanalysis/air/day/".$id3.".csv";
    
        if (!($fp3 = fopen($fname3, 'r'))) {
            die("Can't open file...");
        }
        //read csv headers
        $key3 = fgetcsv($fp3,",");
        // parse csv rows into array
        $json3 = array();
            while ($row3 = fgetcsv($fp3,",")) {
                if (is_numeric($row3[3])){
                    $number_pm = floatval($row3[3]);
                    if ($number_pm < 0) {
                        $number_pm = 0;
                    } 
                }
                else {
                    $number_pm = $row3[3];
                }
                $epoch = (strtotime($row3[0])-21600)*1000;
                $pm253[] = array(
                    $epoch , $number_pm
                );              
        }
        // release file handle
        fclose($fp3);
        // encode array to json
        echo  json_encode($pm253, JSON_UNESCAPED_UNICODE);

        if($id4 !=""){
            echo"*";
            $key4 = array_search($id4,$device_name);
            $id4 = $device_id[$key4];
            $fname4 ="http://163.27.46.1/airanalysis/air/day/".$id4.".csv";
        
            if (!($fp4 = fopen($fname4, 'r'))) {
                die("Can't open file...");
            }
            //read csv headers
            $key4 = fgetcsv($fp4,",");
            // parse csv rows into array
            $json4 = array();
                while ($row4 = fgetcsv($fp4,",")) {
        
                    if (is_numeric($row4[3])){
                        $number_pm = floatval($row4[3]);
                        if ($number_pm < 0) {
                            $number_pm = 0;
                        } 
                    }
                    else {
                        $number_pm = $row4[3];
                    }
                    $epoch = (strtotime($row4[0])-21600)*1000;
                    $pm254[] = array(
                        $epoch , $number_pm
                    );              
            }
            // release file handle
            fclose($fp4);
            // encode array to json
            echo  json_encode($pm254, JSON_UNESCAPED_UNICODE);
        }
    }
}


   
?>