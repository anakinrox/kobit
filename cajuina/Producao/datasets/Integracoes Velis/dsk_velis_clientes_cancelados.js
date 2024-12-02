var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        printLog("info", "## Integração Clientes Cancelados START ##");
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
        printLog("info", "## Integração Clientes Cancelados START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

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
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var gson = new com.google.gson.Gson();
        var wCLientes = 1;


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
        SQL += "    nvl((select(credcad_cli.val_pedidos + val_cheques + val_debito_a_venc + val_debito_vencido)from credcad_cli where COD_CLIENTE = c.cod_cliente), 0)  as limiteUsado, ";
        SQL += "    c.ies_situacao ";
        SQL += " from clientes c ";
        SQL += "        inner join CLI_CANAL_VENDA clic on clic.COD_TIP_CARTEIRA = 01 ";
        SQL += "            and(clic.cod_cliente = c.cod_cliente) ";
        SQL += "        inner join caj_velis_clientes cjV on (cjV.cod_cliente=c.cod_cliente) ";
        SQL += "    left join vdp_cli_fornec_cpl vdp_cpl on c.cod_cliente = vdp_cpl.cliente_fornecedor  ";
        SQL += "                                        and c.ies_cli_forn = vdp_cpl.tip_cadastro ";
        SQL += "    left join vdp_tip_logradouro logra on vdp_cpl.tip_logradouro = logra.tip_logradouro  ";
        SQL += "    left join cidades cid on c.cod_cidade = cid.cod_cidade ";
        SQL += " where c.cod_tip_cli not in ('98', '99') ";
        SQL += " and c.ies_situacao in ('C')";
        // SQL += " and c.cod_cliente ='001781154000120' ";

        var statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();

        // rsWD.last();
        // var wTotalClientes = 10;
        var wTotalClientes = 2744
        // rsWD.beforeFirst();
        while (rsWD.next()) {
            printLog('info', 'Cancelando cliente: ' + wCLientes + ' de ' + wTotalClientes);
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
                notes: "",
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

            var wAPI = f_getDadosVelis('', '', newDataset, 'N');
            if (wAPI != null) {
                for (var i = 0; i < wAPI.length; i++) {
                    var wCodLista = '';
                    // data.pricingTable = null;
                    newDataset.addRow(new Array("Empresa  " + wAPI[i].EMRPESA + " - Cliente: " + rsWD.getString("cod_cliente") + " | " + rsWD.getString("razao")));
                    var SQLLista = "select PARAMETRO_VAL from vdp_emp_cli_par where Parametro = 'lista_preco_cliente' and EMPRESA = '" + wAPI[i].EMRPESA + "' and cliente = '" + rsWD.getString("cod_cliente").trim() + "' ";
                    var statementWD = connectionWD.prepareStatement(SQLLista);
                    var rsWD2 = statementWD.executeQuery();
                    while (rsWD2.next()) {
                        if (rsWD2.getString("PARAMETRO_VAL") != null && rsWD2.getString("PARAMETRO_VAL") != '') {
                            var lData = {
                                b2b: false,
                                defaultAtCustomerCreation: true,
                                description: "",
                                discount: 0,
                                email: "",
                                enabled: true,
                                id: null,
                                idErp: rsWD2.getString("PARAMETRO_VAL") + "",
                                maxDiscount: 0,
                                name: ""
                            }

                            data.pricingTable = lData;
                            wCodLista = rsWD2.getString("PARAMETRO_VAL");
                        }
                    }
                    if (rsWD2 != null) rsWD2.close();

                    if (wCodLista != '' && wCodLista != undefined) {
                        data.pricingTable = null;
                    }


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
                    var wCondicao = '';

                    var SQLLista = "  select vdp_emp_cli_par.parametro_val cond_pgto "
                    SQLLista += " from vdp_emp_cli_par "
                    SQLLista += " where vdp_emp_cli_par.parametro = 'cj_cod_cnd_pgto' "
                    SQLLista += " and vdp_emp_cli_par.cliente = '" + rsWD.getString("cod_cliente").trim() + "'";
                    SQLLista += "                     union "
                    SQLLista += " select cond_pgto.cod_cnd_pgto "
                    SQLLista += " from cond_pgto "
                    SQLLista += " where cond_pgto.situacao = 'A' "
                    SQLLista += " and cond_pgto.ies_tipo = 'V'";
                    var statementWD = connectionWD.prepareStatement(SQLLista);
                    var rsWD2 = statementWD.executeQuery();
                    while (rsWD2.next()) {
                        if (wCondicao == '') {
                            wCondicao = rsWD2.getString("cond_pgto").trim();
                        } else {
                            wCondicao = wCondicao + ',' + rsWD2.getString("cond_pgto").trim();
                        }
                        // wCondicao.push(rsWD2.getString("cond_pgto").trim())
                    }

                    if (wCondicao != '') {
                        data.paymentTermsIdsErp = wCondicao;
                    }

                    if (rsWD2 != null) rsWD2.close();

                    // newDataset.addRow(new Array("JSON  " + gson.toJson(data)));
                    // printLog('info', "JSON Clientes " + gson.toJson(data));
                    var retorno = f_getDadosVelis(wAPI[i].EMRPESA, data, newDataset, 'S');


                }

            }
            wCLientes++;
        }


    } catch (error) {
        newDataset.addRow(new Array("Erro Geral: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

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
        var Endpoint = '/api/customers?api_key=' + pAPIKey;
        var gson = new com.google.gson.Gson();

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: wServiceCode,
            endpoint: Endpoint,
            timeoutService: "240",
            method: metodo,
        };

        params = pJson;

        var headers = {};
        headers["content-type"] = "application/json";
        headers["Accept"] = "application/json";

        data["headers"] = headers;
        data["params"] = params;

        var jj = gson.toJson(data)

        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            pDataset.addRow(new Array("Envio " + gson.toJson(params)));
            throw "Retorno esta vazio";

        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
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
                        // Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
                        f_gravaIntegracao(pCodEmpresa, pData.idErp, retorno, Ddataset)
                        wRetorno = true;
                    } catch (error) {
                        wRetorno = false;
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