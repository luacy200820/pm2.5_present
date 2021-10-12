<?php
    include("connection2.php");
    $start =   $_POST["start"];
    $end =   $_POST["end"];
   $id =   $_POST["first"];
   $id2 =   $_POST["second"];
   $id3 =   $_POST["third"];
   $id4 = $_POST["four"];
   $id5 = $_POST["five"];
   date_default_timezone_set("Asia/Taipei");


    // $sql = "SELECT * FROM ".$id;
   
    $sql = "SELECT * FROM `".$id."` WHERE date between '".$start."' and '".$end."'";
    // echo($sql);
    $better = 0;
    $normal =0;
    $sensitive=0;
    $worse = 0;
    $die=0;
    $sick=0;
    $no = 0;
   
    
    if ( $stmt = $db->query($sql)) {
        $num = mysqli_num_rows($stmt);
        if ($num >0){
        while ($result = mysqli_fetch_array($stmt)) {
            if (is_numeric($result['pm25'])) {
                $number_pm = floatval($result['pm25']);
                if ($number_pm < 0 ){
                    $number_pm = 0;
                }
                if ($number_pm >= 0 && $number_pm <= 15.4) {
                    $better++;
                } else if ($number_pm> 15.4 && $number_pm <=35.4) {
                    $normal++;
                } else if ($number_pm >35.4 && $number_pm<=54.4){
                    $sensitive++;
                } else if ($number_pm >54.4 && $number_pm<=150.4 ) {
                    $worse++;
                }else if ($number_pm> 150.4 && $number_pm <=250.4 ) {
                     $sick++;
                }else if ($number_pm> 250.4 ){
                    $die++;
                }

            } else {
                $number_pm = $result['pm25'];
                $no++;
            }

            //$epoch = (strtotime($result['date'])) * 1000;
            // echo (strtotime($result['date']));
            $epoch = (strtotime($result['date'])) * 1000;

            $pm25[] = array(
                $epoch, $number_pm
            );

          
        }
    }
    else {
        $pm25=array(); 
    }
    }
