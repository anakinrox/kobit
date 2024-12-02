var debug = true;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Tabela de preco START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');


        var listaConstraits = {};
        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }


        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

}

function f_integrar(newDataset) {
    try {

        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var SQL = "select ";
        SQL += "    distinct ";
        SQL += "    precoM.cod_empresa, ";
        SQL += "    precoM.NUM_LIST_PRECO as cod_lista, ";
        SQL += "    precoM.DEN_LIST_PRECO as nome_Lista  ";
        SQL += "from desc_preco_mest precoM  ";
        SQL += "where precoM.cod_empresa in ('03','04','08') ";
        // SQL += "where precoM.cod_empresa in ('08') ";
        SQL += "  and(precoM.DAT_FIM_VIG > sysdate) ";
        // SQL += "  and precoM.NUM_LIST_PRECO = 101 ";
        // SQL += "where precoM.cod_empresa in ('03','04','05','08') ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            // newDataset.addRow(new Array(" Lista: " + rsWD.getString("cod_lista")));

            var wItens = {};
            var wItensVisiby = {};

            var SQLI = "select ";
            SQLI += "    iPreco.cod_item, ";
            SQLI += "    iPreco.PRE_UNIT ";
            SQLI += "from desc_preco_item iPreco ";
            SQLI += "    inner join item i on(i.cod_empresa = iPreco.cod_empresa) ";
            SQLI += "            and (i.cod_item = iPreco.cod_item) ";
            SQLI += "            and (i.ies_situacao = 'A') ";
            SQLI += "            and (i.cod_lin_prod in (1,10)) ";
            SQLI += "where iPreco.cod_empresa = '" + rsWD.getString("cod_empresa").trim() + "'  ";
            SQLI += "and iPreco.num_list_preco = " + rsWD.getString("cod_lista").trim();
            // SQLI += "and iPreco.cod_item = '01010703'";

            var statementWDI = connectionWD.prepareStatement(SQLI);
            var rsWDI = statementWDI.executeQuery();
            while (rsWDI.next()) {
                wItens[rsWDI.getString("cod_item").trim()] = rsWDI.getString("PRE_UNIT");

                if (parseFloat(rsWDI.getString("PRE_UNIT")) > 0) {
                    wItensVisiby[rsWDI.getString("cod_item").trim()] = true;
                } else {
                    wItensVisiby[rsWDI.getString("cod_item").trim()] = false;
                }
            }

            if (rsWDI != null) rsWDI.close();

            var wCodiLista = pad(rsWD.getString("cod_lista").trim(), 4);

            var lengthP = Object.keys(wItens).length;
            if (lengthP > 0) {
                var data = {
                    specificPricePerErpProduct: wItens,
                    specificPricePerProduct: {},
                    specificVisibilityPerProduct: {},
                    specificVisibilityPerErpProduct: wItensVisiby,
                    table: {
                        b2b: false,
                        defaultAtCustomerCreation: null,
                        description: wCodiLista + '-' + rsWD.getString("nome_Lista").trim(),
                        discount: 0,
                        email: "",
                        enabled: true,
                        id: null,
                        idErp: rsWD.getString("cod_lista").trim(),
                        maxDiscount: 0,
                        name: wCodiLista + '-' + rsWD.getString("nome_Lista").trim()
                    }
                }

                // newDataset.addRow(new Array("JSON: " + gson.toJson(data)));
                // printLog("error", "JSON TabPreco: " + gson.toJson(data));
                var retorno = f_getDadosVelis(rsWD.getString("cod_empresa").trim(), data, newDataset, 'S');
            }


        }
        newDataset.addRow(new Array(true, ''));
    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        f_gravaLog('dsk_velis_tabela_preco', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}


function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function f_enviaDados(pServiceCode, pAPIKey, pJson) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pricing-tables?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    params = pJson;

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = gson.toJson(data)

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
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

        var constraints = new Array();
        if (pCodEmpresa != '' && pCodEmpresa != undefined) {
            constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
        }
        var dataset = DatasetFactory.getDataset("kbt_t_param_velis", null, constraints, null);

        if (dataset != null) {
            for (var i = 0; i < dataset.rowsCount; i++) {
                if (pIndAcao == 'S') {
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData);
                    // Ddataset.addRow(new Array("Retorno Inclusao: " + gson.toJson(retorno)));
                    wRetorno = retorno;
                } else {
                    var data = {
                        SERVICO: dataset.getValue(i, "nom_servico"),
                        API_KEY: dataset.getValue(i, "api_key")
                    }

                    wRetorno = data;
                }
            }
        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}

function f_gravaLog(pNomeDataset, pChave1, pChave2, pChave3, pLog, newDataset) {
    try {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('dataset', pNomeDataset, pNomeDataset, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('chave1', pChave1, pChave1, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('chave2', pChave2, pChave2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('chave3', pChave3, pChave3, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('log', pLog, pLog, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_velis_log_integracao", null, constraints, null);

    } catch (error) {
    } finally {

    }
}