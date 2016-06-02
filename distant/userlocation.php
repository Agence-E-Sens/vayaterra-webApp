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


if(isset($_POST['getFriendsLoc'])){

    $val = $_POST['positions'];
    $id = $_POST['id_voyageur'];

    $data = array();
    $data['project']=array();
    $data['autres']=array();

    $id_collabs = array();

    $req  = "SELECT DISTINCT ";
    $req .= "	aut.id_auteur";
    $req .= "FROM ";
    $req .= "	spip_auteurs as aut ";
    $req .= "	LEFT JOIN spip_auteurs_liens as autl ON aut.id_auteur = autl.id_auteur ";
    $req .= "	LEFT JOIN spip_articles as art ON autl.id_objet = art.id_article ";
    $req .= "WHERE ";
    $req .= "	art.id_secteur = 16";
    $req .= "    AND art.statut = 'publie'";
    $req .= "    AND aut.id_auteur != $id";

    $request = mysqli_query($db,$req);
    while($res = mysqli_fetch_assoc($request)){
        array_push($id_collabs,$res);
    }


    $selectAll = "SELECT * FROM `appli_tracing` WHERE `id_voyageur` != $id";
    $res = mysqli_query($db,$selectAll);
    while ($_5pos = mysqli_fetch_assoc($res)){

        array_push($data['autres'],$marker);
        array_push($data['autres'],$marker);
    }




    $tra  ="SELECT ";
    $tra .="	* ";
    $tra .="FROM ";
    $tra .="	appli_tracing as tra ";
    $tra .="	LEFT JOIN spip_auteurs as aut ON tra.id_voyageur = aut.id_auteur ";
    $tra .="WHERE";
    $tra .="1";









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