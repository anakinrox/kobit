function defineStructure() {
	addColumn('status');
}

function onSync(lastSyncDate) {


}


function createDataset(fields, constraints, sortFields) {

	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('description3');
	var endpoint = encodeURI("/v0/getItemsToIntegration?SourceId=UniqueID&MaxResults=1");

	try {

		var constraints = new Array();
		var dataSetParam = DatasetFactory.getDataset("kbt_t_paramintegraitem", null, null, null);
		// newDataset.addRow(new Array("SEM DADOS: " + dataSetParam));
		if (dataSetParam != null) {
			if (dataSetParam.rowsCount == 0) {
				newDataset.addRow(new Array("Parâmetros de integração não encontrados"));
				throw "Parâmetros de integração não encontrados";
			}
		}


		var clientService = fluigAPI.getAuthorizeClientService();
		var headers = {};
		headers["Content-Type"] = "application/json;charset=UTF-8";
		headers["Accept"] = "application/json";

		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "klassmatt",
			endpoint: endpoint,
			timeoutService: "240",
			method: "get"
		};
		// printLog('info', "## DADOS CABECALHO ##");

		data["headers"] = headers;

		// printLog('info', "## antes do stringify ## " + data.toString());
		var jj = JSON.stringify(data);

		// printLog('info', "## RESULT POST jj ## " + jj);

		var vo = clientService.invoke(jj);

		var idKlassmatt;
		var itemCode;
		var codeItem;

		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var retJson = JSON.parse(vo.getResult());
			// printLog('info', "## success Retorno ## " + JSON.stringify(retJson));
			// return false;

			var connectionWD = null;
			var statementWD = null;
			var indReg = 0;
			var wDenItem = '';
			var wDenItemReduz = '';

			for (var x = 0; x < retJson.length; x++) {


				// newDataset.addRow(new Array("RequestWorkflowCode: " + retJson[x]["ItemRequestInfo"]["RequestWorkflowCode"]));
				// break;


				idKlassmatt = retJson[x]["KlassmattId"];
				codeItem = retJson[x]["ItemCode"];
				var values;

				for (var i = 0; i < retJson[x]["BusinessUnits"].length; i++) {
					var contextWD = new javax.naming.InitialContext();
					var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
					connectionWD = dataSourceWD.getConnection();

					if (retJson[x]["ItemRequestInfo"]["RequestWorkflowCode"] == "20") {

						if (retJson[x].BusinessUnits[i]["FlexFields"]["STAT_MAT_ESPEC_CENT"]["Code"] == "A" || retJson[x].BusinessUnits[i]["FlexFields"]["STAT_MAT_ESPEC_CENT"]["Code"] == "I") {
							var wAtualiza = f_atualizaRegistro(retJson[x].BusinessUnits[i]["Code"], retJson[x]["ItemCode"], retJson[x].BusinessUnits[i]["FlexFields"]["STAT_MAT_ESPEC_CENT"]["Code"]);

							if (wAtualiza) {
								newDataset.addRow(new Array("Atualizando no logix[ Empresa: " + retJson[x].BusinessUnits[i]["Code"] + " Item: " + retJson[x]["ItemCode"] + " Code: " + retJson[x].BusinessUnits[i]["FlexFields"]["STAT_MAT_ESPEC_CENT"]["Code"]));
								callResponseKlassmatt(true, idKlassmatt, codeItem, "Item integrado com sucesso!");
							}
						}
						continue;
					}


					indReg = 0;
					var SQL = "select ";
					SQL += "	i.ies_ctr_estoque, ";
					SQL += "	i.cod_local_estoq, ";
					SQL += "	i.ies_ctr_lote, ";
					SQL += "	i.den_item, ";
					SQL += "	i.den_item_reduz, ";
					SQL += "	i.ies_tem_inspecao, ";
					SQL += "	i.cod_local_insp, ";
					SQL += "	i.fat_conver, ";
					SQL += "	(select tip_apont from MAN_ITEM_COMPL where empresa = i.cod_empresa and item = i.cod_item) as tip_apont, ";
					SQL += "	(select des_esp_item from ESP_ITEM_SUP where cod_empresa = i.cod_empresa and cod_item = i.cod_item and ies_tip_inf ='06') as endereco ";
					SQL += "from item as i ";
					SQL += "where i.cod_empresa = '" + retJson[x].BusinessUnits[i]["Code"] + "' ";
					SQL += "and i.cod_item = '" + codeItem + "' ";

					statementWD = connectionWD.prepareStatement(SQL);
					rsWD = statementWD.executeQuery();

					while (rsWD.next()) {
						indReg = 1;

						wDenItem = rsWD.getString("den_item");
						wDenItemReduz = rsWD.getString("den_item_reduz");
						var wFatorConver = rsWD.getString("fat_conver")
						var wEstoque = {
							"ies_ctr_estoque": isnull(new String(rsWD.getString("ies_ctr_estoque")), null),
							"cod_local_estoq": isnull(new String(rsWD.getString("cod_local_estoq")), null),
							"ies_ctr_lote": isnull(new String(rsWD.getString("ies_ctr_lote")), null),
							"endereco": isnull(new String(rsWD.getString("endereco")), null)
						};

						var wQualidade = {
							"ies_tem_inspecao": isnull(new String(rsWD.getString("ies_tem_inspecao")), null),
							"cod_local_insp": isnull(new String(rsWD.getString("cod_local_insp")), null),
							"ies_iso9000": new String(""),
							"tip_apont": isnull(new String(rsWD.getString("tip_apont")), null)
						}


						var SQL = "select ";
						SQL += "	num_grade_1, ";
						SQL += "	num_grade_2, ";
						SQL += "	num_grade_3, ";
						SQL += "	num_grade_4, ";
						SQL += "	num_grade_5, ";
						SQL += "	ies_endereco, ";
						SQL += "	reservado_1, ";
						SQL += "	ies_dat_producao, ";
						SQL += "	ies_volume, ";
						SQL += "	ies_comprimento, ";
						SQL += "	ies_dat_validade, ";
						SQL += "	ies_altura, ";
						SQL += "	ies_largura, ";
						SQL += "	ies_diametro, ";
						SQL += "	reservado_2 ";
						SQL += "from ITEM_CTR_GRADE ";
						SQL += "where cod_empresa = '" + retJson[x].BusinessUnits[i]["Code"] + "' ";
						SQL += "and cod_item = '" + codeItem + "'";

						statementWD = connectionWD.prepareStatement(SQL);
						var rsWDGrade = statementWD.executeQuery();

						var wGrade = {
							"num_grade_1": null,
							"num_grade_2": null,
							"num_grade_3": null,
							"num_grade_4": null,
							"num_grade_5": null,
							"ies_endereco": new String("N"),
							"reservado_1": new String(""),
							"ies_dat_producao": new String("N"),
							"ies_volume": new String("N"),
							"ies_comprimento": new String("N"),
							"ies_dat_validade": new String("N"),
							"ies_altura": new String("N"),
							"ies_largura": new String("N"),
							"ies_diametro": new String("N"),
							"reservado_2": new String("")
						};


						while (rsWDGrade.next()) {

							var wGrade = {
								"num_grade_1": isnull(new String(rsWDGrade.getString("num_grade_1")), null),
								"num_grade_2": isnull(new String(rsWDGrade.getString("num_grade_2")), null),
								"num_grade_3": isnull(new String(rsWDGrade.getString("num_grade_3")), null),
								"num_grade_4": isnull(new String(rsWDGrade.getString("num_grade_4")), null),
								"num_grade_5": isnull(new String(rsWDGrade.getString("num_grade_5")), null),
								"ies_endereco": new String(rsWDGrade.getString("ies_endereco")),
								"reservado_1": new String(rsWDGrade.getString("reservado_1")),
								"ies_dat_producao": new String(rsWDGrade.getString("ies_dat_producao")),
								"ies_volume": new String(rsWDGrade.getString("ies_volume")),
								"ies_comprimento": new String(rsWDGrade.getString("ies_comprimento")),
								"ies_dat_validade": new String(rsWDGrade.getString("ies_dat_validade")),
								"ies_altura": new String(rsWDGrade.getString("ies_altura")),
								"ies_largura": new String(rsWDGrade.getString("ies_largura")),
								"ies_diametro": new String(rsWDGrade.getString("ies_diametro")),
								"reservado_2": new String(rsWDGrade.getString("reservado_2"))
							};
						}

						var SQL = "select ";
						SQL += "	qtd_lim_tempo_ressup, ";
						SQL += "	tempo_acrescimo_ressup_1, ";
						SQL += "	fator_multiplo_1, ";
						SQL += "	qtd_lim_multiplo_ressup, ";
						SQL += "	tempo_acrescimo_ressup_2, ";
						SQL += "	fator_multiplo_2 ";
						SQL += "from MAN_ITEM_COMPL ";
						SQL += "where empresa = '" + retJson[x].BusinessUnits[i]["Code"] + "' ";
						SQL += "and item = '" + codeItem + "'";

						statementWD = connectionWD.prepareStatement(SQL);
						var rsWDManu = statementWD.executeQuery();

						var wManu = {
							"qtd_lim_tempo_ressup": new String("0"),
							"tempo_acrescimo_ressup_1": new String("0"),
							"fator_multiplo_1": new String("1"),
							"qtd_lim_multiplo_ressup": new String("0"),
							"tempo_acrescimo_ressup_2": new String("0"),
							"fator_multiplo_2": new String("1")
						};

						while (rsWDManu.next()) {
							var wManu = {
								"qtd_lim_tempo_ressup": isnull(new String(rsWDManu.getString("qtd_lim_tempo_ressup")), null),
								"tempo_acrescimo_ressup_1": isnull(new String(rsWDManu.getString("tempo_acrescimo_ressup_1")), null),
								"fator_multiplo_1": isnull(new String(rsWDManu.getString("fator_multiplo_1")), null),
								"qtd_lim_multiplo_ressup": isnull(new String(rsWDManu.getString("qtd_lim_multiplo_ressup")), null),
								"tempo_acrescimo_ressup_2": isnull(new String(rsWDManu.getString("tempo_acrescimo_ressup_2")), null),
								"fator_multiplo_2": isnull(new String(rsWDManu.getString("fator_multiplo_2")), null)
							};
						}


						var SQL = "select ";
						SQL += "	ies_rateio_compra, ";
						SQL += "	ies_item_iso_9000, ";
						SQL += "	cod_local_receb, ";
						SQL += "	cod_progr, ";
						SQL += "	cod_comprador, ";
						SQL += "	qtd_lote_minimo, ";
						SQL += "	tmp_necessar_fabr, ";
						SQL += "	tmp_transpor, ";
						SQL += "	tmp_inspecao, ";
						SQL += "	tmp_necessar_cont, ";
						SQL += "	tmp_reposic_emerg, ";
						SQL += "	dat_compra_futura, ";
						SQL += "	vid_util, ";
						SQL += "	ies_lista_pt_ped, ";
						SQL += "	ies_freq_entrega, ";
						SQL += "	tmp_necessar_p_ped, ";
						SQL += "	qtd_lote_maximo, ";
						SQL += "	qtd_lote_multiplo, ";
						SQL += "	qtd_lote_economic, ";
						SQL += "	qtd_pt_pedid, ";
						SQL += "	qtd_estoq_max, ";
						SQL += "	qtd_dias_est_max, ";
						SQL += "	qtd_dias_est_seg, ";
						SQL += "	qtd_meses_media ";
						SQL += "from item_sup ";
						SQL += "where cod_empresa = '" + retJson[x].BusinessUnits[i]["Code"] + "' ";
						SQL += "and cod_item = '" + codeItem + "'";

						statementWD = connectionWD.prepareStatement(SQL);
						var rsWDMate = statementWD.executeQuery();

						var wMate = { // Não envia no update
							"ies_rateio_compra": new String("N"),
							"ies_item_iso_9000": new String(""),
							"cod_local_receb": isnull(new String(""), ""),
							"cod_progr": new String(""),
							"cod_comprador": new String(""),
							"cod_cc_resp_incl": new String(""), //new String(hAPI.getCardValue("cod_cc_resp_incl")),
							"qtd_lote_minimo": new String(""),
							"tmp_necessar_fabr": new String(""),
							"tmp_transpor": new String(""),
							"tmp_inspecao": new String(""),
							"tmp_necessar_cont": new String(""),
							"tmp_reposic_emerg": new String(""),
							"dat_compra_futura": new String(""),
							"vid_util": new String(""),
							"ies_lista_pt_ped": new String(""),
							"ies_freq_entrega": new String(""),
							"qtd_cotacao": new String("0"),
							"tmp_necessar_p_ped": new String(""),
							"qtd_lote_maximo": new String(""),
							"qtd_lote_multiplo": new String(""),
							"qtd_lote_economic": new String(""),
							"qtd_pt_pedid": new String(""),
							"qtd_estoq_segur": new String(""),
							"qtd_estoq_max": new String(""),
							"qtd_dias_est_max": new String(""),
							"qtd_dias_est_seg": new String(""),
							"qtd_meses_media": new String(""),
							"observacao": new String("")
						};

						while (rsWDMate.next()) {
							var wMate = { // Não envia no update
								"ies_rateio_compra": new String(rsWDMate.getString("ies_rateio_compra")),
								"ies_item_iso_9000": new String(rsWDMate.getString("ies_item_iso_9000")),
								"cod_local_receb": isnull(new String(rsWDMate.getString("cod_local_receb")), ""),
								"cod_progr": new String(rsWDMate.getString("cod_progr")),
								"cod_comprador": new String(rsWDMate.getString("cod_comprador")),
								"cod_cc_resp_incl": new String(""), //new String(hAPI.getCardValue("cod_cc_resp_incl")),
								"qtd_lote_minimo": new String(rsWDMate.getString("qtd_lote_minimo")),
								"tmp_necessar_fabr": new String(rsWDMate.getString("tmp_necessar_fabr")),
								"tmp_transpor": new String(rsWDMate.getString("tmp_transpor")),
								"tmp_inspecao": new String(rsWDMate.getString("tmp_inspecao")),
								"tmp_necessar_cont": new String(rsWDMate.getString("tmp_necessar_cont")),
								"tmp_reposic_emerg": new String(rsWDMate.getString("tmp_reposic_emerg")),
								"dat_compra_futura": new String(rsWDMate.getString("dat_compra_futura")),
								"vid_util": new String(rsWDMate.getString("vid_util")),
								"ies_lista_pt_ped": new String(rsWDMate.getString("ies_lista_pt_ped")),
								"ies_freq_entrega": new String(rsWDMate.getString("ies_freq_entrega")),
								"qtd_cotacao": new String("0"),
								"tmp_necessar_p_ped": new String(rsWDMate.getString("tmp_necessar_p_ped")),
								"qtd_lote_maximo": new String(rsWDMate.getString("qtd_lote_maximo")),
								"qtd_lote_multiplo": new String(rsWDMate.getString("qtd_lote_multiplo")),
								"qtd_lote_economic": new String(rsWDMate.getString("qtd_lote_economic")),
								"qtd_pt_pedid": new String(rsWDMate.getString("qtd_pt_pedid")),
								"qtd_estoq_segur": new String(""),
								"qtd_estoq_max": new String(rsWDMate.getString("qtd_estoq_max")),
								"qtd_dias_est_max": new String(rsWDMate.getString("qtd_dias_est_max")),
								"qtd_dias_est_seg": new String(rsWDMate.getString("qtd_dias_est_seg")),
								"qtd_meses_media": new String(rsWDMate.getString("qtd_meses_media")),
								"observacao": new String("")
							};
						}


					}


					if (statementWD != null) statementWD.close();
					if (connectionWD != null) connectionWD.close();

					newDataset.addRow(new Array("Empresa: " + retJson[x].BusinessUnits[i]["Code"] + " Codigo: " + retJson[x]["ItemCode"] + " - Descricao: " + retJson[x]["Description3"]));

					if (indReg == 0) {

						var wIndControleEstoque = "N";
						if ((retJson[x]["FlexFields"]["CODIGO_TIPO_ITEM"]["Code"] != '7') && (retJson[x]["FlexFields"]["CODIGO_TIPO_ITEM"]["Code"] != '8')) {
							wIndControleEstoque = "S";
						}

						var wFamilia = isnull(new String(retJson[x]["FlexFields"]["FAMILIA"]["Code"]), null);
						if (wFamilia == null) {
							throw "Campo familia não informado";
							return false;
						}

						var wClassFiscal = '';

						if (retJson[0]["TaxClassificationFormatted"] == "NCM") {
							wClassFiscal = retJson[0]["TaxClassificationFormatted"];
						} else {
							var str = retJson[0]["TaxClassificationFormatted"];
							wClassFiscal = str.substring((str.length - 10), 12);
						}

						values = {
							"tip_solicitacao": {
								"tip_solicitacao": new String("2") //1 novo - 2 edit
							},
							"basico": {
								"cod_empresa": new String(retJson[x].BusinessUnits[i]["Code"]),
								"cod_familia": wFamilia,
								"gru_ctr_estoq": isnull(new String(retJson[x]["FlexFields"]["GRUPO_CONTROLE_ESTOQUE"]["Code"]), '10'),
								"cod_item": new String(retJson[x]["ItemCode"]),
								"den_item": new String(retJson[x]["Description3"]),
								"den_item_reduz": new String(retJson[x]["Description3"]),
								"ies_tip_item": new String(retJson[x]["ItemType"]),
								"cod_unid_med": new String(retJson[x]["UnitOfMeasure"]),
								"cod_item_barra": new String(""),
								"pes_unit": new String(retJson[x]["NetWeight"]),
								"fat_conver": new String("1"),
								"cod_lin_prod": isnull(new String(retJson[x]["FlexFields"]["LINHA_DE_PRODUTO"]["Code"]), '1'),
								"cod_lin_recei": isnull(new String(retJson[x]["FlexFields"]["LINHA_DE_RECEITA"]["Code"]), '0'),
								"cod_seg_merc": isnull(new String(retJson[x]["FlexFields"]["SEGMENTO_DE_MERCADO"]["Code"]), "0"),
								"cod_cla_uso": isnull(new String(retJson[x]["FlexFields"]["CLASSE_DE_USO"]["Code"]), "0"),
								"ies_situacao": new String(retJson[x]["ItemType"]),
							},

							// Area e LINHA_DE_PRODUTO

							// grupo de controle
							// 	//***REGRA DE ESTOQUE? VALOR VIRÁ DO KLASSMATT?***//
							"estoque": {  // Tem que enviar
								"ies_ctr_estoque": new String(wIndControleEstoque),
								"cod_local_estoq": new String(""),
								"ies_ctr_lote": new String("N"),
								"endereco": new String("")
							},
							// "custos": { // Não Enviar update
							// 	"cod_comp_custo": new String("")
							// },
							"qualidade": { // tem que enviar
								"ies_tem_inspecao": new String("N"),
								"cod_local_insp": new String(""),
								"ies_iso9000": new String(""),
								"tip_apont": new String("")
							},
							/*
							// 			"grades_dimensionais" : {      // Enviar update
							// 				"num_grade_1" : null,
							// 				"num_grade_2" : null,
							// 				"num_grade_3" : null,
							// 				"num_grade_4" : null,
							// 				"num_grade_5" : null,
							// 				"ies_endereco" : new String( "N" ),
							// 				"reservado_1" : new String( "" ),
							// 				"ies_dat_producao" : new String( "N" ),
							// 				"ies_volume" : new String( "N" ),
							// 				"ies_comprimento" : new String( "N" ),
							// 				"ies_dat_validade" : new String( "N" ),
							// 				"ies_altura" : new String( "N" ),
							// 				"ies_largura" : new String( "N" ),
							// 				"ies_diametro" : new String( "N" ),
							// 				"reservado_2" : new String( "" )
							// 			},     // Enviar update
							// 			"manufatura" : { // Enviar update
							// 				"qtd_lim_tempo_ressup" : new String("0"),//getValueDecimalForm("qtd_lim_tempo_ressup","0")),
							// 				"tempo_acrescimo_ressup_1" : new String("0"),//getValueDecimalForm("tempo_acrescimo_ressup_1","0")),
							// 				"fator_multiplo_1" :new String("1"), //getValueDecimalForm("fator_multiplo_1","1")),
							// 				"qtd_lim_multiplo_ressup" : new String("0"), //getValueDecimalForm("qtd_lim_multiplo_ressup","0")),
							// 				"tempo_acrescimo_ressup_2" : new String("0"), //getValueDecimalForm("tempo_acrescimo_ressup_2","0")),
							// 				"fator_multiplo_2" : new String("1") //getValueDecimalForm("fator_multiplo_2","1"))
							// 			},*/
							"fiscal": {
								"cod_cla_fisc": new String(wClassFiscal),
								"pct_ipi": new String(retJson[0]["TaxClassificationStdIPI"]),
							}
						};

						// printLog("info", "wfman001_create_item_1" + JSON.stringify(values));
						var wResult = callLogixFunction('wfman001_create_item_1', values, retJson[x].BusinessUnits[i]["Code"], "");
						if (wResult.status == true) {
							// if (true == true) {

							values = {
								"tip_solicitacao": {
									"tip_solicitacao": new String("2")
								},
								"basico": {
									"cod_empresa": new String(retJson[x].BusinessUnits[i]["Code"]),
									"cod_item": new String(retJson[x]["ItemCode"])
								},
								"materiais": { // Não envia no update
									"ies_rateio_compra": new String("N"),
									"ies_item_iso_9000": new String(""),
									"cod_local_receb": isnull(new String(""), ""),
									"cod_progr": new String(""),
									"cod_comprador": new String(""),
									"cod_cc_resp_incl": new String(""), //new String(hAPI.getCardValue("cod_cc_resp_incl")),
									"qtd_lote_minimo": new String(""),
									"tmp_necessar_fabr": new String(""),
									"tmp_transpor": new String(""),
									"tmp_inspecao": new String(""),
									"tmp_necessar_cont": new String(""),
									"tmp_reposic_emerg": new String(""),
									"dat_compra_futura": new String(""),
									"vid_util": new String(""),
									"ies_lista_pt_ped": new String(""),
									"ies_freq_entrega": new String(""),
									"qtd_cotacao": new String("0"),
									"tmp_necessar_p_ped": new String(""),
									"qtd_lote_maximo": new String(""),
									"qtd_lote_multiplo": new String(""),
									"qtd_lote_economic": new String(""),
									"qtd_pt_pedid": new String(""),
									"qtd_estoq_segur": new String(""),
									"qtd_estoq_max": new String(""),
									"qtd_dias_est_max": new String(""),
									"qtd_dias_est_seg": new String(""),
									"qtd_meses_media": new String(""),
									"observacao": new String("")
								},
								"fiscal": { // envia no update
									"cod_cla_fisc_naladi": isnull(new String(retJson[x]["TaxClassificationNALADI"]), ""),
									"gru_ctr_desp": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["GRUPO_DESPESA"]["Code"]), ""),
									"cod_tip_despesa": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["TIPO_DESPESA"]["Code"]), ""),
									"num_conta": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["CONTA_CONTABIL"]["Code"]), ""),
									"ies_tip_incid_ipi": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["INCIDENCIA_IPI"]["Code"]), ""),
									"ies_tip_incid_icms": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["INCIDENCIA_ICMS"]["Code"]), ""),
									"cest": isnull(new String(retJson[x]["TaxClassificationCESTFormatted"]), ""),
									"ies_cred_pis": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["ITEM_DIRETO_PIS_COFINS"]["Code"]), ""),
									"tipo_item_sped": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["TIPO_ITEM_SPED_FISCAL"]["Code"]), ""),
									"cod_fiscal": isnull(new String(retJson[x]["FlexFields"]["CFOP"]["Code"]), null),
									"cod_fiscal_compl": new String("0"), //getValueForm("cod_fiscal_compl","0")),
									"pct_agregado": new String(""),
									"ies_contabiliza": new String("S")
								},
								"norma_iso": ""
							};

							// printLog("info", "wfman001_create_item_2: " + JSON.stringify(values));
							var wResult = callLogixFunction('wfman001_create_item_2', values, retJson[x].BusinessUnits[i]["Code"], "");
							// printLog("info", "Retorno: wfman001_create_item_2: " + JSON.stringify(wResult));

						}


						// 		/*Response - Movimenta solicitação no Klassmatt*/
						callResponseKlassmatt(true, idKlassmatt, codeItem, "Item integrado com sucesso!");

					} else {


						var wIndControleEstoque = "N";
						if ((retJson[x]["FlexFields"]["CODIGO_TIPO_ITEM"]["Code"] != '7') && (retJson[x]["FlexFields"]["CODIGO_TIPO_ITEM"]["Code"] != '8')) {
							wIndControleEstoque = "S";
						}

						var wFamilia = isnull(new String(retJson[x]["FlexFields"]["FAMILIA"]["Code"]), null);
						if (wFamilia == null) {
							throw "Campo familia não informado";
							return false;
						}

						var wClassFiscal = '';

						if (retJson[0]["TaxClassificationFormatted"] == "NCM") {
							wClassFiscal = retJson[0]["TaxClassificationFormatted"];
						} else {
							var str = retJson[0]["TaxClassificationFormatted"];
							wClassFiscal = str.substring((str.length - 10), 12);
						}

						values = {
							"tip_solicitacao": {
								"tip_solicitacao": new String("2") //1 novo - 2 edit
							},
							"basico": {
								"cod_empresa": new String(retJson[x].BusinessUnits[i]["Code"]),
								"cod_familia": wFamilia,
								"gru_ctr_estoq": isnull(new String(retJson[x]["FlexFields"]["GRUPO_CONTROLE_ESTOQUE"]["Code"]), '10'),
								"cod_item": new String(retJson[x]["ItemCode"]),
								"den_item": new String(retJson[x]["Description3"]),
								"den_item_reduz": new String(wDenItemReduz),
								"ies_tip_item": new String(retJson[x]["ItemType"]),
								"cod_unid_med": new String(retJson[x]["UnitOfMeasure"]),
								"cod_item_barra": new String(""),
								"pes_unit": new String(retJson[x]["NetWeight"]),
								"fat_conver": new String(wFatorConver),
								"cod_lin_prod": isnull(new String(retJson[x]["FlexFields"]["LINHA_DE_PRODUTO"]["Code"]), '1'),
								"cod_lin_recei": isnull(new String(retJson[x]["FlexFields"]["LINHA_DE_RECEITA"]["Code"]), '0'),
								"cod_seg_merc": isnull(new String(retJson[x]["FlexFields"]["SEGMENTO_DE_MERCADO"]["Code"]), "0"),
								"cod_cla_uso": isnull(new String(retJson[x]["FlexFields"]["CLASSE_DE_USO"]["Code"]), "0"),
								"ies_situacao": new String(retJson[x]["ItemType"]),
							},
							"estoque": wEstoque,
							"qualidade": wQualidade,
							"grades_dimensionais": wGrade,
							"manufatura": wManu,
							"fiscal": {
								"cod_cla_fisc": new String(wClassFiscal),
								"pct_ipi": new String(retJson[0]["TaxClassificationStdIPI"]),
							}
						};

						// printLog("info", "wfman001_create_item_1 UPDATE " + JSON.stringify(values));
						var wResult = callLogixFunction('wfman001_create_item_1', values, retJson[x].BusinessUnits[i]["Code"], "");
						if (wResult.status == true) {
							// if (true == true) {

							values = {
								"tip_solicitacao": {
									"tip_solicitacao": new String("2")
								},
								"basico": {
									"cod_empresa": new String(retJson[x].BusinessUnits[i]["Code"]),
									"cod_item": new String(retJson[x]["ItemCode"])
								},
								"materiais": wMate,
								"fiscal": { // envia no update
									"cod_cla_fisc_naladi": isnull(new String(retJson[x]["TaxClassificationNALADI"]), ""),
									"gru_ctr_desp": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["GRUPO_DESPESA"]["Code"]), ""),
									"cod_tip_despesa": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["TIPO_DESPESA"]["Code"]), ""),
									"num_conta": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["CONTA_CONTABIL"]["Code"]), ""),
									"ies_tip_incid_ipi": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["INCIDENCIA_IPI"]["Code"]), ""),
									"ies_tip_incid_icms": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["INCIDENCIA_ICMS"]["Code"]), ""),
									"cest": isnull(new String(retJson[x]["TaxClassificationCESTFormatted"]), ""),
									"ies_cred_pis": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["ITEM_DIRETO_PIS_COFINS"]["Code"]), ""),
									"tipo_item_sped": isnull(new String(retJson[x].BusinessUnits[i]["FlexFields"]["TIPO_ITEM_SPED_FISCAL"]["Code"]), ""),
									"cod_fiscal": isnull(new String(retJson[x]["FlexFields"]["CFOP"]["Code"]), null),
									"cod_fiscal_compl": new String("0"),
									"pct_agregado": new String(""),
									"ies_contabiliza": new String("S")
								},
								"norma_iso": ""
							};

							// printLog("info", "wfman001_create_item_2 UPDATE: " + JSON.stringify(values));
							var wResult = callLogixFunction('wfman001_create_item_2', values, retJson[x].BusinessUnits[i]["Code"], "");
							// printLog("info", "Retorno: wfman001_create_item_2: " + JSON.stringify(wResult));

						}

						// 		/*Response - Movimenta solicitação no Klassmatt*/
						callResponseKlassmatt(true, idKlassmatt, codeItem, "Item integrado com sucesso!");

					}
				}

			}

		}
	} catch (erro) {
		// printLog('erro', "ERROOOOOO" + erro.toString());
		// printLog('info', "## Call Response Error Klassmatt ##");
		// callResponseKlassmatt(false, idKlassmatt, codeItem, erro.toString());
		newDataset.addRow(new Array("Erro: " + erro.toString()));
		// throw erro.toString();

	}
	return newDataset;

}

