function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('codigo');
        newDataset.addColumn('uf');
        newDataset.addColumn('cidade');

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var SQL = " select cod_erp,id,cidade,cod_uf,uf,nome,cod_pais,pais, cod_cidade_ibge ";
        SQL += "FROM fluig_v_cidade WHERE cod_erp is not null";

        statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            newDataset.addRow(
                new Array(
                    rsWD.getString("cod_erp") + "",
                    rsWD.getString("uf") + "",
                    rsWD.getString("cidade") + ""
                ));
        }



    } catch (error) {
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return newDataset
    }
}

function onMobileSync(user) {

}