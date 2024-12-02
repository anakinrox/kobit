function displayFields(form,customHTML){
	
	// form.setShowDisabledFields(true);
	// form.setHidePrintLink(true);
	
	var user = getValue("WKUser");
	var activity = getValue("WKNumState");
		
	
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
		
		form.setValue("dataSolic", getCurrentDate());	
		
	}
	
	customHTML.append("<script>");
	customHTML.append("function getState() { return " + activity + "; };");
	customHTML.append("function getUser() { return '" + user + "'; };");
	customHTML.append("function getMobile() { return '" + form.getMobile() + "'; };");
	customHTML.append("function getFormMode() { return '" + form.getFormMode() + "'; };");
	customHTML.append("function getCardId() { return '" + form.getDocumentId() + "'; };");
	customHTML.append("function isManager() { return " + getValue("WKManagerMode") + "; };");
	customHTML.append("</script>");
}


function getCurrentDate(){
	var dtHoje = new Date();
	var dd = ("0" + dtHoje.getDate()).slice(-2);
	var MM = ("0" + (dtHoje.getMonth()+1)).slice(-2);
	var yyyy = dtHoje.getFullYear();
	
	return dd + "/" + MM + "/" + yyyy;
}