function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Sync Periodos Portal ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');

    var listaConstraits = {};
    var wRetorno = false;
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    listaConstraits['dtInicio'] = '2024-07-03';
    listaConstraits['dtFIm'] = '2024-07-10';

    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;

        var tPeriodos = getTable('ds_periodos_premios', '');


        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select 1 from " + tPeriodos + " where  STR_TO_DATE(dt_inicio, '%Y-%m-%d') <= '" + listaConstraits['dtInicio'] + "' or STR_TO_DATE(dt_fim, '%Y-%m-%d')  >= '" + listaConstraits['dtFIm'] + "'";
        statementWD = connectionWD.prepareStatement(SQL);
        var rsWDAgenda = statementWD.executeQuery();
        while (rsWDAgenda.next()) {
            wRetorno = true;
        }

        newDataset.addRow(new Array(
            wRetorno
        ));

    } catch (error) {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }

    return newDataset;
}

function onMobileSync(user) {
}


function getTable(dataSet, table) {
    var ct = new Array();
    ct.push(DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST));
    if (table != ""
        && table != null
        && table != undefined) {
        ct.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
    }
    var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);

    if (table != ""
        && table != null
        && table != undefined) {
        return ds.getValue(0, "tableFilha");
    } else {
        return ds.getValue(0, "table");
    }
}