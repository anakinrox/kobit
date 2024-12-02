var debug = false;
function defineStructure() {

}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Portifolio START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        f_integrar(newDataset);


    } catch (error) {

    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Portifolio START ##");
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

        // listaConstraits['cliente'] = "002873000000121";
        // listaConstraits['representante'] = "145";

        if (listaConstraits['representante'] != '') {
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



        var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        if (wAPI != null) {
            for (var i = 0; i < wAPI.length; i++) {
                var wRepres = [];
                var SQL = "select ";
                SQL += "     cRep.empresa, ";
                SQL += "     cRep.cod_repres ";
                SQL += " from CAJ_AFV_REPRES_EMPRESA cRep  ";
                SQL += "     inner join REPRESENTANTE rep on(rep.COD_REPRES = cRep.COD_REPRES) ";
                SQL += "         and(rep.ies_situacao = 'N')  ";
                SQL += " where cRep.empresa = '" + wAPI[i].EMRPESA + "' ";
                if (pCodRepres != undefined) {
                    SQL += " and cRep.cod_repres = '" + pCodRepres + "'";
                }

                var statementWD = connectionWD.prepareStatement(SQL);
                rsWD = statementWD.executeQuery();
                while (rsWD.next()) {

                    if (pCodCliente == undefined || pCodCliente == '') {
                        var wClientes = [];

                        var SQL = "select ";
                        SQL += "     cl.IES_NIVEL, ";
                        SQL += "     cl.COD_NIVEL_1, ";
                        SQL += "     cl.COD_NIVEL_2, ";
                        SQL += "     cl.COD_NIVEL_3, ";
                        SQL += "     cl.COD_NIVEL_4, ";
                        SQL += "     cl.COD_NIVEL_5, ";
                        SQL += "     cl.COD_NIVEL_6, ";
                        SQL += "     cl.COD_CLIENTE ";
                        SQL += " from CLI_CANAL_VENDA cl  ";
                        SQL += "     inner join clientes c on(c.cod_cliente = cl.cod_cliente) ";
                        SQL += "         and(c.cod_tip_cli not in ('98', '99')) ";
                        SQL += "         and(c.ies_situacao in ('A', 'S')) ";
                        SQL += " where cl.cod_nivel_3 = ' " + rsWD.getString("cod_repres").trim() + "'";
                        SQL += " And(cl.COD_TIP_CARTEIRA = '01') "

                        var statementWD2 = connectionWD.prepareStatement(SQL);
                        var rsWD2 = statementWD2.executeQuery();

                        while (rsWD2.next()) {
                            wClientes.push(rsWD2.getString("cod_cliente").trim());
                        }

                        if (rsWD2 != null) rsWD2.close();
                        if (statementWD2 != null) statementWD2.close();


                        var data = {
                            salesmanIdErp: rsWD.getString("cod_repres").trim(),
                            customerIdsErp: wClientes
                        }

                        wRepres.push(data);

                        // newDataset.addRow(new Array('Total: ', wClientes.length));
                        // printLog('info', 'JSON Portifolio: ' + gson.toJson(data));
                        var retorno = f_getDadosVelis(wAPI[i].EMRPESA, wRepres, newDataset, 'S', 'G');
                        if (pCodRepres != undefined) {
                            var wStatus = true;
                            if (!retorno.status) {
                                wStatus = false;
                            }
                            newDataset.addRow(new Array(wStatus, gson.toJson(retorno)));
                        }

                    } else {
                        var data = {
                            codRepres: rsWD.getString("cod_repres").trim(),
                            codCliente: pCodCliente
                        }

                        var retorno = f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S', 'I');
                        if (pCodCliente != undefined) {
                            var wStatus = true;
                            if (!retorno.status) {
                                wStatus = false;
                            }
                            newDataset.addRow(new Array(wStatus, gson.toJson(retorno)));
                        }
                    }
                }

                if (pCodCliente == undefined || pCodRepres == undefined) {
                    newDataset.addRow(new Array(true, mensagem));
                }
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

function f_gravaIntegracao(pCodEmpresa, pCodCliente, pRetorno, pDataset) {

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        if (pRetorno.salesmanId != undefined) {
            // pDataset.addRow(new Array("OK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));

            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','PORTIFOLIO','" + pRetorno.salesmanId + "','" + gson.toJson(pRetorno) + "')";
        } else {
            // pDataset.addRow(new Array("NOK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));
            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','PORTIFOLIO','-99','" + gson.toJson(pRetorno) + "')";
        }




        var statementWD = connectionWD.prepareStatement(sqlUPD);
        statementWD.executeUpdate();
    } catch (error) {

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }


}

function onMobileSync(user) {

}


function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset, pAPI) {
    var retorno = null;
    var metodo;
    var Endpoint;
    var wServiceCode = pServiceCode;
    var params = {};
    if (pAPI == undefined) {
        metodo = "POST";
        Endpoint = '/api/portfolio/erp/json/?api_key=' + pAPIKey;
    } else {
        metodo = "PUT";
        Endpoint = '/api/portfolio/erp/' + pJson.codRepres + '/' + pJson.codCliente + '?api_key=' + pAPIKey;
    }
    // pDataset.addRow(new Array("Endpoint " + Endpoint));
    // return false;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };



    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    var options = {};
    options["encoding"] = "UTF-8";
    options["mediaType"] = "application/json";
    data["options"] = options;
    data["headers"] = headers;

    if (pAPI == undefined) {
        params = gson.toJson(pJson);
        data["strParams"] = params;
    }

    var jj = gson.toJson(data);

    printLog('info', 'JSON Portifolio: ' + gson.toJson(params));

    var vo = clientService.invoke(jj);
    if (vo.httpStatusResult != "200") {
        var jr2 = JSON.parse(vo.getResult());
        // pDataset.addRow(new Array("data " + gson.toJson(pJson)));

        // pDataset.addRow(new Array("jr " + gson.toJson(jr2)));
        var data = {
            status: 'NOK',
            mensagem: jr2
        }

        retorno = data;

    } else {

        var data = {
            status: 'OK',
            mensagem: ''
        }

        retorno = data;
    }
    return retorno;
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

function f_getDadosVelis(pCodEmpresa, pData, Ddataset, pIndAcao, pAPI) {
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
            for (var i = 0; i < dataset.rowsCount; i++) {
                if (pIndAcao == 'S') {

                    if (pAPI == 'G') {
                        // Ddataset.addRow(new Array('GERAL'));
                        var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData, Ddataset);
                        var data = {
                            status: true,
                            empresa: pCodEmpresa,
                            retorno: retorno
                        }
                        // Ddataset.addRow(new Array(gson.toJson(data)));
                        f_gravaIntegracao(pCodEmpresa, pData.customerId, retorno, Ddataset)
                    }

                    if (pAPI == 'I') {
                        // Ddataset.addRow(new Array('Individual'));
                        var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData, Ddataset, pAPI);
                        var data = {
                            status: true,
                            empresa: pCodEmpresa,
                            retorno: retorno
                        }
                        // Ddataset.addRow(new Array(gson.toJson(data)));
                    }

                    wRetorno = data;
                } else {
                    var data = {
                        EMRPESA: dataset.getValue(i, "cod_empresa"),
                        SERVICO: dataset.getValue(i, "nom_servico"),
                        API_KEY: dataset.getValue(i, "api_key")
                    }

                    wEmpresa.push(data);
                }
            }
            if (pIndAcao == 'N') {
                wRetorno = wEmpresa;
            }

        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}