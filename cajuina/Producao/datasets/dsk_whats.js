var debug = false;
var instancia = "3B51511609CAB0324BA2AA3BF7100853"
var token = "B748042B630FAFE9EEC267C1"

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
            listaConstraits['indacao'] = 'ENVIAR';
            listaConstraits['numtelefone'] = '5547988112917';
            listaConstraits['mensagem'] = 'Teste da Z-API Fluig';
        }


        if (listaConstraits['indacao'] == 'ENVIAR') {

            try {


                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';

                var retorno = f_enviaMensagem(listaConstraits['numtelefone'], listaConstraits['mensagem']);
                if (retorno != null) {
                    if (retorno.error == undefined) {
                        wStatus = true;
                        wRetorno = gson.toJson(retorno);
                    } else {
                        wStatus = false;
                        wRetorno = retorno.error;
                    }
                }

            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {

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


function f_enviaMensagem(pNumTelefone, pMensagem) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "whats";
    var params = {};
    var Endpoint = instancia + "/token/" + token + "/send-messages";
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
