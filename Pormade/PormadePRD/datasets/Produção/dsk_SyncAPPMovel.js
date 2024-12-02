function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## Sync Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    try {
        var wToken = f_getToken();
        if (wToken != null) {
            f_postAgenda(wToken, newDataset);
            f_postEventos(wToken, newDataset);


            f_getVisitas(wToken, newDataset);
            f_getLeads(wToken, newDataset);
            f_getEventosLeadNew(wToken, newDataset);
            // f_getPernoite(wToken, newDataset);
            // f_getCondominios(wToken, newDataset);
            f_getPipe(wToken, newDataset);


            // f_getLeads(wToken, newDataset);
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
    try {
        var wToken = f_getToken();
        if (wToken != null) {

            // f_postAgenda(wToken, newDataset);
            // f_postEventos(wToken, newDataset);

            // f_getVisitas(wToken, newDataset);
            // f_getLeads(wToken, newDataset);
            // f_getEventosLeadNew(wToken, newDataset);
            // f_getPernoite(wToken, newDataset);
            // f_getCondominios(wToken, newDataset);
            f_getPipe(wToken, newDataset);


            // f_getLeads(wToken, newDataset);
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return newDataset;
}

function onMobileSync(user) {
}

function f_postAgenda(wToken, pDataset) {
    // ################### Envia os Agenda #########################
    try {
        var arrAgenda = [];
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var rsWDAgenda = null;
        var rsWDParceiro = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        var gson = new com.google.gson.Gson();

        connectionWD = dataSourceWD.getConnection();
        var tReservas = getTable('ds_ReservasSalas', '');
        var tCidades = getTable('ds_ReservasSalas', 'tabela_cidades');
        var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');
        var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');

        printLog("info", "End Point Agenda: ");
        pDataset.addRow(new Array("Tabela Reserva: " + tReservas));

        // var constraints = new Array();

        // var dataset = DatasetFactory.getDataset("ds_ReservasSalas", null, constraints, null);
        // // var dataset = null;
        // if (dataset != null && dataset.rowsCount > 0) {       
        //     for (i = 0; i < dataset.rowsCount; i++) {

        var SQL = " ";
        SQL += " select ";
        SQL += "    sc.documentid, ";
        SQL += "    sc.id_motorista, ";
        SQL += "    sc.id_ajudante, ";
        SQL += "    sc.sala, ";
        SQL += "    sc.nomeEvento, ";
        SQL += "    sc.description, ";
        SQL += "    STR_TO_DATE(sc.dataini, '%d/%m/%Y %H:%i:%s') as dataini, ";
        SQL += "    STR_TO_DATE(sc.datafim, '%d/%m/%Y %H:%i:%s') as datafim ";
        SQL += "from " + tReservas + " sc ";
        SQL += "	join documento dc on(dc.cod_empresa = sc.companyid ";
        SQL += "	        and dc.nr_documento = sc.documentid ";
        SQL += "	        and dc.nr_versao = sc.version  ";
        SQL += "	        and dc.versao_ativa = 1)  ";
        SQL += "where STR_TO_DATE(datafim, '%d/%m/%Y') >= CURDATE() ";
        SQL += "order by ";
        SQL += " STR_TO_DATE(dataini, '%d/%m/%Y') ";

        statementWD = connectionWD.prepareStatement(SQL);
        var rsWDAgenda = statementWD.executeQuery();
        while (rsWDAgenda.next()) {
            var arrIntinarario = [];
            var arrVisitas = [];
            // if (rsWDAgenda.getString("documentid") != 1267472) { continue; }

            var SQL = " select ";
            SQL += " sc.id_itinerario, ";
            SQL += " sc.uf, ";
            SQL += " sc.nome_cidade, ";
            SQL += " sc.cidade_data_prevista_ini, ";
            SQL += " sc.cidade_data_prevista_fim, ";
            SQL += "    sc.* ";
            SQL += "FROM " + tCidades + "  sc  ";
            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
            SQL += "        and dc.nr_documento = sc.documentid      ";
            SQL += "        and dc.nr_versao = sc.version ";
            SQL += "        and dc.versao_ativa = 1) ";
            SQL += "where 1=1 ";
            SQL += "  and sc.documentid = " + rsWDAgenda.getString("documentid");

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                var dados = {
                    DOCUMENTID: rsWDAgenda.getString("documentid") + "",
                    IDINTINARARIO: rsWD.getString("id_itinerario") + "",
                    UF: rsWD.getString("uf") + "",
                    CIDADE: rsWD.getString("nome_cidade") + "",
                    INICIO: rsWD.getString("cidade_data_prevista_ini") + "",
                    FIM: rsWD.getString("cidade_data_prevista_fim") + "",
                    EXPEDIENTE: ""

                }
                arrIntinarario.push(dados);
            }

            var SQL = " select ";
            SQL += "    distinct 1 ";
            SQL += "FROM " + tVisitas + "  sc  ";
            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
            SQL += "        and dc.nr_documento = sc.documentid      ";
            SQL += "        and dc.nr_versao = sc.version ";
            SQL += "        and dc.versao_ativa = 1) ";
            SQL += "where 1=1 ";
            SQL += "  and sc.documentid = " + rsWDAgenda.getString("documentid");
            SQL += "  and (sc.lat_visita is null and sc.long_visita is null)";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var SQL = " select ";
                SQL += "    sc2.nome_cidade, sc.* ";
                SQL += "FROM " + tVisitas + "  sc  ";
                SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
                SQL += "        and dc.nr_documento = sc.documentid      ";
                SQL += "        and dc.nr_versao = sc.version ";
                SQL += "        and dc.versao_ativa = 1) ";
                SQL += "join " + tCidades + " sc2 on (sc2.companyid = sc.companyid      ";
                SQL += "        and sc2.documentid = sc.documentid      ";
                SQL += "        and sc2.version = sc.version ";
                SQL += "        and sc2.id_itinerario = sc.cidade_visita) ";
                SQL += "where 1=1 ";
                SQL += "  and sc.documentid = " + rsWDAgenda.getString("documentid");
                SQL += "  and (sc.lat_visita is null and sc.long_visita is null)";

                statementWD = connectionWD.prepareStatement(SQL);
                rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    var wLocalVisita = rsWD.getString("local_visita");
                    var arrParceiros = [];
                    var SQLParceiro = " select ";
                    SQLParceiro += "    sc.* ";
                    SQLParceiro += "FROM " + tParceiros + "  sc  ";
                    SQLParceiro += "join documento dc on (dc.cod_empresa = sc.companyid      ";
                    SQLParceiro += "        and dc.nr_documento = sc.documentid      ";
                    SQLParceiro += "        and dc.nr_versao = sc.version ";
                    SQLParceiro += "        and dc.versao_ativa = 1) ";
                    SQLParceiro += "where 1=1 ";
                    SQLParceiro += "  and sc.documentid = " + rsWDAgenda.getString("documentid");
                    SQLParceiro += "  and sc.local_parceiro = '" + wLocalVisita.replace("'", "\ ") + "'";
                    SQLParceiro += "  and (sc.lat_parceiro is null and sc.long_parceiro is null)";

                    statementWD = connectionWD.prepareStatement(SQLParceiro);
                    rsWDParceiro = statementWD.executeQuery();
                    while (rsWDParceiro.next()) {

                        printLog("error", "Sql Parceiros: " + SQLParceiro)
                        var dados = {
                            IDFLUIG: rsWDParceiro.getString("id") + "",
                            DOCUMENTID: rsWDAgenda.getString("documentid") + "",
                            CIDADE: rsWDParceiro.getString("cidade_parceiro") + "",
                            PARCEIRO: rsWDParceiro.getString("local_parceiro") + "",
                            NOMEPARCEIRO: rsWDParceiro.getString("nome_parceiro") + "",
                            CONTATO: rsWDParceiro.getString("contato_parceiro") + "",
                            DATA: rsWDParceiro.getString("data_parceiro") + "",
                            TELEFONE: rsWDParceiro.getString("telefone_parceiro") + "",
                            INTERESSE: rsWDParceiro.getString("interesse_parceiro") + "",
                            AREAINTERESSE: rsWDParceiro.getString("area_interesse_parceiro") + ""
                        }
                        arrParceiros.push(dados);
                    }


                    var dados = {
                        IDFLUIG: rsWD.getString("id") + "",
                        DOCUMENTID: rsWDAgenda.getString("documentid") + "",
                        CIDADE: rsWD.getString("nome_cidade") + "",
                        TIPOLOCAL: rsWD.getString("tipo_local_visita") + "",
                        LOCAL: rsWD.getString("local_visita") + "",
                        TIPOLOCAL: rsWD.getString("tipo_local_visita") + "",
                        CONTATO: rsWD.getString("contato_visita") + "",
                        DATA: rsWD.getString("data_visita") + "",
                        TELEFONE: rsWD.getString("telefone_visita") + "",
                        EXPEDIENTE: "",
                        PARCEIROS: arrParceiros
                    }
                    arrVisitas.push(dados);
                }
            }

            var wDataInicio = rsWDAgenda.getString("dataIni").split(" ");
            var wDataFim = rsWDAgenda.getString("datafim").split(" ");

            var dados = {
                DOCUMENTID: rsWDAgenda.getString("documentid") + "",
                MOTORISTA: rsWDAgenda.getString("id_motorista") + "",
                AJUDANTE: rsWDAgenda.getString("id_ajudante") + "",
                NUMPLACA: rsWDAgenda.getString("sala") + "",
                TITULO: rsWDAgenda.getString("nomeEvento") + "",
                DETALHE: rsWDAgenda.getString("description") + "",
                INICIO: wDataInicio[0].split('-').reverse().join('/') + ' ' + wDataInicio[1] + "",
                FIM: wDataFim[0].split('-').reverse().join('/') + ' ' + wDataFim[1] + "",
                INTINARARIO: arrIntinarario,
                VISITAS: arrVisitas
            }
            var str = rsWDAgenda.getString("dataFim");
            var date = new Date(str.split('/').reverse().join('/'));
            var novaData = new Date();
            // pDataset.addRow(new Array("Evento: " + rsWDAgenda.getString("nomeEvento") + ' Data: ' + dados.INICIO));
            // if (date >= novaData) {
            arrAgenda.push(dados);
            // }

        }

        var endpoint = "/agenda";
        printLog("info", "JAgenda: " + gson.toJson(arrAgenda));
        var agenda = f_atualizarRegistro(endpoint, wToken, arrAgenda)
        if (agenda != null) {
            if (agenda.STATUS == 'OK') {
                pDataset.addRow(new Array("Agenda Enviados"));
            } else {
                printLog("info", "Não deu");
                pDataset.addRow(new Array("Erro ao cadastrar Agenda"));
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (rsWDAgenda != null) rsWDAgenda.close();
        if (rsWDParceiro != null) rsWDParceiro.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_postEventos(wToken, pDataset) {

    // ################### Envia os Eventos #########################

    // pDataset.addRow(new Array("Enviando Evt"));

    try {
        var arrEventos = [];
        var connectionWD = null;
        var connectionWDSIS = null;
        var statementWD = null;
        var statementWDSIS = null;
        var rsWD = null;
        var rsWDEventos = null;

        var contextWD = new javax.naming.InitialContext();

        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var dataSourceWDSIS = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWDSIS = dataSourceWDSIS.getConnection();

        var gson = new com.google.gson.Gson();

        printLog("info", "End Point Eventos: ");

        var tEventos = getTable('ds_cadastro_eventos', '');
        var tUsuarios = getTable('ds_cadastro_eventos', 'tabela_usuario');
        // pDataset.addRow(new Array("Tabela Eventos: " + tEventos));
        // pDataset.addRow(new Array("Tabela Usuarios: " + tUsuarios));


        var SQL = " ";
        SQL += " select ";
        SQL += "    sc.id, ";
        SQL += "    sc.documentid, ";
        SQL += "    sc.titulo, ";
        SQL += "    sc.detalhes, ";
        SQL += "    STR_TO_DATE(sc.data_inicio, '%d/%m/%Y') as data_inicio, ";
        SQL += "    STR_TO_DATE(sc.data_fim, '%d/%m/%Y') as data_fim, ";
        SQL += "    sc.codigo_cidade, ";
        SQL += "    sc.endereco, ";
        SQL += "    sc.bairro, ";
        SQL += "    sc.cep, ";
        SQL += "    sc.origem ";
        SQL += "from " + tEventos + " sc ";
        SQL += "	join documento dc on(dc.cod_empresa = sc.companyid ";
        SQL += "	        and dc.nr_documento = sc.documentid ";
        SQL += "	        and dc.nr_versao = sc.version  ";
        SQL += "	        and dc.versao_ativa = 1)  ";
        SQL += "where STR_TO_DATE(sc.data_fim, '%d/%m/%Y') >= CURDATE() ";
        SQL += "order by ";
        SQL += " STR_TO_DATE(sc.data_fim, '%d/%m/%Y') ";

        statementWD = connectionWD.prepareStatement(SQL);
        var rsWDEventos = statementWD.executeQuery();
        while (rsWDEventos.next()) {

            var arrUsuarios = [];
            var SQL = " select ";
            SQL += "    sc.codigo_usuario, ";
            SQL += "    sc.usuario, ";
            SQL += "    STR_TO_DATE(sc.data_inicio_usuario, '%d/%m/%Y') as data_inicio_usuario, ";
            SQL += "    STR_TO_DATE(sc.data_fim_usuario, '%d/%m/%Y') as data_fim_usuario ";
            SQL += "FROM " + tUsuarios + "  sc  ";
            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
            SQL += "        and dc.nr_documento = sc.documentid      ";
            SQL += "        and dc.nr_versao = sc.version ";
            SQL += "        and dc.versao_ativa = 1) ";
            SQL += "where 1=1 ";
            SQL += "  and sc.documentid = " + rsWDEventos.getString("documentid");

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wLogin = '';
                var wCPF = '';


                var SQL = "";
                SQL += "select distinct ";
                SQL += "    u.usr_login, ";
                SQL += "    p.cnpj_cpf ";
                SQL += "from public.fr_usuario u ";
                SQL += "    inner join online.pon_cargos_funcionario cf on(cf.usr_codigo = u.usr_codigo) ";
                SQL += "    left join online.pon_pessoa p on(p.id = cf.id_pessoa) ";
                SQL += "where u.usr_ativo = true        ";
                SQL += "and u.usr_codigo = " + rsWD.getString("codigo_usuario");
                statementWDSIS = connectionWDSIS.prepareStatement(SQL);
                var rsWDUserSIS = statementWDSIS.executeQuery();
                while (rsWDUserSIS.next()) {
                    // pDataset.addRow(new Array("Evento: " + rsWDEventos.getString("titulo") + " USIS: " + rsWD.getString("codigo_usuario") + ' - CPF: ' + rsWDUserSIS.getString("cnpj_cpf")));
                    wLogin = rsWDUserSIS.getString("usr_login");
                    wCPF = rsWDUserSIS.getString("cnpj_cpf");
                }

                rsWDUserSIS.close();

                if (wCPF == '') {
                    var SQL = "select login, user_code from fdn_usertenant where USER_STATE <> 2 and user_code = " + rsWD.getString("codigo_usuario");
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWDUser = statementWD.executeQuery();
                    while (rsWDUser.next()) {
                        // pDataset.addRow(new Array("Evento: " + rsWDEventos.getString("titulo") + " UFluig: " + rsWD.getString("codigo_usuario") + ' - CPF: ' + rsWDUser.getString("user_code")));
                        wLogin = rsWDUser.getString("login");
                        wCPF = rsWDUser.getString("user_code");
                    }

                    rsWDUser.close();
                }

                var dados = {
                    DOCUMENTID: rsWDEventos.getString("documentid") + "",
                    LOGIN: wLogin + "",
                    CPF: wCPF + "",
                    INICIO: rsWD.getString("data_inicio_usuario") + "",
                    FIM: rsWD.getString("data_fim_usuario") + ""
                }
                arrUsuarios.push(dados);
            }

            var dados = {
                ID: rsWDEventos.getString("ID") + "",
                DOCUMENTID: rsWDEventos.getString("documentid") + "",
                EVENTO: rsWDEventos.getString("titulo") + "",
                DETALHE: rsWDEventos.getString("detalhes") + "",
                INICIO: rsWDEventos.getString("data_inicio") + "",
                FIM: rsWDEventos.getString("data_fim") + "",
                CODCIDADE: rsWDEventos.getString("codigo_cidade") + "",
                ENDERECO: rsWDEventos.getString("endereco") + "",
                BAIRRO: rsWDEventos.getString("bairro") + "",
                CEP: rsWDEventos.getString("cep") + "",
                CODORIGEM: rsWDEventos.getString("origem") + "",
                USUARIOS: arrUsuarios
            }

            arrEventos.push(dados);

        }

        var endpoint = "/eventos";
        printLog("error", "Eventos: " + gson.toJson(arrEventos));
        printLog("info", "End Point Eventos: ");


        if (arrEventos.length > 0) {
            var eventos = f_atualizarRegistro(endpoint, wToken, arrEventos)
            printLog("error", "Retorno Eventos: " + gson.toJson(arrEventos));

            if (eventos != null) {
                if (eventos.STATUS == 'OK') {
                    pDataset.addRow(new Array("Eventos Enviados"));
                } else {
                    pDataset.addRow(new Array("Erro ao cadastrar Eventos"));
                }
            }
        }

    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (rsWDEventos != null) rsWDEventos.close();

        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }

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

function getTable(dataSet, table) {
    var ct = new Array();
    ct.push(DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST));
    if (table != ""
        && table != null
        && table != undefined) {
        ct.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
    }
    var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);

    if (table != ""
        && table != null
        && table != undefined) {
        return ds.getValue(0, "tableFilha");
    } else {
        return ds.getValue(0, "table");
    }
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

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pIndServico) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "tracking";
    var gson = new com.google.gson.Gson();

    if (pIndServico != undefined) {
        wServiceCode = pIndServico
    }

    if (jsonFile != "") {
        metodo = "POST";
        var params = {
            json: gson.toJson(jsonFile)
        };
    }

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
    headers["x-access-token"] = Ptoken;
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["params"] = params;

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

function FormataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
}

