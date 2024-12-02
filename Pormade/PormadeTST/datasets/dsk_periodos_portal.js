function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
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
        // newDataset.addRow(new Array('Tabela: ' + tPeriodos));


        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select 1 from " + tPeriodos + " sc " +
            "	join documento dc on(dc.cod_empresa = sc.companyid " +
            "                    and dc.nr_documento = sc.documentid " +
            "                    and dc.nr_versao = sc.version  " +
            "                    and dc.versao_ativa = 1) " +
            "where  STR_TO_DATE(sc.dt_inicio, '%Y-%m-%d') <= '" + listaConstraits['dtInicio'] + "' or STR_TO_DATE(sc.dt_fim, '%Y-%m-%d') >= '" + listaConstraits['dtFIm'] + "'";
        statementWD = connectionWD.prepareStatement(SQL);
        var rsWDAgenda = statementWD.executeQuery();
        while (rsWDAgenda.next()) {
            wRetorno = true;
        }

        newDataset.addRow(new Array(wRetorno));

    } catch (error) {
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
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