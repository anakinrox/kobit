var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Atualizacoes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Atualizacoes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset) {
    try {

        var rsWD = null;
        var connectionWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var wDdata = new Date();
        var diaSemana = wDdata.getDay() + 1;
        var wCheckDiaSemana = false;
        var wHoraAgora = wDdata.getHours() + '.' + wDdata.getMinutes();



        var SQL = "select * from PERIOD_EXPED where cod_period_exped = 'Velis' and num_dia_period = " + diaSemana + " and num_hora_inic_period <= " + (wHoraAgora * 3600) + " and num_hora_fim_period >= " + (wHoraAgora * 3600);
        // newDataset.addRow(new Array("SQL: " + SQL));
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wCheckDiaSemana = true;

        }

        // newDataset.addRow(new Array("wCheckDiaSemana: " + wCheckDiaSemana));

        // return false;

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();



        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        if (wCheckDiaSemana) {
            var SQL = "SELECT dataset, intervalo, unidade, to_char(ultimo, 'yyyy/mm/dd hh24:mi') as ultimo, '2023/01/01 ' ||to_char(ultimo, 'hh24:mi:ss') as ultimoHora, status FROM KBT_T_AGENDAMENTO_VELIS where (status not in ('E','P') or status is null)  ";
            // var SQL = "SELECT dataset, intervalo, unidade, to_char(ultimo, 'yyyy/mm/dd hh24:mi') as ultimo, '2023/01/01 ' ||to_char(ultimo, 'hh24:mi:ss') as ultimoHora, status FROM KBT_T_AGENDAMENTO_VELIS where dataset = 'dsk_velis_produtos_pgto'  ";
            var statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {


                if (rsWD.getString("status") == null) {
                    var dataAgora = new Date(f_formatData("DT", "I"));
                    f_disparaDataset(rsWD.getString("dataset"), newDataset, dataAgora);
                } else {
                    newDataset.addRow(new Array('dataset: ' + rsWD.getString("dataset").trim()));
                    if (rsWD.getString("unidade").trim() == "D") {

                        var dataBanco = f_proximoDispara(rsWD.getString('ultimo'), rsWD.getString('intervalo'), rsWD.getString('unidade'), newDataset);
                        var dataAgora = new Date(f_formatData("DT", "I"));

                        if (dataBanco.getTime() <= dataAgora.getTime()) {
                            f_disparaDataset(rsWD.getString("dataset"), newDataset, dataAgora);

                        }
                    } else {
                        var dataBanco = f_proximoDispara(rsWD.getString('ultimo'), rsWD.getString('intervalo'), rsWD.getString('unidade'), newDataset);
                        var dataAgora = new Date(f_formatData("DT", "I"));
                        // newDataset.addRow(new Array("Banco: " + dataBanco + " - Agora: " + dataAgora));

                        if (dataBanco.getTime() <= dataAgora.getTime()) {
                            f_disparaDataset(rsWD.getString("dataset"), newDataset, dataAgora);
                        }
                    }
                }

            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}



function f_disparaDataset(pNomeDataSet, newDataset, pInicio) {

    try {
        var constraints = new Array();
        f_atualizarRegistro(pNomeDataSet, 'E', newDataset, 0);

        var dataset = DatasetFactory.getDataset(pNomeDataSet, null, constraints, null);
        if (dataset != null) {
            for (var i = 0; i < dataset.rowsCount; i++) {
                var dataFim = new Date(f_formatData("DT", "I"));
                if (dataset.getValue(i, "retorno") == true) {
                    f_atualizarRegistro(pNomeDataSet, 'C', newDataset, (dataFim.getTime() - pInicio.getTime()));
                } else {
                    f_atualizarRegistro(pNomeDataSet, 'F', newDataset, (dataFim.getTime() - pInicio.getTime()));
                }
            }
        }
    } catch (error) {
        newDataset.addRow(new Array('Erro Disparo: ' + error));
        f_atualizarRegistro(pNomeDataSet, 'F', newDataset);
    }
}

function onMobileSync(user) {
}

function f_atualizarRegistro(pDataSet, pStatus, pDataset, pTempo) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var rsWD = null;
        var wAchou = false;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        var sqlUPD;

        if (pStatus == 'C') { sqlUPD = "update KBT_T_AGENDAMENTO_VELIS set ultimo = to_char(sysdate, 'dd/mm/yyyy hh24:mi:ss'), status = '" + pStatus + "', tempo = " + pTempo + " where dataset = '" + pDataSet + "'"; }
        if (pStatus == 'E' || pStatus == 'F') { sqlUPD = "update KBT_T_AGENDAMENTO_VELIS set status = '" + pStatus + "' where dataset = '" + pDataSet + "'"; }
        // pDataset.addRow(new Array("SQL: " + sqlUPD));
        statementWD = connectionWD.prepareStatement(sqlUPD);
        statementWD.executeUpdate();


    } catch (error) {
        pDataset.addRow(new Array("Erro Atu: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
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

function f_formatData(indRetorno, formato, data) {
    var datFormatado = '';

    if (data != undefined) {
        var dtRegistro = new Date(data);
    } else {
        var dtRegistro = new Date();
    }

    var dia = (dtRegistro.getDate()),
        diaF = (dia.toString().length == 1) ? '0' + dia : dia,
        mes = (dtRegistro.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.toString().length == 1) ? '0' + mes : mes,
        anoF = dtRegistro.getFullYear(),
        hora = (dtRegistro.getHours().toString().length == 1) ? '0' + dtRegistro.getHours() : dtRegistro.getHours(),
        minuto = (dtRegistro.getMinutes().toString().length == 1) ? '0' + dtRegistro.getMinutes() : dtRegistro.getMinutes(),
        segundos = (dtRegistro.getUTCSeconds().toString().length == 1) ? '0' + dtRegistro.getUTCSeconds() : dtRegistro.getUTCSeconds();

    if (indRetorno == undefined || indRetorno == 'D') {
        if (formato == undefined) {
            datFormatado = diaF + "/" + mesF + "/" + anoF;
        } else {
            datFormatado = anoF + "/" + mesF + "/" + diaF;
        }
    }

    if (indRetorno != undefined && indRetorno == 'DT') {
        if (formato == undefined) {
            datFormatado = diaF + "/" + mesF + "/" + anoF + ' ' + hora + ':' + minuto + ':00';
        } else {
            datFormatado = anoF + "/" + mesF + "/" + diaF + ' ' + hora + ':' + minuto + ':00';
        }
    }

    if (indRetorno != undefined && indRetorno == 'T') {
        if (formato == undefined) {
            datFormatado = "01/01/2023 " + hora + ':' + minuto + ':00';
        } else {
            datFormatado = "2023/01/01 " + hora + ':' + minuto + ':00';
        }
    }

    return datFormatado;
}

function f_proximoDispara(pData, indAdicao, unidade, newDataset) {
    var wRetorno = "";
    // alert("1 - " + data);
    try {
        if (pData != "" && pData != null) {
            var dtRegistro = new Date(pData);
            // wRetorno = dtRegistro;

            // alert("2 - " + dtRegistro);

            if (unidade == "D") {
                var ldata = dtRegistro.getDate() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setDate(ldata));
                // alert(wRetorno);
            }

            if (unidade == "H") {
                var ldata = dtRegistro.getHours() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setHours(ldata));
            }

            if (unidade == "M") {
                var ldata = dtRegistro.getUTCMinutes() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setUTCMinutes(ldata));
            }
        }
    } catch (error) {
        newDataset.addRow(new Array('Deu Erro: ' + error));
    }

    return wRetorno;
}