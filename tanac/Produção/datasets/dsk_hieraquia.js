var debug = false;
function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

    try {
        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";
        listaConstraits['codchefe'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }


        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'HE';
            listaConstraits['filtro'] = 'FUNC';
            listaConstraits['codgestor'] = '0000131962';

            listaConstraits['empresa'] = '';
            listaConstraits['filial'] = '';
            listaConstraits['secao'] = '';
            listaConstraits['departamento'] = '';
            listaConstraits['funcao'] = '';
            listaConstraits['situacao'] = 'A';

        }


        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/APP_RM");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        if (listaConstraits['indacao'] == 'PS') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('nome');

            var SQL = "select chapa, nome from kbt_v_coordenadores";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(new Array(
                    rsWD.getString("chapa") + "",
                    rsWD.getString("nome") + ""
                ));
            }

            if (rsWD != null) rsWD.close();
        }

        if (listaConstraits['indacao'] == 'ZO') {
            var SQLCompl = '';
            newDataset.addColumn('codigo');
            newDataset.addColumn('nome');

            if (listaConstraits['filtro'] == '02') { // Presidente
                SQLCompl = ' CODCHEFE_N2 as codigo, NOMECHEFE_N2 as nome '
            }
            if (listaConstraits['filtro'] == '03') { // Diretor
                SQLCompl = ' CODCHEFE_N3 as codigo, NOMECHEFE_N3 as nome '
            }
            if (listaConstraits['filtro'] == '04') { // Gerente
                SQLCompl = ' CODCHEFE_N4 as codigo, NOMECHEFE_N4 as nome '
            }
            if (listaConstraits['filtro'] == '06') { // Coordenador
                SQLCompl = ' CODCHEFE_N6 as codigo, NOMECHEFE_N6 as nome '
            }

            if (listaConstraits['filtro'] == 'EMP') { // Coordenador
                SQLCompl = ' NOMEEMPRESA as codigo, NOMEEMPRESA as nome '
            }

            if (listaConstraits['filtro'] == 'FIL') { // Coordenador
                SQLCompl = ' NOMEFANTASIA as codigo, NOMEFANTASIA as nome '
            }

            if (listaConstraits['filtro'] == 'SES') { // Coordenador
                SQLCompl = ' CODSECAO as codigo, NOME_SECAO as nome '
            }

            if (listaConstraits['filtro'] == 'DEP') { // Coordenador
                SQLCompl = ' DEPARTAMENTO as codigo, DEPARTAMENTO as nome '
            }

            if (listaConstraits['filtro'] == 'FUNC') { // Coordenador
                SQLCompl = ' CODFUNCAO as codigo, NOMEFUNCAO as nome '
            }

            var SQL = "select distinct " + SQLCompl + " from eis_v_func_nivel_chefia";
            // var SQL = "select * from eis_v_func_nivel_chefia where CODCHEFE_N3 = '0000111104' and eh_demitido = 'N'";
            // var SQL = "select * from eis_v_func_nivel_chefia_imediata where CODCHEFE_N4 = '0000111104' and eh_demitido = 'N'";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("codigo") + "",
                    rsWD.getString("nome") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }

        if (listaConstraits['indacao'] == 'HE') {
            var SQLWhere = '';

            newDataset.addColumn('filial');
            newDataset.addColumn('chapa');
            newDataset.addColumn('nome');
            newDataset.addColumn('funcao');
            newDataset.addColumn('situacao');
            newDataset.addColumn('dataadmissao');
            newDataset.addColumn('codequipe');
            newDataset.addColumn('denequipe');
            newDataset.addColumn('codsecao');
            newDataset.addColumn('sessao');
            newDataset.addColumn('chefeimadiato1');
            newDataset.addColumn('chefeimadiato2');
            newDataset.addColumn('chefeimadiato3');
            newDataset.addColumn('chefeimadiato4');

            if (listaConstraits['codgestor'] != '') {
                SQLWhere = " and (CODCHEFEIMEDIATO1 = '" + listaConstraits['codgestor'] + "' ";
                SQLWhere += " or CODCHEFEIMEDIATO2 = '" + listaConstraits['codgestor'] + "' ";
                SQLWhere += " or CODCHEFEIMEDIATO3 = '" + listaConstraits['codgestor'] + "' ";
                SQLWhere += " or  CODCHEFEIMEDIATO4 = '" + listaConstraits['codgestor'] + "') ";
            }

            if (listaConstraits['empresa'] != '') {
                SQLWhere += " and NOMEEMPRESA ='" + listaConstraits['empresa'] + "' ";
            }

            if (listaConstraits['filial'] != '') {
                SQLWhere += " and NOMEFANTASIA ='" + listaConstraits['filial'] + "' ";
            }

            if (listaConstraits['secao'] != '') {
                SQLWhere += " and CODSECAO ='" + listaConstraits['secao'] + "' ";
            }

            if (listaConstraits['departamento'] != '') {
                SQLWhere += " and DEPARTAMENTO ='" + listaConstraits['departamento'] + "' ";
            }

            if (listaConstraits['funcao'] != '') {
                SQLWhere += " and CODFUNCAO ='" + listaConstraits['funcao'] + "' ";
            }

            if (listaConstraits['situacao'] == 'D') {
                SQLWhere += " and DATADEMISSAO is not null";
            }

            if (listaConstraits['situacao'] == 'A') {
                SQLWhere += " and DATADEMISSAO is null";
            }



            SQLWhere += " order by NOMECHEFE_N1, NOMECHEFE_N2, NOMECHEFE_N3, NOMECHEFE_N4, NOMECHEFE_N5, NOMECHEFE_N6, nivel";
            var SQL = "select * from eis_v_func_nivel_chefia_imediata_full where 1=1 " + SQLWhere;
            // newDataset.addRow(new Array('SQL: ' + SQL))
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("CODFILIAL") + "",
                    rsWD.getString("CHAPA") + "",
                    rsWD.getString("NOME") + "",
                    rsWD.getString("NOMEFUNCAO") + "",
                    rsWD.getString("CODSITUACAO") + "",
                    rsWD.getString("DATAADMISSAO") + "",
                    rsWD.getString("CODEQUIPE") + "",
                    rsWD.getString("DENEQUIPE") + "",
                    rsWD.getString("CODSECAO") + "",
                    rsWD.getString("NOME_SECAO") + "",
                    rsWD.getString("NOMECHEFEIMEDIATO1") + "",
                    rsWD.getString("NOMECHEFEIMEDIATO2") + "",
                    rsWD.getString("NOMECHEFEIMEDIATO3") + "",
                    rsWD.getString("NOMECHEFEIMEDIATO4") + ""
                ));
            }
            if (rsWD != null) rsWD.close();


        }


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
