var gToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMDkwNzIwMjQiLCJub21lIjoiZmx1aWcifQ.Gh8g5STXlLkOfwUDmutQwmMzqjxvaUO0VafCCHJVQrs';
var gRota = '/02'
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## Sync Arquitetos START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    try {

        if (gToken != null) {
            f_postArquitetos(gToken, newDataset);
            f_postExtratos(gToken, newDataset);
            f_postPremios(gToken, newDataset);
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return newDataset;

}

function createDataset(fields, constraints, sortFields) {
    printLog("info", "## Sync Arquitetos START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    try {

        if (gToken != null) {
            f_postArquitetos(gToken, newDataset);
            // f_postExtratos(gToken, newDataset);
            // f_postPremios(gToken, newDataset);
        }
    } catch (error) {
        // printLog("erro", "Error SQL: " + error.toString());
        newDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    }

    return newDataset;
}

function onMobileSync(user) {

}

function f_postArquitetos(wToken, pDataset) {

    try {
        var uUsuarios = [];
        var wSenha = "";

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var wArray = {};
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        var SQL = "select " +
            "    pPessoa.id as id_pessoa, " +
            "    pPessoa.nome_razao, " +
            "    pPessoa.cnpj_cpf, " +
            "    pEmail.email, " +
            "    pArq.ativo as ativo_arq, " +
            "    pPessoa.ativo as ativo_pessoa, " +
            "    pArq.nr_cupom, " +
            "    pFone.telefone " +
            "from pon_pessoa_arquiteto pArq " +
            "   inner join pon_pessoa pPessoa on(pPessoa.id = pArq.id_pessoa) " +
            "                                and(pPessoa.ativo = true)    " +
            "   inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pArq.id_pessoa) " +
            "                                    and(pEmail.principal = true)   " +
            "    left join pon_pessoa_telefone pFone on(pFone.id_pessoa = pArq.id_pessoa) " +
            "                            and(pFone.tipo_telefone = 'Celular') " +
            "                            and(pFone.principal = true) " +
            "where pArq.id_grupo = 11 " +
            "  and pArq.ativo = true " +
            "  and not exists(select 1 from kbt_t_integracao_portal_arq where registro = 'usuario' and idlocal = pPessoa.id)";

        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            pDataset.addRow(new Array("Nome: " + rsWD.getString('nome_razao') + ' Telefone: ' + rsWD.getString('telefone')));
            var wEmail = '';
            if (rsWD.getString('email') != null && rsWD.getString('email') != '') {
                wEmail = rsWD.getString('email').toLowerCase();
            }

            wSenha = rsWD.getString('cnpj_cpf').substring(0, 3) + '@' + rsWD.getString('nome_razao').substring(0, 3).trim().toLowerCase();

            var dados = {
                CRYPT: "S",
                IDPESSOA: rsWD.getString('id_pessoa'),
                NOMUSUARIO: rsWD.getString('nome_razao') + "",
                CPFCNPJ: rsWD.getString('cnpj_cpf') + "",
                EMAIL: wEmail + "",
                SENHA: wSenha.toLowerCase() + "",
                CUPOM: rsWD.getString('nr_cupom') + "",
                TELEFONE: rsWD.getString('telefone') + "",
                SITARQ: rsWD.getString('ativo_arq') == "t" ? true : false,
                SITPESSOA: rsWD.getString('ativo_pessoa') == "t" ? true : false
            }
            uUsuarios.push(dados);
        }
        if (uUsuarios.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: uUsuarios.length,
                DATA: uUsuarios
            };

        }

        printLog("error", "JSON Arq User: " + gson.toJson(wArray));
        if (wArray.RECORDS > 0) {
            var endpoint = gRota + "/arquitetos";
            var objArq = f_atualizarRegistro(endpoint, wToken, wArray, pDataset)
            if (objArq.STATUS == true) {
                // var SQLINS = "insert into kbt_t_integracao_portal_arq (registro, idlocal, idremoto, datsync) values " +
                //     " ('usuario', ?, ?, CURRENT_DATE) ";
                // var statementWD = connectionWD.prepareStatement(SQLINS);


                // for (var i = 0; i < objArq.RECORDS; i++) {
                //     if (objArq.DATA[i].IDINT != null) {
                //         statementWD.setInt(1, parseInt(objArq.DATA[i].IDPESSOA));
                //         statementWD.setInt(1, parseInt(objArq.DATA[i].IDINT));
                //         statementWD.executeUpdate();
                //     }
                // }
                pDataset.addRow(new Array("Arquitetos Enviados"));
            }
        }

    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_postExtratos(wToken, pDataset) {
    try {
        var wPeriodo = f_getPeriodoVigente(pDataset);

        // return false;

        // var tpLocais = {};
        var uExtratos = [];

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var wArray = {};
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        var SQL = "select " +
            "    pr.id, " +
            "    pa.id_pessoa, " +
            "    p.nome_razao, " +
            "    CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, " +
            "    to_char(pr.dh_financeiro, 'YYYY-MM-DD') as dh_emissao, " +
            "    pr.vl_total, " +
            "    pv.equipe     " +
            "from pon_proposta pr " +
            "    inner join pon_pessoa_arquiteto pa on (pa.id = pr.id_arquiteto) " +
            "                                      and (pa.id_grupo = 11) " +
            "                                      and (pa.ativo = true ) " +
            "    inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pa.id_pessoa) " +
            "                                      and(pEmail.principal = true)  " +
            "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente) " +
            "    inner join pon_pessoa p on(p.id = pc.id_pessoa) " +
            "    inner join pon_pessoa_vendedor pv on(pv.id = pr.id_vendedor) " +
            "where pr.dh_financeiro between '" + wPeriodo.dataini + "' and '" + wPeriodo.datafim + "' " +
            "  and  pr.id_condicao_pagto not in (32)" +
            "  and not exists(select 1 from kbt_t_integracao_portal_arq where registro = 'proposta' and idlocal = pr.id) ";
        // "  and pr.id = 346332 ";


        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            // pDataset.addRow(new Array("Nome: " + rsWD.getString('nome_razao') + ' - Proposta: ' + rsWD.getString('id')));
            var wEmail = '';


            var dados = {
                IDPROPOSTA: rsWD.getString('id') + "",
                IDPESSOA: rsWD.getString('id_pessoa') + "",
                CLIENTE: rsWD.getString('nome_razao') + "",
                PROPOSTA: rsWD.getString('proposta') + "",
                EMISSAO: rsWD.getString('dh_emissao') + "",
                VALOR: parseFloat(rsWD.getString('vl_total')) + "",
                EQUIPE: rsWD.getString('equipe') + "",
            }
            uExtratos.push(dados);
        }

        if (uExtratos.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: parseInt(uExtratos.length),
                DATA: uExtratos
            };

        }

        printLog("error", "JSON Arq: " + gson.toJson(wArray));
        if (wArray.RECORDS > 0) {
            var endpoint = gRota + "/extratos";
            var objArq = f_atualizarRegistro(endpoint, wToken, wArray, pDataset)
            if (objArq.STATUS == true) {
                for (var i = 0; i < objArq.RECORDS; i++) {
                    var SQLINS = "insert into kbt_t_integracao_portal_arq (registro, idlocal, idremoto, datsync) values " +
                        " ('proposta'," + objArq.DATA[i].IDPROPOSTA + "," + objArq.DATA[i].IDINT + ", CURRENT_DATE) ";
                    var statementWD = connectionWD.prepareStatement(SQLINS);
                    statementWD.executeUpdate();
                }


                pDataset.addRow(new Array("Extratos Enviadas"));

            }
        }
    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_postPremios(wToken, pDataset) {

    try {
        var ArrPremios = [];

        var connectionWD = null;
        var statementWD = null;
        var statementWD2 = null;
        var rsWD = null;
        var rsWD2 = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup('java:/jdbc/FluigDS');
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        var wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        var tPremios = getTable('ds_cadastro_premiacoes', '');
        var tFotos = getTable('ds_cadastro_premiacoes', 'tbImagens');

        var SQLPremios = "select  " +
            "    sc.documentid, " +
            "    sc.tituloPremio, " +
            "    sc.txtPremio, " +
            "    sc.numpontos, " +
            "    sc.checkResgate, " +
            "    STR_TO_DATE(sc.datainicio, '%d/%m/%Y %H:%i:%s') as datainicio, " +
            "    STR_TO_DATE(sc.datafinal, '%d/%m/%Y %H:%i:%s') as datafinal, " +
            "    STR_TO_DATE(sc.datainicioresgate, '%d/%m/%Y %H:%i:%s') as datainicioresgate, " +
            "    STR_TO_DATE(sc.datafinalresgate, '%d/%m/%Y %H:%i:%s') as datafinalresgate  " +
            "from " + tPremios + " sc  " +
            "    join documento dc on(dc.cod_empresa = sc.companyid  " +
            "            and dc.nr_documento = sc.documentid  " +
            "            and dc.nr_versao = sc.version   " +
            "            and dc.versao_ativa = 1); ";

        statementWD = connectionWD.prepareStatement(SQLPremios);

        var SQLFotos = "select  " +
            "    CONCAT(sc.documentid,sc.masterid) as id, " +
            "    sc.idimagem " +
            "from " + tFotos + " sc  " +
            "    join documento dc on(dc.cod_empresa = sc.companyid  " +
            "            and dc.nr_documento = sc.documentid  " +
            "            and dc.nr_versao = sc.version   " +
            "            and dc.versao_ativa = 1) " +
            "where sc.idimagem  <> '' " +
            "    and sc.documentid = ?";

        statementWD2 = connectionWD.prepareStatement(SQLFotos);


        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var ArrFotos = [];

            statementWD2.setInt(1, parseInt(rsWD.getString('documentid')));
            rsWD2 = statementWD2.executeQuery();

            while (rsWD2.next()) {
                var doc = fluigAPI.getDocumentService().getActive(parseInt(rsWD2.getString('idImagem')));
                var dirDefault = fluigAPI.getTenantService().getTenantData(["dirDefault"]).get("dirDefault");
                var bytes = com.twelvemonkeys.io.FileUtil.read(
                    new java.io.File(dirDefault + "/public/" + doc.getDocumentId() + "/" + doc.getVersion() + "/" + doc.getPhisicalFile())
                );

                var base64 = java.util.Base64.getEncoder().encodeToString(bytes)

                var data = {
                    ID: rsWD2.getString('idImagem'),
                    FOTO: 'data:image/jpeg;base64,' + base64
                }
                ArrFotos.push(data);
            }

            if (rsWD2 != null) rsWD2.close();

            var data = {
                ID: rsWD.getString('documentid'),
                RESGATE: rsWD.getString('checkResgate') == 'sim' ? true : false,
                DATAINIPREMIO: rsWD.getString('dataInicio') != '' && rsWD.getString('dataInicio') != null ? rsWD.getString('dataInicio') : null,
                DATAFIMPREMIO: rsWD.getString('dataFinal') != '' && rsWD.getString('dataFinal') != null ? rsWD.getString('dataFinal') : null,
                DATAINIRESGATE: rsWD.getString('dataInicioResgate') != '' && rsWD.getString('dataInicioResgate') != null ? rsWD.getString('dataInicioResgate') : null,
                DATAFIMRESGATE: rsWD.getString('dataFinalResgate') != '' && rsWD.getString('dataFinalResgate') != null ? rsWD.getString('dataFinalResgate') : null,
                TITULO: rsWD.getString('tituloPremio'),
                TEXTO: rsWD.getString('txtPremio'),
                PONTOS: rsWD.getString('numPontos'),
                FOTOS: ArrFotos
            }
            ArrPremios.push(data);
        }

        if (ArrPremios.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: parseInt(ArrPremios.length),
                DATA: ArrPremios
            };
        }

        // pDataset.addRow(new Array("JSON: " + gson.toJson(wArray)));
        printLog("info", "JSON Premios: " + gson.toJson(wArray));

        if (wArray.RECORDS > 0) {
            var endpoint = gRota + "/premios";
            var objArq = f_atualizarRegistro(endpoint, wToken, wArray, pDataset)
            if (objArq.STATUS == true) {
                pDataset.addRow(new Array("Premios Enviadas"));
            }
        }

    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (rsWD2 != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (statementWD2 != null) statementWD2.close();
        if (connectionWD != null) connectionWD.close();
    }
}

