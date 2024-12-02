function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("error", "## pipedriveUsers ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');


    var listaConstraits = {};
    var params = {};

    var connectionWD = null;
    var statementWD = null;


    var hoje = new Date();
    var ontem = new Date(hoje.getTime());
    ontem.setDate(hoje.getDate() - 1);

    var token = "a22cfde57728dfc655c420cce014d01cb701fe65";
    var endpoint = "/v1/users?api_token=" + token;
    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "pipedrive",
            endpoint: endpoint,
            timeoutService: "240",
            method: "GET",
        };

        var headers = {};
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        data["params"] = params;

        var jj = JSON.stringify(data);

        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            printLog("error", "Retorno Vazio");
            newDataset.addRown(new Array("Retorno Vazio"));
            //throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            printLog("error", "## pipedriveDealsUser Sucesso ## " + jr.success);

            if (!jr.success) {
                throw 'Erro na integração com PipeDrive';
            }

            if (jr.data != null) {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                connectionWD = dataSourceWD.getConnection();

                for (var i = 0; i < jr.data.length; i++) {

                    var SQL = "delete from public.kbt_t_dealsUserEng where cod_empresa = 1 and user_id = " + jr.data[i]['id'];
                    var statementWD = connectionWD.prepareStatement(SQL);
                    statementWD.executeUpdate();

                    var SQL = "INSERT INTO public.kbt_t_dealsUserEng( cod_empresa, user_id, nome, email) VALUES  " +
                        "(1," + jr.data[i]['id'] + ",'" + removeAcentos(jr.data[i]['name']) + "','" + jr.data[i]['email'] + "')";
                    statementWD = connectionWD.prepareStatement(SQL);
                    statementWD.executeUpdate();
                }
            }
        }

    } catch (error) {
        printLog("error", "Error: " + error.toString());
        newDataset.addRow(new Array(error.toString()));

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {


}

function removeAcentos(valor) {
    if (valor != null && valor != "") {
        return valor.replace(/[^a-zA-Zs]/g, "");
    } else {
        return valor;
    }
}


function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}

function onMobileSync(user) {

}


var debug = false;
function printLog(tipo, msg) {

    if (debug) {
        var msgs = getValue("WKDef") + " - " + getValue("WKNumProces") + " - " + msg
        if (tipo == 'info') {
            printLog("error", msgs);
        } else if (tipo == 'error') {
            log.error(msgs);
        } else if (tipo == 'fatal') {
            log.fatal(msgs);
        } else {
            log.warn(msgs);
        }
    }
}
