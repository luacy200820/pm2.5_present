<?php  
      //export.php  

if (isset($_POST["device"])){
     $connect = mysqli_connect("localhost", "root", "mtes", "air_min");  
     header('Content-Type: text/csv; charset=utf-8');  
     header('Content-Disposition: attachment; filename='.$_POST["device"].'.csv');  
     $output = fopen("php://output", "w");
     fwrite($output, "\xEF\xBB\xBF");    
     fputcsv($output, array('Date', 'Humidity', 'Temperature', 'PM2.5', 'PM1', 'PM10'));  
     $query = "SELECT * from ".$_POST["device"];  
     $result = mysqli_query($connect, $query);  
     while($row = mysqli_fetch_assoc($result))  
     {  
          fputcsv($output, $row);  
          
     }  
     fclose($output);  
}

if (isset($_POST["all"])){
     $connect = mysqli_connect("localhost", "root", "kiisgood", "test");  
     header('Content-Type: text/csv; charset=uft-8');  
     header('Content-Disposition: attachment; filename=AirboxDevice.csv');  
     $output = fopen("php://output", "w"); 
     fwrite($output, "\xEF\xBB\xBF");  
     fputcsv($output, array('Device_id', 'Chinese_name', 'Longitude', 'Latitude'));  
     $query = "SELECT * from device";  
     $result = mysqli_query($connect, $query); 
     
     while($row = mysqli_fetch_assoc($result))  
     {  
          fputcsv($output, $row);  
     }  
     fclose($output);  
}
 
 ?>  