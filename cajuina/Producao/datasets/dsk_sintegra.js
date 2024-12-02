var debug = false;
var token = "DC0AB130-7EEE-41DD-A5CA-9BA6CE41457E"

// var newDataset;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'CONSULTAR';
            // listaConstraits['numcpnj'] = '22.979.609/0001-97';
            listaConstraits['numcpnj'] = '29.356.254/0001-29';
        }


        // newDataset.addRow(new Array("SQL: " + wRetorno));

        // return false;

        if (listaConstraits['indacao'] == 'CONSULTAR') {
            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
                var connectionWD = dataSourceWD.getConnection();
                var gson = new com.google.gson.Gson();
                newDataset.addColumn('status');
                newDataset.addColumn('retorno');

                var wStatus = false;
                var wRetorno = '';
                var wAchou = false;

                var SQL = "SELECT json FROM KBT_T_CONSULTAS_API where cnpj = '" + listaConstraits['numcpnj'].replace(/[^0-9]+/g, '') + "' and INDBUSCA = 'SINTEGRA' and datregistro >= TO_DATE('" + dataAtualFormatada(7) + "','DD/MM/YYYY')";
                var statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    wAchou = true;
                    wStatus = true;
                    wRetorno = rsWD.getString("json");
                }

                if (wAchou == false) {
                    var retorno = f_consultaSintegra(listaConstraits['numcpnj'].replace(/[^0-9]+/g, ''));
                    if (retorno != null) {
                        wStatus = true;
                        wRetorno = gson.toJson(retorno);
                        var wObjeto = JSON.parse(wRetorno);
                        var sqlUPD = "INSERT INTO KBT_T_CONSULTAS_API (DATREGISTRO, CNPJ, INDBUSCA, SITUACAO, JSON) VALUES ";
                        sqlUPD += "(sysdate,'" + listaConstraits['numcpnj'].replace(/[^0-9]+/g, '') + "','SINTEGRA','" + wObjeto.situacao_ie + "','" + wRetorno + "')";
                        var statementWD = connectionWD.prepareStatement(sqlUPD);
                        statementWD.executeUpdate();
                    }
                }

            } catch (error) {
                newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
            } finally {
                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        newDataset.addRow(new Array(
            wStatus,
            wRetorno
        ));
        return newDataset;
    }

}

function onMobileSync(user) {

}

function dataAtualFormatada(nDias) {
    var data = new Date();

    if (nDias != undefined) {
        data.setDate(data.getDate() - nDias);
    }

    var dia = data.getDate().toString();
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

function f_consultaSintegra(pNumCNPJ) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "sintegra";
    var params = {};
    var Endpoint = "execute-api.php?token=" + token + "&cnpj=" + pNumCNPJ.replace(/[^0-9]+/g, '') + "&plugin=ST";
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;
    // data["strParams"] = gson.toJson(params);

    var jj = gson.toJson(data)


    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
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
