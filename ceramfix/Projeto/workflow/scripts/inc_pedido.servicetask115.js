function servicetask115(attempt, message) {
	return ajustaMLItens();
	//return true;
}

function ajustaMLItens(){
	
	var dfs = java.text.DecimalFormatSymbols();
	dfs.setDecimalSeparator(',');
	dfs.setPerMill('.');
	df2 = new java.text.DecimalFormat("0.00",dfs);
	
    var dataBase = 'java:/jdbc/LogixPRD';
    
    var constraints = new Array();
    constraints.push( DatasetFactory.createConstraint("dataSet", 	"pedidos", 		null, ConstraintType.MUST) );
    constraints.push( DatasetFactory.createConstraint("table", 		"ped_itens", 	null, ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset('dsk_Table_name', null, constraints, null);
	var tableFilha = dataset.getValue(0, "tableFilha");
	
	log.info( 'IF_FORM.....'+ getValue('WKFormId') +" ... "+ getValue('WKCardId') );
    
	var dataSourceWD = null;
	var connectionWD = null;
	var statementWD = null;
	var dataSourceWDfg = null;
	var connectionWDfg = null;
	var statementWDfg = null;
	
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();

		//var contextWDfg = new javax.naming.InitialContext();
		var dataSourceWDfg = contextWD.lookup("java:/jdbc/AppDS");
		var connectionWDfg = dataSourceWDfg.getConnection();
		connectionWDfg.setAutoCommit(false);
		
    
	    var sql = " select 	seq_item,  cod_item, " +
	    		"			round( custo, 2 ) as custo, "+ 
			   			" 	round( icms, 2 ) as icms, "+
			   			"	round( pis, 2 ) as pis, "+
			   			"	round( cofins, 2 ) as cofins, "+
			   			"	round( comis, 2 ) as comis, "+
			   			"	round( st, 2 ) as st, "+
			   			"	round( ipi, 2 ) as ipi, "+
			   			"	round( acordo_comerc, 2 ) as acordo_comerc, "+
			   			"	round( custo_trans, 2 ) as custo_trans, "+
			   			" 	round( verb_mark, 2 ) as verb_mark, "+
			   			"	round( perc_lob_item, 2 ) as perc_lob_item, "+
			   			"	round( ult_preco, 2 ) as ult_preco, "+
			   			"	round( ult_desc, 2 ) as ult_desc, "+
			   			" 	ies_apv_desc_item_reg as ies_apv_desc_item_reg, "+
			   			"	ies_apv_desc_item_nac as ies_apv_desc_item_nac, "+
			   			"	ult_preco_unit_liq as ult_preco_unit_liq, "+
			   			"	custo_aditivo as custo_aditivo, "+
			   			"	custo_agregado as custo_agregado, "+
			   			"	custo_cimento as custo_cimento, "+
			   			"	custo_embalagem as custo_embalagem, "+
			   			"	custo_materia_prima as custo_materia_prima, "+
			   			"	custo_material_secundario as custo_material_secundario, "+
			   			"	custo_material_revenda as custo_material_revenda, "+
			   			"	custo_servico_terceiro as custo_servico_terceiro, "+
			   			"	custo_embalagem_logistica as custo_embalagem_logistica, "+
			   			"	custo_transferecia as custo_transferecia, "+
			   			"	verba_marketing as verba_marketing, "+
			   			"	acordo_comercial as acordo_comercial, "+
			   			"	verba_rapel as verba_rapel, "+
			   			"	verba_cross_dock as verba_cross_dock, "+
			   			"	royaltie as royaltie, "+
			   			"	perc_prev_lob_aen as perc_prev_lob_aen "+ 
	    		  "   from fluig_proc_item "+
	    		  "	 where num_processo = ? ";
    
	    log.info('sql select......'+sql);
	    
		statementWD = connectionWD.prepareStatement( sql );
		
		statementWD.setInt(1, parseInt( getValue("WKNumProces") ) );
		
		var rsWD = statementWD.executeQuery();
		
		while(rsWD.next()){
			
			var sql = 	" update "+ tableFilha +" "+ 
		   			"    set custo = '"+ df2.format( rsWD.getFloat("custo") ) +"', "+  
		   			" 		 icms = '"+ df2.format( rsWD.getFloat("icms") ) +"', "+
		   			"		 pis = '"+ df2.format( rsWD.getFloat("pis") ) +"', "+
		   			"		 cofins = '"+ df2.format( rsWD.getFloat("cofins") ) +"', "+
		   			"		 comis = '"+ df2.format( rsWD.getFloat("comis") ) +"', "+
		   			"	     st = '"+ df2.format( rsWD.getFloat("st") ) +"', "+
		   			"		 ipi = '"+ df2.format( rsWD.getFloat("ipi") ) +"', "+
		   			"		 acordo_comerc = '"+ df2.format( rsWD.getFloat("acordo_comerc") ) +"', "+
		   			"		 custo_trans = '"+ df2.format( rsWD.getFloat("custo_trans") ) +"', "+
		   			" 		 verb_mark = '"+ df2.format( rsWD.getFloat("verb_mark") ) +"', "+
		   			
		   			"		 perc_lob_item = '"+ df2.format( rsWD.getFloat("perc_lob_item") ) +"', "+
		   			"	     ult_preco = '"+ df2.format( rsWD.getFloat("ult_preco") ) +"', "+
		   			"		 ult_desc = '"+ df2.format( rsWD.getFloat("ult_desc") ) +"', "+
		   			" 		 ies_apv_desc_item_reg = '"+ rsWD.getString("ies_apv_desc_item_reg") +"', "+
		   			"		 ies_apv_desc_item_nac = '"+ rsWD.getString("ies_apv_desc_item_nac") +"', "+
		   			"		 ult_preco_unit_liq = '"+ df2.format( rsWD.getFloat("ult_preco_unit_liq") ) +"', "+
		   			"		 custo_aditivo = '"+ df2.format( rsWD.getFloat("custo_aditivo") ) +"', "+
		   			"		 custo_agregado = '"+ df2.format( rsWD.getFloat("custo_agregado") ) +"', "+
		   			"		 custo_cimento = '"+ df2.format( rsWD.getFloat("custo_cimento") ) +"', "+
		   			"		 custo_embalagem = '"+ df2.format( rsWD.getFloat("custo_embalagem") ) +"', "+
		   			
		   			"		 custo_materia_prima = '"+ df2.format( rsWD.getFloat("custo_materia_prima") ) +"', "+
		   			"		 custo_material_secundario = '"+ df2.format( rsWD.getFloat("custo_material_secundario") ) +"', "+
		   			"		 custo_material_revenda = '"+ df2.format( rsWD.getFloat("custo_material_revenda") ) +"', "+
		   			"		 custo_servico_terceiro = '"+ df2.format( rsWD.getFloat("custo_servico_terceiro") ) +"', "+
		   			"		 custo_embalagem_logistica = '"+ df2.format( rsWD.getFloat("custo_embalagem_logistica") ) +"', "+
		   			"		 custo_transferecia = '"+ df2.format( rsWD.getFloat("custo_transferecia") ) +"', "+
		   			"		 verba_marketing = '"+ df2.format( rsWD.getFloat("verba_marketing") ) +"', "+
		   			"		 acordo_comercial = '"+ df2.format( rsWD.getFloat("acordo_comercial") ) +"', "+
		   			"		 verba_rapel = '"+ df2.format( rsWD.getFloat("verba_rapel") ) +"', "+
		   			"		 verba_cross_dock = '"+ df2.format( rsWD.getFloat("verba_cross_dock") ) +"', "+
		   			
		   			"		 val_royaltie = '"+ df2.format( rsWD.getFloat("royaltie") ) +"', "+
		   			"		 perc_prev_lob_aen = '"+ df2.format( rsWD.getFloat("perc_prev_lob_aen") ) +"' "+ 
		   			"  where id in ( select id "+
		            "    			   from ( select rownum as seq, a.* "+ 
		            "	             			from "+ tableFilha +" a" +
		            "							join documento d on (d.cod_empresa = a.companyid "+
		            "                     						 and d.nr_documento = a.documentid "+
		            "                     						 and d.nr_versao = a.version "+
		            "                     						 and d.versao_ativa = 1) "+
		            "            			   where a.documentid = "+ getValue('WKCardId') +" "+
		            "							 and trim( a.cod_item ) = trim( '"+ rsWD.getString("cod_item") +"' ) "+
		            "            			   order by a.rowid ) t "+
		            //"            	  where t.seq = "+ rsWD.getInt("seq_item") +
		            "				 ) "+
		   			"	and trim( cod_item ) = trim( '"+ rsWD.getString("cod_item") +"' ) ";
			
			log.info('sql update......'+sql);
			
			statementWDfg = connectionWDfg.prepareStatement( sql );
		/*	
			log.info('sql update 1......'+ df2.format( rsWD.getFloat("custo") ) );
			statementWDfg.setString(1, df2.format( rsWD.getFloat("custo") ) );
			hAPI.setCardValue("custo___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo") ) );
			
			log.info('sql update 2......'+ df2.format( rsWD.getFloat("icms") ) );
			statementWDfg.setString(2, df2.format( rsWD.getFloat("icms") ) );
			hAPI.setCardValue("icms___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("icms") ) );
			
			log.info('sql update 3......'+ df2.format( rsWD.getFloat("pis") ) );
			statementWDfg.setString(3, df2.format( rsWD.getFloat("pis") ) );
			hAPI.setCardValue("pis___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("pis") ) );
			
			log.info('sql update 4......'+ df2.format( rsWD.getFloat("cofins") ) );
			statementWDfg.setString(4, df2.format( rsWD.getFloat("cofins") ) );
			hAPI.setCardValue("cofins___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("cofins") ) );
			
			log.info('sql update 5......'+ df2.format( rsWD.getFloat("comis") ) );
			statementWDfg.setString(5, df2.format( rsWD.getFloat("comis") ) );
			hAPI.setCardValue("comis___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("comis") ) );
			
			log.info('sql update 6......'+ df2.format( rsWD.getFloat("st") ) );
			statementWDfg.setString(6, df2.format( rsWD.getFloat("st") ) );
			hAPI.setCardValue("st___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("st") ) );
			
			log.info('sql update 7......'+ df2.format( rsWD.getFloat("ipi") ) );
			statementWDfg.setString(7, df2.format( rsWD.getFloat("ipi") ) );
			hAPI.setCardValue("ipi___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("ipi") ) );
			
			log.info('sql update 8......'+ df2.format( rsWD.getFloat("acordo_comerc") ) );
			statementWDfg.setString(8, df2.format( rsWD.getFloat("acordo_comerc") ) );
			hAPI.setCardValue("acordo_comerc___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("acordo_comerc") ) );
			
			log.info('sql update 9......'+ df2.format( rsWD.getFloat("custo_trans") ) );
			statementWDfg.setString(9, df2.format( rsWD.getFloat("custo_trans") ) );
			hAPI.setCardValue("custo_trans___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_trans") ) );
			
			log.info('sql update 0......'+ df2.format( rsWD.getFloat("verb_mark") ) );
			statementWDfg.setString(10, df2.format( rsWD.getFloat("verb_mark") ) );
			hAPI.setCardValue("verb_mark___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("verb_mark") ) );
			
			log.info('sql update 1......'+ df2.format( rsWD.getFloat("perc_lob_item") ) );
			statementWDfg.setString(11, df2.format( rsWD.getFloat("perc_lob_item") ) );
			hAPI.setCardValue("perc_lob_item___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("perc_lob_item") ) );
			
			log.info('sql update 2......'+ df2.format( rsWD.getFloat("ult_preco") ) );
			statementWDfg.setString(12, df2.format( rsWD.getFloat("ult_preco") ) );
			hAPI.setCardValue("ult_preco___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("ult_preco") ) );
			
			log.info('sql update 3......'+ df2.format( rsWD.getFloat("ult_desc") ) );
			statementWDfg.setString(13, df2.format( rsWD.getFloat("ult_desc") ) );
			hAPI.setCardValue("ult_desc___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("ult_desc") ) );
			
			log.info('sql update 4......'+ rsWD.getString("ies_apv_desc_item_reg") );
			statementWDfg.setString(14, rsWD.getString("ies_apv_desc_item_reg") );
			hAPI.setCardValue("___" + rsWD.getInt("seq_item"), rsWD.getString("ies_apv_desc_item_reg") );
			
			log.info('sql update 5......'+ rsWD.getString("ies_apv_desc_item_nac") );
			statementWDfg.setString(15, rsWD.getString("ies_apv_desc_item_nac") );
			hAPI.setCardValue("___" + rsWD.getInt("seq_item"), rsWD.getString("ies_apv_desc_item_nac") );
			
			log.info('sql update 6......'+ rsWD.getFloat("ult_preco_unit_liq") );
			statementWDfg.setString(16, rsWD.getFloat("ult_preco_unit_liq") );
			hAPI.setCardValue("ult_preco_unit_liq___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("ult_preco_unit_liq") ) );
			
			log.info('sql update 7......'+ rsWD.getFloat("custo_aditivo") );
			statementWDfg.setString(17, rsWD.getFloat("custo_aditivo") );
			hAPI.setCardValue("custo_aditivo___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_aditivo") ) );
			
			log.info('sql update 8......'+ rsWD.getFloat("custo_agregado") );
			statementWDfg.setString(18, rsWD.getFloat("custo_agregado") );
			hAPI.setCardValue("custo_agregado___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_agregado") ) );
			
			log.info('sql update 9......'+ rsWD.getFloat("custo_cimento") );
			statementWDfg.setString(19, rsWD.getFloat("custo_cimento") );
			hAPI.setCardValue("custo_cimento___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_cimento") ) );
			
			log.info('sql update 0......'+ rsWD.getFloat("custo_embalagem") );
			statementWDfg.setString(20, rsWD.getFloat("custo_embalagem") );
			hAPI.setCardValue("custo_embalagem___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_embalagem") ) );
			
			log.info('sql update 1......'+ rsWD.getFloat("custo_materia_prima") );
			statementWDfg.setString(21, rsWD.getFloat("custo_materia_prima") );
			hAPI.setCardValue("custo_materia_prima___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_materia_prima") ) );
			
			log.info('sql update 2......'+ rsWD.getFloat("custo_material_secundario") );
			statementWDfg.setString(22, rsWD.getFloat("custo_material_secundario") );
			hAPI.setCardValue("custo_material_secundario___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_material_secundario") ) );
			
			log.info('sql update 3......'+ rsWD.getFloat("custo_material_revenda") );
			statementWDfg.setString(23, rsWD.getFloat("custo_material_revenda") );
			hAPI.setCardValue("custo_material_revenda___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_material_revenda") ) );
			
			log.info('sql update 4......'+ rsWD.getFloat("custo_servico_terceiro") );
			statementWDfg.setString(24, rsWD.getFloat("custo_servico_terceiro") );
			hAPI.setCardValue("custo_servico_terceiro___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_servico_terceiro") ) );
			
			log.info('sql update 5......'+ rsWD.getFloat("custo_embalagem_logistica") );
			statementWDfg.setString(25, rsWD.getFloat("custo_embalagem_logistica") );
			hAPI.setCardValue("custo_embalagem_logistica___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_embalagem_logistica") ) );
			
			log.info('sql update 6......'+ rsWD.getFloat("custo_transferecia") );
			statementWDfg.setString(26, rsWD.getFloat("custo_transferecia") );
			hAPI.setCardValue("custo_transferecia___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("custo_transferecia") ) );
			
			log.info('sql update 7......'+ rsWD.getFloat("verba_marketing") );
			statementWDfg.setString(27, rsWD.getFloat("verba_marketing") );
			hAPI.setCardValue("verba_marketing___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("verba_marketing") ) );
			
			log.info('sql update 8......'+ rsWD.getFloat("acordo_comercial") );
			statementWDfg.setString(28, rsWD.getFloat("acordo_comercial") );
			hAPI.setCardValue("acordo_comercial___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("acordo_comercial") ) );
			
			log.info('sql update 9......'+ rsWD.getFloat("verba_rapel") );
			statementWDfg.setString(29, rsWD.getFloat("verba_rapel") );
			hAPI.setCardValue("verba_rapel___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("verba_rapel") ) );
			
			log.info('sql update 0......'+ rsWD.getFloat("verba_cross_dock") );
			statementWDfg.setString(30, rsWD.getFloat("verba_cross_dock") );
			hAPI.setCardValue("verba_cross_dock___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("verba_cross_dock") ) );
			
			log.info('sql update 1......'+ rsWD.getFloat("royaltie") );
			statementWDfg.setString(31, rsWD.getFloat("royaltie") );
			hAPI.setCardValue("val_royaltie___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("royaltie") ) );
			
			log.info('sql update 2......'+ rsWD.getFloat("perc_prev_lob_aen") );
			statementWDfg.setString(32, rsWD.getFloat("perc_prev_lob_aen") );
			hAPI.setCardValue("perc_prev_lob_aen___" + rsWD.getInt("seq_item"), df2.format( rsWD.getFloat("perc_prev_lob_aen") ) );
			
			
			log.info('sql update 3......'+ parseInt( getValue('WKCardId') ) );
			statementWDfg.setInt(33, parseInt( getValue('WKCardId') ) );

			log.info('sql update 4......'+  parseInt( rsWD.getInt("seq_item") ) );
			statementWDfg.setInt(34, parseInt( rsWD.getInt("seq_item") ) );

			log.info('sql update 5......'+  rsWD.getString("cod_item") );
			statementWDfg.setString(35, rsWD.getString("cod_item") );
			*/
			statementWDfg.executeUpdate();
		}
		connectionWDfg.commit();
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
		throw e.toString();
	}finally{
		//if( rsWD != null ) rsWD.close();
		if( statementWD != null ) statementWD.close();
		if( connectionWD != null ) connectionWD.close();
		if( statementWDfg != null ) statementWDfg.close();
		if( connectionWDfg != null ) connectionWDfg.close();
	}
	    
	return true;
	
}