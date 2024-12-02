function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog('info', " ##### DataSet Cargos #####");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('codigo');
    newDataset.addColumn('cargo');

    var connectionWD = null;
    var statementWD = null;

    try {

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = 'select CODIGO, CARGO from [POA-SRV-BDRM].[CorporeRM].[dbo].VW_FLUIG_CARGO';
        statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            newDataset.addRow(
                new Array(
                    rsWD.getString("CODIGO") + "",
                    rsWD.getString("CARGO") + ""
                ));
        }
    } catch (error) {
        printLog('error', error.toString());
        newDataset.addColumn('STATUS');
        newDataset.addRow(new Array("Erro ao DataSet: " + error.toString()));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
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