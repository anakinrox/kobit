var debug = true;
var token = "I6cEyHmk4LtmxvsucSZLgfhT8lP3zWdomLaGbE8rI29g"
var tokenSintegra = "DC0AB130-7EEE-41DD-A5CA-9BA6CE41457E"
// var newDataset;


function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {

        var newDataset;
        newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'CONSULTAR';
            listaConstraits['indbusca'] = 'CPF'
            listaConstraits['numcpfcpnj'] = '006.170.859-35';
            listaConstraits['dat_nascimento'] = "24/03/1979"
        }


        if (listaConstraits['indacao'] == 'CONSULTAR') {

            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
                var connectionWD = dataSourceWD.getConnection();

                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;

                var SQL = "SELECT json FROM KBT_T_CONSULTAS_API where cnpj = '" + listaConstraits['numcpfcpnj'].replace(/[^0-9]+/g, '') + "' and INDBUSCA = '" + listaConstraits['indbusca'] + "' and datregistro >= TO_DATE('" + dataAtualFormatada(7) + "','DD/MM/YYYY')";
                // wRetorno = SQL;
                // return false;
                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    wAchou = true;
                    wStatus = true;
                    wRetorno = rsWD.getString("json");
                }


                if (wAchou == false) {

                    if (listaConstraits['indbusca'] == 'CNPJ') {

                        var retorno = f_consultaCNPJ(listaConstraits['numcpfcpnj'].replace(/[^0-9]+/g, ''));
                        if (retorno != null) {
                            if (retorno.status == undefined) {
                                wStatus = true;
                                wRetorno = gson.toJson(retorno);
                                var wObjeto = JSON.parse(wRetorno);

                                var wJsonSalve = {
                                    razao_social: wObjeto.razao_social,
                                    atualizado_em: wObjeto.atualizado_em,
                                    simples: wObjeto.simples,
                                    estabelecimento: wObjeto.estabelecimento
                                }

                                const myDate = new Date(Date.now()).toLocaleString().split(',')[0];
                                var sqlUPD = "INSERT INTO KBT_T_CONSULTAS_API (DATREGISTRO, CNPJ, INDBUSCA, SITUACAO, JSON) VALUES ";
                                sqlUPD += "(sysdate,'" + listaConstraits['numcpfcpnj'].replace(/[^0-9]+/g, '') + "','" + listaConstraits['indbusca'] + "','" + wObjeto.estabelecimento.situacao_cadastral + "','" + gson.toJson(wJsonSalve) + "')";
                                // newDataset.addRow(new Array("sql: " + sqlUPD));
                                // printLog('info', 'SQL CNPJ: ' + sqlUPD);
                                var statementWD = connectionWD.prepareStatement(sqlUPD);
                                statementWD.executeUpdate();

                            } else {
                                wStatus = false;
                                wRetorno = retorno.detalhes;
                            }
                        }
                    }

                    if (listaConstraits['indbusca'] == 'CPF') {
                        var retorno = f_consultaCPF(listaConstraits['numcpfcpnj'].replace(/[^0-9]+/g, ''), listaConstraits['dat_nascimento'].replace(/[^0-9]+/g, ''), newDataset);
                        if (retorno != null) {
                            wRetorno = gson.toJson(retorno);
                            var wObjeto = JSON.parse(wRetorno);
                            if (retorno.status == "OK") {
                                wStatus = true;
                                // wRetorno = gson.toJson(retorno);
                                // var wObjeto = JSON.parse(wRetorno);

                                var wJsonSalve = {
                                    nome: wObjeto.nome,
                                    data_inscricao: wObjeto.data_inscricao,
                                    situacao_cadastral: wObjeto.situacao_cadastral
                                }

                                // const myDate = new Date(Date.now()).toLocaleString().split(',')[0];
                                var sqlUPD = "INSERT INTO KBT_T_CONSULTAS_API (DATREGISTRO, CNPJ, INDBUSCA, SITUACAO, JSON) VALUES ";
                                sqlUPD += "(sysdate,'" + listaConstraits['numcpfcpnj'].replace(/[^0-9]+/g, '') + "','" + listaConstraits['indbusca'] + "','" + wObjeto.situacao_cadastral + "','" + gson.toJson(wJsonSalve) + "')";
                                // newDataset.addRow(new Array("sql: " + sqlUPD));
                                printLog('info', 'SQL CPF: ' + sqlUPD);
                                var statementWD = connectionWD.prepareStatement(sqlUPD);
                                statementWD.executeUpdate();

                            } else {
                                wStatus = false;
                                wRetorno = wObjeto.message;
                            }
                        }
                    }


                }


            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        newDataset.addRow(new Array(
            wStatus,
            wRetorno
        ));

        return newDataset;
    }

}

function onMobileSync(user) {

}

function dataAtualFormatada(nDias) {
    var data = new Date();


    if (nDias != undefined) {
        data.setDate(data.getDate() - nDias);
    }

    var dia = data.getDate().toString();
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}


function f_consultaCNPJ(pNumCNPJ) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "cnpj";
    var params = {};
    var Endpoint = pNumCNPJ.replace(/[^0-9]+/g, '') + "?token=" + token;
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
    // data["strParams"] = gson.toJson(params);

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

function f_consultaCPF(pNumCNPJ, pDataNascimento, pDataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "sintegra";
    var params = {};
    var Endpoint = "execute-api.php?token=" + tokenSintegra + "&cpf=" + pNumCNPJ.replace(/[^0-9]+/g, '') + "&data-nascimento=" + pDataNascimento.replace(/[^0-9]+/g, '') + "&plugin=CPF";
    var gson = new com.google.gson.Gson();

    // pDataset.addRow(new Array("Endpoint: " + Endpoint));

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
    // data["strParams"] = gson.toJson(params);

    var jj = gson.toJson(data)


    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }

    // pDataset.addRow(new Array("retorno: " + retorno));
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
