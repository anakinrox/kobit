var debug = false;
var gToken = "Go0uiej80fXJtyE7dBEmeICT-ql_cG7YTIDpE7HW"
var gDiasRetencao = 30;
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

        }


        if (listaConstraits['indacao'] == 'CNPJ') {

            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                var connectionWD = dataSourceWD.getConnection();

                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;
                var wChave01 = listaConstraits['cnpj'].replace(/[^0-9]+/g, '');
                var wChave02 = '';
                var SQL = '';


                SQL = "SELECT json FROM kbt_t_consultas_api where indConsulta = 'CNPJ' and chave01 = '" + wChave01 + "' and datregistro >='" + dataAtualFormatada(gDiasRetencao).split('/').reverse().join('-') + "'";
                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    wAchou = true;
                    wStatus = true;
                    wRetorno = rsWD.getString("json");
                }


                if (wAchou == false) {
                    if (wChave01.length >= 14) {
                        var retorno = f_consultaCNPJ(wChave01, newDataset);
                        if (retorno != null) {
                            if (retorno.data_count > 0) {
                                wStatus = true;
                                wRetorno = gson.toJson(retorno.data);

                                var sqlUPD = "INSERT INTO kbt_t_consultas_api (datregistro, indconsulta, chave01, situacao, json) VALUES ";
                                sqlUPD += "(CURRENT_DATE,'CNPJ','" + wChave01 + "','" + retorno.data[0].situacao_cadastral + "','" + wRetorno + "')";
                                var statementWD = connectionWD.prepareStatement(sqlUPD);
                                statementWD.executeUpdate();

                            } else {
                                wStatus = false;
                                wRetorno = gson.toJson(retorno.errors);
                            }
                        }
                    }
                }


            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                newDataset.addRow(new Array(
                    wStatus,
                    wRetorno
                ));

                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

        if (listaConstraits['indacao'] == 'CPF') {

            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                var connectionWD = dataSourceWD.getConnection();

                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;
                var wChave01 = listaConstraits['cpf'].replace(/[^0-9]+/g, '');
                var wChave02 = listaConstraits['dataaniversario'];

                var SQL = '';
                SQL = "SELECT json FROM kbt_t_consultas_api where indConsulta = 'CPF' and chave01 = '" + wChave01 + "' and chave02 = '" + wChave02 + "' and  datregistro >='" + dataAtualFormatada(gDiasRetencao).split('/').reverse().join('-') + "'";
                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();

                while (rsWD.next()) {
                    wAchou = true;
                    wStatus = true;
                    wRetorno = rsWD.getString("json");
                }

                if (wAchou == false) {
                    var retorno = f_consultaCPF(wChave01, wChave02, newDataset);
                    if (retorno != null) {
                        if (retorno.data_count > 0) {
                            wStatus = true;
                            wRetorno = gson.toJson(retorno.data);

                            var sqlUPD = "INSERT INTO kbt_t_consultas_api (datregistro, indconsulta, chave01, chave02, situacao, json) VALUES ";
                            sqlUPD += "(CURRENT_DATE,'CPF','" + wChave01 + "','" + wChave02 + "','" + retorno.data[0].situacao_cadastral + "','" + wRetorno + "')";
                            var statementWD = connectionWD.prepareStatement(sqlUPD);
                            statementWD.executeUpdate();
                        } else {
                            wStatus = false;
                            wRetorno = gson.toJson(retorno.errors);
                        }
                    }
                }

            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                newDataset.addRow(new Array(
                    wStatus,
                    wRetorno
                ));

                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

        if (listaConstraits['indacao'] == 'NIS') {

            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                var connectionWD = dataSourceWD.getConnection();

                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;
                var wChave01 = listaConstraits['nis'].replace(/[^0-9]+/g, '');
                var wChave02 = listaConstraits['nome'];
                var wChave03 = listaConstraits['dataaniversario'];
                var wChave04 = listaConstraits['cpf'].replace(/[^0-9]+/g, '');

                var SQL = '';
                SQL = "SELECT json FROM kbt_t_consultas_api where indConsulta = 'NIS' and chave01 = '" + wChave01 + "' and chave02 = '" + wChave02 + "' and chave03 = '" + wChave03 + "' and chave04 = '" + wChave04 + "' and  datregistro >='" + dataAtualFormatada(gDiasRetencao).split('/').reverse().join('-') + "'";
                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();

                while (rsWD.next()) {
                    wAchou = true;
                    wStatus = true;
                    wRetorno = rsWD.getString("json");
                }

                if (wAchou == false) {
                    var retorno = f_consultaNIS(wChave01, wChave02, wChave04, wChave03, newDataset);
                    if (retorno != null) {
                        if (retorno.data_count > 0) {
                            wStatus = true;
                            wRetorno = gson.toJson(retorno.data);

                            var sqlUPD = "INSERT INTO kbt_t_consultas_api (datregistro, indconsulta, chave01, chave02, chave03, chave04, situacao, json) VALUES ";
                            sqlUPD += "(CURRENT_DATE,'NIS','" + wChave01 + "','" + wChave02 + "','" + wChave03 + "','" + wChave04 + "','" + retorno.data[0].mensagem + "','" + wRetorno + "')";
                            var statementWD = connectionWD.prepareStatement(sqlUPD);
                            statementWD.executeUpdate();
                        } else {
                            wStatus = false;
                            wRetorno = gson.toJson(retorno.errors);
                        }
                    }
                }

            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                newDataset.addRow(new Array(
                    wStatus,
                    wRetorno
                ));

                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

        if (listaConstraits['indacao'] == 'DETRAN') {

            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                var connectionWD = dataSourceWD.getConnection();

                var gson = new com.google.gson.Gson();
                newDataset.addColumn('autuacao');
                newDataset.addColumn('orgao');
                newDataset.addColumn('data');
                newDataset.addColumn('hora');
                newDataset.addColumn('descricao');
                newDataset.addColumn('local');
                newDataset.addColumn('valor');
                newDataset.addColumn('situacao');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;
                var wChave01 = listaConstraits['renavan'].replace(/[^0-9]+/g, '');

                if (wAchou == false) {
                    var retorno = f_consultaDETRAN(wChave01, newDataset);
                    if (retorno != null) {
                        if (retorno.data_count > 0) {
                            wStatus = true;
                            wRetorno = gson.toJson(retorno.data);

                            for (var i = 0; i < retorno.data[0].autuacoes.length; i++) {

                                newDataset.addRow(new Array(
                                    retorno.data[0].autuacoes[i].auto + "",
                                    retorno.data[0].autuacoes[i].orgao + "",
                                    retorno.data[0].autuacoes[i].data + "",
                                    retorno.data[0].autuacoes[i].hora + "",
                                    retorno.data[0].autuacoes[i].descricao + "",
                                    retorno.data[0].autuacoes[i].local + "",
                                    retorno.data[0].autuacoes[i].valor + "",
                                    retorno.data[0].autuacoes[i].situacao + ""
                                ));

                            }



                        }
                    }
                }

                // newDataset.addRow(new Array(
                //     wStatus,
                //     wRetorno
                // ));

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


function f_consultaCNPJ(pNumCNPJ, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "infosimples";
    var params = {};

    var Endpoint = "/v2/consultas/receita-federal/cnpj?token=" + gToken + "&timeout=600&cnpj=" + pNumCNPJ + "&origem=web";
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

    var jj = gson.toJson(data);

    // dataset.addRow(new Array("EndPoint: " + Endpoint));

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}


function f_consultaCPF(pNumCPF, pDatNascimento, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "infosimples";
    var params = {};

    var Endpoint = "/v2/consultas/receita-federal/cpf?token=" + gToken + "&timeout=600&cpf=" + pNumCPF + "&birthdate=" + pDatNascimento.split('/').reverse().join('-') + "&origem=web";
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

    var jj = gson.toJson(data);
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function f_consultaNIS(pNis, pNome, pNumCPF, pDatNascimento, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "infosimples";
    var params = {};

    var Endpoint = "/v2/consultas/dataprev/qualificacao?token=" + gToken + "&timeout=600&nis=" + pNis + "&name=" + pNome.replace(/ /g, '%20') + "&cpf=" + pNumCPF + "&birthdate=" + pDatNascimento.split('/').reverse().join('-');
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

    // dataset.addRow(new Array("EndPoint: " + Endpoint));

    // return false;
    var jj = gson.toJson(data);
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        // dataset.addRow(new Array(vo.getResult()));
        // printLog('info', 'Erro marcio: ' + vo.getResult());
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}


function f_consultaDETRAN(pRenavan, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "infosimples";
    var params = {};
    // 
    // var Endpoint = "/v2/consultas/dataprev/qualificacao?token=" + gToken + "&timeout=600&nis=" + pNis + "&name=" + pNome.replace(/ /g, '%20') + "&cpf=" + pNumCPF + "&birthdate=" + pDatNascimento.split('/').reverse().join('-');
    var Endpoint = "/v2/consultas/detran/pr/veiculo-completa?token=" + gToken + "&timeout=600&renavam=" + pRenavan;
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

    // dataset.addRow(new Array("EndPoint: " + Endpoint));

    // return false;
    var jj = gson.toJson(data);
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        // dataset.addRow(new Array(vo.getResult()));
        // printLog('info', 'Erro marcio: ' + vo.getResult());
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
