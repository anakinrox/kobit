var gDataCorte = '2024-03-31';
var gDataIntegraMestre = '2024-09-01';
var gTokenMestre = '9ch6/Fi).66fB"!%.w\\2Jh%gZ!Y{2Ae,nSM79n!hE@-Dni/:v$oekr*+,"$.^e%X';
var gToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMDkwNzIwMjQiLCJub21lIjoiZmx1aWcifQ.Gh8g5STXlLkOfwUDmutQwmMzqjxvaUO0VafCCHJVQrs';
var gRota = '/01'
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## Sync Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    var wToken = '';

    try {
        var wToken = f_getToken();
        if (wToken != null) {
            f_postInstalacoes(wToken, newDataset);

            f_getInstalacoes(wToken, newDataset);

            f_loadInstalacoes(wToken, newDataset);
            f_updateInstalacoes(wToken, newDataset);
            f_enviaPontosMestre(wToken, newDataset);
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return newDataset;
}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Sync Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    var wToken = '';

    try {
        var wToken = f_getToken();
        if (wToken != null) {
            f_postInstalacoes(wToken, newDataset);

            f_getInstalacoes(wToken, newDataset);

            f_loadInstalacoes(wToken, newDataset);
            f_updateInstalacoes(wToken, newDataset);
            f_enviaPontosMestre(wToken, newDataset);
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return newDataset;
}

function onMobileSync(user) {

}

function f_postInstalacoes(wToken, pDataset) {


    try {
        var arrInstalacoes = [];
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var rsWD2 = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        // printLog("info", "End Point Instalacaoes: ");
        // pDataset.addRow(new Array("Enviando Instalacaoes:"));
        var arrInstalacoes = [];
        var sql = "select ";
        sql += "    kbt.id, ";
        sql += "    kbt.datregistro, ";
        sql += "    CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, ";
        sql += "    pr.id as idProposta, ";
        sql += "    kbt.seq_proposta as seqProposta, ";
        sql += "    REPLACE(p.nome_razao,'''',' ') as nome_razao, ";
        sql += "    kbt.num_telefone, ";
        sql += "    CONCAT(REPLACE(pEnd.logradouro,'''',' '), ', ', pEnd.numero) as endereco, ";
        sql += "    pEnd.bairro, ";
        sql += "    pEnd.cep, ";
        sql += "    kbt.cidade, ";
        sql += "    kbt.uf, ";
        sql += "    pInstador.cnpj_cpf as instalador, ";
        sql += "    kbt.datagendaini,  ";
        sql += "    kbt.datagendafim,  ";
        sql += "    kbtS.id as idSituacao  ";
        sql += "from kbt_t_instalacoes kbt  ";
        sql += "    inner join kbt_t_instalacoes_status kbtS on (kbtS.id = kbt.id_status)   ";
        sql += "    inner join pon_proposta pr on(pr.id = kbt.idproposta)   ";
        sql += "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente)   ";
        sql += "    inner join pon_pessoa p on(p.id = pc.id_pessoa)    ";
        sql += "    inner join pon_pessoa_arquiteto pIns on(pIns.id = kbt.idinstalador)  ";
        sql += "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
        sql += "    inner join pon_pessoa_endereco pEnd on (pEnd.id = pr.id_endereco_entrega) ";
        sql += "where 1 = 1 ";
        sql += "  and kbtS.indsinc = 'S' ";
        sql += "  and kbt.ind_sync = 'S'";
        // sql += " and pr.id = 339748";
        statementWD = connectionWD.prepareStatement(sql);
        var rsWD = statementWD.executeQuery();

        const jDocumento = f_getDocumento();

        while (rsWD.next()) {

            var arrInstalacoesItens = [];
            var SQL = "select pI.idseq, pi.idproduto, pI.descricao, pi.local ";
            SQL += "from kbt_t_instalacoes_itens pI  ";
            SQL += "where pi.idproposta = " + rsWD.getString("idProposta");
            SQL += "  and pi.seqinstall = " + rsWD.getString("seqProposta");
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD2 = statementWD.executeQuery();
            while (rsWD2.next()) {

                var dados = {
                    SEQ: rsWD2.getString("idseq") + '@' + rsWD2.getString("idproduto"),
                    DESCRICAO: rsWD2.getString("descricao") + " - " + rsWD2.getString("local") + ""
                }
                arrInstalacoesItens.push(dados)
            }


            var dados = {
                INDACAO: (rsWD.getString("idSituacao") == '11' ? 'D' : 'A'),
                IDINT: parseInt(rsWD.getString("id")),
                DATREGISTRO: rsWD.getString("datregistro") + "",
                PROPOSTA: rsWD.getString("proposta") + "",
                IDPROPOSTA: rsWD.getString("idProposta") + "",
                SEQINSTALL: rsWD.getString("seqProposta") + "",
                CLIENTE: rsWD.getString("nome_razao") + "",
                NUMTELEFONE: rsWD.getString("num_telefone") + "",
                ENDERECO: rsWD.getString("endereco") + "",
                BAIRRO: rsWD.getString("bairro") + "",
                CEP: rsWD.getString("cep") + "",
                CIDADE: rsWD.getString("cidade") + "",
                UF: rsWD.getString("uf") + "",
                INSTALADOR: rsWD.getString("instalador") + "",
                DATATRIBUIDO: rsWD.getString("datagendaini") + "",
                DATAGENDA: rsWD.getString("datagendaini") + "",
                DATAGENDAFIM: rsWD.getString("datagendafim") + "",
                DOCUMENTO: jDocumento,
                SERVICOS: arrInstalacoesItens
            }
            arrInstalacoes.push(dados);

        }

        printLog("info", "JSON Instalacao: " + gson.toJson(arrInstalacoes));

        var endpoint = "/instalacao";
        if (arrInstalacoes.length > 0) {
            var endpoint = gRota + "/instalacoes";
            var objInstalacao = f_atualizarRegistro(endpoint, gToken, arrInstalacoes, "arquitetos")

            if (objInstalacao != null) {
                if (objInstalacao.STATUS == true) {
                    printLog("erro", "JSON Retorno:" + gson.toJson(objInstalacao.DATA));

                    for (var i = 0; i < objInstalacao.DATA.length; i++) {
                        var SQLINS = "update kbt_t_instalacoes set ind_sync = null ";
                        // SQLINS += instalacao.data[i].ACAO != "DEL" ? ", id_status = 10 " : "";
                        SQLINS += "where id = " + objInstalacao.DATA[i].IDINT;
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        // pDataset.addRow(new Array("SQL: " + SQLINS));
                    }
                }
                pDataset.addRow(new Array("instalações Enviados"));
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD2 != null) rsWD2.close();
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
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

function f_updateInstalacoes(wToken, pDataset) {
    try {
        var arrInstaladores = [];
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var rsWD2 = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var SQL = "select kbtP.id, kbtP.idproposta, kbtS.ordem " +
            " from kbt_t_instalacoes kbtP " +
            "     inner join kbt_t_instalacoes_status kbtS on(kbtS.id = kbtP.id_status) " +
            "         and(kbtS.ordem in (1,2)) ";
        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        var wNumReg = 0;
        var wNumRegUP = 0;
        var wNumRegUPOrdem1 = 0;
        var wNumRegUPOrdem2 = 0;

        while (rsWD.next()) {
            try {
                wNumReg++;
                var wAchouProp = false;

                if (rsWD.getString("ordem") == '1') {
                    wAchouProp = false;
                    var SQLProp = "select dt_envio_producao from pon_proposta where id = " + rsWD.getString("idproposta")
                    statementWD = connectionWD.prepareStatement(SQLProp);
                    rsWD2 = statementWD.executeQuery();

                    while (rsWD2.next()) {
                        if ((rsWD2.getString("dt_envio_producao") != null && rsWD2.getString("dt_envio_producao") != 'null')) {
                            wAchouProp = true;
                        }
                    }

                    if (wAchouProp) {
                        wNumRegUP++;
                        wNumRegUPOrdem1++;
                        var SQLINS = "update kbt_t_instalacoes set id_status = 6 where id = " + rsWD.getString("id");
                        statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();
                    }
                }

                if (rsWD.getString("ordem") == '2') {
                    wAchouProp = false;
                    var wDataEmissao = '';
                    var SQLProp = "select TO_CHAR(min(dt_emissao)::date, 'yyyy-MM-dd') as data from pon_proposta_notas where id_proposta = " + rsWD.getString("idproposta") + " limit 1";
                    statementWD = connectionWD.prepareStatement(SQLProp);
                    rsWD2 = statementWD.executeQuery();

                    while (rsWD2.next()) {
                        if (rsWD2.getString("data") != null) {
                            wAchouProp = true;
                            wDataEmissao = rsWD2.getString("data");
                        }
                    }

                    if (wAchouProp) {
                        wNumRegUP++;
                        wNumRegUPOrdem2++;
                        var SQLINS = "update kbt_t_instalacoes set id_status = 7, dat_emissao_nf = '" + wDataEmissao + "' where id = " + rsWD.getString("id");
                        statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();
                    }


                }

            } catch (error) {
                pDataset.addRow(new Array("Erro Update Instalacao: " + error.toString() + " linha: " + error.lineNumber));
                continue;
            }

        }

        pDataset.addRow(new Array('Registros processados: ' + wNumReg + ' Registros UP: ' + wNumRegUP + ' Ordem 1: ' + wNumRegUPOrdem1 + ' Ordem 2: ' + wNumRegUPOrdem2));

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadInstalacao: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD2 != null) rsWD2.close();
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getInstalacoes(pToken, pDataset) {
    var wIdProposta;
    try {

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var sql = "select kbt.id, kbt.idproposta, kbt.seq_proposta as seqProposta, CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, kbt.nom_responsavel, kbt.num_telefone, ";
        sql += " kbt.id_status ";
        sql += "from kbt_t_instalacoes kbt ";
        sql += "    inner join kbt_t_instalacoes_status kbtS on (kbtS.id = kbt.id_status)   ";
        sql += "    inner join pon_proposta pr on(pr.id = kbt.idproposta)  ";
        sql += "where kbtS.indsinc = 'S' ";
        sql += "  and kbt.ind_sync is null ";
        sql += "  and kbt.id_status <> 11 ";
        // sql += "  and pr.nr_proposta = 347788 ";

        statementWD = connectionWD.prepareStatement(sql);
        var rsWD = statementWD.executeQuery();

        while (rsWD.next()) {

            try {
                wIdProposta = rsWD.getString("idproposta");

                // if (rsWD.getString("idproposta") != '333752') {
                //     continue;
                // }

                // pDataset.addRow(new Array("ID Proposta: " + rsWD.getString("idproposta") + " - Seq:" + rsWD.getString("seqProposta") + " - Proposta: " + rsWD.getString("proposta")));

                // var endpoint = '/listainstalacao?proposta=' + rsWD.getString("idproposta") + "&seqinstall=" + rsWD.getString("seqProposta");
                var endpoint = gRota + '/listainstalacao?idproposta=' + rsWD.getString("idproposta") + "&seqinstall=" + rsWD.getString("seqProposta") + "&fotos=N&servico=";

                // pDataset.addRow(new Array("End Point " + endpoint.replace(/'/g, '')));
                var wObj = f_atualizarRegistro(endpoint, gToken, '', 'arquitetos');
                if (wObj != null) {

                    var wNumTelefone = (rsWD.getString("num_telefone").substring(0, 2) != "55" ? '55' + justNumbers(rsWD.getString("num_telefone")) : justNumbers(rsWD.getString("num_telefone")));

                    for (var x = 0; x < wObj.length; x++) {

                        // if (wObj[x].STATUS == 'OK') {
                        // pDataset.addRow(new Array("ID Proposta: " + rsWD.getString("idproposta") + " Telefone: " + wNumTelefone + " Situacao: " + wObj[x].INDSITUACAO));
                        for (var k = 0; k < wObj[x].SERVICOS.length; k++) {
                            if (wObj[x].SERVICOS[k].SITUACAO == 'F') {
                                var wItem = wObj[x].SERVICOS[k].IDSEQ.split("@");

                                var SQLINS = "update kbt_t_instalacoes_itens set ind_situacao = 'F' where idinstalacao = " + rsWD.getString("id") + " and seqinstall = " + rsWD.getString("seqProposta") + " and idseq = " + wItem[0] + " and idproduto = " + wItem[1];
                                // pDataset.addRow(new Array(SQLINS));
                                var statementWD = connectionWD.prepareStatement(SQLINS);
                                statementWD.executeUpdate();
                            }

                        }

                        if (wObj[x].INDSITUACAO == 'R') {
                            var SQLINS = "update kbt_t_instalacoes set id_status = 14, token = null, datagendaini = null, datagendafim = null, idinstalador = null where id = " + rsWD.getString("id");
                            var statementWD = connectionWD.prepareStatement(SQLINS);
                            statementWD.executeUpdate();
                        }


                        if (wObj[x].INDSITUACAO == 'T') {
                            var SQLComple = '';
                            if (wObj[x].ACEITE.DOCUMENTO != undefined && wObj[x].ACEITE.DATACEITE != null) {
                                SQLComple = ", num_documento = " + wObj[x].ACEITE.DOCUMENTO + ", dat_aceite = '" + wObj[x].ACEITE.DATACEITE.split('T')[0] + "', aceite = '" + wObj[x].ACEITE.ACEITE + "' ";
                            }

                            var SQLINS = "update kbt_t_instalacoes set id_status = 12, token = null, obs_apta = ? ";
                            SQLINS += SQLComple;
                            SQLINS += " where id = " + rsWD.getString("id");
                            var statementWD = connectionWD.prepareStatement(SQLINS);
                            statementWD.setString(1, wObj[x].OBSERVACAO);
                            statementWD.executeUpdate();
                        }

                        if (wObj[x].INDSITUACAO == 'P' || wObj[x].INDSITUACAO == 'E') {
                            var SQLComple = '';
                            if (wObj[x].ACEITE.DOCUMENTO != undefined && wObj[x].ACEITE.DATACEITE != null) {
                                SQLComple = ", num_documento = " + wObj[x].ACEITE.DOCUMENTO + ", dat_aceite = '" + wObj[x].ACEITE.DATACEITE.split('T')[0] + "', aceite = '" + wObj[x].ACEITE.ACEITE + "' ";
                            }

                            var wStatus = wObj[x].INDSITUACAO == 'P' ? 10 : 2;
                            var SQLINS = "update kbt_t_instalacoes set id_status = " + wStatus + ", datagendaini = '" + wObj[x].AGENDAINI + "', datagendafim = '" + wObj[x].AGENDAINI + "' ";
                            SQLINS += SQLComple;
                            SQLINS += " where id = " + rsWD.getString("id");
                            var statementWD = connectionWD.prepareStatement(SQLINS);
                            statementWD.executeUpdate();

                        }

                        if (wObj[x].INDSITUACAO == 'F') {
                            var wToken = makeid(4);
                            var widInstalacao = rsWD.getString("id")
                            var widInstalacao64 = java.util.Base64.getEncoder().encodeToString(widInstalacao.getBytes());

                            // pDataset.addRow(new Array("SQL " + SQLINS));
                            var ct = new Array();
                            ct.push(DatasetFactory.createConstraint('endpoint', 'mensagem', null, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('codMensagem', '5', '5', ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('num_destinatario', wNumTelefone, wNumTelefone, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('link', 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + widInstalacao64, 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + widInstalacao64, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('token', wToken, wToken, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('telefone', '0800-642-3521', '0800-642-3521', ConstraintType.MUST));
                            var ds = DatasetFactory.getDataset('dsk_fortics', null, ct, null);
                            // var ds = null;
                            if ((ds != null) && (ds.rowsCount > 0)) {
                                if (ds.rowsCount > 0) {
                                    if (ds.getValue(0, "STATUS") == true) {
                                        var SQLINS = "insert into kbt_t_instalacoes_whats ( id, idinstalacao, dataregistro, numtelefone, idmensagem)  values ";
                                        SQLINS += "((select COALESCE(max(id) +1 ,1) from kbt_t_instalacoes_whats), " + widInstalacao + ",CURRENT_DATE,'" + rsWD.getString("num_telefone") + "','" + ds.getValue(0, "ID") + "')";
                                        var statementWD = connectionWD.prepareStatement(SQLINS);
                                        statementWD.executeUpdate();

                                        // pDataset.addRow(new Array("Enviou a mensagem, ID: " + ds.getValue(0, "ID")));
                                    } else {
                                        pDataset.addRow(new Array("Não enviou, Error: " + ds.getValue(0, "MENSAGEM")));
                                    }
                                }
                            }

                            var SQLComple = '';
                            if (wObj[x].ACEITE.DOCUMENTO != undefined && wObj[x].ACEITE.DATACEITE != null) {
                                SQLComple = ", num_documento = " + wObj[x].ACEITE.DOCUMENTO + ", dat_aceite = '" + wObj[x].ACEITE.DATACEITE.split('T')[0] + "', aceite = '" + wObj[x].ACEITE.ACEITE + "' ";
                            }

                            var SQLINS = "update kbt_t_instalacoes set id_status = 3, token = '" + wToken + "', data_fim_instalacao = current_date ";
                            SQLINS += SQLComple;
                            SQLINS += " where id = " + rsWD.getString("id");
                            var statementWD = connectionWD.prepareStatement(SQLINS);
                            statementWD.executeUpdate();
                        }
                        // }
                    }
                }
            } catch (error) {
                pDataset.addRow(new Array(error + ' linha: ' + error.lineNumber + ' P: ' + wIdProposta));
                continue
            }
        }
        pDataset.addRow(new Array("Carregando informações das Instalações "));
    } catch (error) {
        pDataset.addRow(new Array(error + ' linha: ' + error.lineNumber + ' P: ' + wIdProposta));

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_enviaPontosMestre(pToken, pDataset) {

    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();



        var sql = "select " +
            "    kbt.id, " +
            "    kbt.idproposta, " +
            "    COALESCE(kbt.num_nota, 0) as num_nota, " +
            "    p.nome_razao as nome_cliente, " +
            "    pInstador.cnpj_cpf, " +
            "    pInstador.nome_razao, " +
            "    CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta " +
            "from kbt_t_instalacoes kbt " +
            "    inner join pon_proposta pr on(pr.id = kbt.idproposta) " +
            "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente) " +
            "    inner join pon_pessoa p on(p.id = pc.id_pessoa) " +
            "    inner join pon_pessoa_arquiteto pIns on(pIns.id = kbt.idinstalador)  " +
            "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) " +
            "where kbt.id_status = 4  " +
            "  and kbt.id_mestre is null  " +
            "  and kbt.data_aprovado >= '" + gDataIntegraMestre + "' "

        statementWD = connectionWD.prepareStatement(sql);
        var rsWD = statementWD.executeQuery();

        var arrInstalacao = [];

        while (rsWD.next()) {

            if (parseInt(rsWD.getString("num_nota")) >= 8) {
                var wPontos = 0;

                switch (parseInt(rsWD.getString("num_nota"))) {
                    case 8:
                        wPontos = 300;
                        wTamplate = 'mestresnota8';
                        break
                    case 9:
                        wPontos = 500;
                        wTamplate = 'mestresnota9';
                        break
                    case 10:
                        wPontos = 700;
                        wTamplate = 'mestresnota10';
                        break
                }

                var data = {
                    document: rsWD.getString("cnpj_cpf"),
                    id: parseInt(rsWD.getString("id")),
                    description: "Pontuação creditada referente a avaliação do cliente no serviço prestado conforme proposta: " + rsWD.getString("proposta"),
                    score: parseInt(wPontos.toFixed(0))
                }
                arrInstalacao.push(data);
            }
        }

        if (arrInstalacao.length > 0) {

            const wEndPoint = '/integration/score-through-the-app';
            var objPontos = f_pontuaMostre(wEndPoint, arrInstalacao, pDataset);
            // var objPontos = JSON.parse('[{"document":"33244282000121","scoreId":4445,"id":2073},{"document":"10652922000218","id":7743},{"document":"33244282000121","scoreId":4446,"id":7018},{"document":"33470860000148","scoreId":4447,"id":6018}]');

            if (objPontos != null) {
                if (objPontos.error == undefined) {
                    for (let i = 0; i < objPontos.length; i++) {
                        if (objPontos[i].scoreId != undefined && objPontos[i].scoreId != null) {
                            var SQLUPD = "update kbt_t_instalacoes set id_mestre = " + objPontos[i].scoreId + " where id = " + objPontos[i].id;
                            statementWD = connectionWD.prepareStatement(SQLUPD);
                            statementWD.executeUpdate();


                            var sql = "select " +
                                "    distinct " +
                                "    p.nome_razao as nome_cliente, " +
                                "    pInstador.nome_razao, " +
                                "    COALESCE(kbt.num_nota, 0) as num_nota, " +
                                "    pFone.telefone " +
                                "from kbt_t_instalacoes kbt  " +
                                "    inner join pon_proposta pr on(pr.id = kbt.idproposta)  " +
                                "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente)  " +
                                "    inner join pon_pessoa p on(p.id = pc.id_pessoa)  " +
                                "    inner join pon_pessoa_arquiteto pIns on(pIns.id = kbt.idinstalador)   " +
                                "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa)  " +
                                "    inner join pon_pessoa_telefone pFone on(pFone.id_pessoa = pIns.id_pessoa) " +
                                "                            and(pFone.tipo_telefone = 'Celular') " +
                                "                            and(pFone.principal = true) " +
                                "where kbt.id = " + objPontos[i].id;

                            statementWD = connectionWD.prepareStatement(sql);
                            var rsWD = statementWD.executeQuery();

                            while (rsWD.next()) {

                                var wTamplate = '';

                                switch (parseInt(rsWD.getString("num_nota"))) {
                                    case 8:
                                        wTamplate = 'mestresnota8';
                                        break
                                    case 9:
                                        wTamplate = 'mestresnota9';
                                        break
                                    case 10:
                                        wTamplate = 'mestresnota10';
                                        break
                                }

                                var wNumTelefone = (rsWD.getString("telefone").substring(0, 2) != "55" ? '55' + justNumbers(rsWD.getString("telefone")) : justNumbers(rsWD.getString("telefone")));
                                var ct = new Array();
                                ct.push(DatasetFactory.createConstraint('endpoint', 'mensagem', null, ConstraintType.MUST));
                                ct.push(DatasetFactory.createConstraint('codMensagem', '7', '7', ConstraintType.MUST));
                                ct.push(DatasetFactory.createConstraint('num_destinatario', wNumTelefone, wNumTelefone, ConstraintType.MUST));
                                ct.push(DatasetFactory.createConstraint('instalador', rsWD.getString("nome_razao"), rsWD.getString("nome_razao"), ConstraintType.MUST));
                                ct.push(DatasetFactory.createConstraint('nome_cliente', rsWD.getString("nome_cliente"), rsWD.getString("nome_cliente"), ConstraintType.MUST));
                                ct.push(DatasetFactory.createConstraint('tamplate', wTamplate, wTamplate, ConstraintType.MUST));
                                var ds = DatasetFactory.getDataset('dsk_fortics', null, ct, null);
                                if ((ds != null) && (ds.rowsCount > 0)) {
                                    if (ds.rowsCount > 0) {
                                        if (ds.getValue(0, "STATUS") == true) {
                                            pDataset.addRow(new Array("Telefone: " + wNumTelefone + ' Tamplate: ' + wTamplate));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        pDataset.addRow(new Array("Enviado pontos para o mestre "));
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pIndServico) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "tracking";
    var gson = new com.google.gson.Gson();
    var params = {};

    if (pIndServico != undefined) {
        wServiceCode = pIndServico
    }

    if (jsonFile != "") {
        metodo = "POST";
        params = {
            json: gson.toJson(jsonFile)
        };

        if (pIndServico != undefined) {
            params = gson.toJson(jsonFile);
        }
    }

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: PendPoint,
        timeoutService: "240",
        method: metodo,
    };


    var headers = {};
    headers["x-access-token"] = Ptoken;
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    if (pIndServico == undefined) {
        data["params"] = params;
    } else {
        if (metodo == 'POST') {
            data["strParams"] = params;
        }

    }

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

function f_pontuaMostre(PendPoint, jsonFile, pDataset) {
    try {
        var retorno = null;
        var metodo = "POST";
        var wServiceCode = "mestre";
        var gson = new com.google.gson.Gson();

        // var params = jsonFile
        var params = {
            data: jsonFile.length > 0 ? jsonFile : []
        };

        // gson.toJson(jsonFile)

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: PendPoint,
            timeoutService: "240",
            method: metodo,
        };

        // var params;
        var headers = {};
        headers["Authorization"] = ' Bearer ' + gTokenMestre;
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        // data["strParams"] = params;
        data["params"] = params;

        var jj = gson.toJson(data);
        var vo = clientService.invoke(jj);

        printLog("info", "  : ");
        log.dir(vo);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            // pDataset.addRow(new Array(vo));

            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        return retorno;
    }
}

function f_loadInstalacoes(wToken, pDataset) {
    try {
        var arrInstaladores = [];
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var rsWD2 = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var SQL = "select distinct pr.id,  pr.nr_proposta, city.uf, REPLACE(city.cidade,'''','') as cidade, pv.equipe " +
            " from pon_proposta pr  " +
            "     inner join pon_pessoa_endereco pEnd on(pEnd.id = pr.id_endereco_entrega)  " +
            "     inner join pon_pessoa_vendedor pv on(pv.id = pr.id_vendedor)  " +
            "     inner join fluig_v_cidade city on(pEnd.cod_uf = city.cod_uf) " +
            "         and(pEnd.cod_cidade = city.cod_cidade_ibge)  " +
            " WHERE pr.instalacao_inclusa = true  " +
            " and pr.dh_emissao >= '" + gDataCorte + "' " +
            " and pr.id_status not in ('1', '2', '3', '14', '21', '22', '25', '26')";
        // " and pr.id = 319441";
        // "";

        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        var wNumReg = 0;

        while (rsWD.next()) {
            try {
                wNumReg++;
                var wAchouProp = false;
                // pDataset.addRow(new Array("ID Proposta: " + rsWD.getString("id") + ' - Proposta: ' + rsWD.getString("nr_proposta")));
                var wItensProposta = f_loadItensProposta(pDataset, connectionWD, rsWD.getString("id"));
                if (wItensProposta == 0) {
                    continue;
                }
                var wItensLiberado = f_loadItensLiberado(pDataset, connectionWD, rsWD.getString("id"));

                // pDataset.addRow(new Array("P:" + rsWD.getString("id") + " - Itens P: " + wItensProposta + " - Itens L: " + wItensLiberado));
                if (wItensLiberado < wItensProposta) {

                    var SQLProp = "select 1 achou from kbt_t_instalacoes kbt " +
                        "where kbt.idproposta = " + rsWD.getString("id") +
                        "and kbt.id_status <> 11 " +
                        "and not exists(select 1 from kbt_t_instalacoes_itens where idproposta = kbt.idproposta  and seqinstall = kbt.seq_proposta) ";

                    statementWD = connectionWD.prepareStatement(SQLProp);
                    rsWD2 = statementWD.executeQuery();

                    while (rsWD2.next()) {
                        wAchouProp = true;
                    }

                    // pDataset.addRow(new Array("Final wAchouProp:" + wAchouProp));

                    if (!wAchouProp) {
                        var SQLINS = "insert into kbt_t_instalacoes ( id, idproposta, seq_proposta, id_status, cidade, uf, equipe)  values ";
                        SQLINS += "((select COALESCE(max(id) +1 ,1) from kbt_t_instalacoes), " + rsWD.getString("id") + ",(select COALESCE(count(idproposta) +1 ,1) from kbt_t_instalacoes where idproposta = " + rsWD.getString("id") + "),(select id from kbt_t_instalacoes_status where ordem = 1),'" + rsWD.getString("cidade") + "','" + rsWD.getString("uf") + "','" + rsWD.getString("equipe") + "')";
                        statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();
                    }
                }
            } catch (error) {
                pDataset.addRow(new Array("Erro LoadInstalacao: " + error.toString() + " linha: " + error.lineNumber));
                continue;
            }
        }

        pDataset.addRow(new Array("Registros processados: " + wNumReg));

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadInstalacao: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD2 != null) rsWD2.close();
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_loadItensProposta(pDataset, pConnection, pIdProposta) {
    try {
        var wRetItens = 0;
        var wRetItensPortas = 0;
        var wRetItensOutros = 0;

        wRetItensPortas = f_loadItensPropostaProntas(pDataset, pConnection, pIdProposta);
        wRetItensOutros = f_loadItensPropostaoutros(pDataset, pConnection, pIdProposta);

        wRetItens = wRetItensPortas + wRetItensOutros;
        var rsWD = null;
        var statementWD = null;

        var SQL = "select  count(pi.id) as itens " +
            "from pon_proposta_itens pI  " +
            "    inner join pon_proposta_componentes d on(pI.id = d.id_proposta_item) " +
            "    inner join pon_produtos pp on(pp.id = d.id_produto)" +
            "        and(pp.id_produto_tipo in (1, 7, 12, 24, 25, 26, 4, 22)) " +
            "where pi.id_proposta = " + pIdProposta;

        // statementWD = pConnection.prepareStatement(SQL);
        // var rsWD = statementWD.executeQuery();

        // while (rsWD.next()) {
        //     wRetItens = parseInt(rsWD.getString("itens"));
        // }

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadItens: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();

        return wRetItens;
    }
}

function f_loadItensPropostaoutros(pDataset, pConnection, pIdProposta) {
    try {
        var wRetItens = 0;
        var rsWD = null;
        var statementWD = null;

        var SQL = "select " +
            "        count(prod.id_produto_tipo) as itens   " +
            "from pon_produtos prod   " +
            "       left join pon_proposta_componentes comp on(comp.id_produto = prod.id) " +
            "       left join pon_proposta_itens itm on(comp.id_proposta_item = itm.id)  " +
            "       left join pon_proposta prop on(itm.id_proposta = prop.id) " +
            "       left join pon_categoria cat on(prod.id_categoria = cat.id) " +
            "where cat.id not in (8, 9, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 31, 32, 33, 37, 38, 43, 44, 45, 46, 47, 49, 50, 52, 54, 55) " +
            "  and prop.id_status in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19, 20, 23, 24, 25, 26) " +
            "  and prop.id = " + pIdProposta +
            "  and itm.id_produto_tipo not in (7,12) ";

        statementWD = pConnection.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wRetItens = parseInt(rsWD.getString("itens"));
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadItens: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        return wRetItens;
    }
}

function f_loadItensPropostaProntas(pDataset, pConnection, pIdProposta) {
    try {
        var wRetItens = 0;
        var rsWD = null;
        var statementWD = null;

        var SQL = "select " +
            "        count(prod.id_produto_tipo) as itens   " +
            "from pon_produtos prod   " +
            "       left join pon_proposta_componentes comp on(comp.id_produto = prod.id) " +
            "       left join pon_proposta_itens itm on(comp.id_proposta_item = itm.id)  " +
            "       left join pon_proposta prop on(itm.id_proposta = prop.id) " +
            "       left join pon_categoria cat on(prod.id_categoria = cat.id) " +
            "where cat.id not in (5, 6, 8, 9, 16, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 37, 38, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 54, 55) " +
            "  and prop.id_status in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19, 20, 23, 24, 25, 26) " +
            "  and prop.id = " + pIdProposta +
            "  and itm.id_produto_tipo in (7,12) " +
            "  and prod.id_produto_tipo = 1 ";

        statementWD = pConnection.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wRetItens = parseInt(rsWD.getString("itens"));
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadItens: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        return wRetItens;
    }
}

function f_loadItensLiberado(pDataset, pConnection, pIdProposta) {
    try {
        var wRetItens = 0;
        var rsWD = null;
        var statementWD = null;

        var SQL = "select count(idseq) as itens " +
            "from kbt_t_instalacoes_itens kbt " +
            "where kbt.idproposta = " + pIdProposta +
            "  and idseq <> '-99' ";

        statementWD = pConnection.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wRetItens = parseInt(rsWD.getString("itens"));
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro LoadItens: " + error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();

        return wRetItens;
    }
}

function justNumbers(text) {
    var numbers = text.replaceAll("[^0-9]", "")
    return parseInt(numbers);
}

function makeid(length) {
    var result = '';
    // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function f_getToken() {

    var retorno = null;
    var params = {
        login: "02925364969",
        senha: "123",
        datRemoto: "",
        horRemoto: ""
    };

    var endpoint = "/login"; // endPoint pra buscar o Token

    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "tracking",
            endpoint: endpoint,
            timeoutService: "240",
            method: "POST",
        };

        var headers = {};
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        data["params"] = params;

        var jj = JSON.stringify(data);
        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            if (jr.STATUS == 'OK') {
                retorno = jr.TOKEN;
            }
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return retorno;


}

function f_getDocumento(pDataset) {
    try {
        var documento = {}
        const parentDocument = 1396081;
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        const sql = "select NR_DOCUMENTO as id, NR_VERSAO as version, COD_EMPRESA as companyId, TP_DOCUMENTO as tipo " +
            "from documento d where d.COD_EMPRESA = 1 and d.NR_DOCUMENTO_PAI = ? and VERSAO_ATIVA = 1 order by id desc limit 1";

        statementWD = connectionWD.prepareStatement(sql);
        statementWD.setInt(1, parentDocument);
        var rsWD = statementWD.executeQuery();

        var arrInstalacao = [];

        while (rsWD.next()) {
            // rsWD.getString("num_nota")
            var wDocumento = parseInt(rsWD.getString("id"));
            var urlDocumento = fluigAPI.getDocumentService().getDownloadURL(wDocumento);
            documento = {
                ID: wDocumento,
                URLDOCUMENTO: urlDocumento

            }
            // pDataset.addRow(new Array("json: " + gson.toJson(documento)));
        }



        // pDataset.addRow(new Array("Enviado pontos para o mestre "))
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return documento;
    }
}