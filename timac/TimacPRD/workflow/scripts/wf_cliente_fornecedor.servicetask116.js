function servicetask116(attempt, message) {


	var tipo = "fornecedor";
	if( hAPI.getCardValue("ies_tipo_cadastro") == "C" ){
		tipo = "cliente";
	}
	
	var operacao = "Novo";
	if( hAPI.getCardValue("ies_operacao") == "A" ){
		operacao = "Alteração";
	}else if( hAPI.getCardValue("ies_operacao") == "I" ){
		operacao = "Bloqueio";
	} 
	
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		connectionWD = dataSourceWD.getConnection();
		
		var sql = " insert into tim_fluig_ccf_lg_k2( "+
			    	"	cod_fluxo, cod_fornecedor, data_solic, tipo, operacao, status "+  
			    	" )values( "+
			    	"	'"+ getValue("WKNumProces") +"'," +
			    	" 	'"+ hAPI.getCardValue("cod_cliente_fornecedor") +"'," +
			    	"	 today," +
			    	" 	'"+ tipo +"'," +
			    	" 	'"+ operacao +"'," +
			    	" 	'Analise K2' ) ";
			
		log.info("sql.......... " + sql);
		var stDmlWD = connectionWD.prepareStatement(sql);
		stDmlWD.executeUpdate();
			
		
		hAPI.setCardValue("status_k2","Analise K2");
				
	} catch (e) {
	    //connectionWD.rollback();
		log.info("ERRO insereK2...." + e.toString());
		throw "ERRO insereK2...." + e.toString();
		
	}
	finally {
		log.info('aprov_ped_sup ##### 6 #####');
		//connectionWD.commit();
		if (stDmlWD != null ) stDmlWD.close();
		if (connectionWD != null) connectionWD.close();
	}
	
	return true;
	
}