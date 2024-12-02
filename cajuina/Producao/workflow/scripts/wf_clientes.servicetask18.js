function servicetask18(attempt, message) {

	log.info(" entrei servicetask35..... ");

	var numProcess = getValue("WKNumProces");
	log.info('CARD_DATA...............' + numProcess);

	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = "" + sdf.format(dtNow).substring(0, 10);

	var dataAbertTxt = "" + getValueForm("dat_fundacao", dataTxt).split('/').reverse().join('-');
	var dataCadTxt = "" + getValueForm("dat_cadastro", dataTxt).split('/').reverse().join('-');

	var dataNasc = "" + getValueForm("data_nascimento", dataTxt).split('/').reverse().join('-');

	try {
		log.info("## RESULT ## ");
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "LogixRest",
			endpoint: "/kbtr00005/cliente"/*,
	        /logixrest/kbtr00005/cliente/20564503053
	        method : "post"*/ //"post", "delete", "patch", "put", "get"
		};

		var params = {};
		/*if( getValueForm( "ies_operacao", "" ) == "N" ){	*/
		data["method"] = "post";
		/*}else{
			data["method"] = "put";
		}*/

		var cgc_cpf = getValueForm("num_cgc_cpf", "");
		if (cgc_cpf.indexOf("/0000-") >= 0) {
			var ies_fis_juridica = 'F';
		} else {
			var ies_fis_juridica = 'J';
		}

		var cod_cliente = cgc_cpf.replace(/\D/g, '');


		var lr_cliente = {}
		lr_cliente["cod_cliente"] = cod_cliente + "";
		lr_cliente["cod_class"] = getValueForm("classe", "A") + "";
		lr_cliente["nom_cliente"] = getValueForm("nom_cliente", "") + "";
		lr_cliente["end_cliente"] = getValueForm("logradouro", "") + "";
		lr_cliente["den_bairro"] = getValueForm("bairro", "") + "";
		lr_cliente["cod_cidade"] = getValueForm("cod_cidade", "") + "";
		lr_cliente["cod_cep"] = getValueForm("cod_cep", "").replace('.', '') + "";
		lr_cliente["num_caixa_postal"] = "";
		lr_cliente["num_telefone"] = getValueForm("telefone_1", "0") + ""; //obrigatorio
		lr_cliente["num_fax"] = getValueForm("telefone_2", "0") + "";
		lr_cliente["num_telex"] = "";
		lr_cliente["num_suframa"] = "";
		lr_cliente["cod_tip_cli"] = getValueForm("cod_tip_cli", "") + "";
		lr_cliente["den_marca"] = "";
		lr_cliente["nom_reduzido"] = getValueForm("nom_reduzido", "") + "";
		lr_cliente["den_frete_posto"] = "";
		lr_cliente["num_cgc_cpf"] = cgc_cpf + "";
		lr_cliente["ins_estadual"] = getValueForm("ins_estadual", "") + "";
		lr_cliente["cod_portador"] = getValueForm("cod_portador", "") + ""; //preencher
		lr_cliente["ies_tip_portador"] = getValueForm("ies_tip_portador", "") + ""; //preencher
		lr_cliente["cod_cliente_matriz"] = "";
		lr_cliente["cod_consig"] = "";
		lr_cliente["ies_cli_forn"] = "C";
		lr_cliente["ies_zona_franca"] = "N";

		lr_cliente["ies_situacao"] = "A";

		lr_cliente["cod_rota"] = getValueForm("cod_rota", "");
		lr_cliente["cod_praca"] = getValueForm("cod_praca", "");
		lr_cliente["dat_cadastro"] = dataCadTxt + ""; //preencher
		lr_cliente["dat_atualiz"] = dataTxt + ""; //preencher
		lr_cliente["nom_contato"] = getValueForm("nom_contao_comercial", "") + "";
		lr_cliente["dat_fundacao"] = dataAbertTxt + ""; //preencher
		lr_cliente["cod_local"] = getValueForm("cod_local", "");
		lr_cliente["correio_eletronico"] = getValueForm("correio_eletronico", "") + "";
		lr_cliente["correi_eletr_secd"] = "";
		lr_cliente["correi_eletr_venda"] = "";
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
		lr_cliente["e_mail"] = getValueForm("correio_eletronico", "") + "";
		lr_cliente["num_tel_celular"] = getValueForm("telefone_2", "") + "";
		lr_cliente["endereco_web_fornec_compl"] = "";
		lr_cliente["email_secund"] = "";
		lr_cliente["pct_pontuacao"] = "";
		lr_cliente["telefone_2"] = "";
		lr_cliente["compl_endereco"] = getValueForm("compl_endereco", "") + "";
		lr_cliente["tip_logradouro"] = getValueForm("tip_logradouro", "") + ""; //preencher
		lr_cliente["num_iden_lograd"] = getValueForm("num_iden_lograd", "") + "";
		lr_cliente["iden_estrangeiro"] = "";
		lr_cliente["ind_cprb"] = "";
		lr_cliente["tipo_servico"] = "";
		lr_cliente["ies_contrib_ipi"] = "N";
		lr_cliente["ies_fis_juridica"] = ies_fis_juridica + "";
		lr_cliente["cod_uni_feder"] = getValueForm("cod_uni_feder", "") + "";
		lr_cliente["cod_pais"] = getValueForm("cod_pais", "") + "";
		lr_cliente["nom_guerra"] = "";
		lr_cliente["cod_cidade_pgto"] = "";
		lr_cliente["camara_comp"] = "";

		lr_cliente["cod_banco"] = "";
		lr_cliente["num_agencia"] = "";
		lr_cliente["num_conta_banco"] = "";
		lr_cliente["tmp_transpor"] = "1";
		lr_cliente["tex_observ"] = "";
		lr_cliente["num_lote_transf"] = "0";
		lr_cliente["pct_aceite_div"] = "0";
		lr_cliente["ies_tip_entrega"] = "D";
		lr_cliente["ies_dep_cred"] = "S";
		lr_cliente["ult_num_coleta"] = "0";
		lr_cliente["ies_gera_ap"] = "S";

		/*ajustar*/

		var constraintsPai = new Array();
		constraintsPai.push(DatasetFactory.createConstraint("uf", getValueForm("cod_uni_feder", ""), getValueForm("cod_uni_feder", ""), ConstraintType.MUST));
		constraintsPai.push(DatasetFactory.createConstraint("table", "eis_t_uf_x_reg", null, ConstraintType.MUST));
		var datasetPai = DatasetFactory.getDataset("selectLogix", null, constraintsPai, null);
		lr_cliente["cod_regiao"] = "1";
		if (datasetPai != null) {
			if (datasetPai.rowsCount > 0) {
				lr_cliente["cod_regiao"] = getValueForm("regiao", "1") + "";
			}
		}

		lr_cliente["cod_mercado"] = "1";
		lr_cliente["cod_continente"] = "1";


		lr_cliente["qtd_dias_atr_dupl"] = "0";
		lr_cliente["qtd_dias_atr_med"] = "0";
		lr_cliente["val_ped_carteira"] = "0";
		lr_cliente["val_dup_aberto"] = "0";
		lr_cliente["dat_ult_fat"] = "";
		lr_cliente["val_limite_cred"] = (getValueForm("credito", "").replace('.', '').replace('.', '').replace(',', '.')) + "";
		lr_cliente["dat_val_lmt_cr"] = getValueForm("validade_credito", "").split("/").reverse().join("-") + "";
		lr_cliente["ies_nota_debito"] = "N";
		lr_cliente["ies_protesto"] = "S";
		lr_cliente["ies_emis_autom_nd"] = "N";
		lr_cliente["tex_obs"] = getValueForm("obs_financeiro", "") + "";
		lr_cliente["qtd_dias_protesto"] = "0";
		lr_cliente["ies_tip_cliente"] = getValueForm("cod_tip_cli", "") + "";
		lr_cliente["cod_float"] = "0";
		lr_cliente["email_boleto"] = "";
		//autonomo
		lr_cliente["num_rg"] = "";
		lr_cliente["cod_org_emis"] = "";
		lr_cliente["num_inscr_inss"] = "";
		lr_cliente["cod_classe"] = "0";
		lr_cliente["num_cart_motorista"] = "";
		lr_cliente["num_cbo"] = "";

		lr_cliente["dat_nascimento"] = dataAbertTxt + "";
		lr_cliente["pais_nascimento"] = getValueForm("cod_pais", "") + "";
		lr_cliente["pais_nacionalidade"] = getValueForm("cod_pais", "") + "";
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
		lr_cliente["num_lista_preco"] = getValueForm("num_list_preco", "") + "";

		lr_cliente["cod_cnd_pgto"] = getValueForm("cod_cnd_pgto", "") + "";
		lr_cliente["pct_desp_financ"] = "0";
		lr_cliente["cod_cnd_pgto_frete"] = "";
		lr_cliente["eh_simples_nacional"] = getValueForm("simples_nacional", "") + "";

		var la_cli_cond_pgto = [];
		la_cli_cond_pgto.push({
			"cod_cnd_pgto": getValueForm("cod_cnd_pgto", "") + "",
			"pct_desp_financ": "0",
			"cod_cnd_pgto_frete": ""
		})


		var la_cap_par_fornec_imp = [];
		la_cap_par_fornec_imp.push({
			"des_parametro": "RETEM ISS NO PAGAMENTO",
			"parametro": "reten_iss_pag_ent",
			"parametro_booleano": null,
			"parametro_dat": null,
			"parametro_numerico": null,
			"parametro_texto": "N",
			"parametro_val": null
		});

		var la_fornec_x_empresa = [{ "cod_empresa": getValueForm("cod_empresa", "") + "" }];

		var la_term_ge_fornec = [];


		var la_obf_grp_fisc_cli = [];
		if (getValueForm("grp_fiscal_cliente_pis", "") != "") {
			la_obf_grp_fisc_cli.push({
				"empresa": getValueForm("cod_empresa", "") + "",
				"tributo_benef": "PIS_REC",
				"grp_fiscal_cliente": getValueForm("grp_fiscal_cliente_pis", "") + "",
				"des_grp_fisc_cli": getValueForm("des_grp_fisc_cli_pis", "") + ""
			});
		}
		if (getValueForm("grp_fiscal_cliente_cofins", "") != "") {
			la_obf_grp_fisc_cli.push({
				"empresa": getValueForm("cod_empresa", "") + "",
				"tributo_benef": "COFINS_REC",
				"grp_fiscal_cliente": getValueForm("grp_fiscal_cliente_cofins", "") + "",
				"des_grp_fisc_cli": getValueForm("des_grp_fisc_cli_cofins", "") + ""
			});
		}


		var la_cre_emp_cli_port = [];
		if (getValueForm("cod_portador_emp", "") != "") {
			la_cre_emp_cli_port.push({
				"emp_portador": getValueForm("cod_empresa", "") + "",
				"cod_portador": getValueForm("cod_portador_emp", "") + "",
				"cod_tip_portador": getValueForm("ies_tip_portador_emp", "") + ""
			});
		}

		var la_vdp_emp_cli_par = [];
		la_vdp_emp_cli_par.push({
			"emp_parametro": getValueForm("cod_empresa", "") + "",
			"cod_parametro": "lista_preco_cliente",
			"des_parametro": "Lista de preço padrão do cliente.",
			"par_existencia": null,
			"parametro_texto": "",
			"parametro_val": getValueForm("num_list_preco", "") + "",
			"parametro_dat": null
		});

		if (getValueForm("cod_portador_emp", "") != "") {
			la_vdp_emp_cli_par.push({
				"emp_parametro": getValueForm("cod_empresa", "") + "",
				"cod_parametro": "GERA BLOQUETO",
				"des_parametro": "Indicador se o cliente gera bloqueto S/N",
				"par_existencia": "S",
				"parametro_texto": null,
				"parametro_val": null,
				"parametro_dat": null
			});
		} else {
			la_vdp_emp_cli_par.push({
				"emp_parametro": getValueForm("cod_empresa", "") + "",
				"cod_parametro": "GERA BLOQUETO",
				"des_parametro": "Indicador se o cliente gera bloqueto S/N",
				"par_existencia": "N",
				"parametro_texto": null,
				"parametro_val": null,
				"parametro_dat": null
			});
		}

		var la_vdp_cli_parametro = [];
		la_vdp_cli_parametro.push(
			{
				"dat_parametro": null,
				"des_parametro": "Finalidade",
				"num_parametro": null,
				"parametro": "finalidade",
				"texto_parametro": getValueForm("finalidade", "1") + "",
				"tip_parametro": null,
				"val_parametro": null
			},
			{
				"dat_parametro": null,
				"des_parametro": "Contribuinte",
				"num_parametro": null,
				"parametro": "eh_contribuinte",
				"texto_parametro": null,
				"tip_parametro": getValueForm("considera_contribuinte", "S") + "",
				"val_parametro": null
			},
			{
				"dat_parametro": null,
				"des_parametro": "Cliente terceiro",
				"num_parametro": null,
				"parametro": "cliente_terceiro",
				"texto_parametro": null,
				"tip_parametro": "N",
				"val_parametro": null
			},
			{
				"dat_parametro": null,
				"des_parametro": "Data de Validade do Suframa",
				"num_parametro": null,
				"parametro": "dat_validade_suframa",
				"texto_parametro": getValueForm("dat_validade_suframa", null) + "",
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
		);

		var la_cli_contatos = [{}];
		var la_cli_end_ent = [{}];
		var la_credcad_socios = [{}];

		var la_sup_par_fornecedor = [
			{
				"des_parametro": "CATEGORIA DO TRABALHADOR NO SEFIP",
				"empresa": "SE",
				"parametro": "ind_ret_pis_cof ",
				"parametro_booleano": null,
				"parametro_dat": null,
				"parametro_numerico": null,
				"parametro_texto": getValueForm("ind_ret_pis_cof", "") + "",
				"parametro_val": null
			},
			{
				"des_parametro": "DECLARACAO DE ISENTO SIMPLES",
				"empresa": "SE",
				"parametro": "declara_isento ",
				"parametro_booleano": getValueForm("ind_ret_pis_cof", "") + "",
				"parametro_dat": null,
				"parametro_numerico": null,
				"parametro_texto": null,
				"parametro_val": null
			},
			{
				"des_parametro": "Indicador de Retenção de ISS.",
				"empresa": "SE",
				"parametro": "retencao_iss",
				"parametro_booleano": "N",
				"parametro_dat": null,
				"parametro_numerico": null,
				"parametro_texto": null,
				"parametro_val": null
			}
		];

		var la_vdp_cli_grp_email = [];

		var indexes = hAPI.getChildrenIndexes("emails_nfe");
		log.info('Lista Mail..............' + indexes.length);
		for (var i = 0; i < indexes.length; i++) {
			var mail = {};
			mail["grupo_email"] = "1";
			mail["seq_email"] = getValueForm("id_email___" + indexes[i], "") + ""; //i+1+"";
			if (getValueForm("ies_excluido___" + indexes[i]) == "S") {
				mail["email"] = null;
			} else {
				mail["email"] = getValueForm("email_nfe___" + indexes[i], "") + "";
			}
			mail["tip_registro"] = "C";
			mail["des_grupo_email"] = "NFe XML";
			la_vdp_cli_grp_email.push(mail);
		}
		if (la_vdp_cli_grp_email.length == 0)
			la_vdp_cli_grp_email.push({});


		var la_cli_canal_venda = [];

		if (getValueForm("cod_repres", "") != "") {

			var constraintsPai = new Array();
			constraintsPai.push(DatasetFactory.createConstraint("cod_repres", getValueForm("cod_repres", ""), getValueForm("cod_repres", ""), ConstraintType.MUST));
			constraintsPai.push(DatasetFactory.createConstraint("table", "kbt_v_representante", null, ConstraintType.MUST));
			var datasetPai = DatasetFactory.getDataset("selectLogix", null, constraintsPai, null);
			if (datasetPai != null) {
				for (var x = 0; x < datasetPai.rowsCount; x++) {
					log.info("ADD CV" + datasetPai.getValue(x, "cv_n1") + "");
					var cli_canal_venda = {};
					cli_canal_venda["cod_nivel_1"] = datasetPai.getValue(x, "cv_n1") + "";
					cli_canal_venda["cod_nivel_2"] = datasetPai.getValue(x, "cv_n2") + "";
					cli_canal_venda["cod_nivel_3"] = datasetPai.getValue(x, "cv_n3") + "";
					cli_canal_venda["cod_nivel_4"] = datasetPai.getValue(x, "cv_n4") + "";
					cli_canal_venda["cod_nivel_5"] = datasetPai.getValue(x, "cv_n5") + "";
					cli_canal_venda["cod_nivel_6"] = datasetPai.getValue(x, "cv_n6") + "";
					cli_canal_venda["cod_nivel_7"] = datasetPai.getValue(x, "cv_n7") + "";
					cli_canal_venda["ies_nivel"] = datasetPai.getValue(x, "ies_nivel") + "";
					cli_canal_venda["cod_tip_carteira"] = "01";
					la_cli_canal_venda.push(cli_canal_venda);
				}
			} else {
				la_cli_canal_venda.push({});
			}
		} else {
			la_cli_canal_venda.push({});
		}

		if (la_obf_grp_fisc_cli.length == 0) { la_obf_grp_fisc_cli = [{}]; }
		if (la_cre_emp_cli_port.length == 0) { la_cre_emp_cli_port = [{}]; }
		if (la_vdp_emp_cli_par.length == 0) { la_vdp_emp_cli_par = [{}]; }
		if (la_term_ge_fornec.length == 0) { la_term_ge_fornec = [{}]; }
		if (la_cli_cond_pgto.length == 0) { la_cli_cond_pgto = [{}]; }




		var la_sup_cntt_fornec = [{}];
		var la_cap_forn_dep_sped_social = [{}];
		var la_sup_par_inscr_est = [{}];
		var la_sup_inscr_fornec = [{}];
		var la_sup_par_teg_fornec = [{}];

		var la_cap_fornec_pix = [{}];

		params["lr_cliente"] = lr_cliente;
		params["la_cap_par_fornec_imp"] = la_cap_par_fornec_imp;
		params["la_fornec_x_empresa"] = la_fornec_x_empresa;

		params["la_obf_grp_fisc_cli"] = la_obf_grp_fisc_cli;
		params["la_cre_emp_cli_port"] = la_cre_emp_cli_port;
		params["la_vdp_emp_cli_par"] = la_vdp_emp_cli_par;
		params["la_cli_cond_pgto"] = la_cli_cond_pgto;


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

		data["params"] = params;

		log.info("## antes do stringify ## " + data.toString());
		var jj = JSON.stringify(data);
		log.info("## RESULT " + data["method"] + " jj ## " + jj);
		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			throw "Retorno está vazio";
		} else {
			//var jr = JSON.parse( vo.getResult() );
			log.info("## RESULT " + data["method"] + " res ## " + vo.getResult());

			var jr = JSON.parse(vo.getResult());
			if (jr.errorMessage) {
				throw jr.errorMessage;
			}
			if (!jr.data.retorno) {
				log.info("## RESULT " + data["method"] + " MSG ERROR ## " + jr.messages[0].detail);
				throw jr.messages[0].detail;
			} else {
				if (jr.messages[0].detail.indexOf('Rollback') > -1) {
					log.info("## RESULT " + data["method"] + " MSG ERROR ## " + jr.messages[0].detail);
					throw jr.messages[0].detail;
				} else {
					log.info("## RESULT " + data["method"] + " MSG SUCCESS ## " + jr.messages[0].detail);
					hAPI.setCardValue("cod_cliente", jr.data.cod_cliente);

					if (hAPI.getCardValue("num_cgc_cpf") == "00.000.000/0000-00") {
						var cnpj = jr.data.cod_cliente;
						var cnpj = cnpj.substring(1, 4) + '.' + cnpj.substring(4, 7) + '.' + cnpj.substring(7, 10) + '/' + cnpj.substring(10, 14) + '-' + cnpj.substring(14, 16);
						hAPI.setCardValue("num_cgc_cpf", cnpj);
					}
				}
			}
		}
	} catch (err) {
		throw err.toString();
	}


	return true;
}

function getValueForm(campo, padrao) {
	log.info("Campo........" + campo);
	var valor = hAPI.getCardValue(campo) + "";
	if (padrao == "tipoPessoa")
		if (valor.indexOf("/0000-") > -1)
			valor = "F";
		else
			valor = "J";
	log.info("Valor........" + valor);
	if (valor == "" || valor == undefined || valor == null || valor == "null") {
		valor = padrao + "";
		log.info("Valor padrao........" + valor);
	}
	return removeAcento(valor);

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
