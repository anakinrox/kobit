var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var gson = new com.google.gson.Gson();
        // printLog("info", "## LMS START ##");
        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";
        listaConstraits['username'] = "";
        listaConstraits['codeCurso'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        if (listaConstraits['indacao'] == "") {

            listaConstraits['indacao'] = 'CURSOS';
            // listaConstraits['indacao'] = 'CURSOS';
            listaConstraits['username'] = "eloisa.theiss";
            listaConstraits['codeCurso'] = "SegInfoArdex";
            listaConstraits['idcurso'] = '2037';
            listaConstraits['nomeusuario'] = 'ELOISA CAROLINA THEISS'

            listaConstraits['json'] = '{"login":"eloisa.theiss","nome":"ELOISA CAROLINA THEISS","cursos":[{"idCurso":"2037","codCurso":"SegInfoArdex"},{"idCurso":"1649","codCurso":"excel"}]}';
        }


        if (listaConstraits['indacao'] == 'CURSOS') {
            newDataset.addColumn('idcurso');
            newDataset.addColumn('codcurso');
            newDataset.addColumn('curso');

            var retorno = f_consultaCursos('24', newDataset);
            if (retorno != null) {
                for (var i = 0; i < retorno.content.length; i++) {

                    if (retorno.content[i].type == "Training") {
                        newDataset.addRow(new Array(
                            retorno.content[i].id,
                            retorno.content[i].code,
                            retorno.content[i].name
                        ));
                    }

                    if (retorno.content[i].type == "Folder") {
                        f_montraRetorno(retorno.content[i].id, newDataset);
                    }
                }
            }
        }

        if (listaConstraits['indacao'] == 'VALIDA') {
            newDataset.addColumn('status');
            var wIndIncrito = f_validaMatricula(listaConstraits['username'], listaConstraits['codeCurso']);
            newDataset.addRow(new Array(
                wIndIncrito
            ));
        }

        if (listaConstraits['indacao'] == 'INCLUIRCURSO') {

            try {
                newDataset.addColumn('status');
                newDataset.addColumn('mensagem');
                var wStatus;
                var wMensagem;
                var wIndIncrito = false;

                var jsonObj = JSON.parse(listaConstraits['json']);
                var length = Object.keys(jsonObj.cursos).length;

                for (var i = 0; i < length; i++) {

                    wIndIncrito = f_validaMatricula(jsonObj.login, jsonObj.cursos[i].codCurso);

                    if (wIndIncrito == false) {

                        var contextWD = new javax.naming.InitialContext();
                        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
                        connectionWD = dataSourceWD.getConnection();
                        var wID = 0;

                        var SQL = "select id from ele_user where username = '" + jsonObj.login.toLowerCase() + "'";
                        var statementWD = connectionWD.prepareStatement(SQL);
                        var rsWD = statementWD.executeQuery();
                        while (rsWD.next()) {
                            wID = rsWD.getString("id");
                        }


                        var wJson = {
                            "parties": [
                                {
                                    "id": parseInt(wID),
                                    "name": jsonObj.nome.toLowerCase(),
                                    "type": "USER"
                                }
                            ],
                            "items": [
                                {
                                    "id": parseInt(jsonObj.cursos[i].idCurso),
                                    "type": "TRACK_TRAINING"
                                }
                            ]
                        }

                        // wStatus = '';
                        // wMensagem = gson.toJson(wJson);
                        var wRetorno = f_IncluirCurso(wJson, newDataset);
                        if (wRetorno.failureItems.length == 0) {
                            wStatus = "OK";
                            wMensagem = wRetorno.successItems[0].message;
                        } else {
                            wStatus = "ERROR";
                            wMensagem = wRetorno.failureItems[0].message;
                        }

                    } else {
                        wStatus = "ERROR";
                        wMensagem = "Usuário já matriculado nesse curso!"
                    }
                }

            } catch (error) {

            } finally {

                newDataset.addRow(new Array(
                    wStatus,
                    wMensagem
                ));

                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        return newDataset;
    }
}

function onMobileSync(user) {
}

function f_validaMatricula(pUsuario, pCurso) {
    try {
        var wIndIncrito = false
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        var wIndIncrito = false;

        var SQL = "select * from kbt_v_treinamento_status where username = '" + pUsuario + "' and code ='" + pCurso + "' and final_status <> 'CANCELLED'";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wIndIncrito = true;
        }


    } catch (error) {

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return wIndIncrito;
    }
}


function f_montraRetorno(idCurso, dataSet) {
    var retorno = f_consultaCursos(idCurso, dataSet);

    for (var i = 0; i < retorno.content.length; i++) {
        if (retorno.content[i].type == "Training") {
            dataSet.addRow(new Array(
                retorno.content[i].id,
                retorno.content[i].code,
                retorno.content[i].name
            ));
        }
        if (retorno.content[i].type == "Folder") {
            f_montraRetorno(retorno.content[i].id, dataSet);
        }
    }



}


function f_IncluirCurso(jSonFile, dataset) {

    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "fluigApi";
    var params;
    var Endpoint = "/lms/api/v1/enrollments/requests";
    var gson = new com.google.gson.Gson();

    params = jSonFile;

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // var params;
    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";
    headers["Cookie"] = 'JSESSIONID="3leOafioAjpVXstXn70e4Jbuyp3LW4ZFVsLyBYfG.master:fluig1"';

    data["headers"] = headers;
    data["strParams"] = gson.toJson(params);
    // data["params"] = params;

    // printLog("info", "JSON: " + JSON.stringify(data));
    // dataset.addRow(new Array("JSON: " + gson.toJson(params)));

    // var jj = JSON.stringify(data);
    var jj = gson.toJson(data)
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
        var datajson = gson.toJson(retorno);
        // dataset.addRow(new Array("Retorno: " + gson.toJson(datajson)));
    }

    return retorno;
}


function f_consultaCursos(idCurso, dataset) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "fluigApi";
    var params;
    var Endpoint = "/lms/api/rest/catalogTrainingTrackRest/getCatalogItems/" + idCurso;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // var params;
    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    // printLog("info", "JSON: " + JSON.stringify(data));
    // dataset.addRow(new Array("JSON: " + gson.toJson(data)));

    // var jj = JSON.stringify(data);
    var jj = gson.toJson(data)
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
        // var datajson = gson.toJson(retorno);
        // dataset.addRow(new Array("Retorno: " + gson.toJson(datajson)));
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