function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['indacao'] = '';

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }

    if (listaConstraits['indacao'] == '') {
        listaConstraits['indacao'] = 'PEND';
        listaConstraits['dataset'] = 'dsk_velis_tributacao';
        listaConstraits['status'] = 'PA';


    }


    try {
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup('java:/jdbc/LogixDS');
        connectionWD = dataSourceWD.getConnection();

        if (listaConstraits['indacao'] == 'AGENDAMENTO') {
            newDataset.addColumn('descricao');
            newDataset.addColumn('dataset');
            newDataset.addColumn('intervalo');
            newDataset.addColumn('ultimo');
            newDataset.addColumn('proximo');
            newDataset.addColumn('status');
            newDataset.addColumn('permissao');
            newDataset.addColumn('log');
            newDataset.addColumn('tempo');

            var SQL = "SELECT a.descricao, a.dataset, a.intervalo, a.unidade, to_char(a.ultimo, 'yyyy/mm/dd hh24:mi:ss') as ultimo, a.status, a.permissao, tempo FROM KBT_T_AGENDAMENTO_VELIS a";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                var wLog = null;
                var SQL2 = "select 1 from KBT_T_LOG_INTEGRACAO_VELIS where dataset = '" + rsWD.getString('dataset') + "' and situacao = 'P'";
                statementWD = connectionWD.prepareStatement(SQL2);
                var rsWD2 = statementWD.executeQuery();

                while (rsWD2.next()) {
                    wLog = 1;
                }

                var wIntervalor = ''

                if (rsWD.getString('unidade') == 'D') { wIntervalor = rsWD.getString('intervalo') + ' Dia(s)'; }
                if (rsWD.getString('unidade') == 'H') { wIntervalor = rsWD.getString('intervalo') + ' Hora(s)'; }
                if (rsWD.getString('unidade') == 'M') { wIntervalor = rsWD.getString('intervalo') + ' Minuto(s)'; }

                var segundos = (rsWD.getString('tempo') / 1000) / 60;

                newDataset.addRow(new Array(
                    rsWD.getString('descricao') + "",
                    rsWD.getString('dataset') + "",
                    wIntervalor + "",
                    rsWD.getString('ultimo'),
                    f_proximoDispara(rsWD.getString('ultimo'), rsWD.getString('intervalo'), rsWD.getString('unidade'), newDataset) + "",
                    rsWD.getString('status'),
                    rsWD.getString('permissao'),
                    wLog,
                    segundos
                ));

            }


        }

        if (listaConstraits['indacao'] == 'ERROS') {
            newDataset.addColumn('id');
            newDataset.addColumn('data');
            newDataset.addColumn('log');

            var SQL = "SELECT id, to_char(data, 'dd/mm/yyyy hh24:mi') as data, log FROM KBT_T_LOG_INTEGRACAO_VELIS WHERE DATASET = '" + listaConstraits['dataset'] + "'";
            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                newDataset.addRow(new Array(
                    rsWD.getString('id') + "",
                    rsWD.getString('data') + "",
                    rsWD.getString('log')
                ));

            }


        }

        if (listaConstraits['indacao'] == 'LIMPA') {
            newDataset.addColumn('retorno');
            var wAchou = false;

            var SQL = "delete from KBT_T_LOG_INTEGRACAO_VELIS where id = " + listaConstraits['id'];
            statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();


            var SQL = "SELECT 1 FROM KBT_T_LOG_INTEGRACAO_VELIS where dataset = '" + listaConstraits['dataset'] + "'";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                wAchou = true;
            }

            if (!wAchou) {
                var SQL = "update KBT_T_AGENDAMENTO_VELIS set status = 'C' where dataset = '" + listaConstraits['dataset'] + "'";
                newDataset.addRow(new Array('SQL: ' + SQL));


                statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();
            }

            newDataset.addRow(new Array(true));


        }

        if (listaConstraits['indacao'] == 'PLAYPAUSE') {
            newDataset.addColumn('retorno');
            var wStatus;

            if (listaConstraits['status'] == 'PA') {
                wStatus = 'P';
            }
            if (listaConstraits['status'] == 'PL') {
                wStatus = 'C';
            }



            var SQL = "update KBT_T_AGENDAMENTO_VELIS set status = '" + wStatus + "' where dataset = '" + listaConstraits['dataset'] + "'";
            statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();


            newDataset.addRow(new Array(true));


        }

        if (listaConstraits['indacao'] == 'EXEC') {
            newDataset.addColumn('retorno');
            var wAchou = false;

            var SQL = "SELECT 1 FROM KBT_T_AGENDAMENTO_VELIS where dataset = '" + listaConstraits['dataset'] + "' and status = 'E'";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                wAchou = true;
            }



            newDataset.addRow(new Array(wAchou));


        }

        if (listaConstraits['indacao'] == 'PEND') {
            newDataset.addColumn('cadastro');
            newDataset.addColumn('mensagem');
            newDataset.addColumn('vendedor');
            newDataset.addColumn('cliente');
            newDataset.addColumn('dat_inclusao');
            newDataset.addColumn('status');
            newDataset.addColumn('retorno');

            var SQL = "select cadastro, mensagem_integracao, cod_vendedor, vendedor, cliente, nom_cliente, to_char(data_inclusao, 'dd/mm/yyyy') as data_inclusao, status, retornoapi from cj_v_velis_pendencias_atualizacao";
            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();

            while (rsWD.next()) {
                newDataset.addRow(new Array(
                    rsWD.getString('cadastro') + "",
                    rsWD.getString('mensagem_integracao') + "",
                    rsWD.getString('vendedor') + "",
                    rsWD.getString('nom_cliente') + "",
                    rsWD.getString('data_inclusao') + "",
                    rsWD.getString('status') + "",
                    rsWD.getString('retornoapi')
                ));

            }


        }

    } catch (error) {

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return newDataset;
    }
}

function onMobileSync(user) {

}

function f_proximoDispara(pData, indAdicao, unidade, newDataset) {
    var wRetorno = "";
    // alert("1 - " + data);
    try {
        if (pData != "" && pData != null) {
            var dtRegistro = new Date(pData);
            // wRetorno = dtRegistro;

            // alert("2 - " + dtRegistro);

            if (unidade == "D") {
                var ldata = dtRegistro.getDate() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setDate(ldata));
                // alert(wRetorno);
            }

            if (unidade == "H") {
                var ldata = dtRegistro.getHours() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setHours(ldata));
            }

            if (unidade == "M") {
                var ldata = dtRegistro.getUTCMinutes() + parseInt(indAdicao);
                wRetorno = new Date(dtRegistro.setUTCMinutes(ldata));
            }
        }
    } catch (error) {
        newDataset.addRow(new Array('Deu Erro: ' + error));
    }

    return wRetorno;
}