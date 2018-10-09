<html>
   <body>
      
      <form action="" method="POST" enctype="multipart/form-data">
         <input type="file" name="orderfile" />
         <input type="submit" name="submit" value="upload" />
      </form>
      
   </body>
</html>


<?php

$getOrder = $_POST['getOrder'];

if ($_SERVER["REQUEST_METHOD"] == "POST"){

  if(isset($_FILES['orderfile'])){
      $errors= array();
      $file_name = $_FILES['orderfile']['name'];
      $file_size =$_FILES['orderfile']['size'];
      $file_tmp =$_FILES['orderfile']['tmp_name'];
      $file_type=$_FILES['orderfile']['type'];
      $file_ext=strtolower(end(explode('.',$_FILES['orderfile']['name'])));
      
      if($file_ext != txt){
         $errors[]="Only txt file is allowed";
      }
      
      if($file_size > 1000000){
         $errors[]='File exceeds 1 MB';
      }
      
      if(empty($errors)){
         //move_uploaded_file($file_tmp,"UPLOADS/".$file_name);
         echo "Upload Success!";
      }else{
         print_r($errors);
      }
   }
}

$orderFile = fopen($file_tmp, "r") or die("Unable to open file!");
// Output one line until end-of-file

while (($line = fgets($orderFile)) !== false) {
    $arr = explode( ",", $line);
    $action = $arr[0];
    $ticker = $arr[1];
    $qty = $arr[2];

    $order = array(
        "action" => $action,
        "ticker" => $ticker,
        "qty" => $qty
    );
    
    print_r($order);
    $orders = array();  
           
    array_push($orders, $order);  //only printout orders[0] ??
}


fclose($myfile);

if ($getOrder == 'getOrder') {
    echo json_encode($orders);
}
?>
