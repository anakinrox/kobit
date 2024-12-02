function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('id');
	newDataset.addColumn('title');
	var listaConstraits = {};
	var params = {};
	var area = "";
	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			if (constraints[i].fieldName.trim() == "area") {
				area = constraints[i].initialValue;
			} else {
				listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
				params[constraints[i].fieldName.trim()] = constraints[i].initialValue + "";
				log.info('fieldName.....' + constraints[i].fieldName + '...value....' + constraints[i].initialValue);
			}
		}
	}

	var user = getValue("WKUser");

	var chave = 'pipedrive';
	if (area == 'E') {
		chave = 'pipedrive_eng';
	}

	var token = "";
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("chave", chave, chave, ConstraintType.MUST));
	var usuario = DatasetFactory.getDataset("colleagueParam", null, constraints, null);
	var path = '';
	if (usuario.values.length > 0) {
		token = usuario.getValue(0, "val_param");
		log.info('ENTREI..... ');
	}


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

	//log.info(' FONE '+ listaConstraits['fone'] );

	var endpoint = "/v1/deals?&api_token=" + token;

	//listaConstraits['title'] = "teste fluig";

	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "pipedrive",
			endpoint: endpoint,
			timeoutService: "240",
			method: "POST"
		};
		printLog('info', "## DADOS CABECALHO ##");

		var headers = {};
		headers["Content-Type"] = "application/json";
		data["headers"] = headers;


		//params["title"] = listaConstraits['title'];

		data["params"] = params;

		printLog('info', "## antes do stringify ## " + data);
		var jj = JSON.stringify(data);

		printLog('info', "## RESULT POST jj ## " + jj);

		var vo = clientService.invoke(jj);
		printLog('info', "## RESULT POST VO ## " + vo.toString());
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			printLog('info', "## success ## " + JSON.stringify(jr));
			printLog('info', "## success ## " + jr.success);


			if (!jr.success) {
				throw 'Erro na integração com PipeDrive';
			}


			if (jr.data != null) {
				newDataset.addRow(
					new Array(jr.data.id + "",
						jr.data.title + ""
					));
			}
		}

	} catch (erro) {
		printLog('erro', "ERROOOOOO" + erro.toString());
		throw erro.toString();
	}

	return newDataset;

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