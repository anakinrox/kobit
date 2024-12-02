var gToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMDkwNzIwMjQiLCJub21lIjoiZmx1aWcifQ.Gh8g5STXlLkOfwUDmutQwmMzqjxvaUO0VafCCHJVQrs';
var gRota = '/02'
function defineStructure() {
	addColumn('status');
}

function onSync(lastSyncDate) {
	printLog("info", "## Sync Tracking START ##");
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');
	try {
		var wToken = f_getToken(newDataset);
		if (wToken != null) {
			f_postLocais(wToken, newDataset);
			f_postTipoVisitas(wToken, newDataset);
			f_postVenderores(wToken, newDataset);
			f_postUsuarios(wToken, newDataset);
			f_postInstaladores(wToken, newDataset);
		}
	} catch (error) {
		// printLog("erro", "Error SQL: " + error.toString());
		newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
	}

	return newDataset;

}

function createDataset(fields, constraints, sortFields) {
	printLog("info", "## Sync Tracking START ##");
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');
	try {
		var wToken = f_getToken(newDataset);
		if (wToken != null) {
			f_postLocais(wToken, newDataset);
			f_postTipoVisitas(wToken, newDataset);
			f_postVenderores(wToken, newDataset);
			f_postUsuarios(wToken, newDataset);
			f_postInstaladores(wToken, newDataset);
		}
	} catch (error) {
		// printLog("erro", "Error SQL: " + error.toString());
		newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
	}

	return newDataset;
}

function onMobileSync(user) {

}

function f_postUsuarios(wToken, pDataset) {
	// ################### Envia os Usuario #########################

	printLog("info", "End Point Usuarios: ");

	// var tpLocais = {};
	var wArrayData = [];
	var wSenha = "";

	var connectionWD = null;
	var statementWD = null;
	var rsWD = null;

	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();


		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('active', true, true, ConstraintType.MUST));
		var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
		if (dataset != null && dataset.rowsCount > 0) {
			for (i = 0; i < dataset.rowsCount; i++) {

				var cpf = dataset.getValue(i, "colleaguePK.colleagueId");
				var SQL = "SELECT n.PASSWORD ";
				SQL += "FROM fdn_usertenant n  ";
				SQL += "LEFT JOIN fdn_user r ON ( r.USER_ID = n.USER_ID ) ";
				SQL += "where n.USER_STATE <> 2";
				SQL += "  and n.user_code = '" + dataset.getValue(i, "colleaguePK.colleagueId") + "'";

				statementWD = connectionWD.prepareStatement(SQL);
				var rsWD = statementWD.executeQuery();
				while (rsWD.next()) {
					wSenha = rsWD.getString("PASSWORD");
				}

				wSenha = 'Mot@2023';

				var dados = {
					CODTIPO: "2",
					CRYPT: "S",
					NUMCPF: cpf + "",
					LOGIN: dataset.getValue(i, "colleaguePK.colleagueId") + "",
					NOMUSUARIO: dataset.getValue(i, "colleagueName") + "",
					EMAIL: dataset.getValue(i, "mail") + "",
					SENHA: wSenha + ""
				}
				wArrayData.push(dados);
			}
		}

		var wArray = {
			STATUS: wArrayData.length > 0 ? true : false,
			RECORDS: wArrayData.length > 0 ? wArrayData.length : 0,
			TIP: 2,
			DATA: wArrayData
		}

		printLog("info", 'JSON Motoristas: ' + JSON.stringify(wArray))
		if (wArray.RECORDS > 0) {
			var endpoint = gRota + "/usuarios";
			var motorista = f_atualizarRegistro(endpoint, gToken, wArray, "arquitetos")
			if (motorista != null) {
				if (motorista.STATUS == true) {
					pDataset.addRow(new Array("Motoristas Enviados"));
				} else {
					pDataset.addRow(new Array("Erro ao cadastrar Motoristas"));
				}
			}
		}

		wArrayData.length = 0;

		var constraints = new Array();
		var dsUsuario = DatasetFactory.getDataset("dsk_frm_usuario", null, constraints, null);
		if (dsUsuario != null) {
			for (i = 0; i < dsUsuario.rowsCount; i++) {

				var wSenha = 'Mot@2023';

				var dados = {
					CODTIPO: "3",
					CRYPT: "S",
					NUMCPF: dsUsuario.getValue(i, "cpf") + "",
					LOGIN: dsUsuario.getValue(i, "cpf") + "",
					NOMUSUARIO: dsUsuario.getValue(i, "nome") + "",
					EMAIL: dsUsuario.getValue(i, "mail") + "",
					SENHA: wSenha + ""
					// SENHA: dsUsuario.getValue(i, "senha") + ""
				}
				wArrayData.push(dados);
			}
		}

		var wArray = {
			STATUS: wArrayData.length > 0 ? true : false,
			RECORDS: wArrayData.length > 0 ? wArrayData.length : 0,
			TIP: 3,
			DATA: wArrayData
		}
		printLog("info", 'JSON Eventos: ' + JSON.stringify(wArray))
		if (wArray.RECORDS > 0) {
			var endpoint = gRota + "/usuarios";
			var motorista = f_atualizarRegistro(endpoint, gToken, wArray, "arquitetos")
			if (motorista != null) {
				if (motorista.STATUS == true) {
					pDataset.addRow(new Array("Usuário SIS Enviados"));
				} else {
					pDataset.addRow(new Array("Erro ao cadastrar Usuário SIS  "));
				}
			}
		}
	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}



	// newDataset.addRow(new Array("OK"));
	// ################### Envia os Usuarios #########################       
}

