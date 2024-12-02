function servicetask5(attempt, message) {
	
	var usuarioAgenda = "";
	
    //var C1 = DatasetFactory.createConstraint('filtroGrupo', 'gestor_comercial', 'gestor_comercial', ConstraintType.MUST);
	var constraints = new Array();
	
	if( hAPI.getCardValue("processo") != "" ){
		constraints.push( DatasetFactory.createConstraint("processo", hAPI.getCardValue("processo"), hAPI.getCardValue("processo"), ConstraintType.MUST) );
	} 
	
	var datDS = DatasetFactory.getDataset('de_para_campo_transf_pendencia', null, constraints, null);
	var seq = 0;
	for(var i = 0; i < datDS.values.length; i++) {
		
		var processo = datDS.getValue(i, "processo");
		var tarefa = datDS.getValue(i, "tarefa");
		var field_cod = datDS.getValue(i, "field_cod");
		var field_desc = datDS.getValue(i, "field_desc");
		
 	    var connectionWD;
	    var statementWD;

		try{

			log.info( '$001... ' );
			var contextWD = new javax.naming.InitialContext();
			log.info( '$002... ' );
			var dataSourceWD = contextWD.lookup( 'java:/jdbc/FluigDS' );
			log.info( '$003... ' );
			connectionWD = dataSourceWD.getConnection();
			log.info( '$004... ' );
			
			sql = "	SELECT c.COD_LISTA "+
				"	  FROM def_proces d "+
				"	  JOIN vers_def_proces v ON (d.COD_EMPRESA = v.COD_EMPRESA AND d.COD_DEF_PROCES = v.COD_DEF_PROCES AND v.LOG_ATIV) "+
				"	  JOIN documento c ON (c.COD_EMPRESA = v.COD_EMPRESA AND c.NR_DOCUMENTO = v.NUM_PASTA_FORM AND c.VERSAO_ATIVA = 1) "+
				"    WHERE d.LOG_ATIV = 1 "+
				"	   AND d.COD_DEF_PROCES = '"+ processo +"' ";
	
			log.info( '$005... '+sql );
			statementWD = connectionWD.prepareStatement(sql);
			rsWD = statementWD.executeQuery();
			
		    if( rsWD.next() ){
		    
		    	var lista = rsWD.getString( "COD_LISTA" );
		    	 
		    	var proc_de = hAPI.getCardValue("num_proc_de");
		    	var proc_ate = hAPI.getCardValue("num_proc_ate");
		    	
		    	if( proc_de == "" ){
		    		proc_de = "0";
		    	}
		    	if( proc_ate == "" ){
		    		if( proc_de != "0" ){
		    			proc_ate = proc_de;
		    		}else{
		    			proc_ate = "999999999999";
		    		}
		    	}
		    	
		    	var update = " update ml001"+ getLPad( lista, '000' ) +" "+
						    "	SET "+ field_cod +" = '"+ hAPI.getCardValue("cod_usuario_para") +"'," +
						    "		"+ field_desc +" = '"+ hAPI.getCardValue("usuario_para") +"' "+
						    "		WHERE companyid = '1' "+
						    "		   AND "+ field_cod +" = '"+ hAPI.getCardValue("cod_usuario_de") +"' "+
						    "			AND ( SELECT COUNT(*) "+
						    "					  FROM documento "+ 
						    "					 WHERE documento.COD_EMPRESA = ml001"+ getLPad( lista, '000' ) +".companyid "+
						    "					   AND documento.NR_DOCUMENTO = ml001"+ getLPad( lista, '000' ) +".documentid "+
						    "						AND documento.NR_VERSAO = ml001"+ getLPad( lista, '000' ) +".version "+
						    "						AND documento.VERSAO_ATIVA = 1 ) > 0 "+
						    "		   AND ( SELECT COUNT(*) "+
						    "					 FROM anexo_proces "+  
						    "					 join proces_workflow on ( proces_workflow.COD_EMPRESA = anexo_proces.COD_EMPRESA "+ 
						    "						  						  and proces_workflow.NUM_PROCES = anexo_proces.NUM_PROCES ) "+
						    "					WHERE anexo_proces.COD_EMPRESA = ml001"+ getLPad( lista, '000' ) +".companyid "+
						    "					  and anexo_proces.NR_DOCUMENTO = ml001"+ getLPad( lista, '000' ) +".documentid "+
						    "					  AND proces_workflow.LOG_ATIV = 1 "+
						    "					  AND proces_workflow.STATUS = 0" +
						    "					  AND anexo_proces.NUM_PROCES BETWEEN "+ proc_de +" and "+ proc_ate +"  ) > 0 ";

		    	log.info( '$006... '+update );
		    	var stmWD = connectionWD.prepareStatement(update);
		    	stmWD.executeUpdate();
		    	
		    	var update = " INSERT INTO process_observation( "+
		    				"	COLLEAGUE_ID, TENANT_ID, MOV_SEQ, OBSERVATION, DT_OBSERVATION, "+ 
		    				"	NUM_PROCESS, NUM_SEQ, NUM_THREAD "+
		    				") "+
		    				" SELECT '"+ getValue("WKUser") +"', tar_proces.COD_EMPRESA, "+
		    			  	"		ifnull( (SELECT MAX(process_observation.MOV_SEQ) FROM process_observation "+
	    					"				 WHERE process_observation.TENANT_ID = tar_proces.COD_EMPRESA "+
		    				"	  		   		AND process_observation.NUM_PROCESS = tar_proces.NUM_PROCES "+
		    				"	  				AND process_observation.NUM_SEQ = tar_proces.NUM_SEQ_MOVTO ), 1 ) , "+
		    			  	"		'Usuario migrado por processo customizado ( "+ hAPI.getCardValue("usuario_de") +" -> "+ hAPI.getCardValue("usuario_para") +" ) ', "+
		    			  	"		CURDATE( ),  "+
		    			  	"		tar_proces.NUM_PROCES, tar_proces.NUM_SEQ_MOVTO, histor_proces.NUM_SEQ_THREAD "+
		    				"	FROM tar_proces "+
		    				"	JOIN histor_proces ON (histor_proces.COD_EMPRESA = tar_proces.COD_EMPRESA "+
		    				"						AND histor_proces.NUM_SEQ_MOVTO = tar_proces.NUM_SEQ_MOVTO "+
		    				"						AND histor_proces.NUM_PROCES = tar_proces.NUM_PROCES "+
		    				"						AND histor_proces.LOG_ATIV = 1   ) "+
		    				"	WHERE tar_proces.COD_EMPRESA = 1 "+
		    				"	  AND tar_proces.CD_MATRICULA = '"+ hAPI.getCardValue("cod_usuario_de") +"' "+
		    				"	  AND tar_proces.LOG_ATIV = 1 "+
		    				"	  AND (SELECT COUNT(*) FROM proces_workflow "+
		    				"		    WHERE proces_workflow.COD_EMPRESA = tar_proces.COD_EMPRESA "+
	    					"  		      AND proces_workflow.NUM_PROCES = tar_proces.NUM_PROCES "+
		    				" 			  AND proces_workflow.COD_DEF_PROCES = '"+ processo +"' "+
		    				"  			  AND proces_workflow.LOG_ATIV = 1) > 0 " +
		    				"	  AND tar_proces.NUM_PROCES BETWEEN "+ proc_de +" and "+ proc_ate +"  ";

		    	log.info( '$007... '+update );
		    	var stmWD = connectionWD.prepareStatement(update);
		    	stmWD.executeUpdate();

		    	var update = " UPDATE tar_proces "+
		    				" 	SET tar_proces.CD_MATRICULA = '"+ hAPI.getCardValue("cod_usuario_para") +"' "+
		    				" WHERE tar_proces.COD_EMPRESA = 1 "+
		    				"	AND tar_proces.CD_MATRICULA = '"+ hAPI.getCardValue("cod_usuario_de") +"' "+
		    				"	AND tar_proces.LOG_ATIV = 1 "+
		    				"	AND (SELECT COUNT(*) FROM proces_workflow "+
		    				" 			WHERE proces_workflow.COD_EMPRESA = tar_proces.COD_EMPRESA "+
	    					"		  	AND proces_workflow.NUM_PROCES = tar_proces.NUM_PROCES "+
		    				"			AND proces_workflow.COD_DEF_PROCES = '"+ processo +"' "+
		    				"			AND proces_workflow.LOG_ATIV = 1)" +
		    				"	  AND tar_proces.NUM_PROCES BETWEEN "+ proc_de +" and "+ proc_ate +" ";
		    		
		    	log.info( '$008... '+update );
		    	var stmWD = connectionWD.prepareStatement(update);
		    	stmWD.executeUpdate();
		         
			}
			
			rsWD.close();
			statementWD.close();
			connectionWD.close();
			
	    } catch (e){
			log.info( "ERRO"+ e.getMessage() );
			dataset.addColumn('status');
			dataset.addRow( new Array('Erro: '+e.getMessage()) );
		}
		finally {
	    	log.info('##### 6 #####');
	    	if(statementWD != null) statementWD.close();
	        if(connectionWD != null) connectionWD.close();
	    }	
	}
/*		
	SELECT * FROM ml0017293

	UPDATE ml0017293 a

	*/
	return true;
}
	

function getLPad(valor, pad){
	var str = "" + valor;
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}