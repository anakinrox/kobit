function defineStructure() {
    addColumn('status');

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Tracking START ##");
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['endpoint'] = "";
    listaConstraits['datainicio'] = "";
    listaConstraits['datafim'] = "";
    listaConstraits['placa'] = "";
    listaConstraits['documentid'] = "";
    listaConstraits['indMapa'] = "";
    listaConstraits['uf'] = "";
    listaConstraits['cidade'] = "";
    listaConstraits['motorista'] = "";
    listaConstraits['coords'] = "";

    listaConstraits['nummanifesto'] = "";
    var params = {};

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    if (listaConstraits['endpoint'] == '') {
        listaConstraits['endpoint'] = 'mapa';
        listaConstraits['datainicio'] = "28/02/2024";
        listaConstraits['datafim'] = "28/02/2024";
        listaConstraits['uf'] = ''
        listaConstraits['wresult'] = '[false,true,false]';
    }

    try {

        if (listaConstraits['endpoint'] == 'uf') {
            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
            connectionWD = dataSourceWD.getConnection();

            newDataset.addColumn('UF');
            newDataset.addColumn('NOME');

            var SQL = " select distinct uf, nome ";
            SQL += "FROM fluig_v_cidade WHERE cod_erp is not null order by uf";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(
                    new Array(
                        rsWD.getString("uf") + "",
                        rsWD.getString("nome") + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();
        }

        if (listaConstraits['endpoint'] == 'cidade') {
            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
            connectionWD = dataSourceWD.getConnection();

            newDataset.addColumn('UF');
            newDataset.addColumn('cidade');

            var SQL = " select distinct uf, cidade ";
            SQL += "FROM fluig_v_cidade WHERE cod_erp is not null";

            if (listaConstraits['uf'] != "") {
                SQL += " and uf = '" + listaConstraits['uf'] + "'";
            };

            if (listaConstraits['cidade'] != "") {
                SQL += " and cidade = '" + listaConstraits['cidade'] + "'";
            }

            SQL += " order by cidade";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(
                    new Array(
                        rsWD.getString("uf") + "",
                        rsWD.getString("cidade") + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['endpoint'] == 'rotas') {
            newDataset.addColumn('documentID');
            newDataset.addColumn('veiculo');
            newDataset.addColumn('placa');
            newDataset.addColumn('motorista');
            newDataset.addColumn('ajudante');
            newDataset.addColumn('datInicio');
            newDataset.addColumn('datFim');
            newDataset.addColumn('titulo');

            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
            connectionWD = dataSourceWD.getConnection();

            var constraints = new Array();
            var dataset = DatasetFactory.getDataset("ds_ReservasSalas", null, constraints, null);
            if (dataset != null && dataset.rowsCount > 0) {
                var tCidades = getTable('ds_ReservasSalas', 'tabela_cidades');

                for (i = 0; i < dataset.rowsCount; i++) {



                    var SQL = " select ";
                    SQL += " distinct 1 ";
                    SQL += "FROM " + tCidades + "  sc  ";
                    SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
                    SQL += "        and dc.nr_documento = sc.documentid      ";
                    SQL += "        and dc.nr_versao = sc.version ";
                    SQL += "        and dc.versao_ativa = 1) ";
                    SQL += "where 1=1 ";

                    if ((listaConstraits['datainicio'] != '') && (listaConstraits['datainicio'] != '')) {
                        SQL += "  and sc.documentid = " + dataset.getValue(i, "documentid");
                        SQL += "  and STR_TO_DATE(sc.cidade_data_prevista_ini, '%d/%m/%Y') between '" + listaConstraits['datainicio'] + "' and '" + listaConstraits['datafim'] + "'";
                    }

                    statementWD = connectionWD.prepareStatement(SQL);
                    rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {

                        newDataset.addRow(
                            new Array(
                                dataset.getValue(i, "documentid") + "",
                                dataset.getValue(i, "sala") + "",
                                dataset.getValue(i, "sala") + "",
                                dataset.getValue(i, "nome_motorista"),
                                dataset.getValue(i, "nome_ajudante"),
                                dataset.getValue(i, "dataIni") + "",
                                dataset.getValue(i, "dataFim") + "",
                                dataset.getValue(i, "nomeEvento") + ""
                            ));
                    }
                }
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();
        }

        if (listaConstraits['endpoint'] == 'visitas') {
            newDataset.addColumn('cidade');
            newDataset.addColumn('idCidade');
            newDataset.addColumn('local');
            // newDataset.addColumn('data');


            newDataset.addColumn('latitude');
            newDataset.addColumn('longitude');



            if (listaConstraits['documentid'] == '') {
                return false;
            }

            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
            connectionWD = dataSourceWD.getConnection();


            var tCidades = getTable('ds_ReservasSalas', 'tabela_cidades');
            var tVisitas = getTable('ds_ReservasSalas', 'tabela_visitas');
            // var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');
            var SQL = " select ";
            SQL += " distinct ";
            SQL += " sc2.nome_cidade, ";
            SQL += " sc.cidade_visita, ";
            SQL += " sc.local_visita ";
            // SQL += " sc.data_visita, ";
            if (listaConstraits['coords'] == 'S') {
                SQL += " ,sc.lat_visita, ";
                SQL += " sc.long_visita ";
            }
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
            SQL += "  and sc.documentid = " + parseInt(listaConstraits['documentid']);

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                var wLat = null;
                var wLong = null;

                if (listaConstraits['coords'] == 'S') {
                    wLat = rsWD.getString("lat_visita")
                    wLong = rsWD.getString("long_visita")
                }

                newDataset.addRow(
                    new Array(
                        rsWD.getString("nome_cidade") + "",
                        rsWD.getString("cidade_visita") + "",
                        rsWD.getString("local_visita") + "",
                        // rsWD.getString("data_visita") + "",
                        wLat + "",
                        wLong + ""
                    ));
            }


            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['e3ndpoint'] == 'parceiros') {
            newDataset.addColumn('cidade');
            newDataset.addColumn('local');
            // newDataset.addColumn('data');
            newDataset.addColumn('nome');
            newDataset.addColumn('telefone');
            newDataset.addColumn('latitude');
            newDataset.addColumn('longitude');


            if (listaConstraits['documentid'] == '') {
                return false;
            }

            var connectionWD = null;
            var statementWD = null;
            var rsWD = null;
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
            connectionWD = dataSourceWD.getConnection();

            var tParceiros = getTable('ds_ReservasSalas', 'tabela_parceiros');
            var SQL = " select ";
            SQL += " distinct ";
            SQL += " sc.nome_parceiro, ";
            SQL += " sc.telefone_parceiro, ";
            SQL += " sc.cidade_uf_parceiro ";
            if (listaConstraits['coords'] == 'S') {
                SQL += " ,sc.lat_parceiro, ";
                SQL += " sc.long_parceiro   ";
            }
            SQL += "FROM " + tParceiros + "  sc  ";
            SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
            SQL += "        and dc.nr_documento = sc.documentid      ";
            SQL += "        and dc.nr_versao = sc.version ";
            SQL += "        and dc.versao_ativa = 1) ";
            SQL += "where 1=1 ";
            SQL += "  and sc.documentid = " + parseInt(listaConstraits['documentid']);
            SQL += "  and sc.local_parceiro = '" + listaConstraits['local'] + "'";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                var wLat = null;
                var wLong = null;

                if (listaConstraits['coords'] == 'S') {
                    wLat = rsWD.getString("lat_parceiro")
                    wLong = rsWD.getString("long_parceiro")
                }

                newDataset.addRow(
                    new Array(
                        rsWD.getString("cidade_uf_parceiro") + "",
                        listaConstraits['local'] + "",
                        rsWD.getString("nome_parceiro") + "",
                        rsWD.getString("telefone_parceiro") + "",
                        wLat + "",
                        wLong + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['endpoint'] == 'mapa') {
            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                connectionWD = dataSourceWD.getConnection();

                wResult = JSON.parse(listaConstraits['wresult']);

                newDataset.addColumn('indRegistro');
                newDataset.addColumn('cidade');
                newDataset.addColumn('uf');
                newDataset.addColumn('cpf');
                newDataset.addColumn('motorista');
                newDataset.addColumn('placa');
                newDataset.addColumn('data');
                newDataset.addColumn('hora');
                newDataset.addColumn('local');
                newDataset.addColumn('parceiro');
                newDataset.addColumn('latitude');
                newDataset.addColumn('longitude');

                if (wResult[0] == true) {
                    var sql = "select cidade, uf, cpfmotorista, motorista, numplaca, data, hora, local, contato, latitude, longitude from kbt_t_registroapp where origen='PM' ";
                    if ((listaConstraits['datainicio'] != '') && (listaConstraits['datafim'] != '')) {
                        sql += "  and data between '" + listaConstraits['datainicio'].split('/').reverse().join('-') + "' and '" + listaConstraits['datafim'].split('/').reverse().join('-') + "'";
                    }
                    if ((listaConstraits['uf'] != '')) {
                        sql += "  and uf = '" + listaConstraits['uf'] + "'";
                    }
                    if ((listaConstraits['cidade'] != '')) {
                        sql += "  and cidade = '" + listaConstraits['cidade'] + "'";
                    }
                    if ((listaConstraits['motorista'] != '') && (listaConstraits['motorista'] != null)) {
                        sql += "  and motorista = '" + listaConstraits['motorista'] + "'";
                    }

                    statementWD = connectionWD.prepareStatement(sql);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        newDataset.addRow(
                            new Array(
                                "PM",
                                rsWD.getString("cidade") + "",
                                rsWD.getString("uf") + "",
                                rsWD.getString("cpfmotorista") + "",
                                rsWD.getString("motorista") + "",
                                rsWD.getString("numplaca") + "",
                                rsWD.getString("data") + "",
                                rsWD.getString("hora") + "",
                                rsWD.getString("local") + "",
                                rsWD.getString("contato") + "",
                                rsWD.getString("latitude") + "",
                                rsWD.getString("longitude") + ""
                            ));
                    }

                    if (rsWD != null) rsWD.close();
                }

                if (wResult[1] == true) {
                    newDataset.addColumn('unidades');
                    newDataset.addColumn('concluidas');
                    newDataset.addColumn('construcao');
                    var sql = "select id, nom_condominio, COALESCE(unidades,0) as unidades, COALESCE(concluidas,0) as concluidas, COALESCE(construcao,0) as construcao, uf, cidade, latitude, longitude from kbt_t_condominios_app where 1=1 ";
                    if ((listaConstraits['uf'] != '')) {
                        sql += "  and uf = '" + listaConstraits['uf'] + "'";
                    }
                    if ((listaConstraits['cidade'] != '')) {
                        sql += "  and cidade = '" + listaConstraits['cidade'] + "'";
                    }
                    statementWD = connectionWD.prepareStatement(sql);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        newDataset.addRow(
                            new Array(
                                "CD",
                                rsWD.getString("cidade") + "",
                                rsWD.getString("uf") + "",
                                "",
                                "",
                                "",
                                "",
                                "",
                                rsWD.getString("nom_condominio") + "",
                                "",
                                rsWD.getString("latitude") + "",
                                rsWD.getString("longitude") + "",
                                rsWD.getString("unidades") + "",
                                rsWD.getString("concluidas") + "",
                                rsWD.getString("construcao") + ""
                            ));
                    }
                }

                if (wResult[2] == true) {
                    var wCoordenadas = f_getRastreador(newDataset);
                    if (wCoordenadas != null) {
                        for (var i = 0; i < wCoordenadas.length; i++) {
                            newDataset.addRow(
                                new Array(
                                    "CT",
                                    "",
                                    "",
                                    "",
                                    wCoordenadas[i].pos_nome_motorista + "",
                                    wCoordenadas[i].pos_placa + "",
                                    wCoordenadas[i].pos_data_hora_receb + "",
                                    "",
                                    wCoordenadas[i].pos_ignicao + "",
                                    wCoordenadas[i].pos_velocidade + "",
                                    wCoordenadas[i].pos_latitude + "",
                                    wCoordenadas[i].pos_longitude + ""
                                ));
                        }

                    }
                }




            } catch (error) {
                printLog("erro", "Error SQL: " + error.toString());
                newDataset.addRow(new Array(error.toString()));
            }
        }


    } catch (error) {
        log.info("Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString()));

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
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


function f_getRastreador(newDataset) {

    var retorno = null;
    var params;

    var endpoint = "/api/positions/all"; // endPoint pra buscar o Token

    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "sigasul",
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

        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return retorno;


}