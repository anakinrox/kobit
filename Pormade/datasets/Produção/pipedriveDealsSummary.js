function defineStructure() {
	addColumn('status');
}
function onSync(lastSyncDate) {
}
function createDataset(fields, constraints, sortFields) {

	log.info("## pipedriveDealsSummary ##");
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');


	var listaConstraits = {};
	var params = {};

	var area = "E";
	var token = "";
	log.info('Leitura Parametros......');
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
	var pipe = DatasetFactory.getDataset("pipedrive", null, constraints, null);
	if (pipe.rowsCount == 0) {
		throw "Não cadastrato parametro para esse tipo de integração.";
	} else {
		if (token == "") {
			token = pipe.getValue(0, "token_api");
		}
	}

	var connectionWD = null;
	var statementWD = null;

	var ontem = new Date(new Date().setHours(-24 * 10));
	var endpoint = "/v1/deals/timeline?start_date=" + ontem.toJSON().substring(0, 10) + "&interval=day&amount=11&field_key=update_time&api_token=" + token;
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "pipedrive",
			endpoint: endpoint,
			timeoutService: "240",
			method: "GET",
		};
		log.info("## DADOS CABECALHO pipedriveDealsSummary ##");

		var headers = {};
		headers["Content-Type"] = "application/json";
		data["headers"] = headers;
		data["params"] = params;

		var jj = JSON.stringify(data);

		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			newDataset.addRown(new Array("Retorno Vazio"));
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			log.info("## pipedriveDealsSummary ## " + JSON.stringify(jr));
			log.info("## pipedriveDealsSummary ## " + jr.success);
			newDataset.addRown(new Array(JSON.stringify(jr)));

			if (!jr.success) {
				throw 'Erro na integração com PipeDrive';
			}

			if (jr.data != null) {

				var contextWD = new javax.naming.InitialContext();
				var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
				connectionWD = dataSourceWD.getConnection();

				for (var i = 0; i < jr.data.length; i++) {
					for (var j = 0; j < jr.data[i].deals.length; j++) {

						var SQL = "delete from kbt_t_dealssummary " +
							" where id = " + jr.data[i].deals[j]['id'];

						log.info(SQL);
						var statementWD = connectionWD.prepareStatement(SQL);
						statementWD.executeQuery();

						var SQL = "INSERT INTO public.kbt_t_dealssummary( id, creator_user_id, user_id, person_id, org_id, " +
							"   stage_id, title, value, currency, add_time, update_time, " +
							"   stage_change_time, active, deleted, status, probability, " +
							"   lost_reason, visible_to, close_time, pipeline_id, won_time, " +
							"   first_won_time, lost_time, expected_close_date, label, " +
							"   origemnegocio, codigo_parceiro, responsavelinstalacao, " +
							"   numprocessofluig, idwsobra, showroom, area, numproposta, " +
							"   disparaemailvencido, operadorcallcenter, percentbonus, " +
							"   renewal_type, aceitapormademovel, stage_order_nr, person_name, " +
							"   org_name, group_id, group_name, rotten_time) VALUES  " +
							"(" + jr.data[i].deals[j]['id'] + "," + jr.data[i].deals[j]['creator_user_id'] + "," + jr.data[i].deals[j]['user_id'] + "," +
							jr.data[i].deals[j]['person_id'] + "," + jr.data[i].deals[j]['org_id'] + "," + jr.data[i].deals[j]['stage_id'] + "," +
							"'" + jr.data[i].deals[j]['title'] + "'," + jr.data[i].deals[j]['value'] + ",'" + jr.data[i].deals[j]['currency'] + "'," +
							jr.data[i].deals[j]['add_time'] + "," + jr.data[i].deals[j]['update_time'] + ",'" + jr.data[i].deals[j]['stage_change_time'] + "'," +
							jr.data[i].deals[j]['active'] + "," + jr.data[i].deals[j]['deleted'] + ",'" + jr.data[i].deals[j]['status'] + "'," +
							"'" + jr.data[i].deals[j]['probability'] + "','" + jr.data[i].deals[j]['lost_reason'] + "','" + jr.data[i].deals[j]['visible_to'] + "'," +
							"'" + jr.data[i].deals[j]['close_time'] + "'," + jr.data[i].deals[j]['pipeline_id'] + ",'" + jr.data[i].deals[j]['won_time'] + "'," +
							"'" + jr.data[i].deals[j]['first_won_time'] + "','" + jr.data[i].deals[j]['lost_time'] + "','" + jr.data[i].deals[j]['expected_close_date'] + "'," +
							"'" + jr.data[i].deals[j]['label'] + "','" + jr.data[i].deals[j]['fc2101060c7a3ec0982eb7376590273350873aed'] + "','" + jr.data[i].deals[j]['9b4993871584a554c83f15cdee87c96f0d0260a7'] + "'," +
							"'" + jr.data[i].deals[j]['0732891d55eb3fa27b0cf4a4c0373b1c20021752'] + "'," + jr.data[i].deals[j]['f00de0b109d9c4ea0d3258f12f99837c8d164c72'] + ",'" + jr.data[i].deals[j]['d0f013ff2b9ac878d7ed12146b34adc51f46943f'] + "'," +
							"'" + jr.data[i].deals[j]['63c5181ddae566980d409ee8b625a0596477b5db'] + "','" + jr.data[i].deals[j]['3349989cba7cc0ed0feaa3a593a0c5ee54ace217'] + "','" + jr.data[i].deals[j]['95959a576b193b37d31a6f6404b3c4b9f10d4b05'] + "'," +
							"'" + jr.data[i].deals[j]['219d2dcf439c95ff2193a12a2bf1dead6ccb6d28'] + "','" + jr.data[i].deals[j]['f7a0b4016041381d97f28f931479aea1255731d7'] + "','" + jr.data[i].deals[j]['fb9bf341a3385a475b8d73a23fc1634d3ff4ac4f'] + "'," +
							"'" + jr.data[i].deals[j]['renewal_type'] + "','" + jr.data[i].deals[j]['12b9429f3013162aff5d0ef4d84d46ab7a826a49'] + "'," + jr.data[i].deals[j]['stage_order_nr'] + "," +
							"'" + jr.data[i].deals[j]['person_name'] + "','" + jr.data[i].deals[j]['org_name'] + "'," + jr.data[i].deals[j]['group_id'] + "," +
							"'" + jr.data[i].deals[j]['group_name'] + "'," + jr.data[i].deals[j]['rotten_time'] + ")";

						log.info("Marcio: " + SQL);
						// statementWD = connectionWD.prepareStatement(sql);
						// statementWD.executeUpdate();



					}
				}

			}


		}

	} catch (error) {
		newDataset.addRown(new Array(erro.toString()));

	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
		return newDataset;
	}



}
function onMobileSync(user) {

}


var debug = true;

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