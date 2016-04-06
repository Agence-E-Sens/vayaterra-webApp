<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


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
} else {

    $db = mysqli_connect('localhost', 'root', '', 'test') or die(mysqli_error($db));
    mysqli_query($db,"SET NAMES UTF8") or die(mysqli_error($db));

    $srcLog = "SELECT * FROM `user` WHERE `login`='{$_POST['username']}'";
    $logQuery = mysqli_query($db,$srcLog);

    if(mysqli_num_rows($logQuery)){

        $req = "SELECT `login`,`name`,`fname`,`bdate` FROM `user` WHERE `login`='{$_POST['username']}' AND `passwd`='{$_POST['password']}'";
        $res = mysqli_query($db,$req);

        if(mysqli_num_rows($res)){
            $res = mysqli_fetch_assoc($res);
            // if there are no errors, return a message
            $data['message'] = $res;
        }

        else{
            $errors['connexion'] = 'Connexion failed.';
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