function callResponseKlassmatt(status, klassmattId, itemCode, errorMessage) {

	// printLog('info', "# klassmattId : " + klassmattId + " itemCode : " + itemCode);

	var clientService = fluigAPI.getAuthorizeClientService();
	var endpoint = encodeURI("/V0/updateItemIntegrationStatus");

	var response = {
		KlassmattId: klassmattId,
		ItemCode: itemCode,
		Success: status,
		ErrorMessage: errorMessage
	};

	// printLog('info', "## Response Body ## " + response);

	var dataResponse = {
		companyId: getValue("WKCompany") + "",
		serviceCode: "klassmatt",
		endpoint: endpoint,
		timeoutService: "240",
		method: "post",
		params: {
			"KlassmattId": klassmattId,
			"ItemCode": itemCode,
			"Success": status,
			"ErrorMessage": errorMessage
		}
	};

	var headers = {};
	headers["Content-Type"] = "application/json;charset=UTF-8";
	headers["Accept"] = "application/json";

	dataResponse["headers"] = headers;

	var strResponse = JSON.stringify(dataResponse);

	// printLog('info', "## Response ## " + strResponse);

	var invokeResult = clientService.invoke(strResponse);

	// printLog('info', "Result Response: " + invokeResult.getResult());

	if (invokeResult.getResult() == "" || invokeResult.getResult().isEmpty()) {
		throw "Retorno esta vazio";
	} else {
		var result = JSON.parse(invokeResult.getResult());

		if (result.Success == true) {
			// printLog('info', "## success ## " + result.Message);
		} else {
			// printLog('error', "## error ## " + result.Message);
		}
	}

}

