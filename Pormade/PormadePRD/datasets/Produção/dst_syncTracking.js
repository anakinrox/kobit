function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## Sync Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    var wToken = '';
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
                // Pegar o Token da conexão e para as consultas
                wToken = jr.TOKEN;
                // newDataset.addRow(new Array('Token: ' + wToken));


                f_postLocais(wToken, newDataset);
                f_postVenderores(wToken, newDataset);
                f_postUsuarios(wToken, newDataset);

                f_postAgenda(wToken, newDataset);
                f_postEventos(wToken, newDataset);

                f_postInstaladores(wToken, newDataset);
                f_postInstalacoes(wToken, newDataset);

                f_getInstalacoes(wToken, newDataset);

                f_getVisitas(wToken, newDataset);
                f_getLeads(wToken, newDataset);
                f_getEventosLead(wToken, newDataset);
                f_getPipe(wToken, newDataset);

            }
        }

    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));

    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Sync Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    var wToken = '';
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
                // Pegar o Token da conexão e para as consultas
                wToken = jr.TOKEN;
                newDataset.addRow(new Array('Token: ' + wToken));


                // f_postLocais(wToken, newDataset);
                // f_postVenderores(wToken, newDataset);
                // f_postUsuarios(wToken, newDataset);

                // f_postAgenda(wToken, newDataset);
                // f_postEventos(wToken, newDataset);

                f_postInstaladores(wToken, newDataset);
                f_postInstalacoes(wToken, newDataset);

                f_getInstalacoes(wToken, newDataset);

                // f_getVisitas(wToken, newDataset);
                // f_getLeads(wToken, newDataset);
                // f_getEventosLead(wToken, newDataset);
                // f_getPipe(wToken, newDataset);

            }
        }

    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));

    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

}

function f_postCidades(wToken, pDataset) {
    // ################### Envia os Cidades #########################
    var params;
    var endpoint = "/cidades";
    printLog("info", "End Point cidades: ");
    // newDataset.addRow(new Array("End Point cidades: "));
    var ArrCidades = [];


    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
    connectionWD = dataSourceWD.getConnection();

    // var SQL = " select cod_erp,id,cidade,cod_uf,uf,nome,cod_pais,pais, cod_cidade_ibge ";
    // SQL += "FROM fluig_v_cidade WHERE cod_erp is not null";

    // statementWD = connectionWD.prepareStatement(SQL);
    // var rsWD = statementWD.executeQuery();
    // while (rsWD.next()) {
    //     var dados = {
    //         CODIGO: rsWD.getString("cod_erp") + "",
    //         ID: rsWD.getString("id") + "",
    //         COD_UF: rsWD.getString("cod_uf") + "",
    //         UF: rsWD.getString("uf") + "",
    //         CIDADE: rsWD.getString("cidade") + "",
    //         NOME: rsWD.getString("nome") + "",
    //         COD_PAIS: rsWD.getString("cod_pais") + "",
    //         PAIS: rsWD.getString("pais") + "",
    //         IBGE: rsWD.getString("cod_cidade_ibge") + "",
    //     }
    //     ArrCidades.push(dados);

    // }
    // newDataset.addRow(new Array("Cidades: " + JSON.stringify(ArrCidades)));
    // printLog("info", "Cidades: " + JSON.stringify(ArrCidades));

    // var ArrCidades = [];
    // var params = {
    //     json: JSON.stringify(ArrCidades)
    // };

    // var data = {
    //     companyId: getValue("WKCompany") + "",
    //     serviceCode: "tracking",
    //     endpoint: endpoint,
    //     timeoutService: "240",
    //     method: "POST",
    // };

    // // var params;
    // var headers = {};
    // headers["x-access-token"] = wToken;
    // headers["Content-Type"] = "application/json";
    // data["headers"] = headers;
    // data["params"] = params;

    // var jj = JSON.stringify(data);
    // var vo = clientService.invoke(jj);
    // if (vo.getResult() == "" || vo.getResult().isEmpty()) {
    //     throw "Retorno esta vazio";
    // } else {
    //     var jr = JSON.parse(vo.getResult());

    //     if (jr.STATUS == 'OK') {
    //         printLog("info", "Achou BEBE");
    //         newDataset.addRow(new Array("Cidaddes Enviados"));
    //     } else {
    //         printLog("info", "Não deu");
    //         newDataset.addRow(new Array("Erro ao cadastrar Cidaddes"));
    //     }
    // }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

    // newDataset.addRow(new Array("OK"));
    // ################### Envia os Cidades #########################  


}

function f_postLocais(wToken, pDataset) {
    // ################### Envia os Locais #########################
    var params;
    var endpoint = "/tipoLocal";
    printLog("info", "End Point tipoLocal: ");

    var tpLocais = {};
    var tpLocais = [];

    var constraints = new Array();
    var dataset = DatasetFactory.getDataset("dsTipoLocal", null, constraints, null);
    if (dataset != null && dataset.rowsCount > 0) {
        for (i = 0; i < dataset.rowsCount; i++) {
            var dados = {
                codigo: parseInt(dataset.getValue(i, "codigo")),
                descricao: dataset.getValue(i, "descricao") + ""
            }
            tpLocais.push(dados);
        }

        if (tpLocais != '') {
            var locais = f_atualizarRegistro(endpoint, wToken, tpLocais)
            if (locais != null) {
                if (locais.STATUS == 'OK') {
                    pDataset.addRow(new Array("Locais Enviados"));
                } else {
                    pDataset.addRow(new Array("Erro ao cadastrar Locais"));
                }
            }
        }
    }
    // ################### Envia os Locais #########################
}


