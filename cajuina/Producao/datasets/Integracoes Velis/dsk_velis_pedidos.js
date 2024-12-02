var debug = false;
function defineStructure() {
    // addColumn('status');
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {
        var newDataset;
        printLog("info", "## Integração Pedidos START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');
        newDataset.addColumn('mensagem');

        f_integrar(newDataset);

    } catch (error) {

    } finally {
        return newDataset;
    }
}


function f_integrar(newDataset) {
    try {
        var gson = new com.google.gson.Gson();

        var wAPI = f_getDadosVelis('', '', newDataset, 'N');
        for (var i = 0; i < wAPI.length; i++) {

            var wRetorno = f_getPedidosPendente(wAPI[i].SERVICO, wAPI[i].API_KEY, newDataset);
            for (var x = 0; x < wRetorno.length; x++) {

                try {

                    // newDataset.addRow(new Array("Pedido: " + wRetorno[x].id + ' da empres: ' + wAPI[i].EMRPESA));
                    // if (wRetorno[x].id != 34627) {
                    //     continue;
                    // }

                    // newDataset.addRow(new Array("Carregando pedidos da empresa: "));

                    var wPedido = f_getPedidos(wAPI[i].SERVICO, wAPI[i].API_KEY, wRetorno[x].id, newDataset);
                    // newDataset.addRow(new Array("P: " + gson.toJson(wPedido)));

                    var wRetLogix = f_getPedidoLogix(wAPI[i].EMRPESA, wPedido.order.customer.idErp, wPedido.order.salesman.idErp, wRetorno[x].id);
                    // newDataset.addRow(new Array("P_L: " + gson.toJson(wRetLogix)));
                    if (wRetLogix.achou) {
                        f_atualizaIntegracao(wAPI[i].SERVICO, wAPI[i].API_KEY, newDataset, wRetorno[x].id, wRetLogix.pedido)
                        continue;
                    }

                    var lr_parametros = {};
                    lr_parametros["consistir_pedido"] = "N";

                    var lr_principal = {};
                    var dataHoje = dataAtualFormatada();

                    lr_principal["cod_empresa"] = wAPI[i].EMRPESA + "";
                    lr_principal["num_pedido"] = 0 + "";
                    lr_principal["cod_cliente"] = wPedido.order.customer.idErp + "";
                    lr_principal["dat_emis_repres"] = dataHoje + "";

                    lr_principal["cod_nat_oper"] = wPedido.order.salesOrderType.idErp + "";

                    lr_principal["ies_finalidade"] = f_getFinalidadeCliente(wPedido.order.customer.idErp, newDataset) + ""; //"1"; // fixo
                    lr_principal["cod_cnd_pgto"] = wPedido.order.paymentTerms.idErp + "";
                    lr_principal["ies_tip_entrega"] = "3";
                    lr_principal["cod_tip_venda"] = "1";
                    lr_principal["cod_tip_carteira"] = "01";

                    var lr_representante = {};
                    lr_representante["ies_comissao"] = "N";
                    lr_representante["pct_comissao"] = "0";
                    lr_representante["cod_repres"] = wPedido.order.salesman.idErp + "";

                    var lr_adicionais = {};
                    lr_adicionais["num_pedido_repres"] = wRetorno[x].id + "";
                    lr_adicionais["num_pedido_cli"] = wRetorno[x].id + "";
                    lr_adicionais["cod_local_estoq"] = "";
                    lr_adicionais["pedido_pallet"] = "N";
                    lr_adicionais["pct_tolera_minima"] = 0 + "";
                    lr_adicionais["pct_tolera_maxima"] = 0 + "";
                    lr_adicionais["dat_min_fat"] = "";
                    lr_adicionais["nota_empenho"] = "";
                    lr_adicionais["contrato_compra"] = "";
                    lr_adicionais["forma_pagto"] = wPedido.order.paymentForms.idErp + "";
                    lr_adicionais["processo_export"] = "";
                    lr_adicionais["numero_cno_esocial"] = null;
                    lr_adicionais["cnpj_cpf_subempreiteiro"] = "";

                    var lr_frete = {};
                    lr_frete["cod_transpor"] = null;
                    lr_frete["cod_consig"] = null;
                    lr_frete["ies_frete"] = "1";
                    lr_frete["ies_embal_padrao"] = "3";
                    lr_frete["pct_frete"] = 0 + "";

                    var lr_compl_nfe = {};
                    lr_compl_nfe["modalidade_frete_nfe"] = "0";
                    lr_compl_nfe["inf_adic_fisco"] = "";
                    lr_compl_nfe["dat_saida"] = "";
                    lr_compl_nfe["hor_saida"] = "";

                    var lr_preco_desconto = {};
                    lr_preco_desconto["ies_preco"] = "F";
                    lr_preco_desconto["pct_desc_financ"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_adic"] = 0.0 + "";
                    lr_preco_desconto["num_list_preco"] = wPedido.order.pricingTable.idErp + "";
                    lr_preco_desconto["cod_moeda"] = "1";
                    lr_preco_desconto["tip_desc"] = "1";
                    lr_preco_desconto["pct_desc_1"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_2"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_3"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_4"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_5"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_6"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_7"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_8"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_9"] = 0.0 + "";
                    lr_preco_desconto["pct_desc_10"] = 0.0 + "";
                    lr_preco_desconto["regra_cotacao"] = "P";
                    lr_preco_desconto["val_cotacao_fixa"] = "";
                    lr_preco_desconto["data_vigencia"] = "";


                    var lr_textos_pedido = {};
                    var wLinha = 1;
                    var wCount = 0;
                    var wLimite = 76;
                    var wObservacao = '';
                    if (wPedido.order.notes != null && wPedido.order.notes != '') {
                        wObservacao = wPedido.order.notes.replace(/(\r\n|\n|\r)/gm, "");
                    }

                    while (wCount < wObservacao.length) {
                        if (wLinha == 1) {
                            lr_textos_pedido["den_texto_1"] = wObservacao.substring(wCount, wLimite) + "";
                            wLinha = 2;
                            wCount = wCount + wLimite;
                            continue;
                        }
                        if (wLinha == 2) {
                            lr_textos_pedido["den_texto_2"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                            wLinha = 3
                            wCount = wCount + wLimite;
                            continue;
                        }
                        if (wLinha == 3) {
                            lr_textos_pedido["den_texto_3"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                            wLinha = 4
                            wCount = wCount + wLimite;
                            continue;
                        }
                        if (wLinha == 4) {
                            lr_textos_pedido["den_texto_4"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                            wLinha = 0
                            wCount = wCount + wLimite;
                            continue;
                        }

                        if (wLinha == 0) {
                            wCount = wCount + wLimite;
                        }
                    }


                    var lr_entrega = {};
                    var lst_la_pedido_itens = [];
                    var lst_la_aen_pedido = [];
                    var la_aen_pedido = {};

                    if (wPedido.items.length == 0) {
                        continue;
                    }

                    for (var y = 0; y < wPedido.items.length; y++) {
                        var la_pedido_itens = {};
                        la_pedido_itens["ind_bonificacao"] = "N";
                        la_pedido_itens["sequencia_item"] = y + 1 + "";

                        la_pedido_itens["cod_item"] = wPedido.items[y].product.idErp + "";
                        la_pedido_itens["pct_desc_adic"] = parseFloat(wPedido.items[y].percentDiscount) > 0 ? (parseFloat(wPedido.items[y].percentDiscount) * 100) + "" : "0";

                        la_pedido_itens["pre_unit"] = parseFloat(wPedido.items[y].unitValueWithoutDiscount) + "";
                        la_pedido_itens["qtd_pecas_solic"] = wPedido.items[y].quantity + "";
                        la_pedido_itens["prz_entrega"] = dataHoje + "";

                        la_pedido_itens["val_frete_unit"] = 0 + "";
                        la_pedido_itens["val_seguro_unit"] = 0 + "";
                        la_pedido_itens["pct_desc_1"] = 0;
                        la_pedido_itens["pct_desc_2"] = 0 + "";
                        la_pedido_itens["pct_desc_3"] = 0 + "";
                        la_pedido_itens["pct_desc_4"] = 0 + "";
                        la_pedido_itens["pct_desc_5"] = 0 + "";
                        la_pedido_itens["pct_desc_6"] = 0 + "";
                        la_pedido_itens["pct_desc_7"] = 0 + "";
                        la_pedido_itens["pct_desc_8"] = 0 + "";
                        la_pedido_itens["pct_desc_9"] = 0 + "";
                        la_pedido_itens["pct_desc_10"] = 0 + "";

                        var wLinha = 1;
                        var wCount = 0;
                        var wLimite = 76
                        var wObservacao;
                        if (wPedido.items[y].notes != '' && wPedido.items[y].notes != null) {
                            wObservacao = wPedido.items[y].notes.replace(/(\r\n|\n|\r)/gm, "");
                        }

                        while (wCount < wObservacao.length) {
                            if (wLinha == 1) {
                                la_pedido_itens["den_texto_1"] = wObservacao.substring(wCount, wLimite) + "";
                                wLinha = 2;
                                wCount = wCount + wLimite;
                                continue;
                            }
                            if (wLinha == 2) {
                                la_pedido_itens["den_texto_2"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                                wLinha = 3
                                wCount = wCount + wLimite;
                                continue;
                            }
                            if (wLinha == 3) {
                                la_pedido_itens["den_texto_3"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                                wLinha = 4
                                wCount = wCount + wLimite;
                                continue;
                            }
                            if (wLinha == 4) {
                                la_pedido_itens["den_texto_4"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                                wLinha = 5
                                wCount = wCount + wLimite;
                                continue;
                            }
                            if (wLinha == 5) {
                                la_pedido_itens["den_texto_5"] = wObservacao.substring(wCount, (wLimite * wLinha)) + "";
                                wLinha = 0
                                wCount = wCount + wLimite;
                                continue;
                            }

                            if (wLinha == 0) {
                                wCount = wCount + wLimite;
                            }
                        }

                        la_pedido_itens["xped"] = "";
                        la_pedido_itens["nitemped"] = "";
                        lst_la_pedido_itens.push(la_pedido_itens);
                    }

                    newDataset.addRow(new Array("Enviando Pedido para logix: " + wRetorno[x].id + ' da empres: ' + wAPI[i].EMRPESA));

                    var wRetFluig = f_incluiPedidoLogin(lr_parametros,
                        lr_principal,
                        lr_representante,
                        lr_adicionais,
                        lr_frete,
                        lr_compl_nfe,
                        lr_preco_desconto,
                        lr_entrega,
                        lr_textos_pedido,
                        lst_la_pedido_itens,
                        lst_la_aen_pedido);

                    if (wRetFluig.data.pedido != null) {
                        var wRetorno2 = f_atualizaIntegracao(wAPI[i].SERVICO, wAPI[i].API_KEY, newDataset, wRetorno[x].id, wRetFluig.data.pedido);
                        f_atualizaLimite(wPedido.order.customer.idErp, newDataset);
                    } else {
                        f_gravaLog('dsk_velis_pedidos', wAPI[i].EMRPESA, wRetorno[x].id, "Pedido Velis: " + wRetorno[x].id + ' empresa: ' + wAPI[i].EMRPESA + ' Erro: ' + gson.toJson(wRetFluig), newDataset);
                    }
                } catch (error) {
                    // newDataset.addRow(new Array("Erro: " + error.toString() + error.lineNumber));

                    f_gravaLog('dsk_velis_pedidos', wAPI[i].EMRPESA, wRetorno[x].id, "Pedido Velis: " + wRetorno[x].id + ' empresa: ' + wAPI[i].EMRPESA + ' Erro: ' + error.toString() + ' : Linha:' + error.lineNumber, newDataset);
                    continue;
                }
            }
        }

        newDataset.addRow(new Array(true, ''));

    } catch (error) {
        newDataset.addRow(new Array(false, "Erro: " + error + " - Linha: " + error.lineNumber));
        f_gravaLog('dsk_velis_pedidos', '', '', '', error, newDataset);
    } finally {
        // return newDataset;
    }
}


function onMobileSync(user) {

}

function f_atualizaIntegracao(pServiceCode, pAPIKey, dataset, pIdPedidoVelis, pNumPedidoLogix) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pedidos/' + pIdPedidoVelis + '/status?idErp=' + pNumPedidoLogix + '&api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    // dataset.addRow(new Array("endPoint: " + Endpoint))

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // params = gson.toJson(pJson);

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = gson.toJson(data)
    // dataset.addRow(new Array("Data: " + pJson));

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function f_incluiPedidoLogin(pParametros, pPrincipal, pRepresentante, pAdicionais, pFrete, pComplNfe, pDesconto, pEntrega, pTextos, pItensPed, pAEN) {

    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var gson = new com.google.gson.Gson();
        var retorno = null;

        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "LogixRest",
            endpoint: "/vdpr0001/incluiPedidoVenda",
            timeoutService: "240",
            method: "post"
        };

        var headers = {};
        headers["Content-Type"] = "application/json;charset=UTF-8";
        data["headers"] = headers;

        var options = {};
        options["encoding"] = "UTF-8";
        options["mediaType"] = "application/json";
        data["options"] = options;

        var params = {};

        params["lr_parametros"] = pParametros;
        params["lr_principal"] = pPrincipal;
        params["lr_representante"] = pRepresentante;
        params["lr_adicionais"] = pAdicionais;
        params["lr_cliente_interm"] = {};
        params["lr_frete"] = pFrete;

        params["la_consignatario_adic"] = {};

        params["lr_compl_nfe"] = pComplNfe;
        params["lr_preco_desconto"] = pDesconto;
        params["lr_entrega"] = pEntrega;
        params["lr_textos_pedido"] = pTextos;

        params["la_pedido_itens"] = pItensPed;
        params["la_aen_pedido"] = {};


        params["la_remessa_item"] = {};
        params["lr_retirada"] = {};
        params["lr_nf_referencia"] = {};
        params["lr_vendor"] = {};
        params["lr_embarque"] = {};
        params["la_processo_refer"] = {};
        params["la_comissao_item"] = {};
        params["la_pedido_exportacao"] = {};
        params["la_grades_item"] = {};
        params["la_prazo_grade"] = {};


        data["params"] = params;

        printLog("info", "JSON Pedido: " + gson.toJson(data));


        var jj = gson.toJson(data)
        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            retorno = jr;
            printLog("info", "JSON Retorno: " + gson.toJson(retorno));
        }

    } catch (error) {

    } finally {
        printLog("info", "JSON Retorno: " + gson.toJson(retorno));
        return retorno;
    }
}

function f_getPedidosPendente(pServiceCode, pAPIKey, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pedidos/f/103?api_key=' + pAPIKey;
    // var Endpoint = '/api/pedidos/f/102?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // params = gson.toJson(pJson);

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = gson.toJson(data)
    // dataset.addRow(new Array("Data: " + pJson));

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function f_getPedidos(pServiceCode, pAPIKey, pNumPedido, dataset) {
    var retorno = null;
    var metodo = "GET";
    var wServiceCode = pServiceCode;
    var params = {};
    var Endpoint = '/api/pedidos/' + pNumPedido + '?api_key=' + pAPIKey;
    var gson = new com.google.gson.Gson();

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    // params = gson.toJson(pJson);

    var headers = {};
    headers["content-type"] = "application/json";
    headers["Accept"] = "application/json";

    data["headers"] = headers;
    data["params"] = params;

    var jj = gson.toJson(data)
    // dataset.addRow(new Array("Data: " + pJson));

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function dataAtualFormatada(pDias, pAcao, pData) {
    if (pData == undefined) {
        var data = new Date();
    } else {
        var data = new Date(toISOFormat(pData));
    }



    var dia = data.getDate().toString();
    if (pAcao != undefined && pAcao != '') {
        if (pAcao == '+') { dia = (data.getDate() + parseInt(pDias)).toString(); }
        if (pAcao == '-') { dia = (data.getDate() - parseInt(pDias)).toString(); }
    }
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF;
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
            for (var i = 0; i < dataset.rowsCount; i++) {
                if (pIndAcao == 'S') {
                    var retorno = f_enviaDados(dataset.getValue(i, "nom_servico"), dataset.getValue(i, "api_key"), pData);
                    Ddataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
                    wRetorno = true;
                } else {
                    var data = {
                        EMRPESA: dataset.getValue(i, "cod_empresa"),
                        SERVICO: dataset.getValue(i, "nom_servico"),
                        API_KEY: dataset.getValue(i, "api_key")
                    }

                    wEmpresa.push(data);
                }
            }
            if (pIndAcao == 'N') {
                wRetorno = wEmpresa;
            }

        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        return wRetorno;
    }

}


function f_atualizaLimite(pCodCliente, Ddataset) {
    try {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('cliente', pCodCliente, pCodCliente, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_velis_clientes_limite", null, constraints, null);
        if (dataset != null) {
            // for (var i = 0; i < dataset.rowsCount; i++) {
            //     var wRetorno = JSON.parse(dataset.getValue(i, "retorno"));
            //     Ddataset.addRow(JSON.parse(dataset.getValue(i, "retorno")));
            // }
        }
    } catch (error) {
        Ddataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    }

}

function f_getRepresentanteLogix(pCodRepres) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var wCodRepres = null;


        var SQL = "select cod_repres, raz_social, id_cad_intermediador  from representante where upper(id_cad_intermediador) = upper('" + tokenAgente + "')";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wCodRepres = rsWD.getString("cod_repres");
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wCodRepres;
    }
}

function f_getPedidoLogix(pCodEmpresa, pCodCliente, pCodRepres, pNumPedidoVelis) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var wRetorno = {
            achou: false,
            pedido: 0
        };


        var SQL = "select num_pedido from pedidos where cod_empresa = '" + pCodEmpresa + "' and cod_cliente = '" + pCodCliente + "' and cod_repres = '" + pCodRepres + "' and num_pedido_repres = '" + pNumPedidoVelis + "'";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wRetorno.achou = true;
            wRetorno.pedido = rsWD.getString("num_pedido") + "";
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wRetorno;
    }
}

function f_getFinalidadeCliente(pCodCLiente, dataset) {
    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        var connectionWD = dataSourceWD.getConnection();
        var wFinalidade = 1;

        // dataset.addRow(new Array("Codigo: " + pCodCLiente));

        var SQL = "select cod_cliente, trim(ins_estadual) as ins_estadual from clientes where cod_cliente = '" + pCodCLiente + "'";
        // var SQL = "select trim(texto_parametro) as texto_parametro from VDP_CLI_PARAMETRO where cliente = '" + pCodCLiente + "' and PARAMETRO = 'finalidade'";
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            if (rsWD.getString("ins_estadual") == '' || rsWD.getString("ins_estadual") == null || rsWD.getString("ins_estadual") == 'ISENTO') {
                wFinalidade = 3
            } else {
                wFinalidade = 1;
            }
        }


    } catch (error) {
        dataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wFinalidade;
    }
}

function f_gravaLog(pNomeDataset, pChave1, pChave2, pLog, newDataset) {
    try {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('dataset', pNomeDataset, pNomeDataset, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('chave1', pChave1, pChave1, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('chave2', pChave2, pChave2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('log', pLog, pLog, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_velis_log_integracao", null, constraints, null);

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {

    }
}