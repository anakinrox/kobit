var debug = false;
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




        pessoa = {
            idPessoa: "3876",
            nome: "ADRIAN AUGUSTO GOHL",
            cnpj_cpf: "069.135.889-33",
            fisico_juridico: "F",
            rg_ie: "105893485",
            genero: "M",
            data_nacimento: "08/12/1987",
            naturalidade: "4128203",
            nacionalidade: "10",
            estadoCivil: "1",
            pis: "14014727323",
            instrucao: "2",
            raca: "9",
            tiposanguino: "N",
            contato: "adrian.malat@pormade.com.br",
            origem: "56",
            site: "",
            idEndereco: "67217",
            cep: "84600-225",
            endereco: "RUA ZACARIAS E VASCONCELOS",
            numero: "100",
            complemento: "CASA",
            bairro: "CENTRO",
            den_cidade: "UNIAO DA VITORIA",
            uf: "PR",
            pais: "BRASIL",
            idTelefone: "27262",
            telefone1: "(99) 99999-9999",
            idEmail: "3767",
            email: "ADRIAN.MALAT@PORMADE.COM.BR",
            cupon: "ARQ94038",
            comissao: "7",
            id_banco: "001",
            agencia: "0218-8",
            conta: "55222-4",
            operacao: "",
            pix: "069.135.889-33",
            num_cau_crea: "",
            tipo_cadastro: "D",
            profissao: "0",
            cod_usuario_respon: "349",
            sponsor: "true",
            sponsorBonus: "10",
            sponsorGroupId: "37",
            flagrpa: "true"
        }

        pessoa = {
            idPessoa: "109492",
            nome: "VALTER MEDEIROS MACIEIRA",
            cnpj_cpf: "37994751415",
            fisico_juridico: "F",
            rg_ie: "871721",
            genero: "",
            data_nacimento: "20/07/1963",
            naturalidade: "",
            nacionalidade: "",
            estadoCivil: "",
            pis: "",
            instrucao: "",
            raca: "",
            tiposanguino: "N",
            contato: "MACIEIRA1963@GMAIL.COM",
            origem: "NULL",
            site: "",
            idEndereco: "121329",
            cep: "58071-320",
            endereco: "RUA RUA PEDRO IVO DE PAIVA",
            numero: "577",
            complemento: "",
            bairro: "CRISTO REDENTOR",
            den_cidade: "JOAO PESSOA",
            uf: "PB",
            pais: "BRASIL",
            idTelefone: "120298",
            telefone1: "(83) 8721-5884",
            idEmail: "106925",
            email: "MACIEIRA1963@GMAIL.COM",
            cupon: "INS57349",
            comissao: "5.00",
            id_banco: "",
            agencia: "1061",
            conta: "8721-1",
            operacao: "1",
            pix: "37994751415",
            num_cau_crea: "0",
            tipo_cadastro: "A",
            profissao: "ENC",
            cod_usuario_respon: "637",
            sponsor: "true",
            sponsorBonus: "null",
            sponsorGroupId: "null",
            flagrpa: "false",
            numContrato: "1054649",
            dataContrato: "2023-11-14 16:55:41.82641"
        }

        listaConstraits['indacao'] = 'UPDATEPESSOA';
        listaConstraits['pessoa'] = JSON.stringify(pessoa);
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

            var gson = new com.google.gson.Gson();
            printLog("error", "##OBJPessoa: " + gson.toJson(pessoa));
            // printLog("info", "JSON OBJ: - " + JSON.stringify(pessoa))
            // printLog("info", "JSON Param: - " + JSON.stringify(listaConstraits['pessoa']))

            // return true;
            var wRretorno = f_criarPessoa(pessoa, newDataset);
            if (wRretorno.success == true) {
                printLog("error", "##RRetorno API : " + gson.toJson(wRretorno));
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
            var wRretorno = f_updatePessoa(pessoa, newDataset);
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
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
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
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
        //        serviceCode: "SYSDEV",
        serviceCode: "SYSPROD",
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

    log.info('JSON Criar Usuario ---> ');
    printLog('info', datajson);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    log.dir(vo);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }

}

