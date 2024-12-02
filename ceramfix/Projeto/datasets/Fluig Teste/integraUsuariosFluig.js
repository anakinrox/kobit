var arrUsuarioInclusos = [];
var arrUsuarioDesativados = [];
function defineStructure() {
	addColumn('status');
}

function onSync(lastSyncDate) {
	try {
		printLog("info", "## Integração Usuarios Fluig START ##");
		newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn('status');

		f_desativarUsuario(newDataset);
		f_incluirUsuario(newDataset);

		f_montaResumo(newDataset);
	} catch (error) {

	} finally {
		return newDataset;
	}

}

function createDataset(fields, constraints, sortFields) {
	try {
		printLog("info", "## Integração Usuarios Fluig START ##");
		newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn('status');

		f_desativarUsuario(newDataset);
		f_incluirUsuario(newDataset);

		f_montaResumo(newDataset);


	} catch (error) {

	} finally {
		return newDataset;
	}

}


function f_montaResumo(newDataset) {
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();

		// newDataset.addRow(new Array("f_montaResumo: "));
		var wStringTabela = '<table id="example" class="display" style="width: 100%">';
		wStringTabela += '	<thead> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<th colspan="5"><b><h1>Resumo da Integração</h1></b></th> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '  </thead > ';
		wStringTabela += '<tbody> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td colspan="5" style="text-align: center">&nbsp;</td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td colspan="5" style="text-align: center"><b><h2>Processo da inclusão</h2></b></td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td><b>Nome</b></td> ';
		wStringTabela += '		<td><b>E-mail</b></td> ';
		wStringTabela += '		<td><b>Mensagem</b></td> ';
		wStringTabela += '		<td><b>Automatico</b></td> ';
		wStringTabela += '		<td><b>Status</b></td> ';
		wStringTabela += '	</tr> ';
		for (var i = 0; i < arrUsuarioInclusos.length; i++) {

			wStringTabela += '	<tr> ';
			wStringTabela += '		<td>' + arrUsuarioInclusos[i].nome + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioInclusos[i].email + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioInclusos[i].mensagem + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioInclusos[i].gerado + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioInclusos[i].status + '</td> ';
			wStringTabela += '	</tr> ';
		}
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td colspan="5" style="text-align: center">&nbsp;</td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td colspan="5" style="text-align: center"><b><h2>Processo da bloqueio</h2></b></td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td><b>Nome</b></td> ';
		wStringTabela += '		<td><b>E-mail</b></td> ';
		wStringTabela += '		<td><b>Mensagem</b></td> ';
		wStringTabela += '		<td colspan="2"><b>Status</b></td> ';
		wStringTabela += '	</tr> ';

		for (var i = 0; i < arrUsuarioDesativados.length; i++) {
			wStringTabela += '	<tr> ';
			wStringTabela += '		<td>' + arrUsuarioDesativados[i].nome + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioDesativados[i].email + '</td> ';
			wStringTabela += '		<td>' + arrUsuarioDesativados[i].mensagem + '</td> ';
			wStringTabela += '		<td colspan="2">' + arrUsuarioDesativados[i].status + '</td> ';
			wStringTabela += '	</tr> ';
		}

		var nUsuariosAtivos = 0;
		var nUsuariosBloqueados = 0;

		var SQL = "select fUserT.user_state, count(*) as total from fdn_usertenant fUserT ";
		SQL += " 	inner join fdn_user fUser on(fUser.User_Id = fUserT.User_Id)";
		SQL += " 		and(fUser.User_Type = 0) ";
		SQL += " where fUserT.tenant_id = 1 ";
		SQL += " group by";
		SQL += " 		fUserT.user_state ";
		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			if (rsWD.getString("user_state") == '1') { nUsuariosAtivos = rsWD.getString("total"); }
			if (rsWD.getString("user_state") == '2') { nUsuariosBloqueados = rsWD.getString("total"); }

		}
		if (rsWD != null) rsWD.close();

	} catch (error) {

	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		wStringTabela += '	<tr> ';
		wStringTabela += '		<td colspan="4" style="text-align: center">&nbsp;</td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td><b>Relação de usuários</b></td> ';
		wStringTabela += '		<td><b>Ativos</b></td> ';
		wStringTabela += '		<td colspan="2" style="text-align: center"><b>Bloqueados</b></td> ';
		wStringTabela += '	</tr> ';
		wStringTabela += '	<tr> ';
		wStringTabela += '		<td>&nbsp;</td> ';
		wStringTabela += '		<td>' + nUsuariosAtivos + '</td> ';
		wStringTabela += '		<td colspan="2" style="text-align: center">' + nUsuariosBloqueados + '</td> ';
		wStringTabela += '	</tr> ';

		wStringTabela += '      </tbody >';
		wStringTabela += '</table >';

		f_resumoEmail(wStringTabela);
	}


}

function f_dataSubtraiDias() {
	var time = new Date();
	var outraData = new Date();
	outraData.setDate(time.getDate() - 120);
	return outraData;
}

