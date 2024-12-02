function displayFields(form,customHTML){
	
	
	var activity = getValue('WKNumState');
	
	
	
	if (activity == 0 || activity == 4 ) {
		var datasetReturned = DatasetFactory.getDataset("ds_pg_pmd_parametrosGerais", null, null, null);
		for(var i = 0; i < datasetReturned.rowsCount; i++){             
			var codOrcamento 			= datasetReturned.getValue(i, "orcamento_config_cod");             
		    var dias_entrega            = datasetReturned.getValue(i, "ocg_dias_prev_entrega");
		    var comentario_entrega      = datasetReturned.getValue(i, "ocg_comentario_prev_entrega");
		    var desconto_vendedor       = datasetReturned.getValue(i, "orc_desconto_vendedor_porc_formatado");
		    var porcentagem_frete       = datasetReturned.getValue(i, "ocg_frete_porcentagem_formatado");
		    var sequencia_proposta      = datasetReturned.getValue(i, "sequencia_num_proposta");
		    var valor                   = datasetReturned.getValue(i, "valor_fsc_formatado");
		    var dias_expiracao          = datasetReturned.getValue(i, "dias_expiracao_proposta");
		    var cond_pagto_cod          = datasetReturned.getValue(i, "cond_pagto_padrao_proposta");
		    var cond_pagto_descricao    = datasetReturned.getValue(i, "descricao_cond_pagto");
		    var entrega_comp_modelo     = datasetReturned.getValue(i, "prev_entrega_comp_modelo");
		    var valor_frete     		= datasetReturned.getValue(i, "valor_frete_min_formatado");
		    var grupo     				= datasetReturned.getValue(i, "grupo_visualiza_prop");
		    var grupoEmail     			= datasetReturned.getValue(i, "grupo_email_fecha");
		    var anexoProp     			= datasetReturned.getValue(i, "pasta_anexo_prop");
		    var anexoFechamento     	= datasetReturned.getValue(i, "pasta_fechamento");
		    var pastaInstaladora     	= datasetReturned.getValue(i, "pasta_instaladora");
		    var grupoExpira     		= datasetReturned.getValue(i, "grupo_email_expira");
		    var sequencia_cidade    	= datasetReturned.getValue(i, "seq_cidade_fluig");
		}
		if(grupo != ""){
			var filtra_grupoAdv = DatasetFactory.createConstraint("groupId", grupo, grupo, ConstraintType.MUST);
			var datasetGrupos = DatasetFactory.getDataset("group", null, new Array(filtra_grupoAdv), null);
			for(var j = 0; j < datasetGrupos.rowsCount; j++){
				var desc_grupo = datasetGrupos.getValue(j, "groupDescription")
				
			}
		}else{
			var desc_grupo = "";
		}	
		
		if(grupoEmail != ""){
			var filtra_grupoAdv = DatasetFactory.createConstraint("groupId", grupoEmail, grupoEmail, ConstraintType.MUST);
			var datasetGruposEmail = DatasetFactory.getDataset("group", null, new Array(filtra_grupoAdv), null);
			for(var j = 0; j < datasetGruposEmail.rowsCount; j++){
				var desc_grupo_email = datasetGruposEmail.getValue(j, "groupDescription")
				
			}
		}else{
			var desc_grupo_email = "";
		}	
		
		if(grupoExpira != ""){
			var filtra_grupoAdv = DatasetFactory.createConstraint("groupId", grupoExpira, grupoExpira, ConstraintType.MUST);
			var datasetGruposExpira = DatasetFactory.getDataset("group", null, new Array(filtra_grupoAdv), null);
			for(var j = 0; j < datasetGruposExpira.rowsCount; j++){
				var desc_grupo_expira = datasetGruposExpira.getValue(j, "groupDescription")
				
			}
		}else{
			var desc_grupo_expira = "";
		}	
		
		    log.info("codOrcamento "+desc_grupo);
		    form.setValue('orcamento_config_cod', codOrcamento);
		    form.setValue('ocg_dias_prev_entrega', dias_entrega);
		    form.setValue('ocg_comentario_prev_entrega', comentario_entrega);
		    form.setValue('orc_desconto_vendedor_porc', desconto_vendedor);
		    form.setValue('ocg_frete_porcentagem', porcentagem_frete);
		    form.setValue('sequencia_num_proposta', sequencia_proposta);
		    form.setValue('valor_fsc', valor);
		    form.setValue('dias_expiracao_proposta', dias_expiracao);
		    form.setValue('condicao_pagamento_cod', cond_pagto_cod);
		    form.setValue('cond_pagto_padrao_proposta', cond_pagto_descricao);
		    form.setValue('prev_entrega_comp_modelo', entrega_comp_modelo);
		    form.setValue('valor_frete_min', valor_frete);
		    form.setValue('id_grupo_prop', grupo);
		    form.setValue('desc_grupo_prop', desc_grupo);
		    form.setValue('valor_frete_min', valor_frete);
		    form.setValue('id_grupo_email', grupoEmail);
		    form.setValue('desc_grupo_email', desc_grupo_email);
		    form.setValue('pasta_anexo_prop', anexoProp);
		    form.setValue('pasta_fechamento', anexoFechamento);
		    form.setValue('pasta_instaladora', pastaInstaladora);
		    form.setValue('id_grupo_expira', grupoExpira);
		    form.setValue('desc_grupo_expira', desc_grupo_expira);
		    form.setValue('seq_cidade_fluig', sequencia_cidade);
		//}

	}
	
}