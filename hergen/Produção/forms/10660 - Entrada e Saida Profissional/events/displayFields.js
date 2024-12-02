function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task );
	
	if ( task == 0 || task == 4 ){
		
		var user = getValue("WKUser");	
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
		
		form.setValue('user_abert', user );
		form.setValue('nome_user_abert', colleagueMap.getValue(0,"colleagueName"));
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'dataSet', 'centro_de_custo', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'table', 'aprov_entrada_saida', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'filho_matricula', user, user, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset( 'paiFilho', null, constraints, null);		
    
		if ( dataset == null || dataset.rowsCount == 0 ){
			form.setValue('matricula', user );	
		}
		
		
	}
	 
	if ( task == 10 ){

		var user = getValue("WKUser");	
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);

		form.setValue('user_aprov', user );
		
	}
	
}