function f_postVenderores(wToken, pDataset) {
    // ################### Envia os Vendedores #########################

    printLog("info", "End Point Vendedores: ");
    var tVendedores = [];

    var connectionCRM = null;
    var statementCRM = null;
    var contextCRM = new javax.naming.InitialContext();
    var dataSourceCRM = contextCRM.lookup("java:/jdbc/CRMDS");
    connectionCRM = dataSourceCRM.getConnection();

    var sql = "SELECT ";
    sql += "    distinct ";
    sql += "    'CRM' as SISTEMA, ";
    sql += "    us.usr_codigo,  ";
    sql += "    upper(us.usr_nome) as usr_nome,  ";
    sql += "    us.usr_email,  ";
    sql += "    pv.id_pessoa, ";
    sql += "    pv.id as idVendedor, ";
    sql += "    pv.codigo_crm ";
    sql += "FROM (((((online.pon_cargos car  ";
    sql += "    JOIN online.pon_cargos_funcionario cf ON ((cf.id_cargo = car.id)))  ";
    sql += "    JOIN fr_usuario us ON ((us.usr_codigo = cf.usr_codigo)))  ";
    sql += "    join fr_usuario_sistema us_a on (us_a.usr_codigo = us.usr_codigo) ";
    sql += "                                and (us_a.sis_codigo in ('NMB') and us_a.uss_acessar = 'S') ";
    sql += "    JOIN online.pon_pessoa_vendedor pv ON (((cf.id_pessoa = pv.id_pessoa) AND (pv.ativo = true))))  ";
    sql += "    JOIN online.pon_lojas pl ON ((pv.id_loja = pl.id)))  ";
    sql += "    LEFT JOIN kbt_t_dealsuser up ON (((up.email)::text = (us.usr_email)::text)))  ";
    sql += "union ";
    sql += "SELECT ";
    sql += "    distinct ";
    sql += "    'SIS' as SISTEMA, ";
    sql += "    ven.id as idVendedor, ";
    sql += "    upper(ven.nome_razao) as usr_nome, ";
    sql += "    '' as usr_email, ";
    sql += "    vend.id as id´pessoa, ";
    sql += "    vend.id as idVendedor, ";
    sql += "    pv.codigo_crm ";
    sql += "FROM   online.pon_pessoa_vendedor AS vend ";
    sql += "    INNER JOIN online.pon_pessoa AS ven ON ven.id = vend.id_pessoa ";
    sql += "                                    and ven.ativo = true ";
    sql += "    INNER JOIN online.pon_grupo_pessoa AS gru ON gru.id = vend.id_grupo ";
    sql += "    INNER JOIN online.pon_pessoa_vendedor pv ON pv.id_pessoa = vend.id_pessoa ";
    sql += "WHERE  gru.id_pessoa_tipo = 6 ";
    sql += "and gru.id in (33,47) ";
    sql += "and pv.codigo_crm is not null ";
    sql += "order by ";
    sql += "3";

    statementCRM = connectionCRM.prepareStatement(sql);
    var rsCRM = statementCRM.executeQuery();

    while (rsCRM.next()) {
        var dados = {
            CODPROFISSAO: 48,
            INDSIS: rsCRM.getString("SISTEMA") + "",
            IDCRM: rsCRM.getString("usr_codigo") + "",
            IDPIPEDRIVE: rsCRM.getString("codigo_crm") + "",
            NOMVENDEDOR: rsCRM.getString("usr_nome") + ""
        }
        tVendedores.push(dados);
    }

    if (rsCRM != null) rsCRM.close();
    if (statementCRM != null) statementCRM.close();
    if (connectionCRM != null) connectionCRM.close();

    printLog("info", 'Token: ' + wToken)
    printLog("info", 'JSON Vendedores: ' + JSON.stringify(tVendedores))
    pDataset.addRow(new Array("Vendedores Enviados"));

    if (tVendedores != '') {
        var endpoint = "/vendedores";
        var vendedores = f_atualizarRegistro(endpoint, wToken, tVendedores)
        if (vendedores != null) {
            if (vendedores.STATUS == 'OK') {
                pDataset.addRow(new Array("Vendedores Enviados"));
            } else {
                pDataset.addRow(new Array("Erro ao cadastrar Vendedores"));
            }
        }
    }

    // newDataset.addRow(new Array("OK"));
    // ################### Envia os Vendedores #########################        
}