function f_incluirUsuario(newDataset) {
	var listaConstraits = {};
	var params = {};
	var connectionWD = null;
	var statementWD = null;
	var senha = "SrvCeram971";
	var userId = "admin";

	try {

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		connectionWD = dataSourceWD.getConnection();


		var constraints = new Array();
		var dataSetParam = DatasetFactory.getDataset("kbt_parametro_integracao", null, null, null);

		if (dataSetParam == null) {
			throw "Parâmetros de integração não encontrados";
		}

		// var SQL = "select * from eis_v_funcionarios_protheus_digte where data_desligamento is null order by cod_unidade, nome_completo";
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where rownum <= 10 and data_desligamento is null order by cod_unidade, nome_completo";
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where MATRICULA = '99-900231' and data_desligamento is null";
		var SQL = "select * from eis_v_funcionarios_protheus_digte where data_desligamento is null";
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where MATRICULA = '17-000001'";
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where NOME_COMPLETO LIKE '%CINTHIA%'";

		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			var wLogin = rsWD.getString("EMAIL").toLowerCase().split("@");
			var wNomUsuario = rsWD.getString("NOME_COMPLETO");
			var nomeCompleto = rsWD.getString("NOME_COMPLETO").split(" ");
			var FistName = nomeCompleto[0];
			var LastName = "";

			var grupoPadrao = dataSetParam.getValue(0, "cod_grupo");
			GroupList = new java.util.ArrayList();
			GroupList.add(grupoPadrao);

			RoleList = new java.util.ArrayList();
			RoleList.add(dataSetParam.getValue(0, "cod_papel"));

			for (var i = 1; i < nomeCompleto.length; i++) {
				LastName += nomeCompleto[i] + " ";
			}

			var CardFieldList = new java.util.ArrayList();
			// 	// ##### Valida usuario no Fluig
			var dataSet = consultaDataSet('X', rsWD.getString("CPF"), newDataset);
			if (dataSet.rowsCount > 0) {
				// log.info('USUARIO 1')
				// printLog('info', " Usuario: " + nomeCompleto[0] + " - Primeiro: " + FistName + " Sobrenome: " + LastName + " CPF: " + rsWD.getString("CPF") + " Já tem fluig --|.");
				newDataset.addRow(new Array(" Usuario: " + nomeCompleto[0] + " - Primeiro: " + FistName + " Sobrenome: " + LastName + " CPF: " + rsWD.getString("CPF") + " Já tem fluig --|."));
				// continue;

				if (dataSet.getValue(0, "active") == 'false') {
					var wID = dataSet.getValue(0, "colleaguePK.colleagueId");
					try {
						var Retorno = fluigAPI.getUserService().activateByCode(wID);
					} catch (error) {
						var data = {
							nome: rsWD.getString("NOME_COMPLETO"),
							email: dataSet.getValue(0, "mail"),
							gerado: false,
							mensagem: 'Erro ao ativar esse usuário, mensagem de erro: ' + error.toString(),
							status: 'ERROR'
						};
						arrUsuarioInclusos.push(data);
					}

				}

				var PKUSer = dataSet.getValue(0, "colleaguePK.colleagueId");

				var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
				voCard.setFieldId("matricula");
				voCard.setValue(PKUSer);
				CardFieldList.add(voCard)

				var vo = new com.fluig.sdk.user.UserVO();
				vo.setIsActive(true);
				vo.setCode(PKUSer);
				vo.setFirstName(FistName.trim());
				vo.setLastName(LastName.trim());
				vo.setFullName(rsWD.getString("NOME_COMPLETO"));
				vo.setLogin(dataSet.getValue(0, "login"));
				vo.setEmail(dataSet.getValue(0, "mail"));
				vo.setRoles(RoleList);
				vo.setGroups(GroupList);
				vo.setExtraData("UserProjects", rsWD.getString("DESC_DEPARTAMENTO"));
				vo.setExtraData("UserSpecialization", rsWD.getString("DESC_FUNCAO"));


				// newDataset.addRow(new Array("Role List1 " + RoleList));

				try {
					var retCancel = fluigAPI.getUserService().updateUser(vo);
				} catch (error) {
					// custom_envio_email(wNomUsuario, "Ao atualizar usuário no Fluig: " + error.toString());
					printLog("info", "Error ao atualizar usuário: " + error.toString());
				}

				f_insertUserRole(dataSet.getValue(0, "login"), dataSetParam.getValue(0, "cod_papel"));
				f_incluiPapeis(RoleList, dataSet.getValue(0, "login"), rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), 'U');

				try {
					f_incluiComunidade(PKUSer, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), newDataset);
				} catch (error) {

				}

				try {  // Grupo Padrao
					f_incluiGrupos(grupoPadrao, vo, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), dataSet.getValue(0, "login"));
				} catch (error) {
					custom_envio_email(wNomUsuario, "Ao cadastrar a comunidadeg: " + error.toString());
				}

				try {
					f_incluiGrupos('', vo, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), dataSet.getValue(0, "login"));
				} catch (error) {
					custom_envio_email(wNomUsuario, "Ao cadastrar a Grupo: " + error.toString());
				}

				try {
					f_incluirCurso(dataSet.getValue(0, "login"), wNomUsuario, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"));
				} catch (error) {

				}


			} else {
				// printLog('info', " Usuario: " + nomeCompleto[0] + " - Primeiro: " + FistName + " Sobrenome: " + LastName + " Não tem fluig --|.");
				newDataset.addRow(new Array(" Usuario: " + nomeCompleto[0] + " - Primeiro: " + FistName + " Sobrenome: " + LastName + " Não tem fluig --|."));
				// continue;

				var wEmailFinal = '';
				var wGerado = false;

				if (rsWD.getString("RA_EMAIL").trim() != '') {
					var dataSet = consultaDataSet('E', rsWD.getString("RA_EMAIL").toLowerCase().trim());
					if (dataSet.rowsCount > 0) {
						var data = {
							nome: rsWD.getString("NOME_COMPLETO"),
							email: rsWD.getString("RA_EMAIL").toLowerCase().trim(),
							gerado: wGerado,
							mensagem: 'O e-mail: ' + rsWD.getString("RA_EMAIL").toLowerCase().trim() + ' já é usada para o login: ' + dataSet.getValue(0, "login") + ' Usuário: ' + dataSet.getValue(0, "colleagueName"),
							status: 'ERROR'
						};
						arrUsuarioInclusos.push(data);
						continue;
					} else {
						wEmailFinal = rsWD.getString("RA_EMAIL").toLowerCase().trim();
					}

				} else {
					// newDataset.addRow(new Array("Dentro do ELSE: "));
					var wNomeTemp = rsWD.getString("NOME_COMPLETO").split(" ");
					var wValidaEmail = false;
					wGerado = true;
					for (var i = 0; i < (wNomeTemp.length - 1); i++) {
						var wEmail = wNomeTemp[0] + '.' + wNomeTemp[((wNomeTemp.length - 1) - i)];
						var dataSet = consultaDataSet('E', wEmail.toLowerCase().trim() + '@ceramfix.com.br');
						if (dataSet.rowsCount == 0) {
							wValidaEmail = true;
							break;
						}
						// else {
						// 	if (dataSet.getValue(0, "colleaguePK.colleagueId") == rsWD.getString("MATRICULA")) {
						// 		wValidaEmail = true;
						// 		break;
						// 	}
						// }
					}

					if (wValidaEmail == false) {
						var data = {
							nome: rsWD.getString("NOME_COMPLETO"),
							email: wEmail,
							gerado: wGerado,
							mensagem: 'Não foi possível gerar um e-mail disponível automaticamente',
							status: 'ERROR'
						};
						arrUsuarioInclusos.push(data);
						continue;
					}

					wEmailFinal = wEmail.toLowerCase() + '@ceramfix.com.br'

				}

				// newDataset.addRow(new Array('Chegou até aqui '));


				wLogin = wEmailFinal.toLowerCase().split("@");

				var wStrMatricula = rsWD.getString("MATRICULA");

				var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
				voCard.setFieldId("matricula");
				voCard.setValue(wStrMatricula);
				CardFieldList.add(voCard)

				var wStrSobrenome = LastName.trim();

				var wCPF = rsWD.getString("CPF").substring(0, 3);
				var wMatricula = wStrMatricula.substring((wStrMatricula.length() - 2), wStrMatricula.length());
				var WString1 = wStrSobrenome.substring((wStrSobrenome.length - 2), wStrSobrenome.length);
				var wSenhaFluig = wCPF.toString() + wMatricula.toString() + WString1.toString().toUpperCase() + FistName.trim().toLowerCase() + "*";
				if (wSenhaFluig.length < 12) {
					wSenhaFluig = wSenhaFluig + '*';
				}

				RoleList = f_incluiPapeis(RoleList, wLogin[0], rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), 'I');

				// newDataset.addRow(new Array('Chegou até aqui 2 ' + RoleList));
				// continue;


				var vo = new com.fluig.sdk.user.UserVO();
				vo.setIsActive(true);
				vo.setCode(rsWD.getString("MATRICULA"));
				vo.setFirstName(FistName.trim());
				vo.setLastName(LastName.trim());
				vo.setFullName(rsWD.getString("NOME_COMPLETO"));
				vo.setLogin(wLogin[0]);
				vo.setEmail(wEmailFinal);
				vo.setPassword(wSenhaFluig);
				vo.setRoles(RoleList);
				// vo.setId(rsWD.getString("CPF"));
				vo.setGroups(GroupList);
				vo.setExtraData("UserProjects", rsWD.getString("DESC_DEPARTAMENTO"));
				vo.setExtraData("UserSpecialization", rsWD.getString("DESC_FUNCAO"));

				try {
					var retCreate = fluigAPI.getUserService().create(vo);
					var data = {
						nome: rsWD.getString("NOME_COMPLETO"),
						email: wEmailFinal,
						gerado: wGerado,
						mensagem: 'Usuário incluido com sucesso',
						status: 'OK'
					};
					arrUsuarioInclusos.push(data);

					f_UpdateUsuarioTenant(wEmailFinal, rsWD.getString("CPF"), newDataset)
				} catch (error) {
					var data = {
						nome: rsWD.getString("NOME_COMPLETO"),
						email: wEmailFinal,
						gerado: wGerado,
						mensagem: 'Erro ao incluir esse usuário, mensagem de erro: ' + error.toString(),
						status: 'ERROR'
					};
					arrUsuarioInclusos.push(data);
					// custom_envio_email(wNomUsuario, "Ao incluir usuário no Fluig: " + error.toString());
					// printLog("info", "Error ao inclur usuário: " + error.toString());
					continue;
				}

				// continue;

				try {
					f_incluiComunidade(wLogin[0], rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"));
				} catch (error) {

				}


				try {
					f_incluiGrupos('', vo, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"), wLogin[0]);
				} catch (error) {
					custom_envio_email(wNomUsuario, "Ao cadastrar a Grupo: " + error.toString());
				}


				try {
					f_incluirCurso(wLogin[0], wNomUsuario, rsWD.getString("COD_FUNCAO"), rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("COD_UNIDADE"));
				} catch (error) {

				}

				// continue
			}
			// continue;

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nomeCompleto");
			voCard.setValue(rsWD.getString("NOME_COMPLETO"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nome");
			voCard.setValue(FistName.trim());
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("sobrenome");
			voCard.setValue(LastName.trim());
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("genero");
			voCard.setValue(rsWD.getString("GENERO"));
			CardFieldList.add(voCard)

			var wCodCargo = f_getCargos(rsWD.getString("COD_FUNCAO"), rsWD.getString("DESC_FUNCAO"), newDataset);
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("cargo");
			voCard.setValue(wCodCargo);
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nomeCargo");
			voCard.setValue(rsWD.getString("DESC_FUNCAO"));
			CardFieldList.add(voCard)

			var wCodDepart = f_getDepartamento(rsWD.getString("COD_DEPARTAMENTO"), rsWD.getString("DESC_DEPARTAMENTO"), newDataset);
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("departamento");
			voCard.setValue(wCodDepart);
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nomeDepartamento");
			voCard.setValue(rsWD.getString("DESC_DEPARTAMENTO"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("unidade");
			voCard.setValue(rsWD.getString("COD_UNIDADE"));
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nomeUnidade");
			voCard.setValue(rsWD.getString("DESC_UNIDADE"));
			CardFieldList.add(voCard);

			var wCodEmpresa = f_getEmpresa(rsWD.getString("COD_EMPRESA"), rsWD.getString("DESC_EMPRESA"), newDataset);
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("empresa");
			voCard.setValue(wCodEmpresa);
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("nomeEmpresa");
			voCard.setValue(rsWD.getString("DESC_EMPRESA"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("telefone");
			voCard.setValue(rsWD.getString("TELEFONE"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("celular");
			voCard.setValue(rsWD.getString("CELULAR"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("ramal");
			voCard.setValue(rsWD.getString("RAMAL"));
			CardFieldList.add(voCard)

			var wData = rsWD.getString("DATA_INICIO").split(" ")[0].split("-");
			var wDataInicio = wData[2] + "/" + wData[1] + "/" + wData[0];

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("dataInicioEmpresa");
			voCard.setValue(wDataInicio);
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("dataInicioEmpresaTs");
			voCard.setValue(toTimeStamp(wDataInicio));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("email");
			voCard.setValue(rsWD.getString("EMAIL").toLowerCase());
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("emailContato");
			voCard.setValue('');
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("login");
			voCard.setValue(wLogin[0]);
			CardFieldList.add(voCard)

			var wData = rsWD.getString("DATA_NASCIMENTO").split(" ")[0].split("-");
			var wDataNascimento = wData[2] + "/" + wData[1] + "/" + wData[0];
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("dataNascimento");
			voCard.setValue(wDataNascimento);
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("dataNascimentoTs");
			voCard.setValue(toTimeStamp(wDataNascimento));
			CardFieldList.add(voCard)

			var wData = wDataNascimento.split("/");
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("aniversarioDia");
			voCard.setValue(wData[0]);
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("aniversarioMes");
			voCard.setValue(wData[1]);
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("resumo");
			voCard.setValue('');
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("idCorporativo");
			voCard.setValue('');
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("idPessoal");
			voCard.setValue(rsWD.getString("IDPESSOAL"));
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("campoCustomizado1");
			voCard.setValue(rsWD.getString("CAMPOCUSTOMIZADO1"));
			CardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("politicaDocumento");
			voCard.setValue(dataSetParam.getValue(0, "politicaDocumento"));
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("politicaVersao");
			voCard.setValue(dataSetParam.getValue(0, "politicaVersao"));
			CardFieldList.add(voCard);

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("campoCustomizado2");
			voCard.setValue(rsWD.getString("MATRICULA"));
			CardFieldList.add(voCard);


			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint('idPessoal', rsWD.getString("IDPESSOAL"), rsWD.getString("IDPESSOAL"), ConstraintType.MUST));
			var datasetU = DatasetFactory.getDataset("fdwt_campos_adicionais_usuario", null, constraints, null);

			if (datasetU != null && datasetU.rowsCount > 0) {
				for (var i = 0; i < datasetU.rowsCount; i++) {
					var wCarID = datasetU.getValue(0, "documentid");

					try {
						var srvCard = fluigAPI.getCardAPIService();
						var retorno = srvCard.edit(parseInt(wCarID), CardFieldList);
					} catch (error) {
						custom_envio_email(wNomUsuario, "Ao atualizar dados na Digite: " + error.toString());
						printLog("info", "Error SQL Integracao: " + error.toString());
					};

				}
			} else {
				var wDocument = f_getDocumentid('fdwt_campos_adicionais_usuario')
				if (wDocument != null) {
					try {
						var srvCard = fluigAPI.getCardAPIService();
						var retorno = srvCard.create(parseInt(wDocument), CardFieldList);
					} catch (error) {
						custom_envio_email(wNomUsuario, "Ao Incluir os dados da Digite: " + error.toString());
						printLog("info", "Error Integracao: " + error.toString());
					};
				}
			}
		}

		rsWD.close();

	} catch (error) {
		newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
		// return newDataset;
	}
}

function f_desativarUsuario(newDataset) {
	printLog("info", "## Iniciando a função f_desativarUsuario ##");
	try {
		var processosDocumentoArr = []
		var connectionWD = null;
		var statementWD = null;

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		connectionWD = dataSourceWD.getConnection();
		// printLog('info', 'DATATESTE ' + f_formataData(f_dataSubtraiDias()))
		// newDataset.addRow(new Array('DATATESTE ' + f_formataData(f_dataSubtraiDias())));
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where data_desligamento >= to_date2('" + f_formataData(f_dataSubtraiDias()) + "')";
		// var SQL = "select * from eis_v_funcionarios_protheus_digte where cpf = '02339831121' and (data_desligamento is not null or data_desligamento <> '')";
		var SQL = "select * from eis_v_funcionarios_protheus_digte where data_desligamento is not null and ies_cad_ativo = 'N'";
		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		processosDocumentoArr = consultaDataSetCadastroDeProcessos();

		while (rsWD.next()) {


			var dataSet = consultaDataSet('X', rsWD.getString("CPF").trim(), newDataset);
			newDataset.addRow(new Array('Reg: ' + dataSet.rowsCount + ' CPF: ' + rsWD.getString("CPF") + 'Nome: ' + rsWD.getString("NOME_COMPLETO")));
			if (dataSet.rowsCount > 0) {
				newDataset.addRow(new Array("nome: " + rsWD.getString("NOME_COMPLETO") + " CPF: " + rsWD.getString("CPF") + ' Situacao: ' + dataSet.getValue(0, "active")));
				if (dataSet.getValue(0, "active") == "true") {
					var wID = dataSet.getValue(0, "colleaguePK.colleagueId");
					// newDataset.addRow(new Array("USUARIO MATRICULA = -> " + wID));
					try {
						var processosDoUsuario = f_getProcessoByColleagueId(wID)
						var estaNosProcessosPermitidos = f_checaSeUsuarioEstaNosProcessosPermitidos(processosDocumentoArr, processosDoUsuario);
						if (estaNosProcessosPermitidos) {
							// newDataset.addRow(new Array("PERMITIDO INATIVAR."));
							for (p = 0; p < processosDoUsuario.length; p++) {
								cancelarProcesso(wID, processosDoUsuario[p].numprocesso)
							}

							try {
								var Retorno = fluigAPI.getUserService().deactivateByCode(wID);
								var data = {
									nome: rsWD.getString("NOME_COMPLETO"),
									email: rsWD.getString("EMAIL").toLowerCase(),
									mensagem: 'Usuário Bloqueado.',
									status: 'OK'
								};
								arrUsuarioDesativados.push(data);
							} catch (error) {
								var data = {
									nome: rsWD.getString("NOME_COMPLETO"),
									email: rsWD.getString("EMAIL").toLowerCase(),
									mensagem: 'Erro ao bloquear esse usuário, mensagem de erro: ' + error.toString(),
									status: 'ERROR'
								};
								arrUsuarioDesativados.push(data);
								// newDataset.addRow(new Array("Error ao Inativar: " + error.toString()));
							}
						} else {
							// custom_envio_email(rsWD.getString("NOME_COMPLETO"), "Não é possível inativar,pois existem processos em aberto para esse usuário.");
							var data = {
								nome: rsWD.getString("NOME_COMPLETO"),
								email: rsWD.getString("EMAIL").toLowerCase(),
								mensagem: "Não é possível inativar, pois existem processos em aberto para esse usuário.",
								status: 'ERROR'
							};
							arrUsuarioDesativados.push(data);
							// newDataset.addRow(new Array("NÃO PERMITIDO INATIVAR."));
						}

					} catch (error) {
						//custom_envio_email(rsWD.getString("NOME_COMPLETO"), "Ao Inativar usuário no Fluig: " + error.toString());
						// newDataset.addRow(new Array("Error ao Inativar: " + error.toString()));
					}
				}
			}
		}

		rsWD.close();

	} catch (error) {
		printLog("info", "Ocorreu um erro na função f_desativarUsuario() -> " + error);
		newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
}

function cancelarProcesso(userId, processId) {
	printLog("info", "## Iniciando a função cancelInstance ##");
	try {
		var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
		var workflowServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
		var workflowService = workflowServiceLocator.getWorkflowEngineServicePort();

		var cancelamentoProcesso = workflowService.cancelInstance('admin', 'SrvCeram971', '01', processId, 'admin', 'cancelada com sucesso');

		if (cancelamentoProcesso.equals("OK")) {
			newDataset.addRow(new Array("Cancelamento do processo funcionou -> " + cancelamentoProcesso));
		} else {
			newDataset.addRow(new Array("Cancelamento do processo NÃO funcionou ->" + cancelamentoProcesso));
		}
	} catch (error) {
		newDataset.addRow(new Array("Erro na hora de cancelar um processo -> " + error));
	}
	finally {

	}

}

function f_getProcessoByColleagueId(colleagueId) {
	// newDataset.addRow(new Array("## Iniciando a função f_getProcessoByColleagueId ##"));
	try {
		var connectionWD = null;
		var statementWD = null;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();
		var array = []

		var SQL = "SELECT DISTINCT NUM_PROCES, COD_DEF_PROCES FROM (SELECT a.NUM_PROCES, a.COD_DEF_PROCES	FROM PROCES_WORKFLOW  a	WHERE a.LOG_ATIV = 1 AND a.STATUS = 0 AND a.COD_MATR_REQUISIT = '" + colleagueId + "'	UNION	SELECT a.NUM_PROCES, a.COD_DEF_PROCES	FROM TAR_PROCES  t JOIN PROCES_WORKFLOW a ON (a.COD_EMPRESA = t.COD_EMPRESA AND a.NUM_PROCES = t.NUM_PROCES) WHERE a.LOG_ATIV = 1 AND a.STATUS = 0 AND t.LOG_ATIV = 1 AND t.CD_MATRICULA = '" + colleagueId + "') t"

		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			var processo = rsWD.getString("COD_DEF_PROCES")
			// newDataset.addRow(new Array("CODIGO DO PROCESSO BY COLLEAGUEID -> "+ processo));
			var data = {
				processo: rsWD.getString("COD_DEF_PROCES"),
				numprocesso: rsWD.getString("NUM_PROCES")
			}
			array.push(data)
		}
	} catch (error) {
		printLog("info", "Erro na função f_getProcessoByColleagueId -> " + error);

	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		return array;
	}

}

function f_checaSeUsuarioEstaNosProcessosPermitidos(processosDocumento, processosUsuario) {
	// newDataset.addRow(new Array("## Iniciando a função f_checaSeUsuarioEstaNosProcessosPermitidos ##"));

	var wRetorno = false;
	if (processosUsuario.length == 0) { wRetorno = true; }

	for (i = 0; i < processosUsuario.length; i++) { // APD, compra

		var cod = processosUsuario[i]
		// newDataset.addRow(new Array("## Usuario " + processosUsuario));
		// newDataset.addRow(new Array("## Processos " + processosDocumento));
		// newDataset.addRow(new Array("## Comparando " + processosDocumento.indexOf(cod)));
		for (var x = 0; x < processosDocumento.length; x++) {
			if (processosDocumento[x] == processosUsuario[i].processo) { // APD, digite				
				wRetorno = true;
				break;
			} else {
				wRetorno = false;
			}
		}
	}

	return wRetorno
}

function consultaDataSet(indBusca, busca, newDataset) {


	// newDataset.addRow(new Array("indBusca: " + indBusca + ' Busca: ' + busca));
	if (indBusca == 'X') {
		var wRetorno = f_usuarioTenant(busca);
		if (wRetorno != null) {
			// newDataset.addRow(new Array("Achou registro"));
			indBusca = 'T';
			busca = wRetorno
		} else {
			// newDataset.addRow(new Array("Não achou registro"));
			indBusca = 'M';
			busca = '-99999999999999999'
		}
	}


	var constraints = new Array();
	if (indBusca == 'M') {
		constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", busca, busca, ConstraintType.MUST));
	}
	if (indBusca == 'E') {
		constraints.push(DatasetFactory.createConstraint("mail", busca, busca, ConstraintType.MUST));
	}
	if (indBusca == 'T') {
		constraints.push(DatasetFactory.createConstraint("userTenantId", busca, busca, ConstraintType.MUST));
	}

	var dataSet = DatasetFactory.getDataset("colleague", null, constraints, null);

	return dataSet;
}

function consultaDataSetCadastroDeProcessos() {
	printLog("info", "## Iniciando a função consultaDataSetCadastroDeProcessos ##");
	var arr = [];
	var dataSet = DatasetFactory.getDataset("ds_cadastro_processo", null, null, null);

	if (dataSet != null && dataSet.rowsCount > 0) {
		for (i = 0; i < dataSet.rowsCount; i++) {
			printLog("info", "CODIGO DO PROCESSO DO DOCUMENTO -> " + dataSet.getValue(i, "cod_proc"));
			arr.push(dataSet.getValue(i, "cod_proc"))
		}
	}
	return arr;
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

function f_formataData(pdata, dataset) {
	if (dataset != null) {
		dataset.addRow(new Array(" PData: " + pdata));
		dataset.addRow(new Array(" PData2: " + new Date(pdata)));
	}

	// diaF = (dia.length == 1) ? '0' + (parseInt(dia) + 1) : (parseInt(dia) + 1),
	var data = new Date(pdata),
		dia = data.getDate().toString(),
		diaF = (dia.length == 1) ? '0' + dia : dia,
		mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
		mesF = (mes.length == 1) ? '0' + mes : mes,
		anoF = data.getFullYear();
	return diaF + "/" + mesF + "/" + anoF;
}

function f_getComunidade(codCargo, codDepartanento, codUnidade, indBusca, login) {
	var wCodigo = '';

	var constraints = new Array();

	if (indBusca == '0') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}

	if (indBusca == '1') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '2') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '3') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '4') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '5') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '6') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '7') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}

	var dataset = DatasetFactory.getDataset("kbt_t_integracaoUsuario", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {

			var comunidade = dataset.getValue(i, "cod_comunidade");
			UserList = new java.util.ArrayList();
			UserList.add(login);
			fluigAPI.getCommunityService().addUsers(comunidade, UserList);
			// newDataset.addRow(new Array(" Comunidade nivel : " + indBusca + ":" + comunidade));
		}
		wCodigo = "OK";
	}
	return wCodigo;
}

