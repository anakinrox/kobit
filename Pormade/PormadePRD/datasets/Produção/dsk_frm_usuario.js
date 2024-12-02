function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['codigo'] = "";
    listaConstraits['nome'] = "";
    listaConstraits['email'] = "";
    listaConstraits['login'] = "";

    var params = {};
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }


    //Define colunas de retorno.
    newDataset.addColumn('codigo');
    newDataset.addColumn('login');
    newDataset.addColumn('senha');
    newDataset.addColumn('nome');
    newDataset.addColumn('mail');
    newDataset.addColumn('cpf');


    try {
        var connectionCRM = null;
        var statementCRM = null;
        var contextCRM = new javax.naming.InitialContext();
        var dataSourceCRM = contextCRM.lookup("java:/jdbc/CRMDS");
        connectionCRM = dataSourceCRM.getConnection();

        var SQL = "select ";
        SQL += "    u.usr_codigo, ";
        SQL += "    u.usr_login, ";
        SQL += "    u.usr_senha, ";
        SQL += "    u.usr_nome, ";
        SQL += "    u.usr_email, ";
        SQL += "    p.cnpj_cpf ";
        SQL += "from public.fr_usuario u ";
        SQL += "    inner join online.pon_cargos_funcionario cf on (cf.usr_codigo = u.usr_codigo) ";
        SQL += "    left join online.pon_pessoa p on (p.id = cf.id_pessoa) ";
        SQL += "where u.usr_ativo = true ";

        if (listaConstraits['codigo'].trim() != "") {
            SQL += " and u.usr_codigo = " + parseInt(listaConstraits['codigo']);
        }

        if (listaConstraits['nome'].trim() != "") {
            SQL += " and upper(u.usr_nome) like upper('%" + listaConstraits['nome'] + "%')";
        }

        if (listaConstraits['email'].trim() != "") {
            SQL += " and u.usr_email like '%" + listaConstraits['email'] + "%'";
        }

        if (listaConstraits['login'].trim() != "") {
            SQL += " and u.usr_login like '%" + listaConstraits['login'] + "%'";
        }

        statementCRM = connectionCRM.prepareStatement(SQL);
        var rsCRM = statementCRM.executeQuery();

        while (rsCRM.next()) {
            newDataset.addRow(
                new Array(
                    rsCRM.getString("usr_codigo") + "",
                    rsCRM.getString("usr_login") + "",
                    rsCRM.getString("usr_senha") + "",
                    rsCRM.getString("usr_nome") + "",
                    rsCRM.getString("usr_email") + "",
                    rsCRM.getString("cnpj_cpf") + ""
                ));
        }

        if (rsCRM != null) rsCRM.close();
        if (statementCRM != null) statementCRM.close();
        if (connectionCRM != null) connectionCRM.close();

    } catch (error) {
        newDataset.addRow(
            new Array(
                "Error: " + error
            ));
        printLog("error", "Error: " + error);
    }

    return newDataset;
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