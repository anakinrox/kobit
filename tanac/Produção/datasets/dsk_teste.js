var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

    try {
        var newDataset = DatasetBuilder.newDataset();
        var statementWD = null;
        var connectionWD = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/APP_RM");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select f.CODCOLIGADA, f.CODFILIAL, f.CHAPA, p.nome, REPLACE(CONVERT(VARCHAR(10), p.dtnascimento, 111), '/', '-') as dtnascimento, p.cpf, p.email ";
        SQL += " from pfunc f  ";
        SQL += " inner join ppessoa p on(p.codigo = f.codpessoa)";
        SQL += " left join kbt_t_pfunc k on(k.CODCOLIGADA = f.CODCOLIGADA ";
        SQL += "                         and k.CODFILIAL = f.CODFILIAL ";
        SQL += "                         and k.CHAPA = f.CHAPA) ";
        SQL += " where f.DATAADMISSAO >= getdate() - 10 ";
        SQL += " and f.DATADEMISSAO is null ";
        SQL += " and k.IDGUPY is null";
        statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        var rsmd = rsWD.getMetaData();
        var numeroColunas = rsmd.getColumnCount();


        for (var col = 1; col <= numeroColunas; col++) {
            var nomeColuna = rsmd.getColumnName(col);
            newDataset.addColumn(nomeColuna);
        }


        while (rsWD.next()) {
            var ArColunas = new Array();
            for (var col = 1; col <= numeroColunas; col++) {
                var nomeColuna = rsmd.getColumnName(col);
                valor = rsWD.getString(nomeColuna);
                ArColunas.push(valor)
            }
            newDataset.addRow(ArColunas);
        }
        if (rsWD != null) rsWD.close();



    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {

        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

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