// $second=[];
    $sql = "SELECT * FROM `".$id2."` WHERE date between '".$start."' and '".$end."'";
    $better2 = 0;
    $normal2 =0;
    $sensitive2=0;
    $worse2 = 0;
    $die2=0;
    $sick2=0;
    $no2 = 0;

    if ($stmt = $db->query($sql)) {
        $num = mysqli_num_rows($stmt);
        if ($num >0){
        while ($result = mysqli_fetch_array($stmt)) {
            
            if (is_numeric($result['pm25'])) {
                $number_pm = floatval($result['pm25']);
                if ($number_pm < 0 ){
                    $number_pm = 0;
                }
                if ($number_pm >= 0 && $number_pm <= 15.4) {
                    $better2++;
                } else if ($number_pm> 15.4 && $number_pm <=35.4) {
                    $normal2++;
                } else if ($number_pm >35.4 && $number_pm<=54.4){
                    $sensitive2++;
                } else if ($number_pm >54.4 && $number_pm<=150.4 ) {
                    $worse2++;
                }else if ($number_pm> 150.4 && $number_pm <=250.4 ) {
                     $sick2++;
                }else if ($number_pm> 250.4 ){
                    $die2++;
                }

            } else {
                $number_pm = $result['pm25'];
                $no2++;
            }

           $epoch = (strtotime($result['date'])) * 1000;
            $second[]  = array(
                $epoch, $number_pm
            );
            // $epoch = (strtotime($row5[0]) - 21600) * 1000;
        }
    }
    else {
        $second = array();
    }
        // $second = json_encode($second);
        // $hum = json_encode($hum);
        // $tem = json_encode($tem);
        // echo $second;
      
    }
    if ($id3 != ""){
        $sql = "SELECT * FROM `".$id3."` WHERE date between '".$start."' and '".$end."'";
        $better3 = 0;
        $normal3 =0;
        $sensitive3=0;
        $worse3 = 0;
        $die3=0;
        $sick3=0;
        $no3 = 0;
        if ($stmt = $db->query($sql)) {
            $num = mysqli_num_rows($stmt);
            if ($num >0){
            while ($result = mysqli_fetch_array($stmt)) {
                if (is_numeric($result['pm25'])) {
                    $number_pm = floatval($result['pm25']);
                    if ($number_pm < 0 ){
                        $number_pm = 0;
                    }
                    if ($number_pm >= 0 && $number_pm <= 15.4) {
                        $better3++;
                    } else if ($number_pm> 15.4 && $number_pm <=35.4) {
                        $normal3++;
                    } else if ($number_pm >35.4 && $number_pm<=54.4){
                        $sensitive3++;
                    } else if ($number_pm >54.4 && $number_pm<=150.4 ) {
                        $worse3++;
                    }else if ($number_pm> 150.4 && $number_pm <=250.4 ) {
                         $sick3++;
                    }else if ($number_pm> 250.4 ){
                        $die3++;
                    }
    
                } else {
                    $number_pm = $result['pm25'];
                    $no3++;
                }
               $epoch = (strtotime($result['date'])) * 1000;
                $third[]  = array(
                    $epoch, $number_pm
                );
                // $epoch = (strtotime($row5[0]) - 21600) * 1000;
            }
        }
        else {
            $third = array();
        }
        }

        if ($id4 !=""){
            $sql = "SELECT * FROM `".$id4."` WHERE date between '".$start."' and '".$end."'";
            $better4 = 0;
            $normal4 =0;
            $sensitive4=0;
            $worse4 = 0;
            $die4=0;
            $sick4=0;
            $no4 = 0;
            if ($stmt = $db->query($sql)) {
                $num = mysqli_num_rows($stmt);
                if ($num >0){
                while ($result = mysqli_fetch_array($stmt)) {
                    if (is_numeric($result['pm25'])) {
                        $number_pm = floatval($result['pm25']);
                        if ($number_pm < 0 ){
                            $number_pm = 0;
                        }
                        if ($number_pm >= 0 && $number_pm <= 15.4) {
                            $better4++;
                        } else if ($number_pm> 15.4 && $number_pm <=35.4) {
                            $normal4++;
                        } else if ($number_pm >35.4 && $number_pm<=54.4){
                            $sensitive4++;
                        } else if ($number_pm >54.4 && $number_pm<=150.4 ) {
                            $worse4++;
                        }else if ($number_pm> 150.4 && $number_pm <=250.4 ) {
                             $sick4++;
                        }else if ($number_pm> 250.4 ){
                            $die4++;
                        }
        
                    } else {
                        $number_pm = $result['pm25'];
                        $no4++;
                    }
                   $epoch = (strtotime($result['date'])) * 1000;
                    $four[]  = array(
                        $epoch, $number_pm
                    );
                    // $epoch = (strtotime($row5[0]) - 21600) * 1000;
                }}
                else {
                    $four = array();
                }
            }
            if ($id5 !=""){
                $sql = "SELECT * FROM `".$id5."` WHERE date between '".$start."' and '".$end."'";
                $better5 = 0;
                $normal5 =0;
                $sensitive5=0;
                $worse5 = 0;
                $die5=0;
                $sick5=0;
                $no5 = 0;
                if ($stmt = $db->query($sql)) {
                    $num = mysqli_num_rows($stmt);
                    if ($num >0){
                    while ($result = mysqli_fetch_array($stmt)) {
                        if (is_numeric($result['pm25'])) {
                            $number_pm = floatval($result['pm25']);
                            if ($number_pm < 0 ){
                                $number_pm = 0;
                            }
                            if ($number_pm >= 0 && $number_pm <= 15.4) {
                                $better5++;
                            } else if ($number_pm> 15.4 && $number_pm <=35.4) {
                                $normal5++;
                            } else if ($number_pm >35.4 && $number_pm<=54.4){
                                $sensitive5++;
                            } else if ($number_pm >54.4 && $number_pm<=150.4 ) {
                                $worse5++;
                            }else if ($number_pm> 150.4 && $number_pm <=250.4 ) {
                                 $sick5++;
                            }else if ($number_pm> 250.4 ){
                                $die5++;
                            }
            
                        } else {
                            $number_pm = $result['pm25'];
                            $no5++;
                        }
                       $epoch = (strtotime($result['date'])) * 1000;
                        $five[]  = array(
                            $epoch, $number_pm
                        );
                        // $epoch = (strtotime($row5[0]) - 21600) * 1000;
                    }}
                    else {
                        $five =array();
                    }
                }
                echo  json_encode([[$pm25,$second,$third,$four,$five],[[$no, $no2, $no3, $no4, $no5], [$better, $better2, $better3, $better4, $better5],[$normal,$normal2,$normal3,$normal4,$normal5],[$sensitive,$sensitive2,$sensitive3,$sensitive4,$sensitive5], [$worse, $worse2, $worse3, $worse4, $worse5],[$sick,$sick2,$sick3,$sick4,$sick5],[$die,$die2,$die3,$die4,$die5]]], JSON_UNESCAPED_UNICODE);
         
            }
            else {
                echo  json_encode([[$pm25,$second,$third,$four],[[$no, $no2, $no3, $no4], [$better, $better2, $better3, $better4],[$normal,$normal2,$normal3,$normal4],[$sensitive,$sensitive2,$sensitive3,$sensitive4], [$worse, $worse2, $worse3, $worse4],[$sick,$sick2,$sick3,$sick4],[$die,$die2,$die3,$die4]]], JSON_UNESCAPED_UNICODE);
            }
        }
        else {
            echo  json_encode([[$pm25,$second,$third],[[$no, $no2, $no3], [$better, $better2, $better3],[$normal,$normal2,$normal3],[$sensitive,$sensitive2,$sensitive3], [$worse, $worse2, $worse3],[$sick,$sick2,$sick3],[$die,$die2,$die3]]], JSON_UNESCAPED_UNICODE);
        }
    }
    else {
        echo  json_encode([[$pm25,$second],[[$no, $no2], [$better, $better2],[$normal,$normal2],[$sensitive,$sensitive2], [$worse, $worse2],[$sick,$sick2],[$die,$die2]]], JSON_UNESCAPED_UNICODE);
    }
    // echo  json_encode([$pm25,$second], JSON_UNESCAPED_UNICODE);
    // mysql_close($sql);
    ?>

 