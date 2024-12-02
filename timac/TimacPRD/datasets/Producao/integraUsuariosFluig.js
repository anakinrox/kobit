var newDataset;
function defineStructure() {
	addColumn('status');
}

function onSync(lastSyncDate) {
	printLog("info", "## Integração Usuarios Fluig START ##");
	newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');


	var listaConstraits = {};
	var params = {};

	var connectionWD = null;
	var statementWD = null;
	var senha = "Timac@2021";
	var userId = "ariberto.kobit";

	try {

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();

		var SQL = "delete from TIM_FLUIG_USUARIOS";
		var statementWD = connectionWD.prepareStatement(SQL);
		statementWD.executeUpdate();

		var SQL = "insert into TIM_FLUIG_USUARIOS select * from VW_FLUIG_USUARIOS where login is not null";
		var statementWD = connectionWD.prepareStatement(SQL);
		statementWD.executeUpdate();

		var SQL = "select * from TIM_FLUIG_USUARIOS t where t.codsituacao = 'D' ";
		SQL += "  and not exists (select 1 from TIM_FLUIG_USUARIOS where codsituacao <> 'D' and INCLUI_USER = 'S' and MATRICULA  = t.MATRICULA)";
		SQL += "  and  (select count(*) ";
		SQL += "  from TAR_PROCES x ";
		SQL += "     where x.CD_MATRICULA = t.MATRICULA ";
		SQL += "  	   and x.LOG_ATIV  = 1 ) = 0		 ";
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {

			// ##### Valida usuario no Fluig
			var dataSet = consultaDataSet(rsWD.getString("MATRICULA"), rsWD.getString("EMAIL").toLowerCase(), 'C');

			if (dataSet.rowsCount > 0) {
				if (dataSet.getValue(0, "active") == "true") {

					var wID = dataSet.getValue(0, "colleaguePK.colleagueId");
					try {
						var Retorno = fluigAPI.getUserService().deactivateByCode(wID);
					} catch (error) {
						custom_envio_email(rsWD.getString("NOME"), error.toString());
						printLog("info", "Error ao Inativar: " + error.toString());
						;
					}
				}
			}
		}

		rsWD.close();

		var SQL = "select * from TIM_FLUIG_USUARIOS where codsituacao <> 'D' and INCLUI_USER = 'S'";
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			var wLogin = rsWD.getString("EMAIL").toLowerCase().split("@");
			var wNomUsuario = rsWD.getString("NOME");
			var nomeCompleto = rsWD.getString("NOME").split(" ");
			var FistName = nomeCompleto[0];
			var LastName = "";

			// newDataset.addRow(new Array("Usuário: " + wNomUsuario, rsWD.getString("MATRICULA")));


			RoleList = new java.util.ArrayList();
			RoleList.add("stop_user");

			GroupList = new java.util.ArrayList();
			GroupList.add("groupAll");

			for (i = 1; i < nomeCompleto.length; i++) {
				LastName += nomeCompleto[i] + " ";
			}

			// 	// ##### Valida usuario no Fluig

			var dataSet = consultaDataSet(rsWD.getString("MATRICULA"), rsWD.getString("EMAIL"), 'S');

			if (dataSet.rowsCount > 0) {
				// newDataset.addRow(new Array("Usuário: " + wNomUsuario + " Matricula: " + rsWD.getString("MATRICULA") + " Já existe Status: " + dataSet.getValue(0, "active")));
				if (dataSet.getValue(0, "active") == 'false') {
					var wID = dataSet.getValue(0, "colleaguePK.colleagueId");
					var Retorno = fluigAPI.getUserService().activateByCode(wID);
				}


				// var PKUSer = dataSet.getValue(0, "colleaguePK.colleagueId");
				// var vo = new com.fluig.sdk.user.UserVO();
				// vo.setIsActive(true);
				// vo.setCode(PKUSer);
				// vo.setFirstName(FistName.trim());
				// vo.setLastName(LastName.trim());
				// vo.setFullName(rsWD.getString("NOME"));
				// vo.setLogin(dataSet.getValue(0, "login"));
				// vo.setEmail(dataSet.getValue(0, "mail"));
				// vo.setRoles(RoleList);
				// vo.setGroups(GroupList);
				// vo.setExtraData("user_logix", rsWD.getString("LOGIN_LOGIX"));
				// vo.setExtraData("UserSpecialization", rsWD.getString("FUNCAO"));

				// try {
				// 	var retCancel = fluigAPI.getUserService().updateUser(vo);
				// } catch (error) {
				// 	// custom_envio_email(wNomUsuario, "Ao atualizar usuário no Fluig: " + error.toString());
				// 	printLog("info", "Error ao atualizar usuário: " + error.toString());
				// }

			} else {
				// newDataset.addRow(new Array("Usuário: " + wNomUsuario + " Matricula: " + rsWD.getString("MATRICULA") + " E-mail: " + rsWD.getString("EMAIL").toLowerCase() + " Não existe"));
				var wStrSobrenome = LastName.trim();
				var wCPF = rsWD.getString("CPF").substring(0, 3);
				var WString1 = wStrSobrenome.substring((wStrSobrenome.length - 2), wStrSobrenome.length);
				var wSenhaFluig = wCPF.toString() + WString1.toString().toUpperCase() + FistName.trim().toLowerCase() + "*";
				if (wSenhaFluig.length < 12) {
					wSenhaFluig = wSenhaFluig + '*';
				}

				// newDataset.addRow(new Array("Novo Usuario -[ Primeiro:  " + FistName + " " + LastName + " - Senha: " + wSenhaFluig + ' | Login: ' + wLogin[0] + ' ]-'));
				var vo = new com.fluig.sdk.user.UserVO();
				vo.setIsActive(true);
				vo.setCode(rsWD.getString("MATRICULA"));
				vo.setFirstName(FistName.trim());
				vo.setLastName(LastName.trim());
				vo.setFullName(rsWD.getString("NOME"));
				vo.setLogin(wLogin[0]);
				vo.setEmail(rsWD.getString("EMAIL").toLowerCase());
				vo.setPassword(wSenhaFluig);
				vo.setRoles(RoleList);
				vo.setGroups(GroupList);
				vo.setExtraData("user_logix", rsWD.getString("LOGIN_LOGIX"));
				vo.setExtraData("UserSpecialization", rsWD.getString("FUNCAO"));

				try {
					var retCancel = fluigAPI.getUserService().create(vo);
				} catch (error) {
					custom_envio_email(wNomUsuario, "Ao incluir usuário no Fluig: " + error.toString());
					printLog("info", "Error ao inclur usuário: " + error.toString());
					newDataset.addRow(new Array("Error ao inclur usuário: " + error.toString()));
				}
			}

		}

		rsWD.close();

	} catch (error) {
		printLog("info", "Error ao inclur usuário: " + error.toString());
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
		return newDataset;
	}
}

