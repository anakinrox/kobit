var debug = false;
var newDataset;

function defineStructure() {

    addColumn("templateId");
    addColumn("uri");
    addColumn("name");
    addColumn("description");
    setKey(["templateId"]);
    addIndex(["templateId"]);

}

function onSync(lastSyncDate) {
    try {
        newDataset = DatasetBuilder.newDataset();
        // newDataset.addColumn("templateId");
        // newDataset.addColumn("uri");
        // newDataset.addColumn("name");
        // newDataset.addColumn("description");

        var retorno = f_consultarTemplate();
        if (retorno != null || retorno != '') {
            if (retorno.resultSetSize > 0) {
                for (var i = 0; i < retorno.envelopeTemplates.length; i++) {
                    newDataset.addOrUpdateRow(new Array(
                        retorno.envelopeTemplates[i].templateId,
                        retorno.envelopeTemplates[i].uri,
                        retorno.envelopeTemplates[i].name,
                        retorno.envelopeTemplates[i].description
                    ));
                }
            }
        }

    } catch (error) {
        // newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    try {
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn("templateId");
        newDataset.addColumn("uri");
        newDataset.addColumn("name");
        newDataset.addColumn("description");

        var retorno = f_consultarTemplate();
        if (retorno != null || retorno != '') {
            if (retorno.resultSetSize > 0) {
                for (var i = 0; i < retorno.envelopeTemplates.length; i++) {
                    newDataset.addOrUpdateRow(new Array(
                        retorno.envelopeTemplates[i].templateId,
                        retorno.envelopeTemplates[i].uri,
                        retorno.envelopeTemplates[i].name,
                        retorno.envelopeTemplates[i].description
                    ));
                }
            }
        }

    } catch (error) {
        // newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('templateId', 'uri', 'name', 'description');

    var result = {
        'fields': colunastitulo,
        'constraints': constraints,
        'sortingFields': sortingFields
    };
    return result;
}


function f_consultarTemplate() {

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

    var Endpoint = "/" + account + "/templates";
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