var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Fortics START ##");
    var newDataset = DatasetBuilder.newDataset();

    var wToken = '';
    var BearerToken = '';
    var listaConstraits = {};
    listaConstraits['endpoint'] = "";
    listaConstraits['colleagueId'] = "";
    listaConstraits['numdestinatario'] = "";
    listaConstraits['mensagem'] = "";
    listaConstraits['nomUsuario'] = "";
    listaConstraits['codMensagem'] = "";

    var params = {};
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    if (listaConstraits['colleagueId'] == "") {
        listaConstraits['colleagueId'] = "admlog"
    }

    var chave = 'fortics';
    var wEmail = "";
    var wSenha = "";

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", listaConstraits['colleagueId'], listaConstraits['colleagueId'], ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("chave", chave, chave, ConstraintType.MUST));
    var usuario = DatasetFactory.getDataset("colleagueParam", null, constraints, null);

    if (usuario.rowsCount > 0) {
        for (var i = 0; i < usuario.rowsCount; i++) {


            if (usuario.getValue(i, "chave") == 'forticsUser') {
                wEmail = usuario.getValue(i, "val_param") + "";
            }

            if (usuario.getValue(i, "chave") == 'forticsSenha') {
                wSenha = usuario.getValue(i, "val_param") + "";
            }
        }
    } else {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", 'admlog', 'admlog', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("chave", chave, chave, ConstraintType.MUST));
        var usuario = DatasetFactory.getDataset("colleagueParam", null, constraints, null);

        for (var i = 0; i < usuario.rowsCount; i++) {

            if (usuario.getValue(i, "chave") == 'forticsUser') {
                wEmail = usuario.getValue(i, "val_param") + "";
            }

            if (usuario.getValue(i, "chave") == 'forticsSenha') {
                wSenha = usuario.getValue(i, "val_param") + "";
            }
        }
    }


    var params = {
        email: wEmail,
        password: wSenha
    };
    var endpoint = "/v4/auth/login";

    printLog('error', "Email: : " + wEmail);
    printLog('error', "Password: : " + wSenha);
    printLog('error', "EndPoimt: : " + endpoint);

    try {
        if (listaConstraits['endpoint'] != '') {
            var clientService = fluigAPI.getAuthorizeClientService();
            var data = {
                companyId: getValue("WKCompany") + "",
                serviceCode: "fortics",
                endpoint: endpoint,
                timeoutService: "240",
                method: "POST",
            };

            // printLog('info', "Obj Data: " + JSON.stringify(data));

            var headers = {};
            headers["Content-Type"] = "application/json";
            data["headers"] = headers;
            data["params"] = params;
            printLog('info', "Monta os dados do Metodo");

            var jj = JSON.stringify(data);

            var vo = clientService.invoke(jj);
            if (vo.getResult() == "" || vo.getResult().isEmpty()) {
                throw "Retorno esta vazio";
            } else {
                var jr = JSON.parse(vo.getResult());

                if (jr.error == undefined) {

                    BearerToken = jr.token;
                    wToken = jr.socket_token;

                    if (listaConstraits['endpoint'] == 'mensagem') {

                        if (listaConstraits['codMensagem'] == '1') {

                            var params = {
                                platform_id: listaConstraits['numdestinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                type: 'text',
                                close_session: '0',
                                token: wToken,
                                is_hsm: listaConstraits['codMensagem'],
                                hsm_template_name: "abrirchamado",
                                "hsm_placeholders": [listaConstraits['nomUsuario'], listaConstraits['mensagem']],
                                agent: wEmail
                            };
                            var endpoint = "/v4/message/send";
                            printLog("info", "End Point Envio de mensagem: " + endpoint);

                            var data = {
                                companyId: getValue("WKCompany") + "",
                                serviceCode: "fortics",
                                endpoint: endpoint,
                                timeoutService: "240",
                                method: "POST",
                            };

                            var headers = {};
                            headers["Authorization"] = "Bearer " + BearerToken;
                            headers["Content-Type"] = "application/json";
                            data["headers"] = headers;
                            data["params"] = params;

                            var jj = JSON.stringify(data);

                            var vo = clientService.invoke(jj);
                            if (vo.getResult() == "" || vo.getResult().isEmpty()) {
                                throw "Retorno esta vazio";
                            } else {
                                var jr = JSON.parse(vo.getResult());
                                if (jr.error == undefined) {
                                    newDataset.addColumn('STATUS');
                                    newDataset.addRow(new Array("Retorno: " + jr.message));

                                } else {
                                    newDataset.addColumn('STATUS');
                                    newDataset.addRow(new Array("Erro ao enviar a mensagem: " + jr.error));
                                }
                            }
                        }
                    }
                } else {
                    newDataset.addColumn('STATUS');
                    newDataset.addRow(new Array("Erro no login da Fortics"));
                }
            }
        }

    } catch (error) {
        printLog('error', error.toString());
        newDataset.addColumn('STATUS');
        newDataset.addRow(new Array("Conexão com API indiponivel " + error.toString()));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

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