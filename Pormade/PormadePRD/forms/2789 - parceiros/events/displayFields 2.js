function displayFields(form,customHTML){ 
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task  );
	form.setValue('processo', getValue('WKNumProces')  );
	form.setValue('user_atual', getValue('WKUser')  );
  	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	form.setValue('usuario_fup', colleagueMap.getValue(0,"colleagueName"));
	
	
	var c1 = DatasetFactory.createConstraint('matricula', getValue("WKUser") , getValue("WKUser"), ConstraintType.MUST);
	var userCom = DatasetFactory.getDataset('usuario_comercial', null , new Array(c1), null);
	//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
	log.info('userCom '+userCom.rowsCount );
	if( userCom.rowsCount > 0  ){
		if( userCom.getValue(0, "tipo_usuario") == 'VA' ){
			form.setValue("tipo_cadastro", 'A' );
		}else if( userCom.getValue(0, "tipo_usuario") == 'VI' ) {
			form.setValue("tipo_cadastro", 'I' );
		}
	}
	
	if ( task == 0 || task == 4 ){
		form.setValue('cod_usuario_abert', getValue('WKUser')  );
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_abert', sdf.format(dtNow) );
	}
	
	if( form.getValue('usuario_respon') == "" ){
		form.setValue('cod_usuario_respon', getValue('WKUser') );
		form.setValue('usuario_respon', colleagueMap.getValue(0,"colleagueName") );	
	}
	
	form.setValue('user_fup', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_fup', getValue('WKUser')  );
	
	
	/*if ( task != 20 ){
		form.setEnabled("cupon",false);
	}*/
}