function onMobileSync(user) { }

var debug = true;


function callLogixFunction(funct, values, emp, defname) {
	var result;

	//Recupera o WS do LOGIX.
	var serviceProvider = ServiceManager.getService('LogixWS');
	var serviceHelper = serviceProvider.getBean();
	var serviceLocator = serviceHelper.instantiate('br.com.totvs.webservices.WSECMSERVICELOGIXLocator');
	var service = serviceLocator.getWSECMSERVICELOGIXSOAP();
	var constraints = new Array();
	var dataSetParam = DatasetFactory.getDataset("kbt_t_paramintegraitem", null, null, null);

	if (dataSetParam == null) {
		throw "Parâmetros de integração não encontrados";
		return true;
	}

	var comp = emp;
	var user = dataSetParam.getValue(0, "str_login")
	var wSenha = dataSetParam.getValue(0, "str_senha")
	var pswd = java.util.Base64.getEncoder().encodeToString(wSenha.getBytes());

	//*****CRIAR OUTRO USUÁRIO PARA CONEXAO*****//
	// var user = "arcoin";   //hAPI.getCardValue("fw_user");
	// var pswd = "dGFuYWMxMjM="; //hAPI.getCardValue("fw_pswd");

	// var user = "admlog";   //hAPI.getCardValue("fw_user");
	// var pswd = "OGJyYXMxbDg="; //hAPI.getCardValue("fw_pswd");	

	// var Fsenha = new java.lang.String(JSON.stringify("tanac456"));
	// var EndodeSenha = new java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(Fsenha.getBytes());


	// var user = "arcoin";   //hAPI.getCardValue("fw_user");
	// var pswd = "dGFuYWM0NTY=" //hAPI.getCardValue("fw_pswd");
	// var comp = emp; 		   //hAPI.getCardValue("fw_comp");

	//Compatibilidade com a versão antiga onde as funções 4GL eram obrigadas a
	//ter o sufixo _wfprocess.
	funct += (defname === "undefined") ? "_wfprocess" : "";

	try {
		log.info('values...... ' + values);
		values = JSON.stringify(values);

		result = service.CALLFUNCTION(funct, values, user, pswd, comp);
		result = JSON.parse(result);

		log.error('[LOGIX] result [' + result.status + ' - ' + result.msg + ']');

		if (result.status != true) {
			throw '[LOGIX] Nao foi possivel executar a rotina no ERP Logix [' + result.msg + ']';
		}

	} catch (e) {
		log.error('[LOGIX] Nao foi possivel executar a rotina no ERP Logix [' + e.toString() + ']');
		throw '[LOGIX] Nao foi possivel executar a rotina no ERP Logix [' + e.toString() + ']';
	}

	return result;
}

function printLog(tipo, msg) {

	if (debug) {
		var msgs = getValue("WKDef") + " - " + getValue("WKNumProces") + " - " + msg
		if (tipo == 'info') {
			log.info(msgs);
		} else if (tipo == 'error') {
			log.error(msgs);
		} else if (tipo == 'fatal') {
			log.fatal(msgs);
		} else {
			log.warn(msgs);
		}
	}
}


function isnull(valor, valorAlter) {
	if (valor == null || valor == undefined || valor == "null") {
		return valorAlter;
	} else {
		return valor
	}
}


function f_atualizaRegistro(pCodEmpresa, pCodItem, pIndSitucao) {
	try {
		var wRetorno = false;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		connectionWD = dataSourceWD.getConnection();

		var sqlUPD = "update item  set ies_situacao = '" + pIndSitucao + "' where cod_empresa = '" + pCodEmpresa + "' and cod_item = '" + pCodItem + "'";
		var statementWD = connectionWD.prepareStatement(sqlUPD);
		statementWD.executeUpdate();

		wRetorno = true;


	} catch (error) {
		wRetorno = false;
	} finally {

		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		return wRetorno;
	}
}