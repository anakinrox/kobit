function intermediateconditional131() {
	
	
	log.info("intermediateconditional51..............."+getValue("WKNumProces") );
	
	 var ct = new Array(); 
	 ct.push( DatasetFactory.createConstraint("cod_fluxo", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST) );				
	 ct.push( DatasetFactory.createConstraint("table", "tim_fluig_ccf_lg_k2", null, ConstraintType.MUST) );
    var ds = DatasetFactory.getDataset("selectLogix", ["status"], ct, null);
    log.info("rowsCount..............."+ds.rowsCount );
	 if ( ds.rowsCount > 0 ){
		 hAPI.setCardValue("status_k2",ds.getValue(0, "status") );
		 log.info("status..............."+ds.getValue(0, "status")+"..." );
		 if( ds.getValue(0, "status").trim() != "Analise K2" ){
			 return true;
		 }else{
			 return false;
		 }
	 }else{
		 return true;
	 }
	
}