
<?php
$link = mysqli_connect("localhost", "root", "kiisgood", "test");
$link->set_charset("UTF8"); // 設定語系避免亂碼
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
    '74DA38E69B30', '74DA38E69CE4', '74DA38B053D6', '74DA38C7D5A2', '74DA38C7CEB8', '74DA38C7CEA8', '74DA38B053BA', '08BEAC028762', '08BEAC028764', '08BEAC028768'
];

$device_name = ['北社尾公園旁', '嘉義市宏仁女中', '維新路', '嘉義市僑平國小', 'Addison', '嘉義市港坪國小', '榴槤之家', '嘉義市育人國小', 'Yu室內', 'KT', '嘉義市民生國中', '永慶不動產嘉義林森店', '嘉義市立大業國民中', '嘉義市輔仁中學', '嘉義市立興安國小', 'RayHome', '嘉義市宣信國小', '嘉義市東吳高職', '嘉義市立南興國中', '嘉義市-蘭潭國小', 'NCYU_EMP_01', '人文新境牙醫診所', '嘉義市文雅國小', '綠築山莊', '隱居', 'Hoanya', '嘉義市大同國小', 'third brother food', '嘉義市民族國小', 'Motacila alba 崇文天下中庭', '嘉義市林森國民小學', '嘉義市立北興國中', 'lianghome', 'ws-air', '金龍街', '嘉義市-國立嘉義高中', '崇文國小空氣盒子', '嘉義市垂楊國小', '精忠國小', '仁義空氣盒子', 'Wenchangpark', 'Temple', '109mtes-eastmarket'];
 
$id = '74da38b05396';
$id1 = '74da38e69c9e';

try {

    // $sql = "SELECT * FROM id08beac028a12";
    $result = $link->query("SELECT * FROM " . $id);

    while ($row = $result->fetch_assoc()) // 當該指令執行有回傳
    {

        if (is_numeric($row['pm25'])) {
            $number_pm = floatval($row['pm25']);
            if ($number_pm < 0) {
                $number_pm = 0;
            }
        } else {
            $number_pm = $row['pm25'];
        }
        $epoch = (strtotime($row['date']) - 21600) * 1000;
        $pm25[] = array(
            $epoch, $number_pm
        );
    }
    print(json_encode($pm25, JSON_UNESCAPED_UNICODE));
} catch (Exception $e) {
    die($e);
}
echo "@";
try {

    // $sql = "SELECT * FROM id08beac028a12";
    $result = $link->query("SELECT * FROM " . $id1);

    while ($row = $result->fetch_assoc()) // 當該指令執行有回傳
    {

        if (is_numeric($row['pm25'])) {
            $number_pm = floatval($row['pm25']);
            if ($number_pm < 0) {
                $number_pm = 0;
            }
        } else {
            $number_pm = $row['pm25'];
        }
        $epoch = (strtotime($row['date']) - 21600) * 1000;
        $pm251[] = array(
            $epoch, $number_pm
        );
    }
    print(json_encode($pm251, JSON_UNESCAPED_UNICODE));
} catch (Exception $e) {
    die($e);
}

if ($id2 != "") {
    try {
        echo "%";
        $id2 = "ncyu_emp_01";
        // $sql = "SELECT * FROM id08beac028a12";
        // $result = $link->query("SELECT * FROM " . $id2 . " WHERE DATE_SUB(curdate(), INTERVAL 100 DAY) <= date(date)");
        $result = $link->query("SELECT * FROM " . $id2);
        while ($row = $result->fetch_assoc()) // 當該指令執行有回傳
        {

            if (is_numeric($row['pm25'])) {
                $number_pm = floatval($row['pm25']);
                if ($number_pm < 0) {
                    $number_pm = 0;
                }
            } else {
                $number_pm = $row['pm25'];
            }
            $epoch = (strtotime($row['date']) - 21600) * 1000;
            $pm253[] = array(
                $epoch, $number_pm
            );
        }
        print(json_encode($pm253, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        die($e);
    }
}
if ($id3 != "") {//第四個測站
    try {
        echo "&";
        $id3 = "day";
        // $sql = "SELECT * FROM id08beac028a12";
        // $result = $link->query("SELECT * FROM " . $id2 . " WHERE DATE_SUB(curdate(), INTERVAL 100 DAY) <= date(date)");
        $result = $link->query("SELECT * FROM " . $id3);
        while ($row = $result->fetch_assoc()) // 當該指令執行有回傳
        {

            if (is_numeric($row['pm25'])) {
                $number_pm = floatval($row['pm25']);
                if ($number_pm < 0) {
                    $number_pm = 0;
                }
            } else {
                $number_pm = $row['pm25'];
            }
            $epoch = (strtotime($row['date']) - 21600) * 1000;
            $pm254[] = array(
                $epoch, $number_pm
            );
        }
        print(json_encode($pm254, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        die($e);
    }
}
if ($id4 != "") {  //第五個測站
    try {
        echo "*";
        $id4 = "嘉義市宏仁女中";
        // $sql = "SELECT * FROM id08beac028a12";
        // $result = $link->query("SELECT * FROM " . $id2 . " WHERE DATE_SUB(curdate(), INTERVAL 100 DAY) <= date(date)");
        $result = $link->query("SELECT * FROM " . $id4);
        while ($row = $result->fetch_assoc()) // 當該指令執行有回傳
        {

            if (is_numeric($row['pm25'])) {
                $number_pm = floatval($row['pm25']);
                if ($number_pm < 0) {
                    $number_pm = 0;
                }
            } else {
                $number_pm = $row['pm25'];
            }
            $epoch = (strtotime($row['date']) - 21600) * 1000;
            $pm255[] = array(
                $epoch, $number_pm
            );
        }
        print(json_encode($pm255, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        die($e);
    }
}
$link->close(); // 關閉資料庫連線
?>
