var debug = true;
function defineStructure() {
    // addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Clientes START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        var listaConstraits = {};
        listaConstraits['cliente'] = "";
        listaConstraits['atualizacao'] = "";

        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue + '';
            }
        }

        // listaConstraits['cliente'] = "002219513000113";
        // listaConstraits['atualizacao'] = "S";
        if (listaConstraits['cliente'] != '') {
            f_integrar(newDataset, listaConstraits['cliente']);
        } else if (listaConstraits['atualizacao'] != '') {
            f_integrar(newDataset, '', listaConstraits['atualizacao']);
        } else {
            f_integrar(newDataset);
        }

    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset, pCodCliente, pIndAtualizacao) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var wCLientes = 1;
        var mensagem = '';
        var arrClientes = [];

        var WIdClienteLog = "";
        // 053135481000109

        // var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        // if (wAPI != null) {
        //     for (var i = 0; i < wAPI.length; i++) {
        //         eval('var arrEmpresas' + wAPI[i].EMRPESA + ' = [];');
        //     }
        // }

        var SQL = "select ";
        SQL += "    c.cod_cliente, ";
        SQL += "    c.num_cgc_cpf, ";
        SQL += "    trim(c.nom_cliente) as razao, ";
        SQL += "    trim(c.nom_reduzido) as fantasia, ";
        SQL += "    c.num_telefone, ";
        SQL += "    c.ins_estadual, ";
        SQL += "    cid.cod_cidade as cidade, ";
        SQL += "    trim(cid.den_cidade) as nomCidade, ";
        SQL += "    cod_cep as cep, ";
        SQL += "    cid.cod_uni_feder as uf, ";
        SQL += "    trim(logra.des_logradouro) as end0, ";
        SQL += "    trim(vdp_cpl.logradouro) as end1, ";
        SQL += "    vdp_cpl.num_iden_lograd as numero, ";
        SQL += "    vdp_cpl.compl_endereco as complemento, ";
        SQL += "    vdp_cpl.bairro as bairro, ";
        SQL += "    vdp_cpl.correio_eletronico as email, ";
        SQL += "    vdp_cpl.correi_eletr_venda as emailcompras, ";
        SQL += "    nvl((select(credcad_cli.val_credito_conced)from credcad_cli where COD_CLIENTE = c.cod_cliente), 0)  as limiteCredito, ";
        SQL += "    nvl((select sum((saldo * ped.pre_unit)) from cj_v_pedidos_pendentes ped where ped.cod_cliente = c.cod_cliente), 0)  as limiteUsado, ";
        SQL += "    c.ies_situacao ";
        SQL += " from clientes c ";
        if (pIndAtualizacao != undefined && pIndAtualizacao != '') {
            SQL += "    inner join caj_velis_integracao vAtu on (vAtu.cadastro = 'cliente') ";
            SQL += "                                        and (vAtu.cliente = c.cod_cliente) ";
        }
        SQL += "    inner join CLI_CANAL_VENDA clic on clic.COD_TIP_CARTEIRA = 01 ";
        SQL += "            and(clic.cod_cliente = c.cod_cliente) ";
        SQL += "    left join vdp_cli_fornec_cpl vdp_cpl on c.cod_cliente = vdp_cpl.cliente_fornecedor  ";
        SQL += "                                        and c.ies_cli_forn = vdp_cpl.tip_cadastro ";
        SQL += "    left join vdp_tip_logradouro logra on vdp_cpl.tip_logradouro = logra.tip_logradouro  ";
        SQL += "    left join cidades cid on c.cod_cidade = cid.cod_cidade ";
        SQL += " where c.cod_tip_cli not in ('98', '99') ";
        if (pCodCliente == undefined || pCodCliente == '') {
            if (pIndAtualizacao == undefined && pIndAtualizacao == '') {
                SQL += " and c.ies_situacao in ('A','S')";
            } else {
                SQL += " and c.ies_situacao in ('A','S','C')";
            }
        } else {
            SQL += " and c.cod_cliente = '" + pCodCliente + "' ";
        }
        // SQL += " and rownum <= 250 ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        var wTotalClientes = 0
        while (rsWD.next()) {
            // if (pCodCliente == undefined) { printLog('info', 'Enviando cliente: ' + wCLientes + ' de ' + wTotalClientes); }
            newDataset.addRow(new Array(true, rsWD.getString("cod_cliente") + ' - ' + rsWD.getString("razao")));


            var wEmail = '';
            var wTelefone = '';
            var wSituacao = 2;
            var wCPFCNPJ = '';
            var str = rsWD.getString("num_cgc_cpf") + "";
            var wSplitString = str.split('.');
            var isCPF = wSplitString[2].split('/')[1].split('-')[0];
            var wBlocked = false;

            if (isCPF == '0000') {
                var wSpliCPF1 = wSplitString[2].split("/");
                var wSpliCPF2 = wSplitString[2].split("-");
                wCPFCNPJ = wSplitString[0] + '.' + wSplitString[1] + '.' + wSpliCPF1[0] + '-' + wSpliCPF2[1];
            } else {
                // var wIni = wSplitString[0];
                wCPFCNPJ = wSplitString[0].substring(1, 3) + '.' + wSplitString[1] + '.' + wSplitString[2]
            }

            if (rsWD.getString("email") != '' && rsWD.getString("email") != null) {
                wEmail = rsWD.getString("email").trim()
            }

            if (rsWD.getString("num_telefone") != '' && rsWD.getString("num_telefone") != null) {
                wTelefone = rsWD.getString("num_telefone").trim()
            }

            if (rsWD.getString("ies_situacao") == 'A') {
                wSituacao = 2;
            }

            if (rsWD.getString("ies_situacao") == 'S') {
                wBlocked = true;
                wSituacao = 2;
            }

            if (rsWD.getString("ies_situacao") == 'C') {
                wBlocked = true;
                wSituacao = 3;
            }

            if (rsWD.getString("ies_situacao") == 'P') {
                wBlocked = true;
                wSituacao = 1;
            }

            var wNote = '';
            var SQLNote = " select texto from vdp_cliente_texto where cliente = '" + rsWD.getString("cod_cliente").trim() + "'";
            var statementWD = connectionWD.prepareStatement(SQLNote);
            var rsWD2 = statementWD.executeQuery();
            while (rsWD2.next()) {
                if (wNote == '') {
                    wNote = rsWD2.getString("texto").trim();
                } else {
                    wNote = wNote + ', ' + rsWD2.getString("texto");
                }
            }

            if (rsWD2 != null) rsWD2.close();

            var data = {
                idErp: rsWD.getString("cod_cliente").trim(),
                corporateName: rsWD.getString("razao"),
                pricingTable: {
                    b2b: false,
                    defaultAtCustomerCreation: true,
                    description: "",
                    discount: 0,
                    email: "",
                    enabled: true,
                    id: null,
                    idErp: "",
                    maxDiscount: 0,
                    name: ""
                },
                pricingTableId: null,
                b2bCashbackPercent: 0,
                b2bMinOrderValue: 0,
                b2bPricingTableId: 0,
                billingAddress: {
                    city: rsWD.getString("NOMCIDADE").trim(),
                    complement: (rsWD.getString("COMPLEMENTO") != null ? rsWD.getString("COMPLEMENTO").trim() : rsWD.getString("COMPLEMENTO")),
                    country: "Brasil",
                    district: "",
                    id: null,
                    idErp: rsWD.getString("cod_cliente").trim(),
                    number: rsWD.getString("NUMERO"),
                    state: rsWD.getString("UF"),
                    street: rsWD.getString("END0") + ' ' + rsWD.getString("END1"),
                    zip: rsWD.getString("CEP")
                },
                billingAddressId: null,
                birthDate: "",
                blocked: wBlocked,
                cashbackBalanceAvailable: 0,
                cashbackBalancePending: 0,
                cashbackPercent: 0,
                code: rsWD.getString("cod_cliente").trim(),
                contact: null,
                createdBy: null,
                createdByUser: null,
                creationTime: "",
                creditLimit: parseFloat(rsWD.getString("limiteCredito")),
                creditUsedValue: parseFloat(rsWD.getString("limiteUsado")),
                customerCategory: null,
                customerCategoryId: null,
                defaultPaymentFormsId: null,
                defaultPaymentTermsId: null,
                email: wEmail,
                extras: {},
                fax: "",
                federalId: wCPFCNPJ,
                filiation: "",
                icmsException: null,
                icmsExceptionId: null,
                id: null,
                inscricaoEstadual: rsWD.getString("ins_estadual"),
                lastSalesOrderTime: null,
                lastVisitTime: null,
                minOrderValue: 0,
                name: rsWD.getString("fantasia"),
                notes: wNote,
                paymentFormsIds: "",
                paymentFormsIdsErp: "",
                paymentTermsIds: "",
                paymentTermsIdsErp: "",
                phone: wTelefone,
                pipeline: null,
                pipelineId: null,
                pipelineRemoved: true,
                ponderedAverageDelayValue: 0,
                ponderedIndexDelayValue: 0,
                rg: "",
                salesmanName: "",
                shippingAddress: {
                    city: rsWD.getString("NOMCIDADE"),
                    complement: rsWD.getString("COMPLEMENTO"),
                    country: "Brasil",
                    district: "",
                    id: null,
                    idErp: rsWD.getString("cod_cliente").trim(),
                    number: rsWD.getString("NUMERO"),
                    state: rsWD.getString("UF"),
                    street: rsWD.getString("END0") + ' ' + rsWD.getString("END1"),
                    zip: rsWD.getString("CEP")
                },
                shippingAddressId: null,
                status: parseInt(wSituacao),
                suframa: ""
            };


            arrClientes.push(data);
        }

        var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        for (var x = 0; x < wAPI.length; x++) {
            // var x = 0;
            var wEmpresaClientes = JSON.parse(gson.toJson(arrClientes));
            for (var i = 0; i < arrClientes.length; i++) {
                var lRetorno = f_dadosPorEmpresa(wAPI[x].EMRPESA, arrClientes[i].idErp, 'L', newDataset)
                if (lRetorno != null && lRetorno != '') {
                    wEmpresaClientes[i].pricingTable = JSON.parse(lRetorno);
                }
                wEmpresaClientes[i].paymentTermsIdsErp = f_dadosPorEmpresa(wAPI[x].EMRPESA, arrClientes[i].idErp, 'F', newDataset)
            }

            var wClientesEnvio = [];
            var wCountCliente = 0
            for (var i = 0; i < wEmpresaClientes.length; i++) {
                wClientesEnvio.push(wEmpresaClientes[i]);
                wCountCliente++;

                if (wCountCliente == 200) {
                    wCountCliente = 0;
                    f_logIntegracao('cli', wAPI[x].EMRPESA, wCountCliente[i].idErp, gson.toJson(wCountCliente[i]), newDataset); // Monta Log caso necessário.
                    var retorno = f_getDadosVelis(wAPI[x].EMRPESA, wClientesEnvio, newDataset, 'S');
                    if (retorno.status == true) {
                        if (pIndAtualizacao != undefined && pIndAtualizacao != '') {
                            for (var z = 0; z < wClientesEnvio.length; z++) {
                                // newDataset.addRow(new Array(true, 'Atualiazando Registro: ' + data[z].idErp));
                                f_atualizaRegistro('cliente', wClientesEnvio[z].idErp, true, '', newDataset);
                            }
                        }
                        wClientesEnvio = [];
                    } else {
                        newDataset.addRow(new Array(false, retorno.mensagem));
                    }
                }
            }

            if (wCountCliente > 0) {

                for (var i = 0; i < wEmpresaClientes.length; i++) {
                    f_logIntegracao('cli', wAPI[x].EMRPESA, wEmpresaClientes[i].idErp, gson.toJson(wEmpresaClientes[i]), newDataset); // Monta Log caso necessário.
                }
                // printLog('info', 'JsonClientesData Envio Depois do For' + wAPI[x].EMRPESA + ' JSON: ' + gson.toJson(wClientesEnvio));
                var retorno = f_getDadosVelis(wAPI[x].EMRPESA, wClientesEnvio, newDataset, 'S');
                if (retorno.status == true) {
                    if (pIndAtualizacao != undefined && pIndAtualizacao != '') {
                        for (var z = 0; z < wClientesEnvio.length; z++) {
                            // newDataset.addRow(new Array(true, 'Atualiazando Registro: ' + data[z].idErp));
                            f_atualizaRegistro('cliente', wClientesEnvio[z].idErp, true, '', newDataset);
                        }
                    }
                } else {
                    newDataset.addRow(new Array(false, retorno.mensagem));
                }
            }
        }

        newDataset.addRow(new Array(true, 'Enviado '));



    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}