function f_getVisitas(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=V";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");
        // var wRet = null;
        if (wRet != null) {
            var visita = wRet[0];
            var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');
            if (visita.STATUS == 'OK') {
                for (var i = 0; i < visita.DATA.length; i++) {

                    if (visita.DATA[i].IDFLUIG != null) {
                        var SQL = "";
                        SQL = " update " + tVisitas + " set ";
                        SQL += "  lat_visita =  '" + visita.DATA[i].LATITUDE + "', ";
                        SQL += "  long_visita =  '" + visita.DATA[i].LONGITUDE + "' ";
                        SQL += " where documentid =  " + visita.DATA[i].DOCUMENCTID;
                        SQL += " and id =  " + visita.DATA[i].IDFLUIG;

                        statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();
                    }

                    if (visita.DATA[i].IDFLUIG == null) {
                        try {
                            var listaCampos = new Array();
                            var seq = 0;

                            var SQL = " select ";
                            SQL += "     sc.* ";
                            SQL += "FROM " + tVisitas + "  sc  ";
                            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
                            SQL += "        and dc.nr_documento = sc.documentid      ";
                            SQL += "        and dc.nr_versao = sc.version ";
                            SQL += "        and dc.versao_ativa = 1) ";
                            SQL += "where 1=1 ";
                            SQL += "  and sc.documentid = " + visita.DATA[i].DOCUMENCTID;
                            SQL += "  and sc.cidade_visita = '" + visita.DATA[i].IDINTINARARIO + "'";
                            statementWD = connectionWD.prepareStatement(SQL);
                            var rsWDVisitas = statementWD.executeQuery();

                            while (rsWDVisitas.next()) {
                                seq = seq + 1;
                                listaCampos.push(DatasetFactory.createConstraint('cidade_visita___' + seq, rsWDVisitas.getString("cidade_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('email_solicitante_visita___' + seq, rsWDVisitas.getString("email_solicitante_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('id_solicitante_visita___' + seq, rsWDVisitas.getString("id_solicitante_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('local_visita___' + seq, rsWDVisitas.getString("local_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('tipo_local_visita___' + seq, rsWDVisitas.getString("tipo_local_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('data_visita___' + seq, rsWDVisitas.getString("data_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('contato_visita___' + seq, rsWDVisitas.getString("contato_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('telefone_visita___' + seq, rsWDVisitas.getString("telefone_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('solicitante_visita___' + seq, rsWDVisitas.getString("solicitante_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('lat_visita___' + seq, rsWDVisitas.getString("lat_visita"), 'field', ConstraintType.MUST));
                                listaCampos.push(DatasetFactory.createConstraint('long_visita___' + seq, rsWDVisitas.getString("long_visita"), 'field', ConstraintType.MUST));
                            }

                            if (rsWDVisitas != null) rsWDVisitas.close();
                            seq = seq + 1;

                            listaCampos.push(DatasetFactory.createConstraint('cidade_visita___' + seq, visita.DATA[i].IDINTINARARIO, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('email_solicitante_visita___' + seq, 'fluig@pormade.com.br', 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('id_solicitante_visita___' + seq, 'admlog', 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('local_visita___' + seq, visita.DATA[i].LOCAL, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('tipo_local_visita___' + seq, visita.DATA[i].TPLOCAL, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('data_visita___' + seq, visita.DATA[i].DATA, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('contato_visita___' + seq, visita.DATA[i].CONTATO, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('telefone_visita___' + seq, visita.DATA[i].TELEFONE, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('solicitante_visita___' + seq, 'Administrador Fluig', 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('lat_visita___' + seq, visita.DATA[i].LATITUDE, 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('long_visita___' + seq, visita.DATA[i].LONGITUDE, 'field', ConstraintType.MUST));

                            listaCampos.push(DatasetFactory.createConstraint('documentId', visita.DATA[i].DOCUMENCTID, visita.DATA[i].DOCUMENCTID, ConstraintType.MUST));
                            DatasetFactory.getDataset('processo_movimento', null, listaCampos, null);
                            // newDataset.addRow(new Array("Executando Visitas"));

                        } catch (error) {
                            pDataset.addRow(new Array("Erro ao processar: " + error));
                        }

                    }

                    try {
                        var arrVisitas = [];
                        var dados = {
                            INDACAO: "V",
                            ID: visita.DATA[i].CODVISITA
                        }
                        arrVisitas.push(dados);
                        var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrVisitas);
                    } catch (error) {
                        continue;
                    }

                }
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getLeads(wToken, pDataset) {

    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=P";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");
        // var wRet = null;
        if (wRet != null) {
            var parceiros = wRet[0];
            // pDataset.addRow(new Array("STATUS: " + parceiros.STATUS));
            if (parceiros.STATUS == 'OK') {
                var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');
                for (var x = 0; x < parceiros.DATA.length; x++) {

                    if (parceiros.DATA[x].IDFLUIG != null) {

                        var SQL = "";
                        SQL = " update " + tParceiro + " set ";
                        SQL += "  lat_parceiro =  '" + parceiros.DATA[x].LATITUDE + "', ";
                        SQL += "  long_parceiro =  '" + parceiros.DATA[x].LONGITUDE + "' ";
                        SQL += " where documentid =  " + parceiros.DATA[x].DOCUMENCTID;
                        SQL += " and id =  " + parceiros.DATA[x].IDFLUIG;
                        statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();
                    }

                    if (parceiros.DATA[x].IDFLUIG == null) {

                        var listaCampos = new Array();
                        var seq = 0;

                        var SQL = " select ";
                        SQL += "    sc.* ";
                        SQL += "FROM " + tParceiros + "  sc  ";
                        SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
                        SQL += "        and dc.nr_documento = sc.documentid      ";
                        SQL += "        and dc.nr_versao = sc.version ";
                        SQL += "        and dc.versao_ativa = 1) ";
                        SQL += "where 1=1 ";
                        SQL += "  and sc.documentid = " + parceiros.DATA[x].DOCUMENCTID;
                        SQL += "  and sc.local_parceiro = '" + parceiros.DATA[x].LOCAL.replace(/'/g, ' ') + "'";


                        statementWD = connectionWD.prepareStatement(SQL);
                        var rsWDParceiros = statementWD.executeQuery();

                        while (rsWDParceiros.next()) {
                            seq = seq + 1;

                            listaCampos.push(DatasetFactory.createConstraint('cidade_parceiro___' + seq, rsWDParceiros.getString("cidade_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('cod_cidade_parceiro___' + seq, rsWDParceiros.getString("cod_cidade_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('uf_parceiro___' + seq, rsWDParceiros.getString("uf_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('cod_uf_parceiro___' + seq, rsWDParceiros.getString("cod_uf_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('cod_pais_parceiro___' + seq, rsWDParceiros.getString("cod_pais_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('nome_parceiro___' + seq, rsWDParceiros.getString("nome_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('local_parceiro___' + seq, rsWDParceiros.getString("local_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('data_parceiro___' + seq, rsWDParceiros.getString("data_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('contato_parceiro___' + seq, rsWDParceiros.getString("contato_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('telefone_parceiro___' + seq, rsWDParceiros.getString("telefone_parceiro"), 'field', ConstraintType.MUST))
                            listaCampos.push(DatasetFactory.createConstraint('cidade_uf_parceiro___' + seq, rsWDParceiros.getString("cidade_uf_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('lat_parceiro___' + seq, rsWDParceiros.getString("lat_parceiro"), 'field', ConstraintType.MUST));
                            listaCampos.push(DatasetFactory.createConstraint('long_parceiro___' + seq, rsWDParceiros.getString("long_parceiro"), 'field', ConstraintType.MUST));
                        }

                        if (rsWDParceiros != null) rsWDParceiros.close();

                        seq = seq + 1;
                        listaCampos.push(DatasetFactory.createConstraint('cidade_parceiro___' + seq, parceiros.DATA[x].CIDADE, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('cod_cidade_parceiro___' + seq, parceiros.DATA[x].IDCIDADE, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('uf_parceiro___' + seq, parceiros.DATA[x].UF, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('cod_uf_parceiro___' + seq, parceiros.DATA[x].CODUF, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('cod_pais_parceiro___' + seq, parceiros.DATA[x].CODPAIS, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('nome_parceiro___' + seq, parceiros.DATA[x].EMPRESA.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('local_parceiro___' + seq, parceiros.DATA[x].LOCAL.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('data_parceiro___' + seq, parceiros.DATA[x].DATA, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('contato_parceiro___' + seq, parceiros.DATA[x].CONTATO.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('telefone_parceiro___' + seq, parceiros.DATA[x].TELEFONE, 'field', ConstraintType.MUST))
                        listaCampos.push(DatasetFactory.createConstraint('cidade_uf_parceiro___' + seq, parceiros.DATA[x].CIDADE + '/' + parceiros.DATA[x].UF, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('lat_parceiro___' + seq, parceiros.DATA[x].LATITUDE, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('long_parceiro___' + seq, parceiros.DATA[x].LONGITUDE, 'field', ConstraintType.MUST));

                        listaCampos.push(DatasetFactory.createConstraint('documentId', parceiros.DATA[x].DOCUMENCTID, parceiros.DATA[x].DOCUMENCTID, ConstraintType.MUST));
                        DatasetFactory.getDataset('processo_movimento', null, listaCampos, null);

                    }

                    pDataset.addRow(new Array("Criando Card: " + JSON.stringify(parceiros.DATA[x])));
                    var idCard = f_incluirCRM(parceiros.DATA[x], pDataset);
                    // pDataset.addRow(new Array("Card: " + idCard));
                    var arrParceiros = [];
                    var dados = {
                        INDACAO: "P",
                        ID: parceiros.DATA[x].ID,
                        IDCARD: idCard
                    }
                    arrParceiros.push(dados);
                    var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrParceiros);
                }
            }
        }

    } catch (error) {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getCondominios(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=CD";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");
        // pDataset.addRow(new Array("Dados Cond.: " + gson.toJson(wRet)));
        // var wRet = null;
        if (wRet != null) {
            var condominios = wRet[0];
            if (condominios.STATUS == 'OK') {
                var arrCondominio = [];
                for (var i = 0; i < condominios.DATA.length; i++) {
                    // if (condominios.DATA[i].ID != 873) {
                    //     continue;
                    // }

                    var wSQL = "insert into kbt_t_condominios_app (id, id_app, nom_condominio, unidades, concluidas, construcao, cod_cidade, uf, cidade, cod_ibge, latitude, longitude) values ";
                    wSQL += "((select COALESCE(max(id) + 1,1) from kbt_t_condominios_app)," + condominios.DATA[i].ID + ",'" + f_removeCaracteres(condominios.DATA[i].NOMCONDOMINIO) + "'," + condominios.DATA[i].UNIDADES + ",0,0,'" + condominios.DATA[i].CODCIDADE + "','" + condominios.DATA[i].UF + "',";
                    wSQL += "'" + f_removeCaracteres(condominios.DATA[i].CIDADE) + "'," + condominios.DATA[i].CODIBGE + ",'" + condominios.DATA[i].LATITUDE + "','" + condominios.DATA[i].LONGITUDE + "')";

                    try {
                        statementWD = connectionWD.prepareStatement(wSQL);
                        statementWD.executeUpdate();

                    } catch (error) {

                        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber + ' ID: ' + condominios.DATA[i].ID));
                        continue;
                    }

                    var dados = {
                        INDACAO: "CD",
                        ID: condominios.DATA[i].ID
                    }
                    arrCondominio.push(dados);
                    // var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrVisitas);
                }
                // pDataset.addRow(new Array("Retorno.: " + gson.toJson(arrCondominio)));
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getEventosLead(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=LEAD";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");
        if (wRet != null) {
            var eventos = wRet[0];
            if (eventos.STATUS == 'OK') {
                for (var x = 0; x < eventos.DATA.length; x++) {

                    // pDataset.addRow(new Array("Criando Card: " + JSON.stringify(eventos.DATA[x])));
                    var idCard = f_incluirCRM(eventos.DATA[x], newDataset);
                    // pDataset.addRow(new Array("Card: " + idCard + ' - Contato: ' + eventos.DATA[x].NOME));

                    var arrParceiros = [];
                    var dados = {
                        INDACAO: "L",
                        ID: eventos.DATA[x].ID,
                        IDCARD: idCard
                    }
                    arrParceiros.push(dados);
                    var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrParceiros);
                }
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }

}

function f_getEventosLeadNew(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=LEAD";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");
        if (wRet != null) {
            var eventos = wRet[0];
            if (eventos.STATUS == 'OK') {
                for (var x = 0; x < eventos.DATA.length; x++) {

                    var retDGT = f_incluirDGT(eventos.DATA[x], pDataset);
                    try {
                        if (retDGT.sucess == true || retDGT.sucess == false) {
                            if (retDGT.id_registro != undefined && retDGT.id_registro != null && retDGT.id_registro != 0) {
                                var arrParceiros = [];
                                var dados = {
                                    INDACAO: "L",
                                    ID: eventos.DATA[x].ID,
                                    IDCARD: retDGT.id_registro
                                }
                                arrParceiros.push(dados);
                                // newDataset.addRow(new Array("Atuializar: " + gson.toJson(dados)));
                                var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrParceiros);
                            }
                        }
                    } catch (error) {

                    }
                }
            }
            pDataset.addRow(new Array("Dados de Leds Eventos carregados..."));
        }
    } catch (error) {
        pDataset.addRow(new Array(" linha: " + error.lineNumber + ' ' + error.toString()));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }

}


function f_getPernoite(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var endpoint = "/retornoFluig?indretorno=HT";
        var wRet = f_atualizarRegistro(endpoint, wToken, "");

        if (wRet != null) {
            var Pernoite = wRet;
            if (Pernoite.status == true) {
                var arrPernoite = [];
                for (var i = 0; i < Pernoite.data.length; i++) {
                    // if (condominios.DATA[i].ID != 873) {
                    //     continue;
                    // }

                    for (var x = 0; x < Pernoite.data[i].pernoite.length; x++) {
                        var wSQL = "insert into kbt_t_app_pernoite (rota, documentid, cpf, dataregistro, horaregistro, pernoite, latitude, longitude) values ";
                        wSQL += "(" + Pernoite.data[i].rota + "," + Pernoite.data[i].documentid + ",'" + Pernoite.data[i].cpf + "','" + Pernoite.data[i].pernoite[x].data + "','" + Pernoite.data[i].pernoite[x].hora + "','" + Pernoite.data[i].pernoite[x].pernoite + "',";
                        wSQL += "'" + Pernoite.data[i].pernoite[x].latitude + "','" + Pernoite.data[i].pernoite[x].longitude + "')";

                        try {
                            statementWD = connectionWD.prepareStatement(wSQL);
                            statementWD.executeUpdate();

                        } catch (error) {
                            continue;
                        }
                    }
                }
            }
        }

        pDataset.addRow(new Array("Dados de PerNoite carregados..."));
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_incluirDGT(reg, newDataset) {
    try {
        var retorno = null;
        var metodo = "POST";
        var wServiceCode = "DGT";
        var gson = new com.google.gson.Gson();
        var gTokenDGT = 'g3xzXv3s3ps6ez4awqabHRP8t4AKYwEiM32yHY6JDG3HPsDwHYwYvaEA3QJM';


        // newDataset.addRow(new Array("INDORIGEM: " + reg.INDORIGEM));
        var wIdOrigem = 85;
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('metadata#id', reg.DOCUMENCTID, reg.DOCUMENCTID, ConstraintType.MUST));
        var datasetOrig = DatasetFactory.getDataset("ds_cadastro_eventos", null, constraints, null);
        // var dataset = null;
        if (datasetOrig != null && datasetOrig.rowsCount > 0) {
            for (i = 0; i < datasetOrig.rowsCount; i++) {
                wIdOrigem = datasetOrig.getValue(i, "origem")
            }
        }


        var wData = new Date();

        var params = {
            origem_id: wIdOrigem,
            nome: reg.NOME,
            profissao: reg.PROFISSAO,
            telefone: reg.TELEFONE,
            email: reg.EMAIL,
            empresa: "",
            ibge_code: reg.IBGE,
            data_coleta: dataAtualFormatada().split('-').reverse().join('/'),
            obs: reg.OBSERVACAO
        }

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: 'leads/cadastrar',
            timeoutService: "240",
            method: metodo,
        };

        var headers = {};
        headers["authorization"] = gTokenDGT;
        // headers["x-access-token"] = 'TOKENDETESTE';
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        data["params"] = params;

        var jj = gson.toJson(data);
        printLog("error", "JSON DGT: " + gson.toJson(data));
        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        }


    } catch (error) {
        newDataset.addRow(new Array("Erro DGT: " + error));
    } finally {
        return retorno;
    }
}


function f_incluirCRM(reg, newDataset) {

    var id_user_pipedrive = null;
    id_user_pipedrive = reg.IDPIPE;
    var nomeMotorista = "";
    var retorno = null;


    if (reg.IDPIPE == null) {
        try {
            id_user_pipedrive = getUserSetor(reg.INDCRM, reg.IDFUNIL, reg.IDSETORFUNIL, newDataset);
        } catch (error) {
            id_user_pipedrive = null;
        }
    }

    if (id_user_pipedrive != null) {
        var obj;

        var connectionCRM = null;
        var statementCRM = null;
        var contextCRM = new javax.naming.InitialContext();
        var dataSourceCRM = contextCRM.lookup("java:/jdbc/CRMDS");
        connectionCRM = dataSourceCRM.getConnection();

        var sql = "select nome_razao from online.pon_pessoa where cnpj_cpf = '" + reg.CPFMOTORISTA + "'";
        statementCRM = connectionCRM.prepareStatement(sql);
        var rsCRM = statementCRM.executeQuery();

        while (rsCRM.next()) {
            nomeMotorista = rsCRM.getString("nome_razao");
        }

        if (rsCRM != null) rsCRM.close();
        if (statementCRM != null) statementCRM.close();
        if (connectionCRM != null) connectionCRM.close();

        var observacao = "Observação: " + reg.OBSERVACAO + "\n";
        observacao += "Profissão: " + reg.PROFISSAO + " \n ";
        observacao += "Cadastro realizado via App da Kobit."

        if (reg.INDCRM == '1') {
            observacao += "Motorista: " + reg.MOTORISTA + " \n ";
            var gson = new com.google.gson.Gson();
            obj = {
                area: "PM", // Fixo
                only_phone: "S",
                setor_destino: "10", //Funil
                fisico_juridico: "F", // Se Juridico enviar nome no "nome" e nome contato no "pessoa_contato" Se Fisico enviar nome no "nome" telefone1 no "telefone"
                id_person: "",
                id_org: "",
                nome: reg.CONTATO.replace(/'/g, ' '),
                telefone1: reg.TELEFONE,
                pessoa_contato: "",
                telefone_pessoa: "",
                cod_origem: "85",
                id_origem_pipedrive: "361",
                processo: null,
                showroom: "",
                cidade: reg.CIDADE + " / " + reg.UF,
                motorista: reg.MOTORISTA + ""
            }

            var datajson = gson.toJson(obj);
            printLog("info", "JSON: marcio" + datajson);
            // newDataset.addRow(new Array(datajson));

            try {
                var ct = new Array();
                ct.push(DatasetFactory.createConstraint('ACTION', 'GEN_DEAL_VENDEDOR', null, ConstraintType.MUST));
                ct.push(DatasetFactory.createConstraint('USERPIPEDRIVE', id_user_pipedrive, null, ConstraintType.MUST));
                ct.push(DatasetFactory.createConstraint('TITULO', reg.CONTATO.replace(/'/g, ' '), null, ConstraintType.MUST));
                ct.push(DatasetFactory.createConstraint('OBS', observacao, null, ConstraintType.MUST));
                ct.push(DatasetFactory.createConstraint('JSON', JSON.stringify(obj), null, ConstraintType.MUST));
                var ds = DatasetFactory.getDataset('DS_SolicitacaoParceiros', null, ct, null);
                // newDataset.addRow(new Array("Registros: " + ds.rowsCount));
                if ((ds != null)) {
                    for (var i = 0; i < ds.rowsCount; i++) {
                        retorno = ds.getValue(i, "id_deals_vendedor");
                    }
                }
            } catch (error) {
                newDataset.addRow(new Array(error.toString()));
                return newDataset;
            }
        }

        if (reg.INDCRM == '2') {
            var gson = new com.google.gson.Gson();
            var wNome = "";
            var wTipoObra = 'N';
            var wEtiqueta = '';
            var wIdOrigem = "85"
            if ((reg.CONTATO != undefined) && (reg.CONTATO != '')) {
                wNome = reg.CONTATO.replace(/'/g, ' ');
            }

            if ((reg.NOME != undefined) && (reg.CONTNOMEATO != '')) {
                wNome = reg.NOME.replace(/'/g, ' ');
            }

            if ((reg.TAG != undefined) && (reg.TAG != '')) {
                wEtiqueta = reg.TAG
            }

            if (reg.INDORIGEM == 'EV') {
                // newDataset.addRow(new Array("INDORIGEM: " + reg.INDORIGEM));

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('metadata#id', reg.DOCUMENCTID, reg.DOCUMENCTID, ConstraintType.MUST));
                var datasetOrig = DatasetFactory.getDataset("ds_cadastro_eventos", null, constraints, null);
                // var dataset = null;
                if (datasetOrig != null && datasetOrig.rowsCount > 0) {
                    for (i = 0; i < datasetOrig.rowsCount; i++) {
                        wIdOrigem = datasetOrig.getValue(i, "origem")
                    }
                }
            }

            obj = {
                area: reg.FUNIL,
                idPessoa: '',
                datFechamento: '',
                id_crm: id_user_pipedrive,
                id_origem: wIdOrigem + "",
                nome: wNome.replace(/(\r\n|\n|\r)/gm, ""),
                telefone: "+55 " + reg.TELEFONE,
                cidade_uf: parseInt(reg.IBGE),
                pormademovel: "S",
                motorista: reg.MOTORISTA,
                especificador: reg.ESPECIFICADOR,
                vendedor: reg.VENDEDOR,
                usuario_captura: reg.CAPTURA,
                observacao: observacao,
                tipo_obra: wTipoObra,
                etiqueta: wEtiqueta
            }

            var datajson = gson.toJson(obj);
            printLog("info", "JSON CRM: " + datajson);
            // newDataset.addRow(new Array("JSON CRM: " + datajson));

            var ct = new Array();
            ct.push(DatasetFactory.createConstraint('indacao', 'ADDCARD2', null, ConstraintType.MUST));
            ct.push(DatasetFactory.createConstraint('json', gson.toJson(obj), null, ConstraintType.MUST));
            var ds = DatasetFactory.getDataset('dsk_crm', null, ct, null);
            // newDataset.addRow(new Array("Registros: " + ds.rowsCount));
            if ((ds != null)) {
                for (var i = 0; i < ds.rowsCount; i++) {
                    if (ds.getValue(i, "status") == true) {
                        var objRetorno = JSON.parse(ds.getValue(i, "mensagem"));

                        // newDataset.addRow(new Array("Enviou para CRM!  mensagem: " + ds.getValue(i, "mensagem")));
                        // newDataset.addRow(new Array("Enviou para CRM!  mensagem: "));
                        // newDataset.addRow(new Array("ID do Card: " + objRetorno["funil_" + reg.IDFUNIL].data.id));

                        var ct = new Array();
                        ct.push(DatasetFactory.createConstraint('indacao', 'ADDNOTE', null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('id_crm', objRetorno["funil_" + reg.IDFUNIL].data.user_id, null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('id_deal', objRetorno["funil_" + reg.IDFUNIL].data.id, null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('observacao', observacao, null, ConstraintType.MUST));
                        var dsN = DatasetFactory.getDataset('dsk_crm', null, ct, null);

                        retorno = objRetorno["funil_" + reg.IDFUNIL].data.id;
                    } else {
                        newDataset.addRow(new Array("Erro ao enviar: " + ds.getValue(i, "mensagem")));
                    }
                }
            }
        }
    }
    return retorno;
}

function getUserSetor(indCRM, cod_funil, cod_setor_funil, newDataset) {
    // var newDataset = dataSet;
    var id_pipedrive;
    var retorno;
    // newDataset.addRow(new Array("Pesquisando Usuario no Funil: " + cod_funil + " No CRM: " + indCRM));
    if (indCRM == '1') {

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
            // newDataset.addRow(new Array("DataSet Lenth: " + dsUser.values.length));
            if (dsUser.values.length > 0) {
                var row = Math.floor(Math.random() * dsUser.values.length);

                // newDataset.addRow(new Array("DataSet Email: " + dsUser.getValue(row, "email")));

                var ct = new Array();
                ct.push(DatasetFactory.createConstraint('area', 'PM', null, ConstraintType.MUST));
                ct.push(DatasetFactory.createConstraint('email', dsUser.getValue(row, "email"), null, ConstraintType.MUST));
                var pipedriveUser = DatasetFactory.getDataset("pipedriveUser", null, ct, null);

                if (pipedriveUser != null && pipedriveUser != "") {

                    if (pipedriveUser.values.length > 0) {
                        retorno = pipedriveUser.getValue(0, "id");
                    } else {
                        retorno = false;
                    }
                }
            }
        }
    }

    if (indCRM == '2') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('id_funil', cod_funil, cod_funil, ConstraintType.MUST));
        if ((cod_setor_funil != null) && (cod_setor_funil != '')) {
            constraints.push(DatasetFactory.createConstraint('id_setor_funil', cod_setor_funil, cod_setor_funil, ConstraintType.MUST));
        }
        var dataset = DatasetFactory.getDataset("crmUSER", null, constraints, null);
        // newDataset.addRow(new Array("DataSet Lenth: " + dataset.values.length));
        if (dataset != null && dataset != "") {
            if (dataset.rowsCount > 0) {
                var row = Math.floor(Math.random() * dataset.rowsCount);
                retorno = dataset.getValue(row, "id");
            }
        }
    }

    return retorno;
}


function f_getPipe(wToken, pDataset) {
    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var tReservas = getTable('ds_ReservasSalas', '');
        var tCidades = getTable('ds_ReservasSalas', 'tabela_cidades');
        var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');
        var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');

        // printLog("info", "End Point Agenda: ");
        // pDataset.addRow(new Array("Tabela Reserva: " + tReservas));

        // return false;

        var dataHoje = dataAtualFormatada();
        // var dataHoje = dataAtualFormatada(24, '-');
        var dataDias = dataAtualFormatada(5, '-');

        var endpoint = '/02/pipe?datainicio=' + dataDias + '&datafim=' + dataHoje;
        // pDataset.addRow(new Array("End Point " + endpoint.replace(/'/g, '')));
        var leads = f_atualizarRegistro(endpoint.replace(/'/g, ''), wToken, "", "arquitetos");
        if (leads != null) {
            if (leads.STATUS == true) {
                for (var x = 0; x < leads.RECORDS; x++) {

                    // if (leads.DATA[x].CODVISITA != '188616') {
                    //     continue;
                    // }
                    // pDataset.addRow(new Array("Motorista: " + leads.DATA[x].MOTORISTA + ' Contato: ' + leads.DATA[x].CONTATO));
                    try {
                        var wHora = null;
                        var wAchou = false;
                        var sql = '';
                        if (leads.DATA[x].HORA != null) {
                            wHora = "'" + leads.DATA[x].HORA + "'";
                        }


                        if (leads.DATA[x].ORIGEM == 'PM') {
                            sql = "select * from kbt_t_registroapp where origen = 'PM' and codvisita = " + leads.DATA[x].CODVISITA;

                            var wSQL = "insert into kbt_t_registroapp (sequencia, ID, ORIGEN, NUMPLACA, CPFMOTORISTA, MOTORISTA, CPFAJUDANTE, AJUDANTE, INDCAPTURA, DOCUMENCTID, CODVISITA, TIPOLOCAL, LOCAL, EMPRESA, CONTATO, DATA, HORA, TELEFONE, UF, CODUF, CIDADE, IDCIDADE, ";
                            wSQL += "CODPAIS, PROFISSAO, IDPIPE, IDFUNIL, FUNIL, IDGESTOR, MOTIVORECUSA, OBSERVACAO, CODTIPOVISITA, TIPOVISITA, LATITUDE, LONGITUDE) values ";
                            wSQL += "((select COALESCE(max(sequencia) + 1,1) from kbt_t_registroapp)," + leads.DATA[x].ID + ",'" + leads.DATA[x].ORIGEM + "','" + leads.DATA[x].NUMPLACA + "','" + leads.DATA[x].CPFMOTORISTA + "','" + f_removeCaracteres(leads.DATA[x].MOTORISTA) + "','" + leads.DATA[x].CPFAJUDANTE + "','" + f_removeCaracteres(leads.DATA[x].AJUDANTE) + "','" + leads.DATA[x].INDCAPTURA + "',";
                            wSQL += + leads.DATA[x].DOCUMENCTID + "," + leads.DATA[x].CODVISITA + ",'" + leads.DATA[x].TIPOLOCAL + "','" + f_removeCaracteres(leads.DATA[x].LOCAL) + "','" + f_removeCaracteres(leads.DATA[x].EMPRESA) + "','" + f_removeCaracteres(leads.DATA[x].CONTATO) + "','" + leads.DATA[x].DATA.split('/').reverse().join('-') + "'," + wHora + ",";
                            wSQL += "'" + leads.DATA[x].TELEFONE + "','" + leads.DATA[x].UF + "'," + leads.DATA[x].CODUF + ",'" + leads.DATA[x].CIDADE + "'," + leads.DATA[x].IDCIDADE + "," + leads.DATA[x].CODPAIS + ",'" + leads.DATA[x].PROFISSAO + "'," + leads.DATA[x].IDPIPE + ",";
                            wSQL += + leads.DATA[x].IDFUNIL + ",'" + leads.DATA[x].FUNIL + "'," + leads.DATA[x].IDGESTOR + ",'" + leads.DATA[x].MOTIVORECUSA + "','" + f_removeCaracteres(leads.DATA[x].OBSERVACAO) + "'," + leads.DATA[x].CODTIPOVISITA + ",'" + leads.DATA[x].TIPOVISITA + "','" + leads.DATA[x].LATITUDE + "','" + leads.DATA[x].LONGITUDE + "')";

                        }

                        if (leads.DATA[x].ORIGEM == 'EV') {
                            sql = "select * from kbt_t_registroapp where origen = 'EV' and codvisita = " + leads.DATA[x].CODEVENTO;


                            var wSQL = "insert into kbt_t_registroapp (sequencia, ID, ORIGEN, CPFMOTORISTA, MOTORISTA, DOCUMENCTID, CODVISITA, EMPRESA, CONTATO, DATA, HORA, TELEFONE, UF, CIDADE, ";
                            wSQL += "CODPAIS, PROFISSAO, IDPIPE, IDFUNIL, FUNIL, IDGESTOR, OBSERVACAO, LATITUDE, LONGITUDE) values ";
                            wSQL += "((select COALESCE(max(sequencia) + 1,1) from kbt_t_registroapp)," + leads.DATA[x].ID + ",'" + leads.DATA[x].ORIGEM + "','" + leads.DATA[x].CPFMOTORISTA + "','" + leads.DATA[x].MOTORISTA + "',";
                            wSQL += leads.DATA[x].DOCUMENCTID + "," + leads.DATA[x].CODEVENTO + ",'" + leads.DATA[x].EVENTO + "','" + leads.DATA[x].CONTATO + "','" + leads.DATA[x].DATA.split('/').reverse().join('-') + "'," + wHora + ",";
                            wSQL += "'" + leads.DATA[x].TELEFONE + "','" + leads.DATA[x].UF + "','" + leads.DATA[x].CIDADE + "'," + leads.DATA[x].CODPAIS + ",'" + leads.DATA[x].PROFISSAO + "'," + leads.DATA[x].IDPIPE + ",";
                            wSQL += leads.DATA[x].IDFUNIL + ",'" + leads.DATA[x].FUNIL + "'," + leads.DATA[x].IDGESTOR + ",'" + f_removeCaracteres(leads.DATA[x].OBSERVACAO) + "','" + leads.DATA[x].LATITUDE + "','" + leads.DATA[x].LONGITUDE + "')";

                        }

                        if (leads.DATA[x].ID == null) {
                            sql += " and id is null ";
                        } else {
                            sql += " and id = " + leads.DATA[x].ID;


                        }

                        statementWD = connectionWD.prepareStatement(sql);
                        var rsWD = statementWD.executeQuery();
                        while (rsWD.next()) {
                            wAchou = true;
                            break;
                        }

                        // pDataset.addRow(new Array('Flag: ' + wAchou));
                        if (wAchou == false) {
                            printLog("erro", "SQL PIPE: " + wSQL);

                            // pDataset.addRow(new Array('Achou'));
                            statementWD = connectionWD.prepareStatement(wSQL);
                            statementWD.executeUpdate();
                        }

                    } catch (error) {
                        pDataset.addRow(new Array("Motorista: " + leads.DATA[x].CPFMOTORISTA + ' Visita: ' + leads.DATA[x].CODVISITA + ' ID: ' + leads.DATA[x].ID + ' Contato: ' + leads.DATA[x].CONTATO + " - IG Gestor: " + leads.DATA[x].IDGESTOR));
                        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber + ' ID: ' + leads.DATA[x].ID));

                    }

                }
            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function dataAtualFormatada(dias, acao) {
    var data = new Date();
    if (dias != undefined && dias > 0) {
        if (acao == "+") { data.setDate(data.getDate() + dias); }
        if (acao == "-") { data.setDate(data.getDate() - dias); }
    }

    var dia = data.getDate().toString()
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF;
}

function f_removeCaracteres(str) {
    var novastr = null;

    if (str != '' && str != null) {
        var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ?Þßàáâãäåæçèéêëìíîïðñòóô?öøùúûüýþÿ?";
        var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        novastr = '';
        for (i = 0; i < str.length; i++) {
            var troca = false;
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
        novastr = novastr.replace(/'/g, '');
    }

    return novastr;
}