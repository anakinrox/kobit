var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {

}

function f_integrar(newDataset) {
    try {
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();



        var SQL = "select ";
        SQL += "    COD_CND_PGTO, ";
        SQL += "    DEN_CND_PGTO, ";
        SQL += "    pct_desp_finan, ";
        SQL += "    SITUACAO, ";
        SQL += "    ies_tipo ";
        SQL += "from COND_PGTO ";
        // SQL += "where IES_EMITE_DUPL = 'S' ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wSituacao = true;
            var wRules = null;
            var wForma = null;
            if (rsWD.getString("SITUACAO").trim() != 'A') {
                wSituacao = false
            }

            var SQL = "SELECT QTD_DIAS_CD FROM COND_PGTO_ITEM where COD_CND_PGTO = " + rsWD.getString("COD_CND_PGTO").trim() + "  order by sequencia";
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD2 = statementWD.executeQuery();
            while (rsWD2.next()) {
                if (wRules == null) {
                    wRules = rsWD2.getString("QTD_DIAS_CD").trim();
                } else {
                    wRules = wRules + "," + rsWD2.getString("QTD_DIAS_CD").trim();
                }

            }
            if (rsWD2 != null) rsWD2.close();

            var SQL = "select forma_pagto from CAJ_VELIS_CND_PGTO_FORMA where cod_cnd_pgto = " + rsWD.getString("COD_CND_PGTO").trim();
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD2 = statementWD.executeQuery();
            while (rsWD2.next()) {
                wForma = rsWD2.getString("forma_pagto");
            }
            if (rsWD2 != null) rsWD2.close();

            var wIndice = ((((parseFloat(rsWD.getString("pct_desp_finan")) - 1))) * -1)

            var wCodCondicao = pad(rsWD.getString("COD_CND_PGTO").trim(), 3);

            var data = {
                active: wSituacao,
                balanceFlexDiscounts: false,
                enableOrderCreditLimit: rsWD.getString("ies_tipo").trim() == 'V' ? true : false,
                description: rsWD.getString("DEN_CND_PGTO").trim(),
                discount: wIndice,
                id: null,
                idErp: rsWD.getString("COD_CND_PGTO").trim(),
                minValue: 0,
                name: wCodCondicao + '-' + rsWD.getString("DEN_CND_PGTO").trim(),
                rules: wRules,
                paymentFormIdErp: wForma + ""
            };

            // if (rsWD.getString("ies_tipo").trim() == 'V') { data.enableOrderCreditLimit = true }

            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S');
                }
            }
        }

        newDataset.addRow(new Array(true, ''));


    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        f_gravaLog('dsk_velis_condicao_pgto', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

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
    var Endpoint = '/api/paymentTerms?api_key=' + pAPIKey;
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
        var wEmpresa = [];

        var constraints = new Array();
        if (pCodEmpresa != '' && pCodEmpresa != undefined) {
            constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
        }
        var dataset = DatasetFactory.getDataset("kbt_t_param_velis", null, constraints, null);

        if (dataset != null) {
            for (var i = 0; i < dataset.rowsCount; i++) {
                if (pIndAcao == 'S') {
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData);
                    // Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
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