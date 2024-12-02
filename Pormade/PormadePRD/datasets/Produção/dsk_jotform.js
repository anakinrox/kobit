var GApiKey = '20c03012986599cf437f63765e84717e';

function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## JOTFORM START ##");
    var newDataset = DatasetBuilder.newDataset();

    try {
        var connectionWD = null;
        var statementWD = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();

        newDataset.addColumn('STATUS');

        var SQL = "select idform, nomform from kbt_t_forms";

        statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            var objJForm = f_buscaRespostas(rsWD.getString("idform"), 'submissions', '', 'GET');
            if (objJForm != null) {
                if (objJForm.responseCode == 200) {
                    for (i = 0; i < objJForm.content.length; i++) {
                        var json = JSON.parse(JSON.stringify(objJForm.content[i].answers));
                        for (item in json) {
                            var jsonw = JSON.parse(JSON.stringify(json[item]));
                            if (
                                (jsonw.type == 'control_textbox') || (jsonw.type == 'control_phone') ||
                                (jsonw.type == 'control_radio') || (jsonw.type == 'control_calculation') ||
                                (jsonw.type == 'control_dropdown')
                            ) {

                                var wReg = 0;
                                var SQL = "select idform from kbt_t_forms_resposta where idform = '" + objJForm.content[i].form_id + "' and idresposta = '" + objJForm.content[i].id + "' and idpergunta =  " + item;
                                statementWD = connectionWD.prepareStatement(SQL);
                                var rsWDResp = statementWD.executeQuery();
                                while (rsWDResp.next()) {
                                    wReg = 1;
                                }

                                if (wReg == 0) {
                                    var wResp = f_validaNullL(jsonw.answer);
                                    var wSQL = "insert into kbt_t_forms_resposta (idform, idresposta, idpergunta, datregistro, ordem, resposta) values ('" + objJForm.content[i].form_id + "','" + objJForm.content[i].id + "',"
                                    wSQL += "'" + item + "',current_date,'" + jsonw.order + "','" + wResp + "')";
                                    statementWD = connectionWD.prepareStatement(wSQL);
                                    statementWD.executeUpdate();
                                }
                            }
                        }
                    }
                }

                newDataset.addRow(
                    new Array(
                        "Registro Gravados"
                    ));
            }
        }

        // Chamada para enviar ao Pipe        
        var SQL = "select distinct idform, idresposta from kbt_t_forms_resposta where idpergunta = 192 and resposta like '%50,00%' and not exists (select * from kbt_t_forms_pipe where idform = kbt_t_forms_resposta.idform and idresposta = kbt_t_forms_resposta.idresposta)";
        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var idFunil = null;
            var id_user_pipedrive = null;
            var nomProfissao = null;
            var nomIndicado = null;
            var foneIndicado = null;
            var emailIndicado = null;

            var SQL = "select idpergunta, resposta from kbt_t_forms_resposta where idform = '" + rsWD.getString("idform") + "' and idresposta = '" + rsWD.getString("idresposta") + "' and idpergunta in (147, 148, 149, 150)";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWDresp = statementWD.executeQuery();
            while (rsWDresp.next()) {
                if (rsWDresp.getString("idpergunta") == 148) {
                    nomProfissao = rsWDresp.getString("resposta");
                    if (rsWDresp.getString("resposta") == 'Engenheiro') {
                        idFunil = 7;
                    }
                    if (rsWDresp.getString("resposta") == 'Arquiteto') {
                        idFunil = 7;
                    }
                    if (rsWDresp.getString("resposta") == 'Designer de Interior') {
                        idFunil = 7;
                    }
                    if (rsWDresp.getString("resposta") == 'Instalador de Portas') {
                        idFunil = 1;
                    }
                    if (rsWDresp.getString("resposta") == 'Outros') {
                        idFunil = 7;
                    }
                }

                if (rsWDresp.getString("idpergunta") == 147) {
                    nomIndicado = rsWDresp.getString("resposta");
                }

                if (rsWDresp.getString("idpergunta") == 149) {
                    foneIndicado = rsWDresp.getString("resposta");
                }

                if (rsWDresp.getString("idpergunta") == 150) {
                    emailIndicado = rsWDresp.getString("resposta");
                }
            }

            try {
                id_user_pipedrive = getUserSetor(idFunil, newDataset);
            } catch (error) {
                id_user_pipedrive = null;
            }

            if (id_user_pipedrive != null) {

                var observacao = "Profissão: " + nomProfissao + " \n ";
                observacao += "Cadastro realizado via JotForm."

                var obj = {
                    area: "JF", // Fixo
                    only_phone: "S",
                    setor_destino: idFunil + "", //Funil
                    fisico_juridico: "F", // Se Juridico enviar nome no "nome" e nome contato no "pessoa_contato" Se Fisico enviar nome no "nome" telefone1 no "telefone"
                    id_person: "",
                    id_org: "",
                    nome: nomIndicado + "",
                    telefone1: foneIndicado + "",
                    pessoa_contato: "",
                    telefone_pessoa: "",
                    cod_origem: "",
                    id_origem_pipedrive: "431",
                    processo: null,
                    showroom: "",
                    cidade: "",
                    email: emailIndicado + ""
                }

                try {
                    var ct = new Array();
                    ct.push(DatasetFactory.createConstraint('ACTION', 'GEN_DEAL_VENDEDOR', null, ConstraintType.MUST));
                    ct.push(DatasetFactory.createConstraint('USERPIPEDRIVE', id_user_pipedrive, null, ConstraintType.MUST));
                    ct.push(DatasetFactory.createConstraint('TITULO', nomIndicado + "", null, ConstraintType.MUST));
                    ct.push(DatasetFactory.createConstraint('OBS', observacao, null, ConstraintType.MUST));
                    ct.push(DatasetFactory.createConstraint('JSON', JSON.stringify(obj), null, ConstraintType.MUST));
                    // var ds = DatasetFactory.getDataset('DS_SolicitacaoParceiros', null, ct, null);
                    // newDataset.addRow(new Array("Registros: " + ds.rowsCount));

                    // if ((ds != null) && (ds.rowsCount > 0)) {
                    //     if (ds.rowsCount > 0) {
                    //         // newDataset.addRow(new Array("Enviou pro Pipe: " + ds.getValue(0, "id_deals_vendedor")));
                    //         // newDataset.addRow(new Array("Enviou pro Pipe: " + nomIndicado));
                    //         f_atualizarRegistro(rsWD.getString("idform"), rsWD.getString("idresposta"), parseInt(ds.getValue(0, "id_deals_vendedor"), newDataset));
                    //     }
                    // }
                } catch (error) {
                    newDataset.addRow(new Array(error.toString()));
                    return newDataset;
                }


            }
        }

    } catch (error) {
        printlog("info", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString()));

    } finally {

        if (rsWD != null) rsWD.close();
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {

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

function f_buscaRespostas(pIdForm, pIdRequest, pJsonFile, pMetodo) {

    var wEndpoint = '/form/' + pIdForm + '/' + pIdRequest + '?apikey=' + GApiKey;
    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "jotform",
            timeoutService: "240",
            endpoint: wEndpoint,
            method: pMetodo + ""
        };

        var params = {};

        if (pJsonFile != "") {
            params = pJsonFile;
        }

        var headers = {};
        headers["Content-Type"] = "application/json";
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
    } catch (error) {
        printlog("info", "Error REST: " + error.toString());
        newDataset.addRow(new Array(error.toString()));
    }
}