function f_postCidades(wToken, pDataset) {
	// ################### Envia os Cidades #########################
	var params;
	var endpoint = "/cidades";
	printLog("info", "End Point cidades: ");
	// newDataset.addRow(new Array("End Point cidades: "));
	var ArrCidades = [];


	var connectionWD = null;
	var statementWD = null;
	var rsWD = null;

	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
		connectionWD = dataSourceWD.getConnection();

		// var SQL = " select cod_erp,id,cidade,cod_uf,uf,nome,cod_pais,pais, cod_cidade_ibge ";
		// SQL += "FROM fluig_v_cidade WHERE cod_erp is not null";

		// statementWD = connectionWD.prepareStatement(SQL);
		// var rsWD = statementWD.executeQuery();
		// while (rsWD.next()) {
		//     var dados = {
		//         CODIGO: rsWD.getString("cod_erp") + "",
		//         ID: rsWD.getString("id") + "",
		//         COD_UF: rsWD.getString("cod_uf") + "",
		//         UF: rsWD.getString("uf") + "",
		//         CIDADE: rsWD.getString("cidade") + "",
		//         NOME: rsWD.getString("nome") + "",
		//         COD_PAIS: rsWD.getString("cod_pais") + "",
		//         PAIS: rsWD.getString("pais") + "",
		//         IBGE: rsWD.getString("cod_cidade_ibge") + "",
		//     }
		//     ArrCidades.push(dados);

		// }
		// newDataset.addRow(new Array("Cidades: " + JSON.stringify(ArrCidades)));
		// printLog("info", "Cidades: " + JSON.stringify(ArrCidades));

		// var ArrCidades = [];
		// var params = {
		//     json: JSON.stringify(ArrCidades)
		// };

		// var data = {
		//     companyId: getValue("WKCompany") + "",
		//     serviceCode: "tracking",
		//     endpoint: endpoint,
		//     timeoutService: "240",
		//     method: "POST",
		// };

		// // var params;
		// var headers = {};
		// headers["x-access-token"] = wToken;
		// headers["Content-Type"] = "application/json";
		// data["headers"] = headers;
		// data["params"] = params;

		// var jj = JSON.stringify(data);
		// var vo = clientService.invoke(jj);
		// if (vo.getResult() == "" || vo.getResult().isEmpty()) {
		//     throw "Retorno esta vazio";
		// } else {
		//     var jr = JSON.parse(vo.getResult());

		//     if (jr.STATUS == 'OK') {
		//         printLog("info", "Achou BEBE");
		//         newDataset.addRow(new Array("Cidaddes Enviados"));
		//     } else {
		//         printLog("info", "Não deu");
		//         newDataset.addRow(new Array("Erro ao cadastrar Cidaddes"));
		//     }
		// }

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}


	// newDataset.addRow(new Array("OK"));
	// ################### Envia os Cidades #########################  


}

