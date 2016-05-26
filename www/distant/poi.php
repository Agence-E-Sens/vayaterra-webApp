<?php

include('mysql_connect.php');


// APPLI -> DB
if(isset($_GET['sendPOI'])){



}



// DB -> APPLI
if(isset($_POST['getPoi'])){

    $data = array();
    $idornot = (isset($_POST['allorpublic']) ? $_POST['allorpublic']: false);
    $param = (($idornot != false) ? " OR `id_voyageur`=$idornot" : "");
    $query = "SELECT * FROM `appli_poi` WHERE `privacy`='public'";
    $result = mysqli_query($db,$query);

    if(mysqli_num_rows($result)){
        $result = mysqli_fetch_assoc($result);

        $data['success'] = true;
        $data['data'] = $result;
    }
    else{
        $data['success'] = false;
    }
    echo $query;
    echo json_encode($data);


}
