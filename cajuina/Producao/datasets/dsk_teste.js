var debug = false;
function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Usuarios START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');


        var listaConstraits = {};
        listaConstraits['representante'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        listaConstraits['representante'] = "999";

        if (listaConstraits['representante'] != '') {
            f_integrar(newDataset, listaConstraits['representante']);
        } else {
            f_integrar(newDataset);
        }

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function f_integrar(newDataset, pCodRepres) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var SQL = "select ";
        SQL += "    caj_repres.empresa, ";
        SQL += "    caj_repres.cod_repres, ";
        SQL += "    rep.NOM_REPRES, ";
        SQL += "    rep.NUM_TELEFONE, ";
        SQL += "    rep.ies_situacao,";
        SQL += "    compl_rep.PARAMETRO_TEXTO as email, ";
        SQL += "    (SELECT COD_NIVEL_2 FROM CANAL_VENDA where cod_nivel_3 = caj_repres.cod_repres) as codSupervisor, ";
        SQL += "    (SELECT COD_NIVEL_1 FROM CANAL_VENDA where cod_nivel_3 = caj_repres.cod_repres) as codGerente ";
        SQL += "from CAJ_AFV_REPRES_EMPRESA caj_repres ";
        SQL += "    inner join REPRESENTANTE rep on(rep.COD_REPRES = caj_repres.COD_REPRES) ";
        if (pCodRepres == undefined) {
            SQL += "        and(rep.ies_situacao = 'N') ";
        }
        SQL += "    inner join CRE_REPR_COMISSAO compl_rep on(compl_rep.REPRESENTANTE = caj_repres.COD_REPRES) ";
        SQL += "        and(CAMPO = 'e_mail_representante') ";
        SQL += "where caj_repres.EMPRESA  in ('03','04','08') ";
        if (pCodRepres != undefined) {
            SQL += " and caj_repres.cod_repres = '" + pCodRepres + "'";
        }
        SQL += "  order by caj_repres.cod_repres";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            // newDataset.addRow(new Array("Repres: " + rsWD.getString("cod_repres")));

            var wTelefone = '';
            if (rsWD.getString("NUM_TELEFONE") != null) {
                wTelefone = rsWD.getString("NUM_TELEFONE").trim();
            }

            var wCodRepres = pad(rsWD.getString("cod_repres").trim(), 4);
            var wSituacao = true;
            if (rsWD.getString("ies_situacao").trim() == 'B') {
                wSituacao = false;
            }

            var data = {
                active: wSituacao,
                addressId: null,
                balanceFlex: null,
                bankAccount: "",
                bankAgency: "",
                bankNumber: "",
                email: rsWD.getString("email").trim(),
                id: null,
                idErp: rsWD.getString("cod_repres").trim(),
                name: wCodRepres + '-' + rsWD.getString("NOM_REPRES").trim(),
                phone: wTelefone,
                role: 3,
                salaryCosts: null,
                salesComissionPct: null,
                storageLocation: "",
                superiorId: null
            }

            var wAPI = f_getDadosVelis(rsWD.getString("empresa").trim(), '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    // newDataset.addRow(new Array(gson.toJson(wAPI[i])));
                    var wRetorno = f_getRepres(wAPI[i].SERVICO, wAPI[i].API_KEY, rsWD.getString("codSupervisor").trim(), newDataset)
                    if (wRetorno.error != undefined) {

                        var wSupervisor = f_enviaSuporvisor(rsWD.getString("empresa").trim(), rsWD.getString("codSupervisor").trim(), newDataset);
                        // newDataset.addRow(new Array("Retorno Sup: " + gson.toJson(wSupervisor)));
                        data.superiorId = wSupervisor.id;

                    } else {

                        f_enviaSuporvisor(rsWD.getString("empresa").trim(), rsWD.getString("codSupervisor").trim(), newDataset)
                        data.superiorId = wRetorno.id;

                    }
                }
            }
            f_logIntegracao('REP', rsWD.getString("empresa").trim(), data.idErp, gson.toJson(data), newDataset); // Monta Log caso necessário.
            var retorno = f_getDadosVelis(rsWD.getString("empresa").trim(), data, newDataset, 'S');
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}


