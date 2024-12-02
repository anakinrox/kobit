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

    var pessoa = {};
    var endereco = {};

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';

            if ((listaConstraits['indacao'] == 'ADDPESSOA') || (listaConstraits['indacao'] == 'UPDATEPESSOA')) {
                pessoa[constraints[i].fieldName.trim()] = constraints[i].initialValue.trim();
            }
            if (listaConstraits['indacao'] == 'UPDATEENDERECO') {
                endereco[constraints[i].fieldName.trim()] = constraints[i].initialValue.trim();
            }
        }
    }






    if (listaConstraits['indacao'] == '') {
        // pessoa = {
        //     nome: 'GUSTAVAO',
        //     cnpj_cpf: '954.030.130-08',
        //     fisico_juridico: 'F',
        //     rg_ie: '000000000000',
        //     data_nacimento: "24/03/1979",
        //     genero: "M",
        //     naturalidade: 4127700,
        //     nacionalidade: 10,
        //     estadoCivil: "1",
        //     instrucao: 8,
        //     raca: 8,
        //     contato: 'ciyirow569@votooe.com',
        //     site: '',
        //     cep: '07727-585',
        //     endereco: 'Rua Rio de Janeiro',
        //     numero: '100',
        //     complemento: 'casa 2',
        //     bairro: 'Alpes de Caieiras',
        //     den_cidade: 'CAIEIRAS',
        //     uf: 'SP',
        //     pais: 'BRASIL',
        //     telefone1: '(11) 11111-1111',
        //     email: 'divulgador59520@divulgador.net.br',
        //     cupon: 'DIV59520',
        //     comissao: '0',
        //     id_banco: '001',
        //     agencia: '1234',
        //     conta: '1234-5',
        //     operacao: '13',
        //     pix: '47988112917',
        //     pis: '123456789',
        //     num_cau_crea: '',
        //     tipo_cadastro: 'D',
        //     profissao: '',
        //     cod_usuario_respon: '46',
        //     sponsor: true,
        //     sponsorBonus: 2,
        //     sponsorGroupId: 37
        // }

        // listaConstraits['indacao'] = 'ADDPESSOA';
        // listaConstraits['pessoa'] = JSON.stringify(pessoa);

        pessoa = {
            idPessoa: 79674,
            nome: 'GUSTAVAO',
            cnpj_cpf: '954.030.130-08',
            fisico_juridico: 'F',
            data_nacimento: "24/03/1979",
            genero: "M",
            naturalidade: 4127700,
            nacionalidade: 10,
            estadoCivil: "1",
            instrucao: 8,
            tipo_sangue: 'O+',
            raca: 8,
            contato: 'ciyirow569@votooe.com',
            telefone1: '(11) 11111-1111',
            email: 'divulgador59520@divulgador.net.br',
            cupon: 'DIV59520',
            comissao: '0',
            id_banco: '001',
            agencia: '1234',
            conta: '1234-5',
            operacao: '13',
            pix: '47988112917',
            pis: '123456789',
            num_cau_crea: '',
            tipo_cadastro: 'D',
            profissao: '',
            cod_usuario_respon: '46',
            sponsor: true,
            sponsorBonus: 2,
            sponsorGroupId: 37
        }

        listaConstraits['indacao'] = 'UPDATEPESSOA';
        listaConstraits['pessoa'] = JSON.stringify(pessoa);


        // endereco = {
        //     id: 88888,
        //     cep: '07727-585',
        //     endereco: 'Rua Rio de Janeiro',
        //     numero: '100',
        //     complemento: 'casa 2',
        //     bairro: 'Alpes de Caieiras',
        //     den_cidade: 'CAIEIRAS',
        //     uf: 'SP',
        //     pais: 'BRASIL',

        // }
        // listaConstraits['indacao'] = 'UPDATEENDERECO';
        // listaConstraits['endereco'] = JSON.stringify(endereco);

        // listaConstraits['indacao'] = 'ADDUSER';
        // listaConstraits['email'] = "divulgador1700@divulgador.net.br";
        // listaConstraits['nome'] = "Marcio Silva";
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

            // pessoa = JSON.parse(listaConstraits['pessoa']);

            // printLog("info", "JSON OBJ: - " + JSON.stringify(pessoa))
            // printLog("info", "JSON Param: - " + JSON.stringify(listaConstraits['pessoa']))

            // return true;
            var wRretorno = f_criarPessoa(pessoa);
            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    JSON.stringify(wRretorno.data) + ""
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message + ""
                ));
            }
        }

        if (listaConstraits['indacao'] == 'UPDATEPESSOA') {
            G_Endpoint = "/api.rule?sys=PON&service=updatePerson";
            newDataset.addColumn('status');
            newDataset.addColumn('pessoa');

            // printLog("info", "JSON: - " + JSON.stringify(pessoa))
            var wRretorno = f_updatePessoa(pessoa);
            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    JSON.stringify(wRretorno.data) + ""
                ));
            } else {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    wRretorno.message + ""
                ));
            }
        }

        if (listaConstraits['indacao'] == 'UPDATEENDERECO') {
            G_Endpoint = "/api.rule?sys=PON&service=updateAddress";
            newDataset.addColumn('status');
            newDataset.addColumn('endereco');

            // printLog("info", "JSON: - " + JSON.stringify(endereco))
            var wRretorno = f_updateEndereco(endereco);
            if (wRretorno.success == true) {
                newDataset.addRow(new Array(
                    wRretorno.success + "",
                    JSON.stringify(wRretorno.data) + ""
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
    var LcompanyId = "1"
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
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
    pessoa["birthDate"] = pObjPessoa.data_nacimento + "";
    pessoa["obs"] = retira_acentos(pObjPessoa.contato.replace('-', '') + "") + "";
    pessoa["complement"] = retira_acentos(pObjPessoa.site.replace('-', '') + "") + "";
    pessoa["zipCode"] = pObjPessoa.cep.replace('-', '') + "";
    pessoa["street"] = retira_acentos(pObjPessoa.endereco.toUpperCase() + "") + "";

    if (pObjPessoa.tipo_sangue != "" && pObjPessoa.tipo_sangue != undefined) {
        pessoa["partnerBloodType"] = pObjPessoa.tipo_sangue + "";
    }

    var number = "0";
    if (pObjPessoa.numero.toUpperCase() != "") {
        number = pObjPessoa.numero.toUpperCase() + "";
    }
    pessoa["number"] = number + "";

    pessoa["neighbourhood"] = retira_acentos(pObjPessoa.bairro.toUpperCase() + "") + "";
    pessoa["city"] = retira_acentos(pObjPessoa.den_cidade.toUpperCase() + "") + "";
    pessoa["state"] = retira_acentos(pObjPessoa.uf.toUpperCase() + "") + "";
    pessoa["country"] = pObjPessoa.pais;

    pessoa["mobileNumber"] = pObjPessoa.telefone1.toUpperCase().replace('(', '').replace(')', '').replace('-', '') + "";
    pessoa["email"] = retira_acentos(pObjPessoa.email.toUpperCase() + "") + "";
    pessoa["partnerCoupon"] = pObjPessoa.cupon.toUpperCase() + "";
    pessoa["partnerBonus"] = parseFloat(pObjPessoa.comissao);

    if (pObjPessoa.cod_call_center != undefined
        && pObjPessoa.cod_call_center != ""
        && !isNaN(parseInt(pObjPessoa.cod_call_center))) {
        pessoa["partnerCallCenterOperatorId"] = parseInt(pObjPessoa.cod_call_center);
    }

    pessoa["partner"] = true;
    pessoa["provider"] = false;

    if (pObjPessoa.id_banco != "") {
        pessoa["bankId"] = pObjPessoa.id_banco.trim() + "";
    } else {
        pessoa["bankId"] = "";
    }
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

    pessoa["partnerGender"] = pObjPessoa.genero;
    pessoa["partnerCityOfBirthId"] = pObjPessoa.naturalidade;
    pessoa["partnerNationality"] = pObjPessoa.nacionalidade;
    pessoa["partnerMaritalStatus"] = pObjPessoa.estadoCivil + "";
    pessoa["partnerPisPasep"] = pObjPessoa.pis + "";
    pessoa["partnerSchoolingLevel"] = pObjPessoa.instrucao;
    pessoa["partnerEthinicity"] = pObjPessoa.raca;

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
        pessoa["sponsorId"] = parseInt(pObjPessoa.cod_usuario_respon.trim());
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

    try {
        if (pObjPessoa.sponsor != undefined) {
            if (pObjPessoa.sponsor == true) {
                pessoa["sponsor"] = pObjPessoa.sponsor;
                pessoa["sponsorBonus"] = pObjPessoa.sponsorBonus;
                pessoa["sponsorGroupId"] = pObjPessoa.sponsorGroupId;

            }
        }
    } catch (error) {
    }

    var gson = new com.google.gson.Gson();

    var params = {};
    params["insertPerson"] = pessoa;

    printLog("error", "##UPPESSOA: " + gson.toJson(params));
    // printLog("error", "##PESSOA: " + JSON.stringify(params));
    // return true;

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

function f_updatePessoa(pObjPessoa) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var endpoint = "/api.rule?sys=PON&service=updatePerson";

    var LcompanyId = "1"
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
        serviceCode: "SYS",
        timeoutService: "240",
        endpoint: endpoint,
        method: "POST"
    };

    var pessoa = {};

    pessoa["personId"] = pObjPessoa.idPessoa;
    pessoa["name"] = retira_acentos(pObjPessoa.nome.toUpperCase() + "") + "";
    pessoa["identity"] = pObjPessoa.cnpj_cpf.replace('.', '').replace('.', '').replace('/', '').replace('-', '') + "";

    var tipo = 'CPF';
    if (pObjPessoa.fisico_juridico == "J") {
        tipo = 'CNPJ'
    }
    pessoa["identityType"] = tipo + "";

    pessoa["obs"] = retira_acentos(pObjPessoa.contato.replace('-', '') + "") + "";
    pessoa["birthDate"] = pObjPessoa.data_nacimento + "";

    pessoa["mobileNumber"] = pObjPessoa.telefone1.toUpperCase().replace('(', '').replace(')', '').replace('-', '') + "";
    pessoa["email"] = retira_acentos(pObjPessoa.email.toUpperCase() + "") + "";
    pessoa["partnerCoupon"] = pObjPessoa.cupon.toUpperCase() + "";
    pessoa["partnerBonus"] = parseFloat(pObjPessoa.comissao);

    if (pObjPessoa.cod_call_center != undefined
        && pObjPessoa.cod_call_center != ""
        && !isNaN(parseInt(pObjPessoa.cod_call_center))) {
        pessoa["partnerCallCenterOperatorId"] = parseInt(pObjPessoa.cod_call_center);
    }

    pessoa["partner"] = true;
    pessoa["provider"] = false;

    if (pObjPessoa.id_banco != "") {
        pessoa["bankId"] = pObjPessoa.id_banco.trim() + "";
    } else {
        pessoa["bankId"] = "";
    }
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

    pessoa["partnerGender"] = pObjPessoa.genero;
    pessoa["partnerCityOfBirthId"] = pObjPessoa.naturalidade;
    pessoa["partnerNationality"] = pObjPessoa.nacionalidade;
    pessoa["partnerMaritalStatus"] = pObjPessoa.estadoCivil + "";
    pessoa["partnerPisPasep"] = pObjPessoa.pis + "";
    pessoa["partnerSchoolingLevel"] = pObjPessoa.instrucao;
    pessoa["partnerEthinicity"] = pObjPessoa.raca;

    if (pObjPessoa.tipo_sangue != "" && pObjPessoa.tipo_sangue != undefined) {
        pessoa["partnerBloodType"] = pObjPessoa.tipo_sangue + "";
    }


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
        pessoa["sponsorId"] = parseInt(pObjPessoa.cod_usuario_respon.trim());
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

    try {
        if (pObjPessoa.sponsor != undefined) {
            if (pObjPessoa.sponsor == true) {
                pessoa["sponsor"] = pObjPessoa.sponsor;
                pessoa["sponsorBonus"] = pObjPessoa.sponsorBonus;
                pessoa["sponsorGroupId"] = pObjPessoa.sponsorGroupId;

            }
        }
    } catch (error) {
    }

    var gson = new com.google.gson.Gson();
    var params = {};
    // params["updatePerson"] = pessoa;
    params["insertPerson"] = pessoa;

    // printLog("error", "##UPPESSOA: " + gson.toJson(params));
    printLog("error", "##UPPESSOA: " + gson.toJson(params));

    // return true;

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
    data["headers"] = headers;
    data["params"] = params;


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

function f_updateEndereco(pObjEndereco) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var endpoint = "/api.rule?sys=PON&service=updateAddress";

    var LcompanyId = "1"
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
        serviceCode: "SYS",
        timeoutService: "240",
        endpoint: endpoint,
        method: "POST"
    };

    var endereco = {};

    endereco["id"] = pObjEndereco.id;
    endereco["complement"] = retira_acentos(pObjEndereco.complemento) + "";
    endereco["zipCode"] = pObjEndereco.cep.replace('-', '') + "";
    endereco["street"] = retira_acentos(pObjEndereco.endereco.toUpperCase() + "") + "";

    var number = "0";
    if (pObjEndereco.numero.toUpperCase() != "") {
        number = pObjEndereco.numero.toUpperCase() + "";
    }
    endereco["number"] = number + "";
    endereco["neighbourhood"] = retira_acentos(pObjEndereco.bairro.toUpperCase() + "") + "";
    endereco["city"] = retira_acentos(pObjEndereco.den_cidade.toUpperCase() + "") + "";
    endereco["state"] = retira_acentos(pObjEndereco.uf.toUpperCase() + "") + "";
    endereco["country"] = pObjEndereco.pais;

    // printLog("error", "##Token: " + G_Token);
    // printLog("error", "##PESSOA: " + JSON.stringify(params));
    var params = {};
    params["updateAddress"] = endereco;


    var gson = new com.google.gson.Gson();
    printLog("error", "##UPEndereco: " + gson.toJson(params));
    // return true;

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
    data["headers"] = headers;
    data["params"] = params;


    var datajson = gson.toJson(data);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        var wRetorno = jr;
    }

    return wRetorno;

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