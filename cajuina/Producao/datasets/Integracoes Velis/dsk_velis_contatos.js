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

        var SQL = "SELECT ";
        SQL += "    c.cod_cliente, ";
        SQL += "    nvl(cc.NOM_CONTATO, trim(c.nom_cliente)) as Contato, ";
        SQL += "    nvl(cc.NUM_TELEFONE, c.num_telefone) as telefone, ";
        SQL += "    nvl(cc.EMAIL, vdp_cpl.correio_eletronico) as email, ";
        SQL += "    nvl(cc.NUM_CONTATO, 0) as cod_contato ";
        SQL += "FROM clientes c  ";
        SQL += "    left join vdp_cli_fornec_cpl vdp_cpl on c.cod_cliente = vdp_cpl.cliente_fornecedor ";
        SQL += "                                        and c.ies_cli_forn = vdp_cpl.tip_cadastro ";
        SQL += "    inner join cli_contatos cc on(cc.cod_cliente = c.COD_CLIENTE) ";
        SQL += "where c.cod_tip_cli not in ('98', '99')  ";
        SQL += "and c.ies_situacao in ('A', 'S') ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wEmail = '';
            var wTelefone = '';

            if (rsWD.getString("email") != '' && rsWD.getString("email") != null) {
                wEmail = rsWD.getString("email").trim()
            }

            if (rsWD.getString("telefone") != '' && rsWD.getString("telefone") != null) {
                wTelefone = rsWD.getString("telefone").trim()
            }

            var data = {
                active: true,
                birthday: "",
                customerId: null,
                email: wEmail,
                id: null,
                idErp: rsWD.getString("cod_cliente").trim() + "_" + rsWD.getString("cod_contato").trim(),
                name: rsWD.getString("Contato").trim(),
                notes: "",
                phone: wTelefone,
                title: ""
            }

            // newDataset.addRow(new Array("Antes: " + gson.toJson(data)));
            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    var wCodCliente = '';
                    data.customerId = null;

                    var wRetorno = f_getIDCLiente(wAPI[i].SERVICO, wAPI[i].API_KEY, rsWD.getString("COD_CLIENTE").trim())
                    if (wRetorno != null && wRetorno != undefined) {
                        data.customerId = wRetorno.id;
                    }
                    // newDataset.addRow(new Array("Enviado: " + gson.toJson(data)));

                    f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S');
                }
            }

        }

        newDataset.addRow(new Array(true, ''));


    } catch (error) {
        newDataset.addRow(new Array(false, '"Erro: " + error + " - Linha: " + error.lineNumber'));
        f_gravaLog('dsk_velis_contatos', '', '', '', error, newDataset);
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

function f_getIDCLiente(pServiceCode, pAPIKey, pCodLista) {
    try {
        var retorno = null;
        var metodo = "GET";
        var wServiceCode = pServiceCode;
        var params = {};
        var Endpoint = '/api/customers/erp/' + pCodLista + '?api_key=' + pAPIKey;
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
    var Endpoint = '/api/contacts?api_key=' + pAPIKey;
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