function f_getGrupo(codCargo, codDepartanento, codUnidade, indBusca, userVo, pLogin) {
	var wCodigo = '';

	var constraints = new Array();

	if (indBusca == '0') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}

	if (indBusca == '1') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '2') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '3') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '4') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '5') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '6') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '7') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}

	var dataset = DatasetFactory.getDataset("kbt_t_integracaoGrupos", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {
			var tenantId = getValue('WKCompany');
			var codGrupo = dataset.getValue(i, "cod_grupo");

			var wBusca = f_validaGrupo(pLogin, codGrupo);
			if (wBusca == false) {
				fluigAPI.getUserService().addUserToGroup(tenantId, codGrupo, userVo);
			}
		}
		wCodigo = 'OK'
	}
	return wCodigo;
}

function f_getpapel(codCargo, codDepartanento, codUnidade, indBusca) {
	var wCodigo = '';

	var constraints = new Array();

	if (indBusca == '0') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}

	if (indBusca == '1') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '2') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '3') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '4') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
	}
	if (indBusca == '5') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '6') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}
	if (indBusca == '7') {
		constraints.push(DatasetFactory.createConstraint('cod_cargo', codCargo, codCargo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
	}

	var dataset = DatasetFactory.getDataset("kbt_t_integracaoPapeis", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {
			wCodigo = dataset.getValue(i, "cod_papel")
		}
	}
	return wCodigo;
}

function f_getDepartamento(codigo, descricao, newDataset) {
	var wCodigoDepat = 0;

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('estruturaId', codigo, codigo, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("fdwt_estrutura_empresa", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		wCodigoDepat = codigo;
	} else {
		var wDocument = f_getDocumentid('fdwt_estrutura_empresa');
		if (wDocument != null) {
			var cardFieldList = new java.util.ArrayList();

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("estruturaId");
			voCard.setValue(codigo);
			cardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("estruturaNome");
			voCard.setValue(descricao);
			cardFieldList.add(voCard)


			var srvCard = fluigAPI.getCardAPIService();
			var retorno = srvCard.create(parseInt(wDocument), cardFieldList);

			wCodigoDepat = codigo;
		}
	}
	return wCodigoDepat;
}

function f_getEmpresa(codigo, descricao, newDataset) {
	var wCodigo = 0;

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('empresaId', codigo, codigo, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("fdwt_empresas", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		wCodigo = codigo;
	} else {
		var wDocument = f_getDocumentid('fdwt_empresas');
		if (wDocument != null) {
			var cardFieldList = new java.util.ArrayList();

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("empresaId");
			voCard.setValue(codigo);
			cardFieldList.add(voCard)

			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("descricao");
			voCard.setValue(descricao);
			cardFieldList.add(voCard)


			var srvCard = fluigAPI.getCardAPIService();
			var retorno = srvCard.create(parseInt(wDocument), cardFieldList);

			wCodigo = codigo;

		}
	}

	return wCodigo;
}

function f_getCargos(codigo, descricao, newDataset) {
	var wCodigoCargo = 0;
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('cargoId', codigo, codigo, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("fdwt_estrutura_empresa_cargo", null, constraints, null);

	if (dataset != null && dataset.rowsCount > 0) {
		wCodigoCargo = codigo;
	} else {

		var wDocument = f_getDocumentid('fdwt_estrutura_empresa_cargo');
		if (wDocument != null) {
			try {
				var cardFieldList = new java.util.ArrayList();

				var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
				voCard.setFieldId("cargoId");
				voCard.setValue(codigo);
				cardFieldList.add(voCard)


				var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
				voCard.setFieldId("cargoNome");
				voCard.setValue(descricao);
				cardFieldList.add(voCard)

				var srvCard = fluigAPI.getCardAPIService();
				var retorno = srvCard.create(parseInt(wDocument), cardFieldList);
				wCodigoCargo = codigo;

			} catch (error) {
				newDataset.addRow(new Array(" Erro: " + error + " linha: " + error.lineNumber));
			}
		}
	}

	return wCodigoCargo;
}

function f_getDocumentid(nomeDataset) {

	var wDocument = null;
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('datasetName', nomeDataset, nomeDataset, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("document", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {
		for (i = 0; i < dataset.rowsCount; i++) {
			wDocument = dataset.getValue(i, "documentPK.documentid");
		}
	}
	return wDocument;
}

function custom_envio_email(pNome, pMensagem) {
	var nome = '';

	var matricula = 'admin';
	var SERVER_URL = fluigAPI.getPageService().getServerURL();

	var destinatarios = new java.util.ArrayList();
	// destinatarios.add('lista-ti@ceramfix.com.br');
	destinatarios.add('marcio@kobit.com.br');
	// destinatarios.add('daivid.thomaz@ceramfix.com.br');

	// destinatarios.add('thomazdede@yahoo.com.br');

	var parametros = new java.util.HashMap();
	parametros.put('subject', 'Integração Fluig x Protheus');
	parametros.put('SERVER_URL', SERVER_URL);
	parametros.put('NOME', nome);

	parametros.put('USUARIO', pNome);
	parametros.put('MENSAGEM', pMensagem);

	notifier.notify(matricula, 'integracao_usuarios', parametros, destinatarios, 'text/html');
	notifier.notify(matricula, 'integracao_usuarios', parametros, destinatarios, 'text/html');
}

function f_resumoEmail(pContent) {
	var nome = '';

	var matricula = 'admin';
	var SERVER_URL = fluigAPI.getPageService().getServerURL();

	var destinatarios = new java.util.ArrayList();
	// destinatarios.add('lista-ti@ceramfix.com.br');
	// destinatarios.add('lista-rh@ceramfix.com.br');
	destinatarios.add('marcio@kobit.com.br');
	// destinatarios.add('silvio.junior@ceramfix.com.br');

	// destinatarios.add('thomazdede@yahoo.com.br');

	var parametros = new java.util.HashMap();
	parametros.put('subject', 'Integração Fluig x Protheus');
	parametros.put('SERVER_URL', SERVER_URL);
	parametros.put('NOME', nome);

	parametros.put('WorkflowMailContent', pContent);

	notifier.notify(matricula, 'TPLTASK_SEND_EMAIL_KBT', parametros, destinatarios, 'text/html');

}

function f_incluiComunidade(login, codCargo, codDepartamento, codUnidade, newDataset) {

	// newDataset.addRow(new Array(" Incluido as Comunidades! "));
	// newDataset.addRow(new Array(" Cargo: " + codCargo + " Dpartamento: " + codDepartamento + " Unidade: " + codUnidade));
	var retorno = f_getComunidade('', '', '', '0', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '1', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '2', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '3', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '4', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '5', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '6', login);
	var retorno = f_getComunidade(codCargo, codDepartamento, codUnidade, '7', login);

}

function f_validaGrupo(pLogin, pCodGroup) {
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();
		var wBusca = false;

		var SQL = "select * from Fdn_Groupuserrole where login = '" + pLogin + "' and group_code = '" + pCodGroup + "'";
		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			wBusca = true;
		}

	} catch (error) {

	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		return wBusca;
	}
}

function f_incluiGrupos(pCodGrupo, userVo, codCargo, codDepartamento, codUnidade, pLogin) {
	var tenantId = getValue('WKCompany');
	if (pCodGrupo == '') {

		var codGrupo = f_getGrupo('', '', '', '0', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '1', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '2', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '3', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '4', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '5', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '6', userVo, pLogin);
		var codGrupo = f_getGrupo(codCargo, codDepartamento, codUnidade, '7', userVo, pLogin);

	} else {
		// newDataset.addRow(new Array(" Grupo Padrao: " + pCodGrupo));
		var wBusca = f_validaGrupo(pLogin, pCodGrupo);
		if (wBusca == false) {
			fluigAPI.getUserService().addUserToGroup(tenantId, pCodGrupo, userVo);
		}
	}

}

function f_incluiPapeis(roleList, login, codCargo, codDepartamento, codUnidade, indAcao) {

	var wCodRetorno = f_getpapel('', '', '', '0');
	// log.info('PASSOU wCodRetorno');
	// log.info('wCodRetorno ' + wCodRetorno);

	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '1');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '2');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '3');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '4');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '5');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '6');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	var wCodRetorno = f_getpapel(codCargo, codDepartamento, codUnidade, '7');
	if (wCodRetorno != "") {
		if (indAcao == 'I') {
			roleList.add(wCodRetorno);
		}
		if (indAcao == 'U') {
			f_insertUserRole(login, wCodRetorno);
		}
	}

	return roleList;
}

