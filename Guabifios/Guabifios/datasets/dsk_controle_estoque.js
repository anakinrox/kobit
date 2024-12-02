function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

    try {

        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();

        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = "consulta"
            listaConstraits['cargo'] = "rep"
            listaConstraits['coditem'] = "1143"
        }


        if (listaConstraits['indacao'] == "consulta") {
            var statementWD = null;
            var rsWD = null;
            newDataset.addColumn('empresa');
            newDataset.addColumn('item');
            newDataset.addColumn('descricao');
            newDataset.addColumn('aen1');
            newDataset.addColumn('aen2');
            newDataset.addColumn('aen3');
            newDataset.addColumn('aen4');
            newDataset.addColumn('qtde_disponivel');
            newDataset.addColumn('qtde_liberado');
            newDataset.addColumn('estoque_matriz');
            newDataset.addColumn('estoque_filial');


            var SQL = "select ";
            SQL += "     it.cod_empresa, ";
            SQL += "     it.cod_item, ";
            SQL += "     it.den_item, ";
            SQL += "     eis_f_get_aen(it.cod_lin_prod) as aen_n1,";
            SQL += "     eis_f_get_aen(it.cod_lin_prod, it.cod_lin_recei) as aen_n2,";
            SQL += "     eis_f_get_aen(it.cod_lin_prod, it.cod_lin_recei, it.cod_seg_merc) as aen_n3,";
            SQL += "     eis_f_get_aen(it.cod_lin_prod, it.cod_lin_recei, it.cod_seg_merc, it.cod_cla_uso) as aen_n4,";
            SQL += "     sum(el.qtd_saldo) as qtd_saldo, ";
            SQL += "     nvl(sum(kitem.qtd_max_disponivel), 0) as qtd_max_disponivel_item, ";
            SQL += "     decode(it.cod_empresa, '01', sum(el.qtd_saldo), 0) as estoque_matriz, ";
            SQL += "     decode(it.cod_empresa, '01', 0, sum(el.qtd_saldo)) as estoque_filial     ";
            SQL += " from item it  ";
            SQL += " join estoque_lote el on(it.cod_empresa = el.cod_empresa  ";
            SQL += "                 and it.cod_item = el.cod_item)  ";
            SQL += " left join kbt_t_item kitem on(kitem.cod_empresa = el.cod_empresa  ";
            SQL += "                             and kitem.cod_item = el.cod_item)  ";
            SQL += " where it.ies_situacao = 'A' and el.ies_situa_qtd = 'L'  ";
            SQL += " and el.num_lote <> 'QUEBRA'  ";
            SQL += " and el.cod_local = 'G'  ";
            SQL += " group by ";
            SQL += "     it.cod_empresa, ";
            SQL += "     it.cod_item, ";
            SQL += "     it.den_item, ";
            SQL += "     it.cod_lin_prod, ";
            SQL += "     it.cod_lin_recei, ";
            SQL += "     it.cod_seg_merc, ";
            SQL += "     it.cod_cla_uso ";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {


                var wQtde_disponivel = parseInt(rsWD.getString("qtd_max_disponivel_item"));
                var wQtde_Matriz = parseInt(rsWD.getString("estoque_matriz"));
                var wQtde_Filial = parseInt(rsWD.getString("estoque_filial"));

                if (listaConstraits['cargo'] == 'rep') {

                }

                newDataset.addRow(new Array(
                    rsWD.getString("cod_empresa") + "",
                    rsWD.getString("cod_item") + "",
                    rsWD.getString("den_item") + "",
                    rsWD.getString("aen_n1") + "",
                    rsWD.getString("aen_n2") + "",
                    rsWD.getString("aen_n3") + "",
                    rsWD.getString("aen_n4") + "",
                    rsWD.getString("qtd_saldo") + "",
                    parseInt(wQtde_disponivel) + "",
                    parseInt(wQtde_Matriz) + "",
                    parseInt(wQtde_Filial) + ""
                ));


            }
        }

        if (listaConstraits['indacao'] == "consulta_lote") {
            var statementWD = null;
            var rsWD = null;
            newDataset.addColumn('item');
            newDataset.addColumn('descricao');
            newDataset.addColumn('lote');
            newDataset.addColumn('lista_estoque');
            newDataset.addColumn('qtde_disponivel');
            newDataset.addColumn('qtde_liberado');
            newDataset.addColumn('estoque_matriz');
            newDataset.addColumn('estoque_filial');
            newDataset.addColumn('obersevacao');


            var SQL = "select  ";
            SQL += "         it.cod_empresa, ";
            SQL += "         it.cod_item, ";
            SQL += "         it.den_item, ";
            SQL += "         el.num_lote, ";
            SQL += "         nvl(qtd_saldo, '0') as qtd_saldo, ";
            SQL += "         nvl(kitem.ies_lista_estoque, 'C') as ies_lista_estoque, ";
            SQL += "         nvl(kitem.qtd_max_disponivel, 0) as qtd_max_disponivel_item, ";
            SQL += "         nvl(kitem.observacao, '') as observacao_item, ";
            SQL += "         decode(el.cod_empresa, '01', el.qtd_saldo, 0) as estoque_matriz, ";
            SQL += "         decode(el.cod_empresa, '01', 0, el.qtd_saldo) as estoque_filial ";
            SQL += " from item it ";
            SQL += " join estoque_lote el on(it.cod_empresa = el.cod_empresa ";
            SQL += "                 and it.cod_item = el.cod_item) ";
            SQL += " left join kbt_t_item kitem on(kitem.cod_empresa = el.cod_empresa ";
            SQL += "                             and kitem.cod_item = el.cod_item) ";
            SQL += " left join kbt_t_item_local_lote  klote on(klote.cod_empresa = el.cod_empresa ";
            SQL += "                                         and klote.cod_item = el.cod_item ";
            SQL += "                                         and klote.cod_local = el.cod_local ";
            SQL += "                                         and klote.num_lote = el.num_lote) ";
            SQL += " where it.ies_situacao = 'A' and el.ies_situa_qtd = 'L' ";
            SQL += " and el.num_lote <> 'QUEBRA' ";
            SQL += " and el.cod_local = 'G' ";
            SQL += " and it.cod_item = '" + listaConstraits['coditem'] + "'";

            statementWD = connectionWD.prepareStatement(SQL);
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {


                var wQtde_disponivel = parseInt(rsWD.getString("qtd_max_disponivel_item"));
                var wQtde_Matriz = parseInt(rsWD.getString("estoque_matriz"));
                var wQtde_Filial = parseInt(rsWD.getString("estoque_filial"));

                if (listaConstraits['cargo'] == 'rep') {

                }

                newDataset.addRow(new Array(
                    rsWD.getString("cod_item") + "",
                    rsWD.getString("den_item") + "",
                    rsWD.getString("num_lote") + "",
                    rsWD.getString("ies_lista_estoque") + "",
                    rsWD.getString("qtd_saldo") + "",
                    parseInt(wQtde_disponivel) + "",
                    parseInt(wQtde_Matriz) + "",
                    parseInt(wQtde_Filial) + "",
                    rsWD.getString("observacao_item") + ""
                ));


            }
        }




    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return newDataset;
    }
}

function onMobileSync(user) {

}