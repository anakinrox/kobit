function servicetask57(attempt, message) {

	var integraPipeDrive = hAPI.getCardValue("solicitou_orcamento");
	var somenteCadastro = hAPI.getCardValue("somente_cadastro");
	var idDeal = hAPI.getCardValue("id_deals");
	var pipeDriveVendedor = hAPI.getCardValue("id_user_vendedor");
	if( integraPipeDrive == "N" || somenteCadastro == "S"){
		return true;
	}
	
	if ( pipeDriveVendedor == "" ){
		var pipedriveUser = hAPI.getCardValue("id_user_pipedrive");
		var area = hAPI.getCardValue("area");
	} else {
		var pipedriveUser = hAPI.getCardValue("id_user_vendedor");
		var area = hAPI.getCardValue("area_vendedor");
	}
	
	if ( pipedriveUser == '' ){
		throw "Usuário PipeDrive não carregado, não será possível incluir a Deal.";
	}

	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
	var pipe = DatasetFactory.getDataset("pipedrive", null, constraints, null);

	if( pipe.rowsCount == 0 ){
		throw "Não cadastrado parametro para esse tipo de integração.";
	}

	var tipoPessoa = hAPI.getCardValue("fisico_juridico");
	var idPerson = hAPI.getCardValue("id_person");
	var orgId = hAPI.getCardValue("id_org");
	var sysIntegra = hAPI.getCardValue("sis_integracao");
	
	if ( sysIntegra != '2' ){		
		if ( tipoPessoa == "J" ){
			if( orgId == "" ){
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
							var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "token_organization", "token_organization", ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pipe.getValue(0,"documentid"), pipe.getValue(0,"documentid"), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pipe.getValue(0,"version"), pipe.getValue(0,"version"), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
				
				var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null );
				if ( datasetFilhos != null ){
					for(var i = 0; i < datasetFilhos.rowsCount; i++ ){
						constraints.push( DatasetFactory.createConstraint( datasetFilhos.getValue(i,"token_org"), hAPI.getCardValue( datasetFilhos.getValue(i,"campo_org") ), null, ConstraintType.MUST) );		
					}
				}
				
				var pipedriveOrganizationsDML = DatasetFactory.getDataset("pipedriveOrganizationsDML", null, constraints, null);
				if( pipedriveOrganizationsDML.rowsCount == 0 ){
					throw "Não foi possivel registrar nova organização.";
				}else{
					orgId = pipedriveOrganizationsDML.getValue(0,"id");
					
					hAPI.setCardValue("id_org", orgId ); 
				}			
				
			}
			
			if ( idPerson == "" && hAPI.getCardValue("pessoa_contato") != "" && hAPI.getCardValue("telefone_pessoa") != ""){
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
				
				var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "token_person", "token_person", ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pipe.getValue(0,"documentid"), pipe.getValue(0,"documentid"), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pipe.getValue(0,"version"), pipe.getValue(0,"version"), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
				
				var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null );
				if ( datasetFilhos != null ){
					for(var i = 0; i < datasetFilhos.rowsCount; i++ ){
						constraints.push( DatasetFactory.createConstraint( datasetFilhos.getValue(i,"token_pes"), hAPI.getCardValue( datasetFilhos.getValue(i,"campo_pes") ), null, ConstraintType.MUST) );		
					}
				}				
				
				constraints.push( DatasetFactory.createConstraint( "org_id", orgId , null, ConstraintType.MUST) );
				
				
				var pipedrivePersonDML = DatasetFactory.getDataset("pipedrivePersonDML", null, constraints, null);
				if( pipedrivePersonDML.rowsCount == 0 ){
					throw "Não foi possivel registrar novo contato.";
				}else{
					idPerson = pipedrivePersonDML.getValue(0,"id");
					
					hAPI.setCardValue("id_person", idPerson );
				}
			}
		}
				
		if ( idPerson == "" && tipoPessoa == 'F'){
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "token_person", "token_person", ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pipe.getValue(0,"documentid"), pipe.getValue(0,"documentid"), ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pipe.getValue(0,"version"), pipe.getValue(0,"version"), ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null );
			if ( datasetFilhos != null ){
				for(var i = 0; i < datasetFilhos.rowsCount; i++ ){
					constraints.push( DatasetFactory.createConstraint( datasetFilhos.getValue(i,"token_pes"), hAPI.getCardValue( datasetFilhos.getValue(i,"campo_pes") ), null, ConstraintType.MUST) );		
				}
			}				
			
			constraints.push( DatasetFactory.createConstraint( "org_id", orgId , null, ConstraintType.MUST) );
			
			var pipedrivePersonDML = DatasetFactory.getDataset("pipedrivePersonDML", null, constraints, null);
			if( pipedrivePersonDML.rowsCount == 0 ){
				throw "Não foi possivel registrar novo contato.";
			}else{
				idPerson = pipedrivePersonDML.getValue(0,"id");
				
				hAPI.setCardValue("id_person", idPerson );
			}
		}
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("title", hAPI.getCardValue("nome"), null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("person_id", idPerson, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("org_id", orgId , null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("pipeline_id", pipe.getValue(0,"id_funil"), null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("user_id", pipedriveUser, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("area" , area, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( pipe.getValue(0,"token_area"), area, null, ConstraintType.MUST) );
		var ctP = new Array();
		ctP.push( DatasetFactory.createConstraint("___int___id", hAPI.getCardValue("cod_origem"), hAPI.getCardValue("cod_origem"), ConstraintType.MUST) );
		ctP.push( DatasetFactory.createConstraint("table", "online.pon_origem_negocio", null, ConstraintType.MUST) );
		var orig = DatasetFactory.getDataset('selectTablePostgreSQL', ['origem_negocio','id_pipedrive'], ctP, null );
		if( orig.rowsCount > 0 ){
			constraints.push( DatasetFactory.createConstraint( pipe.getValue(0,"token_origem"), orig.getValue(0,"id_pipedrive") , null, ConstraintType.MUST) );
		}
		constraints.push( DatasetFactory.createConstraint( pipe.getValue(0,"token_proc_fluig"), getValue("WKNumProces"), null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( pipe.getValue(0,"token_showroom"), hAPI.getCardValue("showroom").replace('Pool:Role:',''), null, ConstraintType.MUST) );
			
		var constraintsFilhos = new Array();
		constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "token_deal", "token_deal", ConstraintType.MUST) );
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pipe.getValue(0,"documentid"), pipe.getValue(0,"documentid"), ConstraintType.MUST) );
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pipe.getValue(0,"version"), pipe.getValue(0,"version"), ConstraintType.MUST) );
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
		
		var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null );
		if ( datasetFilhos != null ){
			for(var i = 0; i < datasetFilhos.rowsCount; i++ ){
				if( hAPI.getCardValue( datasetFilhos.getValue(i,"campo_opor") ) != "" 
				 && hAPI.getCardValue( datasetFilhos.getValue(i,"campo_opor") ) != undefined
				 && hAPI.getCardValue( datasetFilhos.getValue(i,"campo_opor") ) != null ){
					constraints.push( DatasetFactory.createConstraint( datasetFilhos.getValue(i,"token_opor"), hAPI.getCardValue( datasetFilhos.getValue(i,"campo_opor") ), null, ConstraintType.MUST) );
				}
			}
		}
		var deals = DatasetFactory.getDataset("pipedriveDealsDML", null, constraints, null);
		
		if( deals.rowsCount > 0 ){
			if ( pipeDriveVendedor == "" ){
				hAPI.setCardValue("id_deals", deals.getValue(0,"id") );
			} else {
				hAPI.setCardValue("id_deals_vendedor", deals.getValue(0,"id") );
			}
			
		}
	     
		try{
			 
			var obsGeral = 'Solicitação de proposta realizado via fluig' + ' \n '+ ' \n '+
					 		'Nome do Parceiro: ' + hAPI.getCardValue("nome").trim() + ' \n '+
							'Patrocinador do Parceiro: ' + hAPI.getCardValue("usuario_respon").trim() + '\n '+
							'Dados Orçamento: ' + hAPI.getCardValue("dados_orcamento").trim();
	    	     	
	    	var constraints = new Array();
		   	constraints.push( DatasetFactory.createConstraint( "area" , area, null, ConstraintType.MUST) );
		   	constraints.push( DatasetFactory.createConstraint( "content" , obsGeral, null, ConstraintType.MUST) );
		   	constraints.push( DatasetFactory.createConstraint( "user_id" , pipedriveUser, null, ConstraintType.MUST) );
		   	constraints.push( DatasetFactory.createConstraint( "deal_id" , deals.getValue(0,"id"), null, ConstraintType.MUST) );
		   	constraints.push( DatasetFactory.createConstraint( "pinned_to_deal_flag" , "0", null, ConstraintType.MUST) );
		   	var pipedriveNote = DatasetFactory.getDataset("pipedriveNoteDML", null, constraints, null); 
		   	  
		 }catch(e){
		 }
		 
		 try {
			 log.info ( 'entrou anexos ');
			 log.info ( deals.getValue(0,"id") );
			 var attachments = hAPI.listAttachments();
		     
		     for (var i = 0; i < attachments.size(); i++) {
		 	    var attachment = attachments.get(i);	     
		 	    var constraints = new Array();
		 		constraints.push( DatasetFactory.createConstraint( "area" , area, null, ConstraintType.MUST) );
		 		constraints.push( DatasetFactory.createConstraint( "deal_id" , deals.getValue(0,"id"), null, ConstraintType.MUST) );
		 		constraints.push( DatasetFactory.createConstraint( "file" , attachment.getDocumentId(), null, ConstraintType.MUST) );
		 		var deals = DatasetFactory.getDataset("pipedriveFile", null, constraints, null);
		     }
		}catch(e){
		}
	}
	
	if ( sysIntegra == '2' ){
		
		var json = {}
		
		json['nome'] = String( hAPI.getCardValue("nome") );
		json['cnpj_cpf'] = String( hAPI.getCardValue("cnpj_cpf") );
		json['fisico_juridico'] = String( hAPI.getCardValue("fisico_juridico") );
		json['rg_ie'] = String( hAPI.getCardValue("rg_ie") );
		json['cep'] = String( hAPI.getCardValue("rg_ie") );
		json['endereco'] = String( hAPI.getCardValue("endereco") );
		json['numero'] = String( hAPI.getCardValue("numero") );
		json['site'] = String( hAPI.getCardValue("site") );
		json['bairro'] = String( hAPI.getCardValue("bairro") );
		json['den_cidade'] = String( hAPI.getCardValue("den_cidade") );
		json['uf'] = String( hAPI.getCardValue("uf") );
		json['cod_pais'] = String( hAPI.getCardValue("cod_pais") );
		json['telefone1'] = String( hAPI.getCardValue("telefone1") );
		json['email'] = String( hAPI.getCardValue("email") );
		json['pessoa_contato'] = String( hAPI.getCardValue("pessoa_contato") );
		json['cpf_pessoa'] = String( hAPI.getCardValue("cpf_pessoa") );
		json['telefone_pessoa'] = String( hAPI.getCardValue("telefone_pessoa") );
		json['email_pessoa'] = String( hAPI.getCardValue("email_pessoa") );
		json['data_nascimento'] = String( hAPI.getCardValue("data_nascimento") );
		
		var pipeDriveVendedor = hAPI.getCardValue("id_user_vendedor");
		
		if ( pipeDriveVendedor == "" ){
			var pipedriveUser = hAPI.getCardValue("id_user_pipedrive");
			var area = hAPI.getCardValue("area");
		} else {
			var pipedriveUser = hAPI.getCardValue("id_user_vendedor");
			var area = hAPI.getCardValue("area_vendedor");
		}
		
		json['id_crm'] = String( pipedriveUser );
		
		json['area'] = String( area );
			
		json['valor'] = String( "0" );
		json['proposta'] = String( "0" );
		json['id_origem'] = String( hAPI.getCardValue("cod_origem") );
		json['cod_origem'] = String( hAPI.getCardValue("cod_origem") );
		json['titulo'] = String( json['nome'] );
		
		var constraint = [
			DatasetFactory.createConstraint("JSON", JSON.stringify( json ), null, ConstraintType.MUST)
        ];
		
		var ds = DatasetFactory.getDataset('crmCard', null, constraint, null );
		
		
		
		hAPI.setCardValue("id_person", ds.getValue(0, 'id_person') );
		hAPI.setCardValue("id_person", ds.getValue(0, 'id_org') );
		
		if ( pipeDriveVendedor == "" ){
			hAPI.setCardValue("id_deals", ds.getValue(0, 'id_deals') );
		} else {
			hAPI.setCardValue("id_deals_vendedor", ds.getValue(0, 'id_deals') );
		}
		
//		throw "Falta integração com CRM SIS";
	}
	 
	return true
}