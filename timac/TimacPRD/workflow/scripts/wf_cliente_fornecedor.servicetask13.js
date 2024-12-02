function servicetask13(attempt, message) {
	
	log.info(" entrei servicetask35..... ");
	
	var numProcess = getValue("WKNumProces");
	log.info( 'CARD_DATA...............'+numProcess );
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = ""+sdf.format(dtNow).substring(0,10);
	
	var dataAbertTxt = ""+getValueForm( "dat_abert", dataTxt ).split('/').reverse().join('-');
	var dataCadTxt = ""+getValueForm( "dat_cadastro", dataTxt ).split('/').reverse().join('-');
	
	var dataNasc = ""+getValueForm("data_nascimento", dataTxt).split('/').reverse().join('-');
		
	var cgc_cpf = "";
    if ( getValueForm( "ies_cpf_cnpj", "" ) == 'CPF') {
    	cgc_cpf = getValueForm( "num_cgc_cpf", "" ).replace('-','/0000-');
    	var ies_fis_juridica = 'F';
    } else {
    	cgc_cpf = "0" + getValueForm( "num_cgc_cpf", "" );
    	var ies_fis_juridica = 'J';
    }
	
    if( cgc_cpf != "00.000.000/0000-00" 
     && cgc_cpf != "000.000.000/0000-00" 
     && cgc_cpf != "" 
     && getValueForm( "ies_nacional_internacional" ) == "N" ){
		var ct = new Array(); 
		ct.push( DatasetFactory.createConstraint("num_cgc_cpf", cgc_cpf, cgc_cpf, ConstraintType.MUST) );				
		ct.push( DatasetFactory.createConstraint("table", "kbt_v_cliente_fornecedor", null, ConstraintType.MUST) );
	    var ds = DatasetFactory.getDataset("selectLogix", null, ct, null);
		if ( ds.rowsCount > 0 ){
			hAPI.setCardValue("cod_cliente_fornecedor", ds.getValue(0, "cod_cliente_fornecedor" ) );
		}
    }
	
	try{
		log.info("## RESULT ## " );
	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId : getValue("WKCompany") + "",
	        serviceCode : "kbt_services_logix_rest",
	        endpoint : "/logixrest/kbtr00005/cliente"/*,
	        /logixrest/kbtr00005/cliente/20564503053
	        method : "post"*/ //"post", "delete", "patch", "put", "get"
	     }; 
	    
	    
		var cod_cliente = getValueForm( "cod_cliente_fornecedor", "" ).trim()+"";
		if( cod_cliente == "" ){
			cod_cliente = cgc_cpf.replace(/\D/g,'');
		}
		
	    var params = {};
	    if( getValueForm( "ies_operacao", "" ) == "N" &&  hAPI.getCardValue("cod_cliente_fornecedor") == "" ){	    	
	    	data["method"] = "post";
	    }else{
	    	data["method"] = "put";
//	    	hAPI.setCardValue( "cod_cliente", lr_cliente["cod_cliente"] );
	    }
	    
//	    data["method"] = "put";	    
	   
	    
		var ies_cli_forn = "C";
	    if ( getValueForm( "ies_tipo_cadastro", "" ) != "C" ){
	    	ies_cli_forn = "F";
	    }
	    
		var lr_cliente = {}
		lr_cliente["cod_cliente"] = cod_cliente+"";
		lr_cliente["cod_class"] = getValueForm( "classe", "X" )+"";
		lr_cliente["nom_cliente"] = getValueForm( "raz_social", "" )+"";
		lr_cliente["end_cliente"] = ( new String( getValueForm( "endereco", "" ) ) ).replace(/,/g, ".")+"";
		lr_cliente["den_bairro"] = getValueForm( "bairro", "" )+"";
		lr_cliente["cod_cidade"] = getValueForm( "cod_cidade", "" )+"";
		lr_cliente["cod_cep"] = getValueForm( "cep", "00000-000" ).replace('.','')+"";
		lr_cliente["num_caixa_postal"] = "";
		lr_cliente["num_telefone"] = getValueForm( "telefone_contato_comercial", "0" )+""; //obrigatorio
		lr_cliente["num_fax"] = "";
		lr_cliente["num_telex"] = "";
		if( getValueForm( "num_suframa", "0" ) == "0" || getValueForm( "num_suframa", "0" ) == "" ){
			lr_cliente["num_suframa"] = null;
		}else{
			lr_cliente["num_suframa"] = getValueForm( "num_suframa", "0" )+"";
		}
		lr_cliente["cod_tip_cli"] = getValueForm( "cod_tip_cliente", "98" )+"";
		lr_cliente["den_marca"] = "";
		if( getValueForm( "raz_social_reduz", "" ) != "" ){
			lr_cliente["nom_reduzido"] = getValueForm( "raz_social_reduz", "" )+"";
		}else{
			var aNome = getValueForm( "raz_social", "" ).split(" ");
			var redux = "";
			if( aNome.length > 0 ){
				redux = aNome[0]+" "+aNome[ aNome.length -1 ];
			}
			lr_cliente["nom_reduzido"] = redux+"";
		}
		lr_cliente["den_frete_posto"] = "";
		lr_cliente["num_cgc_cpf"] = cgc_cpf+"";
		lr_cliente["ins_estadual"] = getValueForm( "ins_estadual", "" )+"";
		lr_cliente["cod_portador"] =  getValueForm( "cod_portador", "" )+""; //preencher
		lr_cliente["ies_tip_portador"] = getValueForm( "ies_tip_portador", "" )+""; //preencher
		lr_cliente["cod_cliente_matriz"] = "";
		lr_cliente["cod_consig"] = "";
		lr_cliente["ies_cli_forn"] = ies_cli_forn+"";
		lr_cliente["ies_zona_franca"] = "N";
		
		if( getValueForm( "integra_k2", "" ) == "S" ){
			lr_cliente["ies_situacao"] = "S";
		}else{
			lr_cliente["ies_situacao"] = "A";
		}
		
		lr_cliente["cod_rota"] = "0";
		lr_cliente["cod_praca"] = "0";
		lr_cliente["dat_cadastro"] = dataCadTxt+""; //preencher
		lr_cliente["dat_atualiz"] = dataTxt+""; //preencher
		lr_cliente["nom_contato"] = getValueForm( "nom_contao_comercial", "" )+"";
		lr_cliente["dat_fundacao"] = dataAbertTxt+""; //preencher
		lr_cliente["cod_local"] = "0";
		lr_cliente["correio_eletronico"] = getValueForm( "email_contato_comercial", "" )+"";
		lr_cliente["correi_eletr_secd"] = getValueForm( "email2_contato_comercial", "" )+"";
		lr_cliente["correi_eletr_venda"] = getValueForm( "email3_contato_comercial", "" )+"";
		lr_cliente["endereco_web"] = "";
		lr_cliente["des_subtipo_fornecedor"] = "";
		lr_cliente["ies_liquida_oc"] = "";
		lr_cliente["ies_aproveita_ped"] = "";
		lr_cliente["ins_municipal"] = "";
		lr_cliente["ies_item_iso"] = "";
		lr_cliente["dat_aprov"] = "";
		lr_cliente["ies_aprovado"] = "";
		lr_cliente["ies_tip_aprovacao"] = "";
		lr_cliente["ies_funrural"] = "";
		lr_cliente["ies_forma_pagto"] = "";
		lr_cliente["registro_saa"] = "";
		lr_cliente["codigo_ret"] = "";
		lr_cliente["validade_ret"] = "";
		lr_cliente["ies_forma_envio"] = "E";
		lr_cliente["e_mail"] = getValueForm( "email_contato_comercial", "" )+"";
		lr_cliente["num_tel_celular"] = getValueForm( "celular_contato_comercial", "" )+"";
		lr_cliente["endereco_web_fornec_compl"] = "";
		lr_cliente["email_secund"] = getValueForm( "email2_contato_comercial", "" )+"";
		lr_cliente["pct_pontuacao"] = "";
		lr_cliente["telefone_2"] = "";
		lr_cliente["compl_endereco"] = getValueForm( "complemento", "" )+"";
		lr_cliente["tip_logradouro"] = getValueForm( "tip_logradouro", "" )+""; //preencher
		lr_cliente["num_iden_lograd"] = getValueForm( "numero", "" )+"";
		lr_cliente["iden_estrangeiro"] = "";
		lr_cliente["ind_cprb"] = "";
		lr_cliente["tipo_servico"] = "";
		lr_cliente["ies_contrib_ipi"] = getValueForm( "contibuinte_ipi", "N")+"";
		lr_cliente["eh_simples_nacional"] = getValueForm( "simples_nacional", "N")+"";
		lr_cliente["ies_fis_juridica"] = ies_fis_juridica+"";
		lr_cliente["cod_uni_feder"] = getValueForm( "uf", "" )+"";
		lr_cliente["cod_pais"] = getValueForm( "cod_pais", "" )+"";
		lr_cliente["nom_guerra"] = getValueForm( "raz_social_reduz", "" )+"";
		lr_cliente["cod_cidade_pgto"] = getValueForm( "cod_cidade", "" )+"";
		lr_cliente["camara_comp"] = "";
		
		if( getValueForm( "num_banco", "" ) == "0" || getValueForm( "num_banco", "" ) == "" || getValueForm( "num_banco", "" ) == null ){
			lr_cliente["ies_dep_cred"] = getValueForm("pagto_deposito_credito", "N")+"";
			lr_cliente["cod_banco"] = getValueForm( "num_banco", "" )+"";
		}else{
			lr_cliente["ies_dep_cred"] = getValueForm("pagto_deposito_credito", "S")+"";
			lr_cliente["cod_banco"] = getValueForm( "num_banco", "" )+"";
		}
		lr_cliente["num_agencia"] = getValueForm( "agencia", "" ) + "-" + getValueForm( "dig_agencia", "" )+"";
		lr_cliente["num_conta_banco"] = getValueForm( "conta_corrente", "" ) + "-" + getValueForm( "dig_conta", "" )+"";
		lr_cliente["tmp_transpor"] = "1";
		lr_cliente["tex_observ"] = getValueForm( "justificativa", "" )+"";
		lr_cliente["num_lote_transf"] = "0";
		lr_cliente["pct_aceite_div"] = "0";
		lr_cliente["ies_tip_entrega"] = "D";
		 
		lr_cliente["ult_num_coleta"] = "0";
		lr_cliente["ies_gera_ap"] = getValueForm( "gera_ap", "S" )+"";
		
		lr_cliente["cod_mercado"] =  getValueForm( "cod_mercado", "IN" )+"";
		lr_cliente["cod_continente"] =  getValueForm( "cod_continente", "1" )+"";
		lr_cliente["cod_regiao"] =  getValueForm( "cod_regiao", "0" )+"";
		
		lr_cliente["qtd_dias_atr_dupl"] = "0";
		lr_cliente["qtd_dias_atr_med"] = "0";
		lr_cliente["val_ped_carteira"] = "0";
		lr_cliente["val_dup_aberto"] = "0";
		lr_cliente["dat_ult_fat"] = "";
		lr_cliente["val_limite_cred"] = "0";
		
		lr_cliente["ies_aprovacao"] = "S";
		lr_cliente["ies_situa_cliente"] = "N";
		
		
		lr_cliente["dat_val_lmt_cr"] = "";
		lr_cliente["ies_nota_debito"] = "N";
		lr_cliente["ies_protesto"] = "S";
		lr_cliente["ies_emis_autom_nd"] = "N";
		lr_cliente["tex_obs"] = ""; //getValueForm( "justificativa", "" );
		lr_cliente["qtd_dias_protesto"] = "0";
		lr_cliente["ies_tip_cliente"] = getValueForm( "cod_tip_cliente", "" )+"";
		lr_cliente["cod_float"] = "0";
		lr_cliente["email_boleto"] = getValueForm( "email_contato_comercial", "" )+"";
		//autonomo
		lr_cliente["num_rg"] = getValueForm( "ins_estadual", "" )+"";
		lr_cliente["cod_org_emis"] = getValueForm("org_emissor_uf", "")+"";
		lr_cliente["num_inscr_inss"] = getValueForm("num_ident_fiscal", "")+"";
		lr_cliente["cod_classe"] = "0";
		lr_cliente["num_cart_motorista"] = getValueForm("cnh", "")+"";
		lr_cliente["num_cbo"] = getValueForm("cod_cbo", "")+"";
		
		lr_cliente["dat_nascimento"] = dataNasc;
		lr_cliente["pais_nascimento"] = getValueForm( "cod_pais", "" )+"";
		lr_cliente["pais_nacionalidade"] = getValueForm( "cod_pais", "" )+"";
		lr_cliente["tip_inscricao"] = "2";
		lr_cliente["num_inscricao"] = "0";
		lr_cliente["sexo"] = "M";
		lr_cliente["raca_cor"] = "1";
		lr_cliente["estado_civil"] = "1";
		lr_cliente["grau_instrucao"] = "1";
		lr_cliente["categoria_sped_social"] = "101";
		lr_cliente["dat_ini_sindicato_cooperativa"] = "";
		lr_cliente["optante_fgts"] = "";
		lr_cliente["dat_opcao_fgts"] = "";
		
		
		lr_cliente["ies_situa_cliente"] = "N";
		lr_cliente["ies_aprovacao"] = "S";
		lr_cliente["num_lista_preco"] = "";
		
		lr_cliente["cod_cnd_pgto"] = "";
		lr_cliente["pct_desp_financ"] = "0";
		lr_cliente["cod_cnd_pgto_frete"] = "";	
		
		var la_cli_cond_pgto = [];
		la_cli_cond_pgto.push({
				"cod_cnd_pgto" : "",
				"pct_desp_financ": "0",
				"cod_cnd_pgto_frete": ""
		})
		
		
		 var ctt = new Array(); 
		 ctt.push( DatasetFactory.createConstraint("documentid", getValueForm( "ies_tip_fornec", "" ), getValueForm( "ies_tip_fornec", "" ), ConstraintType.MUST) );				
	     var dst = DatasetFactory.getDataset("tipo_fornecedor", null, ctt, null);
		 if( dst.rowsCount > 0 ) {
		    	 lr_cliente["ies_tip_fornec"] = dst.getValue(0, "ies_tip_fornec" ).trim()+"";
		 }	
		
		var la_cap_par_fornec_imp = [];
		la_cap_par_fornec_imp.push({"des_parametro": "RETEM ISS NO PAGAMENTO",
		                            "parametro": "reten_iss_pag_ent",
		                            "parametro_booleano": null,
		                            "parametro_dat": null,
		                            "parametro_numerico": null,
		                            "parametro_texto": "N",
		                            "parametro_val": null});
		
		var la_fornec_x_empresa  = [{"cod_empresa": "10"}];
		
		var la_vdp_cli_parametro = [
			{
				"dat_parametro": null,
				"des_parametro": "Cliente recebe informacoes xPed e nItemPed no XML?",
				"num_parametro": null,
				"parametro": "xpednitemped",
				"texto_parametro": null,
				"tip_parametro": getValueForm("xpednitemped", "N")+"",
				"val_parametro": null
			},
		    {
		        "dat_parametro": null,
		        "des_parametro": "Cliente terceiro",
		        "num_parametro": null,
		        "parametro": "cliente_terceiro",
		        "texto_parametro": null,
		        "tip_parametro": "S",
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": getValueForm( "dat_validade_suframa", null )+"",
		        "des_parametro": "Data de Validade do Suframa",
		        "num_parametro": null,
		        "parametro": "dat_validade_suframa",
		        "texto_parametro": null,
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Número do DDD do telefone para integração EAI",
		        "num_parametro": null,
		        "parametro": "ddd_telefone_eai",
		        "texto_parametro": null,
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Número do DDI do telefone para integração EAI",
		        "num_parametro": null,
		        "parametro": "ddi_telefone_eai",
		        "texto_parametro": null,
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Indica se o cliente está habilitado no Inovar-Auto",
		        "num_parametro": null,
		        "parametro": "habilit_inovar_auto",
		        "texto_parametro": null,
		        "tip_parametro": "N",
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Indica se o cadastro é um depositante",
		        "num_parametro": null,
		        "parametro": "ies_depositante",
		        "texto_parametro": null,
		        "tip_parametro": "N",
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Beneficiário dispensado do Nr de Identificação Fiscal-NIF?",
		        "num_parametro": null,
		        "parametro": "ies_dispensado_nif",
		        "texto_parametro": "N",
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "País dispensa o Nr de Identificação Fiscal - NIF?",
		        "num_parametro": null,
		        "parametro": "ies_pais_dispens_nif",
		        "texto_parametro": "N",
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Residente ou domiciliado no exterior?",
		        "num_parametro": null,
		        "parametro": "ies_reside_exterior",
		        "texto_parametro": "N",
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Inscricao Municipal",
		        "num_parametro": null,
		        "parametro": "ins_municipal",
		        "texto_parametro": "1",
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "INDICADOR SE O CLIENTE E OU NAO MICROEMPRESA",
		        "num_parametro": null,
		        "parametro": "microempresa",
		        "texto_parametro": null,
		        "tip_parametro": "N",
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Número Identificação Fiscal",
		        "num_parametro": null,
		        "parametro": "num_ident_fiscal",
		        "texto_parametro": null,
		        "tip_parametro": null,
		        "val_parametro": null
		    },
		    {
		        "dat_parametro": null,
		        "des_parametro": "Número do telefone para integração EAI",
		        "num_parametro": null,
		        "parametro": "num_telefone_eai",
		        "texto_parametro": null,
		        "tip_parametro": null,
		        "val_parametro": null
		    }
		];
			 
		var la_cli_contatos = [{}];
		var la_cli_end_ent = [];
		if( getValueForm( "endereco_cobranca", "" ) == "" || getValueForm( "cod_cidade_cobranca", "" ) == "" ){
			la_cli_end_ent.push(
				{
					"sequencia_end_cob": "1",
					"num_cgc": cgc_cpf+"",
					"ins_estadual": getValueForm( "ins_estadual", "" )+""+"",
					"tip_endereco_end_cob": "C",
					"tip_logradouro_end_cob": getValueForm( "tip_logradouro", "" )+"",
					"logradouro_end_cob": ( new String( getValueForm( "endereco", "" ) ) ).replace(/,/g, ".")+"",
					"num_iden_lograd_end_cob": getValueForm( "numero", "" )+"",
					"complemento_endereco_end_cob": getValueForm( "complemento", "" )+"",
					"bairro_cobr_entga": getValueForm( "bairro", "" )+"",
					"cod_cidade_end_cob": getValueForm( "cod_cidade", "" )+"",
					"cod_cep_end_cob": getValueForm( "cep", "" ).replace('.','')+""
				});			
		}else{
			cod_cidade = getValueForm( "cod_cidade_cobranca", "" );
			if( cod_cidade == "" || cod_cidade == undefined || cod_cidade == null ){
				cod_cidade = getValueForm( "cod_cidade", "" );
			}
			la_cli_end_ent.push(
				{
					"sequencia_end_cob": getValueForm( "sequencia_end_cobranca", "" )+"",
					"num_cgc": cgc_cpf+"",
					"ins_estadual": getValueForm( "ins_estadual", "" )+""+"",
					"tip_endereco_end_cob": "C",
					"tip_logradouro_end_cob": getValueForm( "tip_logradouro_cobranca", "" )+"",
					"logradouro_end_cob": ( new String( getValueForm( "endereco_cobranca", "" ) ) ).replace(/,/g, ".")+"",
					"num_iden_lograd_end_cob": getValueForm( "numero_cobranca", "" )+"",
					"complemento_endereco_end_cob": getValueForm( "complemento_cobranca", "" )+"",
					"bairro_cobr_entga": getValueForm( "bairro_cobranca", "" )+"",
					"cod_cidade_end_cob": cod_cidade+"",
					"cod_cep_end_cob": getValueForm( "cep_cobranca", "" ).replace('.','')+""
				} );
		}
		
	      var indexes = hAPI.getChildrenIndexes("end_entrega");
	      log.info( 'end_entrega..............'+indexes.length );
	      if( indexes.length == 0 ){
	    	  la_cli_end_ent.push({
  					"sequencia_end_cob": "2", 
  			    	"num_cgc": cgc_cpf+"",
  					"ins_estadual": getValueForm( "ins_estadual", "" )+"",
  					"tip_endereco_end_cob": "E",
  					"tip_logradouro_end_cob": getValueForm( "tip_logradouro", "" )+"",
  					"logradouro_end_cob": ( new String( getValueForm( "endereco", "" ) ) ).replace(/,/g, ".")+"",
  					"num_iden_lograd_end_cob": getValueForm( "numero", "" )+"",
  					"complemento_endereco_end_cob": getValueForm( "complemento", "" )+"",
  					"bairro_cobr_entga": getValueForm( "bairro", "" )+"",
  					"cod_cidade_end_cob": getValueForm( "cod_cidade", "" )+"",
  					"cod_cep_end_cob": getValueForm( "cep", "" ).replace('.','')+""
  				});
	      }else{
		      for (var i = 0; i < indexes.length; i++) {
		    	  
				cod_cidade = getValueForm( "cod_cidade_entrega___"+indexes[i], "" );
				if( cod_cidade == "" || cod_cidade == undefined || cod_cidade == null ){
					cod_cidade = getValueForm( "cod_cidade", "" );
				}
		    	  
		    	  la_cli_end_ent.push({
		    					"sequencia_end_cob": getValueForm( "sequencia_end_entrega___"+indexes[i], "" )+"", 
		    			    	"num_cgc": cgc_cpf+"",
		    					"ins_estadual": getValueForm( "ie_entrega___"+indexes[i], "" )+"",
		    					"tip_endereco_end_cob": "E",
		    					"tip_logradouro_end_cob": getValueForm( "tip_logradouro_entrega___"+indexes[i], "" )+"",
		    					"logradouro_end_cob": ( new String( getValueForm( "endereco_entrega___"+indexes[i], "" ) ) ).replace(/,/g, ".")+"",
		    					"num_iden_lograd_end_cob": getValueForm( "numero_entrega___"+indexes[i], "" )+"",
		    					"complemento_endereco_end_cob": getValueForm( "complemento_entrega___"+indexes[i], "" )+"",
		    					"bairro_cobr_entga": getValueForm( "bairro_entrega___"+indexes[i], "" )+"",
		    					"cod_cidade_end_cob": cod_cidade+"",
		    					"cod_cep_end_cob": getValueForm( "cep_entrega___"+indexes[i], "" ).replace('.','')+""
		    				});
		      }
	      }
		
	      
	      
		var la_credcad_socios = [{}];
		
		var la_sup_par_fornecedor = [
		    {
		        "des_parametro": "CATEGORIA DO TRABALHADOR NO SEFIP",
		        "empresa": "SE",
		        "parametro": "categoria_sefip",
		        "parametro_booleano": null,
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": getValueForm( "categoria_cnh", "" ).replace('.','')+""
		    },
		    {
		        "des_parametro": "GRAU DE RISCO A AGENTES NOCIVOS",
		        "empresa": "SE",
		        "parametro": "grau_risco",
		        "parametro_booleano": null,
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": 0
		    },
		    {
		        "des_parametro": "INDICADOR DE PRESTADOR DE SERVIÇOS ODONTOLÓGICOS",
		        "empresa": "SE",
		        "parametro": "ies_serv_odonto",
		        "parametro_booleano": "S",
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    },
		    {
		        "des_parametro": "TIPO DE INSCRIÇÃO",
		        "empresa": "SE",
		        "parametro": "tip_inscricao",
		        "parametro_booleano": "1", //NIT
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    },
		    {
		        "des_parametro": "TIPO DE INSCRIÇÃO 2",
		        "empresa": "SE",
		        "parametro": "tip_inscricao_2",
		        "parametro_booleano": "2", //NIT
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    },
		    {
		        "des_parametro": "NUMERO INSCRIÇÃO 2",
		        "empresa": "SE",
		        "parametro": "num_inscr_inss_2",
		        "parametro_booleano": null, //NIT
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": getValueForm( "pis", "" ).replace('.','')+"",
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "TIPO DE CONTA BANCARIA DO FORNECEDOR",
		        "empresa": "SE",
		        "parametro": "tipo_conta_bc",
		        "parametro_booleano": null, //NIT
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": getValueForm( "ies_tip_conta", "" ).replace('.','')+"",
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "LOTE DE PAGAMENTO DO FORNECEDOR",
		        "empresa": "SE",
		        "parametro": "lote_pagamento_forne",
		        "parametro_booleano": null, 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": getValueForm( "cod_lote_pgto", "38" )+""
		    }
		    ,
		    {
		        "des_parametro": "Credito presumido PIS/COFINS",
		        "empresa": "SE",
		        "parametro": "cred_pis_cofins",
		        "parametro_booleano": getValueForm( "credito_presumido", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indicador tipo retencao do PIS/COFINS/CSL",
		        "empresa": "SE",
		        "parametro": "ind_ret_pis_cof",
		        "parametro_booleano": null, 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": getValueForm( "tipo_retencao", "0" )+"",
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indicador de Contribuicao de CSL",
		        "empresa": "SE",
		        "parametro": "ies_contrib_csl",
		        "parametro_booleano":  getValueForm( "retencao_csl", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indicador de Contribuicao de COFINS",
		        "empresa": "SE",
		        "parametro": "ies_contrib_cofins",
		        "parametro_booleano":  getValueForm( "retencao_cofins", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indicador de Retenção de ISS.",
		        "empresa": "SE",
		        "parametro": "retencao_iss",
		        "parametro_booleano":  getValueForm( "retem_iss", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indicador de Contribuicao de PIS",
		        "empresa": "SE",
		        "parametro": "ies_contrib_pis",
		        "parametro_booleano":  getValueForm( "retencao_pis", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Subtipo do fornecedor",
		        "empresa": "SE",
		        "parametro": "subtipo_fornecedor",
		        "parametro_booleano": null, 
		        "parametro_dat": null,
		        "parametro_numerico": parseInt( getValueForm( "sup_subtipo_fornec", "" ) ),
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Fornecedor é residente ou domiciliado no exterior?",
		        "empresa": "SE",
		        "parametro": "ies_reside_exterior",
		        "parametro_booleano":  getValueForm( "reside_exterior", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Beneficiário dispensado do Nr de Identificação Fiscal-NIF?",
		        "empresa": "SE",
		        "parametro": "ies_dispensado_nif",
		        "parametro_booleano":  getValueForm( "dispensa_nif", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "País dispensa o Nr de Identificação Fiscal - NIF?",
		        "empresa": "SE",
		        "parametro": "ies_pais_dispens_nif",
		        "parametro_booleano":  getValueForm( "pais_dispensa_nif", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Fornecedor abate ICMS da base do PIS/COFINS?",
		        "empresa": "SE",
		        "parametro": "abate_icms_bc_pis_co",
		        "parametro_booleano":  "S", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Inicio de utilizacao da Nota Fiscal Eletronica",
		        "empresa": "SE",
		        "parametro": "dat_ini_utiliz_nf-e",
		        "parametro_booleano":  null, 
		        "parametro_dat": getValueForm( "data_nfe", "" ).split("/").reverse().join("-")+"",
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "Indica se utiliza Nota Fiscal Eletrônica",
		        "empresa": "SE",
		        "parametro": "ies_utiliza_NFe",
		        "parametro_booleano":  getValueForm( "utiliza_nfe", "N" )+"", 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": null,
		        "parametro_val": null
		    }
		    ,
		    {
		        "des_parametro": "modelo nota fiscal do fornecedor",
		        "empresa": "SE",
		        "parametro": "modelo_nf_fornec",
		        "parametro_booleano": null, 
		        "parametro_dat": null,
		        "parametro_numerico": null,
		        "parametro_texto": getValueForm( "modelo_nf_fr", "" )+"",
		        "parametro_val": null
		    }
		];

		 
		
	    var la_vdp_cli_grp_email = [];
		
		/*if( getValueForm( "email_contato_comercial", "" ) != "" ){
			la_vdp_cli_grp_email = [
			    {
					"grupo_email": "1",
					"seq_email": "1",
					"email": getValueForm( "email_contato_comercial", "" )+"",
					"tip_registro": "C",
					"des_grupo_email": "NFe XML"
				}
			];
		}*/
		
	    var indexes = hAPI.getChildrenIndexes("emails_nfe");
	    log.info( 'Lista Mail..............'+indexes.length );
	    for (var i = 0; i < indexes.length; i++) {
	    	  var mail = {};
	    	  mail["grupo_email"] = parseInt( getValueForm( "grupo_email___"+indexes[i], "" ) );
	    	  mail["seq_email"] = parseInt( getValueForm( "id_email___"+indexes[i], "" ) ); //i+1+"";
	    	  if( getValueForm( "ies_excluido___"+indexes[i] ) == "S"  ){
	    		  mail["email"] = null;
	    	  }else{
	    		  mail["email"] = getValueForm( "email_nfe___"+indexes[i], "" )+"";  
	    	  }
	    	  mail["tip_registro"] = "C";
	    	  mail["des_grupo_email"] = "NFe XML";
	    	  la_vdp_cli_grp_email.push( mail );  
	    }
	    if ( la_vdp_cli_grp_email.length == 0 )
	      la_vdp_cli_grp_email.push( {} );
	    		
		
		var la_cli_canal_venda = [];
			
		if( getValueForm( "cod_repres", "" ) != "" ){
			 /* CHUMBADO POR SOLICITAÇÂO DO SR. WILLIAN */
			 /*var constraintsPai = new Array(); 
			 constraintsPai.push( DatasetFactory.createConstraint("cod_repres", getValueForm( "cod_repres", "" ), getValueForm( "cod_repres", "" ), ConstraintType.MUST) );				
			 constraintsPai.push( DatasetFactory.createConstraint("table", "kbt_v_representante", null, ConstraintType.MUST) );
		     var datasetPai = DatasetFactory.getDataset("selectLogix", null, constraintsPai, null);
			 if ( datasetPai != null ){
			     for(var x = 0; x < datasetPai.rowsCount; x++) {
			    	 log.info( "ADD CV"+datasetPai.getValue(x, "cv_n1" )+"" );
			    	 
			    	 cli_canal_venda["cod_nivel_1"] = datasetPai.getValue(x, "cv_n1" )+"";
			    	 cli_canal_venda["cod_nivel_2"] = datasetPai.getValue(x, "cv_n2" )+"";
			    	 cli_canal_venda["cod_nivel_3"] = datasetPai.getValue(x, "cv_n3" )+"";
			    	 cli_canal_venda["cod_nivel_4"] = datasetPai.getValue(x, "cv_n4" )+"";
			    	 cli_canal_venda["cod_nivel_5"] = datasetPai.getValue(x, "cv_n5" )+"";
			    	 cli_canal_venda["cod_nivel_6"] = datasetPai.getValue(x, "cv_n6" )+"";
			    	 cli_canal_venda["cod_nivel_7"] = datasetPai.getValue(x, "cv_n7" )+"";	     
			    	 cli_canal_venda["ies_nivel"] = datasetPai.getValue(x, "ies_nivel" )+"";*/
					 var cli_canal_venda = {};
			    	 cli_canal_venda["cod_nivel_1"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_2"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_3"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_4"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_5"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_6"] = getValueForm( "cod_repres", "" )+"";
			    	 cli_canal_venda["cod_nivel_7"] = getValueForm( "cod_repres", "" )+"";	     
			    	 cli_canal_venda["ies_nivel"] = '07';
			    	 cli_canal_venda["cod_tip_carteira"] = getValueForm( "cod_tip_carteira", "" )+"";
			    	 la_cli_canal_venda.push( cli_canal_venda );
			 /*    }
			 }else{
				 la_cli_canal_venda.push( {} );
			 }*/
		}else{
			la_cli_canal_venda.push( {} );
		}
		
//		var la_cli_canal_venda = [
//		    {
//		        "cod_nivel_1": 9000,
//		        "cod_nivel_2": 8000,
//		        "cod_nivel_3": 7700,
//		        "cod_nivel_4": 6702,
//		        "cod_nivel_5": 5702,
//		        "cod_nivel_6": 3022,
//		        "cod_nivel_7": 4102,
//		        "cod_tip_carteira": "01",
//		        "ies_nivel": "07"
//		    },
//		    {
//		        "cod_nivel_1": 9000,
//		        "cod_nivel_2": 8000,
//		        "cod_nivel_3": 7100,
//		        "cod_nivel_4": 6002,
//		        "cod_nivel_5": 5002,
//		        "cod_nivel_6": 4024,
//		        "cod_nivel_7": 1104,
//		        "cod_tip_carteira": "03",
//		        "ies_nivel": "07"
//		    },
//		    {
//		        "cod_nivel_1": 9000,
//		        "cod_nivel_2": 8000,
//		        "cod_nivel_3": 7100,
//		        "cod_nivel_4": 6002,
//		        "cod_nivel_5": 5002,
//		        "cod_nivel_6": 4022,
//		        "cod_nivel_7": 1102,
//		        "cod_tip_carteira": "02",
//		        "ies_nivel": "07"
//		    }
//		];
		
		var la_sup_cntt_fornec = [{}];
		
//		var la_sup_cntt_fornec = [
//		    {
//		        "email_contato": getValueForm( "email_contato_comercial", "" ),
//		        "empresa": "10",
//		        "fax": null,
//		        "nom_contato": getValueForm( "nom_contao_comercial", "" ),
//		        "sequencia_contato": 1,
//		        "telefone": getValueForm( "telefone_contato_comercial", "" ),
//		        "telefone_celular": getValueForm( "celular_contato_comercial", "" )
//		    }
//		];
		
		var la_cap_forn_dep_sped_social = [{}];
//		var la_cap_forn_dep_sped_social = [
//		    {
//		        "cpf": getValueForm( "num_cgc_cpf", "" ),
//		        "dat_nascimento": getValueForm( "data_nascimento", "" ),
//		        "grau_parentesco": "1",
//		        "ies_grau_paren": "C",
//		        "ind_receb_sal_fam": "S",
//		        "indica_deduca_irrf": "S",
//		        "nome_dependente": "TESTE DA SILVA JR2",
//		        "num_lote_transf": 0
//		    },
//		];
		
		var la_sup_par_inscr_est = [{}];
		
//		var la_sup_par_inscr_est = [
//		    {
//		        "des_parametro": "CNPJ produtor rural para cadastro sincronizado da SEFAZ-SP",
//		        "inscricao_estadual": "ISENTO",
//		        "parametro": "cnpj_prod_rur",
//		        "parametro_booleano": null,
//		        "parametro_dat": "2022-05-07T00:00:00",
//		        "parametro_numerico": null,
//		        "parametro_texto": "007.293.000/0009-23",
//		        "parametro_val": null,
//		        "seq_inscr_fornec": 1
//		    }
//		];
		
		var la_sup_inscr_fornec = [{}];
		
//		var la_sup_inscr_fornec = [
//		    {
//		        "bairro": getValueForm( "bairro", "" ),
//		        "cep": getValueForm( "cep", "" ).replace('.',''),
//		        "cidade": getValueForm( "cod_cidade", "" ),
//		        "compl_endereco": getValueForm( "complemento", "" ),
//		        "endereco": getValueForm( "endereco", "" ) + ", " + getValueForm( "numero", "" ),
//		        "estado": getValueForm( "uf", "" ),
//		        "inscricao_estadual": getValueForm( "ins_estadual", "" ).replace(/\D/g,''),
//		        "inscricao_inss": null,
//		        "pais": getValueForm( "cod_pais", "" ),
//		        "seq_inscr_fornec": 1,
//		        "telefone": getValueForm( "telefone_contato_comercial", "" ),
//		        "zona_franca": "N"
//		    }
//		];
		
		var la_sup_par_teg_fornec = [{}];
		
	/*	var la_sup_par_teg_fornec = [{}];
		    {
		        "des_parametro": "Código do transportador relacionado ao fornecedor",
		        "empresa": "10",
		        "parametro": "transportador",
		        "parametro_ind": null,
		        "parametro_num": null,
		        "parametro_texto": "",
		        "parametro_val": null
		    }
		];
	*/	
		var la_term_ge_fornec = [{}];	
		
	/*	var la_term_ge_fornec = [
		    {
		        "cnd_pgto": 2,
		        "cod_mod_embar": 1,
		        "cod_moeda": 1,
		        "dat_cadast": "2022-05-07T00:00:00",
		        "empresa": "10",
		        "hor_cadast": "15:31:51",
		        "ies_dia_venc": "1",
		        "login": "admlog",
		        "tax_financeira": 10
		    }
		]; */
		var tipo_chave_pix = getValueForm( "ies_pix", "" )+"";
		if ( getValueForm( "ies_pix", "" ) == "06") {
			tipo_chave_pix = "03";
		}
		
		var la_cap_fornec_pix = [
            {
                "chave_pix": getValueForm( "chave_pix", "" ),
                "observacao": null,
                "pix_principal": "S",
                "tipo_chave_pix": tipo_chave_pix+""
            }
        ]
		
		var la_obf_grp_fisc_cli = [{}];
		var la_cre_emp_cli_port = [{}]; 
		var la_vdp_emp_cli_par = [{}]; 
		if ( la_cli_cond_pgto.length == 0 ) { la_cli_cond_pgto = [{}]; }
		
		params["lr_cliente"] = lr_cliente;
		params["la_cap_par_fornec_imp"] = la_cap_par_fornec_imp;
		params["la_fornec_x_empresa"] = la_fornec_x_empresa;
		
		params["la_vdp_cli_parametro"] = la_vdp_cli_parametro;
		params["la_cli_contatos"] = la_cli_contatos;
		params["la_cli_end_ent"] = la_cli_end_ent;
		params["la_credcad_socios"] = la_credcad_socios;
		params["la_sup_par_fornecedor"] = la_sup_par_fornecedor;
		params["la_vdp_cli_grp_email"] = la_vdp_cli_grp_email;
		params["la_cli_canal_venda"] = la_cli_canal_venda;
		params["la_sup_cntt_fornec"] = la_sup_cntt_fornec;
		params["la_cap_forn_dep_sped_social"] = la_cap_forn_dep_sped_social;
		params["la_sup_par_inscr_est"] = la_sup_par_inscr_est;
		params["la_sup_inscr_fornec"] = la_sup_inscr_fornec;
		params["la_sup_par_teg_fornec"] = la_sup_par_teg_fornec;
		params["la_term_ge_fornec"] = la_term_ge_fornec;
		params["la_cap_fornec_pix"] = la_cap_fornec_pix;
		
		params["la_obf_grp_fisc_cli"] = la_obf_grp_fisc_cli;
		params["la_cre_emp_cli_port"] = la_cre_emp_cli_port;
		params["la_vdp_emp_cli_par"] = la_vdp_emp_cli_par;
		params["la_cli_cond_pgto"] = la_cli_cond_pgto;	
		
		data["params"] = params;
	      
	    log.info("## antes do stringify ## "+data.toString() );
	    var jj = JSON.stringify( data );
	    log.info("## RESULT "+data["method"]+" jj ## "+ jj );
	    var vo = clientService.invoke( jj );
	    if(vo.getResult()== "" || vo.getResult().isEmpty()){
	    	throw "Retorno está vazio";
	    }else{
	    	//var jr = JSON.parse( vo.getResult() );
	    	log.info("## RESULT "+data["method"]+" res ## "+vo.getResult() );
	    	
	    	var jr = JSON.parse( vo.getResult() );
	    	if ( jr.errorMessage ){
	    		throw jr.errorMessage;
	    	}
	    	if ( !jr.data.retorno ){
	    		log.info("## RESULT "+data["method"]+" MSG ERROR ## "+ jr.messages[0].detail );
	    		throw jr.messages[0].detail;
	    	} else {
	    		if ( jr.messages[0].detail.indexOf('Rollback') > -1 ){
	    			log.info("## RESULT "+data["method"]+" MSG ERROR ## "+ jr.messages[0].detail );
		    		throw jr.messages[0].detail;
	    		} else {
	    			log.info("## RESULT "+data["method"]+" MSG SUCCESS ## "+ jr.messages[0].detail );
	    			hAPI.setCardValue("cod_cliente_fornecedor", jr.data.cod_cliente );
	    			
	    			if( hAPI.getCardValue("num_cgc_cpf") == "00.000.000/0000-00" ){
	    				var cnpj = jr.data.cod_cliente;
	    				var cnpj = cnpj.substring(1,4)+'.'+cnpj.substring(4,7)+'.'+cnpj.substring(7,10)+'/'+cnpj.substring(10,14)+'-'+cnpj.substring(14,16);
	    				hAPI.setCardValue("num_cgc_cpf", cnpj);
	    			}
	    		}
	    	}
	    }
	} catch(err) {
		throw err.toString();
	}
	
	trataAtivacao();
	return true;
}

function getValueForm( campo, padrao ){
	log.info( "Campo........"+campo );
	var valor = hAPI.getCardValue( campo )+"";
	if( padrao == "tipoPessoa" ) 
		if ( valor.indexOf("/0000-") > -1 )
			valor = "F";
		else
			valor = "J";
	log.info( "Valor........"+valor );
	if ( valor == "" || valor == undefined || valor == null || valor == "null" ){
		valor = padrao+"";
		log.info( "Valor padrao........"+valor );
	}
	return removeAcento( valor );

}

function removeAcento(valor) {
    var valorSemAcentuacao = valor
      .replace(/[ÁÀÃÂÄ]/g, 'A')
      .replace(/[áàãâä]/g, 'a')
      .replace(/[ÉÈÊË]/g, 'E')
      .replace(/[éèêë]/g, 'e')
      .replace(/[ÍÌÎÏ]/g, 'I')
      .replace(/[íìîï]/g, 'i')
      .replace(/[ÓÒÕÖÔ]/g, 'O')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[ÚÙÛÜ]/g, 'U')
      .replace(/[úùûü]/g, 'u')
      .replace(/[Ç]/g, 'C')
      .replace(/[ç]/g, 'c')
      //.replace(/[&]/g, 'e')
      .replace(/  +/g, ' ')
      .trim();
    return valorSemAcentuacao.toUpperCase();
  }

function trataAtivacao(){
	
	var contextWD = null;
	var dataSourceWD = null;
	var stDmlWD = null;
		
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		connectionWD = dataSourceWD.getConnection();
		
		
		if(  getValueForm( "integra_k2", "" ) == 'S'
		  && getValueForm( "cod_tip_cliente", "" ) != '11'
	      && getValueForm( "cod_tip_cliente", "" ) != '16'
		  && getValueForm( "cod_tip_cliente", "" ) != '97'
		  && getValueForm( "cod_tip_cliente", "" ) != '98'
		  && getValueForm( "cod_tip_cliente", "" ) != '99'
		  && getValueForm( "sup_subtipo_fornec", "" ) != '97'
		  && getValueForm( "sup_subtipo_fornec", "" ) != '98'
		  && getValueForm( "sup_subtipo_fornec", "" ) != '99' ){
			
			if( getValueForm( "ies_operacao", "" ) == 'N' ){
				var sql = "update clientes "+ 
						  "   set ies_situacao = 'S' "+
						  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
				
				var sql = "update fornecedor "+ 
						  "   set ies_fornec_ativo = 'I' "+
						  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
			}else{
				if( getValueForm( "ies_tipo_cadastro", "" ) != 'C' ){
					
					var sql = "update clientes "+ 
							  "   set ies_situacao = '"+ hAPI.getCardValue("ies_sit_cliente") +"' "+
							  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
					log.info("sql.......... " + sql);
					stDmlWD = connectionWD.prepareStatement(sql);
					stDmlWD.executeUpdate();
					
					
					var sql = "update fornecedor "+ 
							  "   set ies_fornec_ativo = 'I' "+
							  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
					
					log.info("sql.......... " + sql);
					stDmlWD = connectionWD.prepareStatement(sql);
					stDmlWD.executeUpdate();
					
				}else{
					var sql = "update fornecedor "+ 
							  "   set ies_fornec_ativo = '"+ hAPI.getCardValue("ies_sit_fornecedor") +"' "+
							  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
					
					log.info("sql.......... " + sql);
					stDmlWD = connectionWD.prepareStatement(sql);
					stDmlWD.executeUpdate();
					
					var sql = "update clientes "+ 
							  "   set ies_situacao = 'S' "+
							  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
					log.info("sql.......... " + sql);
					stDmlWD = connectionWD.prepareStatement(sql);
					stDmlWD.executeUpdate();
					
				}	
			}
					
		}else if(  getValueForm( "ies_operacao", "" ) == 'N' ){
			
			if( getValueForm( "ies_tipo_cadastro", "" ) == 'C' ){
				var sql = "update clientes "+ 
						  "   set ies_situacao = 'A' "+
						  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
			
				var sql = "update fornecedor "+ 
						  "   set ies_fornec_ativo = 'I' "+
						  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
				
			}else{
			
				var sql = "update clientes "+ 
						  "   set ies_situacao = 'S' "+
						  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
			
				var sql = "update fornecedor "+ 
						  "   set ies_fornec_ativo = 'A' "+
						  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
				
				log.info("sql.......... " + sql);
				stDmlWD = connectionWD.prepareStatement(sql);
				stDmlWD.executeUpdate();
				
			}
		}else if( getValueForm( "ies_tipo_cadastro", "" ) != 'C' ){
			
			var sql = "update clientes "+ 
					  "   set ies_situacao = '"+ hAPI.getCardValue("ies_sit_cliente") +"' "+
					  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
		
			log.info("sql.......... " + sql);
			stDmlWD = connectionWD.prepareStatement(sql);
			stDmlWD.executeUpdate();
			
			
			var sql = "update fornecedor "+ 
					  "   set ies_fornec_ativo = 'A' "+
					  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
			log.info("sql.......... " + sql);
			stDmlWD = connectionWD.prepareStatement(sql);
			stDmlWD.executeUpdate();
			
		}else{
			var sql = "update fornecedor "+ 
					  "   set ies_fornec_ativo = '"+ hAPI.getCardValue("ies_sit_fornecedor") +"' "+
					  " where cod_fornecedor = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
			
			log.info("sql.......... " + sql);
			stDmlWD = connectionWD.prepareStatement(sql);
			stDmlWD.executeUpdate();
			
			var sql = "update clientes "+ 
					  "   set ies_situacao = 'A' "+
					  " where cod_cliente = '"+ hAPI.getCardValue("cod_cliente_fornecedor") +"' ";
		
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
