var debug = false;
function defineStructure() {
    addColumn('status');
}


function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Duplicatas START ##");
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
        printLog("info", "## Integração Duplicatas START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

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
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var SQL = "select distinct ";
        SQL += "        doc.num_docum, ";
        SQL += "            doc.dat_emis, ";
        SQL += "            doc.dat_vencto_s_desc, ";
        SQL += "            doc.dat_prorrogada, ";
        SQL += "            doc.cod_cliente, ";
        SQL += "            doc.val_bruto, ";
        SQL += "            doc.val_saldo, ";
        SQL += "            doc.ies_situa_docum, ";
        SQL += "            doc.ies_pgto_docum, ";
        SQL += "            doc.dat_atualiz ";
        SQL += "from docum doc, par_tipo_docum tip, caj_velis_clientes cli ";
        SQL += "where doc.cod_empresa = tip.cod_empresa ";
        SQL += "  and doc.ies_tip_docum = tip.ies_tip_docum ";
        SQL += "  and cli.cod_cliente = doc.cod_cliente ";
        SQL += "  and tip.ies_emis_debito = 'S' ";
        SQL += "  and doc.ies_situa_docum <> 'C' ";
        SQL += "  and doc.ies_pgto_docum <> 'T' ";
        SQL += "  and doc.cod_empresa in ('03', '04', '08') ";


        var wDuplicatas = [];
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wDataVencimento = rsWD.getString("dat_vencto_s_desc");

            if (rsWD.getString("dat_prorrogada") != null) {
                wDataVencimento = rsWD.getString("dat_prorrogada");
            }

            var data = {
                accomplishedDate: null,
                customerId: null,
                customerIdErp: rsWD.getString("cod_cliente").trim(),
                document: rsWD.getString("num_docum").trim(),
                expirationDate: wDataVencimento,
                id: null,
                idErp: rsWD.getString("num_docum").trim(),
                issueDate: rsWD.getString("dat_emis"),
                paidValue: parseFloat((rsWD.getString("val_bruto") - rsWD.getString("val_saldo"))),
                rawValue: parseFloat(rsWD.getString("val_bruto")),
                salesOrderId: null
            }
            wDuplicatas.push(data)
            // newDataset.addRow(new Array("Loop : " + gson.toJson(data)));
        }
        printLog("info", "JSON Duplicatas: " + gson.toJson(wDuplicatas));

        if (wDuplicatas.length > 0) {
            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    newDataset.addRow(new Array("Enviado para empresa : " + wAPI[i].EMRPESA + ' JSON: ' + gson.toJson(wDuplicatas)));
                    f_getDadosVelis(wAPI[i].EMRPESA, wDuplicatas, newDataset, 'S');
                }
            }
        }

        newDataset.addRow(new Array(true, ''));


    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}


function f_gravaIntegracao(pCodCliente, pRetorno, pDataset) {

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        if (pRetorno.salesmanId != undefined) {
            // pDataset.addRow(new Array("OK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));

            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "(sysdate,'" + pCodCliente + "','PORTIFOLIO','" + pRetorno.salesmanId + "','" + gson.toJson(pRetorno) + "')";
        } else {
            // pDataset.addRow(new Array("NOK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));
            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "(sysdate,'" + pCodCliente + "','PORTIFOLIO','-99','" + gson.toJson(pRetorno) + "')";
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

function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/receivables/list/?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    // pDataset.addRow(new Array("EndPoint: " + Endpoint));

    // return false;

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
            for (var i = 0; i < dataset.rowsCount; i++) {
                if (pIndAcao == 'S') {
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData, Ddataset);
                    // Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
                    // f_gravaIntegracao(pData.customerId, retorno, Ddataset)
                    wRetorno = true;
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