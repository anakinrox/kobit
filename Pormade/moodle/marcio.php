<?php

$data = json_decode(file_get_contents('php://input'), true);

echo "AQUI>>>>>>";
    
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

$enrolments = array($enrolment);
$params = array('enrolments' => $enrolments);

/// REST CALL
header('Content-Type: text/plain');
$serverurl = $domainname . '/webservice/rest/server.php'. '?wstoken=' . $token . '&wsfunction='.$functionname;
require_once('./curl.php');
$curl = new curl;
$restformat = ($restformat == 'json')?'&moodlewsrestformat=' . $restformat:'';
$resp = $curl->post($serverurl . $restformat, $params);

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($resp);
exit(0);

?>