function f_criarPessoa(pObjPessoa, dataset) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var LcompanyId = "1"
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
        //        serviceCode: "SYSDEV",
        serviceCode: "SYSPROD",
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
    pessoa["birthDate"] = (pObjPessoa.data_nacimento || "") + "";
    pessoa["registerDate"] = "";
    //    pessoa["obs"] = retira_acentos(pObjPessoa.contato.replace('-', '') + "") + "";
    pessoa["complement"] = (pObjPessoa.complemento || "") + "";
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
    if ((pObjPessoa.pais != undefined) && (pObjPessoa.pais != '')) {
        pessoa["country"] = pObjPessoa.pais;
    } else {
        pessoa["country"] = 'BRASIL';
    }


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
    pessoa["bankAccountHolder"] = retira_acentos(pObjPessoa.nome.toUpperCase() + "") + "";



    pessoa["pix"] = pObjPessoa.pix + "";

    if (pObjPessoa.flagrpa == 'true') {
        pessoa["usesRPA"] = true;
    } else {
        pessoa["usesRPA"] = false;
    }

    pessoa["bloodType"] = pObjPessoa.tiposanguino + "";
    if (pObjPessoa.origem != undefined) {
        pessoa["partnerOriginId"] = parseInt(pObjPessoa.origem);
    } else {
        pessoa["partnerOriginId"] = "56";
    }

    pessoa["partnerCau"] = null;

    if (pObjPessoa.num_cau_crea != "" && pObjPessoa.num_cau_crea != undefined && pObjPessoa.num_cau_crea != null && pObjPessoa.num_cau_crea != "null") {
        pessoa["partnerCau"] = pObjPessoa.num_cau_crea + "";
    }

    var tipo = 0;
    // if (pObjPessoa.tipo_cadastro == "A") {
    //     tipo = 11;
    // } else if (pObjPessoa.tipo_cadastro == "I") {
    //     tipo = 26;
    // } else if (pObjPessoa.tipo_cadastro == "S") {
    //     tipo = 27;
    // } else if (pObjPessoa.tipo_cadastro == "V") {
    //     tipo = 38;
    // } else if (pObjPessoa.tipo_cadastro == "D") {
    //     tipo = 36;
    // } else if (pObjPessoa.tipo_cadastro == "L") {
    //     tipo = 55;
    // }

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint('cod_tipo_parceria', pObjPessoa.tipo_cadastro, pObjPessoa.tipo_cadastro, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset('ds_tipo_parceria', null, ct, null);
    if (ds.rowsCount > 0) {
        if (ds.getValue(0, 'cod_sis') != "") {
            tipo = parseInt(ds.getValue(0, 'cod_sis'));
        }
    }

    pessoa["partnerGroupId"] = parseInt(tipo);
    pessoa["partnerGender"] = pObjPessoa.genero;
    pessoa["partnerCityOfBirthId"] = pObjPessoa.naturalidade;
    pessoa["partnerNationality"] = pObjPessoa.nacionalidade;
    if (pObjPessoa.estadoCivil != undefined) {
        pessoa["partnerMaritalStatus"] = pObjPessoa.estadoCivil + "";
    }
    if (pObjPessoa.pis != undefined) {
        pessoa["partnerPisPasep"] = pObjPessoa.pis + "";
    }
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

        pessoa["sponsor"] = false;
        pessoa["sponsorBonus"] = 0;
        pessoa["sponsorGroupId"] = 0;
        pessoa["sponsorLeaderId"] = null;
        pessoa["sponsorLeaderDivId"] = null;
        pessoa["sponsorCRM"] = null;

        if (pObjPessoa.sponsor != undefined) {
            if (pObjPessoa.sponsor == 'true') {
                pessoa["sponsor"] = true;
                pessoa["sponsorBonus"] = parseInt(pObjPessoa.sponsorBonus);
                pessoa["sponsorGroupId"] = parseInt(pObjPessoa.sponsorGroupId);
                pessoa["sponsorLeaderId"] = null;
                pessoa["sponsorLeaderDivId"] = null;
                pessoa["sponsorCRM"] = null;
            }
        }

    } catch (error) {
        dataset.addRow(new Array(
            error + "",
            ""
        ));
    }

    var gson = new com.google.gson.Gson();
    var params = {};
    params["insertPerson"] = pessoa;

    printLog("error", "##INSERT: " + gson.toJson(params));
    // printLog("error", "##PESSOA: " + JSON.stringify(params));
    // return true;

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
    data["headers"] = headers;
    data["params"] = params;

    var gson = new com.google.gson.Gson();
    var datajson = gson.toJson(data);


    // log.info('JSON Criar Pessoa ---> ');
    printLog('info', datajson);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    // log.dir(vo);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }

}

