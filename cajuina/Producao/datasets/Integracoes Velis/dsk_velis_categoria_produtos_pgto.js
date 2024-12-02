var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {

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


function f_integrar(newDataset) {
    try {
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        for (var i = 0; i < wAPI.length; i++) {

            var wCatProd = [];

            var SQL = "SELECT ";
            SQL += "    COD_LIN_PROD || '.' || COD_LIN_RECEI || '.' || COD_SEG_MERC || '.' || COD_CLA_USO as codigo, ";
            SQL += "    DEN_ESTR_LINPROD as nome, ";
            SQL += "    COD_LIN_PROD, ";
            SQL += "    COD_LIN_RECEI, ";
            SQL += "    COD_SEG_MERC, ";
            SQL += "    COD_CLA_USO  ";
            SQL += "FROM linha_prod  where cod_lin_prod in (1, 10) ";

            var statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {


                var wItens = '';
                var SQL = "select ";
                SQL += "    cod_item  "
                SQL += "from item  "
                SQL += "where cod_empresa = '" + wAPI[i].EMRPESA + "' "
                SQL += "and IES_SITUACAO = 'A'  "
                SQL += "and cod_lin_prod in (1, 10)  "
                SQL += "and gru_ctr_estoq <> 70 "
                SQL += "and COD_LIN_PROD = " + rsWD.getString("COD_LIN_PROD") + "  "
                SQL += "and COD_LIN_RECEI = " + rsWD.getString("COD_LIN_RECEI") + "  "
                SQL += "and COD_SEG_MERC = " + rsWD.getString("COD_SEG_MERC") + "  "
                SQL += "and COD_CLA_USO = " + rsWD.getString("COD_CLA_USO") + " and ROWNUM between 1 and 2";

                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWDI = statementWD.executeQuery();
                while (rsWDI.next()) {
                    if (wItens == '') {
                        wItens = rsWDI.getString("cod_item").trim();
                    } else {
                        wItens = wItens + ',' + rsWDI.getString("cod_item").trim();
                    }
                }
                if (rsWDI != null) rsWDI.close();

                var data = {
                    id: null,
                    idErp: rsWD.getString("codigo").trim(),
                    name: rsWD.getString("nome").trim(),
                    parentId: null,
                    productIndexLikePrice: true,
                    productIds: []
                };
                if (wItens != '') {
                    data.productIdsErp = [wItens]
                }

                if (data.productIdsErp != undefined) {
                    wCatProd.push(data);
                }
            }
            if (wCatProd.length > 0) {
                for (var x = 0; x < wCatProd.length; x++) {
                    f_logIntegracao('CTGP', wAPI[i].EMRPESA, wCatProd[x].idErp, gson.toJson(wCatProd[x]), newDataset); // Monta Log caso necessário.
                }
                f_getDadosVelis(wAPI[i].EMRPESA, wCatProd, newDataset, 'S');
            }
        }

        newDataset.addRow(new Array(true, ''));

        // PDBCAJUPRD
    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        f_gravaLog('dsk_velis_categoria_produtos_pgto', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}

function f_enviaDados(pServiceCode, pAPIKey, pJson, dataset) {
    var retorno = null;
    var metodo = "PUT";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/product-categories?api_key=' + pAPIKey;
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
    // dataset.addRow(new Array("Data: " + pJson));

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
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData, Ddataset);
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

function f_logIntegracao(pIndRegistro, pCodEmpresa, pCodRegistro, pJson, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select * from kbt_t_log_velis where json is null ";
        SQL += pIndRegistro != '' ? " and upper(indreg) = '" + pIndRegistro.toUpperCase() + "'" : " ";
        SQL += pCodEmpresa != '' ? " and cod_empresa = '" + pCodEmpresa + "'" : " ";
        SQL += pCodRegistro != '' ? " and cod_registro = '" + pCodRegistro + "'" : " ";
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        // newDataset.addRow(new Array(false, "SQL: " + SQL));
        while (rsWD.next()) {
            // newDataset.addRow(new Array(false, "Encontros os registros"));
            var SQL = "update kbt_t_log_velis set json = '" + pJson + "' where 1=1 ";
            SQL += pIndRegistro != '' ? " and upper(indreg) = '" + pIndRegistro.toUpperCase() + "'" : " ";
            SQL += pCodEmpresa != '' ? " and cod_empresa = '" + pCodEmpresa + "'" : " ";
            SQL += pCodRegistro != '' ? " and cod_registro = '" + pCodRegistro + "'" : " ";
            statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();
        }

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}