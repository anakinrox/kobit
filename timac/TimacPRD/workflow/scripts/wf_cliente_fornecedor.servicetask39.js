function servicetask39(attempt, message) {
	
	try {
		log.info('aprov_ped_sup $001... ');
		var contextWD = new javax.naming.InitialContext();
		log.info('aprov_ped_sup $002... ');
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		log.info('aprov_ped_sup $003... ');
		connectionWD = dataSourceWD.getConnection();
		log.info('aprov_ped_sup $004... ');
		//connectionWD.setAutoCommit(true);
		log.info('aprov_ped_sup $004a... ');

	
		if(  getValueForm( "ies_tipo_cadastro", "" ) == 'C' ){
			var sql = "update clientes "+ 
					  "   set ies_situacao = 'S' "+
					  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
	
			log.info("sql.......... " + sql);
			var stDmlWD = connectionWD.prepareStatement(sql);
			stDmlWD.executeUpdate();
		}else{
			var sql = "update fornecedor "+ 
					  "   set ies_fornec_ativo = 'I' "+
					  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
	
			log.info("sql.......... " + sql);
			stDmlWD = connectionWD.prepareStatement(sql);
			stDmlWD.executeUpdate();
		}	
	} catch (e) {
	    //connectionWD.rollback();
		log.info("ERRO workflowEngineService G...." + e.toString());
		return false;
	}
	finally {
		log.info('aprov_ped_sup ##### 6 #####');
		//connectionWD.commit();
		if (stDmlWD != null ) stDmlWD.close();
		if (connectionWD != null) connectionWD.close();
	}
	return true;
}