function f_validaNullL(data) {
    if (data == undefined) {
        return '';
    } else {
        return data;
    }
}

function getUserSetor(cod_funil, dataSet) {
    var newDataset = dataSet;
    var id_pipedrive;

    // ADVA
    if (cod_funil == 7) {

        var sql = "select ps.cnpj_cpf, ps.nome_razao, pe.email " +
            "from online.pon_pessoa ps  " +
            "join online.pon_pessoa_patrocinador pt on (ps.id = pt.id_pessoa)  " +
            "join online.pon_pessoa_email pe ON (pe.id_pessoa = ps.id and pe.principal = 'true') " +
            "where " +
            "    pt.id_grupo = 22 " +
            "    and equipe = 'JUNIOR' ";
    }

    // ADVI
    if (cod_funil == 1) {

        var sql = "select ps.cnpj_cpf, ps.nome_razao, pe.email " +
            "from online.pon_pessoa ps  " +
            "join online.pon_pessoa_patrocinador pt on (ps.id = pt.id_pessoa)  " +
            "join online.pon_pessoa_email pe ON (pe.id_pessoa = ps.id and pe.principal = 'true') " +
            "where " +
            "    pt.id_grupo = 13 " +
            "    and equipe = 'JUNIOR' ";

    }

    // Div Qualificacao
    if (cod_funil == 23) {
        var sql = "select ps.cnpj_cpf, ps.nome_razao, pe.email " +
            "from online.pon_pessoa ps  " +
            "join online.pon_pessoa_patrocinador pt on (ps.id = pt.id_pessoa)  " +
            "join online.pon_pessoa_email pe ON (pe.id_pessoa = ps.id and pe.principal = 'true') " +
            "where " +
            "    pt.id_grupo = 37 " +
            "    and equipe = 'QUALIFICAÇÃO' ";

    }

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST));
    ct.push(DatasetFactory.createConstraint('sql', sql, null, ConstraintType.MUST));
    var dsUser = DatasetFactory.getDataset("select", null, ct, null);

    if (dsUser != null && dsUser != "") {
        if (dsUser.values.length > 0) {
            var row = Math.floor(Math.random() * dsUser.values.length);

            var ct = new Array();
            ct.push(DatasetFactory.createConstraint('area', 'PM', null, ConstraintType.MUST));
            ct.push(DatasetFactory.createConstraint('email', dsUser.getValue(row, "email"), null, ConstraintType.MUST));
            var pipedriveUser = DatasetFactory.getDataset("pipedriveUser", null, ct, null);

            if (pipedriveUser != null && pipedriveUser != "") {
                if (pipedriveUser.values.length > 0) {
                    return pipedriveUser.getValue(0, "id");
                } else {
                    return false;
                }
            }
        }
    }

}


function f_atualizarRegistro(idForm, idresposta, idPipe, dataSet) {
    try {
        var newDataset = dataSet;
        var connectionWD = null;
        var statementWD = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();

        if ((idForm == '') || (idresposta == '') || (idPipe == '')) {
            return false;
        }

        var wSQL = "insert into kbt_t_forms_pipe (idform, idresposta, idpipe, datenvio, situacao) values ('" + idForm + "','" + idresposta + "'," + idPipe + ",current_date,'E')";
        statementWD = connectionWD.prepareStatement(wSQL);
        statementWD.executeUpdate();
        return true;

    } catch (error) {
        return false;
    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

    }
}