//---------------------------------------------
//FUNÇÃO PARA VALIDAR PREENCHIMENTO DOS CAMPOS
//---------------------------------------------
var beforeSendValidate = function(numState, nextState) {

	console.log("### beforeSendValidate ###");
	
	var valid = true;

	//PEGO OS CAMPOS DO FORMULARIO
	var cod_proc = $("#cod_proc").val()
	var descr_proc = $("#descr_proc").val()

	//CHECO SE TA VAZIO OU NULL
	if(cod_proc == '' || cod_proc == null || descr_proc == '' || descr_proc == null){
		valid= false;
		FLUIGC.toast({
			title: 'Atenção:',
			message: 'Os campos são obrigatórios',
			type: 'warning'			    			
		});
	}
	
	return valid;
}

