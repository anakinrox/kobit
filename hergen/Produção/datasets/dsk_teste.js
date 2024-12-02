var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

    try {
        var newDataset = DatasetBuilder.newDataset();
        // var statementWD = null;
        // var connectionWD = null;
        newDataset.addColumn('teste');

        // var contextWD = new javax.naming.InitialContext();
        // var dataSourceWD = contextWD.lookup("java:/jdbc/SeniorDS");
        // connectionWD = dataSourceWD.getConnection();


        // var SQL = "select * from fluig_v_funcionario";
        // statementWD = connectionWD.prepareStatement(SQL);
        // var rsWD = statementWD.executeQuery();
        // var rsmd = rsWD.getMetaData();
        // var numeroColunas = rsmd.getColumnCount();


        // for (var col=1;col <= numeroColunas; col++) {
        //     var nomeColuna = rsmd.getColumnName(col);
        //     newDataset.addColumn(nomeColuna);
        // }


        // while (rsWD.next()) {
        //     var ArColunas = new Array();
        //     for (var col = 1; col <= numeroColunas; col++) {
        //         var nomeColuna = rsmd.getColumnName(col);
        //         valor = rsWD.getString(nomeColuna);
        //         ArColunas.push(valor)
        //     }
        //     newDataset.addRow(ArColunas);
        // }
        // if (rsWD != null) rsWD.close();

        var ct = new Array();
        ct.push(DatasetFactory.createConstraint("matricula", '819', null, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset('senior', null, ct, null);
        if (dataset != null && dataset.rowsCount > 0) {
            for (i = 0; i < dataset.rowsCount; i++) {
                newDataset.addRow(new Array('codCCusto: ' + dataset.getValue(i, "codCCusto")));
            }
        }



    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {

        // if (statementWD != null) statementWD.close();
        // if (connectionWD != null) connectionWD.close();

        return newDataset;
    }
}

function onMobileSync(user) {

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
