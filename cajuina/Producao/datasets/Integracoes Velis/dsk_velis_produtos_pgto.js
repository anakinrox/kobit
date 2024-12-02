var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Pedidos START ##");
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

function f_integrar(newDataset) {
    try {
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var SQL = "SELECT ";
        SQL += "         i.cod_empresa, ";
        SQL += "         i.cod_item, ";
        SQL += "         i.den_item, ";
        SQL += "         i.COD_UNID_MED, ";
        SQL += "         (i.PES_UNIT + eb.PES_UNIT) as peso, ";
        SQL += "         barra.COD_BARRA as barras, ";
        SQL += "         nvl((select  ";
        SQL += "             aliquota ";
        SQL += "             from obf_config_fiscal ";
        SQL += "             where empresa = i.cod_empresa ";
        SQL += "             and tributo_benef = 'IPI' ";
        SQL += "             and formula = 1 ";
        SQL += "             and origem = 'S' ";
        SQL += "             and nat_oper_grp_desp = '101' ";
        SQL += "             and item = i.cod_item), ";
        SQL += "                 (SELECT ";
        SQL += "                     aliquota ";
        SQL += "                 FROM obf_config_fiscal ";
        SQL += "                 WHERE empresa = i.cod_empresa ";
        SQL += "                 AND tributo_benef = 'IPI' ";
        SQL += "                 and formula = 1 ";
        SQL += "                 and origem = 'S' ";
        SQL += "                 and produto_bonific is null ";
        SQL += "                 and nat_oper_grp_desp = 101 ";
        SQL += "                 AND grupo_fiscal_item IN ";
        SQL += "                 ( ";
        SQL += "                     SELECT ";
        SQL += "                 grupo_fiscal_item ";
        SQL += "                 FROM ";
        SQL += "                 obf_grp_fisc_item ";
        SQL += "                 WHERE 	empresa = i.cod_empresa AND ";
        SQL += "                 tributo_benef = 'IPI' AND item = i.cod_item))) as aliquota, ";
        SQL += "        nvl((SELECT(QTD_SALDO - QTD_RESERV_1) ";
        SQL += "        FROM ESTOQUE_LOTE_ENDER ";
        SQL += "        where cod_empresa = i.cod_empresa  ";
        SQL += "          AND COD_LOCAL = 'PLATAFORMA' ";
        SQL += "          AND IES_SITUA_QTD = 'L' ";
        SQL += "          and cod_item = i.cod_item),0) as estoque, ";
        SQL += "    i.cod_cla_fisc as ncm, ";
        SQL += "    i.IES_SITUACAO ";
        SQL += " FROM item i   ";
        SQL += "     left join ITEM_EMBALAGEM ib on(ib.cod_empresa = i.COD_EMPRESA) ";
        SQL += "         and(ib.cod_item = i.cod_item)  ";
        SQL += "     left join embalagem eb on(eb.COD_EMBAL = ib.COD_EMBAL) ";
        SQL += "     left join VDP_ITEM_BARRA barra on(barra.empresa = i.COD_EMPRESA) ";
        SQL += "         and(barra.item = i.cod_item)  ";
        SQL += " where i.cod_empresa in ('03','04','08') and i.IES_SITUACAO in ('A','I') and cod_lin_prod in (1, 10) and gru_ctr_estoq <> 70";
        // SQL += " where i.cod_empresa in ('03') and i.IES_SITUACAO = 'A' and cod_lin_prod in (1, 10) and gru_ctr_estoq <> 70 and i.cod_item = '01010601'";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wAliquota = 0;
            var wCodBarras = ''
            var wPeso = 0;
            var wSituacao = true;
            var wNCM = rsWD.getString("ncm") + "";
            wNCM = wNCM.replace(/[^0-9]/g, '');

            if (rsWD.getString("aliquota") != null) {
                wAliquota = parseFloat(rsWD.getString("aliquota")) / 100;
            }

            if (rsWD.getString("barras") != null) {
                wCodBarras = rsWD.getString("barras").trim()
            }

            if (rsWD.getString("peso") != null) {
                wPeso = rsWD.getString("peso").trim()
            }
            if (rsWD.getString("IES_SITUACAO") == "I") {
                wSituacao = false;
            }

            var data = {
                active: wSituacao,
                ipiPercent: wAliquota,
                weight: wPeso,
                b2bCashbackPercent: 0,
                barcode: wCodBarras,
                campaignId: null,
                cashbackPercent: 0,
                code: rsWD.getString("cod_item").trim(),
                cubage: 0,
                depth: 0,
                description: rsWD.getString("den_item").trim(),
                extras: {},
                height: 0,
                icmsPercent: 0,
                icmsReductionPercent: 0,
                id: null,
                idErp: rsWD.getString("cod_item").trim(),
                lotId: null,
                markupMinimum: 0,
                minimumValue: 0,
                name: rsWD.getString("den_item").trim(),
                ncm: wNCM,
                perishable: false,
                presentation: rsWD.getString("COD_UNID_MED").trim(),
                priceIndexValue: 0,
                salesMultipleValue: 0,
                salesNote: "",
                stockAverageCost: 0,
                stockGrid1Id: null,
                stockGrid2Id: null,
                stockTotal: 0,
                // stockTotal: rsWD.getString("estoque"),
                url: "",
                value: 0,
                weightNet: 0,
                width: 0
            }
            // promotionalValue: null
            var retorno = f_getDadosVelis(rsWD.getString("cod_empresa"), data, newDataset, 'S');
        }

        newDataset.addRow(new Array(true, ''));

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        f_gravaLog('dsk_velis_produtos_pgto', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_enviaDados(pServiceCode, pAPIKey, pJson) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/products?api_key=' + pAPIKey;
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
                    // Ddataset.addRow(new Array("Servico: " + dataset.getValue(i, "nom_servico") + ' - KEY: ' + dataset.getValue(i, "api_key")));
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData);
                    // Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
                    wRetorno = true;
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