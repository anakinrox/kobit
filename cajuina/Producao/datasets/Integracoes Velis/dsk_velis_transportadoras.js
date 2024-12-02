var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Transportadora START ##");
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

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Transportadora START ##");
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

function f_integrar(newDataset) {
    try {
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var SQL = "select ";
        SQL += "    cod_cliente, ";
        SQL += "    num_cgc_cpf, ";
        SQL += "    nom_cliente as razao, ";
        SQL += "    nom_reduzido as nome, ";
        SQL += "    num_telefone, ";
        SQL += "    (select CORREIO_ELETRONICO from VDP_CLI_FORNEC_CPL where cliente_fornecedor = clientes.cod_cliente and TIP_CADASTRO = 'F') as email ";
        SQL += "from clientes  ";
        SQL += "where cod_tip_cli = '99' ";
        SQL += "and ies_situacao = 'A'";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wEmail = '';
            var wTelefone = '';
            var wCPFCNPJ = '';
            var str = rsWD.getString("num_cgc_cpf") + "";
            var wSplitString = str.split('.');
            var isCPF = wSplitString[2].split('/')[1].split('-')[0];

            if (isCPF == '0000') {
                var wSpliCPF1 = wSplitString[2].split("/");
                var wSpliCPF2 = wSplitString[2].split("-");
                wCPFCNPJ = wSplitString[0] + '.' + wSplitString[1] + '.' + wSpliCPF1[0] + '-' + wSpliCPF2[1];
            } else {
                // var wIni = wSplitString[0];
                wCPFCNPJ = wSplitString[0].substring(1, 3) + '.' + wSplitString[1] + '.' + wSplitString[2]
            }

            if (rsWD.getString("email") != '' && rsWD.getString("email") != null) {
                wEmail = rsWD.getString("email").trim()
            }

            if (rsWD.getString("num_telefone") != '' && rsWD.getString("num_telefone") != null) {
                wTelefone = rsWD.getString("num_telefone").trim()
            }

            var data = {
                active: true,
                corporateName: rsWD.getString("razao").trim(),
                email: wEmail,
                federalId: wCPFCNPJ,
                id: null,
                idErp: rsWD.getString("cod_cliente").trim(),
                name: rsWD.getString("nome").trim(),
                phones: wTelefone,
                source: ""
            }

            // // newDataset.addRow(new Array("Str: " + str));
            // // newDataset.addRow(new Array("wSplitString: " + wSplitString[0]));
            // // newDataset.addRow(new Array("CNPJ: " + wCPFCNPJ));
            // // newDataset.addRow(new Array("CPF: " + isCPF));
            // newDataset.addRow(new Array("JSIN: " + gson.toJson(data)));
            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    var retorno = f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S');
                }
            }

        }

        newDataset.addRow(new Array(true, ''));


    } catch (error) {
        newDataset.addRow(new Array(false, '"Erro: " + error + " - Linha: " + error.lineNumber'));
        f_gravaLog('dsk_velis_transportadoras', '', '', '', error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}


function onMobileSync(user) {

}

function f_enviaDados(pServiceCode, pAPIKey, pJson) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/carriers?api_key=' + pAPIKey;
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
                    Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
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