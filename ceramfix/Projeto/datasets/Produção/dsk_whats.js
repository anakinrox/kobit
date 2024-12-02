var debug = false;
var instancia = "3B4D542EA3FF60780B8696EA13684D52"
var tokenZAPI = "468C700EA9DF9FD0C6056724"
var tokenZenvia = "mcEaETeplFmz-DJRAChMzKt6PAC28bXZ5HhW"
var GwNumTelefoneOrigem = "554791832890";

var newDataset;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {


        newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'LER';
            listaConstraits['numremetente'] = 'spectacular-office';
            listaConstraits['numdestinatario'] = '5547988112917';
            listaConstraits['nomdestinatario'] = 'Marcio';
            listaConstraits['mensagem'] = 'Teste da Zenvia pelo Fluig';
            listaConstraits['codmensagem'] = '1';
            listaConstraits['userfluig'] = 'admlog';

        }


        if (listaConstraits['indacao'] == 'ENVIAR') {
            try {
                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wMensagemSend = (listaConstraits['codmensagem'] == '-1' ? listaConstraits['mensagem'] : f_zenvia_getMensagemPadrao(listaConstraits['codmensagem']) + ' ' + listaConstraits['mensagem'])
                var wStatus = false;
                var wRetorno = '';
                var wJsonMsg;
                var wIdTemplate;
                var wTokenTemplate;

                var wBoasVindas = f_zenvia_boasvindas(listaConstraits['numdestinatario'], newDataset);
                if (!wBoasVindas) {
                    wIdTemplate = 1;
                    wTokenTemplate = "0b4b3ada-9f6d-4107-a355-c6991c915296";

                    wJsonMsg = {
                        from: GwNumTelefoneOrigem,
                        to: listaConstraits['numdestinatario'],
                        contents: [
                            {
                                type: "template",
                                templateId: wTokenTemplate,
                                fields: {
                                    "nome_usuario": listaConstraits['nomdestinatario']
                                }
                            }
                        ]
                    }

                    var wRetorno = f_sendMensagem(listaConstraits['numremetente'], listaConstraits['numdestinatario'], listaConstraits['userfluig'], wJsonMsg, wIdTemplate, newDataset)
                }

                wIdTemplate = 2;
                wTokenTemplate = "ecbae535-6940-4c1e-8d1a-7eb5e583f726";
                wJsonMsg = {
                    from: GwNumTelefoneOrigem,
                    to: listaConstraits['numdestinatario'],
                    contents: [
                        {
                            type: "template",
                            templateId: wTokenTemplate,
                            fields: {
                                "status": wMensagemSend
                            }
                        }
                    ]
                }

                var wRetorno = f_sendMensagem(listaConstraits['numremetente'], listaConstraits['numdestinatario'], listaConstraits['userfluig'], wJsonMsg, wIdTemplate, newDataset)


                // // var retorno = f_enviaMensagemZAPI(listaConstraits['numtelefone'], listaConstraits['mensagem']);
                // // f_enviaContatoZenvia(listaConstraits['numdestinatario']);
                // var retorno = f_enviaMensagemZenvia(listaConstraits['numremetente'], listaConstraits['numdestinatario'], wJsonMsg);
                // if (retorno != null) {
                //     if (retorno.error == undefined) {
                //         wStatus = true;
                //         wRetorno = gson.toJson(retorno);
                //         f_zenvia_insertMensagem(retorno, listaConstraits['userfluig'], wIdTemplate, newDataset);
                //     } else {
                //         wStatus = false;
                //         wRetorno = retorno.error;
                //     }
                // }
            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                newDataset.addRow(new Array(
                    wRetorno.status,
                    wRetorno.retorno
                ));
            }
        }

        if (listaConstraits['indacao'] == 'LER') {

            // listaConstraits['numremetente']
            f_zenvia_lerMensagens(GwNumTelefoneOrigem, listaConstraits['numdestinatario'], newDataset);
        }

        if (listaConstraits['indacao'] == 'NAOLIDA') {
            f_zenvia_getMensagemNova(GwNumTelefoneOrigem, listaConstraits['numdestinatario'], newDataset);
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
    var dia = data.getDate().toString();

    if (nDias != undefined) {
        data.setDate(data.getDate() - nDias);
    }
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

function f_enviaMensagemZAPI(pNumTelefone, pMensagem) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "whats";
    var params = {};
    var Endpoint = instancia + "/token/" + tokenZAPI + "/send-messages";
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


    params = {
        "phone": pNumTelefone,
        "message": pMensagem
    }

    data["headers"] = headers;
    // data["params"] = params;
    data["strParams"] = gson.toJson(params);
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

function f_enviaContatoZenvia(pNumTelefone) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "zenvia";
    var params = {};
    var Endpoint = "v2/contacts";
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
    headers["X-API-TOKEN"] = tokenZenvia;


    params = {
        channels: {
            email: "",
            mobile: pNumTelefone,
            landline: pNumTelefone
        }
    }

    data["headers"] = headers;
    // data["params"] = params;
    data["strParams"] = gson.toJson(params);
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

function f_sendMensagem(numremetente, numdestinatario, userfluig, wJsonMsg, wIdTemplate, newDataset) {
    var wRetorno;
    var wStatus
    var gson = new com.google.gson.Gson();
    // var retorno = f_enviaMensagemZAPI(listaConstraits['numtelefone'], listaConstraits['mensagem']);
    // f_enviaContatoZenvia(listaConstraits['numdestinatario']);
    var retorno = f_enviaMensagemZenvia(numremetente, numdestinatario, wJsonMsg);
    if (retorno != null) {
        if (retorno.error == undefined) {
            wRetorno = {
                status: true,
                retorno: gson.toJson(retorno)
            }
            f_zenvia_insertMensagem(retorno, userfluig, wIdTemplate, newDataset);
        } else {
            wRetorno = {
                status: false,
                retorno: retorno.error
            }

        }
    } else {
        wRetorno = {
            status: false,
            retorno: ''
        }
    }

    return wRetorno;
}

function f_enviaMensagemZenvia(pNumTelefoneOrigem, pNumTelefone, wJsonMsg) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "zenvia";
    var params = {};
    var Endpoint = "v2/channels/whatsapp/messages";
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
    headers["X-API-TOKEN"] = tokenZenvia;


    params = wJsonMsg

    data["headers"] = headers;
    // data["params"] = params;
    data["strParams"] = gson.toJson(params);
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


function f_zenvia_boasvindas(pNumDestinatario, newDataset) {
    try {
        var rsWD = null;
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var wRetorno = false;



        var SQL = "select 1 from mensagem_zenvia where num_telefone_dest = '" + pNumDestinatario + "' and id_template = 1  and rownum  = 1";
        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wRetorno = true;
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wRetorno;

    }
}


function f_zenvia_insertMensagem(objRetorno, pUserFluig, pIdTemplate, newDataset) {
    try {
        var rsWD = null;
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var wTexto = (pIdTemplate == 1 ? objRetorno.contents[0].fields.nome_usuario : objRetorno.contents[0].fields.status);

        var sql = " INSERT INTO MENSAGEM_ZENVIA ( ID, DIRECAO, TIPO, TEXTO, ID_DOCUMENTO, OBS,	NUM_TELEFONE_DEST, 	NUM_TELEFONE_REMET,	STATUS,  DATA_MENSAGEM, USERFLUIG, ID_TEMPLATE ) VALUES "
        sql += "('" + objRetorno.id + "', '" + objRetorno.direction + "', '" + objRetorno.contents[0].type + "', '" + wTexto + "',null, '" + gson.toJson(objRetorno) + "','" + objRetorno.to + "', '" + objRetorno.from + "', '', sysdate, '" + pUserFluig + "'," + pIdTemplate + ") ";
        statementWD = connectionWD.prepareStatement(sql);
        statementWD.executeUpdate();


    } catch (error) {
        newDataset.addRow(new Array("Erro Insert: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

    }
}

function f_zenvia_lerMensagens(pNumRemetente, pNumDestinatario, newDataset) {
    try {
        var rsWD = null;
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        // var gson = new com.google.gson.Gson();

        newDataset.addColumn('rownum');
        newDataset.addColumn('id');
        newDataset.addColumn('direcao');
        newDataset.addColumn('tipo');
        newDataset.addColumn('texto');
        newDataset.addColumn('documento');
        newDataset.addColumn('status');
        newDataset.addColumn('data');
        newDataset.addColumn('hora');

        var SQL = "select  sequencia, ID, DIRECAO, TIPO, TEXTO, ID_DOCUMENTO, OBS, STATUS,  TO_CHAR(DATA_MENSAGEM, 'DD/MM/YYYY') as DATA_MENSAGEM, TO_CHAR(DATA_MENSAGEM, 'HH24:MI:SS') as HORA_MENSAGEM from MENSAGEM_ZENVIA where NUM_TELEFONE_REMET = '" + pNumRemetente + "' and NUM_TELEFONE_DEST = '" + pNumDestinatario + "' and (id_template <> 1 or id_template is null) order by sequencia asc ";
        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            newDataset.addRow(new Array(
                rsWD.getString('sequencia') + "",
                rsWD.getString('ID') + "",
                rsWD.getString('DIRECAO') + "",
                rsWD.getString('TIPO') + "",
                rsWD.getString('TEXTO') + "",
                rsWD.getString('ID_DOCUMENTO') + "",
                rsWD.getString('STATUS') + "",
                rsWD.getString('DATA_MENSAGEM') + "",
                rsWD.getString('HORA_MENSAGEM') + ""
            ));

            f_zenvia_marcaComoLida(rsWD.getString('sequencia'));
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro Ler: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_zenvia_getMensagemPadrao(codMensagem) {
    var wMensagem = '';

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('codigo', codMensagem, codMensagem, ConstraintType.MUST));

    var dataset = DatasetFactory.getDataset("kbt_t_whatsmensagem", null, constraints, null);
    if (dataset != null && dataset.rowsCount > 0) {
        for (i = 0; i < dataset.rowsCount; i++) {
            wMensagem = dataset.getValue(i, "mensagem")
        }
    }
    return wMensagem;
}

function f_zenvia_getMensagemNova(pNumRemetente, pNumDestinatario, newDataset) {
    try {
        var rsWD = null;
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var wMensagemNova = false;
        newDataset.addColumn('nova');


        var SQL = "select 1 from MENSAGEM_ZENVIA where direcao = 'IN' and NUM_TELEFONE_REMET = '" + pNumRemetente + "' and NUM_TELEFONE_DEST = '" + pNumDestinatario + "'  and (status = '' or status is null) and (status = '' or status is null) and (id_template <> 1 or id_template is null)";
        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wMensagemNova = true;
        }

        newDataset.addRow(new Array(
            wMensagemNova
        ));


    } catch (error) {
        newDataset.addRow(new Array("Erro Ler: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}


function f_zenvia_marcaComoLida(pIdSequencia) {
    try {
        var rsWD = null;
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var wMensagemNova = false;

        try {
            var SQLUPD = "update MENSAGEM_ZENVIA set status = 'L', api_status = 'READ' where sequencia = " + pIdSequencia + " and (status = '' or status is null)";
            statementWD = connectionWD.prepareStatement(SQLUPD);
            statementWD.executeUpdate();

            wMensagemNova = true;
        } catch (error) {
            wMensagemNova = false;
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro Ler: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}