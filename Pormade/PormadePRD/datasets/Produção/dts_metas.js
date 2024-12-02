function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    printLog("error", "#### DataSet Metas ####")
    var newDataset = DatasetBuilder.newDataset();

    var listaConstraits = {};
    listaConstraits['ind_acao'] = "";
    listaConstraits['codgestor'] = "";
    listaConstraits['nomeUF'] = "";
    listaConstraits['matricula'] = "";
    listaConstraits['usercrm'] = "";
    listaConstraits['metaporta'] = "";
    listaConstraits['metarodape'] = "";
    listaConstraits['metaferragem'] = "";
    listaConstraits['metaportaloja'] = "";
    listaConstraits['metaferragemloja'] = "";
    listaConstraits['dat_ini_vigencia'] = "";
    listaConstraits['dat_fim_vigencia'] = "";
    listaConstraits['user_registro'] = "";
    listaConstraits['tipoCadastro'] = "";
    listaConstraits['indVendedor'] = "";




    var params = {};

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
        }
    }


    if (listaConstraits['ind_acao'] == '') {
        listaConstraits['ind_acao'] = 'V';
    }

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        var connectionWD = dataSourceWD.getConnection();

        if (listaConstraits['ind_acao'] == 'V') {

            //Define colunas de retorno.
            newDataset.addColumn('CODREGISTRO');
            newDataset.addColumn('DESCRICAO');

            var hoje = new Date();
            var SQL = "select * from kbt_t_tipovendedores";

            printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(
                    new Array(
                        rsWD.getString("codregistro") + "",
                        rsWD.getString("descricao") + ""
                    ));
            }
        }

        if (listaConstraits['ind_acao'] == 'C') {

            //Define colunas de retorno.
            newDataset.addColumn('MATRICULA');
            newDataset.addColumn('USERCRM');
            newDataset.addColumn('UF');
            newDataset.addColumn('GESTOR');
            newDataset.addColumn('USUARIO');
            newDataset.addColumn('TIPO_CADASTRO');
            newDataset.addColumn('NOME_TIPO_CADASTRO');
            newDataset.addColumn('META_PORTA');
            newDataset.addColumn('META_RODAPE');
            newDataset.addColumn('META_FERRAGEM');
            newDataset.addColumn('META_PORTA_LOJA');
            newDataset.addColumn('META_FERRAGEM_PORTA');
            newDataset.addColumn('DAT_VIGENCIA_INI');
            newDataset.addColumn('DAT_VIGENCIA_FIM');

            var hoje = new Date();
            var SQL = "select * from kbt_t_metas m ";
            SQL += " left join kbt_t_tipovendedores v on (v.codregistro = m.indVendedor) ";
            SQL += " where m.versao_ativa  = 'S' ";

            if (listaConstraits['matricula'].trim() != "") {
                SQL += " and m.matricula = '" + listaConstraits['matricula'] + "'";
            }

            if (listaConstraits['codgestor'].trim() != "") {
                SQL += " and m.cod_gestor = '" + listaConstraits['codgestor'] + "'";
            }

            if (listaConstraits['nomeUF'].trim() != "") {
                SQL += " and m.uf  = '" + listaConstraits['nomeUF'] + "'";
            }

            if (listaConstraits['tipoCadastro'].trim() != "") {
                SQL += " and m.indVendedor  = " + listaConstraits['tipoCadastro'];
            }


            printLog("info", "Comando SQL Select: " + SQL)
            var statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wNomuUsuario;
                var wuGestorVenda;
                var wNomuGestorVenda;
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('matricula', rsWD.getString("matricula"), rsWD.getString("matricula"), ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("usuario_comercial", null, constraints, null);
                if (dataset != null && dataset.rowsCount > 0) {
                    for (i = 0; i < dataset.rowsCount; i++) {
                        wNomuUsuario = dataset.getValue(i, "nome_usuario");
                        wNomuGestorVenda = dataset.getValue(i, "nome_gestor_venda");
                        wuGestorVenda = dataset.getValue(i, "gestor_venda");
                    }
                }

                if (rsWD.getString("cod_gestor") != wuGestorVenda) {
                    var SQL = "UPDATE kbt_t_metas SET cod_gestor = '" + wuGestorVenda + "' where matricula = '" + rsWD.getString("matricula") + "' and versao_ativa = 'S'";
                    printLog("info", "Comando SQL: " + SQL);
                    try {
                        var statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();
                    } catch (error) {
                    }
                }


                newDataset.addRow(
                    new Array(
                        rsWD.getString("matricula") + "",
                        rsWD.getString("user_crm") + "",
                        rsWD.getString("uf") + "",
                        wNomuGestorVenda + "",
                        wNomuUsuario + "",
                        rsWD.getString("codregistro") + "",
                        rsWD.getString("descricao") + "",
                        rsWD.getString("meta_porta") + "",
                        rsWD.getString("meta_rodape") + "",
                        rsWD.getString("meta_ferragem") + "",
                        rsWD.getString("meta_porta_loja") + "",
                        rsWD.getString("meta_ferragem_loja") + "",
                        rsWD.getString("dat_ini_vigencia") + "",
                        rsWD.getString("dat_fim_vigencia") + ""
                    ));
            }
        }

        if (listaConstraits['ind_acao'] == 'R') {

            newDataset.addColumn('STATUS');
            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            var SQL = "UPDATE kbt_t_metas SET versao_ativa = 'N', dat_fim_vigencia = CURRENT_DATE,  dat_registro = CURRENT_DATE, user_registro = '" + listaConstraits['user_registro'] + "' where matricula = '" + listaConstraits['matricula'] + "' and versao_ativa = 'S'";
            printLog("info", "Comando SQL: " + SQL);
            try {
                var statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();

                newDataset.addRow(
                    new Array(
                        "OK"
                    ));
            } catch (error) {
                newDataset.addRow(
                    new Array(
                        "NOK"
                    ));
            }

        }

        if (listaConstraits['ind_acao'] == 'I') {
            newDataset.addColumn('STATUS');

            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            var userCRM = listaConstraits['usercrm'];
            var matricula = listaConstraits['matricula'];
            var metaPorta = listaConstraits['metaporta'];
            var metaRodape = listaConstraits['metarodape'];
            var metaFerragem = listaConstraits['metaferragem'];
            var metaPortaLoja = listaConstraits['metaportaloja'];
            var metaFerragemLoja = listaConstraits['metaferragemloja'];
            var dat_ini_vigencia = listaConstraits['dat_ini_vigencia'];
            var dat_fim_vigencia = listaConstraits['dat_fim_vigencia'];
            var user_registro = listaConstraits['user_registro'];
            var cod_gestor = listaConstraits['codgestor'];
            var nomeUF = listaConstraits['nomeUF'];
            var indVendedor = listaConstraits['indVendedor'];


            var SQL = "UPDATE kbt_t_metas SET versao_ativa = 'N', dat_registro = CURRENT_DATE, user_registro = '" + user_registro + "' where matricula = '" + matricula + "' and versao_ativa = 'S'";
            var statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();
            printLog("info", "Comando SQL: " + SQL);

            var SQL = "insert into kbt_t_metas (matricula, user_crm, meta_porta, meta_rodape, meta_ferragem, meta_porta_loja, meta_ferragem_loja, dat_ini_vigencia, dat_fim_vigencia, num_versao, versao_ativa, dat_registro, user_registro, cod_gestor, uf, indvendedor) values ";
            SQL += " ('" + matricula + "'," + userCRM + "," + metaPorta + "," + metaRodape + ", " + metaFerragem + "," + metaPortaLoja + "," + metaFerragemLoja + ", " + frmDataSQL(dat_ini_vigencia) + ", " + frmDataSQL(dat_fim_vigencia) + ",";
            SQL += "(select coalesce( (max(num_versao) +1),1) from kbt_t_metas where matricula = '" + matricula + "'),'S', " + dataAtualFormatada() + ", '" + user_registro + "', '" + cod_gestor + "', '" + nomeUF + "', " + indVendedor + ")";


            try {
                var statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();
                newDataset.addRow(
                    new Array(
                        "OK"
                    ));
            } catch (error) {

                newDataset.addRow(
                    new Array(
                        "NOK"
                    ));
            }
            printLog("info", "Comando SQL: " + SQL)
        }

    } catch (error) {
        printLog('error', error.toString());
        newDataset.addColumn('STATUS');
        newDataset.addRow(new Array("Erro ao DataSet: " + error.toString()));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
    return newDataset;
}

function onMobileSync(user) {

}

function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}

function frmDataSQL(data) {
    // log.info('frmDataSQL........' + data)
    var valor = isnull(data, "");
    if (valor == null || valor == undefined || valor == "null" || valor == "") {
        return null;
    } else {
        return "'" + valor + "'";
    }
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return "'" + anoF + "-" + mesF + "-" + diaF + "'";
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