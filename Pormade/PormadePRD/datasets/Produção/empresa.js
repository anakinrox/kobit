function defineStructure() { }

function onSync(lastSyncDate) { }

function createDataset(fields, constraints, sortFields) {
	try {
		var dataset = DatasetBuilder.newDataset();

		dataset.addColumn("cod_empresa");
		dataset.addColumn("den_empresa");
		dataset.addColumn("den_reduz");

		try {
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup("java:/jdbc/SankhyaDS");
			// var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
			var connectionWD = dataSourceWD.getConnection();
		} catch (e) {
			log.info("ERROOOOOO" + e.getMessage());
		}


		var SQL = " select e.codemp, e.razaosocial, e.nomefantasia from TSIEMP e ";
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while (rsWD.next()) {
			dataset.addRow(
				new Array(
					("00" + rsWD.getString("codemp")).slice(-2),
					rsWD.getString("razaosocial"),
					rsWD.getString("nomefantasia")
				)
			);
		}

	} catch (error) {
		dataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));

	} finally {
		rsWD.close();
		statementWD.close();
		connectionWD.close();

		return dataset;
	}

}

function onMobileSync(user) { }