function f_postLocais(wToken, pDataset) {
	// ################### Envia os Locais #########################
	var params;
	var endpoint = "/tipoLocal";
	printLog("info", "End Point tipoLocal: ");

	var tpLocais = {};
	var tpLocais = [];

	var constraints = new Array();
	var dataset = DatasetFactory.getDataset("dsTipoLocal", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {
			var dados = {
				codigo: parseInt(dataset.getValue(i, "codigo")),
				descricao: dataset.getValue(i, "descricao") + ""
			}
			tpLocais.push(dados);
		}

		if (tpLocais != '') {
			var locais = f_atualizarRegistro(endpoint, wToken, tpLocais)
			if (locais != null) {
				if (locais.STATUS == 'OK') {
					pDataset.addRow(new Array("Locais Enviados"));
				} else {
					pDataset.addRow(new Array("Erro ao cadastrar Locais"));
				}
			}
		}
	}
	// ################### Envia os Locais #########################
}

function f_postTipoVisitas(wToken, pDataset) {
	// ################### Envia os Locais #########################
	var params;
	var endpoint = "/tipoVisita";
	printLog("info", "End Point tipoVisita: ");

	// var tpLocais = {};
	var tpVisita = [];

	var constraints = new Array();
	var dataset = DatasetFactory.getDataset("kbt_t_tipo_visitas", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {
			var dados = {
				codigo: parseInt(dataset.getValue(i, "codigo")),
				descricao: dataset.getValue(i, "descricao") + ""
			}
			tpVisita.push(dados);
		}

		if (tpVisita.length > 0) {
			var locais = f_atualizarRegistro(endpoint, wToken, tpVisita)
			if (locais != null) {
				if (locais.STATUS == 'OK') {
					pDataset.addRow(new Array("Tipo de visitas Enviados"));
				} else {
					pDataset.addRow(new Array("Erro ao cadastrar Tipo de visitas"));
				}
			}
		}
	}
	// ################### Envia os Locais #########################
}

