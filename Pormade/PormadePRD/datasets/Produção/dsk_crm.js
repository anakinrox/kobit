var debug = false;
var G_Endpoint = '';
var G_Token = "c72c53905d28d2eaaee0d1d2cd11a287";

function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## CRM START ##");
    var newDataset = DatasetBuilder.newDataset();


    var listaConstraits = {};
    listaConstraits['indacao'] = "";
    listaConstraits['documentid'] = "";
    listaConstraits['json'] = "";
    listaConstraits['id_crm'] = "";
    listaConstraits['id_deal'] = "";
    listaConstraits['observacao'] = "";


    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
        }
    }


    if (listaConstraits['indacao'] == '') {


        // listaConstraits['indacao'] = 'ADDPESSOA';

        listaConstraits['nome'] = 'Marcio Manoel da Silva';
        listaConstraits['cpf_cnpj'] = 'CPF';
        listaConstraits['documento'] = '029.253.649-69';
        listaConstraits['rg'] = '029';
        listaConstraits['observacao'] = '';
        listaConstraits['dat_nascimento'] = '20/12/1979';
        listaConstraits['dat_cadastro'] = '20/12/1979';
        listaConstraits['cep'] = '89251060';
        listaConstraits['endereco'] = 'Rua Felipe Schmidt';
        listaConstraits['numero'] = '218';
        listaConstraits['complemento'] = 'Ap 308';
        listaConstraits['bairro'] = 'Centro';
        listaConstraits['cidade'] = 'Jaraguá do Sul';
        listaConstraits['uf'] = 'SC';
        listaConstraits['pais'] = 'Brasil';
        listaConstraits['end_cobranca'] = true;
        listaConstraits['end_entrega'] = false;
        listaConstraits['telefones'] = ['4720202619', '47988112917'];
        listaConstraits['emails'] = ['marcio@kobit.com.br'];
        listaConstraits['tipo_pessoa'] = [1, 2];



        listaConstraits['indacao'] = 'ADDCARD2';
        // var obj = {
        //     area: "CRM", // Fixo
        //     idPessoa: null,
        //     datFechamento: null,
        //     id_crm: 1302,
        //     id_origem: 16,

        //     titulo: "Card - Pormade Movel",
        //     nome: "Marcio Manoel da Silva",
        //     telefone: "(47) 98811-2917",
        //     valor: 0,
        //     proposta: 0,

        // }

        var obj = {
            area: "CRMADVI",
            idPessoa: "",
            datFechamento: "",
            id_crm: 2955,
            id_origem: "85",
            nome: "Gustavo Alves",
            telefone: "+55 (62) 98214-2932",
            cidade_uf: 5208707.0,
            pormademovel: "S",
            motorista: "Nelson  Luis de Souza",
            vendedor: "LILIANE SOUSA SILVA",
            usuario_captura: "Nelson  Luis de Souza",
            observacao: "Observação: Abordamos o sr Gustavo,  na semana passada aqui no condomínio Jardins França e, ele havia agendado uma visita com apresentação do showroom para hoje mas, como teve problemas com nosso concorrente nas portas, também kit porta pronta, onde atrasaram 2 meses\nProfissão: CONSTRUTOR \n Cadastro realizado via App da Kobit.",
            tipo_obra: "N",
            etiqueta: ""
        }



        listaConstraits['json'] = JSON.stringify(obj);

        // listaConstraits['indacao'] = 'ADDNOTE';
        listaConstraits['id_crm'] = 846;
        listaConstraits['id_deal'] = 84098;
        listaConstraits['observacao'] = "TESTE";

    }

    printLog("info", "INDACAO2: " + listaConstraits['indacao']);


    try {
        if (listaConstraits['indacao'] == 'ADDPESSOA') {
            G_Endpoint = "/api.rule?sys=NMB";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');
            var wJson = {};

            var nomCidade = listaConstraits['cidade'].toUpperCase();
            nomCidade = retira_acentos(nomCidade);

            wJson['name'] = listaConstraits['nome'];
            wJson['identity_type'] = listaConstraits['cpf_cnpj'];
            wJson['identity'] = listaConstraits['documento'];
            wJson['document'] = listaConstraits['rg'];
            wJson['obs'] = listaConstraits['observacao'];
            wJson['birth_date'] = listaConstraits['dat_nascimento'];
            wJson['register_date'] = listaConstraits['dat_cadastro'];
            wJson['zip_code'] = listaConstraits['cep'];
            wJson['street'] = listaConstraits['endereco'];
            wJson['number'] = listaConstraits['numero'];
            wJson['complement'] = listaConstraits['complemento'];
            wJson['neighbourhood'] = listaConstraits['bairro'];
            wJson['city'] = nomCidade;
            wJson['state'] = listaConstraits['uf'];
            wJson['country'] = listaConstraits['pais'].toUpperCase();
            wJson['billing_address'] = listaConstraits['end_cobranca'];
            wJson['shipping_address'] = listaConstraits['end_entrega'];
            wJson['phones'] = [listaConstraits['telefones']];
            wJson['emails'] = [listaConstraits['emails']];
            wJson['type_person'] = listaConstraits['tipo_pessoa'].split(',');

            var arrPessoa = {};
            arrPessoa["insertPerson"] = wJson;
            printLog("info", "Json Pessoa: " + JSON.stringify(arrPessoa));
            var wRetorno = f_integraCRM("e9083cdf-c4ea-44b0-8c65-ce8c2354fcd4", '', arrPessoa, newDataset);
            printLog("info", "Json retorno: " + JSON.stringify(wRetorno));

            if (wRetorno.success == false) {
                newDataset.addRow(new Array(
                    wRetorno.success + "",
                    wRetorno.message + ""
                ));

            }
            else {
                newDataset.addRow(new Array(
                    true,
                    JSON.stringify(wRetorno) + ""
                ));
            }

        }

        if (listaConstraits['indacao'] == 'ADDCARD') {
            G_Endpoint = "/api.rule?sys=NMB";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');

            var jsonObj = JSON.parse(listaConstraits['json']);
            var area = jsonObj['area'];

            var wJson = {};

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
            var pipe = DatasetFactory.getDataset('pipedrive', null, constraints, null);

            if (pipe.rowsCount == 0) {
                throw 'Não cadastrado parametro para esse tipo de integração.';
            }

            var time = new Date();
            var outraData = new Date();
            outraData.setDate(time.getDate() + 3); // Adiciona 3 dias

            var org_id = 1;
            var user_id = jsonObj['id_crm'];
            var creator_user_id = 1;
            var expected_close_date = outraData;
            var person_id = null;

            if ((jsonObj['idPessoa'] != undefined) && (jsonObj['idPessoa'] != '')) {
                person_id = jsonObj['idPessoa'];
            }

            if ((jsonObj['idOrg'] != undefined) && (jsonObj['idOrg'] != '')) {
                person_id = jsonObj['idPessoa'];
            }

            if ((jsonObj['datFechamento'] != undefined) && (jsonObj['datFechamento'] != '')) {
                expected_close_date = jsonObj['datFechamento'];
            }


            wJson['person_id'] = person_id;
            wJson['org_id'] = org_id;
            wJson['user_id'] = user_id;
            wJson['origin_id'] = jsonObj['id_origem'];
            wJson['creator_user_id'] = creator_user_id;
            wJson['expected_close_date'] = expected_close_date;
            log.info('wJson: ' + JSON.stringify(wJson));
            var constraintsFilhos = new Array();
            constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_deal', 'token_deal', ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));

            var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);
            if (datasetFilhos != null) {
                for (var i = 0; i < datasetFilhos.rowsCount; i++) {
                    wJson[datasetFilhos.getValue(i, 'token_opor')] = jsonObj[datasetFilhos.getValue(i, 'campo_opor')];
                }
            }

            log.info('wJson: ' + JSON.stringify(wJson));

            var arrFunil = {};
            arrFunil["funil_" + pipe.getValue(0, 'id_funil') + ""] = wJson;
            var wRetorno = f_integraCRM(pipe.getValue(0, 'token_api') + "", pipe.getValue(0, 'id_funil') + "", arrFunil, newDataset);
            if (wRetorno.success == false) {
                newDataset.addRow(new Array(
                    wRetorno.success + "",
                    wRetorno.message + ""
                ));

            } else {
                newDataset.addRow(new Array(
                    true,
                    JSON.stringify(wRetorno) + ""
                ));
            }

        }


        if (listaConstraits['indacao'] == 'ADDCARD2') {
            G_Endpoint = "/api.rule?sys=NMB";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');

            var jsonObj = JSON.parse(listaConstraits['json']);
            var area = jsonObj['area'];

            var wJson = {};

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
            var pipe = DatasetFactory.getDataset('pipedrive', null, constraints, null);

            if (pipe.rowsCount == 0) {
                throw 'Não cadastrado parametro para esse tipo de integração.';
            }

            var time = new Date();
            var outraData = new Date();
            outraData.setDate(time.getDate() + 3); // Adiciona 3 dias

            var org_id = 1;
            var user_id = jsonObj['id_crm'];
            var creator_user_id = 1;
            var expected_close_date = outraData;
            var person_id = null;

            if ((jsonObj['idPessoa'] != undefined) && (jsonObj['idPessoa'] != '')) {
                person_id = jsonObj['idPessoa'];
            }

            if ((jsonObj['idOrg'] != undefined) && (jsonObj['idOrg'] != '')) {
                org_id = jsonObj['idOrg'];
            }

            if ((jsonObj['datFechamento'] != undefined) && (jsonObj['datFechamento'] != '')) {
                expected_close_date = jsonObj['datFechamento'];
            }


            wJson['person_id'] = person_id;
            wJson['org_id'] = org_id;
            wJson['user_id'] = user_id;
            wJson['origin_id'] = jsonObj['id_origem'];
            wJson['creator_user_id'] = creator_user_id;
            wJson['expected_close_date'] = expected_close_date;


            var constraintsFilhos = new Array();
            constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_deal', 'token_deal', ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST));
            constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
            var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);

            if (datasetFilhos != null) {

                for (var i = 0; i < datasetFilhos.rowsCount; i++) {
                    wJson[datasetFilhos.getValue(i, 'token_opor')] = null;
                    if (jsonObj[datasetFilhos.getValue(i, 'campo_opor')])
                        wJson[datasetFilhos.getValue(i, 'token_opor')] = jsonObj[datasetFilhos.getValue(i, 'campo_opor')];
                }
            }

            var arrFunil = {};
            arrFunil["funil_" + pipe.getValue(0, 'id_funil') + ""] = wJson;

            printLog("info", "JSON-RET: " + JSON.stringify(arrFunil));
            var wRetorno = f_integraCRM(pipe.getValue(0, 'token_api') + "", pipe.getValue(0, 'id_funil') + "", arrFunil, newDataset);
            if (wRetorno.success == false) {
                newDataset.addRow(new Array(
                    wRetorno.success + "",
                    wRetorno.message + ""
                ));

            } else {
                //   if ((jsonObj['observacao'] != undefined) && (jsonObj['observacao'] != '')) {
                //         var observacao = jsonObj['observacao'];
                //         var objRetorno = JSON.parse(JSON.stringify(wRetorno));

                //         var ct = new Array();
                //         ct.push(DatasetFactory.createConstraint('indacao', 'ADDNOTE', null, ConstraintType.MUST));
                //         ct.push(DatasetFactory.createConstraint('id_crm', objRetorno["funil_" + pipe.getValue(0, 'id_funil')].data.user_id, null, ConstraintType.MUST));
                //         ct.push(DatasetFactory.createConstraint('id_deal', objRetorno["funil_" + pipe.getValue(0, 'id_funil')].data.id, null, ConstraintType.MUST));
                //         ct.push(DatasetFactory.createConstraint('observacao', observacao, null, ConstraintType.MUST));
                //         var dsN = DatasetFactory.getDataset('dsk_crm', null, ct, null);                    
                //     }                

                // if ((dsN != null)) {
                //     for (var i = 0; i < dsN.rowsCount; i++) {
                //         if (dsN.getValue(i, "status") == true) {
                //             newDataset.addRow(new Array("retorno Note Mensagem: " + dsN.getValue(i, "mensagem")));
                //         }
                //     }
                // } 
                printLog("info", "JSON-RET debug: " + JSON.stringify(wRetorno));
                newDataset.addRow(new Array(
                    true,
                    JSON.stringify(wRetorno) + ""
                ));


            }

        }

        if (listaConstraits['indacao'] == 'ADDNOTE') {
            G_Endpoint = "/api.rule?sys=NMB";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');
            var wJson = {};

            var wContent = listaConstraits['observacao'];
            var user_id = listaConstraits['id_crm'];
            var deal_id = listaConstraits['id_deal'];

            wJson['content'] = wContent;
            wJson['deal_id'] = deal_id;
            wJson['person_id'] = null;
            wJson['activity_id'] = null;
            wJson['user_id'] = user_id;

            var arrNote = {};
            arrNote["insertNote"] = wJson;
            printLog("info", "Json Note: " + JSON.stringify(arrNote));

            // newDataset.addRow(new Array(
            //     true,
            //     JSON.stringify(arrNote) + ""
            // ));

            var wRetorno = f_integraCRM("e9083cdf-c4ea-44b0-8c65-ce8c2354fcd4", '', arrNote, newDataset);
            if (wRetorno.success == false) {
                newDataset.addRow(new Array(
                    wRetorno.success + "",
                    wRetorno.message + ""
                ));
            }
            else {
                newDataset.addRow(new Array(
                    true,
                    JSON.stringify(wRetorno) + ""
                ));
            }

        }

        if (listaConstraits['indacao'] == 'ADDFILE') {
            G_Endpoint = "/api.rule?sys=NMB";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');
            var wJson = {};
            var doc = listaConstraits['documentId'];
            var wDescription = listaConstraits['description'];

            var constraints = [DatasetFactory.createConstraint("documentId", doc, doc, ConstraintType.MUST)];

            var dsFile = DatasetFactory.getDataset('docToDataURL', null, constraints, null);
            printLog('info', 'dsFile');
            printLog('info', dsFile.rowsCount)
            if (dsFile.rowsCount > 0) {
                printLog('info', 'dsFile 2');
                var wBase64 = dsFile.getValue(0, 'base64');
                var user_id = listaConstraits['id_crm'];
                var deal_id = listaConstraits['id_deal'];
                wJson['base64'] = String(wBase64);
                wJson['deal_id'] = parseInt(deal_id);
                wJson['description'] = wDescription;
                wJson['person_id'] = null;
                wJson['activity_id'] = null;
                wJson['user_id'] = user_id;

                var arrFile = {};
                arrFile["uploadFile"] = wJson;
                log.dir(arrFile);
                printLog("info", "Json File: " + JSON.stringify(arrFile));

                var wRetorno = f_integraCRM("e9083cdf-c4ea-44b0-8c65-ce8c2354fcd4", '', arrFile, newDataset);
                if (wRetorno.success == false) {
                    newDataset.addRow(new Array(
                        wRetorno.success + "",
                        wRetorno.message + ""
                    ));
                }
                else {
                    newDataset.addRow(new Array(
                        true,
                        JSON.stringify(wRetorno) + ""
                    ));
                }
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

function f_integraCRM(wToken, wIdFunil, jsonFile, dataset) {
    try {


        var retorno = null;
        var metodo = "POST";
        var wServiceCode = "CRM";
        var params;

        if (jsonFile != "") {
            params = jsonFile;
        }

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: G_Endpoint,
            timeoutService: "240",
            method: metodo,
        };

        // var params;
        var headers = {};
        headers["token"] = wToken;
        headers["content-type"] = "application/json";
        headers["Accept"] = "application/json";
        if (wIdFunil != "") {
            headers["funil_id"] = wIdFunil + "";
        }



        data["headers"] = headers;
        data["params"] = params;


        // dataset.addRow(new Array(
        //     "Tokeon: " + wToken + " - Funil: " + wIdFunil,
        //     JSON.stringify(data) + ""
        // ));

        printLog("info", "JSON: Marcio2 " + JSON.stringify(data));

        var jj = JSON.stringify(data);
        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        }
        //     printLog("info", JSON.stringify(retorno));
        return retorno;
    } catch (error) {
        dataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    }

}


function retira_acentos(str) {
    //	log.info('retira_acentos str........'+str);
    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝ?Þßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ?";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr = "";
    for (i = 0; i < str.length; i++) {
        troca = false;
        for (a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    //    log.info('retira_acentos novastr........'+novastr);
    return novastr;
}