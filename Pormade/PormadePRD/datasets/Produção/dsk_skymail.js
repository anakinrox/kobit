var endpoint = '';

function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    // printLog("info", "## SkyMail START ##");
    var newDataset = DatasetBuilder.newDataset();


    var listaConstraits = {};
    listaConstraits['indacao'] = "";
    listaConstraits['mail'] = "";
    listaConstraits['nome'] = "";
    listaConstraits['senha'] = "";

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    if (listaConstraits['indacao'] == '') {
        listaConstraits['indacao'] = 'ADDUSER';
        listaConstraits['mail'] = "divulgador86859@@divulgador.net.br";
        listaConstraits['nome'] = "BRUNO ALVES DOS SANTOS BATISTA";
        listaConstraits['senha'] = "DIV86859@QDticB*";
    }

    try {
        if (listaConstraits['indacao'] == 'ADDUSER') {
            endpoint = "/v1/mailbox";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');

            var wRretorno = f_criarConta(listaConstraits['mail'], listaConstraits['nome'], listaConstraits['senha']);

            log.info('Retorno skymail')
            log.dir(wRretorno)

            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    ""
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message + ""
                ));
            }
        }

        if (listaConstraits['indacao'] == 'TESTE') {

        }

    } catch (error) {
        newDataset.addRow(new Array("erro", "Erro: " + error));
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

function f_criarConta(pEmail, pName, pSenha) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "skymail",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {
        mail: pEmail,
        displayname: pName,
        password: pSenha,
        accounttype: 44,
        confirm_purchase: "true"
    }

    var headers = {};
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["params"] = params;

    var gson = new com.google.gson.Gson();
    var jj = gson.toJson(data);

    var vo = clientService.invoke(jj);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }

}