function createDataset(fields, constraints, sortFields) { }

function consultaDataSet(matricula, email, tipoConsulta) {

	if (tipoConsulta == 'S') {
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", matricula, matricula, ConstraintType.MUST));
		var dataSet = DatasetFactory.getDataset("colleague", null, constraints, null);

		if ((email != "") && (dataSet.rowsCount == 0)) {
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST));
			dataSet = DatasetFactory.getDataset("colleague", null, constraints, null);
		}
	}
	if (tipoConsulta == 'C') {
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", matricula, matricula, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST));
		var dataSet = DatasetFactory.getDataset("colleague", null, constraints, null);
	}

	return dataSet;
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


function custom_envio_email(pNome, pMensagem) {
	var nome = '';

	var matricula = 'admin';
	var SERVER_URL = fluigAPI.getPageService().getServerURL();

	var destinatarios = new java.util.ArrayList();
	destinatarios.add('integra_fluig_usuarios@timacagro.com.br');

	var parametros = new java.util.HashMap();
	parametros.put('subject', 'Integração Fluig x Protheus');
	parametros.put('SERVER_URL', SERVER_URL);
	parametros.put('NOME', nome);

	parametros.put('USUARIO', pNome);
	parametros.put('MENSAGEM', pMensagem);
	notifier.notify(matricula, 'integracao_usuarios', parametros, destinatarios, 'text/html');

}