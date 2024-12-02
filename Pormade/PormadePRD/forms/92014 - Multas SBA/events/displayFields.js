function displayFields(form,customHTML){
	form.setValue('num_process', getValue('WKNumProces')  );
	form.setValue('task', getValue('WKNumState')  );
	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);	
	
	form.setValue('user_fup', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_fup', getValue('WKUser')  );
}