function f_insertUserRole(pLogin, pRoleID) {
	try {
		var rsWD = null;
		var statementWD = null;
		var connectionWD = null;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();
		var wBusca = false;

		var SQL = "select * from fdn_userrole where login = '" + pLogin + "' and role_code = '" + pRoleID + "'";
		printLog("info", "SQL PAPEL: " + SQL);
		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while (rsWD.next()) {
			wBusca = true;
		}

		if (wBusca == false) {
			var sqlUPD = "insert into fdn_userrole (userrole_id, login, role_code, tenant_id) values( hibernate_sequence.nextval, '" + pLogin + "', '" + pRoleID + "', 1 )";
			printLog("info", "SQL INSERT PAPEL: " + sqlUPD);
			statementWD = connectionWD.prepareStatement(sqlUPD);
			statementWD.executeUpdate();

		}
	} catch (error) {
		// log.info('PASSOU AQUI 5');
		// log.info(error);
	} finally {
		// log.info('PASSOU AQUI 6');
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
		// log.info('PASSOU AQUI 7');
	}
}

function f_incluirCurso(login, nomeUsuario, codCargo, codDepartamento, codUnidade) {
	var gson = new com.google.gson.Gson();

	var wRetorno = f_getCurso('', '', '', '0');
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}


	var wRetorno = f_getCurso(codCargo, codDepartamento, codUnidade, '1');
	// newDataset.addRow(new Array("2 -Curso: " + login + " - JSON: " + gson.toJson(wRetorno)));
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}

	var wRetorno = f_getCurso(codCargo, codDepartamento, codUnidade, '2');
	// newDataset.addRow(new Array("3 -Curso: " + login + " - JSON: " + gson.toJson(wRetorno)));
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}

	var wRetorno = f_getCurso(codCargo, codDepartamento, codUnidade, '3');
	// newDataset.addRow(new Array("4 -Curso: " + login + " - JSON: " + gson.toJson(wRetorno)));
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}

	var wRetorno = f_getCurso(codCargo, codDepartamento, codUnidade, '4');
	// newDataset.addRow(new Array("5 -Curso: " + login + " - JSON: " + gson.toJson(wRetorno)));
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}

	var wRetorno = f_getCurso(codCargo, codDepartamento, codUnidade, '5');
	// newDataset.addRow(new Array("6 -Curso: " + login + " - JSON: " + gson.toJson(wRetorno)));
	if (wRetorno.length > 0) {
		var data = {
			login: login,
			nome: nomeUsuario,
			cursos: wRetorno
		}
		f_cursoLMS(data);
	}
}