function f_postVenderores(wToken, pDataset) {
	// ################### Envia os Vendedores #########################

	printLog("info", "End Point Vendedores: ");
	var tVendedores = [];

	var connectionCRM = null;
	var statementCRM = null;

	try {
		var contextCRM = new javax.naming.InitialContext();
		var dataSourceCRM = contextCRM.lookup("java:/jdbc/CRMDS");
		connectionCRM = dataSourceCRM.getConnection();

		var sql = "SELECT ";
		sql += "    distinct ";
		sql += "    'CRM' as SISTEMA, ";
		sql += "    us.usr_codigo,  ";
		sql += "    upper(us.usr_nome) as usr_nome,  ";
		sql += "    us.usr_email,  ";
		sql += "    pv.id_pessoa, ";
		sql += "    pv.id as idVendedor, ";
		sql += "    pv.codigo_crm ";
		sql += "FROM (((((online.pon_cargos car  ";
		sql += "    JOIN online.pon_cargos_funcionario cf ON ((cf.id_cargo = car.id)))  ";
		sql += "    JOIN fr_usuario us ON ((us.usr_codigo = cf.usr_codigo)))  ";
		sql += "    join fr_usuario_sistema us_a on (us_a.usr_codigo = us.usr_codigo) ";
		sql += "                                and (us_a.sis_codigo in ('NMB') and us_a.uss_acessar = 'S') ";
		sql += "    JOIN online.pon_pessoa_vendedor pv ON (((cf.id_pessoa = pv.id_pessoa) AND (pv.ativo = true))))  ";
		sql += "    JOIN online.pon_lojas pl ON ((pv.id_loja = pl.id)))  ";
		sql += "    LEFT JOIN kbt_t_dealsuser up ON (((up.email)::text = (us.usr_email)::text)))  ";
		sql += "union ";
		sql += "SELECT ";
		sql += "    distinct ";
		sql += "    'SIS' as SISTEMA, ";
		sql += "    ven.id as idVendedor, ";
		sql += "    upper(ven.nome_razao) as usr_nome, ";
		sql += "    '' as usr_email, ";
		sql += "    vend.id as id´pessoa, ";
		sql += "    vend.id as idVendedor, ";
		sql += "    pv.codigo_crm ";
		sql += "FROM   online.pon_pessoa_vendedor AS vend ";
		sql += "    INNER JOIN online.pon_pessoa AS ven ON ven.id = vend.id_pessoa ";
		sql += "                                    and ven.ativo = true ";
		sql += "    INNER JOIN online.pon_grupo_pessoa AS gru ON gru.id = vend.id_grupo ";
		sql += "    INNER JOIN online.pon_pessoa_vendedor pv ON pv.id_pessoa = vend.id_pessoa ";
		sql += "WHERE  gru.id_pessoa_tipo = 6 ";
		sql += "and gru.id in (33,47) ";
		sql += "and pv.codigo_crm is not null ";
		sql += "order by ";
		sql += "3";

		statementCRM = connectionCRM.prepareStatement(sql);
		var rsCRM = statementCRM.executeQuery();

		while (rsCRM.next()) {
			var dados = {
				CODPROFISSAO: 48,
				INDSIS: rsCRM.getString("SISTEMA") + "",
				IDCRM: rsCRM.getString("usr_codigo") + "",
				IDPIPEDRIVE: rsCRM.getString("codigo_crm") + "",
				NOMVENDEDOR: rsCRM.getString("usr_nome") + ""
			}
			tVendedores.push(dados);
		}

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rsCRM != null) rsCRM.close();
		if (statementCRM != null) statementCRM.close();
		if (connectionCRM != null) connectionCRM.close();
	}

	printLog("info", 'Token: ' + wToken)
	printLog("info", 'JSON Vendedores: ' + JSON.stringify(tVendedores))
	pDataset.addRow(new Array("Vendedores Enviados"));

	if (tVendedores != '') {
		var endpoint = "/vendedores";
		var vendedores = f_atualizarRegistro(endpoint, wToken, tVendedores)
		if (vendedores != null) {
			if (vendedores.STATUS == 'OK') {
				pDataset.addRow(new Array("Vendedores Enviados"));
			} else {
				pDataset.addRow(new Array("Erro ao cadastrar Vendedores"));
			}
		}
	}

	// newDataset.addRow(new Array("OK"));
	// ################### Envia os Vendedores #########################        
}

