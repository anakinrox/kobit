var gToken = '99234657-4084-494f-aa63-5c96c29e3812';

function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## Lincros Gupy ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    newDataset.addColumn('mensagem');
    // newDataset.addColumn('protocolo');


    try {
        f_enviarFuncionario(newDataset);
    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Lincros Gupy ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    newDataset.addColumn('mensagem');
    // newDataset.addColumn('protocolo');


    try {
        f_enviarFuncionario(newDataset);
    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

}

function f_enviarFuncionario(newDataset) {

    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var contextWD = new javax.naming.InitialContext();
    var dataSourceWD = contextWD.lookup("java:/jdbc/APP_RM");
    connectionWD = dataSourceWD.getConnection();

    // var SQL = "set isolation to dirty read";
    // statementWD = connectionWD.prepareStatement(SQL);
    // statementWD.executeUpdate();

    var SQL = "select f.CODCOLIGADA, f.CODFILIAL, f.CHAPA, p.nome, REPLACE(CONVERT(VARCHAR(10), p.dtnascimento, 111), '/', '-') as dtnascimento, p.cpf, p.email ";
    SQL += " from pfunc f  ";
    SQL += " inner join ppessoa p on(p.codigo = f.codpessoa)";
    SQL += " left join kbt_t_pfunc k on(k.CODCOLIGADA = f.CODCOLIGADA ";
    SQL += "                         and k.CODFILIAL = f.CODFILIAL ";
    SQL += "                         and k.CHAPA = f.CHAPA) ";
    SQL += " where f.DATAADMISSAO >= getdate() - 10 ";
    SQL += " and f.DATADEMISSAO is null ";
    SQL += " and k.IDGUPY is null";

    statementWD = connectionWD.prepareStatement(SQL);
    rsWD = statementWD.executeQuery();
    while (rsWD.next()) {
        var data = {
            id_number: rsWD.getString("remetente") + "",
            nin: rsWD.getString("cpf") + "",
            name: rsWD.getString("nome") + "",
            email: rsWD.getString("email") + "",
            lang: "pt",
            birth_date: rsWD.getString("dtnascimento")
        }

        var wRetorno = f_enviaRegistroRegistro(data, newDataset);
        if (wRetorno != null) {

        }

        newDataset.addRow(new Array(
            rsWD.getString("cpf") + "",
            rsWD.getString("nome")
        ));

        // var wRetorno = f_consultaRegistro(rsWD.getString("cpf"), newDataset)
        // if (wRetorno != null) {


        // }
    }

    if (rsWD != null) rsWD.close();
    if (statementWD != null) statementWD.close();
    if (connectionWD != null) connectionWD.close();

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


function f_consultaRegistro(pNumCPF, newDataset) {
    var retorno = null;
    var clientService = fluigAPI.getAuthorizeClientService();
    var endpoint = '/users?secret=' + gToken + '&q=' + pNumCPF
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "gupy",
        endpoint: endpoint,
        timeoutService: "240",
        method: "GET",
    };

    var params = {};

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = JSON.stringify(data);
    var vo = clientService.invoke(jj);

    if (vo.httpStatusResult != "200") {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }

    return retorno;
}

function f_enviaRegistro(pJson, newDataset) {
    var retorno = null;
    var clientService = fluigAPI.getAuthorizeClientService();
    var endpoint = '/users?secret=' + gToken;
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "gupy",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {};
    var headers = {};

    params = pJson;

    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = JSON.stringify(data);
    var vo = clientService.invoke(jj);

    if (vo.httpStatusResult != "200") {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }

    return retorno;
}
