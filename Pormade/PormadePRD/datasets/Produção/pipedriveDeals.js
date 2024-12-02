function defineStructure() {
	addColumn('status');
}
function onSync(lastSyncDate) {

	printlog("info", "## pipedriveDeals START ##");
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');


	var listaConstraits = {};
	var params = {};


	// ## Rever o leitura desse parametros

	// var area = "E";
	// var token = "";
	// log.info('Leitura Parametros......');
	// var constraints = new Array();
	// constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
	// var pipe = DatasetFactory.getDataset("pipedrive", null, constraints, null);
	// if (pipe.rowsCount == 0) {
	// 	throw "Não cadastrato parametro para esse tipo de integração.";
	// } else {
	// 	if (token == "") {
	// 		token = pipe.getValue(0, "token_api");
	// 	}
	// }

	var connectionWD = null;
	var statementWD = null;


	var hoje = new Date();
	var ontem = new Date(hoje.getTime());
	ontem.setDate(hoje.getDate() - 1);

	var token = "3ac9343a186fda82cc6732e515636681bec55372";
	var endpoint = "/v1/deals/timeline?start_date=" + ontem.toJSON().substring(0, 10) + "&interval=day&amount=365&field_key=update_time&api_token=" + token;
	// var endpoint = "/v1/deals/timeline?start_date=2021-05-06&interval=day&amount=1&field_key=update_time&api_token=" + token;
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "pipedrive",
			endpoint: endpoint,
			timeoutService: "240",
			method: "GET",
		};

		var headers = {};
		headers["Content-Type"] = "application/json";
		data["headers"] = headers;
		data["params"] = params;

		var jj = JSON.stringify(data);

		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			printlog("info", "Retorno Vazio");
			newDataset.addRown(new Array("Retorno Vazio"));
			//throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			printlog("info", "## pipedriveDeals Sucesso ## " + jr.success);

			if (!jr.success) {
				throw 'Erro na integração com PipeDrive';
			}
			// log.info("## pipedriveDealsSummary Data ## " + jr.data);
			if (jr.data != null) {
				var contextWD = new javax.naming.InitialContext();
				var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
				connectionWD = dataSourceWD.getConnection();

				for (var i = 0; i < jr.data.length; i++) {
					// log.info("Registros Deals : " + jr.data.length)
					for (var j = 0; j < jr.data[i].deals.length; j++) {
						// log.info("Registros Dados : " + jr.data[i].deals.length)

						var SQL = "delete from public.kbt_t_deals where id = " + jr.data[i].deals[j]['id'];
						var statementWD = connectionWD.prepareStatement(SQL);
						statementWD.executeUpdate();

						printlog("info", 'ID PIPEDRIVE ' + jr.data[i].deals[j]['id']);

						var SQL = "INSERT INTO public.kbt_t_deals( id, cod_empresa, creator_user_id, user_id, person_id, org_id, " +
							"   stage_id, title, value, currency, add_time, update_time, " +
							"   stage_change_time, active, deleted, status, probability, " +
							"   lost_reason, visible_to, close_time, pipeline_id, won_time, " +
							"   first_won_time, lost_time, expected_close_date, label, " +
							"   origemnegocio, codigo_parceiro, responsavelinstalacao, " +
							"   numprocessofluig, idwsobra, showroom, area, numproposta, " +
							"   disparaemailvencido, operadorcallcenter, percentbonus, " +
							"   renewal_type, aceitapormademovel, stage_order_nr, person_name, " +
							"   org_name, group_id, group_name, rotten_time," +
							"	next_activity_date, last_activity_date, next_activity_time, next_activity_id, last_activity_id, " +
							"	next_activity_subject, next_activity_type, next_activity_duration, next_activity_note, data_atualizacao ) VALUES  " +
							"(" + jr.data[i].deals[j]['id'] + ",1," + jr.data[i].deals[j]['creator_user_id'] + "," + jr.data[i].deals[j]['user_id'] + "," +
							jr.data[i].deals[j]['person_id'] + "," + jr.data[i].deals[j]['org_id'] + "," + jr.data[i].deals[j]['stage_id'] + "," +
							"'" + removeAcentos(jr.data[i].deals[j]['title'], 255) + "'," + jr.data[i].deals[j]['value'] + ",'" + jr.data[i].deals[j]['currency'] + "'," +
							frmDataSQL(jr.data[i].deals[j]['add_time']) + "," + frmDataSQL(jr.data[i].deals[j]['update_time']) + "," + frmDataSQL(jr.data[i].deals[j]['stage_change_time']) + "," +
							jr.data[i].deals[j]['active'] + "," + jr.data[i].deals[j]['deleted'] + ",'" + jr.data[i].deals[j]['status'] + "'," +
							"'" + isnull(jr.data[i].deals[j]['probability'], null) + "','" + jr.data[i].deals[j]['lost_reason'] + "','" + jr.data[i].deals[j]['visible_to'] + "'," +
							frmDataSQL(jr.data[i].deals[j]['close_time']) + "," + jr.data[i].deals[j]['pipeline_id'] + "," + frmDataSQL(jr.data[i].deals[j]['won_time']) + "," +
							frmDataSQL(jr.data[i].deals[j]['first_won_time']) + "," + frmDataSQL(jr.data[i].deals[j]['lost_time']) + "," + frmDataSQL(jr.data[i].deals[j]['expected_close_date']) + "," +
							"'" + jr.data[i].deals[j]['label'] + "','" + isnull(jr.data[i].deals[j]['fc2101060c7a3ec0982eb7376590273350873aed'], null) + "','" + isnull(jr.data[i].deals[j]['9b4993871584a554c83f15cdee87c96f0d0260a7'], null) + "'," +
							"'" + isnull(jr.data[i].deals[j]['0732891d55eb3fa27b0cf4a4c0373b1c20021752'], null) + "'," + isnull(jr.data[i].deals[j]['f00de0b109d9c4ea0d3258f12f99837c8d164c72'], null) + ",'" + isnull(jr.data[i].deals[j]['d0f013ff2b9ac878d7ed12146b34adc51f46943f'], null) + "'," +
							"'" + isnull(jr.data[i].deals[j]['63c5181ddae566980d409ee8b625a0596477b5db'], null) + "','" + isnull(jr.data[i].deals[j]['3349989cba7cc0ed0feaa3a593a0c5ee54ace217'], null) + "','" + isnull(jr.data[i].deals[j]['95959a576b193b37d31a6f6404b3c4b9f10d4b05'], null) + "'," +
							"'" + isnull(jr.data[i].deals[j]['219d2dcf439c95ff2193a12a2bf1dead6ccb6d28'], null) + "','" + isnull(jr.data[i].deals[j]['f7a0b4016041381d97f28f931479aea1255731d7'], null) + "','" + isnull(jr.data[i].deals[j]['fb9bf341a3385a475b8d73a23fc1634d3ff4ac4f'], null) + "'," +
							"'" + jr.data[i].deals[j]['renewal_type'] + "','" + isnull(jr.data[i].deals[j]['12b9429f3013162aff5d0ef4d84d46ab7a826a49'], null) + "'," + jr.data[i].deals[j]['stage_order_nr'] + "," +
							"'" + removeAcentos(jr.data[i].deals[j]['person_name'], 100) + "','" + removeAcentos(jr.data[i].deals[j]['org_name'], 255) + "'," + jr.data[i].deals[j]['group_id'] + "," +
							"'" + removeAcentos(jr.data[i].deals[j]['group_name'], 40) + "','" + jr.data[i].deals[j]['rotten_time'] + "', " +
							frmDataSQL(jr.data[i].deals[j]['next_activity_date']) + "," + frmDataSQL(jr.data[i].deals[j]['last_activity_date']) + ",'" + isnull(jr.data[i].deals[j]['next_activity_time'], '') + "', " + isnull(jr.data[i].deals[j]['next_activity_id'], 0) + "," + isnull(jr.data[i].deals[j]['last_activity_id'], 0) + "," +
							"'" + removeAcentos(isnull(jr.data[i].deals[j]['next_activity_subject'], ''), 255) + "','" + removeAcentos(isnull(jr.data[i].deals[j]['next_activity_type'], ''), 255) + "','" + removeAcentos(isnull(jr.data[i].deals[j]['next_activity_duration'], ''), 255) + "','" + removeAcentos(isnull(jr.data[i].deals[j]['next_activity_note'], ''), 255) + "', CURRENT_DATE  )";

						printlog("info", "SINC DEAL: " + SQL);
						// if (jr.data[i].deals[j]['id'] == 110241) {
						//						 	log.info("SINC DEAL: " + SQL);
						// }

						statementWD = connectionWD.prepareStatement(SQL);
						statementWD.executeUpdate();
					}
				}

				printlog("info", ' ### NÂO SNCRONIZADOS ### ');

				var SQL = "select id from kbt_t_deals where (data_atualizacao is null or data_atualizacao < current_date ) and status != 'lost' "

				var constraints = new Array();
				constraints.push(DatasetFactory.createConstraint("sql", SQL, null, ConstraintType.MUST));
				constraints.push(DatasetFactory.createConstraint("dataBase", "java:/jdbc/CRMDS", null, ConstraintType.MUST));

				var ds = DatasetFactory.getDataset('select', null, constraints, null);
				printlog("info", "## pipedriveDeals ds.rowsCount ## " + ds.rowsCount);
				for (var i = 0; i < ds.rowsCount; i++) {
					printlog("info", "## pipedriveDeals ds ## " + i);
					var endpoint = "/v1/deals/" + ds.getValue(i, "id") + "?api_token=" + token;
					printlog("info", "## pipedriveDeals endpoint ## " + endpoint);
					var clientService = fluigAPI.getAuthorizeClientService();
					var data = {
						companyId: getValue("WKCompany") + "",
						serviceCode: "pipedrive",
						endpoint: endpoint,
						timeoutService: "240",
						method: "GET",
					};

					var headers = {};
					headers["Content-Type"] = "application/json";
					data["headers"] = headers;
					data["params"] = params;

					var jj = JSON.stringify(data);

					var vo = clientService.invoke(jj);

					var jr = JSON.parse(vo.getResult());
					printlog("info", "## pipedriveDeals Sucesso ## " + jr.success);

					if (jr.data != null) {

						var SQL = "delete from public.kbt_t_deals where id = " + jr.data['id'];
						var statementWD = connectionWD.prepareStatement(SQL);
						statementWD.executeUpdate();
						//						log.info(jr.data['person_id']);
						//						log.info('person id '+ jr.data['person_id']==='null'?'null':jr.data['person_id']['value'] );
						//						log.info('org id '+ jr.data['org_id']);
						//						log.info(jr.data['org_id']);
						var SQL = "INSERT INTO public.kbt_t_deals( id, cod_empresa, creator_user_id, user_id, person_id, org_id, " +
							"   stage_id, title, value, currency, add_time, update_time, " +
							"   stage_change_time, active, deleted, status, probability, " +
							"   lost_reason, visible_to, close_time, pipeline_id, won_time, " +
							"   first_won_time, lost_time, expected_close_date, label, " +
							"   origemnegocio, codigo_parceiro, responsavelinstalacao, " +
							"   numprocessofluig, idwsobra, showroom, area, numproposta, " +
							"   disparaemailvencido, operadorcallcenter, percentbonus, " +
							"   renewal_type, aceitapormademovel, stage_order_nr, person_name, " +
							"   org_name, group_id, group_name, rotten_time," +
							"	next_activity_date, last_activity_date, next_activity_time, next_activity_id, last_activity_id, " +
							"	next_activity_subject, next_activity_type, next_activity_duration, next_activity_note, data_atualizacao ) VALUES  " +
							"(" + jr.data['id'] + ",1," + jr.data['creator_user_id']['id'] + "," + jr.data['user_id']['id'] + "," +
							(jr.data['person_id'] ? jr.data['person_id']['value'] : 'null') + "," + (jr.data['org_id'] ? jr.data['org_id']['value'] : 'null') + "," + jr.data['stage_id'] + "," +
							"'" + removeAcentos(jr.data['title'], 255) + "'," + jr.data['value'] + ",'" + jr.data['currency'] + "'," +
							frmDataSQL(jr.data['add_time']) + "," + frmDataSQL(jr.data['update_time']) + "," + frmDataSQL(jr.data['stage_change_time']) + "," +
							jr.data['active'] + "," + jr.data['deleted'] + ",'" + jr.data['status'] + "'," +
							"'" + isnull(jr.data['probability'], null) + "','" + jr.data['lost_reason'] + "','" + jr.data['visible_to'] + "'," +
							frmDataSQL(jr.data['close_time']) + "," + jr.data['pipeline_id'] + "," + frmDataSQL(jr.data['won_time']) + "," +
							frmDataSQL(jr.data['first_won_time']) + "," + frmDataSQL(jr.data['lost_time']) + "," + frmDataSQL(jr.data['expected_close_date']) + "," +
							"'" + jr.data['label'] + "','" + isnull(jr.data['fc2101060c7a3ec0982eb7376590273350873aed'], null) + "','" + isnull(jr.data['9b4993871584a554c83f15cdee87c96f0d0260a7'], null) + "'," +
							"'" + isnull(jr.data['0732891d55eb3fa27b0cf4a4c0373b1c20021752'], null) + "'," + isnull(jr.data['f00de0b109d9c4ea0d3258f12f99837c8d164c72'], null) + ",'" + isnull(jr.data['d0f013ff2b9ac878d7ed12146b34adc51f46943f'], null) + "'," +
							"'" + isnull(jr.data['63c5181ddae566980d409ee8b625a0596477b5db'], null) + "','" + isnull(jr.data['3349989cba7cc0ed0feaa3a593a0c5ee54ace217'], null) + "','" + isnull(jr.data['95959a576b193b37d31a6f6404b3c4b9f10d4b05'], null) + "'," +
							"'" + isnull(jr.data['219d2dcf439c95ff2193a12a2bf1dead6ccb6d28'], null) + "','" + isnull(jr.data['f7a0b4016041381d97f28f931479aea1255731d7'], null) + "','" + isnull(jr.data['fb9bf341a3385a475b8d73a23fc1634d3ff4ac4f'], null) + "'," +
							"'" + jr.data['renewal_type'] + "','" + isnull(jr.data['12b9429f3013162aff5d0ef4d84d46ab7a826a49'], null) + "'," + jr.data['stage_order_nr'] + "," +
							"'" + removeAcentos(jr.data['person_name'], 100) + "','" + removeAcentos(jr.data['org_name'], 255) + "'," + jr.data['group_id'] + "," +
							"'" + removeAcentos(jr.data['group_name'], 40) + "','" + jr.data['rotten_time'] + "', " +
							frmDataSQL(jr.data['next_activity_date']) + "," + frmDataSQL(jr.data['last_activity_date']) + ",'" + isnull(jr.data['next_activity_time'], '') + "', " + isnull(jr.data['next_activity_id'], 0) + "," + isnull(jr.data['last_activity_id'], 0) + "," +
							"'" + removeAcentos(isnull(jr.data['next_activity_subject'], ''), 255) + "','" + removeAcentos(isnull(jr.data['next_activity_type'], ''), 255) + "','" + removeAcentos(isnull(jr.data['next_activity_duration'], ''), 255) + "','" + removeAcentos(isnull(jr.data['next_activity_note'], ''), 255) + "', CURRENT_DATE  )";

						printlog("info", 'SQL ###' + SQL);

						statementWD = connectionWD.prepareStatement(SQL);
						statementWD.executeUpdate();

					}

				}



				var SQL = "delete from kbt_t_vendedor_estatisica";
				var statementWD = connectionWD.prepareStatement(SQL);
				statementWD.executeUpdate();

				var SQL = "insert into kbt_t_vendedor_estatisica(" +
					"	   usr_codigo, usr_login, usr_nome, usr_email, id_pipedrive, funcao_principal, id_cargo, cargo, " +
					"	   qtd_proposta_aberto, qtd_proposta_aberto_sem_pipedrive, qtd_sem_ativ, qtd_ativ_atrasada, qtd_oportunidades, " +
					"	   id_loja, fantasia) " +
					"select usr_codigo, usr_login, usr_nome, usr_email, id_pipedrive, funcao_principal, id_cargo, cargo, " +
					"	   qtd_proposta_aberto, qtd_proposta_aberto_sem_pipedrive, qtd_sem_ativ, qtd_ativ_atrasada, qtd_oportunidades, " +
					"	   id_loja, fantasia " +
					"from kbt_v_vendedor_estatisica";
				var statementWD = connectionWD.prepareStatement(SQL);
				statementWD.executeUpdate();
			}
		}

	} catch (error) {
		printlog("info", "Error SQL deal: " + error.toString());
		newDataset.addRow(new Array(error.toString()));

	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
		return newDataset;
	}

	;



}

function createDataset(fields, constraints, sortFields) {

}

function removeAcentos(valor, tamanho) {
	if (valor != null && valor != "") {
		return valor.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, tamanho);
	} else {
		return valor;
	}
}


function isnull(valor, valorAlter) {
	if (valor == null || valor == undefined || valor == "null") {
		return valorAlter;
	} else {
		return valor
	}
}

function frmDataSQL(data) {
	// log.info('frmDataSQL........' + data)
	var valor = isnull(data, "");
	if (valor == null || valor == undefined || valor == "null" || valor == "") {
		return null;
	} else {
		return "'" + valor + "'";
	}
}


function onMobileSync(user) {

}


var debug = false;

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
