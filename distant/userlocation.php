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

    //REQUETE ID COLLABS PROJET.
    //$id_collabs = array();

    //$req  = "SELECT DISTINCT ";
    //$req .= "	aut.id_auteur";
    //$req .= "FROM ";
    //$req .= "	spip_auteurs as aut ";
    //$req .= "	LEFT JOIN spip_auteurs_liens as autl ON aut.id_auteur = autl.id_auteur ";
    //$req .= "	LEFT JOIN spip_articles as art ON autl.id_objet = art.id_article ";
    //$req .= "	LEFT JOIN appli_safety as sf ON sf.id_voyageur = aut.id_auteurs ";
    //$req .= "WHERE ";
    //$req .= "	art.id_secteur = 16";
    //$req .= "    AND art.statut = 'publie'";
    //$req .= "    AND sf.shareLoc = 1";
    //$req .= "    AND aut.id_auteur != $id";

    //$request = mysqli_query($db,$req);
    //while($res = mysqli_fetch_assoc($request)){
    //    array_push($id_collabs,$res);
    //}


    //REQUETES DONNEES DE LOCALISATION GLOBALES

    $req  = "SELECT DISTINCT ";
    $req .= "	*";
    $req .= "FROM ";
    $req .= "	spip_auteurs as aut ";
    $req .= "	LEFT JOIN appli_tracing as tr ON tr.id_voyageur = aut.id_auteurs ";
    $req .= "	LEFT JOIN appli_safety as sf ON sf.id_voyageur = aut.id_auteurs ";
    $req .= "WHERE ";
    $req .= "    sf.shareLoc = 1";
    $req .= "    AND aut.id_auteur != $id";

    $selectAll = mysqli_query($db,$req);
    while ($_5pos = mysqli_fetch_assoc($selectAll)){
        array_push($data['autres'],$_5pos);
    }


    //REQUETE DONNEES DE LOCALISATION COLLABS

    //$req  = "SELECT DISTINCT ";
    //$req .= "	*";
    //$req .= "FROM ";
    //$req .= "	spip_auteurs as aut ";
    //$req .= "	LEFT JOIN appli_tracing as tr ON tr.id_voyageur = aut.id_auteurs ";
    //$req .= "	LEFT JOIN appli_safety as sf ON sf.id_voyageur = aut.id_auteurs ";
    //$req .= "WHERE ";
    //$req .= "    sf.shareLoc = 1";
    //$req .= "    AND aut.id_auteur != $id";
    //foreach($id_collabs as $value)
    //{
    //    $req .= "AND aut.id_auteur = $value";
    //}
    //$selectCol = mysqli_query($db,$req);

    //while ($_5pos = mysqli_fetch_assoc($selectCol)){
    //    array_push($data['project'],$_5pos);
    //}

    //echo $ins;
    echo json_encode($data);

}



if(isset($_POST['usersPos'])){

    $id = $_POST['id_voyageur'];

    $data = array();
    $data["project"]=array();
    $data["autres"]=array();

    $array = array();

    //REQUETES DONNEES DE LOCALISATION GLOBALES

    $req  = "SELECT DISTINCT ";
    $req .= "	aut.id_auteur, aut.login, tr.serie5 ";
    $req .= "FROM ";
    $req .= "	spip_auteurs AS aut ";
    $req .= "	LEFT JOIN appli_tracing AS tr ON tr.id_voyageur = aut.id_auteur ";
    $req .= "	LEFT JOIN appli_safety AS sf ON sf.id_voyageur = aut.id_auteur ";
    $req .= "WHERE ";
    $req .= "    sf.shareLoc = 1 ";
    $req .= "    AND aut.id_auteur != $id ";
    $req .= "ORDER BY tr.id DESC ";


    $selectAll = mysqli_query($db,$req);
    while ($_5pos = mysqli_fetch_assoc($selectAll)){

        $login = $_5pos["login"];
        ////var_dump($_5pos["login"]);
        //echo $login;
        if(array_key_exists($login,$array)){

        }
        else{
            $array[$login] = array();
            $array[$login] = $_5pos;
        }
    }
    foreach ($array as $value){
        array_push($data["autres"],$value);
    }
    //array_push($data['autres'],$_5pos);
    //var_dump ($array);
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