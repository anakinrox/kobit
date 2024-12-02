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

        var wCatClientes = [];

        // var SQL = "select cod_tip_cli, den_tip_cli from tipo_cliente where rownum <= 1";
        var SQL = "select cod_tip_cli, den_tip_cli from tipo_cliente";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {


            var wClientes = [];
            var SQL = "select cod_cliente from clientes c ";
            SQL += " where (c.cod_tip_cli not in ('98', '99') and(c.cod_tip_cli = '" + rsWD.getString("cod_tip_cli") + "')) ";
            SQL += "   and c.ies_situacao in ('A', 'S')"
            // SQL += "   and c.ies_situacao in ('A', 'S') and rownum <= 1"

            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWDI = statementWD.executeQuery();
            while (rsWDI.next()) {
                wClientes.push(rsWDI.getString("cod_cliente").trim());
            }
            if (rsWDI != null) rsWDI.close();

            var data = {
                id: null,
                idErp: rsWD.getString("cod_tip_cli").trim(),
                name: rsWD.getString("den_tip_cli").trim(),
                description: rsWD.getString("den_tip_cli").trim(),
                enabled: true,
                customerIdsErp: [],
                pricingTableId: null
            };

            if (wClientes != '') {
                data.customerIdsErp = wClientes
            }
            // newDataset.addRow(new Array("Registros: " + data.customerIdsErp));
            if (data.customerIdsErp.length > 0) {
                wCatClientes.push(data);
            }
        }

        if (wCatClientes.length > 0) {
            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            for (var i = 0; i < wAPI.length; i++) {
                for (var x = 0; x < wCatClientes.length; x++) {
                    f_logIntegracao('CTGC', wAPI[i].EMRPESA, wCatClientes[x].idErp, gson.toJson(wCatClientes[x]), newDataset); // Monta Log caso necessário.
                }
                f_getDadosVelis(wAPI[i].EMRPESA, wCatClientes, newDataset, 'S');
            }
        }

        newDataset.addRow(new Array(true, ''));

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        // f_gravaLog('dsk_velis_categoria_clientes', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

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
                    // Ddataset.addRow(new Array("Enviando: " + gson.toJson(pData)));
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
        // Ddataset.addRow(new Array("Erro dadosV: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}

function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset) {
    try {
        var retorno = null;
        var metodo = "POST";
        var wServiceCode = pServiceCode;
        var params = {};
        var Endpoint = '/api/customer-categories?api_key=' + pAPIKey;
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

        var options = {};
        options["encoding"] = "UTF-8";
        options["mediaType"] = "application/json";
        data["options"] = options;

        data["headers"] = headers;
        data["strParams"] = params;

        var jj = gson.toJson(data);
        // pDataset.addRow(new Array("data " + gson.toJson(data)));

        var vo = clientService.invoke(jj);
        if (vo.httpStatusResult != "200") {
            pDataset.addRow(new Array("data " + gson.toJson(pJson)));

            printLog('info', 'JSON CatCLiente: ' + gson.toJson(pJson))

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