function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function f_enviaSuporvisor(pCodEmpresa, pCodSupervidor, pDataSet) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var rsWD = null
        var gson = new com.google.gson.Gson();

        var SQL = "select ";
        SQL += "    rep.cod_repres, ";
        SQL += "    rep.NOM_REPRES, ";
        SQL += "    rep.NUM_TELEFONE, ";
        SQL += "    compl_rep.PARAMETRO_TEXTO as email, ";
        SQL += "    (SELECT distinct c.COD_NIVEL_1 FROM CANAL_VENDA c inner join representante r on (r.cod_repres = c.cod_nivel_1 and r.ies_situacao = 'N') where c.cod_nivel_2 = rep.cod_repres) as codSuperior ";
        SQL += "from REPRESENTANTE rep ";
        SQL += "    inner join CRE_REPR_COMISSAO compl_rep on (compl_rep.REPRESENTANTE = rep.COD_REPRES) ";
        SQL += "                                          and (CAMPO = 'e_mail_representante') ";
        SQL += "where rep.cod_repres = " + pCodSupervidor;
        SQL += "  and rep.ies_situacao = 'N' ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            var wTelefone = '';
            if (rsWD.getString("NUM_TELEFONE") != null) {
                wTelefone = rsWD.getString("NUM_TELEFONE").trim();
            }
            var wCodRepres = pad(rsWD.getString("cod_repres").trim(), 4);
            var data = {
                active: true,
                addressId: null,
                balanceFlex: null,
                bankAccount: "",
                bankAgency: "",
                bankNumber: "",
                email: rsWD.getString("email").trim(),
                id: null,
                idErp: rsWD.getString("cod_repres").trim(),
                name: wCodRepres + '-' + rsWD.getString("NOM_REPRES").trim(),
                phone: wTelefone,
                role: 3,
                salaryCosts: null,
                salesComissionPct: null,
                storageLocation: "",
                superiorId: null
            }

            var wAPI = f_getDadosVelis(pCodEmpresa, '', pDataSet, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    var wRetorno = f_getRepres(wAPI[i].SERVICO, wAPI[i].API_KEY, rsWD.getString("codSuperior").trim())
                    if (wRetorno.error != undefined) {
                        var wGerente = f_enviaGerente(pCodEmpresa, rsWD.getString("codSuperior").trim(), pDataSet)
                        data.superiorId = wGerente.id;
                    } else {
                        f_enviaGerente(pCodEmpresa, rsWD.getString("codSuperior").trim(), pDataSet)
                        data.superiorId = wRetorno.id;
                    }
                }
            }

            var retorno = f_getDadosVelis(pCodEmpresa, data, pDataSet, 'S');

            return retorno;
        }
    } catch (error) {
        pDataSet.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}


function f_enviaGerente(pCodEmpresa, pCodGerente, pDataset) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var rsWD = null;

        var SQL = "select ";
        SQL += "    rep.cod_repres, ";
        SQL += "    rep.NOM_REPRES, ";
        SQL += "    rep.NUM_TELEFONE, ";
        SQL += "    compl_rep.PARAMETRO_TEXTO as email ";
        SQL += "from REPRESENTANTE rep ";
        SQL += "    inner join CRE_REPR_COMISSAO compl_rep on (compl_rep.REPRESENTANTE = rep.COD_REPRES) ";
        SQL += "                                          and (CAMPO = 'e_mail_representante') ";
        SQL += "where rep.cod_repres = " + pCodGerente;
        SQL += "  and rep.ies_situacao = 'N' ";


        // pDataset.addRow(new Array("Gerente: " + pCodGerente));

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var wTelefone = '';
            var wEmail = 'cajuina@cajuinasaogeraldo.com.br';

            if (rsWD.getString("NUM_TELEFONE") != null) {
                wTelefone = rsWD.getString("NUM_TELEFONE").trim();
            }

            if (rsWD.getString("email") != null) {
                wEmail = rsWD.getString("email").trim();
            }

            var wCodRepres = pad(rsWD.getString("cod_repres").trim(), 4);
            var data = {
                active: true,
                addressId: null,
                balanceFlex: null,
                bankAccount: "",
                bankAgency: "",
                bankNumber: "",
                email: wEmail,
                id: null,
                idErp: rsWD.getString("cod_repres").trim(),
                name: wCodRepres + '-' + rsWD.getString("NOM_REPRES").trim(),
                phone: wTelefone,
                role: 2,
                salaryCosts: null,
                salesComissionPct: null,
                storageLocation: "",
                superiorId: null
            }
            // pDataset.addRow(new Array("JSON Gerente: " + gson.toJson(data)));

            var retorno = f_getDadosVelis(pCodEmpresa, data, pDataset, 'S');

            return retorno;

        }

    } catch (error) {
        pDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
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
    var Endpoint = '/api/users?api_key=' + pAPIKey;
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

function f_getRepres(pServiceCode, pAPIKey, pCodRepres, newDataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/users/erp/' + pCodRepres + '?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    // newDataset.addRow(new Array('EndPoint: ' + Endpoint));

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
                    var data = {
                        empresa: pCodEmpresa,
                        retorno: retorno
                    }
                    Ddataset.addRow(new Array(gson.toJson(data)));

                    wRetorno = retorno;
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
        // Ddataset.addRow(new Array('Acao: ' + pIndAcao + ' retorno: ' + gson.toJson(wRetorno)));
        return wRetorno;
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