function f_postInstaladores(wToken, pDataset) {
    // ################### Envia os Instaladores #########################

    printLog("info", "End Point Usuarios: ");

    // var tpLocais = {};
    var uUsuarios = [];
    var wSenha = "";

    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
    connectionWD = dataSourceWD.getConnection();

    var SQL = "select pInstador.nome_razao, pInstador.cnpj_cpf, pEmail.email ";
    SQL += "from pon_pessoa_arquiteto pIns  ";
    SQL += "   inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
    SQL += "                            and(pInstador.ativo = true)   ";
    SQL += "   inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pIns.id_pessoa) ";
    SQL += "                            and(pEmail.principal = true)  ";
    SQL += "where pIns.id_classificacao = 5 ";

    statementWD = connectionWD.prepareStatement(SQL);
    rsWD = statementWD.executeQuery();

    while (rsWD.next()) {
        var wEmail = '';
        if (rsWD.getString('email') != null && rsWD.getString('email') != '') {
            wEmail = rsWD.getString('email').toLowerCase();
        }

        wSenha = rsWD.getString('cnpj_cpf').substring(0, 3) + '@' + rsWD.getString('nome_razao').substring(0, 3)

        var dados = {
            CODTIPO: "1",
            CRYPT: "S",
            NUMCPF: rsWD.getString('cnpj_cpf') + "",
            LOGIN: rsWD.getString('cnpj_cpf') + "",
            NOMUSUARIO: rsWD.getString('nome_razao') + "",
            EMAIL: wEmail + "",
            SENHA: wSenha.toLowerCase() + ""
        }
        uUsuarios.push(dados);
    }


    if (uUsuarios != '') {
        var endpoint = "/usuarios";
        var motorista = f_atualizarRegistro(endpoint, wToken, uUsuarios)
        if (motorista != null) {

            if (motorista.STATUS == 'OK') {
                pDataset.addRow(new Array("Instaladores Enviados"));
            } else {
                pDataset.addRow(new Array("Erro ao cadastrar Instaladores"));
            }
        }
    }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

    // newDataset.addRow(new Array("OK"));
    // ################### Envia os Usuarios #########################       
}

function f_postInstalacoes(wToken, pDataset) {

    // ################### Envia os Eventos #########################

    var arrInstaladores = [];
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var rsWD2 = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    printLog("info", "End Point Instalacaoes: ");
    pDataset.addRow(new Array("Enviando Instalacaoes:"));

    var sql = "select ";
    sql += "    kbt.id, ";
    sql += "    kbt.datregistro, ";
    sql += "    CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, ";
    sql += "    pr.id as idProposta, ";
    sql += "    p.nome_razao, ";
    sql += "    kbt.num_telefone, ";
    sql += "    CONCAT(pEnd.logradouro, ', ', pEnd.numero) as endereco, ";
    sql += "    pEnd.bairro, ";
    sql += "    pEnd.cep, ";
    sql += "    city.cidade, ";
    sql += "    city.uf, ";
    sql += "    pInstador.cnpj_cpf as instalador, ";
    sql += "    kbt.datagendaini  ";
    sql += "from kbt_t_instalacoes kbt  ";
    sql += "    inner join pon_proposta pr on(pr.id = kbt.idproposta)   ";
    sql += "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente)   ";
    sql += "    inner join pon_pessoa p on(p.id = pc.id_pessoa)    ";
    sql += "    inner join pon_pessoa_arquiteto pIns on(pIns.id = kbt.idinstalador)  ";
    sql += "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
    sql += "    inner join pon_pessoa_endereco pEnd on(pEnd.id_pessoa = pc.id_pessoa) ";
    sql += "    and(pEnd.principal = true) ";
    sql += "    inner join fluig_v_cidade city on(city.cod_cidade_ibge = pEnd.cod_cidade) ";
    sql += "where kbt.indsituacao = 'P'";
    sql += "  and kbt.ind_sync = 'S'";
    statementWD = connectionWD.prepareStatement(sql);
    var rsWD = statementWD.executeQuery();

    while (rsWD.next()) {
        var arrInstaladores = [];
        var arrInstaladoresItens = [];
        var SQL = "select pI.descricao, pi.local ";
        SQL += "from kbt_t_instalacoes_itens pI  ";
        SQL += "where pi.idproposta = " + rsWD.getString("idProposta");
        statementWD = connectionWD.prepareStatement(SQL);
        var rsWD2 = statementWD.executeQuery();
        while (rsWD2.next()) {

            var dados = {
                DESCRICAO: rsWD2.getString("descricao") + " - " + rsWD2.getString("local") + ""
            }
            arrInstaladoresItens.push(dados)
        }


        var dados = {
            DATREGISTRO: rsWD.getString("datregistro") + "",
            PROPOSTA: rsWD.getString("proposta") + "",
            IDPROPOSTA: rsWD.getString("idProposta") + "",
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
            SERVICOS: arrInstaladoresItens
        }
        arrInstaladores.push(dados);

        var endpoint = "/instalacao";
        pDataset.addRow(new Array("JSON:" + gson.toJson(arrInstaladores)));
        printLog("error", "JSON Instalacoes: " + gson.toJson(arrInstaladores));

        if (arrInstaladores.length > 0) {
            var instalacao = f_atualizarRegistro(endpoint, wToken, arrInstaladores)
            printLog("error", "Retorno instalacao: " + gson.toJson(arrInstaladores));

            if (instalacao != null) {
                if (instalacao.STATUS == 'OK') {
                    pDataset.addRow(new Array("instalacao Enviados"));

                    var SQLINS = "update kbt_t_instalacoes set ind_sync = null where id = " + rsWD.getString("id");
                    var statementWD = connectionWD.prepareStatement(SQLINS);
                    statementWD.executeUpdate();
                } else {
                    pDataset.addRow(new Array("Erro ao cadastrar instalacao"));
                }
            }
        }
    }


    if (rsWD2 != null) rsWD2.close();
    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();
    // ################### Envia os Eventos #########################
}

