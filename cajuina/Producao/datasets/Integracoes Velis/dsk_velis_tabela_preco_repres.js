var debug = false;
function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Tabela Repres START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');


        var listaConstraits = {};
        listaConstraits['representante'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        // listaConstraits['cliente'] = "013047763000130";
        // listaConstraits['representante'] = "207";

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
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();



        var SQL = "select ";
        SQL += "    caj_repres.empresa, ";
        SQL += "    caj_repres.cod_repres, ";
        SQL += "    rep.NOM_REPRES ";
        SQL += "from CAJ_AFV_REPRES_EMPRESA caj_repres ";
        SQL += "    inner join REPRESENTANTE rep on(rep.COD_REPRES = caj_repres.COD_REPRES) ";
        SQL += "        and(rep.ies_situacao = 'N') ";
        SQL += "    inner join CRE_REPR_COMISSAO compl_rep on(compl_rep.REPRESENTANTE = caj_repres.COD_REPRES) ";
        SQL += "        and(CAMPO = 'e_mail_representante') ";
        SQL += "where caj_repres.EMPRESA  in ('03','04','08')";
        if (pCodRepres != undefined) {
            SQL += " and caj_repres.cod_repres = '" + pCodRepres + "'";
        }
        SQL += "  order by caj_repres.cod_repres";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            // newDataset.addRow(new Array("Repres: " + rsWD.getString("cod_repres") + " Emrpesa: " + rsWD.getString("empresa")));

            var wTabelas = '';

            var SQLI = "select caj_lista.num_list_preco ";
            SQLI += "from caj_list_preco_repres caj_lista ";
            SQLI += "    inner join desc_preco_mest precoM on(precoM.cod_empresa = caj_lista.cod_empresa) ";
            SQLI += "            and(precoM.num_list_preco = caj_lista.num_list_preco) ";
            SQLI += "            and(precoM.DAT_FIM_VIG > sysdate) ";
            SQLI += "where caj_lista.cod_empresa = '" + rsWD.getString("empresa").trim() + "' and caj_lista.cod_repres = " + rsWD.getString("cod_repres").trim();
            // SQLI += "and iPreco.num_list_preco = " + rsWD.getString("cod_lista").trim() + " and iPreco.cod_item = '01010601'";

            var statementWDI = connectionWD.prepareStatement(SQLI);
            var rsWDI = statementWDI.executeQuery();
            while (rsWDI.next()) {
                if (wTabelas == '') {
                    wTabelas = rsWDI.getString("num_list_preco").trim();
                } else {
                    wTabelas = wTabelas + ',' + rsWDI.getString("num_list_preco").trim();
                }
            }

            if (rsWDI != null) rsWDI.close();

            var data = rsWD.getString("cod_repres") + '-' + wTabelas
            // newDataset.addRow(new Array("Data: " + data));

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

function f_enviaDados(pServiceCode, pAPIKey, pJson) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pricing-tables/users-tables/' + pJson + '?api_key=' + pAPIKey;
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
        retorno = "OK"
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
                    var data = {
                        empresa: pCodEmpresa,
                        retorno: retorno
                    }
                    Ddataset.addRow(new Array(gson.toJson(data)));
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