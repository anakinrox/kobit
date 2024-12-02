function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    var strDate = sdf.format( new Date() );
    
	if( hAPI.getCardValue("descricao") != ""){
		
		var user = getValue("WKUser");	

		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('colleaguePK.colleagueId', user, user, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
		
		if (dataset != null && dataset.rowsCount > 0 ) {
	        var childData = new java.util.HashMap();
	        childData.put("data_hist", strDate );
	        childData.put("user_hist", dataset.getValue(0,"colleagueName") );
	        childData.put("cod_user_hist", user );
	        childData.put("desc_hist", hAPI.getCardValue("descricao") );
	        hAPI.addCardChild("followup", childData);
	        hAPI.setCardValue("descricao", "");
		}
	}
	
	if ( hAPI.getCardValue("gestor") == ""  && (nextSequenceId == "2" || nextSequenceId == "25" ) ){
		if (hAPI.getCardValue("usuario") == "pablo") {
			hAPI.setCardValue("gestor","S");
		} else {
			hAPI.setCardValue("gestor","N");
		}
	}
	
}