function f_updatePessoa(pObjPessoa, newDataset) {
    // try {


    printLog("error", "##UPPESSOA: Atualizar");

    var clientService = fluigAPI.getAuthorizeClientService();
    var endpoint = "/api.rule?sys=PON&service=updatePerson";

    var LcompanyId = "1"
    if (getValue("WKCompany") != null) {
        LcompanyId = getValue("WKCompany");
    }

    var data = {
        companyId: LcompanyId + "",
        // serviceCode: "SYS",
        serviceCode: "SYSPROD",
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

    //    pessoa["obs"] = retira_acentos(pObjPessoa.contato.replace('-', '') + "") + "";
    pessoa["document"] = retira_acentos(pObjPessoa.rg_ie + "") + "";
    pessoa["birthDate"] = pObjPessoa.data_nacimento + "";

    printLog("info", "##UPPESSOA controle 1 ");

    var number = "0";
    if (pObjPessoa.numero.toUpperCase() != "") {
        number = pObjPessoa.numero.toUpperCase() + "";
    }

    printLog("info", "##UPPESSOA controle 2 ");

    var objEndereco = {
        id: pObjPessoa.idEndereco,
        zipCode: pObjPessoa.cep.replace('-', '') + "",
        street: retira_acentos(pObjPessoa.endereco.toUpperCase() + "") + "",
        number: number,
        complement: pObjPessoa.complemento + "",
        neighbourhood: retira_acentos(pObjPessoa.bairro.toUpperCase() + "") + "",
        city: retira_acentos(pObjPessoa.den_cidade.toUpperCase() + "") + "",
        state: retira_acentos(pObjPessoa.uf.toUpperCase() + "") + "",
        country: "BRASIL",
        shippingAddress: true,
        billingAddress: true
    }

    pessoa["address"] = objEndereco;

    printLog("info", "##UPPESSOA controle 3 ");

    var objTelefone = {
        personId: pObjPessoa.idPessoa,
        phoneId: pObjPessoa.idTelefone,
        phone: pObjPessoa.telefone1,
        phoneType: "Celular",
        contact: "",
        operator: "",
        branchLine: "",
        main: true
    }

    pessoa["phone"] = objTelefone;

    var objEmail = {
        personId: pObjPessoa.idPessoa,
        emailid: pObjPessoa.idEmail,
        email: retira_acentos(pObjPessoa.email.toUpperCase() + "") + "",
        emailType: "Comercial",
        main: true
    }

    pessoa["email"] = objEmail;

    printLog("info", "##UPPESSOA controle 4 ");

    pessoa["partnerCoupon"] = pObjPessoa.cupon.toUpperCase() + "";
    pessoa["partnerBonus"] = parseFloat(pObjPessoa.comissao);

    if (pObjPessoa.cod_call_center != undefined
        && pObjPessoa.cod_call_center != ""
        && !isNaN(parseInt(pObjPessoa.cod_call_center))) {
        pessoa["partnerCallCenterOperatorId"] = parseInt(pObjPessoa.cod_call_center);
    }

    pessoa["partner"] = true;
    pessoa["provider"] = false;

    printLog("info", "##UPPESSOA controle 5 ");

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

    printLog("info", "##UPPESSOA controle 6 ");

    pessoa["bankAccountType"] = parseInt(tipo);
    pessoa["bankAccountOperation"] = "";

    pessoa["pix"] = pObjPessoa.pix + "";


    if (pObjPessoa.flagrpa == 'true') {
        pessoa["partnerUsesRPA"] = true;
    } else {
        pessoa["partnerUsesRPA"] = false;
    }

    pessoa["partnerBloodType"] = pObjPessoa.tiposanguino + "";
    pessoa["partnerOriginId"] = parseInt(pObjPessoa.origem);

    printLog("info", "##UPPESSOA controle 7 ");

    if (pObjPessoa.numContrato != undefined) {
        pessoa["partnerNumberContract"] = pObjPessoa.numContrato;
        pessoa["partnerDateContract"] = pObjPessoa.dataContrato;
    }
    // UpdatePessoa

    if (pObjPessoa.num_cau_crea != "" && pObjPessoa.num_cau_crea != undefined && pObjPessoa.num_cau_crea != null && pObjPessoa.num_cau_crea != "null") {
        pessoa["partnerCau"] = pObjPessoa.num_cau_crea + "";
    }

    log.info(pessoa["partnerCau"]);

    var tipo = 0;

    printLog("info", "##UPPESSOA controle 8 ");

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint('cod_tipo_parceria', pObjPessoa.tipo_cadastro, pObjPessoa.tipo_cadastro, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset('ds_tipo_parceria', null, ct, null);
    if (ds.rowsCount > 0) {
        if (ds.getValue(0, 'cod_sis') != "") {
            tipo = parseInt(ds.getValue(0, 'cod_sis'));
        }
    }

    printLog("info", "##UPPESSOA controle 9 ");

    pessoa["partnerGroupId"] = parseInt(tipo);

    pessoa["partnerGender"] = pObjPessoa.genero;
    pessoa["partnerCityOfBirthId"] = pObjPessoa.naturalidade;
    pessoa["partnerNationality"] = pObjPessoa.nacionalidade;

    if (pObjPessoa.estadoCivil != undefined) {
        pessoa["partnerMaritalStatus"] = pObjPessoa.estadoCivil + "";
    }
    if (pObjPessoa.pis != undefined) {
        pessoa["partnerPisPasep"] = pObjPessoa.pis + "";
    }

    pessoa["partnerSchoolingLevel"] = pObjPessoa.instrucao;
    pessoa["partnerEthinicity"] = pObjPessoa.raca;


    printLog("info", "##UPPESSOA controle 10 ");

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint('cod_profissao', pObjPessoa.profissao, pObjPessoa.profissao, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset('profissao', null, ct, null);
    if (ds.rowsCount > 0) {
        if (ds.getValue(0, 'id_sis') != "") {
            log.dir(ds);
            if (!isNaN(parseInt(ds.getValue(0, 'id_sis')))) {
                pessoa["partnerOccupationId"] = parseInt(ds.getValue(0, 'id_sis'));
            } else {
                pessoa["partnerOccupationId"] = 0;
            }
        } else {
            pessoa["partnerOccupationId"] = 0;
        }
    } else {
        pessoa["partnerOccupationId"] = 0;
    }

    printLog("info", "##UPPESSOA controle 11 ");

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

    printLog("info", "##UPPESSOA controle 12 ");

    try {
        if (pObjPessoa.sponsor != undefined) {
            if (pObjPessoa.sponsor == 'true') {
                pessoa["sponsor"] = pObjPessoa.sponsor;
                pessoa["sponsorBonus"] = parseInt(pObjPessoa.sponsorBonus);
                pessoa["sponsorGroupId"] = parseInt(pObjPessoa.sponsorGroupId);
                pessoa["sponsorLeaderId"] = null;
                pessoa["sponsorLeaderDivId"] = null;
                pessoa["sponsorCRM"] = null;

            }
        }
    } catch (error) {
    }

    printLog("info", "##UPPESSOA controle 13 ");

    var gson = new com.google.gson.Gson();

    printLog("info", "##UPPESSOA controle 14 ");

    var params = {};

    printLog("info", "##UPPESSOA controle 15 ");

    params["updatePerson"] = pessoa;
    // params["insertPerson"] = pessoa;

    log.dir(pessoa);

    //printLog("error", "##UPPESSOA: " + gson.toJson(params));
    // printLog("error", "##UPPESSOA: " + gson.toJson(params));
    // newDataset.addRow(new Array("##UPPESSOA: " + gson.toJson(params)));

    // return true;

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
    data["headers"] = headers;
    data["params"] = params;

    printLog("info", "##UPPESSOA controle 16 ");

    log.dir(data);

    var datajson = gson.toJson(data);

    printLog("info", "##UPPESSOA controle 17 ");

    var jj = datajson;
    var vo = clientService.invoke(jj);

    log.dir(vo);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());

        printLog("info", "##UPPESSOA retorno: " + gson.toJson(jr));
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
        // serviceCode: "SYS",
        serviceCode: "SYSPROD",
        timeoutService: "240",
        endpoint: endpoint,
        method: "POST"
    };

    var endereco = {};

    endereco["id"] = pObjEndereco.id;
    endereco["complement"] = pObjEndereco.complemento + "";
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
    if ((pObjEndereco.pais != undefined) && (pObjEndereco.pais != '')) {
        endereco["country"] = pObjEndereco.pais;
    } else {
        endereco["country"] = 'BRASIL';
    }

    // printLog("error", "##Token: " + G_Token);
    // printLog("error", "##PESSOA: " + JSON.stringify(params));
    var params = {};
    params["updateAddress"] = endereco;


    var gson = new com.google.gson.Gson();
    // printLog("error", "##UPEndereco: " + gson.toJson(params));
    // return true;

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = G_Token;
    data["headers"] = headers;
    data["params"] = params;


    var datajson = gson.toJson(data);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    log.dir(vo);

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

    if (str != "") {
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
    }
    //    log.info('retira_acentos novastr........'+novastr);
    return novastr;
}