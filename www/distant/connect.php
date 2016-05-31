<?php



# appel SPIP

include ('sha256.inc.php');
include ('mysql_connect.php');



$errors = array();  // array to hold validation errors
$data = array();        // array to pass back data

// validate the variables ========
if (empty($_POST['username']))
    $errors['username'] = 'Username is required.';

if (empty($_POST['password']))
    $errors['password'] = 'Password is required.';

// return a response ==============

// response if there are errors
if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors']  = $errors;
}

else {

	include('mysql_connect.php');

    //TEST User existant
    $login = $_POST['username'];
    $pass = $_POST['password'];
    $srcLog = "SELECT `alea_actuel` FROM `spip_auteurs` WHERE `login`='$login'";
    $logQuery = mysqli_query($db,$srcLog);

    if(mysqli_num_rows($logQuery)){

        $result = mysqli_fetch_assoc($logQuery);
        $crypted = sha256($result['alea_actuel'].$pass);

        $srcLog = "SELECT A.id_auteur, A.email, A.login, A.nom, B.safetyLoc, B.shareLoc FROM `spip_auteurs` as A LEFT JOIN `appli_safety` as B ON A.id_auteur = B.id_voyageur WHERE A.login='$login' AND A.pass='$crypted'";
        $logQuery = mysqli_query($db,$srcLog);

        if(mysqli_num_rows($logQuery)){
            // if there are no errors, return a message
            $data['message'] = mysqli_fetch_assoc($logQuery);
        }
        else{
            $errors['connexion'] = 'Connexion failed. Wrong password';
        }
    }
    else{
        $errors['username'] = "This username doesn't exist in our database";
    }

    if(!empty($data['message'])){
        $data['success'] = true;
    }
    else{
        $data['success'] = false;
        $data['errors'] = $errors;
    }
}

// return all our data to an AJAX call
echo json_encode($data);