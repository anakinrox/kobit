function validateForm(form){
	
	var msg = '';
	
/*	if ( form.getValue('cod_repres') == null || form.getValue('cod_repres') == undefined || form.getValue('cod_repres') == '' ){
		msg += ' \n\r         Representante';
	}*/
	
	if ( form.getValue('login') == null || form.getValue('login') == undefined || form.getValue('login') == '' ){
		msg += ' \n\r         Usuário';
	}

	if ( form.getChildrenIndexes("empresa").length == 0 ){
		msg += ' \n\r         Empresa';
	}	
	
	
	if ( msg != '' ){
		throw 'É necessario informar os campos: '+msg;
	}
	
	
	//if( form.getValue('cod_repres') != "" ){
		 form.setValue('descricao', form.getValue('nome_usuario')+' - '+form.getValue('cod_repres')+' - '+form.getValue('raz_social') );
//	}else{
//		form.setValue('descricao', form.getValue('nome_usuario') );
//	}
	
}