function f_dadosPorEmpresa(pcodEmpresa, codCliente, pIndBusca, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var wRetorno = null;

        if (pIndBusca == 'L') {
            var SQLLista = "select PARAMETRO_VAL from vdp_emp_cli_par where Parametro = 'lista_preco_cliente' and EMPRESA = '" + pcodEmpresa + "' and cliente = '" + codCliente + "' ";
            var statementWD = connectionWD.prepareStatement(SQLLista);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                if (rsWD.getString("PARAMETRO_VAL") != null && rsWD.getString("PARAMETRO_VAL") != '') {
                    var lData = {
                        b2b: false,
                        defaultAtCustomerCreation: true,
                        description: "",
                        discount: 0,
                        email: "",
                        enabled: true,
                        id: null,
                        idErp: rsWD.getString("PARAMETRO_VAL") + "",
                        maxDiscount: 0,
                        name: ""
                    }

                    // wRetorno = lData;
                    wRetorno = gson.toJson(lData);
                }

            }
        }


        if (pIndBusca == '-9') {
            // var SQLLista = "select ";
            // SQLLista += "    1 ";
            // SQLLista += "from vdp_emp_cli_par c ";
            // SQLLista += "    inner join cre_emp_cli_port cre on(cre.empresa = c.empresa) ";
            // SQLLista += "                    and(cre.cliente = c.cliente) ";
            // SQLLista += "                    and(cre.tip_portador = 'B') ";
            // SQLLista += "where c.empresa = '" + wAPI[i].EMRPESA + "' ";
            // SQLLista += "and c.cliente = '" + rsWD.getString("cod_cliente").trim() + "' ";
            // SQLLista += "and c.parametro = 'GERA BLOQUETO' ";
            // SQLLista += "and c.par_existencia = 'S' ";
            // var statementWD = connectionWD.prepareStatement(SQLLista);
            // var rsWD2 = statementWD.executeQuery();
            // while (rsWD2.next()) {
            //     data.paymentFormsIds = "15";
            //     data.paymentTermsIds = "31";
            // }
            // if (rsWD2 != null) rsWD2.close();

            // 03,17,999 - formas de pagamentos
        }

        if (pIndBusca == 'F') {
            var wCondicao = null;
            var SQLLista = "select vdp_emp_cli_par.parametro_val cond_pgto "
            SQLLista += " from vdp_emp_cli_par "
            SQLLista += " where vdp_emp_cli_par.parametro = 'cj_cod_cnd_pgto' "
            SQLLista += " and vdp_emp_cli_par.cliente = '" + codCliente + "'";
            SQLLista += " and vdp_emp_cli_par.empresa = '" + pcodEmpresa + "'";
            SQLLista += "                     union "
            SQLLista += " select cond_pgto.cod_cnd_pgto "
            SQLLista += " from cond_pgto "
            SQLLista += " where cond_pgto.situacao = 'A' "
            SQLLista += " and cond_pgto.ies_tipo = 'V'";
            var statementWD = connectionWD.prepareStatement(SQLLista);
            var rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                if (wCondicao == null) {
                    wCondicao = (rsWD.getString("cond_pgto") != null ? rsWD.getString("cond_pgto").trim() : rsWD.getString("cond_pgto"));
                } else {
                    wCondicao = wCondicao + ',' + (rsWD.getString("cond_pgto") != null ? rsWD.getString("cond_pgto").trim() : rsWD.getString("cond_pgto"));
                }
            }

            wRetorno = wCondicao;
        }

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        // newDataset.addRow(new Array(wRetorno));
        return wRetorno;
    }
}


