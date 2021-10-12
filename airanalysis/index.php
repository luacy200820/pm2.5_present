<?php  
 $connect = mysqli_connect("localhost", "root", "kiisgood", "test");  
 $query ="SELECT * FROM device";  
 $result = mysqli_query($connect, $query);  
 ?>  
 <!DOCTYPE html>  
 <html>  
      <head>  
           <title>Webslesson Tutorial | Export Mysql Table Data to CSV file in PHP</title>  
           <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>  
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />  
           <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>  
      </head>  
      <body>  
           <br /><br />  
           <div class="container" style="width:900px;">  
                <h2 align="center">Export Mysql Table Data to CSV file in PHP</h2>  
                <h3 align="center">Employee Data</h3>                 
                <br />  
                <form method="post" action="export.php" align="center">  
                     <input type="submit" name="export" value="CSV Export" class="btn btn-success" />  
                     <input type="submit" name="device" value="ID Export" class="btn btn-success" />  
                </form>  
                <!-- <form method="post" action="export_id.php" align="center">  
                     <input type="submit" name="export" value="CSV Export" class="btn btn-success" />  
                     <input type="submit" name="export" value="ID Export" class="btn btn-success" />  
                </form>   -->
                <br />  
                <div class="table-responsive" id="employee_table">  
                     <table class="table table-bordered">  
                         
                     <?php  
                     while($row = mysqli_fetch_array($result))  
                     {  
                     ?>  
                          <tr>  
                               <td><?php echo $row["Id"]; ?></td>  
                               <td><?php echo $row["Id_name"]; ?></td>  
                               <td><?php echo $row["Longitude"]; ?></td>  
                               <td><?php echo $row["Latitude"]; ?></td>  
                            
                          
                          </tr>  
                     <?php       
                     }  
                     ?>  
                     </table>  
                </div>  
           </div>  
      </body>  
 </html>  