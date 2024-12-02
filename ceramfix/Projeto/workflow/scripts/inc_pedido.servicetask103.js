function servicetask103(attempt, message) {
	
	
    var dataBase = 'java:/jdbc/LogixPRD';
    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
		
		connectionWD.setAutoCommit(false);
		
    
	    var sql = " select seq_item, " +
	    		"		   round(perc_lob_item,2) as perc_lob_item, " +
	    		"		   round(custo,2) as custo, " +
	    		"		   round(st,2) as st "+
	    		  "   from fluig_proc_item "+
	    		  "	 where num_processo = ? ";
    
		var statementWD = connectionWD.prepareStatement( sql );
		
		statementWD.setInt(1, parseInt( getValue("WKNumProces") ) );
		
		rsWD = statementWD.executeQuery();
		
		while(rsWD.next()){
			if( Math.round( getValueFormFloat( "perc_lob_item___" + rsWD.getInt("seq_item") ) ) != Math.round( rsWD.getFloat("perc_lob_item") ) ){
				throw 'Favor validar o Percentual do LOB do item '+rsWD.getInt("seq_item")+
				" - "+getValueFormFloat( "perc_lob_item___" + rsWD.getInt("seq_item") )+" - "+rsWD.getFloat("perc_lob_item");
			}
			if( Math.round( getValueFormFloat( "custo___" + rsWD.getInt("seq_item") ) ) != Math.round( rsWD.getFloat("custo") ) ){
				throw 'Favor validar o Percentual do CUSTO do item '+rsWD.getInt("seq_item");
			}			
			if( Math.round( getValueFormFloat( "st___" + rsWD.getInt("seq_item") ) ) != Math.round( rsWD.getFloat("st") ) ){
				throw 'Favor validar o Percentual do ST do item '+rsWD.getInt("seq_item");
			}
		}
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
		throw e.toString();
	}finally{
		if( rsWD != null ) rsWD.close();
		if( statementWD != null ) statementWD.close();
		if( connectionWD != null ) connectionWD.close();
	}
	    
	return true;
	
}