function f_cursoLMS(pJson) {
	var gson = new com.google.gson.Gson();
	var constraints = new Array();
	var wRetorno = {};
	constraints.push(DatasetFactory.createConstraint('indacao', 'INCLUIRCURSO', 'INCLUIRCURSO', ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('json', gson.toJson(pJson), gson.toJson(pJson), ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("dsk_lms", null, constraints, null);
	if (dataset != null && dataset.rowsCount > 0) {

		var wRetorno = {
			status: dataset.getValue(0, "status"),
			mensagem: dataset.getValue(0, "mensagem")
		}

		// newDataset.addRow(new Array("LMS JSON: " + gson.toJson(wRetorno)));
	}

	return wRetorno;
}

function f_getCurso(codCargo, codDepartanento, codUnidade, indBusca) {
	var wCodigo = [];
	var constraints = new Array();


	if (indBusca == '0') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), '');
				if (wFuncao == false) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					};
					wCodigo.push(data);
				}
			}
		}
	}

	if (indBusca == '1') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), '');
				if (wFuncao == false) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					}
					wCodigo.push(data)
				}
			}
		}
	}

	if (indBusca == '2') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), '');
				if (wFuncao == false) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					}
					wCodigo.push(data)
				}
			}
		}
	}


	if (indBusca == '3') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', '', '', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), codCargo);
				if (wFuncao == true) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					}
					wCodigo.push(data)

				}
			}
		}
	}

	if (indBusca == '4') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', '', '', ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), codCargo);
				if (wFuncao == true) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					}
					wCodigo.push(data)
				}
			}
		}
	}

	if (indBusca == '5') {
		constraints.push(DatasetFactory.createConstraint('cod_unidade', codUnidade, codUnidade, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_departamento', codDepartanento, codDepartanento, ConstraintType.MUST));
		var curso = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraints, null);

		if (curso != null && curso.rowsCount > 0) {
			for (var i = 0; i < curso.rowsCount; i++) {
				var wFuncao = f_getCursoFuncao(curso.getValue(i, 'documentid'), curso.getValue(i, 'version'), codCargo);
				if (wFuncao == true) {
					var data = {
						idCurso: curso.getValue(i, 'id_curso'),
						codCurso: curso.getValue(i, 'code_curso'),
					}
					wCodigo.push(data);
				}
			}
		}
	}


	return wCodigo;
}