var debug = true;
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

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pDataset) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "arquitetos";
    var gson = new com.google.gson.Gson();
    var params;

    if (jsonFile != "") {
        metodo = "POST";
        // params = gson.toJson(jsonFile)
        params = gson.toJson(jsonFile)
    }

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: PendPoint,
        timeoutService: "240",
        method: metodo,
    };


    var headers = {};
    headers["authorization"] = Ptoken;
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["strParams"] = params;
    // data["params"] = params;

    // printLog("error", "JSON Arq: " + gson.toJson(data));
    var jj = gson.toJson(data);
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        // printLog("error", "AAQUI");
        // log.dir(vo.getResult());
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }

    return retorno;


}

function f_getPeriodoVigente(pDataset) {
    try {
        var wRetorno = null
        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();
        // "from ML00121991 " +
        var tTable = getTable('ds_periodos_premios', '');
        var SQL = "select STR_TO_DATE(dt_inicio, '%Y-%m-%d') as dt_inicio, STR_TO_DATE(dt_fim, '%Y-%m-%d') as dt_fim " +
            "from " + tTable + " " +
            "where  STR_TO_DATE(dt_inicio, '%Y-%m-%d') <= current_date  " +
            "and  STR_TO_DATE(dt_fim, '%Y-%m-%d') >= current_date ";

        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wRetorno = {
                dataini: rsWD.getString("dt_inicio"),
                datafim: rsWD.getString("dt_fim"),
            }
        }

    } catch (error) {
        pDataset.addRow(new Array(error.toString() + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wRetorno;
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