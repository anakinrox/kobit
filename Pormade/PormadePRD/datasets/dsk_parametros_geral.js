var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

    try {
        var newDataset = DatasetBuilder.newDataset();
        var listaConstraits = {};
        listaConstraits['indacao'] = "";
        listaConstraits['email'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        var statementWD = null;
        var connectionWD = null;

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();


        if (listaConstraits['indacao'] == "") {
            listaConstraits['indacao'] = 'US2';
            listaConstraits['tipocadastro'] = '3';
            listaConstraits['nomeparametro'] = 'token_crm';
            listaConstraits['tipodados'] = 'S';
            listaConstraits['valorpadrao'] = 'Go0uiej80fXJtyE7dBEmeICT-ql_cG7YTIDpE7HW';
            listaConstraits['codcategoria'] = '1';
            listaConstraits['codperfil'] = '1';
            listaConstraits['codnivel'] = '1';
            listaConstraits['codparametro'] = '2';
            listaConstraits['valorparametro'] = '222';
            listaConstraits['indtabela'] = 'perfilnivelcategoria';

            
            listaConstraits['codigocadastro'] = '1';
            listaConstraits['nomecadastro'] = 'token_infosimples1';

            listaConstraits['acaobanco'] = 'EDT';
            

            listaConstraits['codtabela'] = '05';
            listaConstraits['chave1'] = '1';
            listaConstraits['chave2'] = '2';
        }


        if (listaConstraits['indacao'] == 'TP') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');
            newDataset.addColumn('situacao');

            var SQL = "select * from kbt_t_tipo_cadastro";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("id") + "",
                    rsWD.getString("descricao") + "",
                    rsWD.getString("indsituacao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }

        if (listaConstraits['indacao'] == 'PA') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('codigotipo');
            newDataset.addColumn('tipocadastro');
            newDataset.addColumn('descricao');
            newDataset.addColumn('codtipodados');
            newDataset.addColumn('tipodados');
            newDataset.addColumn('valorpadrao');
            newDataset.addColumn('situacao');

            var SQL = "select ";
            SQL += "      p.id, " ;
            SQL += "      tp.id as codTipo, ";
            SQL += "      tp.descricao as tipoCadastro, ";
            SQL += "      p.descricao, " ;
            SQL += "      p.tipodados, ";
            SQL += "      p.valorpadrao, ";
            SQL += "      p.indsituacao " ;
            SQL += "   from kbt_t_parametros p " ;
            SQL += "        inner join kbt_t_tipo_cadastro tp on(tp.id = p.codtipocadastro) ";

            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wTipoDados = f_DadosString(rsWD.getString("tipodados").trim());

                newDataset.addRow(new Array(
                    rsWD.getString("id") + "",
                    rsWD.getString("codTipo") + "",
                    rsWD.getString("tipoCadastro") + "",
                    rsWD.getString("descricao") + "",
                    rsWD.getString("tipodados").trim() + "",
                    wTipoDados + "",
                    rsWD.getString("valorpadrao") + "",
                    rsWD.getString("indsituacao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }    
        
        if (listaConstraits['indacao'] == 'CA') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');
            newDataset.addColumn('situacao');

            var SQL = "select * from kbt_t_categorias";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("id") + "",
                    rsWD.getString("descricao") + "",
                    rsWD.getString("indsituacao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        } 
        
        if (listaConstraits['indacao'] == 'CAITEM') {
            newDataset.addColumn('codcategoria');
            newDataset.addColumn('nomcategoria');
            newDataset.addColumn('codparametros');
            newDataset.addColumn('parametro');
            newDataset.addColumn('tipodados');
            newDataset.addColumn('valor');

            var SQL = "select " +
                "   ci.idcategoria, " +
                "   ca.descricao as nomcategoria, " +
                "   ci.idparametro, " +
                "   p.descricao, " +
                "   p.tipodados, " +
                "   ci.valorparametro " +
                "from kbt_t_categoria_item ci " +
                "     inner join kbt_t_parametros p on(p.id = ci.idparametro) " +
                "     inner join kbt_t_categorias ca on(ca.id = ci.idcategoria) " +
                " where ci.idcategoria = " + listaConstraits['codcategoria'];
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wTipoDados = f_DadosString(rsWD.getString("tipodados").trim());

                newDataset.addRow(new Array(
                    rsWD.getString("idcategoria") + "",
                    rsWD.getString("nomcategoria") + "",
                    rsWD.getString("idparametro") + "",
                    rsWD.getString("descricao") + "",
                    wTipoDados + "",
                    rsWD.getString("valorparametro") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        } 
        
        if (listaConstraits['indacao'] == 'PECATDISP') {
            newDataset.addColumn('codcategoria');
            newDataset.addColumn('codparametros');
            newDataset.addColumn('parametro');
            newDataset.addColumn('tipodados');
            newDataset.addColumn('valor');

            var SQL = "select " +
                "   ci.idcategoria, " +
                "   ci.idparametro, " +
                "   p.descricao, " +
                "   p.tipodados, " +
                "   ci.valorparametro " +
                "from kbt_t_categoria_item ci " +
                "     inner join kbt_t_parametros p on(p.id = ci.idparametro) " +
                " where ci.idcategoria = " + listaConstraits['codcategoria'];
            if (listaConstraits['indtabela'] == 'perfilcategoria') {
                SQL += " and not exists (select * from kbt_t_perfil_categoria  where idperfil = " + listaConstraits['codperfil'] + " and idcategoria = ci.idcategoria and idparametro = ci.idparametro)";
            }
            if (listaConstraits['indtabela'] == 'perfilnivelcategoria') {
                SQL += " and not exists (select * from kbt_t_perfil_nivel_categoria  where idperfil = " + listaConstraits['codperfil'] + " and idnivel = " + listaConstraits['codnivel'] + " and idcategoria = ci.idcategoria and idparametro = ci.idparametro)";
            }            


            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wTipoDados = f_DadosString(rsWD.getString("tipodados").trim());

                newDataset.addRow(new Array(
                    rsWD.getString("idcategoria") + "",
                    rsWD.getString("idparametro") + "",
                    rsWD.getString("descricao") + "",
                    wTipoDados + "",
                    rsWD.getString("valorparametro") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }   
        
        if (listaConstraits['indacao'] == 'PECATSET') {
            newDataset.addColumn('codnivel');
            newDataset.addColumn('codcategoria');
            newDataset.addColumn('codparametros');
            newDataset.addColumn('parametro');
            newDataset.addColumn('tipodados');
            newDataset.addColumn('valor');

            if (listaConstraits['indtabela'] == 'perfilcategoria') {
                var SQL = "select " +
                    "    ' ' as idnivel, " +
                    "    pc.idcategoria, " +
                    "    pc.idparametro, " +
                    "    p.descricao, " +
                    "    p.tipodados, " +
                    "    pc.valorparametro   " +
                    "from kbt_t_perfil_categoria as pc " +
                    "       inner join kbt_t_parametros p on(p.id = pc.idparametro)  " +
                    "where pc.idperfil = " + listaConstraits['codperfil'];

            }

            if (listaConstraits['indtabela'] == 'perfilnivelcategoria') {
                var SQL = "select " +
                    "    pc.idcategoria, " +
                    "    pc.idnivel, " +
                    "    pc.idparametro, " +
                    "    p.descricao, " +
                    "    p.tipodados, " +
                    "    pc.valorparametro   " +
                    "from kbt_t_perfil_nivel_categoria as pc " +
                    "       inner join kbt_t_parametros p on(p.id = pc.idparametro)  " +
                    "where pc.idperfil = " + listaConstraits['codperfil'] +
                    "  and pc.idnivel = " + listaConstraits['codnivel'];
                
                if (listaConstraits['codnivel'] == '' || listaConstraits['codnivel'] == null) {
                    return false;
                }
            }


            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var wTipoDados = f_DadosString(rsWD.getString("tipodados").trim());

                newDataset.addRow(new Array(
                    rsWD.getString("idnivel") + "",
                    rsWD.getString("idcategoria") + "",
                    rsWD.getString("idparametro") + "",
                    rsWD.getString("descricao") + "",
                    wTipoDados + "",
                    rsWD.getString("valorparametro") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }           

        if (listaConstraits['indacao'] == 'NI') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');
            newDataset.addColumn('situacao');

            var SQL = "select * from kbt_t_tipo_niveis";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("id") + "",
                    rsWD.getString("descricao") + "",
                    rsWD.getString("indsituacao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }

        if (listaConstraits['indacao'] == 'NIU') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');

            var SQL = "select " +
                "            distinct " +
                "            kpn.idnivel, " +
                "            ktn.descricao " +
                "from kbt_t_perfil_nivel_categoria  kpn " +
                "    inner join kbt_t_tipo_niveis ktn on(ktn.id = kpn.idnivel) " +
                "where kpn.idperfil = " + listaConstraits['codperfil'];
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("idnivel") + "",
                    rsWD.getString("descricao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }

        if (listaConstraits['indacao'] == 'PE') {
            newDataset.addColumn('codigo');
            newDataset.addColumn('descricao');
            newDataset.addColumn('situacao');

            var SQL = "select * from kbt_t_perfil";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                newDataset.addRow(new Array(
                    rsWD.getString("id") + "",
                    rsWD.getString("descricao") + "",
                    rsWD.getString("indsituacao") + ""
                ));
            }

            if (rsWD != null) rsWD.close();

        }  
        
        if (listaConstraits['indacao'] == 'US') {
            var contextWDL = new javax.naming.InitialContext();
            var dataSourceWDL = contextWDL.lookup("java:/jdbc/FluigDS");
            var connectionWDL = dataSourceWDL.getConnection();



            newDataset.addColumn('codigo');
            newDataset.addColumn('nome');
            newDataset.addColumn('codperfil');
            newDataset.addColumn('nomeperfil');
            newDataset.addColumn('codnivel');
            newDataset.addColumn('nomenivel');
            newDataset.addColumn('situacao');

            var SQL = "select " +
                "       us.idusuario, " +
                "       pf.id as codPerfil, " +
                "       pf.descricao as nomPerfil, " +
                "       nv.id as codNivel, " +
                "       nv.descricao as nomNivel, " +
                "       us.indsituacao " +
                "  from kbt_t_usuario_param us " +
                "      inner join kbt_t_perfil pf on(pf.id = us.idperfil) " +
                "      inner join kbt_t_tipo_niveis nv on(nv.id = us.idnivel) ";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {

                var SQL = "select id, nome, tipo_cadastro, cod_lider, lider from kbt_t_parceiros where inativo = 0 and id = " + rsWD.getString("idusuario");
                var statementWDL = connectionWDL.prepareStatement(SQL);
                var rsWDL = statementWDL.executeQuery();
                while (rsWDL.next()) {

                    newDataset.addRow(new Array(
                        rsWD.getString("idusuario") + "",
                        rsWDL.getString("nome") + "",
                        rsWD.getString("codPerfil") + "",
                        rsWD.getString("nomPerfil") + "",
                        rsWD.getString("codNivel") + "",
                        rsWD.getString("nomNivel") + "",
                        rsWD.getString("indsituacao") + ""
                    ));
                }
            }

            if (rsWD != null) rsWD.close();
            if (rsWDL != null) rsWDL.close();

            if (statementWDL != null) statementWDL.close();
            if (connectionWDL != null) connectionWDL.close();

        }   

        if (listaConstraits['indacao'] == 'US2') {
            var contextWDL = new javax.naming.InitialContext();
            var dataSourceWDL = contextWDL.lookup("java:/jdbc/FluigDS");
            var connectionWDL = dataSourceWDL.getConnection();

            newDataset.addColumn('codigo');
            newDataset.addColumn('nome');

            var SQL = "select id, nome, tipo_cadastro, cod_lider, lider from kbt_t_parceiros where inativo = 0 ";
            var statementWDL = connectionWDL.prepareStatement(SQL);
            var rsWDL = statementWDL.executeQuery();
            while (rsWDL.next()) {

                newDataset.addRow(new Array(
                    rsWDL.getString("id") + "",
                    rsWDL.getString("nome") + ""
                ));
            }

            if (rsWDL != null) rsWDL.close();

            if (statementWDL != null) statementWDL.close();
            if (connectionWDL != null) connectionWDL.close();

        }          


        if (listaConstraits['indacao'] == 'DELLREG') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var SQLDEL = ''

            try {
                switch (listaConstraits['codtabela']) {
                    case "01":
                        SQLDEL = "delete from kbt_t_tipo_cadastro where id = " + listaConstraits['chave1'];
                        break;
                    case "02":
                        SQLDEL = "delete from kbt_t_parametros where id = " + listaConstraits['chave1'];
                        break;
                    case "03":
                        SQLDEL = "delete from kbt_t_tipo_niveis where id = " + listaConstraits['chave1'];
                        break;
                    case "04":
                        SQLDEL = "delete from kbt_t_categorias where id = " + listaConstraits['chave1'];
                        break;
                    case "05":
                        SQLDEL = "delete from kbt_t_categoria_item where idcategoria = " + listaConstraits['chave1'] + " and idparametro = " + listaConstraits['chave2'];
                        break;
                    case "06":
                        SQLDEL = "delete from kbt_t_perfil_categoria where idperfil = " + listaConstraits['chave1'] + " and idcategoria = " + listaConstraits['chave2'] + " and idparametro = " + listaConstraits['chave3'];
                        break;
                    case "07":
                        SQLDEL = "delete from kbt_t_perfil_nivel_categoria where idperfil = " + listaConstraits['chave1'] + " and idnivel = " + listaConstraits['chave2'] + "and idcategoria = " + listaConstraits['chave3'] + " and idparametro = " + listaConstraits['chave4'];
                        break;                    
                }


                var statementWD = connectionWD.prepareStatement(SQLDEL);
                statementWD.executeUpdate();

                status = 'OK';
                menagem = '';

            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }         



        if (listaConstraits['indacao'] == 'ADDTIPO') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    var SQL = "select distinct 1 from kbt_t_tipo_cadastro where upper(descricao) = upper('" + listaConstraits['nomecadastro'].trim() + "')";
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Tipo já cadastrado!.';
                    }

                    if (wAchou == false) {
                        var SQLINS = "insert into kbt_t_tipo_cadastro (id, descricao) values ((SELECT COALESCE((max(id)+1),1) FROM kbt_t_tipo_cadastro),'" + listaConstraits['nomecadastro'].trim() + "')";
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    SQLUPD = "update kbt_t_tipo_cadastro set descricao = '" + listaConstraits['nomecadastro'].trim() + "' where id = " + listaConstraits['codigocadastro'];

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }                 

            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }

        if (listaConstraits['indacao'] == 'ADDPARAMETRO') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    var SQL = "select distinct 1 from kbt_t_parametros where upper(descricao) = upper('" + listaConstraits['nomeparametro'].trim() + "')";
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Parâmetro já cadastrado!.';
                    }

                    if (wAchou == false) {
                        var SQLINS = "insert into kbt_t_parametros (id, codtipocadastro, descricao, tipodados, valorpadrao ) values ";
                        SQLINS += "((SELECT COALESCE((max(id) + 1), 1) FROM kbt_t_parametros), " + listaConstraits['tipocadastro'] + ", '" + listaConstraits['nomeparametro'].trim() + "', '" + listaConstraits['tipodados'] + "', '" + listaConstraits['valorpadrao'] + "') ";
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    SQLUPD = "update kbt_t_parametros set codtipocadastro = " + listaConstraits['tipocadastro'] + ", tipodados = '" + listaConstraits['tipodados'] + "', descricao = '" + listaConstraits['nomeparametro'].trim() + "', valorpadrao = '" + listaConstraits['valorpadrao'].trim() + "' where id = " + listaConstraits['codigocadastro'];

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }                 

            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                if (rsWD != null) rsWD.close();

                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }   
        
        if (listaConstraits['indacao'] == 'ADDCATEGORIA') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    var SQL = "select distinct 1 from kbt_t_categorias where upper(descricao) = upper('" + listaConstraits['nomecadastro'].trim() + "')";
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Categoria já cadastrado!.';
                    }

                    if (wAchou == false) {

                        var SQLINS = "insert into kbt_t_categorias (id, descricao) values ((SELECT COALESCE((max(id)+1),1) FROM kbt_t_categorias),'" + listaConstraits['nomecadastro'].trim() + "')";
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    SQLUPD = "update kbt_t_categorias set descricao = '" + listaConstraits['nomecadastro'].trim() + "' where id = " + listaConstraits['codigocadastro'];

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }               

            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        } 
        
        if (listaConstraits['indacao'] == 'ADDCATEGORIAITEM') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    var SQL = "select distinct 1 from kbt_t_categoria_item where idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Parâmetro já incluido nessa categorida!.';
                    }

                    if (wAchou == false) {
                        var SQLINS = "insert into kbt_t_categoria_item (idcategoria, idparametro, valorparametro) values (" + listaConstraits['codcategoria'] + "," + listaConstraits['codparametro'] + ",'" + listaConstraits['valorparametro'].trim() + "')";
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    SQLUPD = "update kbt_t_categoria_item set valorparametro = '" + listaConstraits['valorparametro'].trim() + "' where idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }                

            } catch (error) {
                status = 'FALSE';
                menagem = error;
            } finally {

                if (rsWD != null) rsWD.close();

                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }         

        if (listaConstraits['indacao'] == 'ADDNIVEL') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    var SQL = "select distinct 1 from kbt_t_tipo_niveis where upper(descricao) = upper('" + listaConstraits['nomecadastro'].trim() + "')";
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Nível já cadastrado!.';
                    }

                    if (wAchou == false) {
                        var SQLINS = "insert into kbt_t_tipo_niveis (id, descricao) values ((SELECT COALESCE((max(id)+1),1) FROM kbt_t_tipo_niveis),'" + listaConstraits['nomecadastro'].trim() + "')";
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    SQLUPD = "update kbt_t_tipo_niveis set descricao = '" + listaConstraits['nomecadastro'].trim() + "' where id = " + listaConstraits['codigocadastro'];

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';                    
                }


            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }        

        if (listaConstraits['indacao'] == 'ADDPERFIL') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;

            try {
                var SQL = "select distinct 1 from kbt_t_perfil where upper(descricao) = upper('" + listaConstraits['nomecadastro'].trim() + "')";
                statementWD = connectionWD.prepareStatement(SQL);
                var rsWD = statementWD.executeQuery();
                while (rsWD.next()) {
                    wAchou = true;

                    status = 'FALSE';
                    menagem = 'Perfil já cadastrado!.';
                }

                if (wAchou == false) {
                    var SQLINS = "insert into kbt_t_perfil (id, descricao) values ((SELECT COALESCE((max(id)+1),1) FROM kbt_t_perfil),'" + listaConstraits['nomecadastro'].trim() + "')";
                    var statementWD = connectionWD.prepareStatement(SQLINS);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }

            } catch (error) {

                status = 'FALSE';
                menagem = error;
            } finally {
                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }    

        if (listaConstraits['indacao'] == 'ADDPERFILCATEGORIA') {
            newDataset.addColumn('STATUS');
            newDataset.addColumn('MENSAGEM');

            var status = '';
            var menagem = '';
            var wAchou = false;
            var SQL = '';
            var SQLINS = ''
            var SQLUPD = ''

            try {
                if (listaConstraits['acaobanco'] == 'INS') {
                    if (listaConstraits['codnivel'] == 'undefined' || listaConstraits['codnivel'] == '') {
                        SQL = "select distinct 1 from kbt_t_perfil_categoria where idperfil = " + listaConstraits['codperfil'] + " and idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];
                    }

                    if (listaConstraits['codnivel'] != 'undefined' && listaConstraits['codnivel'] != '') {
                        SQL = "select distinct 1 from kbt_t_perfil_nivel_categoria where idperfil = " + listaConstraits['codperfil'] + " and idnivel = " + listaConstraits['codnivel'] + " and idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];
                    }
                    statementWD = connectionWD.prepareStatement(SQL);
                    var rsWD = statementWD.executeQuery();
                    while (rsWD.next()) {
                        wAchou = true;

                        status = 'FALSE';
                        menagem = 'Parâmetro já incluido nessa categorida!.';
                    }

                    if (wAchou == false) {
                        if (listaConstraits['codnivel'] == 'undefined' || listaConstraits['codnivel'] == '') {
                            SQLINS = "insert into kbt_t_perfil_categoria (idperfil, idcategoria, idparametro, valorparametro) values " +
                                " (" + listaConstraits['codperfil'] + "," + listaConstraits['codcategoria'] + "," + listaConstraits['codparametro'] + ",'" + listaConstraits['valorparametro'].trim() + "')";
                        }

                        if (listaConstraits['codnivel'] != 'undefined' && listaConstraits['codnivel'] != '') {
                            SQLINS = "insert into kbt_t_perfil_nivel_categoria (idperfil, idnivel, idcategoria, idparametro, valorparametro) values " +
                                " (" + listaConstraits['codperfil'] + "," + listaConstraits['codnivel'] + "," + listaConstraits['codcategoria'] + "," + listaConstraits['codparametro'] + ",'" + listaConstraits['valorparametro'].trim() + "')";
                        }

                    
                        var statementWD = connectionWD.prepareStatement(SQLINS);
                        statementWD.executeUpdate();

                        status = 'OK';
                        menagem = '';
                    }
                }

                if (listaConstraits['acaobanco'] == 'EDT') {
                    if (listaConstraits['codnivel'] == 'undefined' || listaConstraits['codnivel'] == '') {
                        SQLUPD = "update kbt_t_perfil_categoria set valorparametro = '" + listaConstraits['valorparametro'].trim() + "' where idperfil = " + listaConstraits['codperfil'] + " and idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];
                    }

                    if (listaConstraits['codnivel'] != 'undefined' && listaConstraits['codnivel'] != '') {
                        SQLUPD = "update kbt_t_perfil_nivel_categoria set valorparametro = '" + listaConstraits['valorparametro'].trim() + "' where idperfil = " + listaConstraits['codperfil'] + " and idnivel = " + listaConstraits['codnivel'] + " and idcategoria = " + listaConstraits['codcategoria'] + " and idparametro = " + listaConstraits['codparametro'];
                    }

                    var statementWD = connectionWD.prepareStatement(SQLUPD);
                    statementWD.executeUpdate();

                    status = 'OK';
                    menagem = '';
                }

            } catch (error) {
                status = 'FALSE';
                menagem = error + "";
                // menagem = listaConstraits['codnivel'] + ' | ' +SQL + ' - ' + SQLINS;
            } finally {

                if (rsWD != null) rsWD.close();

                newDataset.addRow(new Array(
                    status + "",
                    menagem + ""
                ));
            }
        }          


    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {

        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

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

function f_DadosString(pIndTIpo) {
    var wTipoDados = null
    if (pIndTIpo == 'S') { wTipoDados = 'String'; }
    if (pIndTIpo == 'D') { wTipoDados = 'Date'; }
    if (pIndTIpo == 'N') { wTipoDados = 'Number'; }
    if (pIndTIpo == 'F') { wTipoDados = 'Float'; }
    if (pIndTIpo == 'T') { wTipoDados = 'Time'; }

    return wTipoDados;
}