function f_getCursoFuncao(documentid, version, codCargo) {
	wRretorno = false;

	var constraintsFilhos = new Array();
	constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'funcoeslms', 'funcoeslms', ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint('metadata#id', documentid, documentid, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint('metadata#version', version, version, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
	var datasetFilhos = DatasetFactory.getDataset('kbt_t_integracaoLms', null, constraintsFilhos, null);


	if (datasetFilhos != null && datasetFilhos.rowsCount > 0) {

		for (var i = 0; i < datasetFilhos.rowsCount; i++) {
			if (datasetFilhos.getValue(i, 'cod_cargo') == codCargo) {
				wRretorno = true;
				break;
			}
		}
	}

	return wRretorno;
}

function toTimeStamp(data) {
	data = data.replace('/', '-').replace('/', '-');
	var data2 = data.split("-");
	var novaData = new Date(data2[2], data2[1] - 1, data2[0]);
	novaData = novaData.getTime();
	novaData = novaData.toString().substring(0, 10)
	return novaData;
}


function f_usuarioTenant(pCPF) {
	try {
		var statementWD = null;
		var connectionWD = null;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		connectionWD = dataSourceWD.getConnection();
		var wRetorno = null;

		var SQL = "select user_tenant_id from fdn_usertenant where idp_id = '" + pCPF + "'";
		statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while (rsWD.next()) {
			wRetorno = rsWD.getString("user_tenant_id")
		}

		rsWD.close();

	} catch (error) {

	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}

	return wRetorno;
}


function f_UpdateUsuarioTenant(email, pCPF, newDataset) {
	try {
		var statementWD = null;
		var connectionWD = null;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");


		// newDataset.addRow(new Array("Aqui EMAIL: " + email + ' CPF: ' + pCPF));

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST));
		var dataSet = DatasetFactory.getDataset("colleague", null, constraints, null);
		if (dataSet.rowsCount > 0) {
			// newDataset.addRow(new Array("Achou registro"));
			var SQL = "update fdn_usertenant set idp_id = '" + pCPF + "' where (idp_id is null or idp_id = '') and user_tenant_id = " + dataSet.getValue(0, "userTenantId");
			// newDataset.addRow(new Array("SQL: " + SQL));
			connectionWD = dataSourceWD.getConnection();
			statementWD = connectionWD.prepareStatement(SQL);
			statementWD.executeUpdate();
		}
	} catch (error) {

	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
}