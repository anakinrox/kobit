function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("error", "#### DataSet Stop Meta ####")
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['ind_acao'] = "";
    listaConstraits['area'] = "";
    listaConstraits['cargo'] = "";
    listaConstraits['usuario'] = "";
    listaConstraits['ano'] = "";
    listaConstraits['mes01'] = "";
    listaConstraits['mes02'] = "";
    listaConstraits['mes03'] = "";
    listaConstraits['mes04'] = "";
    listaConstraits['mes05'] = "";
    listaConstraits['mes06'] = "";
    listaConstraits['mes07'] = "";
    listaConstraits['mes08'] = "";
    listaConstraits['mes09'] = "";
    listaConstraits['mes10'] = "";
    listaConstraits['mes11'] = "";
    listaConstraits['mes12'] = "";
    listaConstraits['matricula'] = "";


    var params = {};

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }


    if (listaConstraits['ind_acao'] == '') {
        listaConstraits['ind_acao'] = 'C';

        listaConstraits['area'] = "COM";
        listaConstraits['cargo'] = "PRESIDENTE";
        listaConstraits['usuario'] = "";
        listaConstraits['ano'] = "2022";
        listaConstraits['mes01'] = "1";
        listaConstraits['mes02'] = "1";
        listaConstraits['mes03'] = "1";
        listaConstraits['mes04'] = "1";
        listaConstraits['mes05'] = "1";
        listaConstraits['mes06'] = "1";
        listaConstraits['mes07'] = "1";
        listaConstraits['mes08'] = "1";
        listaConstraits['mes09'] = "1";
        listaConstraits['mes10'] = "1";
        listaConstraits['mes11'] = "1";
        listaConstraits['mes12'] = "1";
        listaConstraits['matricula'] = "marcio.kobit";
    }

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        var connectionWD = dataSourceWD.getConnection();

        if (listaConstraits['ind_acao'] == 'C') {

            //Define colunas de retorno.
            newDataset.addColumn('CARGO');
            newDataset.addColumn('AREA');
            newDataset.addColumn('USUARIO');
            newDataset.addColumn('ANO');
            newDataset.addColumn('MES01');
            newDataset.addColumn('MES02');
            newDataset.addColumn('MES03');
            newDataset.addColumn('MES04');
            newDataset.addColumn('MES05');
            newDataset.addColumn('MES06');
            newDataset.addColumn('MES07');
            newDataset.addColumn('MES08');
            newDataset.addColumn('MES09');
            newDataset.addColumn('MES10');
            newDataset.addColumn('MES11');
            newDataset.addColumn('MES12');
            newDataset.addColumn('ATUALIZADO');

            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            var SQL = "select *, FORMAT (dat_atualizacao, 'dd/MM/20222') as DAT_ATUALI from TIM_STOP_METAS where IND_ATIVO  = 'S' ";

            if (listaConstraits['area'] != "") {
                SQL += " and AREA = '" + listaConstraits['area'] + "'";
            }

            if (listaConstraits['cargo'] != "") {
                SQL += " and CARGO = '" + listaConstraits['cargo'] + "'";
            }

            if (listaConstraits['usuario'] != "") {
                SQL += " and LOGIN = '" + listaConstraits['usuario'] + "'";
            }

            if (listaConstraits['ano'] != "") {
                SQL += " and ANO_VIGENCIA = '" + listaConstraits['ano'] + "'";
            }

            printLog("info", "Comando SQL: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(
                    new Array(
                        rsWD.getString("CARGO") + "",
                        rsWD.getString("AREA") + "",
                        rsWD.getString("LOGIN") + "",
                        rsWD.getString("ANO_VIGENCIA") + "",
                        rsWD.getString("META_01") + "",
                        rsWD.getString("META_02") + "",
                        rsWD.getString("META_03") + "",
                        rsWD.getString("META_04") + "",
                        rsWD.getString("META_05") + "",
                        rsWD.getString("META_06") + "",
                        rsWD.getString("META_07") + "",
                        rsWD.getString("META_08") + "",
                        rsWD.getString("META_09") + "",
                        rsWD.getString("META_10") + "",
                        rsWD.getString("META_11") + "",
                        rsWD.getString("META_12") + "",
                        rsWD.getString("DAT_ATUALI") + ""
                    ));
            }


        }

        if (listaConstraits['ind_acao'] == 'R') {

            newDataset.addColumn('STATUS');

            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            // var SQL = "delete from TIM_STOP_METAS where ANO_VIGENCIA = " + anoAtual;
            // SQL += " and LOGIN = '" + listaConstraits['usuario'] + "'";
            // SQL += " and AREA = '" + listaConstraits['area'] + "' and CARGO = '" + listaConstraits['cargo'] + "'";


            var SQL = "UPDATE TIM_STOP_METAS SET IND_ATIVO = 'N'  where ANO_VIGENCIA = " + listaConstraits['ano'];
            SQL += " and LOGIN = '" + listaConstraits['usuario'] + "'";
            SQL += " and AREA = '" + listaConstraits['area'] + "' and CARGO = '" + listaConstraits['cargo'] + "' and IND_ATIVO = 'S'";

            printLog("info", "Comando SQL: " + SQL);
            try {
                var statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();

                newDataset.addRow(
                    new Array(
                        "OK"
                    ));
            } catch (error) {
                newDataset.addRow(
                    new Array(
                        "NOK"
                    ));
            }

        }

        if (listaConstraits['ind_acao'] == 'I') {
            newDataset.addColumn('STATUS');

            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            var nomCargo = "";
            var nomArea = "";
            var nomUsuario = "";
            var ano = "";
            var mes01 = "";
            var mes02 = "";
            var mes03 = "";
            var mes04 = "";
            var mes05 = "";
            var mes06 = "";
            var mes07 = "";
            var mes08 = "";
            var mes09 = "";
            var mes10 = "";
            var mes11 = "";
            var mes12 = "";
            var dat_atualizacao;
            var matricula = "";



            if (listaConstraits['usuario'] != "") {
                nomCargo = '';
                nomArea = '';
                nomUsuario = listaConstraits['usuario'];
            } else {
                nomCargo = listaConstraits['cargo'];
                nomArea = listaConstraits['area'];
                nomUsuario = '';
            }

            if (listaConstraits['ano'] != null) {
                ano = listaConstraits['ano'];
            } else {
                ano = 0;
            }

            if (listaConstraits['mes01'] != null) {
                mes01 = listaConstraits['mes01'];
            } else {
                mes01 = 0;
            }

            if (listaConstraits['mes02'] != null) {
                mes02 = listaConstraits['mes02'];
            } else {
                mes02 = 0;
            }
            if (listaConstraits['mes03'] != null) {
                mes03 = listaConstraits['mes03'];
            } else {
                mes03 = 0;
            }
            if (listaConstraits['mes04'] != null) {
                mes04 = listaConstraits['mes04'];
            } else {
                mes04 = 0;
            }
            if (listaConstraits['mes05'] != null) {
                mes05 = listaConstraits['mes05'];
            } else {
                mes05 = 0;
            }
            if (listaConstraits['mes06'] != null) {
                mes06 = listaConstraits['mes06'];
            } else {
                mes06 = 0;
            }
            if (listaConstraits['mes07'] != null) {
                mes07 = listaConstraits['mes07'];
            } else {
                mes07 = 0;
            }
            if (listaConstraits['mes08'] != null) {
                mes08 = listaConstraits['mes08'];
            } else {
                mes08 = 0;
            }
            if (listaConstraits['mes09'] != null) {
                mes09 = listaConstraits['mes09'];
            } else {
                mes09 = 0;
            }
            if (listaConstraits['mes10'] != null) {
                mes10 = listaConstraits['mes10'];
            } else {
                mes10 = 0;
            }
            if (listaConstraits['mes11'] != null) {
                mes11 = listaConstraits['mes11'];
            } else {
                mes11 = 0;
            }
            if (listaConstraits['mes12'] != null) {
                mes12 = listaConstraits['mes12'];
            } else {
                mes12 = 0;
            }

            dat_atualizacao = frmDataSQL(hoje);
            matricula = listaConstraits['matricula'];


            var SQL = "UPDATE TIM_STOP_METAS SET IND_ATIVO = 'N' where IND_ATIVO = 'S' and CARGO = '" + nomCargo + "' and AREA = '" + nomArea + "' and LOGIN = '" + nomUsuario + "'"


            // var SQL = "delete TIM_STOP_METAS where CARGO = '" + nomCargo + "' and AREA = '" + nomArea + "' and LOGIN = '" + nomUsuario + "'";
            var statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();
            printLog("info", "Comando SQL: " + SQL);


            var SQL = "INSERT INTO TIM_STOP_METAS  (CARGO, AREA, LOGIN, ";
            SQL += "  META_01, META_02, META_03, META_04, META_05, META_06, META_07, META_08, META_09, META_10, META_11, META_12, DAT_ATUALIZACAO, MATRICULA, ANO_VIGENCIA, IND_ATIVO)";
            SQL += " VALUES('" + nomCargo + "','" + nomArea + "','" + nomUsuario + "'," + mes01 + ", " + mes02 + "," + mes03 + "," + mes04 + ", " + mes05 + ", " + mes06 + ", ";
            SQL += mes07 + "," + mes08 + ", " + mes09 + ", " + mes10 + ", " + mes11 + ", " + mes12 + ", " + dataAtualFormatada() + ", '" + matricula + "', " + anoAtual + ",'S')";


            try {
                var statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();
                newDataset.addRow(
                    new Array(
                        "OK"
                    ));
            } catch (error) {

                newDataset.addRow(
                    new Array(
                        "NOK"
                    ));
            }



            printLog("info", "Comando SQL: " + SQL)
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

function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}

function frmDataSQL(data) {
    // log.info('frmDataSQL........' + data)
    var valor = isnull(data, "");
    if (valor == null || valor == undefined || valor == "null" || valor == "") {
        return null;
    } else {
        return "'" + valor + "'";
    }
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return "'" + anoF + "-" + mesF + "-" + diaF + "'";
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