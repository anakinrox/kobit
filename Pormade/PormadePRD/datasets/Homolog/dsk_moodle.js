var endpoint = '/fluig/api.php';

function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    // printLog("info", "## Moodle START ##");
    var newDataset = DatasetBuilder.newDataset();


    var listaConstraits = {};
    listaConstraits['indacao'] = "";
    listaConstraits['fname'] = "";
    listaConstraits['lname'] = "";
    listaConstraits['email'] = "";
    listaConstraits['idCurso'] = "";
    listaConstraits['idUser'] = "";

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }


    if (listaConstraits['indacao'] == '') {
        // listaConstraits['indacao'] = 'FINDCOURSE';
        // listaConstraits['idUser'] = "3116";
        // listaConstraits['idCurso'] = "30";

        listaConstraits['indacao'] = 'ADDUSER';
        listaConstraits['fname'] = "Marcio2";
        listaConstraits['lname'] = "Silva";
        listaConstraits['email'] = "marcio9992@kobit.com.br";
        listaConstraits['idCurso'] = "30";
    }

    try {
        if (listaConstraits['indacao'] == 'ADDUSER') {
            newDataset.addColumn('usuario');
            newDataset.addColumn('senha');
            newDataset.addColumn('cupom');
            newDataset.addColumn('idMoodle');
            newDataset.addColumn('status');

            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
            connectionWD = dataSourceWD.getConnection();

    	    var SQL =  "select online.fn_gerar_cupom_parceiro( 36 ) as cupon;"
            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
            	var wcupon = rsWD.getString("cupon");
                var wlogin = 'divulgador'+( wcupon.replace('DIV','') );
                var wSenha = wcupon + '@' + makeid(6) + '*';

                var wRretorno = f_incluiUsario(wlogin, wSenha, listaConstraits['fname'], listaConstraits['lname'], listaConstraits['email']);
                if (wRretorno.exception == undefined) {
                    var wUID = wRretorno[0].id;
                    f_incluiCurso(wUID, listaConstraits['idCurso']);

                    newDataset.addRow(new Array(
                        wlogin + "",
                        wSenha + "",
                        wcupon + "",
                        wUID + "",
                        "Usuario cadastrado"
                    ));


                } else {
                    newDataset.addRow(new Array(
                        "",
                        "",
                        "",
                        "",
                        "Usuario não cadastrado"
                    ));
                }

            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();
        }

        if (listaConstraits['indacao'] == 'ADDCOURSE') {
            newDataset.addColumn('STATUS');
            f_incluiCurso(listaConstraits['idUser'], listaConstraits['idCurso']);
            newDataset.addRow(new Array("Incluido no Curso"));
        }

        if (listaConstraits['indacao'] == 'FINDCOURSE') {
            newDataset.addColumn('idMoodle');
            newDataset.addColumn('curso');
            newDataset.addColumn('status');
            newDataset.addColumn('perc_concluido');

            var wIndConclusao = true;
            var wNumPassoCurso = 0;
            var wNumPassoCursoConcluido = 0;


            var wRetorno = f_consultaConclusao(listaConstraits['idUser'], listaConstraits['idCurso']);

            if (wRetorno != null) {
                for (var x = 0; x < wRetorno.statuses.length; x++) {

                    if (wRetorno.statuses[x].timecompleted == 0) {
                        wIndConclusao = false;
                    }

                    if (wIndConclusao) {
                        wNumPassoCursoConcluido = wNumPassoCursoConcluido + 1;
                    }
                    wNumPassoCurso = wNumPassoCurso + 1;
                }
            } else {
                wIndConclusao = false;
                wNumPassoCurso = 0;
                wNumPassoCursoConcluido = 0;
            }

            var wPercConcluido = ((wNumPassoCursoConcluido / wNumPassoCurso) * 100);
            newDataset.addRow(
                new Array(
                    listaConstraits['idUser'] + "",
                    listaConstraits['idCurso'] + "",
                    wIndConclusao,
                    wPercConcluido + ""
                ));

        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error));
    } finally {
        return newDataset;
    }
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

function f_incluiUsario(pUser, pSenha, pFName, pLName, pEmail) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "moodle",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {
        indacao: 'INC',
        username: pUser,
        password: pSenha,
        firstname: pFName,
        lastname: pLName,
        email: pEmail,
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

}

function f_incluiCurso(pUserID, pCursoID) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "moodle",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {
        indacao: 'COURSE',
        userid: pUserID,
        curseid: pCursoID
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
        return true;
    }
}

function f_consultaConclusao(pUserID, pCursoID) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "moodle",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = {
        indacao: 'CONSULTA',
        userid: pUserID,
        curseid: pCursoID
    }

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
        return jr;
    }
}

function makeid(length) {
	  var result           = '';
	  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  var charactersLength = characters.length;
	  for ( var i = 0; i < length; i++ ) {
	     result += characters.charAt(Math.floor(Math.random() * charactersLength));
	  }
	  return result;
	}
