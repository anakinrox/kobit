function servicetask7(attempt, message) {
	try {

		var numProcess = getValue("WKNumProces");

		var connectionWD;
		var statementWD;
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup('java:/jdbc/FluigDS');
		connectionWD = dataSourceWD.getConnection();
		var proc_de = 0;
		var proc_ate = "999999999999";

		var indexes = hAPI.getChildrenIndexes("usuariosinativar");
//		log.dir('SQL Tar Index: ' + indexes.length);
		for (var i = 0; i < indexes.length; i++) {

			if (hAPI.getCardValue("cod_matricula_novo___" + indexes[i]) != "") {
				var update = " UPDATE tar_proces " +
					" 	SET tar_proces.CD_MATRICULA = '" + hAPI.getCardValue("cod_matricula_novo___" + indexes[i]) + "' " +
					" WHERE tar_proces.COD_EMPRESA = 1 " +
					"	AND tar_proces.CD_MATRICULA = '" + hAPI.getCardValue("cod_matricula_atual___" + indexes[i]) + "' " +
					"	AND tar_proces.LOG_ATIV = 1 " +
					"	AND (SELECT COUNT(*) FROM proces_workflow " +
					" 			WHERE proces_workflow.COD_EMPRESA = tar_proces.COD_EMPRESA " +
					"		  	AND proces_workflow.NUM_PROCES = tar_proces.NUM_PROCES " +
					"			AND proces_workflow.COD_DEF_PROCES = '" + hAPI.getCardValue("cod_processo___" + indexes[i]) + "' " +
					"			AND proces_workflow.LOG_ATIV = 1) = 1";

//				log.dir('SQL Tar Proces: ' + update);


				var stmWD = connectionWD.prepareStatement(update);
				stmWD.executeUpdate();

				var update = "update proces_workflow set COD_MATR_REQUISIT = '" + hAPI.getCardValue("cod_matricula_novo___" + indexes[i]) + "' " +
					" where COD_MATR_REQUISIT = '" + hAPI.getCardValue("cod_matricula_atual___" + indexes[i]) + "' and LOG_ATIV = 1  and STATUS = 0 " +
					" and cod_def_proces = '" + hAPI.getCardValue("cod_processo___" + indexes[i]) + "'";

//				log.dir('SQL Tar WorkFlow: ' + update);

				var stmWD = connectionWD.prepareStatement(update);
				stmWD.executeUpdate();
			}
		}

	} catch (error) {
		log.dir('Erro: ' + error.toString() + " linha: " + error.lineNumber);
		throw error.toString() + " linha: " + error.lineNumber;
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
}