
<?php
include("connection.php");

$id =   $_POST["device"];
$station=[];
//echo $id;
// echo $id;
//  var_dump ( $_POST);
// if (isset($_POST["device"])) {
//     $id =   $_POST["device"];
//     error_log(print_r($id, true));
// } else {
//     error_log(print_r("error", true));
// }
//if ($id == "Hoanya"){
//   $station = "74DA38E69C9E";
//   echo $station;
//}
//else if ($id == "NCYU_EMP_01"){
    $station ="NCYU_EMP_01";
//    echo $station;
//}
//else echo ("no");
try {
    // $sql = "SELECT * FROM id08beac028a12";
    $sql = "SELECT * FROM ".$station." WHERE DATE_SUB(curdate(), INTERVAL 10 DAY) <= date(date)";
    if ($stmt = $db->query($sql)) {
        while ($result = mysqli_fetch_array($stmt)) {
            $number_pm = intval($result['pm25']);
            if ($number_pm < 0) {
                $number_pm = 0;
            }

            $pm25[] = array(
                $result['date'], $number_pm
            );
        }
        $pm25 = json_encode($pm25);
        // var_dump ($pm25);
        echo $pm25;
    }
} catch (Exception $e) {
    die($e);
}
?>
