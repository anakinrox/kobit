function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
	if( hAPI.getCardValue("startAutomatico") == "" ){
		var ct = new Array();
		ct.push(DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST));
		var ds = DatasetFactory.getDataset("workflowProcess", null, ct, null);
		if (ds.rowsCount > 0){
			if( ds.getValue(0, "requesterId") == "admlog" ){
				hAPI.setCardValue("startAutomatico", "P");
			}else{
				hAPI.setCardValue("startAutomatico", "A");
			}
		}
	}
	
	
	var status = ''
	var idfluig = 'null';
	var cupom = hAPI.getCardValue("cupon");
    if ( nextSequenceId == 47 ||nextSequenceId == 33 ){
        status = 'COMPLEMENTO';
    }
    
    if (nextSequenceId == 38){
    	status = 'CADASTRADO';
        idfluig = getValue("WKNumProces");
    }
    
    if (nextSequenceId == 20){
    	status = 'ENVIADO';
    	idfluig = getValue("WKNumProces");
    }
	
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    var strDate = sdf.format( new Date() );
	if( hAPI.getCardValue("descricao") != ""){
        var childData = new java.util.HashMap();
        childData.put("data_hist", strDate );
        childData.put("data_prev_hist", hAPI.getCardValue("data_prev_fup") );
        childData.put("tipo_hist", hAPI.getCardValue("tipo_fup") );
        childData.put("user_hist", hAPI.getCardValue("user_fup") );
        childData.put("cod_user_hist", hAPI.getCardValue("cod_user_fup") );
        childData.put("desc_hist", hAPI.getCardValue("descricao") );
        
        if ( ( hAPI.getCardValue("startAutomatico") == 'P' || hAPI.getCardValue("startAutomatico") == 'A' ) && status != ''){
//        	log.info('### startAutomatico ###');
            
        	var SQL = "select nome, email, cidade, telefone, json, status, id_parceiro, id from kbt_t_parceiros_cupons "+ 
        			  "where idfluig = "+ getValue("WKNumProces") + " "+
        			  "	  or json->>'$.processo' = "+ getValue("WKNumProces");
        	var ct = new Array();
            ct.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
            ct.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));
            var ds = DatasetFactory.getDataset("select", null, ct, null);

            if ( ds != null && ds != undefined){
            	if (ds.rowsCount > 0){
//                    log.info(ds.getValue(0,'json'));
            		var jsonObj = JSON.parse(ds.getValue(0,'json'));

            		jsonObj['hist'].push({
            		  "data_hist": String(strDate),
        		      "desc_hist": String(hAPI.getCardValue("descricao")),
        		      "user_hist": String(hAPI.getCardValue("user_fup")),
        		      "cod_user_hist": String(hAPI.getCardValue("cod_user_fup"))
            		});
                    
            		jsonObj['id_deals'] = String(hAPI.getCardValue("id_deals"));
            		jsonObj['id_person'] = String(hAPI.getCardValue("id_person"));
            		
            		
            		var ct2 = new Array();
            		ct2.push(DatasetFactory.createConstraint("ACTION", 'UPDATE_CUPOM' ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("IDFLUIG", idfluig ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("NOME", ds.getValue(0,'nome') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("EMAIL", ds.getValue(0,'email') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("CIDADE", ds.getValue(0,'cidade') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("TELEFONE", ds.getValue(0,'telefone') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("JSON",  JSON.stringify(jsonObj), null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("STATUS", status ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("CUPOM", cupom ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("ID_PARCEIRO", ds.getValue(0,'id_parceiro') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("ID", ds.getValue(0,'id') ,null, ConstraintType.MUST));
                    var ds2 = DatasetFactory.getDataset("DS_SolicitacaoParceiros", null, ct2, null);
//                    log.info('### startAutomatico FIM ###');
            	}
            }
        }

        hAPI.addCardChild("folowup", childData);
        hAPI.setCardValue("descricao", "");
	} else {
		
		if ( ( hAPI.getCardValue("startAutomatico") == 'P' || hAPI.getCardValue("startAutomatico") == 'A' ) && status != ''){
//        	log.info('### startAutomatico ###');
        	
			var SQL = "select nome, email, cidade, telefone, json, status, id_parceiro, id from kbt_t_parceiros_cupons "+ 
					  "where idfluig = "+ getValue("WKNumProces") + " "+
					  "	  or json->>'$.processo' = "+ getValue("WKNumProces");
        	var ct = new Array();
            ct.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
            ct.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));
            var ds = DatasetFactory.getDataset("select", null, ct, null);

            if ( ds != null && ds != undefined){
            	if (ds.rowsCount > 0){
//                    log.info(ds.getValue(0,'json'));
            		
            		var jsonObj = JSON.parse(ds.getValue(0,'json'));

            		jsonObj['id_deals'] = String(hAPI.getCardValue("id_deals"));
            		jsonObj['id_person'] = String(hAPI.getCardValue("id_person"));
                    
            		var ct2 = new Array();
            		ct2.push(DatasetFactory.createConstraint("ACTION", 'UPDATE_CUPOM' ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("IDFLUIG", idfluig ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("NOME", ds.getValue(0,'nome') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("EMAIL", ds.getValue(0,'email') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("CIDADE", ds.getValue(0,'cidade') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("TELEFONE", ds.getValue(0,'telefone') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("JSON",  JSON.stringify(jsonObj), null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("STATUS", status ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("CUPOM", cupom ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("ID_PARCEIRO", ds.getValue(0,'id_parceiro') ,null, ConstraintType.MUST));
                    ct2.push(DatasetFactory.createConstraint("ID", ds.getValue(0,'id') ,null, ConstraintType.MUST));
                    var ds2 = DatasetFactory.getDataset("DS_SolicitacaoParceiros", null, ct2, null);
//                    log.info('### startAutomatico FIM ###');
            	}
            }
        }
		
	}
	
	// Atualiza Follow Up
		
}