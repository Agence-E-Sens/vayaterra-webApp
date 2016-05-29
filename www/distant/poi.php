<?php

include('mysql_connect.php');


// APPLI -> DB
if(isset($_GET['sendPOI'])){

    $id = htmlentities($_POST['id_voyageur'], ENT_QUOTES);
    $nom = htmlentities($_POST['nom'], ENT_QUOTES);
    $desc = htmlentities($_POST['desc'], ENT_QUOTES);
    $type = htmlentities($_POST['type'], ENT_QUOTES);
    $lat = htmlentities($_POST['latitude'], ENT_QUOTES);
    $long = htmlentities($_POST['longitude'], ENT_QUOTES);

    $date = date('Y-m-d');


    $privacy = htmlentities($_POST['privacy'], ENT_QUOTES);
    $query = "INSERT INTO `appli_poi`(`id`,`id_voyageur`,`nom`,`desc`,`type`,`latitude`,`longitude`,`date`,`privacy`,`img`) VALUES(NULL, '$id', '$nom', '$desc', '$type', '$lat', '$long', '$date', '$privacy', NULL)";

    $data = array();

    $data['success'] = mysqli_query($db, $query);
    $data['query'] = $query;

    echo json_encode($data);

}



// DB -> APPLI
if(isset($_GET['getPoi'])){

    //var_dump($_POST);

    $data = array();
    $idornot = ((isset($_POST['allorpublic'])) ? $_POST['allorpublic']: false);
    $param = (($idornot != false) ? "OR `id_voyageur`=$idornot" : "");
    $query = "SELECT * FROM `appli_poi` WHERE `privacy`='public' $param";
    $result = mysqli_query($db,$query);

    if(mysqli_num_rows($result)){
        $markers = array();

        while ($poi = mysqli_fetch_assoc($result)){

            $marker = array();
            $marker['pos']=array();
            $marker['options']=array();

            foreach($poi as $key => $value){

                if($key === 'longitude' || $key ==='latitude'){
                    $marker['pos'][$key] = $value;
                }
                else{
                    $marker[$key]=$value;
                }
            }

            array_push($markers,$marker);


        }
        $data['success'] = true;
        $data['data']=$markers;


    }
    else{
        $data['success'] = false;
    }

    echo json_encode($data);


}
