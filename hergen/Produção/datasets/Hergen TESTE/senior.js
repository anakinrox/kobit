function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        
        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }        
        
    	
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/SeniorDS");
        var connectionWD = dataSourceWD.getConnection();
        
        newDataset.addColumn('codigo');
        newDataset.addColumn('descricao')
        newDataset.addColumn('codCCusto')
        newDataset.addColumn('CCusto')
        newDataset.addColumn('codCargo')
        newDataset.addColumn('nomCargo')        

        var SQL = "select numcad,nomfun,codccu,nomccu,numcra,codcar,titred from fluig_v_funcionario where numcad = " + listaConstraits['matricula'];
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            newDataset.addRow(
                    new Array(
                        rsWD.getString("numcad") + "",
                        rsWD.getString("nomfun") + "",
                        rsWD.getString("codccu") + "",
                        rsWD.getString("nomccu") + "",
                        rsWD.getString("codcar") + "",
                        rsWD.getString("titred") + ""                        
                    ));
        }
               
    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
    	
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();    	
        return newDataset;
    }        
}
function onMobileSync(user) {

}