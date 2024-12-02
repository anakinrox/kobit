var debug = false;
function defineStructure() {
    // addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Log START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        var listaConstraits = {};

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        // listaConstraits['dataset'] = "dsk_velis_pedidos";
        // listaConstraits['chave1'] = "03";
        // listaConstraits['chave2'] = "21";
        // listaConstraits['log'] = "Erro ao importar Pedido 21";
        f_gravaLog(listaConstraits['dataset'], listaConstraits['chave1'], listaConstraits['chave2'], listaConstraits['chave3'], listaConstraits['log'], newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

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

function f_gravaLog(pNomeDataset, pChave1, pChave2, pChave3, pLog, newDataset) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var wNumSeqID = 1;
        var wCheck = false;

        var SQL = " SELECT 1 FROM KBT_T_LOG_INTEGRACAO_VELIS WHERE dataset = '" + pNomeDataset + "' ";

        if (pChave1 != undefined && pChave1 != '') {
            SQL += "  and chave1 = '" + pChave1 + "'";
        }

        if (pChave2 != undefined && pChave2 != '') {
            SQL += "  and chave2 = '" + pChave2 + "'";
        }
        if (pChave3 != undefined && pChave3 != '') {
            SQL += "  and chave3 = '" + pChave3 + "'";
        }



        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wCheck = true;
        }

        if (!wCheck) {

            var SQL = " SELECT KBT_SEQ_INTEGRACAO_LOG.nextval S FROM dual";
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                wNumSeqID = rsWD.getString("s");
            }


            var SQL = " insert into KBT_T_LOG_INTEGRACAO_VELIS (id, dataset, chave1, chave2, chave3, data, log, situacao) values "
            SQL += " (" + wNumSeqID + ",'" + pNomeDataset + "','" + (pChave1 == undefined ? null : pChave1) + "','" + (pChave2 == undefined ? null : pChave2) + "','" + (pChave3 == undefined ? null : pChave3) + "', sysdate,'" + pLog + "','P')";
            statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}