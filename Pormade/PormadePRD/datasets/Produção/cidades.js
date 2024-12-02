function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

	var listaConstraits = {};
	
	listaConstraits['codSolicitante'] = 'admlog';
	listaConstraits['dataDe'] = '01/01/2019';
	listaConstraits['dataAte'] = '31/12/2019';
	
	var tipoRetorno = 'R';
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	if( constraints[i].fieldName.trim().toUpperCase() == 'TIPO' ){
        		tipoRetorno = constraints[i].initialValue;
        	}else{
        		listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
        		log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
        	}
        }
    }	
	log.info( 'Start dataset ' );
	
    var newDataset = DatasetBuilder.newDataset();
    
    if( tipoRetorno == 'C'  ){
    	newDataset.addColumn( 'origem' );
    	newDataset.addColumn( 'valor_total' );
    }else if( tipoRetorno == 'A'  ){
    	newDataset.addColumn( 'origem' );
    	newDataset.addColumn( 'solicitante' );
    	newDataset.addColumn( 'codsolicitante' );
    	newDataset.addColumn( 'data_relatorio' );
    	newDataset.addColumn( 'gestor' );
    	newDataset.addColumn( 'codgestor' );
    	newDataset.addColumn( 'processo' );
    	newDataset.addColumn( 'tipodespesa' );
    	newDataset.addColumn( 'codTipoDespesa' );
    	newDataset.addColumn( 'resumo' );
    	newDataset.addColumn( 'data_desp' );
    	newDataset.addColumn( 'valor_desp' );
    	newDataset.addColumn( 'valor_km_dia' );
    	newDataset.addColumn( 'km_dia' );
    	newDataset.addColumn( 'num_seq_estado' );
    	newDataset.addColumn( 'den_status_processo' );
    } if( tipoRetorno == 'R'  ){
    	newDataset.addColumn( 'solicitante' );
    	newDataset.addColumn( 'codsolicitante' );
    	newDataset.addColumn( 'data_relatorio' );
    	newDataset.addColumn( 'gestor' );
    	newDataset.addColumn( 'codgestor' );
    	newDataset.addColumn( 'processo' );
    	newDataset.addColumn( 'valor_desp' );
    	newDataset.addColumn( 'valor_km_dia' );
    	newDataset.addColumn( 'km_dia' );
    	newDataset.addColumn( 'den_status_processo' );
    }

    try{    

		log.info( '$001... ' );
		var contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		var dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		log.info( '$003... ' );
		var connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );

		// ITEM
    	
		var sql = " select doc.COD_LISTA, " +
					" ml.COD_LISTA_FILHO as COD_FILHO_ITEM, " +
					" m2.COD_LISTA_FILHO as COD_FILHO_KM"+
			  		" from documento doc "+
			  		" join META_LISTA_REL ml on (ml.COD_EMPRESA = doc.COD_EMPRESA "+
			        "                     and ml.COD_LISTA_PAI = doc.COD_LISTA "+
			        "                     and ml.COD_TABELA = 'tbItens' ) "+
  					" join META_LISTA_REL m2 on (m2.COD_EMPRESA = doc.COD_EMPRESA "+
  					"                     and m2.COD_LISTA_PAI = doc.COD_LISTA "+
  					"                     and m2.COD_TABELA = 'tbKM' ) "+			        
			 		" where doc.COD_EMPRESA = 1 "+
			   		"   and doc.NM_DATASET = 'aprova_despesa' "+
			   		"   and doc.VERSAO_ATIVA = 1 ";
	
	
		log.info( '$005... '+sql );
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();

		var mlPai = '';
		var mlItem = '';
		var mlKm = '';
		
	    while(rsWD.next()) {
	    	mlPai = rsWD.getString( 'COD_LISTA' );
	    	mlItem = rsWD.getString( 'COD_FILHO_ITEM' );
	    	mlKm = rsWD.getString( 'COD_FILHO_KM' );
	    }

	    var where = '';
	    	
	    if( listaConstraits['dataDe'] != undefined && listaConstraits['dataDe'] != null && listaConstraits['dataDe'] != ''
 	         && listaConstraits['dataAte'] != undefined && listaConstraits['dataAte'] != null && listaConstraits['dataAte'] != '' ){	
	    	where += " and STR_TO_DATE( p.datadespesa, '%d/%m/%Y' ) between STR_TO_DATE( '"+ listaConstraits['dataDe'] +"', '%d/%m/%Y' ) and STR_TO_DATE( '"+ listaConstraits['dataAte'] +"', '%d/%m/%Y' ) ";
 		 }else if( listaConstraits['dataDe'] != undefined && listaConstraits['dataDe'] != null && listaConstraits['dataDe'] != '' ){	
 			where += " and STR_TO_DATE( p.datadespesa, '%d/%m/%Y' ) = STR_TO_DATE( '"+ listaConstraits['dataDe'] +"', '%d/%m/%Y' ) ";
 		 }else if( listaConstraits['dataAte'] != undefined && listaConstraits['dataAte'] != null && listaConstraits['dataAte'] != '' ){	
 			where += " and STR_TO_DATE( p.datadespesa, '%d/%m/%Y' ) = STR_TO_DATE( '"+ listaConstraits['dataAte'] +"', '%d/%m/%Y' ) ";
 		 }
 	     if( listaConstraits['codSolicitante'] != undefined && listaConstraits['codSolicitante'] != null && listaConstraits['codSolicitante'] != '' ){
 	    	where += " and p.codSolicitante = '"+ listaConstraits['codSolicitante'] +"' ";
 		 }
 	     if( listaConstraits['codgestor'] != undefined && listaConstraits['codgestor'] != null && listaConstraits['codgestor'] != '' ){
 	    	where += " and p.codgestor = '"+ listaConstraits['codgestor'] +"' ";
 		 }
		
 	    if( listaConstraits['status'] != undefined && listaConstraits['status'] != null && listaConstraits['status'] != '' ){
 	    	if( listaConstraits['status'] == 'B' ){
 	    		where += " and w.STATUS = 0 ";
 	    	}else if( listaConstraits['status'] == 'A' ){
 	    		where += " and w.STATUS = 0 " +
 	    			   " and x.NUM_SEQ_ESTADO in (10,12) ";
 	    	}else if( listaConstraits['status'] == 'V' ){
 	    		where += " and w.STATUS = 0 " +
  			   		   " and x.NUM_SEQ_ESTADO = 37 ";
 	    	}else if( listaConstraits['status'] == 'R' ){
 	    		where += " and w.STATUS = 0 " +
		   		       " and x.NUM_SEQ_ESTADO = 33 ";
 	    	}else if( listaConstraits['status'] == 'P' ){
 	    		where += " and w.STATUS = 2 ";
 	    	}
 	    }

	    
	    var sql = "select ";
	    if( tipoRetorno == 'C'  ){
	    	sql += " 	origem, "+
	    		   " 	sum( valor_desp + valor_km_dia ) as valor ";
	    }else if( tipoRetorno == 'A' ){
	    	sql += "    origem," +
	    		"		solicitante, "+
				"		codsolicitante, "+
				"		data_relatorio, "+
				"		gestor, "+
				"		codgestor, "+
				"		processo, "+
				"		tipodespesa, "+
				"		codTipoDespesa, "+
				"		resumo, "+
				"		data_desp, "+
				"		valor_desp, "+
				"		valor_km_dia, "+
				"		km_dia," +
				"       num_seq_estado," +
				"       den_status_processo ";
	    }else if( tipoRetorno == 'R'  ){
	    	sql += "    solicitante, "+
	    		"		codsolicitante, "+
	    		"		data_relatorio, "+
	    		"		gestor, "+
	    		"		codgestor, "+
	    		"		processo," +
	    		"		den_status_processo, "+
	    		"		sum( valor_desp ) as valor_desp, "+
	    		"		sum( valor_km_dia ) as valor_km_dia, "+
	    		"		sum( km_dia ) as km_dia " ;
	    }
	    
	    sql += 	" from (select 'item' as origem," +
			    "					p.companyid, " +
				"					p.solicitante, "+
				"		  			p.codsolicitante, "+
				"					STR_TO_DATE( p.datadespesa, '%d/%m/%Y' ) as data_relatorio, "+
				"					p.gestor, "+
				"					p.codgestor, "+
				"					a.NUM_PROCES as processo, "+
				"					ifnull(f.tipodespesa,'') as tipodespesa, "+
				"					ifnull(f.codTipoDespesa,'') as codTipoDespesa, "+
				"					f.resumo, "+
				"					STR_TO_DATE( f.datadespesanf, '%d/%m/%Y' ) as data_desp, "+
				"				   CAST( replace( replace( f.valordespesaitem, '.', '' ), ',', '.' ) as decimal(20,5) ) as valor_desp, "+
				"				   0 as valor_km_dia, "+
				"				   0 as km_dia " ;
	    if( tipoRetorno != 'C' ){		
			 sql += "		, x.NUM_SEQ_ESTADO as num_seq_estado, " +
			 		"		case when STATUS = 0 then v.DES_ESTADO "+ 	
					"  		    when STATUS = 2 then 'Finalizado' "+  
					"			when STATUS = 1 then 'Cancelado' "+  
					"			else '' end as den_status_processo ";
	    }
				
		 sql += "		  from ML001"+ getLPad( mlPai, '000' ) +" p "+
				"		  join ML001"+ getLPad( mlItem, '000' ) +" f on (p.companyid = f.companyid "+ 
				"							   and p.documentid = f.documentid "+ 
				"							   and p.version = f.version) "+
				"		  join DOCUMENTO d on (d.COD_EMPRESA = p.companyid "+ 
				"							 	 and d.NR_DOCUMENTO = p.documentid "+ 							 	 
				"							  	 and d.NR_VERSAO = p.version) "+
				"		  join anexo_proces a on (a.COD_EMPRESA = p.companyid "+
				"									 and a.NR_DOCUMENTO = p.documentid) "+ 
				"		  join proces_workflow	w on ( w.COD_EMPRESA = a.COD_EMPRESA "+
				"		  								   and w.NUM_PROCES = a.NUM_PROCES ) ";
		 
		if( tipoRetorno != 'C' ){		
		     sql += " 	  left join tar_proces t on (t.COD_EMPRESA = a.COD_EMPRESA "+ 
		 	    	"				             and t.NUM_PROCES = a.NUM_PROCES "+
		 	    	" 				             and t.LOG_ATIV = '1' ) "+
		 	    	"	  left join histor_proces x on (x.COD_EMPRESA = t.COD_EMPRESA "+ 
		 	    	"	   						    and x.NUM_PROCES = t.NUM_PROCES  "+
		 	    	"	 						    and x.NUM_SEQ_MOVTO = t.NUM_SEQ_MOVTO) "+ 						
		 	    	" 	  left join estado_proces v on (v.COD_EMPRESA = t.COD_EMPRESA  "+
		 	    	"	  						    and v.COD_DEF_PROCES = w.COD_DEF_PROCES "+ 
		 	    	"  							    and v.NUM_SEQ = x.NUM_SEQ_ESTADO  "+
		 	    	"							    and v.NUM_VERS = w.NUM_VERS) ";				
		}				
				
	     sql += "		 where p.companyid = 1 "+ 
				"		   and d.VERSAO_ATIVA = 1 "+ 
				"		   and w.STATUS <> 1 ";
	     
	     sql += where;
	     
 		 sql += "		union all "+
				"		select 'km' as origem," +
				"					p.companyid, " +
				"					p.solicitante, "+
				"		  			p.codsolicitante, "+
				"					STR_TO_DATE( p.datadespesa, '%d/%m/%Y' ) as data_relatorio, "+
				"					p.gestor, "+
				"					p.codgestor, "+
				"					a.NUM_PROCES as processo, "+
				"					'KM' as tipodespesa, "+
				"					'KM' as codTipoDespesa, "+
				"					f.resumo_km, "+
				"					STR_TO_DATE( f.datadespesa_km, '%d/%m/%Y' ) as data_desp, "+
				"					0 as valor_desp, "+
				"					CAST( replace( replace( f.km_valor_dia, '.', '' ), ',', '.' ) as decimal(20,5) ) as valor_km_dia, "+
				"					CAST( replace( replace( f.km_dia, '.', '' ), ',', '.' ) as decimal(20,5) ) as km_dia ";
	     
		if( tipoRetorno != 'C' ){		
			 sql += "		, x.NUM_SEQ_ESTADO as num_seq_estado, " +
		 			"		case when STATUS = 0 then v.DES_ESTADO "+ 	
		 			"  		    when STATUS = 2 then 'Finalizado' "+  
		 			"			when STATUS = 1 then 'Cancelado' "+  
		 			"			else '' end as den_status_processo ";
		}
		
		 sql += "		  from ML001"+ getLPad( mlPai, '000' ) +" p "+
				"		  join ML001"+ getLPad( mlKm, '000' ) +" f on (p.companyid = f.companyid "+
				"							   and p.documentid = f.documentid "+ 
				"							   and p.version = f.version) "+   
				"		  join DOCUMENTO d on (d.COD_EMPRESA = p.companyid "+ 
				"							 	 and d.NR_DOCUMENTO = p.documentid "+ 
				"							  	 and d.NR_VERSAO = p.version) "+ 
				"		  join anexo_proces a on (a.COD_EMPRESA = p.companyid "+ 
				"									 and a.NR_DOCUMENTO = p.documentid) "+ 
				"		  join proces_workflow	w on ( w.COD_EMPRESA = a.COD_EMPRESA "+ 
				"		  								   and w.NUM_PROCES = a.NUM_PROCES )";
		 if( tipoRetorno != 'C' ){				
	 	     sql += " 	  left join tar_proces t on (t.COD_EMPRESA = a.COD_EMPRESA "+ 
	 		 	    "				             and t.NUM_PROCES = a.NUM_PROCES "+
	 			    " 				             and t.LOG_ATIV = '1' ) "+
				    "	  left join histor_proces x on (x.COD_EMPRESA = t.COD_EMPRESA "+ 
				    "	   						    and x.NUM_PROCES = t.NUM_PROCES  "+
				    "	 						    and x.NUM_SEQ_MOVTO = t.NUM_SEQ_MOVTO) "+ 						
				    " 	  left join estado_proces v on (v.COD_EMPRESA = t.COD_EMPRESA  "+
				    "	  						    and v.COD_DEF_PROCES = w.COD_DEF_PROCES "+ 
				    "  							    and v.NUM_SEQ = x.NUM_SEQ_ESTADO  "+
				    "							    and v.NUM_VERS = w.NUM_VERS) ";
		 }
			   
 	     sql += "	 where p.companyid = 1 "+ 
				"		   and d.VERSAO_ATIVA = 1 "+ 
				"			and w.STATUS <> 1 ";
 	     
 	    sql += where;
 	    
		 sql += "	) as t " +
				" where 1=1 ";
	    
	    if( tipoRetorno == 'C'  ){
	    	sql += " group by origem ";
	    }else if( tipoRetorno == 'R'  ){
	    	sql += "  group by " +
	    	" 		solicitante, "+
    		"		codsolicitante, "+
    		"		data_relatorio, "+
    		"		gestor, "+
    		"		codgestor, "+
    		"		processo," +
    		"		den_status_processo " ;
	    }
		
		log.info( '$005... '+sql );
		if(statementWD != null) statementWD.close();
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();
		
		var i = 0;
		while(rsWD.next()) {
			i += 1;
			log.info('Entrou linha '+i);
			var arr = new Array();
			if( tipoRetorno == 'C' ){
				arr.push( rsWD.getString( 'origem') );
				arr.push( rsWD.getString( 'valor' ) );
			}else if( tipoRetorno == 'A' ){
				arr.push( rsWD.getString( 'origem') );
				arr.push( rsWD.getString( 'solicitante') );
				arr.push( rsWD.getString( 'codsolicitante') );
				arr.push( rsWD.getString( 'data_relatorio') );
				arr.push( rsWD.getString( 'gestor') );
				arr.push( rsWD.getString( 'codgestor') );
				arr.push( rsWD.getString( 'processo') );
				arr.push( rsWD.getString( 'tipodespesa') );
				arr.push( rsWD.getString( 'codTipoDespesa') );
				arr.push( rsWD.getString( 'resumo') );
				arr.push( rsWD.getString( 'data_desp') );
				arr.push( rsWD.getString( 'valor_desp') );
				arr.push( rsWD.getString( 'valor_km_dia') );
				arr.push( rsWD.getString( 'km_dia') );
				arr.push( rsWD.getString( 'num_seq_estado') );
				arr.push( rsWD.getString( 'den_status_processo') );
			}else if( tipoRetorno == 'R'  ){
				arr.push( rsWD.getString( 'solicitante') );
				arr.push( rsWD.getString( 'codsolicitante') );
				arr.push( rsWD.getString( 'data_relatorio') );
				arr.push( rsWD.getString( 'gestor') );
				arr.push( rsWD.getString( 'codgestor') );
				arr.push( rsWD.getString( 'processo') );
				arr.push( rsWD.getString( 'valor_desp') );
				arr.push( rsWD.getString( 'valor_km_dia') );
				arr.push( rsWD.getString( 'km_dia') );
				arr.push( rsWD.getString( 'den_status_processo') );
			}
			
			newDataset.addRow(arr);
			
		}

				
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}
	finally {
		log.info('##### 6 #####');
		if(statementWD != null) statementWD.close();
	    if(connectionWD != null) connectionWD.close();
	}	
	return newDataset;
	
	
}

function onMobileSync(user) {

}

function getLPad( valor, pad){
	var str = "" + valor;
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}