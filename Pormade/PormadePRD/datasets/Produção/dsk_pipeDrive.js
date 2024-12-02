var endpoint = '';
var token = "8ead78df2c2858586aa3daec9fe93765fe9be244";

function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    // printLog("info", "## PipeDrive START ##");
    var newDataset = DatasetBuilder.newDataset();


    var listaConstraits = {};
    listaConstraits['indacao'] = "";
    listaConstraits['mail'] = "";
    listaConstraits['nome'] = "";

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    if (listaConstraits['indacao'] == '') {
        listaConstraits['indacao'] = 'ADDUSER';
        listaConstraits['mail'] = "divulgador1700@divulgador.net.br";
        listaConstraits['nome'] = "Marcio Silva";
    }

    try {
        if (listaConstraits['indacao'] == 'ADDUSER') {
            endpoint = "/v1/users?api_token=" + token;

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');
            newDataset.addColumn('id');

            var wRretorno = f_criarConta(listaConstraits['mail'], listaConstraits['nome']);
            if (wRretorno.success == true) {
                var UID = JSON.stringify(wRretorno.data.id);
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    "Cadatro realizado" + "",
                    UID + ""
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    "Erro ao cadastrar",
                    ""
                ));
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error));
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

function f_criarConta(pEmail, pName) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "pipedrive",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {
        name: pName,
        email: pEmail,
        active_flag: true
    }

    var headers = {};
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["params"] = params;

    var gson = new com.google.gson.Gson();
    var datajson = gson.toJson(data);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }

}