function f_atualizaRegistro(pCadastro, pCodCliente, pStatus, pMensagem, pDataset) {

    try {
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();
        if (pStatus) {
            var SQL = "delete from caj_velis_integracao where cadastro = '" + pCadastro.trim() + "' ";
            if (pCodCliente.trim() != '') { SQL += " and cliente = '" + pCodCliente + "'"; }
        }

        if (!pStatus) {
            var SQL = "update caj_velis_integracao set status = 'ERR', retornoapi = '" + pMensagem + "' where cadastro = '" + pCadastro.trim() + "' ";
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

function f_gravaIntegracao(pCodEmpresa, pCodCliente, pRetorno, pDataset) {

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();

        if (pRetorno.id != undefined) {
            // pDataset.addRow(new Array("OK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));

            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','CLIENTES','" + pRetorno.id + "','" + gson.toJson(pRetorno) + "')";
        } else {
            // pDataset.addRow(new Array("NOK: Cliente  " + pCodCliente + " - Retorno: " + gson.toJson(pRetorno)));
            var sqlUPD = "INSERT INTO kbt_t_integracao_velis (empresa, data, CODIGO, INTEGRACAO, IDVELIS, RETORNO) VALUES ";
            sqlUPD += "('" + pCodEmpresa + "',sysdate,'" + pCodCliente + "','CLIENTES','-99','" + gson.toJson(pRetorno) + "')";
        }




        var statementWD = connectionWD.prepareStatement(sqlUPD);
        statementWD.executeUpdate();
    } catch (error) {

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }


}

function f_getIDLista(pServiceCode, pAPIKey, pCodLista) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pricing-tables/erp/' + pCodLista + '?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = gson.toJson(data)

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        // throw "Lista não Encontrada - cod: " + pCodLista;
        retorno = null;
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function f_enviaDados(pServiceCode, pAPIKey, pJson, pDataset) {
    try {
        var retorno = null;
        var metodo = "POST";
        var wServiceCode = pServiceCode;
        var params = {};
        // var Endpoint = '/api/customers?api_key=' + pAPIKey;
        var Endpoint = '/api/customers/multiples?api_key=' + pAPIKey;
        var gson = new com.google.gson.Gson();

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: Endpoint,
            timeoutService: "240",
            method: metodo,
        };


        // if (pAPI == undefined) {
        params = gson.toJson(pJson);

        // }
        // params = pJson;

        var headers = {};
        headers["content-type"] = "application/json";
        headers["Accept"] = "application/json";

        data["headers"] = headers;
        // data["params"] = params;
        data["strParams"] = params;

        var jj = gson.toJson(data)

        var vo = clientService.invoke(jj);


        if (vo.httpStatusResult != "200") {
            // pDataset.addRow(new Array("Envio " + gson.toJson(params)));
            retorno = {
                status: false,
                mensagem: JSON.parse(vo.getResult())
            }
        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = {
                status: true,
                mensagem: jr
            }
        }

    } catch (error) {
        pDataset.addRow(new Array("Erro f_enviaDados: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return retorno;
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

function f_getDadosVelis(pCodEmpresa, pData, Ddataset, pIndAcao) {
    try {
        var wRetorno = null;
        var gson = new com.google.gson.Gson();
        var wEmpresa = [];

        var constraints = new Array();
        if (pCodEmpresa != '' && pCodEmpresa != undefined) {
            constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
        }
        var dataset = DatasetFactory.getDataset("kbt_t_param_velis", null, constraints, null);
        if (dataset != null) {

            for (var u = 0; u < dataset.rowsCount; u++) {

                if (pIndAcao == 'S') {
                    try {
                        // f_gravaIntegracao(pCodEmpresa, pData.idErp, pData, Ddataset)
                        var retorno = f_enviaDados(dataset.getValue(u, "nom_servico"), dataset.getValue(u, "api_key"), pData, Ddataset);
                        // var data = {
                        //     status: true,
                        //     empresa: pCodEmpresa,
                        //     retorno: retorno
                        // }
                        printLog('info', 'JsonClientesData: Rettorno: ' + gson.toJson(data));
                        // Ddataset.addRow(new Array(gson.toJson(data)));
                        // f_gravaIntegracao(pCodEmpresa, pData.idErp, retorno, Ddataset)
                        wRetorno = retorno;
                    } catch (error) {
                        var data = {
                            status: false,
                            empresa: '',
                            retorno: error
                        }
                        wRetorno = data;
                    }

                } else {
                    var data = {
                        EMRPESA: dataset.getValue(u, "cod_empresa"),
                        SERVICO: dataset.getValue(u, "nom_servico"),
                        API_KEY: dataset.getValue(u, "api_key")
                    }

                    wEmpresa.push(data);
                }

            }
            if (pIndAcao == 'N') {
                wRetorno = wEmpresa;
            }

        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro f_getDadosVelis: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}

function f_logIntegracao(pIndRegistro, pCodEmpresa, pCodRegistro, pJson, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select * from kbt_t_log_velis where json is null ";
        SQL += pIndRegistro != '' ? " and upper(indreg) = '" + pIndRegistro.toUpperCase() + "'" : " ";
        SQL += pCodEmpresa != '' ? " and cod_empresa = '" + pCodEmpresa + "'" : " ";
        SQL += pCodRegistro != '' ? " and cod_registro = '" + pCodRegistro + "'" : " ";
        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        // newDataset.addRow(new Array(false, "SQL: " + SQL));
        while (rsWD.next()) {
            // newDataset.addRow(new Array(false, "Encontros os registros"));
            var SQL = "update kbt_t_log_velis set json = '" + pJson + "' where 1=1 ";
            SQL += pIndRegistro != '' ? " and upper(indreg) = '" + pIndRegistro.toUpperCase() + "'" : " ";
            SQL += pCodEmpresa != '' ? " and cod_empresa = '" + pCodEmpresa + "'" : " ";
            SQL += pCodRegistro != '' ? " and cod_registro = '" + pCodRegistro + "'" : " ";
            statementWD = connectionWD.prepareStatement(SQL);
            statementWD.executeUpdate();
        }

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}