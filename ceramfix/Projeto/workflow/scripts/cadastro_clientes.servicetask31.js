function servicetask31(attempt, message) {
	
	var numProcess = getValue("WKNumProces");
	
	log.info( 'CARD_DATA...............'+numProcess );
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = ""+sdf.format(dtNow).substring(0,10);
	var dataCadTxt = ""+getValueForm( "dat_cadastro", dataTxt ).split('/').reverse().join('-');
	 
	try{
		log.info("## RESULT POST 2 ## " );
	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId : getValue("WKCompany") + "",
	        serviceCode : "Logix_PRD",
			endpoint : "/LOGIXREST/kbtr00005/cliente",
			
	    }; 

		log.info("## RESULT POST 3 ## "+getValueForm('tipo_cadastro','') );
	    log.info( "Antes Data........"+getValueForm( "cnpj", "" ).replace(".","").replace(".","").replace("/","").replace("-","")+"");
		
		var params = {};
		var lr_cliente = [];
		var lr_cliente_ = {};

		/*------------------------------
		* CARREGAMENTO DOS DADOS JSON LR CLIENTE
		* ----------------------------*/
	    if ( getValueForm( 'tipo_cadastro', '' ) == 'A'){
	    	data["method"] = "put"; 
			lr_cliente_["tipo_cadastro"] = getValueForm( "tipo_cadastro", "" )+"";
			lr_cliente_["cod_cliente"] = getValueForm( "cnpj", "" ).replace(".","").replace(".","").replace("/","").replace("-","")+""; 
	    }else{
	    	data["method"] = "post"; 
			lr_cliente_["tipo_cadastro"] = getValueForm( "tipo_cadastro", "" )+"";
			lr_cliente_["cod_cliente"] = getValueForm( "cnpj", "" ).replace(".","").replace(".","").replace("/","").replace("-","")+"";  
	    }
	    
	    lr_cliente_["cod_class"] = getValueForm( "cod_class", "A" )+"";
		
		log.info( 'Agora....'+getValueForm( "valEditName", "" ) );
		if ( getValueForm( "valEditName", "X" ) == 'N' ){
			lr_cliente_["nom_cliente"] = getValueForm( "razao_social_zoom", "" )+"";
		}else{
			lr_cliente_["nom_cliente"] = getValueForm( "razao_social", "" )+"";
		}
		lr_cliente_["end_cliente"] = getValueForm( "endereco", "" )+"";
		lr_cliente_["den_bairro"] = getValueForm( "bairro", getValueForm( "bairro_sel", "" ) )+"";
		lr_cliente_["cod_cidade"] = getValueForm( "cod_cidade", "" )+"";
		lr_cliente_["cod_cep"] = getValueForm( "cep", "" )+"";
		lr_cliente_["num_caixa_postal"] = getValueForm( "num_caixa_postal", "" )+"";
		lr_cliente_["num_telefone"] = getValueForm( "fone", "" )+"";
		lr_cliente_["num_fax"] = getValueForm( "fax", "" )+"";
		lr_cliente_["num_telex"] = getValueForm( "rede", "" )+"";
		lr_cliente_["num_suframa"] = getValueForm( "num_suframa", "" )+"";
		lr_cliente_["cod_tip_cli"] = getValueForm( "tipo_cliente", "04" )+"";
		lr_cliente_["den_marca"] = getValueForm( "den_marca", "" )+"";
		lr_cliente_["nom_reduzido"] = getValueForm( "nom_reduzido", "" )+"";
		lr_cliente_["den_frete_posto"] = getValueForm( "den_frete_posto", "" )+"";
		lr_cliente_["num_cgc_cpf"] = getValueForm( "cnpj", "" )+"";
		lr_cliente_["ins_estadual"] = getValueForm( "ie", "" )+"";
		lr_cliente_["cod_portador"] = getValueForm( "cod_portador", " " )+"";
		lr_cliente_["ies_tip_portador"] = getValueForm( "ies_tip_portador", "" )+"";
		lr_cliente_["cod_cliente_matriz"] = getValueForm( "cod_cliente_matriz", "" )+"";
		lr_cliente_["cod_consig"] = getValueForm( "cod_consig", "" )+"";
		lr_cliente_["ies_cli_forn"] = getValueForm( "ies_cli_forn", "C" )+"";
		lr_cliente_["ies_zona_franca"] = getValueForm( "ies_zona_franca", "N" )+"";
		lr_cliente_["ies_situacao"] = getValueForm( "ies_situacao", "A" )+"";
		lr_cliente_["cod_rota"] = getValueForm( "cod_rota", "0" )+"";
		lr_cliente_["cod_praca"] = getValueForm( "cod_praca", "0" )+"";
		lr_cliente_["dat_cadastro"] = dataCadTxt+"";
		lr_cliente_["dat_atualiz"] = dataCadTxt+"";
		lr_cliente_["nom_contato"] = getValueForm( "nom_contato", "" )+"";
		lr_cliente_["cod_local"] = getValueForm( "cod_local", "0" )+"";
		lr_cliente_["correio_eletronico"] = getValueForm( "correio_eletronico", "" )+"";
		lr_cliente_["correi_eletr_secd"] = getValueForm( "correi_eletr_secd", "" )+"";
		lr_cliente_["correi_eletr_venda"] = getValueForm( "correi_eletr_venda", "" )+"";
		lr_cliente_["endereco_web"] = getValueForm( "endereco_web", "" )+"";
		lr_cliente_["telefone_2"] = getValueForm( "telefone_2", "0" )+"";
		lr_cliente_["compl_endereco"] = getValueForm( "complemento", "" )+"";
		lr_cliente_["tip_logradouro"] = getValueForm( "tipo_logradouro", "" )+"";
		lr_cliente_["num_iden_lograd"] = getValueForm( "numero", "" )+"";
		lr_cliente_["iden_estrangeiro"] = getValueForm( "iden_estrangeiro", "" )+"";
		lr_cliente_["ind_cprb"] = getValueForm( "ind_cprb", "" )+"";
		lr_cliente_["tipo_servico"] = getValueForm( "tipo_servico", "" )+"";
		lr_cliente_["ies_contrib_ipi"] = getValueForm( "ies_contrib_ipi", "N" )+"";
		lr_cliente_["ies_fis_juridica"] = getValueForm( "cnpj", "tipoPessoa" )+"";
		log.info("ies_contrib_ipi....."+ getValueForm( "ies_contrib_ipi", "N" )+"");
		log.info("ies_fis_juridica....."+ getValueForm( "cnpj", "tipoPessoa" )+"");
		// lr_cliente_["ies_contrib_ipi"] = "N";
		// lr_cliente_["ies_fis_juridica"] = "J";
		lr_cliente_["cod_uni_feder"] = getValueForm( "estado", "" )+"";
		lr_cliente_["cod_pais"] = getValueForm( "cod_pais" )+"";
		lr_cliente_["nom_guerra"] = getValueForm( "nom_guerra", "" )+"";
		lr_cliente_["cod_cidade_pgto"] = getValueForm( "cod_cidade_pgto", "" )+"";
		lr_cliente_["camara_comp"] = getValueForm( "camara_comp", "" )+"";

		var dataNasc = ""+getValueForm("dat_fundacao", dataTxt).split('/').reverse().join('-');
	    lr_cliente_["dat_nascimento"] = dataNasc;
	    lr_cliente_["dat_fundacao"] = dataNasc;


		lr_cliente_["cod_banco"] = getValueForm( "cod_banco", "" )+"";
		lr_cliente_["num_agencia"] = getValueForm( "num_agencia", "" )+"";
		lr_cliente_["num_conta_banco"] = getValueForm( "num_conta_banco", "" )+"";
		lr_cliente_["tmp_transpor"] = getValueForm( "tmp_transpor", "1" )+"";
		lr_cliente_["tex_observ"] = getValueForm( "tex_observ", "" )+"";
		lr_cliente_["num_lote_transf"] = getValueForm( "num_lote_transf", "0" )+"";
		lr_cliente_["pct_aceite_div"] = getValueForm( "pct_aceite_div", "0" )+"";
		lr_cliente_["ies_tip_entrega"] = getValueForm( "ies_tip_entrega", "D" )+"";
		lr_cliente_["ies_dep_cred"] = getValueForm( "ies_dep_cred", "N" )+"";
		lr_cliente_["ult_num_coleta"] = getValueForm( "ult_num_coleta", "0" )+"";
		lr_cliente_["ies_gera_ap"] = getValueForm( "ies_gera_ap", "S" )+"";

		var constraintsPai = new Array(); 
		constraintsPai.push( DatasetFactory.createConstraint("cod_uni_feder", getValueForm( "estado", "" ), getValueForm( "estado", "" ), ConstraintType.MUST) );				
	    var datasetPai = DatasetFactory.getDataset("uf", null, constraintsPai, null);
		
		if ( datasetPai != null ){
			log.info('regiao X.'+ datasetPai.getValue(0, "cod_regiao") );
			lr_cliente_["cod_mercado"] = datasetPai.getValue(0, "cod_mercado")+"";
			lr_cliente_["cod_continente"] = datasetPai.getValue(0, "cod_continente")+"";
			lr_cliente_["cod_regiao"] = datasetPai.getValue(0, "cod_regiao")+"";
		}else{
			log.info('regiao fixo.' );
			lr_cliente_["cod_mercado"] = "IN";
			 lr_cliente_["cod_continente"] = "1";
			 lr_cliente_["cod_regiao"] = "1";
		}


		var qtd_dias_atr_dupl = campoVazio(getValueForm( "qtd_dias_atr_dupl", "0" ))+'';
		var qtd_dias_atr_med = campoVazio(getValueForm( "qtd_dias_atr_med", "0" ))+'';
		var val_ped_carteira = campoVazio(getValueForm( "val_ped_carteira", "0" ))+'';
		var val_dup_aberto = campoVazio(getValueForm( "val_dup_aberto", "0" ))+'';
		var dat_ult_fat = campoVazio(getValueForm( "dat_ult_fat", "0" ))+'';
		var val_limite_cred = campoVazio(getValueForm( "val_limite_cred", "0" ))+'';
		var dat_val_lmt_cr = campoVazio(getValueForm( "dat_val_lmt_cr", "0" ))+'';

		if(val_limite_cred != ''){
			val_limite_cred = (val_limite_cred).replace('.','').replace('.','').replace(',','.');
		}
		if(dat_val_lmt_cr != ''){
			(dat_val_lmt_cr).split('/').reverse().join('-');
		}


		lr_cliente_["qtd_dias_atr_dupl"] = qtd_dias_atr_dupl;
		lr_cliente_["qtd_dias_atr_med"] = qtd_dias_atr_med;
		lr_cliente_["val_ped_carteira"] = val_ped_carteira;
		lr_cliente_["val_dup_aberto"] = val_dup_aberto;
		lr_cliente_["dat_ult_fat"] = dat_ult_fat;
		lr_cliente_["ies_nota_debito"] = 'N'+"";
		lr_cliente_["ies_protesto"] = getValueForm( "ies_protesto", "S" )+"";
		lr_cliente_["ies_emis_autom_nd"] = getValueForm( "ies_emis_autom_nd", "N" )+"";
		lr_cliente_["tex_obs"] = getValueForm( "tex_obs", "0" )+"";
		lr_cliente_["qtd_dias_protesto"] = getValueForm( "qtd_dias_protesto", "0" )+"";
		lr_cliente_["ies_tip_cliente"] = getValueForm( "ies_tip_cliente", "" )+"";
		lr_cliente_["cod_float"] = getValueForm( "cod_float", "0" )+"";
		
		var qtdEmailsBoleto = parseInt(getValueForm( "qtdEmails", "0" ));
		var emailBoleto = '';	
		var emailBoleto2 = '';
		var emailBoleto3 = '';
		for (var i = 0; i < qtdEmailsBoleto; i++) {
			var index = (i + 1);
			if(getValueForm( "e_mail_cob___" + index , "" ) != null && getValueForm( "e_mail_cob___" + index , "" ) != undefined){
				if(i == 0){
					emailBoleto = (getValueForm( "e_mail_cob___" + index , "" )+"");
				}else if(i == 1){
					emailBoleto2 = (getValueForm( "e_mail_cob___" + index , "" )+"");
				}else {
					emailBoleto3 = (getValueForm( "e_mail_cob___" + index , "" )+"");
				}

			}
		}
		
		log.info("EMAIL BOLETO GET....."+ getValueForm( "e_mail_cob___" + index , "" )+"");
		log.info("EMAIL BOLETO....."+ emailBoleto);
		log.info("EMAIL BOLETO2....."+ emailBoleto2);
		log.info("EMAIL BOLETO3....."+ emailBoleto3);
		lr_cliente_["email_boleto"] = emailBoleto;

		/*------------------------------
		* CARREGAMENTO DOS OUTROS EMAILS PARA ENVIOS DE O BOLETO
		* ----------------------------*/
		
		if(emailBoleto2 != '' || emailBoleto3 != ''){
			try{
				// contextWD = new javax.naming.InitialContext();
				// dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
				// connectionWD = dataSourceWD.getConnection();
				var statementWD = null;
				var connectionWD = null;
				
				var contextWD = new javax.naming.InitialContext();
				log.info("CONTEXTWD ---------------");
				var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
				log.info("dataSourceWD ---------------");
				connectionWD = dataSourceWD.getConnection();
				log.info("connectionWD ---------------");

				var cod_cliente = getValueForm("cod_cliente", "").length < 15 ? "0" + getValueForm("cod_cliente", "") : getValueForm("cod_cliente", "")
				log.info("cod_cliente ---------------: " + cod_cliente);
				var sql = " select * from IPCA_CLIENTES_PAR icp where icp.COD_CLIENTE = '" + cod_cliente + "'";
				log.info('sql1: '+ sql);

				statementWD = connectionWD.prepareStatement(sql);
				var rsWD = statementWD.executeQuery();
				if( rsWD.next() ){
					sql = " update IPCA_CLIENTES_PAR icp  " +
						  " set icp.EMAIL2 ='"+ emailBoleto2 +"', icp.EMAIL3 ='" + emailBoleto3 + "' "+
						  " where icp.COD_CLIENTE ="+ cod_cliente +"";
				
				}else{
				
					sql = " insert into IPCA_CLIENTES_PAR (COD_CLIENTE,SUSPENDE_EMAIL, VENCIDOS , VENCER , EMAIL1, EMAIL2, EMAIL3, VENCIDOS_DE )" +
							" values( '"+ cod_cliente +"', 'N',9999,7, '"+emailBoleto+"','"+emailBoleto2+"','"+emailBoleto3+"',3) ";
				}
				
				log.info('sql2: '+sql);
				statementWD = connectionWD.prepareStatement( sql );
				statementWD.executeUpdate();
			
			} catch (e){
				log.info( "ERROOOOOO"+ e );
				throw( "ERRO:"+ e );
			}finally {
				if(statementWD != null) statementWD.close();
				if(connectionWD != null) connectionWD.close();
			}
		}

		//-------------------------------------------------------
		
		lr_cliente_["val_limite_cred"] = val_limite_cred;
		lr_cliente_["dat_val_lmt_cr"] = dat_val_lmt_cr;
		lr_cliente_["dat_atualiz"] = dataTxt+""; //preencher

		lr_cliente_["e_mail"] = getValueForm( "correio_eletronico", "" )+"";
		lr_cliente_["email_secund"] = getValueForm( "correi_eletr_secd", "" )+"";

		//INICIO -- NÃO TINHA NO SCRIPT ANTERIOR - DADOS A MAIS DESSE PROCESSO
		codRepres = getValueForm( "cod_repres", "" );
		log.info("Inicializador padrÃÂÃÂ£o");
		lr_cliente_["cod_nivel_1"] = "";
		lr_cliente_["cod_nivel_2"] = "";
		lr_cliente_["cod_nivel_3"] = "";
		lr_cliente_["cod_nivel_4"] = "";
		lr_cliente_["cod_nivel_5"] = "";
		lr_cliente_["cod_nivel_6"] = "";
		lr_cliente_["cod_nivel_7"] = "";	     
		lr_cliente_["ies_nivel"] = "";		 
		
		var constraintsPai = new Array(); 
		constraintsPai.push( DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST) );				
		var datasetPai = DatasetFactory.getDataset("representante", null, constraintsPai, null);
		if ( datasetPai != null ){
			for(var x = 0; x < datasetPai.rowsCount; x++) {
				log.info( "ADD CV"+datasetPai.getValue(x, "cv_1" )+"" );
				lr_cliente_["cod_nivel_1"] = datasetPai.getValue(x, "cv_1" )+"";
				lr_cliente_["cod_nivel_2"] = datasetPai.getValue(x, "cv_2" )+"";
				lr_cliente_["cod_nivel_3"] = datasetPai.getValue(x, "cv_3" )+"";
				lr_cliente_["cod_nivel_4"] = datasetPai.getValue(x, "cv_4" )+"";
				lr_cliente_["cod_nivel_5"] = datasetPai.getValue(x, "cv_5" )+"";
				lr_cliente_["cod_nivel_6"] = datasetPai.getValue(x, "cv_6" )+"";
				lr_cliente_["cod_nivel_7"] = datasetPai.getValue(x, "cv_7" )+"";	     
				lr_cliente_["ies_nivel"] = datasetPai.getValue(x, "ies_nivel" )+"";
			}
		}
		 
		lr_cliente_["cod_tip_carteira"] = getValueForm( "cod_tip_carteira", "01" )+"";
		lr_cliente_["pais_nascimento"] = getValueForm( "cod_pais", "" )+"";
		lr_cliente_["pais_nacionalidade"] = getValueForm( "cod_pais", "" )+"";
	    lr_cliente_["tip_inscricao"] = "2";
		lr_cliente_["num_inscricao"] = "0";
		lr_cliente_["sexo"] = "M";
		lr_cliente_["raca_cor"] = "1";
		lr_cliente_["estado_civil"] = "1";
		lr_cliente_["grau_instrucao"] = "1";
		lr_cliente_["categoria_sped_social"] = "101";
		lr_cliente_["dat_ini_sindicato_cooperativa"] = "";
		lr_cliente_["optante_fgts"] = "";
		lr_cliente_["dat_opcao_fgts"] = "";
		lr_cliente_["ies_aprovacao"] = "S";
		lr_cliente_["ies_situa_cliente"] = "N";
		
		lr_cliente.push(lr_cliente_);
		params["lr_cliente"] = lr_cliente;
		log.info( 'ATENCAO --- lr_cliente..............'+JSON.stringify( lr_cliente) );
		log.info( 'ATENCAO --- params..............'+JSON.stringify( params) );

		/*------------------------------
		* CARREGAMENTO DE DADOS CLIENTE
		* ----------------------------*/
		var la_cli_contatos = [];
		var camposItem = hAPI.getCardData( getValue("WKNumProces") );
		var contadorItem = camposItem.keySet().iterator();
		while ( contadorItem.hasNext() ) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			if ( seqItem != undefined && campo == "TIPO_CONTATO" ){
				
				log.info( 'Sequencia.....'+seqItem );
				
				log.info( 'Lista Contato..............'+contadorItem+'registro...'+seqItem+'....campo....'+campo);
				var contato = {};
				contato["num_contato"] = seqItem+1+"";
				contato["nom_contato"] = getValueForm( "nome_contato___"+seqItem, "" )+"";
				contato["cod_cargo"] = getValueForm( "tipo_contato___"+seqItem, "" )+"";
				contato["dat_nascimento"] = getValueForm( "dat_nascimento___"+seqItem, "" )+"";
				contato["num_telefone"] = getValueForm( "fone_contato___"+seqItem, "" )+"";
				contato["celular"] = getValueForm( "celular_contato___"+seqItem, "" )+"";
				contato["num_fax"] = getValueForm( "celular_contato___"+seqItem, "" )+"";
				contato["email"] = getValueForm( "email_contato___"+seqItem, "" )+"";
				contato["cod_hobby"] = getValueForm( "cod_hobby___"+seqItem, "" )+"";
				contato["num_ramal"] = getValueForm( "num_ramal___"+seqItem, "" )+"";
				contato["departnto"] = getValueForm( "departnto___"+seqItem, "" )+"";
				contato["setor"] = getValueForm( "setor___"+seqItem, "" )+"";
				contato["observacao"] = getValueForm( "observacao___"+seqItem, "" )+"";
				
				la_cli_contatos.push( contato );  
	
			}
		}
		if( la_cli_contatos.length == 0 ){
			la_cli_contatos.push( {} );
		}
		params["la_cli_contatos"] = la_cli_contatos;
		log.info( 'ATENCAO --- la_cli_contatos..............'+JSON.stringify( la_cli_contatos) );

		var la_vdp_cli_parametro = [{}];	      
		params["la_vdp_cli_parametro"] = la_vdp_cli_parametro;


		/*------------------------------
		* CONFIGURAÇÕES DE SUP FORNECEDOR
		* ----------------------------*/
		var la_sup_par_fornecedor = [{}];
		params["la_sup_par_fornecedor"] = la_sup_par_fornecedor;
		
		/*------------------------------
		* CONFIGURAÇÕES DE VPN CLIENTE CANAL VENDA
		* ----------------------------*/
		log.info( 'ATENCAO --- la_sup_par_fornecedor..............'+JSON.stringify( la_sup_par_fornecedor) );
		var la_cli_canal_venda = [];
		
		if( getValueForm( "cod_repres", "" ) != "" ){
			var constraintsPai = new Array(); 
			constraintsPai.push( DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST) );				
			var datasetPai = DatasetFactory.getDataset("representante", null, constraintsPai, null);
			log.info( 'ATENCAO --- Consulta dataset1..............' + datasetPai);
			
			var constraintsRepreInterno = new Array(); 
			constraintsRepreInterno.push( DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST) );				
			var datasetRepreInterno = DatasetFactory.getDataset("representante_compl", null, constraintsRepreInterno, null);
			log.info( 'ATENCAO --- Consulta dataset2..............' + datasetRepreInterno);
			var carteira = '';
			var cod_carteira = '';
			var tipo_carteira = '';
			/*------------------------------
			* CARREGAMENTO DE DADOS DATASET INTERNO REPRESENTANTES
			* ----------------------------*/
			
			if ( datasetPai != null ){
				for(var x = 0; x < datasetPai.rowsCount; x++) {
					if(datasetRepreInterno != undefined && datasetRepreInterno.rowsCount > 0){
						if(datasetRepreInterno.getValue(x, "carteira" ) != '' && datasetRepreInterno.getValue(x, "cod_carteira" ) != '' && datasetRepreInterno.getValue(x, "tipo_carteira" )){
							carteira = datasetRepreInterno.getValue(x, "carteira" )+"";
							cod_carteira = datasetRepreInterno.getValue(x, "cod_carteira" )+"";
							tipo_carteira = datasetRepreInterno.getValue(x, "tipo_carteira" )+"";
			
						}else{
							carteira = '01';
							cod_carteira = '01';
							tipo_carteira = '';
						}
					}else{
						carteira = '01';
						cod_carteira = '01';
						tipo_carteira = '';
					}
					log.info( 'ATENCAO --- Consulta carteira..............' + carteira);
					log.info( 'ATENCAO --- Consulta dataset2..............' + cod_carteira);
					log.info( 'ATENCAO --- Consulta dataset2..............' + tipo_carteira);
					log.info( "ADD CV"+datasetPai.getValue(x, "CV_1" )+"" );
					var cli_canal_venda = {};
					cli_canal_venda["cod_nivel_1"] = datasetPai.getValue(x, "CV_1" )+"";
					cli_canal_venda["cod_nivel_2"] = datasetPai.getValue(x, "CV_2" )+"";
					cli_canal_venda["cod_nivel_3"] = datasetPai.getValue(x, "CV_3" )+"";
					cli_canal_venda["cod_nivel_4"] = datasetPai.getValue(x, "CV_4" )+"";
					cli_canal_venda["cod_nivel_5"] = datasetPai.getValue(x, "CV_5" )+"";
					cli_canal_venda["cod_nivel_6"] = datasetPai.getValue(x, "CV_6" )+"";
					cli_canal_venda["cod_nivel_7"] = datasetPai.getValue(x, "CV_7" )+"";	     
					cli_canal_venda["ies_nivel"] = datasetPai.getValue(x, "ies_nivel" )+"";
					cli_canal_venda["carteira"] = carteira +"";
					cli_canal_venda["cod_tip_carteira"] = cod_carteira+"";
					cli_canal_venda["tipo_carteira"] = tipo_carteira+"";	     
					
					
					la_cli_canal_venda.push( cli_canal_venda );
			    }
			}else{
				la_cli_canal_venda.push( {} );
			}
			
		}else{
			la_cli_canal_venda.push( {} );
		}
	    params["la_cli_canal_venda"] = la_cli_canal_venda;
		log.info( 'ATENCAO --- la_cli_canal_venda..............'+JSON.stringify( la_cli_canal_venda) );

		// FIM ----
		/*------------------------------
		* CARREGAMENTO DO GRUPO DE EMAILS PARA NFE
		* ----------------------------*/

		var la_vdp_cli_grp_email = [];
	    var indexes = hAPI.getChildrenIndexes("emails_nfe");
	    log.info( 'Lista Mail..............'+indexes.length );
	    for (var i = 0; i < indexes.length; i++) {
	    	  var mail = {};
	    	  mail["grupo_email"] = "1";
	    	  mail["seq_email"] = getValueForm( "id_email___"+indexes[i], "" )+""; //i+1+"";
	    	  if( getValueForm( "ies_excluido___"+indexes[i] ) == "S"  ){
	    		  mail["email"] = null;
	    	  }else{
	    		  mail["email"] = getValueForm( "email_nfe___"+indexes[i], "" )+"";  
	    	  }
	    	  mail["tip_registro"] = "C";
	    	  mail["des_grupo_email"] = "NFe XML";
	    	  la_vdp_cli_grp_email.push( mail );  
	    }
	    if ( la_vdp_cli_grp_email.length == 0 ){
			la_vdp_cli_grp_email.push( {} );
		}
	    log.info( 'ATENCAO --- la_vdp_cli_grp_email..............'+JSON.stringify( la_vdp_cli_grp_email) );


		/*------------------------------
		* CARREGAMENTO DO DADOS DE SÓCIOS
		* ----------------------------*/
		var la_credcad_socios = [];
		var indexes = hAPI.getChildrenIndexes("socios_diretores");
		log.info( 'Socios..............'+indexes.length );
		for (var i = 0; i < indexes.length; i++) {
			var socio = {};
			socio["num_cpf_socio"] = getValueForm( "cpf_socio___"+indexes[i], "" )+"";
			socio["nom_socio"] = getValueForm( "nome_socio___"+indexes[i], "" )+"";
			socio["ies_negativo"] = "N";
			socio["dat_negativo"] = "";
			la_credcad_socios.push( socio );  
		}
		if ( la_credcad_socios.length == 0 ){
			la_credcad_socios.push( {} );
		}
		params["la_credcad_socios"] = la_credcad_socios;
		log.info( 'ATENCAO --- la_credcad_socios..............'+JSON.stringify( la_credcad_socios) );

		/*------------------------------
		* CARREGAMENTO DE CLIENTE DADOS
		* ----------------------------*/
		var la_cli_end_ent = [];
		var la_cli_end_ent_ = {};
		if ( getValueForm( "endereco_cob", "" ) != "" ){ 
			la_cli_end_ent_["sequencia_end_cob"] = "1"+"";
			la_cli_end_ent_["num_cgc"] = getValueForm( "cnpj", "" ).replace(".","").replace(".","").replace("/","").replace("-","")+"";
			la_cli_end_ent_["ins_estadual"] = getValueForm( "ie", "" )+"";
			la_cli_end_ent_["tip_endereco_end_cob"] = getValueForm( "tipo_logradouro_cob", "C" )+"";
			la_cli_end_ent_["tip_logradouro_end_cob"] = getValueForm( "tipo_logradouro_cob", "" )+"";
			la_cli_end_ent_["logradouro_end_cob"] = getValueForm( "endereco_cob", "" )+"";
			la_cli_end_ent_["num_iden_lograd_end_cob"] = getValueForm( "numero_cob", "S/N" )+"";
			la_cli_end_ent_["complemento_endereco_end_cob"] = getValueForm( "complemento_cob", "0" )+"";
			la_cli_end_ent_["bairro_cobr_entga"] = getValueForm( "bairro_cob", getValueForm( "bairro_cob_sel", "" ) )+"";
			la_cli_end_ent_["cod_cidade_end_cob"] = getValueForm( "cod_cidade_cob", "" )+"";
			la_cli_end_ent_["cod_cep_end_cob"] = getValueForm( "cep_cob", "0" )+"";
		}else{
			la_cli_end_ent_["tip_endereco_end_cob"] = "";
			la_cli_end_ent_["sequencia_end_cob"] = "";
			la_cli_end_ent_["tip_logradouro_end_cob"] = "";
			la_cli_end_ent_["logradouro_end_cob"] = "";
			la_cli_end_ent_["num_iden_lograd_end_cob"] = "";
			la_cli_end_ent_["complemento_endereco_end_cob"] = "";
			la_cli_end_ent_["bairro_cobr_entga"] = "";
			la_cli_end_ent_["cod_cidade_end_cob"] = "";
			la_cli_end_ent_["cod_cep_end_cob"] = "";
		}
		la_cli_end_ent.push(la_cli_end_ent_)
		log.info( 'ATENCAO --- la_cli_end_ent..............'+JSON.stringify( la_cli_end_ent));
		params["la_cli_end_ent"] = la_cli_end_ent;

		/*------------------------------
		* CARREGAMENTO DO DADOS DE GRUPO EMAIL
		* ----------------------------*/
		var la_vdp_cli_grp_email = [];
		var camposItem = hAPI.getCardData( getValue("WKNumProces") );
		var contadorItem = camposItem.keySet().iterator();
		while ( contadorItem.hasNext() ) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			if ( seqItem != undefined && campo == "GRUPO_EMAIL" ){
			  log.info( 'Sequencia.....'+seqItem );
			  log.info( 'Lista Mail..............'+contadorItem+'registro...'+seqItem );
			  var mail = {};
			  mail["grupo_email"] = getValueForm( "grupo_email___"+seqItem, "1" )+"";
			  mail["seq_email"] = seqItem+1+"";
			  mail["email"] = getValueForm( "email___"+seqItem, "" )+"";
			  mail["tip_registro"] = "C";
			  mail["des_grupo_email"] = getValueForm( "des_grupo_email___"+seqItem, "NFe XML" )+"";
			  la_vdp_cli_grp_email.push( mail ); 
			}
	    }
		if ( la_vdp_cli_grp_email.length == 0 ){
			la_vdp_cli_grp_email.push( {} );
		}

		params["la_vdp_cli_grp_email"] = la_vdp_cli_grp_email;
		params["la_cap_par_fornec_imp"] = [{}];
		params["la_fornec_x_empresa"] = [{}];
		params["la_sup_cntt_fornec"] = [{}];
		params["la_cap_forn_dep_sped_social"] = [{}];
		params["la_sup_par_inscr_est"] = [{}];
		params["la_sup_inscr_fornec"] = [{}];
		params["la_sup_par_teg_fornec"] = [{}];
		params["la_term_ge_fornec"] = [{}];
		params["la_cap_fornec_pix"] = [{}];
		params["la_obf_grp_fisc_cli"] = [{}];
		params["la_cre_emp_cli_port"] = [{}];
		params["la_vdp_emp_cli_par"] = [{}];
		params["la_cli_cond_pgto"] = [{}];
		      
		data["params"] = params;
		/*------------------------------
		* CONSUMINDO dataSourceWD LogixDS
		* ----------------------------*/
		log.info("## antes do stringify ## "+data.toString() );
		var jj = JSON.stringify( data );
		log.info("## RESULT POST jj ## "+ jj );
		var vo = clientService.invoke( jj );
		if(vo.getResult()== "" || vo.getResult().isEmpty()){
			throw "Retorno estÃ¡ vazio";
		}else{
			//var jr = JSON.parse( vo.getResult() );
			log.info("## RESULT POST res ## "+vo.getResult() );
			
			var jr = JSON.parse( vo.getResult() );
			if ( jr.data.retorno == null  ){
				throw 'Nao foi recebido retorno do servidor Logix!'; 
			}else if ( jr.data.retorno == 'FALSE') {
				var msg = 'Ocorreu erro no processamento do servidor Logix!\n';
					msg += jr.messages[0].detail;
				var	msgs = new String( msg );
					//msgs = msgs.replace( /||||/g, '\n').replace( /||/, '');
				log.info("## RESULT POST MSG ## "+ msgs );
				throw msgs;
			}
			
			// Grava internacional
			if ( getValueForm('internacional') == 'on' ){
				var statementWD = null;
				var connectionWD = null;
				var rsWD = null;
				
				var contextWD = new javax.naming.InitialContext();
				var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
				connectionWD = dataSourceWD.getConnection();
				
				var cod_cliente = jr.data.cod_cliente;
				
				var COUNT = 0;
				var SQL = "SELECT count(*) as qtd FROM CLI_INFO_ADIC where cod_cliente = '"+cod_cliente+"' ";
				
				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();
				while (rsWD.next()) {
					COUNT = parseInt( rsWD.getString('QTD') );
				}
				
				if ( COUNT == 0 ){
					var SQL = "insert into CLI_INFO_ADIC (cod_cliente, cod_fornec_cliente, val_min_fatur, val_max_fatur ) values "+
							  "( '"+cod_cliente+"', '"+getValueForm('ruc')+"', 0, 99999999 )";
					
					statementWD = connectionWD.prepareStatement(SQL);
					rsWD = statementWD.executeQuery();
				} else {
					var SQL = "update CLI_INFO_ADIC set cod_fornec_cliente = '"+getValueForm('ruc')+"' where cod_cliente = '"+cod_cliente+"' ";
					  
					  statementWD = connectionWD.prepareStatement(SQL);
					  rsWD = statementWD.executeQuery();
				}
				if (rsWD != null) rsWD.close();
			}
		}
		if ( getValueForm("numProcesso") != "" && getValueForm("numProcesso") != null && getValueForm("numProcesso") != undefined ){
		
			try{
				var numProcesso = getValue('WKNumProces');
				var userId = getValue("WKUser");
				
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint( 'processo', getValueForm("numProcesso"), getValueForm("numProcesso"), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'atividade', '47', '47', ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'usuario', userId, userId, ConstraintType.MUST) );
				//	Busca o dataset
				var datasetReturned = DatasetFactory.getDataset( 'processo_movimento', null, constraints, null);		
				
				if (datasetReturned != null ) {
					//var atividade = datasetReturned.getValue(0,'atividade');
					setComment( userId, numProcesso, 'Movimentado processo de orçamento ('+ getValueForm("numProcesso") +')' );
				}
			} catch(err) {
				log.info( err.toString() );
			}
		}
		
	} catch(err) {
		throw err.toString();
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
		    
	    	
}

function campoVazio(valorCampo) { ''
	if(valorCampo == undefined){
		return ''
	}else{
		return valorCampo;
	}
}