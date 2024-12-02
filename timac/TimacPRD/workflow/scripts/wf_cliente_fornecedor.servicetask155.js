function servicetask155(attempt, message) {
	
	var contextWD = null;
	var dataSourceWD = null;
	var stDmlWD = null;
		
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		connectionWD = dataSourceWD.getConnection();
		
		
			if( getValueForm( "ies_tipo_cadastro", "" ) == 'C' ){
				var sql = "update clientes "+ 
						  "   set ies_situacao = 'A' "+
						  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
			
			}else{
			
				var sql = "update fornecedor "+ 
						  "   set ies_fornec_ativo = 'A' "+
						  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
				
			}

	} catch (e) {
		    //connectionWD.rollback();
		log.info("ERRO workflowEngineService G...." + e.toString());
			
	}
	finally {
		log.info('aprov_ped_sup ##### 6 #####');
		//connectionWD.commit();
		if (stDmlWD != null ) stDmlWD.close();
		if (connectionWD != null) connectionWD.close();
	}
	
	return true;
}