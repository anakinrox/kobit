var debug = false;
var newDataset;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {

        var listaConstraits = {};
        var wRecipientId = null;

        listaConstraits['envelope'] = "";
        var gson = new com.google.gson.Gson();
        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
            }
        }

        if (listaConstraits['envelope'] == '') {
            // listaConstraits['envelope'] = '55684e98-c295-42b8-b512-55f586f5b0df';
            listaConstraits['envelope'] = 'c2794c3b-e5a4-4beb-b46e-6c22eb1cf389';
            listaConstraits['emailatual'] = 'amjunior@gmail.com';
            listaConstraits['emailnovo'] = 'ariberto@montibeller.org';
            listaConstraits['destinatarioid'] = '';
        }

        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn("envelopeID");
        newDataset.addColumn("recepientID");
        newDataset.addColumn("nome");
        newDataset.addColumn("email");
        newDataset.addColumn("status");

        var retorno = f_consultarDestinatarios(listaConstraits['envelope']);
        if (retorno != null || retorno != '') {
            if (retorno.errorCode == undefined) {
                var wStatus = '';

                for (var i = 0; i < retorno.signers.length; i++) {

                    if (retorno.signers[i].email.trim() == listaConstraits['emailatual']) {
                        wRecipientId = retorno.signers[i].recipientId;

                        if (retorno.signers[i].status.trim() != 'signed' && retorno.signers[i].status.trim() != 'completed' && retorno.signers[i].status.trim() != 'faxpending') {

                            if (retorno.signers[i].recipientId == listaConstraits['destinatarioid'] || (listaConstraits['destinatarioid'] = '' || listaConstraits['destinatarioid'] == undefined)) {

                                var wRetUPD = f_atualizarDestinatarios(listaConstraits['envelope'], retorno.signers[i].recipientId, listaConstraits['emailnovo'], "");
                                if (wRetUPD.recipientUpdateResults[0].recipientIdGuid != undefined && wRetUPD.errorCode == undefined) {
                                    wStatus = "Atualizado";
                                } else {
                                    wStatus = "Falha ao Atualizar";
                                }

                                newDataset.addRow(new Array(
                                    listaConstraits['envelope'] + "",
                                    retorno.signers[i].recipientId + "",
                                    retorno.signers[i].name + "",
                                    retorno.signers[i].email + "",
                                    wStatus + ""
                                ));
                            }

                        }

                    }
                }
            } else {
                newDataset.addRow(new Array("", "", "", "", "Retorno: " + gson.toJson(retorno)));
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

var debug = false;
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

function f_consultarDestinatarios(pEnvelope) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "docsign";
    var params;
    var gson = new com.google.gson.Gson();
    var headers = {};
    var params;

    var account = "";
    var username = "";
    var password = "";
    var IntegratorKey = "";

    var wIdDocumento = '';

    var constraints = new Array();
    var dataset = DatasetFactory.getDataset("kbt_t_paramdocsign", null, constraints, null);
    if (dataset != null || dataset.rowsCount > 0) {
        account = dataset.getValue(0, "str_conta");
        username = dataset.getValue(0, "str_usuario");
        password = dataset.getValue(0, "str_senha");
        IntegratorKey = dataset.getValue(0, "str_id_integracao");
    } else {
        throw "Parâmetros de integração não encontrados";
    }

    var Endpoint = "/" + account + "/envelopes/" + pEnvelope + '/recipients';
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    var DocuSign = {
        "Username": username,
        "Password": password,
        "IntegratorKey": IntegratorKey
    };

    headers["Accept"] = "*/*";
    headers["X-DocuSign-Authentication"] = gson.toJson(DocuSign);

    data["headers"] = headers;
    data["params"] = params;

    // var jj = JSON.stringify(data);
    var jj = gson.toJson(data)
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        try {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        } catch (error) {
            retorno = error
        }
    }

    return retorno;
}


function f_atualizarDestinatarios(pEnvelope, pRecepientID, pEmail, pNome) {

    var retorno = null;
    var metodo = "PUT";
    var wServiceCode = "docsign";

    var gson = new com.google.gson.Gson();
    var headers = {};
    var account = "";
    var username = "";
    var password = "";
    var IntegratorKey = "";

    var constraints = new Array();
    var dataset = DatasetFactory.getDataset("kbt_t_paramdocsign", null, constraints, null);
    if (dataset != null || dataset.rowsCount > 0) {
        account = dataset.getValue(0, "str_conta");
        username = dataset.getValue(0, "str_usuario");
        password = dataset.getValue(0, "str_senha");
        IntegratorKey = dataset.getValue(0, "str_id_integracao");
    } else {
        throw "Parâmetros de integração não encontrados";
    }

    var Endpoint = "/" + account + "/envelopes/" + pEnvelope + '/recipients';
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    var DocuSign = {
        "Username": username,
        "Password": password,
        "IntegratorKey": IntegratorKey
    };

    headers["Accept"] = "*/*";
    headers["X-DocuSign-Authentication"] = gson.toJson(DocuSign);


    var params = {
        "signers": [
            {
                "email": pEmail + "",
                "name": pNome + "",
                "recipientId": pRecepientID + ""
            }
        ]
    }

    data["headers"] = headers;
    data["params"] = params;

    // var jj = JSON.stringify(data);
    var jj = gson.toJson(data)
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        try {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        } catch (error) {
            retorno = error
        }
    }

    return retorno;
}

