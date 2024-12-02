function displayFields(form,customHTML){ 
	
	
	form.setShowDisabledFields(true);
	
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task  );
	form.setValue('numero', getValue('WKNumProces')  );
	form.setValue('user_atual', getValue('WKUser')  );
  	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	form.setValue('usuario_fup', colleagueMap.getValue(0,"colleagueName"));
	
	if ( task == 0 || task == 1 ){
		
		form.setValue('user_abert', getValue('WKUser')  );
		form.setValue('usuario_abert', colleagueMap.getValue(0,"colleagueName"));	
	}
	
	form.setValue('user_fup', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_fup', getValue('WKUser')  );

	form.setValue('user_com', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_com', getValue('WKUser')  );

	form.setValue('user_atr', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_atr', getValue('WKUser')  );

	
	form.setValue('num_pasta_projetos', '111952' );
	form.setValue('processo', getValue('WKNumProces') );
	
	
}