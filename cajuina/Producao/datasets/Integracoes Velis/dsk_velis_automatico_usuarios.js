var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Usuarios START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function f_integrar(newDataset, pCodRepres) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();

        var SQL = "select ";
        SQL += "    caj_repres.empresa, ";
        SQL += "    caj_repres.cod_repres ";
        SQL += "from CAJ_AFV_REPRES_EMPRESA caj_repres ";
        SQL += "    inner join REPRESENTANTE rep on(rep.COD_REPRES = caj_repres.COD_REPRES) ";
        SQL += "                             and (rep.ies_situacao = 'N') ";
        SQL += "where caj_repres.EMPRESA  in ('03','04','08') ";
        // SQL += "  and rownum = 1";
        // SQL += "  order by caj_repres.cod_repres";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            f_incluiRepresentante(rsWD.getString("cod_repres").trim(), newDataset);
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
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

function f_incluiRepresentante(pCodRepres, pDataset) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var rsWD = null;
        var wAchou = false;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();


        var sqlINS = "insert into caj_velis_integracao (cadastro, representante, cliente, sincronizado) values ('usuario'," + pCodRepres + ",' ','N')";
        // pDataset.addRow(new Array("SQL: " + sqlINS));
        statementWD = connectionWD.prepareStatement(sqlINS);
        statementWD.executeUpdate();


    } catch (error) {
        pDataset.addRow(new Array("Erro Atu: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}