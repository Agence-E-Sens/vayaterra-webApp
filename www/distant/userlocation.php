<?php
include('mysql_connect.php');



// APPLI -> DB
if(isset($_POST['updateSafetyLoc'])){

    $data = array();

    $sl = $_POST['safetyLoc'];
    $sp = $_POST['shareLoc'];
    $id = $_POST['id_voyageur'];

    $del = "DELETE FROM `appli_safety` WHERE `id_voyageur` = $id";
    $deleted = mysqli_query($db,$del);
    if($deleted)
    {
        $ins = "INSERT INTO `appli_safety`(`id_voyageur`, `safetyLoc`, `shareLoc`) VALUES ($id,$sl,$sp)";
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

    $ins = "INSERT INTO `appli_tracing`(`id`,`id_voyageur`, `serie5`) VALUES (NULL,$id,'$val')";
        $inserted = mysqli_query($db,$ins);
        if($inserted){
            $data['success']=true;
        }
        else{
            $data['success']= false;
            $data['error'] = 'Failure could not insert data';
        }

        //echo $ins;
    echo json_encode($data);

}


//if(isset($_GET['testStoringLoc'])){

//    $data = array();

//    $val = $_GET['positions'];
//    $id = $_GET['id_voyageur'];

//    $ins = "INSERT INTO `appli_tracing`(`id`,`id_voyageur`, `serie5`) VALUES (NULL,$id,'$val')";
//    $inserted = mysqli_query($db,$ins);
//    if($inserted){
//        $data['success']=true;
//    }
//    else{
//        $data['success']= false;
//        $data['error'] = 'Failure could not insert data';
//    }

//    echo $ins;
//    //echo json_encode($data);

//}

//if(isset($_GET['testLoc'])){

//    $data = array();

//    $sl = $_GET['safetyLoc'];
//    $sp = $_GET['shareLoc'];
//    $id = $_GET['id_voyageur'];

//    $del = "DELETE FROM `appli_safety` WHERE `id_voyageur` = $id";
//    $deleted = mysqli_query($db,$del);
//    if($deleted)
//    {
//        $ins = "INSERT INTO `appli_safety`(`id_voyageur`, `safetyLoc`, `shareLoc`) VALUES ($id,$sl,$sp)";
//        echo $ins."<br>";
//        $inserted = mysqli_query($db,$ins);
//        if($inserted){
//            $data['success']=true;
//        }
//        else{
//            $data['success']= false;
//            $data['error'] = 'Failure could not insert data';
//        }
//    }
//    else{
//        $data['success']= false;
//        $data['error'] = 'Failure could not delete old data';
//    }

//    echo json_encode($data);

//}