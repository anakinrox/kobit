
function defineStructure() { }
function onSync(lastSyncDate) { }

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## START ##");
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['indacao'] = '';

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }



    if (listaConstraits['indacao'] == '') {
        listaConstraits['indacao'] = 'FINDCOOD';
        listaConstraits['codcondominio'] = "1179";
        listaConstraits['condominio'] = "RESIDENCIAL ALGUMA";
        listaConstraits['unidades'] = "100";
        listaConstraits['concluidas'] = "10";
        listaConstraits['construcao'] = "40";
        listaConstraits['uf'] = "SP";
        listaConstraits['cidade'] = "Holambra";
        listaConstraits['bairro'] = "";
        listaConstraits['endereco'] = "Campo das Palmas, 614"

        listaConstraits['telefone'] = "(47) 98837-4358";
        listaConstraits['nome'] = "Marcio"
        listaConstraits['registro'] = ""

        listaConstraits['json'] = '[{"idengenheiro":"1","nome":"Marcio Kobit","telefone":"(47) 98811-2917","registro":"123456","obras":"0"},{"idengenheiro":"2","nome":"Adrian Pormade","telefone":"(47) 98811-2935","registro":"123555","obras":0}]';
        // listaConstraits['json'] = '[]';
    }

    try {

        if (listaConstraits['indacao'] == 'CONSULTA') {
            newDataset.addColumn('id');
            newDataset.addColumn('uf');
            newDataset.addColumn('cidade');
            newDataset.addColumn('condominio');
            newDataset.addColumn('unidades');
            newDataset.addColumn('concluidas');
            newDataset.addColumn('emconstrucao');
            newDataset.addColumn('latitude');
            newDataset.addColumn('longitude');
            newDataset.addColumn('saldo');
            newDataset.addColumn('eng');

            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
            connectionWD = dataSourceWD.getConnection();
            var gson = new com.google.gson.Gson();

            var SQL = "select  ";
            SQL += "     kbt_app.id, ";
            SQL += "     fc.uf, ";
            SQL += "     fc.cidade as cidade, ";
            SQL += "     kbt_app.nom_condominio, ";
            SQL += "     coalesce(kbt_app.unidades, 0) as unidades, ";
            SQL += "     coalesce(kbt_app.concluidas, 0) as concluidas, ";
            SQL += "     coalesce(kbt_app.construcao, 0) as construcao, ";
            SQL += "    (coalesce(kbt_app.unidades, 0) - coalesce(kbt_app.concluidas, 0)) as saldo, ";
            SQL += "    kbt_app.latitude, ";
            SQL += "    kbt_app.longitude ";
            SQL += "from kbt_t_condominios_app kbt_app ";
            SQL += "    inner join fluig_v_cidade fc on(fc.cod_cidade_ibge = kbt_app.cod_ibge) ";

            if (listaConstraits['uf'] != '') {
                SQL += "  and(fc.uf = '" + listaConstraits['uf'] + "') "

            }

            if (listaConstraits['cidade'] != '') {
                SQL += "  and(fc.cidade = '" + listaConstraits['cidade'] + "')  ";
            }

            if (listaConstraits['codcondominio'] != '' && listaConstraits['codcondominio'] != '') {
                SQL += " where kbt_app.id = " + listaConstraits['codcondominio']
            }

            SQL += " order by kbt_app.id asc"


            // printLog("erro", "SQL Inst: " + SQL);
            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                var ArrEng = [];
                if (listaConstraits['codcondominio'] != '' && listaConstraits['codcondominio'] != '') {
                    var SQLI = "select ";
                    SQLI += "    kbt_eng.id, ";
                    SQLI += "    kbt_eng.nom_registro, ";
                    SQLI += "    kbt_eng.num_telefone, ";
                    SQLI += "    kbt_eng.num_registro, ";
                    SQLI += "    kbt_app_end.qtd_obras ";
                    SQLI += "from kbt_t_condominio_app_detail as kbt_app_end ";
                    SQLI += "    inner join kbt_t_condominio_app_eng kbt_eng on(kbt_eng.id = kbt_app_end.id_engenheiro) ";
                    SQLI += "where kbt_app_end.id_condominio =  " + listaConstraits['codcondominio'];
                    statementWD = connectionWD.prepareStatement(SQLI);
                    var rsWD2 = statementWD.executeQuery();


                    while (rsWD2.next()) {
                        var data = {
                            codigo: rsWD2.getString('id') + "",
                            nome: rsWD2.getString('nom_registro') + "",
                            telefone: rsWD2.getString('num_telefone') + "",
                            registro: rsWD2.getString('num_registro') + "",
                            obras: rsWD2.getString('qtd_obras') + "",
                        };
                        ArrEng.push(data);
                    }
                }



                newDataset.addRow(new Array(
                    rsWD.getString('id') + "",
                    rsWD.getString('uf') + "",
                    rsWD.getString('cidade') + "",
                    rsWD.getString('nom_condominio') + "",
                    rsWD.getString('unidades') + "",
                    rsWD.getString('concluidas') + "",
                    rsWD.getString('construcao') + "",
                    rsWD.getString('latitude') + "",
                    rsWD.getString('longitude') + "",
                    rsWD.getString('saldo') + "",
                    gson.toJson(ArrEng)

                ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['indacao'] == 'ENGENHEIROS') {
            newDataset.addColumn('idcondomino');
            newDataset.addColumn('idengenheiro');
            newDataset.addColumn('nome');
            newDataset.addColumn('telefone');
            newDataset.addColumn('registro');
            newDataset.addColumn('obras');


            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
            connectionWD = dataSourceWD.getConnection();

            var SQL = "select id, nom_registro, num_telefone, num_registro from kbt_t_condominio_app_eng";


            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                newDataset.addRow(new Array(
                    listaConstraits['codcondominio'] + "",
                    rsWD.getString('id') + "",
                    rsWD.getString('nom_registro') + "",
                    rsWD.getString('num_telefone') + "",
                    rsWD.getString('num_registro') + "",
                    "0"
                ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['indacao'] == 'UPD') {

            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');
            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
            connectionWD = dataSourceWD.getConnection();
            var gson = new com.google.gson.Gson();

            var status = 'OK';
            var mensagem = '';

            try {
                var SQLUPD = "update kbt_t_condominios_app set nom_condominio = '" + listaConstraits['condominio'] + "', unidades = " + listaConstraits['unidades'] + ", concluidas = " + listaConstraits['concluidas'] + ", construcao = " + listaConstraits['construcao'];
                if (listaConstraits['latitude'] != '' && listaConstraits['longitude'] != '') {
                    SQLUPD += " , latitude = '" + listaConstraits['latitude'] + "', longitude = '" + listaConstraits['longitude'] + "' ";
                }

                SQLUPD += " where id = " + listaConstraits['codcondominio'];
                var statementWD = connectionWD.prepareStatement(SQLUPD);
                statementWD.executeUpdate();
                // mensagem = SQLUPD;

                var SQLDEL = "delete from kbt_t_condominio_app_detail where id_condominio = " + listaConstraits['codcondominio'];
                var statementWD = connectionWD.prepareStatement(SQLDEL);
                statementWD.executeUpdate();
                // mensagem = SQLDEL;

                var jsonObj = JSON.parse(listaConstraits['json']);
                var length = Object.keys(jsonObj).length;
                for (var i = 0; i < length; i++) {
                    // newDataset.addRow(new Array("Registro", jsonObj[i]['idengenheiro'] + ' - ' + jsonObj[i]['nome']));
                    var SQLINS = "insert into kbt_t_condominio_app_detail (id_condominio, id_engenheiro, qtd_obras) values(" + listaConstraits['codcondominio'] + ", " + jsonObj[i]['idengenheiro'] + "," + jsonObj[i]['obras'] + ")"
                    var statementWD = connectionWD.prepareStatement(SQLINS);
                    statementWD.executeUpdate();


                    var SQLUPD = "update kbt_t_condominio_app_eng set nom_registro = '" + jsonObj[i]['nome'] + "', num_telefone = '" + jsonObj[i]['telefone'] + "', num_registro = '" + jsonObj[i]['registro'] + "' where id = " + jsonObj[i]['idengenheiro'];
                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();
                    // mensagem = SQLUPD;
                }

            } catch (error) {
                status = 'NOK';
                mensagem = error;
            } finally {
                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }

            newDataset.addRow(new Array(status, mensagem));

        }

        if (listaConstraits['indacao'] == 'FINDCOOD') {
            try {
                var connectionWD = null;
                var statementWD = null;
                var rsWD = null;
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
                connectionWD = dataSourceWD.getConnection();
                var gson = new com.google.gson.Gson();

                newDataset.addColumn('STATUS');
                newDataset.addColumn('MENSAGEM');
                var gson = new com.google.gson.Gson();

                var status = 'OK';
                var mensagem = '';
                var wUF = listaConstraits['uf'].toUpperCase();
                var wCidade = listaConstraits['cidade'].toUpperCase();
                var wEndereco = listaConstraits['endereco'].toUpperCase()
                var wBairro = listaConstraits['bairro'].toUpperCase();
                var wCondominio = listaConstraits['condominio'].toUpperCase()

                var wFindStreet = wEndereco + " - " + wBairro + " " + wCidade + " " + wUF
                var wRetorno = f_getCoordenadas(wFindStreet.replace(/ /g, "%20"), newDataset);
                if (wRetorno != null) {
                    arrRet = JSON.parse(wRetorno);
                    var wAchou = false;
                    var wlatitude = null;
                    var wLongitude = null;

                    for (let i = 0; i < arrRet.results[0].address_components.length; i++) {
                        if (arrRet.results[0].address_components[i].types == 'route') {
                            wAchou = true;
                            break
                        }
                    }

                    if (wAchou == true) {
                        wlatitude = arrRet.results[0].geometry.location.lat;
                        wLongitude = arrRet.results[0].geometry.location.lng;

                        // newDataset.addRow(new Array("", " Acho: " + wlatitude + ' ID: ' + wLongitude));
                        status = 'OK';
                        mensagem = '';
                        if (listaConstraits['codcondominio'] == undefined || listaConstraits['codcondominio'] == '') {
                            var wSQL = "insert into kbt_t_condominios_app (id, nom_condominio, unidades, concluidas, construcao, cod_cidade, uf, cidade, cod_ibge, latitude, longitude) ";
                            wSQL += "select ";
                            wSQL += "(select COALESCE(max(id) + 1, 1) from kbt_t_condominios_app), ";
                            wSQL += "'" + wCondominio + "', 0, 0, 0, cod_cidade, uf, cidade, cod_cidade_ibge, '" + wlatitude + "', '" + wLongitude + "' ";
                            wSQL += "from fluig_v_cidade where upper(uf) = upper('" + wUF + "') and upper(cidade) = upper('" + wCidade + "') ";
                        } else {
                            var wSQL = "update kbt_t_condominios_app set  latitude = '" + wlatitude + "', longitude = '" + wLongitude + "', cidade = '" + wCidade + "', uf = '" + wUF + "', cod_ibge = (select cod_cidade_ibge from fluig_v_cidade where upper(uf) = upper('" + wUF + "') and upper(cidade) = upper('" + wCidade + "'))  where id = " + listaConstraits['codcondominio'];
                        }
                        // newDataset.addRow(new Array(status, wSQL));
                        printLog("erro", "Error SQL: " + wSQL);
                        try {
                            statementWD = connectionWD.prepareStatement(wSQL);
                            statementWD.executeUpdate();


                            var SQLI = "select id from kbt_t_condominios_app where upper(uf) = upper('" + wUF + "') and upper(cidade) = upper('" + wCidade + "') and nom_condominio ='" + wCondominio + "'";
                            statementWD = connectionWD.prepareStatement(SQLI);
                            var rsWD2 = statementWD.executeQuery();
                            // newDataset.addRow(new Array(status, SQLI));

                            while (rsWD2.next()) {
                                mensagem = rsWD2.getString('id');
                            }

                        } catch (error) {
                            status = 'NOK';
                            mensagem = error;
                            newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber + ' ID: ' + mensagem));

                        }

                    } else {
                        status = 'NOK';
                        mensagem = 'Endereço não encontrado!';
                    }
                }

                newDataset.addRow(new Array(status, mensagem));

                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();

            } catch (error) {
                newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber + ' Erro: ' + error));
            }
        }

        if (listaConstraits['indacao'] == 'INCENG') {

            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');
            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
            connectionWD = dataSourceWD.getConnection();
            var gson = new com.google.gson.Gson();
            var wAchou = false;

            var status = 'OK';
            var mensagem = '';

            try {
                var SQL = "select count(1) as reg from kbt_t_condominio_app_eng where num_telefone = '" + listaConstraits['telefone'] + "'"
                statementWD = connectionWD.prepareStatement(SQL);
                rsWD = statementWD.executeQuery();

                while (rsWD.next()) {
                    wAchou = rsWD.getString('reg') == '1' ? true : false;
                }

                // newDataset.addRow(new Array("", wAchou));
                if (!wAchou) {
                    // newDataset.addRow(new Array("", "Entrou no IF"));
                    // newDataset.addRow(new Array("IF", jsonObj[i]['idengenheiro'] + ' - ' + jsonObj[i]['nome']));
                    var SQLINS = "insert into kbt_t_condominio_app_eng (id, nom_registro, num_telefone, num_registro) values((select COALESCE(max(id) + 1, 1) from kbt_t_condominio_app_eng),'" + listaConstraits['nome'] + "','" + listaConstraits['telefone'] + "','" + listaConstraits['registro'] + "')"
                    // newDataset.addRow(new Array("SQL", SQLINS));
                    var statementWD = connectionWD.prepareStatement(SQLINS);
                    statementWD.executeUpdate();
                } else {
                    status = 'NOK';
                    mensagem = 'Já existe um Engenheiro cadastrado para esse número de telefone';
                }

            } catch (error) {
                status = 'NOK';
                mensagem = error;
            } finally {
                if (rsWD != null) rsWD.close();
                if (statementWD != null) statementWD.close();
                if (connectionWD != null) connectionWD.close();
            }

            newDataset.addRow(new Array(status, mensagem));

        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) { }

var debug = true;
function printLog(tipo, msg) {
    if (debug) {
        var msgs = getValue('WKDef') + ' - ' + getValue('WKNumProces') + ' - ' + msg;
        if (tipo == 'info') {
            //log.info(msgs);
        } else if (tipo == 'error') {
            log.error(msgs);
        } else if (tipo == 'fatal') {
            log.fatal(msgs);
        } else {
            log.warn(msgs);
        }
    }
}

function f_getCoordenadas(pEndereco, pDataset) {

    var retorno = null;
    var params;

    var endpoint = "/geocode/json?address=" + pEndereco + "&key=AIzaSyCl0_mNZ9TkYs9hOwh_wouxt--iLyFojxA"; // endPoint pra buscar o Token

    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "google",
            endpoint: endpoint,
            timeoutService: "240",
            method: "GET",
        };

        var headers = {};
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        data["params"] = params;

        var jj = JSON.stringify(data);
        var vo = clientService.invoke(jj);

        if (vo.httpStatusResult == "200") {
            var jr = vo.getResult();
            retorno = jr;
        }

        // pDataset.addRow(new Array('get', retorno));
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return retorno;


}

function f_removeCaracteres(str) {
    var novastr = null;

    if (str != '' && str != null) {
        var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ?Þßàáâãäåæçèéêëìíîïðñòóô?öøùúûüýþÿ?";
        var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        novastr = '';
        for (var z = 0; z < str.length; z++) {
            var troca = false;
            for (var y = 0; y < com_acento.length; y++) {
                if (str.substr(z, 1) == com_acento.substr(y, 1)) {
                    novastr += sem_acento.substr(a, 1);
                    troca = true;
                    break;
                }
            }
            if (troca == false) {
                novastr += str.substr(z, 1);
            }
        }
        novastr = novastr.replace(/'/g, '');
    }

    return novastr;
}