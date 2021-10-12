
<?php
include("connection.php");

$id =   $_POST["first"];
$id1 =   $_POST["second"];

$id = 'ncyu_emp_01';
$id1 = '嘉義市宣信國小';

try {
    $name[] = array(
        "first",$id
    );
    // $sql = "SELECT * FROM id08beac028a12";
    $sql = "SELECT * FROM ".$id." WHERE DATE_SUB(curdate(), INTERVAL 30 DAY) <= date(date)";
    if ($stmt = $db->query($sql)) {
        while ($result = mysqli_fetch_array($stmt)) {
            $number_pm = floatval($result['pm25']);
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
echo "@";
try {
   $name[] = array(
        "second",$id1
    ); 
   
    // $sql = "SELECT * FROM id08beac028a12";
    $sql = "SELECT * FROM ".$id1." WHERE DATE_SUB(curdate(), INTERVAL 30 DAY) <= date(date)";
    if ($stmt = $db->query($sql)) {
        while ($result = mysqli_fetch_array($stmt)) {
            $number_pm = floatval($result['pm25']);
            if ($number_pm < 0) {
                $number_pm = 0;
            }

            $pm251[] = array(
                $result['date'], $number_pm
            );
        }
        // array_push($pm251,"name",$id1);
        $pm251 = json_encode($pm251);
        // var_dump ($pm25,$pm251);
        echo $pm251;
    }
} catch (Exception $e) {
    die($e);
}
echo "%";
$name = json_encode($name);
echo $name;
echo "*";
// echo json_encode(array('first'=> $pm25,'second'=>$pm251));
?>
