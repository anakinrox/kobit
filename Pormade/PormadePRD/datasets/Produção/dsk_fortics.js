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
    listaConstraits['num_destinatario'] = "";
    listaConstraits['mensagem'] = "";
    listaConstraits['nomUsuario'] = "";
    listaConstraits['codMensagem'] = "";
    listaConstraits['nome_solicitante'] = ''
    listaConstraits['numero_solicitacao'] = ''
    listaConstraits['nome_parceiro'] = ''
    listaConstraits['link'] = '';
    listaConstraits['data'] = '';
    listaConstraits['descInfracao'] = '';
    listaConstraits['numInfracao'] = '';




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

    if (listaConstraits['endpoint'] == "") {

        listaConstraits['endpoint'] = 'mensagem';
        listaConstraits['codMensagem'] = '8'
        listaConstraits['num_destinatario'] = '5547988112917'
        // listaConstraits['num_destinatario'] = '5547996553549'
        // listaConstraits['num_destinatario'] = '47991113692'
        // listaConstraits['num_destinatario'] = '5547991113692'
        listaConstraits['nome_motorista'] = 'Marcio Manoel da Silva'
        listaConstraits['numero_placa'] = 'MGK-9006'
        listaConstraits['link'] = '';
        listaConstraits['data'] = '09/12/2021';
        listaConstraits['descInfracao'] = 'Velocidade';
        listaConstraits['numInfracao'] = '66666';

        listaConstraits['nome_solicitante'] = "Marcio";
        listaConstraits['numero_solicitacao'] = "2222";
        listaConstraits['nome_parceiro'] = "Eu mesmo;"

        listaConstraits['nome_cliente'] = "Marcio";
        listaConstraits['hash_arquivo'] = "INFORMACAO HASH_2";
        listaConstraits['algoritimo'] = "INFORMA ALGORITIMO_w";
        listaConstraits['chave'] = "INFORMACAO CHAVE_2";
        listaConstraits['link1'] = "ENDERECO LINK1_2";
        listaConstraits['link2'] = "ENDERECO LINK2_2";

        listaConstraits['link'] = "https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/ibRofWsaq";
        listaConstraits['token'] = "ibRofWsaq";
        listaConstraits['telefone'] = "0800-642-35-21";

        listaConstraits['tamplate'] = 'instaladornota9'
        listaConstraits['instalador'] = 'Adrian';
        listaConstraits['textoacao'] = 'alteração'

    }


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
    }

    if ((wEmail.trim() == "") || (wSenha.trim() == "")) {
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
    newDataset.addColumn('STATUS');
    newDataset.addColumn('ID');
    newDataset.addColumn('MENSAGEM');

    var gson = new com.google.gson.Gson();

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

            var headers = {};
            headers["Content-Type"] = "application/json";
            data["headers"] = headers;
            data["params"] = params;
            printLog('info', "Monta os dados do Metodo");

            var jj = gson.toJson(data);

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
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                type: 'text',
                                close_session: '0',
                                token: wToken,
                                is_hsm: listaConstraits['codMensagem'],
                                hsm_template_name: "abrirchamado",
                                "hsm_placeholders": [listaConstraits['nomUsuario'], listaConstraits['mensagem']],
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '2') {
                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                type: 'text',
                                close_session: '0',
                                token: wToken,
                                is_hsm: 1,
                                hsm_template_name: "amostra_conffirmacao",
                                hsm_placeholders: [listaConstraits['nome_solicitante'], listaConstraits['numero_solicitacao'], listaConstraits['nome_parceiro']],
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '3') {

                            var link = 'https://fluig.pormade.com.br:8443/volume/stream/Rmx1aWc=/P3Q9MSZ2b2w9RGVmYXVsdCZpZD00NTQ1NzUmdmVyPTEwMDAmZmlsZT1TY2FuXzIwMjEwOTI4XzE3MTU0NC5wZGYmY3JjPTE1MTA0MjY5OTEmc2l6ZT0xLjY4MzgxJnVJZD0zJmZTSWQ9MSZ1U0lkPTEmZD1mYWxzZSZ0a249JnB1YmxpY1VybD10cnVl.pdf';
                            listaConstraits['nome_motorista'] = 'Marcio';
                            listaConstraits['numero_placa'] = 'MGK-9006';
                            listaConstraits['link'] = 'link';
                            listaConstraits['data'] = '09/12/2021';
                            listaConstraits['descInfracao'] = 'Velocidade';
                            listaConstraits['numInfracao'] = '66666';
                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: "multa_motorista",
                                hsm_placeholders: [listaConstraits['nome_motorista'], listaConstraits['numero_placa']],
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '4') {
                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: "algoritmo_hash",
                                hsm_placeholders: [listaConstraits['nome_cliente'], listaConstraits['hash_arquivo'], listaConstraits['algoritimo'], listaConstraits['chave'], listaConstraits['link1'], listaConstraits['link2']],
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '5') {
                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: "avaliacao_servico",
                                hsm_placeholders: [listaConstraits['link'], listaConstraits['token'], listaConstraits['telefone']],
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '6') {
                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: "cadastro_parceiro",
                                hsm_placeholders: [listaConstraits['nome_cliente'], listaConstraits['link1'], listaConstraits['chave']],
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '7') {
                            var hsm_placeholders = [];

                            if (listaConstraits['tamplate'] == 'mestresnota8') {
                                hsm_placeholders.push(listaConstraits['instalador']);
                                hsm_placeholders.push(listaConstraits['nome_cliente']);
                            } else {
                                hsm_placeholders.push(listaConstraits['nome_cliente']);
                            }

                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: listaConstraits['tamplate'],
                                hsm_placeholders: hsm_placeholders,
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        if (listaConstraits['codMensagem'] == '8') {


                            var params = {
                                platform_id: listaConstraits['num_destinatario'],
                                channel_id: "5fd0dc23f48c796d4c607c24",
                                close_session: '0',
                                is_hsm: 1,
                                hsm_template_name: "codigoacao",
                                hsm_placeholders: [listaConstraits['nome_cliente'], listaConstraits['textoacao'], listaConstraits['token']],
                                type: 'text',
                                token: wToken,
                                agent: "luana@pormadeonline.com.br",
                                attendance_id: "5f75d3e7b44ee012ee546533"
                            };
                        }

                        var endpoint = "/v4/message/send";
                        printLog("info", "End Point Envio de mensagem: " + endpoint);

                        var statementWD = null;
                        var connectionWD = null;

                        var contextWD = new javax.naming.InitialContext();
                        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                        connectionWD = dataSourceWD.getConnection();

                        var SQL = "insert into public.kbt_t_mensagensfortics (codmensagem, datregistro, horregistro, json) values (?, CURRENT_DATE, CURRENT_TIME, ?)"

                        statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.setInt(1, parseInt(listaConstraits['codMensagem']));
                        statementWD.setString(2, gson.toJson(params));
                        statementWD.executeUpdate();


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

                        //                        log.dir( params );

                        var jj = gson.toJson(data);
                        var vo = clientService.invoke(jj);
                        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
                            throw "Retorno esta vazio";
                        } else {
                            var jr = JSON.parse(vo.getResult());
                            var wStatus = false;
                            var wMensagem = '';
                            var wIdMensagem = null;
                            if (jr.messages != undefined) {

                                wStatus = true;
                                wIdMensagem = jr.messages.message_id;
                                wMensagem = jr.message
                            } else {
                                // newDataset.addRow(new Array("Erro ao enviar a mensagem: " + jr.error));
                                wStatus = false;
                                wIdMensagem = null;
                                wMensagem = jr.message + ' - ' + jr.error;
                            }

                            newDataset.addRow(new Array(
                                wStatus,
                                wIdMensagem,
                                wMensagem
                            ));
                        }
                    }
                } else {
                    newDataset.addRow(new Array("Erro no login da Fortics"));
                }
            }
        }

    } catch (error) {
        // printLog('error', error.toString());
        // newDataset.addRow(new Array("Conexão com API indiponivel " + error.toString() + ' Linha: ' + error.lineNumber));
    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
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