function f_postInstaladores(wToken, pDataset) {
	// ################### Envia os Instaladores #########################

	printLog("info", "End Point Usuarios: ");

	// var tpLocais = {};
	var wArrayData = [];
	var wSenha = "";

	var connectionWD = null;
	var statementWD = null;
	var rsWD = null;

	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
		connectionWD = dataSourceWD.getConnection();
		var gson = new com.google.gson.Gson();

		var SQL = "select pInstador.nome_razao, pInstador.cnpj_cpf, pEmail.email, pInstador.ativo ";
		SQL += "from pon_pessoa_arquiteto pIns  ";
		SQL += "   inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
		SQL += "                            and(pInstador.ativo = true)   ";
		SQL += "                            and (pInstador.tp_pessoa = 'J')  ";
		SQL += "   inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pIns.id_pessoa) ";
		SQL += "                            and(pEmail.principal = true)  ";
		SQL += "where pIns.id_classificacao in (8)";
		SQL += " union ";
		SQL += "select pInstador.nome_razao, pInstador.cnpj_cpf, pEmail.email, pInstador.ativo  ";
		SQL += "from pon_pessoa_arquiteto pIns  ";
		SQL += "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
		SQL += "            and(pInstador.ativo = true)   ";
		SQL += " ";
		SQL += "    inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pIns.id_pessoa) ";
		SQL += "            and(pEmail.principal = true)   ";
		SQL += "where pIns.id_classificacao = 8   ";
		SQL += "and  pIns.ativo = true ";
		// SQL += "and pInstador.cnpj_cpf = '59538279204' ";


		statementWD = connectionWD.prepareStatement(SQL);
		rsWD = statementWD.executeQuery();

		while (rsWD.next()) {
			var wEmail = '';
			if (rsWD.getString('email') != null && rsWD.getString('email') != '') {
				wEmail = rsWD.getString('email').toLowerCase();
			}
			var wNome = rsWD.getString('nome_razao').substring(0, 3);
			wNome = wNome.toLowerCase();

			wNome = wNome.replaceAll(' ', '');
			wSenha = rsWD.getString('cnpj_cpf').substring(0, 3) + '@' + wNome;

			var dados = {
				CODTIPO: "1",
				CRYPT: "S",
				NUMCPF: rsWD.getString('cnpj_cpf') + "",
				LOGIN: rsWD.getString('cnpj_cpf') + "",
				NOMUSUARIO: rsWD.getString('nome_razao') + "",
				EMAIL: wEmail + "",
				SENHA: wSenha.toLowerCase() + "",
				SITUACAO: rsWD.getString('ativo') == 't' ? true : false
			}
			wArrayData.push(dados);

		}

		var wArray = {
			STATUS: wArrayData.length > 0 ? true : false,
			RECORDS: wArrayData.length > 0 ? wArrayData.length : 0,
			TIP: 1,
			DATA: wArrayData
		}


		if (wArray.RECORDS > 0) {
			var endpoint = gRota + "/usuarios";
			// pDataset.addRow(new Array('EndPoint: ' + endpoint));
			var motorista = f_atualizarRegistro(endpoint, gToken, wArray, "arquitetos")

			if (motorista != null) {
				if (motorista.STATUS == true) {
					pDataset.addRow(new Array("Instaladores Enviados"));
				} else {
					pDataset.addRow(new Array("Erro ao cadastrar Instaladores"));
				}
			}
		}

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}

	// newDataset.addRow(new Array("OK"));
	// ################### Envia os Usuarios #########################       
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

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pIndServico) {

	var retorno = null;
	var metodo = "GET";
	var wServiceCode = "tracking";
	var gson = new com.google.gson.Gson();
	var params = {};

	if (pIndServico != undefined) {
		wServiceCode = pIndServico
	}

	if (jsonFile != "") {
		metodo = "POST";
		params = {
			json: gson.toJson(jsonFile)
		};

		if (pIndServico != undefined) {
			params = gson.toJson(jsonFile);
		}
	}

	var clientService = fluigAPI.getAuthorizeClientService();
	var data = {
		companyId: getValue("WKCompany") + "",
		serviceCode: wServiceCode,
		endpoint: PendPoint,
		timeoutService: "240",
		method: metodo,
	};

	// var params;
	var headers = {};
	headers["x-access-token"] = Ptoken;
	headers["Content-Type"] = "application/json";
	data["headers"] = headers;
	if (pIndServico == undefined) {
		data["params"] = params;
	} else {
		data["strParams"] = params;
	}


	var jj = gson.toJson(data);
	var vo = clientService.invoke(jj);
	if (vo.getResult() == "" || vo.getResult().isEmpty()) {
		throw "Retorno esta vazio";
	} else {
		var jr = JSON.parse(vo.getResult());
		retorno = jr;
	}

	return retorno;


}


function f_getToken(newDataset) {

	var retorno = null;
	var params = {
		login: "02925364969",
		senha: "123",
		datRemoto: "",
		horRemoto: ""
	};

	var endpoint = "/login"; // endPoint pra buscar o Token

	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + "",
			serviceCode: "tracking",
			endpoint: endpoint,
			timeoutService: "240",
			method: "POST",
		};

		var headers = {};
		headers["Content-Type"] = "application/json";
		data["headers"] = headers;
		data["params"] = params;

		var jj = JSON.stringify(data);
		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			if (jr.STATUS == 'OK') {
				retorno = jr.TOKEN;
			}
		}
	} catch (error) {
		// printLog("erro", "Error SQL: " + error.toString());
		newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
	}

	return retorno;


}
