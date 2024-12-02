<?php

$token = '66f1f0f57eff1cdfbf60163dfae13f90';
$domainname = 'https://eadpormade.com.br';

$data = json_decode(file_get_contents('php://input'), true);

$wIndAcao = !empty($data["indacao"])?$data["indacao"]:"";

// echo "Acao: " . $wIndAcao;

// REST RETURNED VALUES FORMAT
$restformat = 'json'; 

if ($wIndAcao == 'INC') {

    $wUser = !empty($data["username"])?$data["username"]:"";
    $wPassword = !empty($data["password"])?$data["password"]:"";
    $wFirstname = !empty($data["firstname"])?$data["firstname"]:"";
    $wLastname = !empty($data["lastname"])?$data["lastname"]:"";
    $wEmail = !empty($data["email"])?$data["email"]:"";

    // Incluir um usuário.
    $functionname = 'core_user_create_users';

    /// PARAMETERS - NEED TO BE CHANGED IF YOU CALL A DIFFERENT FUNCTION
    $user2 = new stdClass();
    $user2->username = $wUser;
    $user2->password = $wPassword;
    $user2->firstname = $wFirstname;
    $user2->lastname = $wLastname;
    $user2->email = $wEmail;
    $user2->timezone = 'Pacific/Port_Moresby';
    $users = array($user2);
    $params = array('users' => $users);    


    // $params[];
    // print_r($params);
    /// REST CALL
    header('Content-Type: text/plain');
    require_once('./curl.php');
    $curl = new curl;
    $restformat = ($restformat == 'json')?'&moodlewsrestformat=' . $restformat:'';
    $serverurl = $domainname . '/webservice/rest/server.php'. '?wstoken=' . $token . '&wsfunction=core_user_get_users&moodlewsrestformat=json&criteria[0][key]=email&criteria[0][value]=' . $wEmail;
    $resp = $curl->post($serverurl . $restformat);
    
    
    $wIdUserMoodle = '';
    $json2 = json_decode($resp);
	foreach($json2->users as $registro):
	    $wIdUserMoodle = $registro->id;
	endforeach;

// $wIdUserMoodle = '';
    if ($wIdUserMoodle == '') {
        $serverurl = $domainname . '/webservice/rest/server.php'. '?wstoken=' . $token . '&wsfunction='.$functionname;
        $resp = $curl->post($serverurl . $restformat, $params);
        $wRetorno = json_decode($resp, true);        
        
    } else {
                $wRetorno = array('id'=>$wIdUserMoodle,
                                    'exception'=>'Usuario ja cadastrado');        
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($wRetorno);    
}

if ($wIndAcao == 'COURSE') {
    
    $wUserID = !empty($data["userid"])?$data["userid"]:"";
    $wCurseID = !empty($data["curseid"])?$data["curseid"]:"";

    // Incluir em um curso.
    $functionname = 'enrol_manual_enrol_users';

    /// PARAMETERS - NEED TO BE CHANGED IF YOU CALL A DIFFERENT FUNCTION
   $enrolment = new stdClass();
   $enrolment->roleid = 5; //estudante(student) -> 5; moderador(teacher) -> 4; professor(editingteacher) -> 3;
   $enrolment->userid = intval($wUserID);
   $enrolment->courseid = intval($wCurseID);
   $enrolment->timestart = time();

   $enrolments = array( $enrolment);
   $params = array('enrolments' => $enrolments);

    /// REST CALL
    header('Content-Type: text/plain');
    $serverurl = $domainname . '/webservice/rest/server.php'. '?wstoken=' . $token . '&wsfunction='.$functionname;
    require_once('./curl.php');
    $curl = new curl;
    $restformat = ($restformat == 'json')?'&moodlewsrestformat=' . $restformat:'';
    $resp = $curl->post($serverurl . $restformat, $params);

    header('Content-Type: application/json; charset=UTF-8');

    // $wRetorno = json_decode($resp, true);
    echo json_encode($resp);    
}

if ($wIndAcao == 'CONSULTA') {
    
    $wUserID = !empty($data["userid"])?$data["userid"]:"";
    $wCurseID = !empty($data["curseid"])?$data["curseid"]:"";

    // Incluir em um curso.
    $functionname = 'core_completion_get_activities_completion_status';

    /// REST CALL
    $serverurl = $domainname . '/webservice/rest/server.php'. '?wstoken=' . $token . '&wsfunction='. $functionname . '&moodlewsrestformat=' . $restformat;
    $serverurl = $serverurl . '&userid=' .  $wUserID . '&courseid=' .  $wCurseID;

    $resp = file_get_contents($serverurl); 
 

    header('Content-Type: application/json; charset=UTF-8');

    // $wRetorno = json_decode($resp, true);
    $wRetorno = json_decode($resp, true); 
    echo json_encode($wRetorno);    
}

exit(0);

?>