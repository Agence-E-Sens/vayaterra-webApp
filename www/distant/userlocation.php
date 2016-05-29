<?php
include('mysql_connect.php');



// APPLI -> DB
if(isset($_POST['updateSafetyLoc'])){

    $data = array();

    $val = $_POST['safetyLoc'];
    $id = $_POST['id_voyageur'];

    $del = "DELETE FROM `appli_safety` WHERE `id_voyageur` = $id";
    $deleted = mysqli_query($db,$del);
    if($deleted)
    {
        $ins = "INSERT INTO `appli_safety`(`id_voyageur`, `suiviActif`) VALUES ($id,$val)";
        $inserted = mysqli_query($db,$ins);
        if($inserted){
            $data['success']=true;
        }
        else{
            $data['success']= false;
            $data['error'] = 'Failure could not insert data';
        }
    }
    else{
        $data['success']= false;
        $data['error'] = 'Failure could not delete old data';
    }

    echo json_encode($data);

}
// DB -> APPLI

if(isset($_POST['storingLoc'])){

    $data = array();

    $val = $_POST['positions'];
    $id = $_POST['id_voyageur'];

        $ins = "INSERT INTO `appli_tracing`(`id_voyageur`, `serie5`) VALUES ($id,'$val')";
        $inserted = mysqli_query($db,$ins);
        if($inserted){
            $data['success']=true;
        }
        else{
            $data['success']= false;
            $data['error'] = 'Failure could not insert data';
        }


    echo json_encode($data);

}

