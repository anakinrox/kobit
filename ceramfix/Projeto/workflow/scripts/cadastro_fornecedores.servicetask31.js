function servicetask31(attempt, message) {

	var numProcess = getValue("WKNumProces");

	log.info('CARD_DATA...............' + numProcess);

	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = "" + sdf.format(dtNow).substring(0, 10);

	try {
		log.info("## RESULT ## ");
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "Logix_PRD",
			endpoint: "/logixrest/kbtr00005/cliente"/*,
	        /logixrest/cerr3/cliente/
	        method : "post"*/ //"post", "delete", "patch", "put", "get"
		};


		var params = {};
		if (getValueForm('tipo_cadastro', 'N') == 'A') {
			data["method"] = "put";
		} else {
			data["method"] = "post";
		}



		var ies_cli_forn = "C";
		var lr_cliente = {}
		lr_cliente["cod_cliente"] = getValueForm("cnpj", "").replace(".", "").replace("/", "").replace("-", "") + "";
		lr_cliente["cod_class"] = getValueForm("cod_class", "") + "";

		lr_cliente["nom_cliente"] = (getValueForm("valEditName", "X") == 'N' ? getValueForm("razao_social_zoom", "") : getValueForm("razao_social", "")) + "";
		lr_cliente["end_cliente"] = (new String(getValueForm("endereco", ""))).replace(/,/g, ".") + "";
		lr_cliente["den_bairro"] = getValueForm("bairro", getValueForm("bairro_sel", "")) + "";
		lr_cliente["cod_cidade"] = getValueForm("cod_cidade", "") + "";
		lr_cliente["cod_cep"] = getValueForm("cep", "00000-000").replace('.', '') + "";
		lr_cliente["num_caixa_postal"] = getValueForm("num_caixa_postal", "") + "";
		lr_cliente["num_telefone"] = getValueForm("fone", "") + ""; //obrigatorio
		lr_cliente["num_fax"] = getValueForm("fax", "") + "";
		lr_cliente["num_telex"] = getValueForm("rede", "") + "";
		lr_cliente["num_suframa"] = getValueForm("num_suframa", "0") + "";
		lr_cliente["cod_tip_cli"] = getValueForm("tipo_cliente", "04") + "";
		lr_cliente["den_marca"] = getValueForm("den_marca", "") + "";
		lr_cliente["nom_reduzido"] = getValueForm("nom_reduzido", "") + "";
		lr_cliente["den_frete_posto"] = getValueForm("den_frete_posto", "") + "";
		lr_cliente["num_cgc_cpf"] = getValueForm("cnpj", "") + "";
		lr_cliente["ins_estadual"] = getValueForm("ie", "") + "";
		lr_cliente["cod_portador"] = getValueForm("cod_portador", "") + ""; //preencher
		lr_cliente["ies_tip_portador"] = getValueForm("ies_tip_portador", "") + ""; //preencher
		lr_cliente["cod_cliente_matriz"] = getValueForm("cod_cliente_matriz", "") + "";
		lr_cliente["cod_consig"] = getValueForm("cod_consig", "") + "";
		lr_cliente["ies_cli_forn"] = getValueForm("ies_cli_forn", "C") + "";
		lr_cliente["ies_zona_franca"] = getValueForm("ies_zona_franca", "N") + "";
		lr_cliente["ies_situacao"] = getValueForm("ies_situacao", "A") + "";
		lr_cliente["cod_rota"] = getValueForm("cod_rota", "0") + "";
		lr_cliente["cod_praca"] = getValueForm("cod_praca", "0") + "";
		lr_cliente["dat_cadastro"] = getValueForm("dat_cadastro", dataTxt) + "";
		lr_cliente["dat_atualiz"] = getValueForm("dat_cadastro", dataTxt) + "";

		lr_cliente["nom_contato"] = getValueForm("nom_contato", "") + "";
		lr_cliente["dat_fundacao"] = getValueForm("dat_fundacao", dataTxt) + "";
		lr_cliente["cod_local"] = getValueForm("cod_local", "0") + "";
		lr_cliente["correio_eletronico"] = getValueForm("correio_eletronico", "") + "";
		lr_cliente["correi_eletr_secd"] = getValueForm("correi_eletr_secd", "") + "";
		lr_cliente["correi_eletr_venda"] = getValueForm("correi_eletr_venda", "") + "";
		lr_cliente["endereco_web"] = getValueForm("endereco_web", "") + "";

		//  ##### Validar

		// lr_cliente["des_subtipo_fornecedor"] = "";
		// lr_cliente["ies_liquida_oc"] = "";
		// lr_cliente["ies_aproveita_ped"] = "";
		// lr_cliente["ins_municipal"] = "";
		// lr_cliente["ies_item_iso"] = "";
		// lr_cliente["dat_aprov"] = "";
		// lr_cliente["ies_aprovado"] = "";
		// lr_cliente["ies_tip_aprovacao"] = "";
		// lr_cliente["ies_funrural"] = "";
		// lr_cliente["ies_forma_pagto"] = "";
		// lr_cliente["registro_saa"] = "";
		// lr_cliente["codigo_ret"] = "";
		// lr_cliente["validade_ret"] = "";
		// lr_cliente["ies_forma_envio"] = "E";
		// lr_cliente["e_mail"] = getValueForm("email_contato_comercial", "") + "";
		// lr_cliente["num_tel_celular"] = getValueForm("celular_contato_comercial", "") + "";
		// lr_cliente["endereco_web_fornec_compl"] = "";
		// lr_cliente["email_secund"] = getValueForm("email2_contato_comercial", "") + "";
		// lr_cliente["pct_pontuacao"] = "";

		lr_cliente["telefone_2"] = getValueForm("telefone_2", "0") + "";
		lr_cliente["compl_endereco"] = getValueForm("complemento", "") + "";
		lr_cliente["tip_logradouro"] = getValueForm("tip_logradouro", "") + ""; //preencher
		lr_cliente["num_iden_lograd"] = getValueForm("numero", "") + "";
		lr_cliente["iden_estrangeiro"] = getValueForm("iden_estrangeiro", "") + "";
		lr_cliente["ind_cprb"] = getValueForm("ind_cprb", "") + "";
		lr_cliente["tipo_servico"] = getValueForm("tipo_servico", "") + "";
		lr_cliente["ies_contrib_ipi"] = getValueForm("ies_contrib_ipi", "N") + "";


		lr_cliente["eh_simples_nacional"] = null;

		lr_cliente["ies_fis_juridica"] = getValueForm("cnpj", "tipoPessoa") + "";

		lr_cliente["cod_uni_feder"] = getValueForm("estado", "") + "";
		lr_cliente["cod_pais"] = getValueForm("cod_pais", "") + "";
		lr_cliente["nom_guerra"] = getValueForm("nom_guerra", "") + "";
		lr_cliente["cod_cidade_pgto"] = getValueForm("cod_cidade_pgto", "") + "";
		lr_cliente["camara_comp"] = getValueForm("camara_comp", "") + "";

		lr_cliente["ies_dep_cred"] = getValueForm("ies_dep_cred", "N") + "";
		lr_cliente["cod_banco"] = getValueForm("cod_banco", "") + "";

		lr_cliente["num_agencia"] = getValueForm("num_agencia", "") + "";
		lr_cliente["num_conta_banco"] = getValueForm("num_conta_banco", "") + "";
		lr_cliente["tmp_transpor"] = getValueForm("tmp_transpor", "1") + "";
		lr_cliente["tex_observ"] = getValueForm("tex_observ", "") + "";
		lr_cliente["num_lote_transf"] = getValueForm("num_lote_transf", "0") + "";
		lr_cliente["pct_aceite_div"] = getValueForm("pct_aceite_div", "0") + "";
		lr_cliente["ies_tip_entrega"] = getValueForm("ies_tip_entrega", "D") + "";
		lr_cliente["ult_num_coleta"] = getValueForm("ult_num_coleta", "0") + "";
		lr_cliente["ies_gera_ap"] = getValueForm("ies_gera_ap", "S") + "";


		var constraintsPai = new Array();
		constraintsPai.push(DatasetFactory.createConstraint("cod_uni_feder", getValueForm("estado", ""), getValueForm("estado", ""), ConstraintType.MUST));
		var datasetPai = DatasetFactory.getDataset("uf", null, constraintsPai, null);
		if (datasetPai != null) {
			lr_cliente["cod_mercado"] = datasetPai.getValue(0, "cod_mercado") + "";
			lr_cliente["cod_continente"] = datasetPai.getValue(0, "cod_continente") + "";
			lr_cliente["cod_regiao"] = datasetPai.getValue(0, "cod_regiao") + "";
		} else {
			lr_cliente["cod_mercado"] = "IN";
			lr_cliente["cod_continente"] = "1";
			lr_cliente["cod_regiao"] = "1";
		}
		lr_cliente["qtd_dias_atr_dupl"] = "0" + "";
		lr_cliente["qtd_dias_atr_med"] = "0" + "";
		lr_cliente["val_ped_carteira"] = "0" + "";
		lr_cliente["val_dup_aberto"] = "0" + "";
		lr_cliente["dat_ult_fat"] = dataTxt + "";
		lr_cliente["val_limite_cred"] = "0" + "";

		// lr_cliente["ies_aprovacao"] = "S";
		// lr_cliente["ies_situa_cliente"] = "N";


		lr_cliente["dat_val_lmt_cr"] = dataTxt + "";
		lr_cliente["ies_nota_debito"] = 'N' + "";
		lr_cliente["ies_protesto"] = "S" + "";
		lr_cliente["ies_emis_autom_nd"] = "N" + "";
		lr_cliente["tex_obs"] = "" + "";
		lr_cliente["qtd_dias_protesto"] = "5" + "";
		lr_cliente["ies_tip_cliente"] = "" + "";
		lr_cliente["cod_float"] = "0" + "";
		lr_cliente["email_boleto"] = "fornecedor@fornecedor.com.br" + "";

		//autonomo
		lr_cliente["num_rg"] = "";
		lr_cliente["cod_org_emis"] = "";
		lr_cliente["num_inscr_inss"] = "";
		lr_cliente["cod_classe"] = "";
		lr_cliente["num_cart_motorista"] = "";
		lr_cliente["num_cbo"] = "";

		lr_cliente["dat_nascimento"] = dataTxt + "";
		lr_cliente["pais_nascimento"] = "001";
		lr_cliente["pais_nacionalidade"] = "001";
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
			"cod_cnd_pgto": "",
			"pct_desp_financ": "0",
			"cod_cnd_pgto_frete": ""
		})
		la_cli_cond_pgto.length == 0 ? la_cli_cond_pgto = [{}] : "";


		// var ctt = new Array();
		// ctt.push(DatasetFactory.createConstraint("documentid", getValueForm("ies_tip_fornec", ""), getValueForm("ies_tip_fornec", ""), ConstraintType.MUST));
		// var dst = DatasetFactory.getDataset("tipo_fornecedor", null, ctt, null);
		// if (dst.rowsCount > 0) {
		// 	lr_cliente["ies_tip_fornec"] = dst.getValue(0, "ies_tip_fornec").trim() + "";
		// }

		var la_cap_par_fornec_imp = [{}];
		// la_cap_par_fornec_imp.push({
		// 	"des_parametro": "RETEM ISS NO PAGAMENTO",
		// 	"parametro": "reten_iss_pag_ent",
		// 	"parametro_booleano": null,
		// 	"parametro_dat": null,
		// 	"parametro_numerico": null,
		// 	"parametro_texto": "N",
		// 	"parametro_val": null
		// });

		var la_fornec_x_empresa = [{}];
		var la_vdp_cli_parametro = [{}];
		var la_cli_contatos = [{}];
		var la_cli_end_ent = [{}];

		var la_credcad_socios = [{}];

		var la_sup_par_fornecedor = [{}];
		var la_vdp_cli_grp_email = [];
		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();
		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			if (seqItem != undefined && campo == "GRUPO_EMAIL") {
				var mail = {};
				mail["grupo_email"] = getValueForm("grupo_email___" + seqItem, "1") + "";
				mail["seq_email"] = seqItem + 1 + "";
				mail["email"] = getValueForm("email___" + seqItem, "") + "";
				mail["tip_registro"] = "C";
				mail["des_grupo_email"] = getValueForm("des_grupo_email___" + seqItem, "NFe XML") + "";
				la_vdp_cli_grp_email.push(mail);
			}
		}

		la_vdp_cli_grp_email.length == 0 ? la_vdp_cli_grp_email.push({}) : "";


		var codRepres = "1101";
		var la_cli_canal_venda = [];
		var constraintsPai = new Array();
		constraintsPai.push(DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST));
		var datasetPai = DatasetFactory.getDataset("representante", null, constraintsPai, null);
		if (datasetPai != null) {
			for (var x = 0; x < datasetPai.rowsCount; x++) {
				var cli_canal_venda = {};
				cli_canal_venda["cod_nivel_1"] = datasetPai.getValue(x, "cv_1") + "";
				cli_canal_venda["cod_nivel_2"] = datasetPai.getValue(x, "cv_2") + "";
				cli_canal_venda["cod_nivel_3"] = datasetPai.getValue(x, "cv_3") + "";
				cli_canal_venda["cod_nivel_4"] = datasetPai.getValue(x, "cv_4") + "";
				cli_canal_venda["cod_nivel_5"] = datasetPai.getValue(x, "cv_5") + "";
				cli_canal_venda["cod_nivel_6"] = datasetPai.getValue(x, "cv_6") + "";
				cli_canal_venda["cod_nivel_7"] = datasetPai.getValue(x, "cv_7") + "";
				cli_canal_venda["ies_nivel"] = datasetPai.getValue(x, "ies_nivel") + "";
				cli_canal_venda["cod_tip_carteira"] = ("01") + "";
				la_cli_canal_venda.push(cli_canal_venda);
			}
		} else {
			la_cli_canal_venda.push({});
		}



		var la_sup_cntt_fornec = [{}];
		var la_cap_forn_dep_sped_social = [{}];
		var la_sup_par_inscr_est = [{}];
		var la_sup_inscr_fornec = [{}];
		var la_sup_par_teg_fornec = [{}];
		var la_term_ge_fornec = [{}];

		// var tipo_chave_pix = getValueForm("ies_pix", "") + "";
		// if (getValueForm("ies_pix", "") == "06") {
		// 	tipo_chave_pix = "03";
		// }

		var la_cap_fornec_pix = [{}];
		var la_obf_grp_fisc_cli = [{}];
		var la_cre_emp_cli_port = [{}];
		var la_vdp_emp_cli_par = [{}];

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
					hAPI.setCardValue("cod_cliente_fornecedor", jr.data.cod_cliente);

					if (hAPI.getCardValue("num_cgc_cpf") == "00.000.000/0000-00") {
						var cnpj = jr.data.cod_cliente;
						var cnpj = cnpj.substring(1, 4) + '.' + cnpj.substring(4, 7) + '.' + cnpj.substring(7, 10) + '/' + cnpj.substring(10, 14) + '-' + cnpj.substring(14, 16);
						hAPI.setCardValue("num_cgc_cpf", cnpj);
					}
				}
			}
		}
	} catch (err) {
		throw err.toString() + " - Linha: " + err.lineNumber;
	}


}