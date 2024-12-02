function servicetask74(attempt, message) {
	
	var area = hAPI.getCardValue("area");	
	var deal = hAPI.getCardValue("id_deals");
	var area_v = hAPI.getCardValue("area_vendedor");
	var deal_v = hAPI.getCardValue("id_deals_vendedor");
	var pipedriveUser = hAPI.getCardValue("id_user_pipedrive");
	
	if ( deal != "" ) {
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( "9b4993871584a554c83f15cdee87c96f0d0260a7" , hAPI.getCardValue("cupon"), null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "area" , area, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "deal" , deal, null, ConstraintType.MUST) );
		var deals = DatasetFactory.getDataset("pipedriveDealsUPD", null, constraints, null);
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( "area" , area, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "content" , hAPI.getCardValue("user_fup").trim()+": Cupom atualizado", null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "user_id" , pipedriveUser, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "deal_id" , deal, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "pinned_to_deal_flag" , "0", null, ConstraintType.MUST) );
		var pipedriveNote = DatasetFactory.getDataset("pipedriveNoteDML", null, constraints, null); 
	}
	
	if ( deal_v != "" ) {
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( "9b4993871584a554c83f15cdee87c96f0d0260a7" , hAPI.getCardValue("cupon"), null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "area" , area_v, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "deal" , deal_v, null, ConstraintType.MUST) );
		var deals = DatasetFactory.getDataset("pipedriveDealsUPD", null, constraints, null);
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( "area" , area_v, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "content" , hAPI.getCardValue("user_fup").trim()+": Cupom atualizado", null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "user_id" , pipedriveUser, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "deal_id" , deal_v, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( "pinned_to_deal_flag" , "0", null, ConstraintType.MUST) );
		var pipedriveNote = DatasetFactory.getDataset("pipedriveNoteDML", null, constraints, null); 
	}
	
	return true;
}