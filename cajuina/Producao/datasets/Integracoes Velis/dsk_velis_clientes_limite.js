var debug = true;
function defineStructure() {
    // addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Clientes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        var listaConstraits = {};
        listaConstraits['cliente'] = "";
        listaConstraits['atualizacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }
        // listaConstraits['cliente'] = "038204469000115";
        // listaConstraits['atualizacao'] = "S";
        if (listaConstraits['cliente'] != '') {
            f_integrar(newDataset, listaConstraits['cliente']);
        } else if (listaConstraits['atualizacao'] != '') {
            f_integrar(newDataset, '', listaConstraits['atualizacao']);
        } else {
            f_integrar(newDataset);
        }


    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset, pCodCliente, pIndAtualizacao) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var wCLientes = [];
        var wRetGlobal = "";

        if (pCodCliente != undefined && pCodCliente != '') {
            var SQL = "select max (rownum) rn, json_arrayagg ( ";
            SQL += "        json_object( ";
            SQL += "            key 'idErp' value cod_cliente, ";
            SQL += "            key 'creditLimit' value LIMITECREDITO, ";
            SQL += "            key 'creditLimitUsed' value limiteusado)  ";
            SQL += "    format json returning clob   ) as json_doc   ";
            SQL += "from KBT_V_LIMITE_CREDITO   ";
            SQL += " where cod_cliente = '" + pCodCliente + "' ";

            var statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                wCLientes = JSON.parse(rsWD.getString("json_doc"));
            }


        } else {

            var SQL2 = " select kbt.cod_cliente, kbt.limitecredito, kbt.limiteusado from KBT_V_LIMITE_CREDITO kbt";
            SQL2 += "  where exists (select 1 from caj_velis_integracao where sincronizado = 'N' and status is null and cadastro = 'limite' and cliente = kbt.cod_cliente)";

            statementWD = connectionWD.prepareStatement(SQL2);
            var rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                var data = {
                    idErp: rsWD.getString("cod_cliente"),
                    creditLimit: parseFloat(rsWD.getString("limitecredito")),
                    creditLimitUsed: parseFloat(rsWD.getString("limiteusado"))
                }
                wCLientes.push(data);
            }

        }


        // newDataset.addRow(new Array('Total Registros: ' + wCLientes.length));
        // newDataset.addRow(new Array('JSON: ' + gson.toJson(wCLientes)));

        if (wCLientes.length > 0) {
            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    var retorno = f_getDadosVelis(wAPI[i].EMRPESA, wCLientes, newDataset, 'S');
                    // newDataset.addRow(new Array('Retorno: ' + retorno));
                    // // wRetGlobal = gson.toJson(retorno);
                    // wRetGlobal = gson.toJson(retorno);
                }
            }
        }

        newDataset.addRow(new Array(true, gson.toJson(wCLientes)));

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

function f_gravaIntegracao(pCodEmpresa, pCodCliente, pRetorno, pDataset) {

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        if (pRetorno.id != undefined) {
            // pDataset.addRow(new Array("OK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));

            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','CLIENTES','" + pRetorno.id + "','" + gson.toJson(pRetorno) + "')";
        } else {
            // pDataset.addRow(new Array("NOK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));
            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','CLIENTES','-99','" + gson.toJson(pRetorno) + "')";
        }




        var statementWD = connectionWD.prepareStatement(sqlUPD);
        statementWD.executeUpdate();
    } catch (error) {

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }


}

function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset) {
    try {
        var retorno = null;
        var metodo = "POST";
        var wServiceCode = pServiceCode;
        var params = {};
        var Endpoint = '/api/customers/credit-limit?api_key=' + pAPIKey;
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
            // pDataset.addRow(new Array("data " + gson.toJson(pJson)));

            var jr = 'NOK'
            retorno = jr;

        } else {
            var jr = 'OK'
            retorno = jr;
        }

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
                            empresa: pCodEmpresa,
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