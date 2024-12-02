var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Atualizacoes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Atualizacoes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        // newDataset.addRow(new Array('Vai Atualizar: '));
        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset) {
    try {

        var rsWD = null;
        var connectionWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var wRepres = [];

        var SQL = "select distinct c.cadastro ";
        SQL += "from caj_velis_integracao c  ";
        SQL += "    inner join clientes  cli on(cli.cod_cliente = c.cliente)  ";
        SQL += "                                   and cli.cod_tip_cli not in ('98', '99') ";
        SQL += "                                   and cli.ies_situacao in ('A', 'S','C') ";
        SQL += " where c.sincronizado = 'N' ";
        SQL += "  and c.status is null  ";
        SQL += "  and (cli.ies_situacao not in 'P'  or cli.ies_situacao is null) ";
        SQL += "  and c.cadastro in ('cliente','limite') ";


        // newDataset.addRow(new Array(' SQL: ' + SQL));
        // newDataset.addRow(new Array('Executando a Query Cientes: '));
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            if (rsWD.getString("cadastro").trim() == 'cliente') {
                newDataset.addRow(new Array('Enviado Clientes '));

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('atualizacao', 'S', 'S', ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_clientes", null, constraints, null);
                // newDataset.addRow(new Array('dataset: ' + dataset));
                if (dataset != null) {
                }

                // break;
            }

            if (rsWD.getString("cadastro").trim() == 'limite') {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('atualizacao', 'S', 'S', ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_clientes_limite", null, constraints, null);
                // newDataset.addRow(new Array('dataset: ' + dataset));
                if (dataset != null) {
                    for (var i = 0; i < dataset.rowsCount; i++) {
                        if (dataset.getValue(i, "retorno") == true) {
                            var wClientes = JSON.parse(dataset.getValue(i, "mensagem"));

                            for (var x = 0; x < wClientes.length; x++) {
                                f_atualizaRegistro(rsWD.getString("cadastro"), wClientes[x].idErp, '0', true, '', newDataset);
                                // newDataset.addRow(new Array('Cliente: ' + wClientes[x].idErp));
                            }
                        }
                    }
                }
            }

        }

        if (rsWD != null) rsWD.close();

        // newDataset.addRow(new Array('Executando a Query Integracao: '));
        var SQL = "select c.cadastro, s.tipo, c.cliente, c.representante, c.data_inclusao ";
        SQL += "from caj_velis_integracao c  ";
        SQL += "    inner join caj_velis_integracao_sequencia s on(trim(s.tipo) = trim(c.cadastro)) ";
        SQL += "    left join clientes  cli on(cli.cod_cliente = c.cliente)  ";
        SQL += "where c.sincronizado = 'N' ";
        SQL += "  and c.status is null  ";
        SQL += "  and (cli.ies_situacao <> 'P'  or cli.ies_situacao is null) ";
        SQL += "  and c.cadastro not in ('cliente','limite') ";
        // SQL += "  and c.cliente = '777002873000000121' ";
        SQL += "order by ";
        SQL += "s.ordem, c.data_inclusao asc ";

        // newDataset.addRow(new Array(' SQL: ' + SQL));
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        // newDataset.addRow(new Array('Trouxe os dados Integracao: '));
        while (rsWD.next()) {

            if (rsWD.getString("cadastro").trim() == 'usuario') {
                newDataset.addRow(new Array('rep: ' + rsWD.getString("representante").trim()));

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('representante', rsWD.getString("representante").trim(), rsWD.getString("representante").trim(), ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_usuarios", null, constraints, null);

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('representante', rsWD.getString("representante").trim(), rsWD.getString("representante").trim(), ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('cliente', '', '', ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_portifolio", null, constraints, null);

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('representante', rsWD.getString("representante").trim(), rsWD.getString("representante").trim(), ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_tabela_preco_repres", null, constraints, null);

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('representante', rsWD.getString("representante").trim(), rsWD.getString("representante").trim(), ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_visitas", null, constraints, null);

                f_atualizaRegistro(rsWD.getString("cadastro"), rsWD.getString("cliente"), rsWD.getString("representante"), true, '', newDataset);
            }

            if (rsWD.getString("cadastro").trim() == 'portifolio') {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('representante', rsWD.getString("representante").trim(), rsWD.getString("representante").trim(), ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('cliente', rsWD.getString("cliente").trim(), rsWD.getString("cliente").trim(), ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("dsk_velis_portifolio", null, constraints, null);

                f_atualizaRegistro(rsWD.getString("cadastro"), rsWD.getString("cliente"), rsWD.getString("representante"), true, '', newDataset);
            }

            // if (rsWD.getString("cadastro").trim() == 'limite') {
            //     // newDataset.addRow(new Array("Rotando Limiti "));
            //     var constraints = new Array();
            //     constraints.push(DatasetFactory.createConstraint('cliente', rsWD.getString("cliente"), rsWD.getString("cliente"), ConstraintType.MUST));
            //     var dataset = DatasetFactory.getDataset("dsk_velis_clientes_limite", null, constraints, null);

            //     f_atualizaRegistro(rsWD.getString("cadastro"), rsWD.getString("cliente"), rsWD.getString("representante"), true, '', newDataset);
            // }
        }

        newDataset.addRow(new Array("Rotina concluida "));

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
        f_atualizaRegistro(rsWD.getString("cadastro"), rsWD.getString("cliente"), rsWD.getString("representante"), false, error, newDataset);
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}



function onMobileSync(user) {

}

function f_atualizaRegistro(pCadastro, pCodCliente, pCodRepres, pStatus, pMensagem, pDataset) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        if (pStatus) {
            var SQL = "delete from caj_velis_integracao where cadastro = '" + pCadastro.trim() + "' and representante = '" + pCodRepres.trim() + "' ";
            if (pCodCliente.trim() != '') { SQL += " and cliente = '" + pCodCliente + "'"; }
        }

        if (!pStatus) {
            var SQL = "update caj_velis_integracao set status = 'ERR', retornoapi = '" + pMensagem + "' where cadastro = '" + pCadastro.trim() + "' and representante = '" + pCodRepres.trim() + "' ";
            if (pCodCliente.trim() != '') { SQL += " and cliente = '" + pCodCliente + "'"; }
        }


        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.executeUpdate();
    } catch (error) {
        pDataset.addRow(new Array("Erro SQL: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getRepresentante(pCodCliente, pDataset) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var wRetorno = null;

        var SQL = "select cod_nivel_3 from cli_canal_venda where cod_cliente = '" + pCodCliente + "' and COD_TIP_CARTEIRA = '01'";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wRetorno = rsWD.getString("cod_nivel_3");
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro SQL: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return wRetorno;
    }
}

function f_atualizaCliente(pCodEmpresa, pCodCliente, pIDVelis, pDataset) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var rsWD = null;
        var wAchou = false;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select idvelis from caj_velis_clientes where cod_cliente = '" + pCodCliente.trim() + "' and empresa = '" + pCodEmpresa.trim() + "' ";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            if (parseInt(rsWD.getString("idvelis")) == parseInt(pIDVelis)) {
                wAchou = true;
                break;
            }
        }

        if (wAchou == false) {
            var sqlINS = "insert into caj_velis_clientes (cod_cliente, idvelis, empresa) values ('" + pCodCliente.trim() + "'," + pIDVelis + ",'" + pCodEmpresa.trim() + "')";
            statementWD = connectionWD.prepareStatement(sqlINS);
            statementWD.executeUpdate();
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro Atu: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
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