function f_getInstalacoes(wToken, pDataset) {
    try {

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        var sql = "select kbt.id, kbt.idproposta, CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, kbt.nom_responsavel, kbt.num_telefone ";
        sql += "from kbt_t_instalacoes kbt ";
        sql += "    inner join pon_proposta pr on(pr.id = kbt.idproposta)  ";
        sql += "where kbt.indsituacao = 'P' ";
        // sql += "  and kbt.ind_sync is null";

        pDataset.addRow(new Array("AQUI "));

        statementWD = connectionWD.prepareStatement(sql);
        var rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var endpoint = '/listainstalacao?proposta=' + rsWD.getString("proposta");

            var wObj = f_atualizarRegistro(endpoint.replace(/'/g, ''), wToken, "");
            pDataset.addRow(new Array("End Point " + gson.toJson(wObj)));
            if (wObj != null) {

                var wNumTelefone = '55' + justNumbers(rsWD.getString("num_telefone"));
                // pDataset.addRow(new Array("Telefone: " + wNumTelefone));
                for (var x = 0; x < wObj.length; x++) {
                    if (wObj[x].STATUS == 'OK') {
                        if (wObj[x].INDSITUACAO == 'F') {
                            var wToken = makeid(4);
                            var widInstalacao = rsWD.getString("idproposta")
                            var widInstalacao64 = java.util.Base64.getEncoder().encodeToString(widInstalacao.getBytes());

                            var SQLINS = "update kbt_t_instalacoes set indsituacao = 'V', token = '" + wToken + "' where id = " + rsWD.getString("id");
                            var statementWD = connectionWD.prepareStatement(SQLINS);
                            statementWD.executeUpdate();

                            // pDataset.addRow(new Array("SQL " + SQLINS));
                            var ct = new Array();
                            ct.push(DatasetFactory.createConstraint('endpoint', 'mensagem', null, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('codMensagem', '5', '5', ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('num_destinatario', wNumTelefone, wNumTelefone, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('link', 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + widInstalacao64, 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + widInstalacao64, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('token', wToken, wToken, ConstraintType.MUST));
                            ct.push(DatasetFactory.createConstraint('telefone', '0800-642-3521', '0800-642-3521', ConstraintType.MUST));
                            var ds = DatasetFactory.getDataset('dsk_fortics', null, ct, null);
                            if ((ds != null) && (ds.rowsCount > 0)) {
                                if (ds.rowsCount > 0) {
                                    if (ds.getValue(0, "STATUS") == true) {
                                        var SQLINS = "insert into kbt_t_instalacoes_whats ( id, idinstalacao, dataregistro, numtelefone, idmensagem)  values ";
                                        SQLINS += "((select COALESCE(max(id) +1 ,1) from kbt_t_instalacoes_whats), " + widInstalacao + ",CURRENT_DATE,'" + rsWD.getString("num_telefone") + "','" + ds.getValue(0, "ID") + "')";
                                        var statementWD = connectionWD.prepareStatement(SQLINS);
                                        statementWD.executeUpdate();

                                        pDataset.addRow(new Array("Enviou a mensagem, ID: " + ds.getValue(0, "ID")));
                                    } else {
                                        pDataset.addRow(new Array("Não enviou, Error: " + ds.getValue(0, "MENSAGEM")));
                                    }
                                }
                            }
                        }
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

function f_postUsuarios(wToken, pDataset) {
    // ################### Envia os Usuario #########################

    printLog("info", "End Point Usuarios: ");

    // var tpLocais = {};
    var uUsuarios = [];
    var wSenha = "";

    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
    connectionWD = dataSourceWD.getConnection();


    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('active', true, true, ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
    if (dataset != null && dataset.rowsCount > 0) {
        for (i = 0; i < dataset.rowsCount; i++) {

            var cpf = dataset.getValue(i, "colleaguePK.colleagueId");
            var SQL = "SELECT n.PASSWORD ";
            SQL += "FROM fdn_usertenant n  ";
            SQL += "LEFT JOIN fdn_user r ON ( r.USER_ID = n.USER_ID ) ";
            SQL += "where n.USER_STATE <> 2";
            SQL += "  and n.user_code = '" + dataset.getValue(i, "colleaguePK.colleagueId") + "'";

            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                wSenha = rsWD.getString("PASSWORD");
            }

            wSenha = 'Mot@2023';

            var dados = {
                CODTIPO: "1",
                CRYPT: "S",
                NUMCPF: cpf + "",
                LOGIN: dataset.getValue(i, "colleaguePK.colleagueId") + "",
                NOMUSUARIO: dataset.getValue(i, "colleagueName") + "",
                EMAIL: dataset.getValue(i, "mail") + "",
                SENHA: wSenha + ""
            }
            uUsuarios.push(dados);
        }
    }

    // var constraints = new Array();
    // var dsUsuario = DatasetFactory.getDataset("dsk_frm_usuario", null, constraints, null);
    // if (dsUsuario != null) {
    //     for (i = 0; i < dsUsuario.rowsCount; i++) {

    //         var dados = {
    //             CODTIPO: "1",
    //             CRYPT: "N",
    //             NUMCPF: dsUsuario.getValue(i, "cpf") + "",
    //             LOGIN: dsUsuario.getValue(i, "login") + "",
    //             NOMUSUARIO: dsUsuario.getValue(i, "nome") + "",
    //             EMAIL: dsUsuario.getValue(i, "mail") + "",
    //             SENHA: dsUsuario.getValue(i, "senha") + "",
    //         }
    //         uUsuarios.push(dados);
    //     }
    // }

    if (uUsuarios != '') {
        var endpoint = "/usuarios";
        var motorista = f_atualizarRegistro(endpoint, wToken, uUsuarios)
        if (motorista != null) {

            if (motorista.STATUS == 'OK') {
                pDataset.addRow(new Array("Motoristas Enviados"));
            } else {
                pDataset.addRow(new Array("Erro ao cadastrar Motoristas"));
            }
        }
    }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

    // newDataset.addRow(new Array("OK"));
    // ################### Envia os Usuarios #########################       
}

function f_postAgenda(wToken, pDataset) {
    // ################### Envia os Agenda #########################

    var arrAgenda = [];
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var rsWDParceiro = null;

    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");

    connectionWD = dataSourceWD.getConnection();
    var tCidades = getTable('ds_ReservasSalas', 'tabela_cidades');
    var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');

    printLog("info", "End Point Agenda: ");

    var constraints = new Array();
    var dataset = DatasetFactory.getDataset("ds_ReservasSalas", null, constraints, null);
    // var dataset = null;
    if (dataset != null && dataset.rowsCount > 0) {

        var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');
        for (i = 0; i < dataset.rowsCount; i++) {

            if (parseInt(dataset.getValue(i, "documentid")) > 552891) {

                var arrIntinarario = [];
                var arrVisitas = [];


                // var tPai = getTable('tabela_cidades', '');
                // var tPai = "ml0019694";
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
                SQL += "  and sc.documentid = " + dataset.getValue(i, "documentid");

                statementWD = connectionWD.prepareStatement(SQL);
                rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    var dados = {
                        DOCUMENTID: dataset.getValue(i, "documentid") + "",
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
                SQL += "  and sc.documentid = " + dataset.getValue(i, "documentid");
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
                    SQL += "  and sc.documentid = " + dataset.getValue(i, "documentid");
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
                        SQLParceiro += "  and sc.documentid = " + dataset.getValue(i, "documentid");
                        SQLParceiro += "  and sc.local_parceiro = '" + wLocalVisita.replace("'", "\ ") + "'";
                        SQLParceiro += "  and (sc.lat_parceiro is null and sc.long_parceiro is null)";

                        statementWD = connectionWD.prepareStatement(SQLParceiro);
                        rsWDParceiro = statementWD.executeQuery();
                        while (rsWDParceiro.next()) {

                            printLog("error", "Sql Parceiros: " + SQLParceiro)
                            var dados = {
                                IDFLUIG: rsWDParceiro.getString("id") + "",
                                DOCUMENTID: dataset.getValue(i, "documentid") + "",
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
                            DOCUMENTID: dataset.getValue(i, "documentid") + "",
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

                var dados = {
                    DOCUMENTID: dataset.getValue(i, "documentid") + "",
                    MOTORISTA: dataset.getValue(i, "id_motorista") + "",
                    AJUDANTE: dataset.getValue(i, "id_ajudante") + "",
                    NUMPLACA: dataset.getValue(i, "sala") + "",
                    TITULO: dataset.getValue(i, "nomeEvento") + "",
                    DETALHE: dataset.getValue(i, "description") + "",
                    INICIO: dataset.getValue(i, "dataIni") + "",
                    FIM: dataset.getValue(i, "dataFim") + "",
                    INTINARARIO: arrIntinarario,
                    VISITAS: arrVisitas
                }
                var str = dataset.getValue(i, "dataFim").split(' ')[0];
                var date = new Date(str.split('/').reverse().join('/'));
                var novaData = new Date();

                if (date >= novaData) {
                    arrAgenda.push(dados);
                }
            }
        }

        var endpoint = "/agenda";
        printLog("info", "End Point visitas: ");
        var agenda = f_atualizarRegistro(endpoint, wToken, arrAgenda)
        if (agenda != null) {
            if (agenda.STATUS == 'OK') {
                pDataset.addRow(new Array("Agenda Enviados"));
            } else {
                printLog("info", "Não deu");
                pDataset.addRow(new Array("Erro ao cadastrar Agenda"));
            }
        }
    }

    if (rsWD != null) rsWD.close();
    if (rsWDParceiro != null) rsWDParceiro.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

    // newDataset.addRow(new Array("OK"));
    // ################### Envia os Agenda #########################  
}


function f_postEventos(wToken, pDataset) {

    // ################### Envia os Eventos #########################

    var arrEventos = [];
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    printLog("info", "End Point Eventos: ");

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('liberado', 'on', 'on', ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("ds_cadastro_eventos", null, constraints, null);
    // var dataset = null;
    if (dataset != null && dataset.rowsCount > 0) {


        var tUsuarios = getTable('ds_cadastro_eventos', 'tabela_usuario');
        var tParceiros = getTable('ds_cadastro_eventos', 'tabela_parceiro');
        for (i = 0; i < dataset.rowsCount; i++) {

            var arrUsuarios = [];
            var SQL = " select ";
            SQL += "    sc.codigo_usuario, ";
            SQL += "    sc.usuario, ";
            SQL += "    sc.data_inicio_usuario, ";
            SQL += "    sc.data_fim_usuario ";
            SQL += "FROM " + tUsuarios + "  sc  ";
            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
            SQL += "        and dc.nr_documento = sc.documentid      ";
            SQL += "        and dc.nr_versao = sc.version ";
            SQL += "        and dc.versao_ativa = 1) ";
            SQL += "where 1=1 ";
            SQL += "  and sc.documentid = " + dataset.getValue(i, "documentid");

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wLogin = '';
                var wCPF = '';
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('codigo', rsWD.getString("codigo_usuario"), rsWD.getString("codigo_usuario"), ConstraintType.MUST));
                var dsUsuario = DatasetFactory.getDataset("dsk_frm_usuario", null, constraints, null);
                if (dsUsuario != null) {
                    if (dsUsuario.rowsCount > 0) {
                        wLogin = dsUsuario.getValue(0, "login");
                        wCPF = dsUsuario.getValue(0, "cpf");

                    }
                }

                var dados = {
                    DOCUMENTID: dataset.getValue(i, "documentid") + "",
                    LOGIN: wLogin + "",
                    CPF: wCPF + "",
                    INICIO: FormataStringData(rsWD.getString("data_inicio_usuario")) + "",
                    FIM: FormataStringData(rsWD.getString("data_fim_usuario")) + ""
                }
                arrUsuarios.push(dados);
            }

            var dados = {
                ID: dataset.getValue(i, "ID") + "",
                DOCUMENTID: dataset.getValue(i, "documentid") + "",
                EVENTO: dataset.getValue(i, "titulo") + "",
                DETALHE: dataset.getValue(i, "detalhes") + "",
                INICIO: FormataStringData(dataset.getValue(i, "data_inicio")) + "",
                FIM: FormataStringData(dataset.getValue(i, "data_fim")) + "",
                CODCIDADE: dataset.getValue(i, "codigo_cidade") + "",
                ENDERECO: dataset.getValue(i, "endereco") + "",
                BAIRRO: dataset.getValue(i, "bairro") + "",
                CEP: dataset.getValue(i, "cep") + "",
                CODORIGEM: dataset.getValue(i, "origem") + "",
                USUARIOS: arrUsuarios
            }


            var str = dataset.getValue(i, "data_fim");
            var date = new Date(str.split('/').reverse().join('/'));
            var novaData = new Date();

            if (date >= novaData) {
                // arrAgenda.push(dados);
                arrEventos.push(dados);
            }
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
    }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();
    // ################### Envia os Eventos #########################
}

function f_getVisitas(wToken, pDataset) {
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    var endpoint = "/retornoFluig?indretorno=V";
    var visita = f_atualizarRegistro(endpoint, wToken, "");
    // pDataset.addRow(new Array("Retirno: " + gson.toJson(visita)));
    // var visita = null;
    if (visita != null) {
        var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');
        for (var i = 0; i < visita.length; i++) {
            if (visita[i].STATUS == 'OK') {

                if (visita[i].IDFLUIG != null) {
                    var SQL = "";
                    SQL = " update " + tVisitas + " set ";
                    SQL += "  lat_visita =  '" + visita[i].LATITUDE + "', ";
                    SQL += "  long_visita =  '" + visita[i].LONGITUDE + "' ";
                    SQL += " where documentid =  " + visita[i].DOCUMENCTID;
                    SQL += " and id =  " + visita[i].IDFLUIG;

                    statementWD = connectionWD.prepareStatement(SQL);
                    statementWD.executeUpdate();
                }

                if (visita[i].IDFLUIG == null) {
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
                        SQL += "  and sc.documentid = " + visita[i].DOCUMENCTID;
                        SQL += "  and sc.cidade_visita = '" + visita[i].IDINTINARARIO + "'";
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

                        listaCampos.push(DatasetFactory.createConstraint('cidade_visita___' + seq, visita[i].IDINTINARARIO, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('email_solicitante_visita___' + seq, 'fluig@pormade.com.br', 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('id_solicitante_visita___' + seq, 'admlog', 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('local_visita___' + seq, visita[i].LOCAL, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('tipo_local_visita___' + seq, visita[i].TPLOCAL, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('data_visita___' + seq, visita[i].DATA, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('contato_visita___' + seq, visita[i].CONTATO, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('telefone_visita___' + seq, visita[i].TELEFONE, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('solicitante_visita___' + seq, 'Administrador Fluig', 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('lat_visita___' + seq, visita[i].LATITUDE, 'field', ConstraintType.MUST));
                        listaCampos.push(DatasetFactory.createConstraint('long_visita___' + seq, visita[i].LONGITUDE, 'field', ConstraintType.MUST));

                        listaCampos.push(DatasetFactory.createConstraint('documentId', visita[i].DOCUMENCTID, visita[i].DOCUMENCTID, ConstraintType.MUST));
                        DatasetFactory.getDataset('processo_movimento', null, listaCampos, null);
                        // newDataset.addRow(new Array("Executando Visitas"));

                    } catch (error) {
                        pDataset.addRow(new Array("Erro ao processar: " + error));
                    }

                }

                var arrVisitas = [];
                var dados = {
                    INDACAO: "V",
                    ID: visita[i].CODVISITA
                }
                arrVisitas.push(dados);
                var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrVisitas);
            }
        }
    }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

}


function f_getLeads(wToken, pDataset) {
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    var endpoint = "/retornoFluig?indretorno=P";
    var parceiros = f_atualizarRegistro(endpoint, wToken, "");
    // pDataset.addRow(new Array("Retorno: " + gson.toJson(parceiros)));
    // var parceiros = null;
    if (parceiros != null) {
        var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');
        for (var x = 0; x < parceiros.length; x++) {

            if (parceiros[x].STATUS == 'OK') {
                if (parceiros[x].IDFLUIG != null) {

                    var SQL = "";
                    SQL = " update " + tParceiro + " set ";
                    SQL += "  lat_parceiro =  '" + parceiros[x].LATITUDE + "', ";
                    SQL += "  long_parceiro =  '" + parceiros[x].LONGITUDE + "' ";
                    SQL += " where documentid =  " + parceiros[x].DOCUMENCTID;
                    SQL += " and id =  " + parceiros[x].IDFLUIG;
                    statementWD = connectionWD.prepareStatement(SQL);
                    statementWD.executeUpdate();
                }

                if (parceiros[x].IDFLUIG == null) {

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
                    SQL += "  and sc.documentid = " + parceiros[x].DOCUMENCTID;
                    SQL += "  and sc.local_parceiro = '" + parceiros[x].LOCAL.replace(/'/g, ' ') + "'";


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
                    listaCampos.push(DatasetFactory.createConstraint('cidade_parceiro___' + seq, parceiros[x].CIDADE, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('cod_cidade_parceiro___' + seq, parceiros[x].IDCIDADE, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('uf_parceiro___' + seq, parceiros[x].UF, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('cod_uf_parceiro___' + seq, parceiros[x].CODUF, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('cod_pais_parceiro___' + seq, parceiros[x].CODPAIS, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('nome_parceiro___' + seq, parceiros[x].EMPRESA.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('local_parceiro___' + seq, parceiros[x].LOCAL.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('data_parceiro___' + seq, parceiros[x].DATA, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('contato_parceiro___' + seq, parceiros[x].CONTATO.replace(/'/g, ' '), 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('telefone_parceiro___' + seq, parceiros[x].TELEFONE, 'field', ConstraintType.MUST))
                    listaCampos.push(DatasetFactory.createConstraint('cidade_uf_parceiro___' + seq, parceiros[x].CIDADE + '/' + parceiros[x].UF, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('lat_parceiro___' + seq, parceiros[x].LATITUDE, 'field', ConstraintType.MUST));
                    listaCampos.push(DatasetFactory.createConstraint('long_parceiro___' + seq, parceiros[x].LONGITUDE, 'field', ConstraintType.MUST));

                    listaCampos.push(DatasetFactory.createConstraint('documentId', parceiros[x].DOCUMENCTID, parceiros[x].DOCUMENCTID, ConstraintType.MUST));
                    DatasetFactory.getDataset('processo_movimento', null, listaCampos, null);


                }

                pDataset.addRow(new Array("Criando Card: " + JSON.stringify(parceiros[x])));
                var idCard = f_incluirCRM(parceiros[x], pDataset);
                var arrParceiros = [];
                var dados = {
                    INDACAO: "P",
                    ID: parceiros[x].ID,
                    IDCARD: idCard
                }
                arrParceiros.push(dados);
                var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrParceiros);
            }
        }
    }


    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

}


function f_getEventosLead(wToken, newDataset) {
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    var endpoint = "/retornoFluig?indretorno=LEAD";
    var eventos = f_atualizarRegistro(endpoint, wToken, "");
    if (eventos != null) {
        for (var x = 0; x < eventos.length; x++) {
            if (eventos[x].STATUS == 'OK') {
                var idCard = f_incluirCRM(eventos[x], newDataset);

                var arrParceiros = [];
                var dados = {
                    INDACAO: "L",
                    ID: eventos[x].ID,
                    IDCARD: idCard
                }
                arrParceiros.push(dados);
                var objRetorno = f_atualizarRegistro("/retornoFluig", wToken, arrParceiros);
            }
        }
    }


    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

}

function f_getPipe(wToken, pDataset) {
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
    connectionWD = dataSourceWD.getConnection();
    var gson = new com.google.gson.Gson();

    var dataHoje = dataAtualFormatada();
    var dataDias = dataAtualFormatada(5, '-');

    var endpoint = '/pipe?datainicio=' + dataDias + '&datafim=' + dataHoje;
    //    pDataset.addRow(new Array("End Point " + endpoint.replace(/'/g, '')));
    var leads = f_atualizarRegistro(endpoint.replace(/'/g, ''), wToken, "");
    if (leads != null) {
        for (var x = 0; x < leads.length; x++) {
            if (leads[x].STATUS == 'OK') {
                // pDataset.addRow(new Array("Motorista: " + leads[x].CPFMOTORISTA + ' Contato: ' + leads[x].CONTATO));
                try {
                    var wHora = null;
                    var wAchou = false;
                    var sql = '';
                    if (leads[x].HORA != null) {
                        wHora = "'" + leads[x].HORA + "'";
                    }


                    if (leads[x].ORIGEM == 'PM') {
                        sql = "select * from kbt_t_registroapp where origen = 'PM' and codvisita = " + leads[x].CODVISITA;

                        var wSQL = "insert into kbt_t_registroapp (sequencia, ID, ORIGEN, NUMPLACA, CPFMOTORISTA, MOTORISTA, CPFAJUDANTE, AJUDANTE, INDCAPTURA, DOCUMENCTID, CODVISITA, TIPOLOCAL, LOCAL, EMPRESA, CONTATO, DATA, HORA, TELEFONE, UF, CODUF, CIDADE, IDCIDADE, ";
                        wSQL += "CODPAIS, PROFISSAO, IDPIPE, IDFUNIL, FUNIL, IDGESTOR, MOTIVORECUSA, OBSERVACAO, CODTIPOVISITA, TIPOVISITA, LATITUDE, LONGITUDE) values ";
                        wSQL += "((select COALESCE(max(sequencia) + 1,1) from kbt_t_registroapp)," + leads[x].ID + ",'" + leads[x].ORIGEM + "','" + leads[x].NUMPLACA + "','" + leads[x].CPFMOTORISTA + "','" + f_removeCaracteres(leads[x].MOTORISTA) + "','" + leads[x].CPFAJUDANTE + "','" + f_removeCaracteres(leads[x].AJUDANTE) + "','" + leads[x].INDCAPTURA + "',";
                        wSQL += + leads[x].DOCUMENCTID + "," + leads[x].CODVISITA + ",'" + leads[x].TIPOLOCAL + "','" + f_removeCaracteres(leads[x].LOCAL) + "','" + f_removeCaracteres(leads[x].EMPRESA) + "','" + f_removeCaracteres(leads[x].CONTATO) + "','" + leads[x].DATA.split('/').reverse().join('-') + "'," + wHora + ",";
                        wSQL += "'" + leads[x].TELEFONE + "','" + leads[x].UF + "'," + leads[x].CODUF + ",'" + leads[x].CIDADE + "'," + leads[x].IDCIDADE + "," + leads[x].CODPAIS + ",'" + leads[x].PROFISSAO + "'," + leads[x].IDPIPE + ",";
                        wSQL += + leads[x].IDFUNIL + ",'" + leads[x].FUNIL + "'," + leads[x].IDGESTOR + ",'" + leads[x].MOTIVORECUSA + "','" + leads[x].OBSERVACAO + "'," + leads[x].CODTIPOVISITA + ",'" + leads[x].TIPOVISITA + "','" + leads[x].LATITUDE + "','" + leads[x].LONGITUDE + "')";

                    }

                    if (leads[x].ORIGEM == 'EV') {
                        sql = "select * from kbt_t_registroapp where origen = 'EV' and codvisita = " + leads[x].CODEVENTO;


                        var wSQL = "insert into kbt_t_registroapp (sequencia, ID, ORIGEN, CPFMOTORISTA, MOTORISTA, DOCUMENCTID, CODVISITA, EMPRESA, CONTATO, DATA, HORA, TELEFONE, UF, CIDADE, ";
                        wSQL += "CODPAIS, PROFISSAO, IDPIPE, IDFUNIL, FUNIL, IDGESTOR, OBSERVACAO, LATITUDE, LONGITUDE) values ";
                        wSQL += "((select COALESCE(max(sequencia) + 1,1) from kbt_t_registroapp)," + leads[x].ID + ",'" + leads[x].ORIGEM + "','" + leads[x].CPFMOTORISTA + "','" + leads[x].MOTORISTA + "',";
                        wSQL += + leads[x].DOCUMENCTID + "," + leads[x].CODEVENTO + ",'" + leads[x].EVENTO + "','" + leads[x].CONTATO + "','" + leads[x].DATA.split('/').reverse().join('-') + "'," + wHora + ",";
                        wSQL += "'" + leads[x].TELEFONE + "','" + leads[x].UF + "','" + leads[x].CIDADE + "'," + leads[x].CODPAIS + ",'" + leads[x].PROFISSAO + "'," + leads[x].IDPIPE + ",";
                        wSQL += + leads[x].IDFUNIL + ",'" + leads[x].FUNIL + "'," + leads[x].IDGESTOR + ",'" + leads[x].OBSERVACAO + "','" + leads[x].LATITUDE + "','" + leads[x].LONGITUDE + "')";

                    }

                    if (leads[x].ID == null) {
                        sql += " and id is null ";
                    } else {
                        sql += " and id = " + leads[x].ID;


                    }

                    statementWD = connectionWD.prepareStatement(sql);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;
                        break;
                    }

                    if (wAchou == false) {

                        statementWD = connectionWD.prepareStatement(wSQL);
                        statementWD.executeUpdate();
                    }

                } catch (error) {
                    // pDataset.addRow(new Array("Motorista: " + leads[x].CPFMOTORISTA + ' Contato: ' + leads[x].CONTATO));
                    // pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber + ' Latitude: ' + leads[x].LATITUDE));

                }

            }
        }
    }


    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

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

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pIndServico) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "tracking";
    var gson = new com.google.gson.Gson();

    if (pIndServico != undefined) {
        wServiceCode = "trackingTESTE"
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

function FormataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
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
            printLog("info", "JSON: " + datajson);
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
            // printLog("info", "JSON: " + datajson);

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
                        newDataset.addRow(new Array("ID do Card: " + objRetorno["funil_" + reg.IDFUNIL].data.id));

                        var ct = new Array();
                        ct.push(DatasetFactory.createConstraint('indacao', 'ADDNOTE', null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('id_crm', objRetorno["funil_" + reg.IDFUNIL].data.user_id, null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('id_deal', objRetorno["funil_" + reg.IDFUNIL].data.id, null, ConstraintType.MUST));
                        ct.push(DatasetFactory.createConstraint('observacao', observacao, null, ConstraintType.MUST));
                        var dsN = DatasetFactory.getDataset('dsk_crm', null, ct, null);

                        retorno = objRetorno["funil_" + reg.IDFUNIL].data.id;
                    } else {
                        // newDataset.addRow(new Array("Erro ao enviar: " + ds.getValue(0, "mensagem")));
                    }
                }
            }
        }
    }
    return retorno;
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
    return "'" + anoF + "-" + mesF + "-" + diaF + "'";
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