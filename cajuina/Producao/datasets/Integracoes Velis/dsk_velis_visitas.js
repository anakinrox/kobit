var debug = true;
function defineStructure() {
    // addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Visitas START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        var listaConstraits = {};
        listaConstraits['cliente'] = "";
        listaConstraits['representante'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        // listaConstraits['representante'] = "167";
        // listaConstraits['cliente'] = "007027378000128";

        if (listaConstraits['cliente'] != '' || listaConstraits['representante'] != '') {
            f_integrar(newDataset, listaConstraits['representante'], listaConstraits['cliente']);
        } else {
            f_integrar(newDataset);
        }

    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset, pCodRepres, pCodCliente) {
    try {

        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var mensagem = '';



        var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        if (wAPI != null) {
            for (var i = 0; i < wAPI.length; i++) {

                var SQL = "select ";
                SQL += "     cRep.empresa, ";
                SQL += "     cRep.cod_repres ";
                SQL += " from CAJ_AFV_REPRES_EMPRESA cRep  ";
                SQL += "     inner join REPRESENTANTE rep on(rep.COD_REPRES = cRep.COD_REPRES) ";
                SQL += "         and(rep.ies_situacao = 'N')  ";
                SQL += " where cRep.empresa = '" + wAPI[i].EMRPESA + "' ";
                if (pCodRepres != "" && pCodRepres != undefined) {
                    SQL += " and cRep.cod_repres = '" + pCodRepres + "'";
                }

                var statementWD = connectionWD.prepareStatement(SQL);
                rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    var wClientes = [];

                    var SQL = "select ";
                    SQL += "     cl.IES_NIVEL, ";
                    SQL += "     cl.COD_NIVEL_1, ";
                    SQL += "     cl.COD_NIVEL_2, ";
                    SQL += "     cl.COD_NIVEL_3, ";
                    SQL += "     cl.COD_NIVEL_4, ";
                    SQL += "     cl.COD_NIVEL_5, ";
                    SQL += "     cl.COD_NIVEL_6, ";
                    SQL += "     cl.COD_CLIENTE, ";
                    SQL += "     p.cod_praca ";
                    SQL += " from CLI_CANAL_VENDA cl  ";
                    SQL += "     inner join clientes c on(c.cod_cliente = cl.cod_cliente) ";
                    SQL += "         and(c.cod_tip_cli not in ('98', '99')) ";
                    if (pCodCliente == "" || pCodCliente == undefined) {
                        SQL += " and c.ies_situacao in ('A','S')";
                    } else {
                        SQL += " and c.cod_cliente = '" + pCodCliente + "' ";
                    }
                    SQL += "     inner join pracas p on (p.cod_praca = c.cod_praca) ";
                    SQL += " where cl.cod_nivel_3 = ' " + rsWD.getString("cod_repres").trim() + "'";
                    SQL += " And(cl.COD_TIP_CARTEIRA = '01') "
                    // SQL += " And rownum = 1 "
                    // printLog("info", 'SQL Visitas: ' + SQL);
                    var statementWD2 = connectionWD.prepareStatement(SQL);
                    var rsWD2 = statementWD2.executeQuery();

                    while (rsWD2.next()) {
                        if (rsWD2.getString("cod_praca") != '1') {


                            var data = {
                                contactName: "Cadastrar",
                                customerIdErp: rsWD2.getString("COD_CLIENTE").trim(),
                                daysOfWeek: rsWD2.getString("cod_praca").trim(),
                                end: dataAtualFormatada(7, "+", "", parseInt(rsWD2.getString("cod_praca") - 1), newDataset),
                                frequency: parseInt(2).toFixed(0),
                                id: null,
                                period: parseInt(1).toFixed(0),
                                salesmanIdErp: rsWD.getString("cod_repres").trim(),
                                start: dataAtualFormatada(0, "+", "", parseInt(rsWD2.getString("cod_praca") - 1), newDataset)
                            }

                            wClientes.push(data);
                        }
                    }

                    if (rsWD2 != null) rsWD2.close();
                    if (statementWD2 != null) statementWD2.close();



                    // printLog("info", 'JSON Visitas: ' + wAPI[i].EMRPESA + ' -  ' + gson.toJson(wClientes));
                    if (wClientes.length > 0) {
                        // printLog("info", 'JSON Visitas: ' + wAPI[i].EMRPESA + ' -  ' + gson.toJson(wClientes));
                        // newDataset.addRow(new Array('Total: ', wClientes.length + ' - Empresa: ' + wAPI[i].EMRPESA));
                        // newDataset.addRow(new Array('JSON Visitas: ' + wAPI[i].EMRPESA + ' -  ' + gson.toJson(wClientes)));
                        var retorno = f_getDadosVelis(wAPI[i].EMRPESA, wClientes, newDataset, 'S');
                        if (pCodRepres != undefined) {
                            var wStatus = true;
                            if (!retorno.status) {
                                wStatus = false;
                            }
                            newDataset.addRow(new Array(wStatus, gson.toJson(retorno)));
                        }
                    }
                }
            }

            if (pCodCliente == undefined && pCodRepres == undefined) {
                newDataset.addRow(new Array(true, mensagem));
            }
        }

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}

function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset) {
    try {
        var retorno = null;
        var metodo = "PUT";
        var wServiceCode = pServiceCode;
        var params = {};
        var Endpoint = '/api/visits?api_key=' + pAPIKey;
        var gson = new com.google.gson.Gson();

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: Endpoint,
            timeoutService: "240",
            method: metodo,
        };

        params = gson.toJson(pJson);

        var headers = {};
        headers["content-type"] = "application/json";
        headers["Accept"] = "application/json";

        data["headers"] = headers;
        data["strParams"] = params;

        var jj = gson.toJson(data)
        var vo = clientService.invoke(jj);

        if (vo.httpStatusResult != "200") {
            var jr = 'NOK'
            retorno = jr;

        } else {
            var jr = 'OK'
            retorno = jr;
        }

        return retorno;

    } catch (error) {
        pDataset.addRow(new Array("Erro f_enviaDados: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return retorno;
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

function f_getDadosVelis(pCodEmpresa, pData, Ddataset, pIndAcao) {
    try {
        var wRetorno = null;
        var gson = new com.google.gson.Gson();
        var wEmpresa = [];

        var constraints = new Array();
        if (pCodEmpresa != '' && pCodEmpresa != undefined) {
            constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
        }
        var dataset = DatasetFactory.getDataset("kbt_t_param_velis", null, constraints, null);
        if (dataset != null) {

            for (var u = 0; u < dataset.rowsCount; u++) {

                if (pIndAcao == 'S') {
                    try {
                        // f_gravaIntegracao(pCodEmpresa, pData.idErp, pData, Ddataset)
                        var retorno = f_enviaDados(dataset.getValue(u, "nom_servico"), dataset.getValue(u, "api_key"), pData, Ddataset);
                        var data = {
                            status: true,
                            empresa: pCodEmpresa,
                            retorno: retorno
                        }
                        // Ddataset.addRow(new Array(gson.toJson(data)));
                        wRetorno = data;
                    } catch (error) {
                        var data = {
                            status: false,
                            empresa: '',
                            retorno: error
                        }
                        wRetorno = data;
                    }

                } else {
                    var data = {
                        EMRPESA: dataset.getValue(u, "cod_empresa"),
                        SERVICO: dataset.getValue(u, "nom_servico"),
                        API_KEY: dataset.getValue(u, "api_key")
                    }

                    wEmpresa.push(data);
                }

            }
            if (pIndAcao == 'N') {
                wRetorno = wEmpresa;
            }

        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro f_getDadosVelis: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}

function dataAtualFormatada(pDias, pAcao, pData, pDiaSemanaAgenda, pDataset) {
    if (pData == undefined || pData == "") {
        var data = new Date();
    } else {
        var data = new Date(toISOFormat(pData));
    }

    if (pAcao != undefined && pAcao != '') {
        if (pAcao == '+') { data.setDate(data.getDate() + parseInt(pDias)); }
        if (pAcao == '-') { data.setDate(data.getDate() - parseInt(pDias)); }
    }

    // pDataset.addRow(new Array(false, "Vai chamar a funcao"));
    // if (pDataset != undefined) {
    data = f_diaSemana(data, pDiaSemanaAgenda, pDataset);
    // }

    var dia = data.getDate().toString();
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF + " 08:30:00";
}

function f_diaSemana(pData, pDiaSemanaAgenda, pDataset) {
    if (pData == "" || pData == undefined) {
        return false;
    }

    try {
        var wData = pData;
        var wDiaSemana = wData.getDay();

        while ((parseInt(wDiaSemana) - parseInt(pDiaSemanaAgenda)) != 0) {
            wData.setDate(wData.getDate() + 1);
            wDiaSemana = wData.getDay();
        }

        return wData;
    } catch (error) {
        pDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    }



}