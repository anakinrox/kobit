var debug = false;
function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = ""; 7

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'APONTAR';
            listaConstraits['codempresa'] = '02';
            listaConstraits['numordem'] = '320';

            listaConstraits['json'] = '{"codEmpresa":"02","numDocumento":"320","codItem":"","codOperador":"959","dataIni":"2022-11-03","HoraIni":"09:52","DataFim":"2022-11-03","HoraFim":"09:52","ordens":[{"numOrdem":"4730265","codOperacao":"410","codCentroCusto":"320"}]}';
        }


        if (listaConstraits['indacao'] == 'EMPRESA') {
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
            var connectionWD = dataSourceWD.getConnection();
            var codListaflexy = '';


            //Define colunas de retorno.
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');

            var SQL = "select cod_empresa, den_empresa from empresa";

            // printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(
                    new Array(
                        rsWD.getString("cod_empresa") + "",
                        rsWD.getString("den_empresa") + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['indacao'] == 'TITEM') {
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
            var connectionWD = dataSourceWD.getConnection();
            var codListaflexy = '';


            //Define colunas de retorno.
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');

            var SQL = "select cod_item, den_item from item WHERE cod_empresa = '" + listaConstraits['codempresa'] + "' and ies_tip_item in ('F','P')  and ies_situacao = 'A'";

            // printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(
                    new Array(
                        rsWD.getString("cod_item") + "",
                        rsWD.getString("den_item") + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['indacao'] == 'OPERADOR') {
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
            var connectionWD = dataSourceWD.getConnection();
            var codListaflexy = '';


            //Define colunas de retorno.
            newDataset.addColumn('codigo');
            newDataset.addColumn('nome');

            var SQL = "select cod_profis,  nom_profis from tx_profissional WHERE cod_empresa = '" + listaConstraits['codempresa'] + "'";

            // printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(
                    new Array(
                        rsWD.getString("cod_profis") + "",
                        rsWD.getString("nom_profis") + ""
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }


        if (listaConstraits['indacao'] == 'ORDENS') {
            var contextWD = new javax.naming.InitialContext();
            var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
            var connectionWD = dataSourceWD.getConnection();
            var codListaflexy = '';


            //Define colunas de retorno.
            newDataset.addColumn('codigo');
            newDataset.addColumn('item');
            newDataset.addColumn('ordem');
            newDataset.addColumn('coditemreq');
            newDataset.addColumn('itemreq');
            newDataset.addColumn('codoper');
            newDataset.addColumn('operacao');
            newDataset.addColumn('centrocusto');
            newDataset.addColumn('qtdplanejado');
            newDataset.addColumn('qtdboas');

            var SQL = "select distinct eis_v_ordem_oper.cod_item, eis_v_ordem_oper.den_item, eis_v_ordem_oper.num_ordem, eis_v_ordem_oper.cod_item_req, eis_v_ordem_oper.den_item_req, ";
            SQL += "eis_v_ordem_oper.cod_operac, eis_v_ordem_oper.den_operac, eis_v_ordem_oper.qtd_planej, eis_v_ordem_oper.qtd_boas, cod_cent_cust from eis_v_ordem_oper ";
            SQL += "where eis_v_ordem_oper.cod_empresa = '" + listaConstraits['codempresa'] + "' and eis_v_ordem_oper.num_docum = '" + listaConstraits['numordem'] + "'";
            SQL += " and eis_v_ordem_oper.ies_saldo IN( 'S' ) and eis_v_ordem_oper.ies_situa IN( '4' ) and eis_v_ordem_oper.ies_oper_final = 'S'";

            if (listaConstraits['coditempai'] != undefined && listaConstraits['coditempai'] != '') {
                SQL += " and num_ordem in(select num_ordem from eis_v_estrututa_n10_proj eis_v_estrututa_n10_proj ";
                SQL += "    where (eis_v_estrututa_n10_proj.cod_empresa IN( '" + listaConstraits['codempresa'] + "' ) ";
                SQL += "      and eis_v_estrututa_n10_proj.cod_item_pai IN( '" + listaConstraits['coditempai'] + "' ) ";
                SQL += "      and eis_v_estrututa_n10_proj.num_docum IN( '" + listaConstraits['numordem'] + "' ) ";
                SQL += "      and eis_v_estrututa_n10_proj.ies_situa NOT IN( '9' )) ";
                SQL += "      and eis_v_estrututa_n10_proj.qtd_boas = 0 ";
                SQL += "      and num_ordem not in (select ordem_producao from  eis_v_apon_coletor eis_v_apon_coletor where eis_v_apon_coletor.situacao IN( 'E' ) and final_oper = 'S' and num_docum in( '" + listaConstraits['numordem'] + "'))";
                SQL += ")";
            } else {
                SQL += "and num_ordem not in (select DISTINCT ordem_producao from  eis_v_apon_coletor eis_v_apon_coletor where eis_v_apon_coletor.situacao IN( 'E' ) and final_oper = 'S' and num_docum in( '" + listaConstraits['numordem'] + "')) "
            }

            // printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                newDataset.addRow(
                    new Array(
                        rsWD.getString("cod_item") + "",
                        rsWD.getString("den_item") + "",
                        rsWD.getString("num_ordem") + "",
                        rsWD.getString("cod_item_req") + "",
                        rsWD.getString("den_item_req") + "",
                        rsWD.getString("cod_operac") + "",
                        rsWD.getString("den_operac") + "",
                        rsWD.getString("cod_cent_cust") + "",
                        parseFloat(rsWD.getString("qtd_planej")),
                        parseFloat(rsWD.getString("qtd_boas"))
                    ));
            }

            if (rsWD != null) rsWD.close();
            if (statementWD != null) statementWD.close();
            if (connectionWD != null) connectionWD.close();

        }

        if (listaConstraits['indacao'] == 'APONTAR') {
            try {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
                var connectionWD = dataSourceWD.getConnection();

                newDataset.addColumn('STATUS');
                newDataset.addColumn('MENSAGEM');
                var wStatus = 'OK';
                var wMensagem = '';

                var jsonObj = JSON.parse(listaConstraits['json']);
                var length = Object.keys(jsonObj['ordens']).length;

                for (var i = 0; i < length; i++) {
                    var wRegistro = false;

                    var SQL = "select 1 from MAN_APONT_1111 where empresa = '" + jsonObj['codEmpresa'] + "' and ordem_producao = " + jsonObj['ordens'][i].numOrdem + " and operacao = " + jsonObj['ordens'][i].codOperacao + " and situacao = 'P' ";
                    var statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wRegistro = true;
                    }

                    wMensagem = wRegistro;

                    if (wRegistro == false) {
                        var sqlUPD = "insert into MAN_APONT_1111 (empresa, ordem_producao, operacao, cracha_funcio, final_oper, centro_trabalho, data_inicio, hora_inicio, data_fim, hora_fim, situacao, observacao, transacao) values ";
                        sqlUPD += "('" + jsonObj['codEmpresa'] + "'," + jsonObj['ordens'][i].numOrdem + ", " + jsonObj['ordens'][i].codOperacao + ", " + jsonObj['codOperador'] + ", 'S'," + jsonObj['ordens'][i].codCentroCusto;
                        sqlUPD += ", '" + jsonObj['dataIni'] + "', '" + jsonObj['HoraIni'] + ":00'" + ", '" + jsonObj['DataFim'] + "', '" + jsonObj['HoraFim'] + ":00', 'P', 'APONTAMENTO FLUIG " + jsonObj['numDocumento'] + "', 0) "
                        var statementWD = connectionWD.prepareStatement(sqlUPD);
                        statementWD.executeUpdate();
                    }
                }

            } catch (error) {
                wStatus = 'ERRO';
                wMensagem = "Não foi executar a ação, [ " + error + " ]";
            } finally {
                newDataset.addRow(
                    new Array(
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