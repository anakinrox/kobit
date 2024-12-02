var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Tributacao START ##");
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
        printLog("info", "## Integração Tributacao START ##");
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

        var SQL = "SELECT ";
        SQL += "         i.cod_empresa, ";
        SQL += "         i.cod_item, ";
        SQL += "         i.den_item, ";
        SQL += "         i.cod_cla_fisc as ncm ";
        SQL += " FROM item i ";
        SQL += " where i.cod_empresa in ('03','04','08') and i.IES_SITUACAO = 'A' and i.cod_lin_prod in (1, 10) and i.gru_ctr_estoq <> 70 ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var SQLLista = "SELECT ";
            SQLLista += "        empresa, ";
            SQLLista += "            tributo_benef, ";
            SQLLista += "            formula, ";
            SQLLista += "            estado, ";
            SQLLista += "            finalidade, ";
            SQLLista += "            grupo_fiscal_item, ";
            SQLLista += "            item, ";
            SQLLista += "            aliquota, ";
            SQLLista += "            val_unit, ";
            SQLLista += "            pct_margem_lucro, ";
            SQLLista += "            lista_preco, ";
            SQLLista += "            trim(pre_list_x_nf) as pre_list_x_nf, ";
            SQLLista += "            aliq_icms_normal, ";
            SQLLista += "            retir_ipi_bc_icms ";
            SQLLista += "FROM	 obf_config_fiscal ";
            SQLLista += "WHERE 	empresa = '" + rsWD.getString("cod_empresa") + "' ";
            SQLLista += "AND	 tributo_benef = 'ICMS_ST' ";
            SQLLista += "        AND(finalidade is null or finalidade = 1) ";
            SQLLista += "AND	 origem = 'S' ";
            SQLLista += "AND	 nat_oper_grp_desp = 101 ";
            SQLLista += "AND	 item = '" + rsWD.getString("cod_item") + "' ";
            SQLLista += "UNION	 ALL ";
            SQLLista += "        SELECT ";
            SQLLista += "        empresa, ";
            SQLLista += "            tributo_benef, ";
            SQLLista += "            formula, ";
            SQLLista += "            estado, ";
            SQLLista += "            finalidade, ";
            SQLLista += "            grupo_fiscal_item, ";
            SQLLista += "            item, ";
            SQLLista += "            aliquota, ";
            SQLLista += "            val_unit, ";
            SQLLista += "            pct_margem_lucro, ";
            SQLLista += "            lista_preco, ";
            SQLLista += "            trim(pre_list_x_nf) as pre_list_x_nf, ";
            SQLLista += "            aliq_icms_normal, ";
            SQLLista += "            retir_ipi_bc_icms ";
            SQLLista += "FROM	obf_config_fiscal ";
            SQLLista += "WHERE empresa = '" + rsWD.getString("cod_empresa") + "' ";
            SQLLista += "AND  tributo_benef = 'ICMS_ST' ";
            SQLLista += "AND  origem = 'S' ";
            SQLLista += "AND  nat_oper_grp_desp = 101 ";
            SQLLista += "        AND(finalidade is null or finalidade = 1) ";
            SQLLista += "AND  grupo_fiscal_item in ";
            SQLLista += "            (SELECT ";
            SQLLista += "grupo_fiscal_item ";
            SQLLista += "        FROM ";
            SQLLista += "        obf_grp_fisc_item ";
            SQLLista += "        WHERE ";
            SQLLista += "        obf_grp_fisc_item.empresa = obf_config_fiscal.empresa	 and ";
            SQLLista += "        obf_grp_fisc_item.tributo_benef = 'ICMS_ST' and ";
            SQLLista += "        obf_grp_fisc_item.item = '" + rsWD.getString("cod_item") + "' ";
            SQLLista += ")  ";

            var statementWD = connectionWD.prepareStatement(SQLLista);
            var rsWD2 = statementWD.executeQuery();
            while (rsWD2.next()) {
                var wAliquotoCredito = 0;
                var wAliquotoDestino = 0;
                var wPmcOrHigher = false;
                var wMvaPct = null;
                var wPmcValor = null;
                var wTipoST = 'MVA';
                var wNCM = rsWD.getString("ncm") + "";
                wNCM = wNCM.replace(/[^0-9]/g, '');

                if (rsWD2.getString("aliq_icms_normal") != null) {
                    wAliquotoCredito = parseFloat(rsWD2.getString("aliq_icms_normal")) / 100;
                }
                if (rsWD2.getString("aliquota") != null) {
                    wAliquotoDestino = parseFloat(rsWD2.getString("aliquota")) / 100;
                }

                if (rsWD2.getString("PCT_MARGEM_LUCRO") != null && rsWD2.getString("PCT_MARGEM_LUCRO") != '') {
                    wMvaPct = parseFloat(rsWD2.getString("PCT_MARGEM_LUCRO")) / 100
                    wPmcOrHigher = false;
                    wTipoST = 'MVA';

                } else {
                    wTipoST = 'PMC';
                    if (rsWD2.getString("pre_list_x_nf") != '' & rsWD2.getString("pre_list_x_nf") != null) {
                        if (rsWD2.getString("pre_list_x_nf").trim() == 'S') {
                            wPmcOrHigher = true;
                        }
                    }

                    wPmcValor = f_getValorLista(connectionWD, rsWD.getString("cod_empresa"), rsWD.getString("cod_item"), rsWD2.getString("lista_preco"), newDataset)
                }

                if (rsWD2.getString("estado") != null) {
                    var data = {
                        aliquotaCreditoPct: wAliquotoCredito,
                        aliquotaDestinoPct: wAliquotoDestino,
                        icmsExceptionId: null,
                        id: null,
                        mvaPct: wMvaPct,
                        ncm: wNCM,
                        pmcOrHigher: wPmcOrHigher,
                        pmcValue: wPmcValor,
                        productCode: rsWD.getString("cod_item").trim(),
                        tipoSt: wTipoST,
                        uf: rsWD2.getString("estado")
                    }

                    // newDataset.addRow(new Array("Antes: " + gson.toJson(data)));
                    var wAPI = f_getDadosVelis(rsWD.getString("cod_empresa").trim(), '', newDataset, 'N');
                    if (wAPI != null) {
                        for (var i = 0; i < wAPI.length; i++) {
                            // newDataset.addRow(new Array('Item: ' + rsWD.getString("cod_item").trim() + ' UF: ' + rsWD2.getString("estado").trim()));
                            var wRetorno = f_getRegraICMS(wAPI[i].SERVICO, wAPI[i].API_KEY, rsWD.getString("cod_item").trim(), rsWD2.getString("estado"), newDataset)
                            if (wRetorno.length > 0) {
                                for (var x = 0; x < wRetorno.length; x++) {
                                    data.id = wRetorno[x].id;
                                }
                            }
                            f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S');
                        }
                    }
                }

            }
            if (rsWD2 != null) rsWD2.close();
        }

        newDataset.addRow(new Array(true, ''));

    } catch (error) {
        newDataset.addRow(new Array(false, '"Erro: " + error + " - Linha: " + error.lineNumber'));
        f_gravaLog('dsk_velis_tributacao', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}

function f_getValorLista(pConnectionWD, pCodEmpresa, pCodProduto, pCodLista, pDataSet) {
    try {
        var wRetorno = 0;
        var SQL = "select PRE_UNIT from DESC_PRECO_ITEM where cod_empresa = '" + pCodEmpresa + "'and NUM_LIST_PRECO = " + pCodLista + " and cod_item = '" + pCodProduto + "'";
        var statementWD = pConnectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wRetorno = rsWD.getString("PRE_UNIT");
        }

        if (rsWD != null) rsWD.close();
    } catch (error) {
        pDataSet.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }
}

function f_getRegraICMS(pServiceCode, pAPIKey, pCodItem, pUF, newDataset) {
    try {
        var retorno = null;
        var metodo = "GET";
        var wServiceCode = pServiceCode;
        var params = {};
        var Endpoint = '/api/icms/product_code-ncm-uf/?product_code=' + pCodItem + '&uf=' + pUF + '&api_key=' + pAPIKey;
        var gson = new com.google.gson.Gson();

        // newDataset.addRow(new Array("ServiceCode: " + pServiceCode + " EndPoint: " + Endpoint));

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

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return retorno;
    }

}

function f_enviaDados(pServiceCode, pAPIKey, pJson) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/icms?api_key=' + pAPIKey;
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
                    Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
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