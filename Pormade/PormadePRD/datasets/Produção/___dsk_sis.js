var debug = true;
var G_Endpoint = '';
var G_Token = "c72c53905d28d2eaaee0d1d2cd11a287";

function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## SIS START ##");
    var newDataset = DatasetBuilder.newDataset();


    var listaConstraits = {};
    listaConstraits['indacao'] = "";
    listaConstraits['email'] = "";
    listaConstraits['nome'] = "";
    listaConstraits['senha'] = "";

    listaConstraits['pessoa'] = ""


    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
            if (pessoa[constraints[i].fieldName.trim()] == "") {
                pessoa[constraints[i].fieldName.trim()] = constraints[i].initialValue.trim();
            }
        }
    }

    // printLog("info", "INDACAO: " + listaConstraits['indacao']);

    if (listaConstraits['indacao'] == '') {
        /*var pessoa = {
            nome: "Marcio Silva",
            cnpj_cpf: "006.170.859-35",
            fisico_juridico: 'F',
            rg_ie: "7.560.296-0",
            contato: "marcio",
            site: "",
            cep: "89251-060",
            endereco: "Felipe Schmidt",
            numero: "218",
            bairro: "Centro",
            den_cidade: "Jaragua do Sul",
            uf: "SC",
            telefone1: "(47) 988112917",
            email: "marcio@kobit.com.br",
            cupon: "",
            comissao: "50",
            cod_call_center: "1",
            id_banco: "1",
            agencia: "0453",
            conta: "0357-0",
            operacao: "013",
            pix: "00617085935",
            num_cau_crea: "0",
            tipo_cadastro: "A",
            profissao: "DONO",
            cod_usuario_respon: ""
        }*/

        // listaConstraits['indacao'] = 'ADDPESSOA';
        // listaConstraits['pessoa'] = JSON.stringify(pessoa);

        listaConstraits['indacao'] = 'ADDUSER';
        listaConstraits['email'] = "divulgador1700@divulgador.net.br";
        listaConstraits['nome'] = "Marcio Silva";
    }

    printLog("info", "INDACAO2: " + listaConstraits['indacao']);


    try {
        if (listaConstraits['indacao'] == 'ADDUSER') {
            G_Endpoint = "/api.rule?sys=PON&service=createUser";

            newDataset.addColumn('status');
            newDataset.addColumn('mensagem');

            var wRretorno = f_criarUsuario(listaConstraits['nome'], listaConstraits['email']);
            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message + ""
                ));
            }

        }

        if (listaConstraits['indacao'] == 'ADDPESSOA') {
            G_Endpoint = "/api.rule?sys=PON&service=insertPerson";
            newDataset.addColumn('status');
            newDataset.addColumn('pessoa');

            //var wPessoa = JSON.parse(listaConstraits['pessoa']);
            //var wRretorno = f_criarPessoa(wPessoa);
            var wRretorno = f_criarPessoa(pessoa);
            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message + ""
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

function f_criarUsuario(pName, pEmail) {

    var clientService = fluigAPI.getAuthorizeClientService();

    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "SYS",
        timeoutService: "240",
        endpoint: G_Endpoint,
        method: "POST"
    };

    var wConta = {
        name: pName,
        email: pEmail
    }

    var params = {
        createUser: wConta
    }

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
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

function f_criarPessoa(pObjPessoa) {

    var clientService = fluigAPI.getAuthorizeClientService();

    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "SYS",
        timeoutService: "240",
        endpoint: G_Endpoint,
        method: "POST"
    };

    var pessoa = {};
    pessoa["name"] = retira_acentos(pObjPessoa.nome.toUpperCase() + "") + "";
    pessoa["identity"] = pObjPessoa.cnpj_cpf.replace('.', '').replace('.', '').replace('/', '').replace('-', '') + "";
    var tipo = 'CPF';
    if (pObjPessoa.fisico_juridico == "J") {
        tipo = 'CNPJ'
    }
    pessoa["identityType"] = tipo + "";
    pessoa["document"] = retira_acentos(pObjPessoa.rg_ie + "") + "";
    pessoa["obs"] = retira_acentos(pObjPessoa.contato.replace('-', '') + "") + ""
    pessoa["complement"] = retira_acentos(pObjPessoa.site.replace('-', '') + "") + ""
    pessoa["zipCode"] = pObjPessoa.cep.replace('-', '') + "";
    pessoa["street"] = retira_acentos(pObjPessoa.endereco.toUpperCase() + "") + "";
    var number = "0";
    if (pObjPessoa.numero.toUpperCase() != "") {
        number = pObjPessoa.numero.toUpperCase() + "";
    }
    pessoa["number"] = number + "";
    pessoa["neighbourhood"] = retira_acentos(pObjPessoa.bairro.toUpperCase() + "") + "";
    pessoa["city"] = retira_acentos(pObjPessoa.den_cidade.toUpperCase() + "") + "";
    pessoa["state"] = retira_acentos(pObjPessoa.uf.toUpperCase() + "") + "";
    pessoa["country"] = "BRASIL";
    pessoa["mobileNumber"] = pObjPessoa.telefone1.toUpperCase().replace('(', '').replace(')', '').replace('-', '') + "";
    pessoa["email"] = retira_acentos(pObjPessoa.email.toUpperCase() + "") + "";
    pessoa["partnerCoupon"] = pObjPessoa.cupon.toUpperCase() + "";
    pessoa["partnerBonus"] = parseFloat(pObjPessoa.comissao);

    if (pObjPessoa.cod_call_center != undefined
        && pObjPessoa.cod_call_center != ""
        && !isNaN(parseInt(pObjPessoa.cod_call_center))) {
        pessoa["partnerCallCenterOperatorId"] = parseInt(pObjPessoa.cod_call_center);
    }

    pessoa["partner"] = "true";
    pessoa["provider"] = "false";

    if (pObjPessoa.id_banco != "") {
        /*var sql = " select ps.codigo " +
            "	from online.pon_bancos ps " +
            "	where ps.id = '" + pObjPessoa.id_banco + "' ";
        var ct = new Array();
        ct.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint('sql', sql, null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset('select', null, ct, null);
        if (ds.rowsCount == 0) {
            throw 'Não localizado banco ' + pObjPessoa.id_banco.trim() + ' no SIS.';
        }
        pessoa["bankId"] = ds.getValue(0, 'codigo') + "";*/
        pessoa["bankId"] = pObjPessoa.id_banco.trim() + "";
    } else {
        pessoa["bankId"] = "";
    }
    //pessoa["bankId"] = pObjPessoa.id_banco +"";
    pessoa["bankBranch"] = pObjPessoa.agencia + "";
    pessoa["bankAccount"] = pObjPessoa.conta + "";
    var tipo = 1;
    if (pObjPessoa.operacao == "CONTA POUPANCA") {
        tipo = 2
    }
    pessoa["bankAccountType"] = parseInt(tipo);
    pessoa["bankAccountOperation"] = "";

    pessoa["pix"] = pObjPessoa.pix + "";
    if (pObjPessoa.num_cau_crea != "" && pObjPessoa.num_cau_crea != undefined) {
        pessoa["partnerCau"] = pObjPessoa.num_cau_crea + "";
    }

    //11 (Arquiteto) ou 26 (Instaladores)
    var tipo = 0;
    if (pObjPessoa.tipo_cadastro == "A") {
        tipo = 11;
    } else if (pObjPessoa.tipo_cadastro == "I") {
        tipo = 26;
    } else if (pObjPessoa.tipo_cadastro == "S") {
        tipo = 27;
    } else if (pObjPessoa.tipo_cadastro == "V") {
        tipo = 38;
    } else if (pObjPessoa.tipo_cadastro == "D") {
        tipo = 36;
    }

    pessoa["partnerGroupId"] = parseInt(tipo);

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint('cod_profissao', pObjPessoa.profissao, pObjPessoa.profissao, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset('profissao', null, ct, null);
    if (ds.rowsCount > 0) {
        if (ds.getValue(0, 'id_sis') != "") {
            pessoa["partnerOccupationId"] = parseInt(ds.getValue(0, 'id_sis'));
        } else {
            pessoa["partnerOccupationId"] = 0;
        }
    } else {
        pessoa["partnerOccupationId"] = 0;
    }

    if (!isNaN(parseInt(pObjPessoa.cod_usuario_respon.trim()))) {
        pessoa["sponsorId"] = parseInt(ds.getValue(0, 'id'));
    } else {
        var ct = new Array();
        ct.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint('table', 'kbt_v_pessao_cupom', null, ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint('nr_cupom', pObjPessoa.cod_usuario_respon.trim(), null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset('selectTablePostgreSQL', null, ct, null);
        if (ds.rowsCount > 0) {
            pessoa["sponsorId"] = ds.getValue(0, "id_patrocinador");
        } else {
            pessoa["sponsorId"] = 0;
        }
    }


    var params = {};
    params["insertPerson"] = pessoa;

    // printLog("error", "##Token: " + G_Token);
    // printLog("error", "##PESSOA: " + JSON.stringify(params));

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
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

    // return true;

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