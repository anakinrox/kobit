function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task );
	log.info( 'task..........'+task+' '+ form.getValue('task') );
	form.setValue('processo', getValue('WKNumProces')  );
  	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	if( task == 0 || task == 4 || task == 119 ){
		
		form.setValue('user_abertura', colleagueMap.getValue(0,"colleagueName") );
		
		var ct = new Array();		
		ct.push( DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("chave", "codCallCenter", "codCallCenter", ConstraintType.MUST) );
		var par = DatasetFactory.getDataset("colleagueParam", null, ct, null);
		
		if ( par.rowsCount > 0 ) {
			form.setValue('cod_call_center_pipedrive', par.getValue(0,"val_param") );
			log.info( 'ENTREI..... ' );
		}
		
	}
	
	if( task == 59 || task == 61 || task == 63 ){
		form.setValue('matricula', getValue('WKUser') );
		form.setValue('nome_usuario', colleagueMap.getValue(0,"colleagueName") );
	}
	
	if( task != 20 && task != 12 ){ 
		form.setValue('user_fup', colleagueMap.getValue(0,"colleagueName"));
		form.setValue('cod_user_fup', getValue('WKUser')  );
	}
	
	if( task != 111 || task != 12 || task != 20 ){
		form.setValue('cod_user_dest_eng', getValue('WKUser') );
	}else if( form.getValue('cod_user_dest_eng') == "" ){
		form.setValue('cod_user_dest_eng', "Pool:Role:prospeccao_engenharia_adm" );
	}
	
	if( form.getValue('cod_user_dest') == "" || form.getValue('cod_user_dest') == "admlog" ){
		form.setValue('cod_user_dest', "Pool:Role:prospeccao_engenharia_adm" );
	}
	form.setValue('user_atual', getValue('WKUser')  );
	
}