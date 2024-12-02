function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## JotForm START ##");
    var IdForm = '213066703931048';
    var newDataset = DatasetBuilder.newDataset();
    var listaConstraits = {};
    listaConstraits['datini'] = '';
    listaConstraits['datafim'] = '';

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    // if (listaConstraits['datini'] == '') {
    //     listaConstraits['datini'] = '2022-02-03';
    //     listaConstraits['datafim'] = '2022-02-04';
    // }

    try {
        var connectionWD = null;
        var statementWD = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();

        newDataset.addColumn('idresposta');
        newDataset.addColumn('data');
        newDataset.addColumn('nome');
        newDataset.addColumn('indganho');
        newDataset.addColumn('indicado');
        newDataset.addColumn('codigoparceiro');
        newDataset.addColumn('pipe');
        newDataset.addColumn('notageral');

        var SQL = "select distinct idform, idresposta, datRegistro from kbt_t_forms_resposta where idForm = '" + IdForm + "'";

        if ((listaConstraits['datini'] != '') && (listaConstraits['datafim'] != '')) {
            SQL += " and datregistro between '" + listaConstraits['datini'] + "' and '" + listaConstraits['datafim'] + "'";
        }


        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {

            var idresposta = rsWD.getString("idresposta");
            var datRegistro = rsWD.getString("datRegistro");;
            var nomRegistro = null;
            var nomIndicado = null;
            var numParceiro = null;
            var indGanho = null;
            var indPipe = '';
            var notaGeral = '';

            var SQL = "select idpergunta, resposta from kbt_t_forms_resposta where idform = '" + rsWD.getString("idform") + "' and idresposta = '" + rsWD.getString("idresposta") + "'";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWDresp = statementWD.executeQuery();
            while (rsWDresp.next()) {

                if (rsWDresp.getString("idpergunta") == 8) {
                    nomRegistro = rsWDresp.getString("resposta");
                }

                if (rsWDresp.getString("idpergunta") == 4) {
                    numParceiro = rsWDresp.getString("resposta");
                }

                if (rsWDresp.getString("idpergunta") == 192) {
                    indGanho = false;

                    var wString = rsWDresp.getString("resposta");
                    var wFind = wString.indexOf("50");
                    if (wFind > 0) {
                        indGanho = true;
                    }
                }

                if (rsWDresp.getString("idpergunta") == 123) {
                    notaGeral = rsWDresp.getString("resposta");
                }

                if (rsWDresp.getString("idpergunta") == 147) {
                    nomIndicado = rsWDresp.getString("resposta");
                }


            }

            var SQL = "select idpipe from kbt_t_forms_pipe where idform = '" + rsWD.getString("idform") + "' and idresposta = '" + rsWD.getString("idresposta") + "'";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWDPipe = statementWD.executeQuery();
            while (rsWDPipe.next()) {

                var params = {};
                var token = "3ac9343a186fda82cc6732e515636681bec55372";
                var endpoint = "/v1/deals/" + rsWDPipe.getString("idpipe") + "?&api_token=" + token;
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
                    // printlog("info", "Retorno Vazio");
                    newDataset.addRown(new Array("Retorno Vazio"));
                    //throw "Retorno esta vazio";
                } else {
                    var jr = JSON.parse(vo.getResult());

                    if (jr.success) {
                        indPipe = jr.data['status'];
                    }
                }

            }

            if (indPipe == 'open') {
                indPipe = 'Aberto';
            }
            if (indPipe == 'won') {
                indPipe = 'Ganho';
            }
            if (indPipe == 'loss') {
                indPipe = 'Perdido';
            }
            if (indPipe == 'deleted') {
                indPipe = 'Excluido';
            }



            newDataset.addRow(
                new Array(
                    idresposta + "",
                    datRegistro + "",
                    nomRegistro + "",
                    indGanho + "",
                    nomIndicado + "",
                    numParceiro + "",
                    indPipe + "",
                    notaGeral + ""
                ));



        }

    } catch (error) {
        log.info("Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString()));

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return newDataset;
    }

}

function onMobileSync(user) {

}

var debug = true;
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