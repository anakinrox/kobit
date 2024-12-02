var debug = false;
var newDataset;

function defineStructure() {

    addColumn("templateId");
    addColumn("recipientId");
    addColumn("recipientIdGuid");
    addColumn("requireUploadSignature");
    addColumn("name");
    addColumn("userId");
    addColumn("roleName");
    addColumn("routingOrder");
    setKey(["templateId", "recipientId"]);
    // setKey(["recipientId"]);
    addIndex(["templateId", "recipientId"])
    // addIndex(["recipientId"]);

}

function onSync(lastSyncDate) {
    try {
        newDataset = DatasetBuilder.newDataset();
        // newDataset.addColumn("templateId");
        // newDataset.addColumn("recipientId");
        // newDataset.addColumn("recipientIdGuid");
        // newDataset.addColumn("requireUploadSignature");
        // newDataset.addColumn("name");
        // newDataset.addColumn("userId");
        // newDataset.addColumn("roleName");
        // newDataset.addColumn("routingOrder");

        var constraints = new Array();
        var dataset = DatasetFactory.getDataset("dsk_docusign_template", null, constraints, null);
        if (dataset != null || dataset.rowsCount > 0) {
            for (var x = 0; x < dataset.rowsCount; x++) {
                // newDataset.addRow(new Array("Template: " + dataset.getValue(x, "templateId")));

                var retorno = f_consultarDestinatarios(dataset.getValue(x, "templateId"));
                if (retorno != null || retorno != '') {
                    if (retorno.errorCode == undefined) {
                        for (var i = 0; i < retorno.signers.length; i++) {
                            newDataset.addOrUpdateRow(new Array(
                                dataset.getValue(x, "templateId"),
                                retorno.signers[i].recipientId,
                                retorno.signers[i].recipientIdGuid,
                                retorno.signers[i].requireUploadSignature,
                                retorno.signers[i].name,
                                retorno.signers[i].userId,
                                retorno.signers[i].roleName,
                                retorno.signers[i].routingOrder
                            ));
                        }
                    }
                }
            }
        } else {
            // newDataset.addRow(new Array("ELSE: "));
        }
    } catch (error) {
        // newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn("templateId");
        newDataset.addColumn("recipientId");
        newDataset.addColumn("recipientIdGuid");
        newDataset.addColumn("requireUploadSignature");
        newDataset.addColumn("name");
        newDataset.addColumn("userId");
        newDataset.addColumn("roleName");
        newDataset.addColumn("routingOrder");
        var gson = new com.google.gson.Gson();

        var constraints = new Array();
        var dataset = DatasetFactory.getDataset("dsk_docusign_template", null, constraints, null);
        if (dataset != null || dataset.rowsCount > 0) {
            for (var x = 0; x < dataset.rowsCount; x++) {
                // newDataset.addRow(new Array("Template: " + dataset.getValue(x, "templateId")));
                var retorno = f_consultarDestinatarios(dataset.getValue(x, "templateId"));
                // newDataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));

                if (retorno != null || retorno != '') {
                    if (retorno.errorCode == undefined) {
                        // if (retorno.signers.length > 0) {
                        //     newDataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
                        // }

                        for (var i = 0; i < retorno.signers.length; i++) {
                            newDataset.addRow(new Array(
                                dataset.getValue(x, "templateId"),
                                retorno.signers[i].recipientId,
                                retorno.signers[i].recipientIdGuid,
                                retorno.signers[i].requireUploadSignature,
                                retorno.signers[i].name,
                                retorno.signers[i].userId,
                                retorno.signers[i].roleName,
                                retorno.signers[i].routingOrder
                            ));
                        }
                    }
                }
            }
        } else {
            // newDataset.addRow(new Array("ELSE: "));
        }
    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('templateId', 'recipientId', 'recipientIdGuid', 'requireUploadSignature', 'name', 'userId', 'roleName', 'routingOrder');

    var result = {
        'fields': colunastitulo,
        'constraints': constraints,
        'sortingFields': sortingFields
    };
    return result;

}


function f_consultarDestinatarios(pIdTamplete) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "docsign";
    var params;
    var gson = new com.google.gson.Gson();

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


    var Endpoint = "/" + account + "/templates/" + pIdTamplete + "/recipients";
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // var params;
    var DocuSign = {
        "Username": username,
        "Password": password,
        "IntegratorKey": IntegratorKey
    };
    var headers = {};
    // headers["content-type"] = "application/json";
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