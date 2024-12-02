var conexaoLogix = "java:/jdbc/testeLogix";
// var conexaoLogix = "java:/jdbc/LogixDS";

function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        printLog("info", "## Integração Usuarios Fluig START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('status');

    } catch (error) {

    } finally {
        return newDataset;
    }

}

function createDataset(fields, constraints, sortFields) {
    try {
        printLog("info", "## Integração Usuarios Fluig START ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('status');

        // f_desativarUsuario(newDataset);
        f_importarPedido(newDataset);


    } catch (error) {

    } finally {
        return newDataset;
    }

}

function f_dataSubtraiDias() {
    var time = new Date();
    var outraData = new Date();
    outraData.setDate(time.getDate() - 120);
    return outraData;
}

function f_importarPedido(newDataset) {
    var connectionWD = null;
    var statementWD = null;
    var rsWD = null;
    var gson = new com.google.gson.Gson();

    try {
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select " +
            "    kPed.numPedProcess, " +
            "    kPed.tipoPedido, " +
            "    kPed.idAPI, " +
            "    kPed.cnpjceramfix, " +
            "    kAPI.cnpj as cnpjIntegrador " +
            "from kbt_t_api_pedidos kPed " +
            "    inner join kbt_t_api_token kAPI on(kAPI.id = kPed.idAPI) " +
            "where kPed.processado = 'L'";

        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            // ######### Montar todos os dados necessário para integrações #################
            const wDadosPedido = f_getDadosPedido(rsWD.getString("numPedProcess"), newDataset);
            const wDadosEmpresa = f_getDadosUnidadeCeramfix(rsWD.getString("cnpjceramfix"), newDataset);
            const wDadosIntegrador = f_getDadosIntegrador(rsWD.getString("cnpjIntegrador"), newDataset);
            const wDadosCliente = f_getDadosCliente(wDadosPedido.dadosRemessa.cnpj, newDataset);
            const wDadosTransportadora = wDadosPedido.dadosTransp != null ? f_getDadosTransportadora(wDadosPedido.dadosTransp.cnpj, newDataset) : null;
            const wParametrosIntegracao = f_getParametrosIntegracao(wDadosEmpresa.codEmpresa, wDadosIntegrador.codIntegrador, wDadosCliente.codCliente, wDadosPedido.dadosCapa.tipoPedido, newDataset);
            // #############################################################################

            if (wDadosEmpresa == null) {
                newDataset.addRow(new Array("Unidade Ceramfix informado está incorreto! "));
                continue;
            }

            if (wDadosIntegrador == null) {
                newDataset.addRow(new Array("Não encontrado os dados para o integrador do pedido! "));
                continue;
            }

            if (wDadosCliente == null) {
                newDataset.addRow(new Array("Não encontrado os dados para o cliente do pedido! Fazer o cadastro "));
                const retCad = f_cadastraCliente(wDadosCliente.dadosRemessa, wParametrosIntegracao, newDataset);
                if (retCad.data.retorno != true) {
                    newDataset.addRow(new Array("Erro ao cadastrar clientes "));
                    continue;
                }
                wDadosCliente.codCliente = retCad.data.cod_cliente;
            }

            if (wDadosTransportadora == null && wDadosPedido.dadosTransp != null) {
                const retCadTransp = f_cadastraCliente(wDadosPedido.dadosTransp, wParametrosIntegracao, newDataset);
                if (retCadTransp.data.retorno != true) {
                    newDataset.addRow(new Array("Erro ao cadastrar Transportadora! "));
                    continue;
                }
                wDadosTransportadora.codTransportadora = retCadTransp.data.cod_cliente;
            }

            if (wParametrosIntegracao == null) {
                newDataset.addRow(new Array("Não encontrado os Parametros pra importar o pedido!"));
                continue;
            }

            if (wDadosPedido.dadosCapa.numPedidoVenda == null || wDadosPedido.dadosCapa.numPedidoVenda == '') {
                const retPedidoVenda = f_incluiPedido('F', wDadosEmpresa, wDadosIntegrador, wDadosCliente, wDadosTransportadora, wParametrosIntegracao, wDadosPedido, newDataset);
                if (retPedidoVenda.data.pedido == undefined) {
                    newDataset.addRow(new Array("Erro ao Incluir pedido de Faturamento!"));
                    newDataset.addRow(new Array("M:" + retPedidoVenda.data.mensagens));
                    continue;
                }
                // Atualizar número do pedido de Faturamento
                f_atualizaProcess('F', rsWD.getString("numPedProcess"), retPedidoRemessa.data.pedido, newDataset)
            }

            const retPedidoRemessa = f_incluiPedido('R', wDadosEmpresa, wDadosIntegrador, wDadosCliente, wDadosTransportadora, wParametrosIntegracao, wDadosPedido, newDataset);
            if (retPedidoRemessa.data.pedido == undefined) {
                newDataset.addRow(new Array("Erro ao Incluir pedido de Remessa!"));
                newDataset.addRow(new Array("M: " + gson.toJson(retPedidoRemessa)));
                continue;
            }
            // Atualizar número do pedido de Remesssa
            f_atualizaProcess('R', rsWD.getString("numPedProcess"), retPedidoRemessa.data.pedido, newDataset)

        }

    } catch (error) {
        newDataset.addRow(new Array("Importar Pedido: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_atualizaProcess(indPedido, pNumProcess, pNumPedido, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "update kbt_t_api_pedidos set ";
        if (indPedido == "F") { SQL += "numpedidovenda" } else { SQL += "numpedidoremessa" + " = ?" }
        if (indPedido == "R") SQL += ", processado='S'";
        SQL += " where numpedprocess = ?";
        // newDataset.addRow(new Array('SQL: ' + SQL));
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setInt(1, parseInt(pNumPedido))
        statementWD.setInt(2, parseInt(pNumProcess))
        statementWD.executeUpdate();

        return true;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
        return false;
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_incluiPedido(pIndPedido, objDataEmp, objDataIntegrador, objDataCli, objDataTransp, objDataIntegracacao, objDataPedido, newDataset) {
    try {
        var gson = new com.google.gson.Gson();
        var params = {};

        var dtNow = new java.util.Date();
        var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
        var dataTxt = "" + sdf.format(dtNow).substring(0, 10);
        var dataCadTxt = "" + getValueInt("", dataTxt).split('/').reverse().join('-');

        const wCodCliente = pIndPedido == 'F' ? objDataIntegrador.codIntegrador : objDataCli.codCliente;
        const wcodNatureza = pIndPedido == 'F' ? objDataIntegracacao.codNatureza_fat : objDataIntegracacao.codNatureza_rem;
        const wCodFinalidade = pIndPedido == 'F' ? objDataIntegracacao.codFinalidade_fat : objDataIntegracacao.codFinalidade_rem;
        const wCodPgto = pIndPedido == 'F' ? objDataIntegracacao.condPgto_fat : objDataIntegracacao.condPgto_rem;
        const wCodTipoEntrega = pIndPedido == 'F' ? objDataIntegracacao.codTipoEntrega_fat : objDataIntegracacao.codTipoEntrega_rem;
        const wCodCarteira = pIndPedido == 'F' ? objDataIntegracacao.codCarteira_fat : objDataIntegracacao.codCarteira_rem;
        const wCodMoeda = pIndPedido == 'F' ? objDataIntegracacao.codMoeda_fat : objDataIntegracacao.codMoeda_rem;
        const wCodListaPreco = pIndPedido == 'F' ? objDataIntegracacao.codListapreco_fat : objDataIntegracacao.codListapreco_rem;

        var lr_parametros = {};
        lr_parametros["consistir_pedido"] = "S";
        params["lr_parametros"] = lr_parametros;

        var lr_principal = {};
        lr_principal["cod_empresa"] = getValueInt(objDataEmp.codEmpresa, "") + "";
        lr_principal["num_pedido"] = 0;
        lr_principal["cod_cliente"] = getValueInt(wCodCliente, "") + "";
        lr_principal["dat_emis_repres"] = getValueInt(dataCadTxt, "") + "";
        lr_principal["cod_nat_oper"] = getValueInt(wcodNatureza, "") + "";

        lr_principal["ies_finalidade"] = getValueInt(wCodFinalidade, "0") + "";
        lr_principal["cod_cnd_pgto"] = getValueInt(wCodPgto, "0") + "";
        lr_principal["ies_tip_entrega"] = getValueInt(wCodTipoEntrega, "0") + "";
        lr_principal["cod_tip_venda"] = getValueInt("", "1") + "";
        lr_principal["cod_tip_carteira"] = getValueInt(wCodCarteira, "01") + "";

        params["lr_principal"] = lr_principal;

        var lr_representante = {};
        lr_representante["ies_comissao"] = getValueInt("", "N") + "";
        lr_representante["cod_repres"] = getValueInt("", "0") + "";
        lr_representante["pct_comissao"] = 0;
        lr_representante["cod_repres_adic"] = "";
        lr_representante["pct_comissao_2"] = 0;
        lr_representante["cod_repres_3"] = "";
        lr_representante["pct_comissao_3"] = 0;
        params["lr_representante"] = lr_representante;

        var lr_adicionais = {};
        lr_adicionais["num_pedido_repres"] = getValueInt(objDataPedido.dadosCapa.pedidoVenda, "") + "";
        lr_adicionais["num_pedido_cli"] = getValueInt(objDataPedido.dadosCapa.pedidoCompra, "") + "";
        lr_adicionais["cod_local_estoq"] = "";
        lr_adicionais["pedido_pallet"] = "N";
        lr_adicionais["pct_tolera_minima"] = 0;
        lr_adicionais["pct_tolera_maxima"] = 0;
        lr_adicionais["dat_min_fat"] = "";
        lr_adicionais["nota_empenho"] = "";
        lr_adicionais["contrato_compra"] = "";
        lr_adicionais["forma_pagto"] = "";
        lr_adicionais["processo_export"] = "";
        lr_adicionais["numero_cno_esocial"] = "";
        lr_adicionais["cnpj_cpf_subempreiteiro"] = "";
        params["lr_adicionais"] = lr_adicionais;

        var lr_frete = {};
        lr_frete["cod_transpor"] = "";
        if (objDataPedido.dadosTransp != null) {
            lr_frete["cod_transpor"] = objDataTransp.codTransportadora;
        }
        lr_frete["cod_consig"] = "";
        lr_frete["ies_frete"] = getValueInt(objDataPedido.dadosCapa.tipoFrete == "CIF" ? "1" : "0", "1") + "";
        lr_frete["ies_embal_padrao"] = "2";
        lr_frete["pct_frete"] = 0 + "";

        params["lr_frete"] = lr_frete;

        var lr_preco_desconto = {};
        lr_preco_desconto["ies_preco"] = "F";
        lr_preco_desconto["pct_desc_financ"] = "0";
        lr_preco_desconto["pct_desc_adic"] = "0";
        lr_preco_desconto["num_list_preco"] = getValueInt(wCodListaPreco, "") + "";
        lr_preco_desconto["cod_moeda"] = getValueInt(wCodMoeda, "") + "";
        lr_preco_desconto["tip_desc"] = null;
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

        params["lr_preco_desconto"] = lr_preco_desconto;

        var lr_entrega = {};
        lr_entrega["end_entrega"] = "";
        lr_entrega["den_bairro"] = "";
        lr_entrega["cod_cidade"] = "";
        lr_entrega["cod_cep"] = "";
        lr_entrega["num_cgc"] = "";
        lr_entrega["ins_estadual"] = "";
        lr_entrega["nom_cliente_end_ent"] = "";
        params["lr_entrega"] = lr_entrega;

        var lr_textos_pedido = {};
        lr_textos_pedido["tex_observ_1"] = getValueInt(objDataPedido.dadosCapa.obsNota, "") + "";
        lr_textos_pedido["tex_observ_2"] = "";
        lr_textos_pedido["den_texto_1"] = getValueInt(objDataPedido.dadosCapa.obsPedido, "") + "";
        lr_textos_pedido["den_texto_2"] = getValueInt("", "") + "";
        lr_textos_pedido["den_texto_3"] = getValueInt("", "") + "";
        lr_textos_pedido["den_texto_4"] = getValueInt("", "") + "";
        lr_textos_pedido["den_texto_5"] = getValueInt("", "") + ""
        params["lr_textos_pedido"] = lr_textos_pedido;

        var lst_la_pedido_itens = [];

        for (let i = 0; i < objDataPedido.dadosItens.length; i++) {
            var la_pedido_itens = {};
            var wValPreco = pIndPedido == 'F' ? objDataPedido.dadosItens[i].precoCompra : objDataPedido.dadosItens[i].precoVenda


            la_pedido_itens["ind_bonificacao"] = "N";
            la_pedido_itens["sequencia_item"] = (i + 1) + "";
            la_pedido_itens["cod_item"] = getValueInt(objDataPedido.dadosItens[i].coditem, "") + "";
            la_pedido_itens["pct_desc_adic"] = getValueFloat("0", "0") + "";
            la_pedido_itens["pre_unit"] = parseFloat(wValPreco) + "";
            la_pedido_itens["qtd_pecas_solic"] = getValueFloat(objDataPedido.dadosItens[i].quantidade, "0") + "";
            la_pedido_itens["prz_entrega"] = getValueInt(objDataPedido.dadosItens[i].datEntrega, "") + "";

            la_pedido_itens["val_frete_unit"] = 0 + "";
            la_pedido_itens["val_seguro_unit"] = 0 + "";
            la_pedido_itens["pct_desc_1"] = 0 + "";
            la_pedido_itens["pct_desc_2"] = 0 + "";
            la_pedido_itens["pct_desc_3"] = 0 + "";
            la_pedido_itens["pct_desc_4"] = 0 + "";
            la_pedido_itens["pct_desc_5"] = 0 + "";
            la_pedido_itens["pct_desc_6"] = 0 + "";
            la_pedido_itens["pct_desc_7"] = 0 + "";
            la_pedido_itens["pct_desc_8"] = 0 + "";
            la_pedido_itens["pct_desc_9"] = 0 + "";
            la_pedido_itens["pct_desc_10"] = 0 + "";

            la_pedido_itens["den_texto_1"] = getValueInt("", "") + "";
            la_pedido_itens["den_texto_2"] = getValueInt("", "") + "";
            la_pedido_itens["den_texto_3"] = getValueInt("", "") + "";
            la_pedido_itens["den_texto_4"] = getValueInt("", "") + "";
            la_pedido_itens["den_texto_5"] = getValueInt("", "") + "";
            la_pedido_itens["xped"] = getValueInt("", "") + "";
            la_pedido_itens["nitemped"] = getValueInt("", "") + "";

            lst_la_pedido_itens.push(la_pedido_itens);

        }
        params["la_pedido_itens"] = lst_la_pedido_itens;

        params["la_aen_pedido"] = [{}];
        params["lr_retirada"] = {};
        params["lr_compl_nfe"] = {};
        params["lr_nf_referencia"] = {};
        params["lr_cliente_interm"] = {};
        params["lr_vendor"] = {};
        params["lr_embarque"] = {};
        params["la_consignatario_adic"] = [{}];
        params["la_processo_refer"] = [{}];
        params["la_comissao_item"] = [{}];
        params["la_pedido_exportacao"] = [{}];
        params["la_remessa_item"] = [{}];
        params["la_grades_item"] = [{}];
        params["la_prazo_grade"] = [{}];

        newDataset.addRow(new Array("JSON Pedido: " + pIndPedido + " : " + gson.toJson(params)));

        const objSentLogix = f_enviaPedidoLogix(params, newDataset);
        // const objSentLogix = {
        //     data: {
        //         mensagens: "erro ao importar pedido"
        //     }
        // };

    } catch (error) {
        newDataset.addRow(new Array("Importar Pedido: " + error + " linha: " + error.lineNumber));
    }
    return objSentLogix;
}

function f_cadastraCliente(objDados, ObjParametros, newDataset) {
    try {
        var gson = new com.google.gson.Gson();
        var params = {};

        var lr_cliente = [];
        var lr_cliente_ = {};
        var dtNow = new java.util.Date();
        var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
        var dataTxt = "" + sdf.format(dtNow).substring(0, 10);
        var dataCadTxt = "" + getValueInt("", dataTxt).split('/').reverse().join('-');

        lr_cliente_["tipo_cadastro"] = "N";
        lr_cliente_["cod_cliente"] = "0" + objDados.cnpj.replace(".", "").replace(".", "").replace("/", "").replace("-", "") + "";
        lr_cliente_["cod_class"] = getValueInt("", "A") + "";
        lr_cliente_["nom_cliente"] = getValueInt(objDados.razao, "") + "";
        lr_cliente_["end_cliente"] = getValueInt(objDados.logradouro, "") + "";
        lr_cliente_["den_bairro"] = getValueInt(objDados.bairro, "bairro") + "";

        const objCidade = f_getCidadeLogix(objDados.ibge, newDataset);
        if (objCidade == null) {
            newDataset.addRow(new Array("Código IBGE:" + objDados.ibge + " não encontrado na base do Logix!, providenciar o cadastro primeiro"));
            return;
        }

        lr_cliente_["cod_cidade"] = getValueInt(objCidade.codCidade, "") + "";
        lr_cliente_["cod_cep"] = getValueInt(objDados.cep, "") + "";
        lr_cliente_["num_caixa_postal"] = "";
        lr_cliente_["num_telefone"] = getValueInt(objDados.telefone, "") + "";
        lr_cliente_["num_fax"] = getValueInt("", "") + "";
        lr_cliente_["num_telex"] = getValueInt("", "") + "";
        lr_cliente_["num_suframa"] = getValueInt("", "") + "";
        lr_cliente_["cod_tip_cli"] = getValueInt("tipo_cliente", "04") + "";
        lr_cliente_["den_marca"] = getValueInt("", "") + "";
        lr_cliente_["nom_reduzido"] = getValueInt(objDados.fantasia, "") + "";
        lr_cliente_["den_frete_posto"] = getValueInt("", "") + "";
        lr_cliente_["num_cgc_cpf"] = getValueInt(objDados.cnpj.length() == 18 ? '0' + objDados.cnpj : objDados.cnpj, "") + "";
        lr_cliente_["ins_estadual"] = getValueInt(objDados.inscricao, "") + "";
        lr_cliente_["cod_portador"] = getValueInt("", " ") + "";
        lr_cliente_["ies_tip_portador"] = getValueInt("", "") + "";
        lr_cliente_["cod_cliente_matriz"] = getValueInt("", "") + "";
        lr_cliente_["cod_consig"] = getValueInt("", "") + "";
        lr_cliente_["ies_cli_forn"] = getValueInt("", "C") + "";
        lr_cliente_["ies_zona_franca"] = getValueInt("", "N") + "";
        lr_cliente_["ies_situacao"] = getValueInt("", "A") + "";
        lr_cliente_["cod_rota"] = getValueInt("", "0") + "";
        lr_cliente_["cod_praca"] = getValueInt("", "0") + "";
        lr_cliente_["dat_cadastro"] = dataCadTxt + "";
        lr_cliente_["dat_atualiz"] = dataCadTxt + "";
        lr_cliente_["nom_contato"] = getValueInt("", "") + "";
        lr_cliente_["cod_local"] = getValueInt("", "0") + "";
        lr_cliente_["correio_eletronico"] = getValueInt(objDados.email, "") + "";
        lr_cliente_["correi_eletr_secd"] = getValueInt("", "") + "";
        lr_cliente_["correi_eletr_venda"] = getValueInt("", "") + "";
        lr_cliente_["endereco_web"] = getValueInt("", "") + "";
        lr_cliente_["telefone_2"] = getValueInt("", "0") + "";
        lr_cliente_["compl_endereco"] = getValueInt("", "") + "";
        lr_cliente_["tip_logradouro"] = getValueInt(f_getTipoLogradouroLogix(objDados.tipoLogradouro, newDataset), "") + "";
        lr_cliente_["num_iden_lograd"] = getValueInt(objDados.numero, "") + "";
        lr_cliente_["iden_estrangeiro"] = getValueInt("", "") + "";
        lr_cliente_["ind_cprb"] = getValueInt("", "") + "";
        lr_cliente_["tipo_servico"] = getValueInt("", "") + "";
        lr_cliente_["ies_contrib_ipi"] = getValueInt("", "N") + "";
        lr_cliente_["ies_fis_juridica"] = getValueInt(objDados.cnpj, "tipoPessoa") + "";

        lr_cliente_["cod_uni_feder"] = getValueInt(objCidade.uf, "") + "";
        lr_cliente_["cod_pais"] = getValueInt(objCidade.codPais) + "";
        lr_cliente_["nom_guerra"] = getValueInt("", "") + "";
        lr_cliente_["cod_cidade_pgto"] = getValueInt("", "") + "";
        lr_cliente_["camara_comp"] = getValueInt("", "") + "";

        lr_cliente_["dat_nascimento"] = "2024-01-01";
        lr_cliente_["dat_fundacao"] = "";

        lr_cliente_["cod_banco"] = getValueInt("", "") + "";
        lr_cliente_["num_agencia"] = getValueInt("", "") + "";
        lr_cliente_["num_conta_banco"] = getValueInt("", "") + "";
        lr_cliente_["tmp_transpor"] = getValueInt("", "1") + "";
        lr_cliente_["tex_observ"] = getValueInt("", "") + "";
        lr_cliente_["num_lote_transf"] = getValueInt("", "0") + "";
        lr_cliente_["pct_aceite_div"] = getValueInt("", "0") + "";
        lr_cliente_["ies_tip_entrega"] = getValueInt("", "D") + "";
        lr_cliente_["ies_dep_cred"] = getValueInt("", "N") + "";
        lr_cliente_["ult_num_coleta"] = getValueInt("", "0") + "";
        lr_cliente_["ies_gera_ap"] = getValueInt("", "S") + "";

        lr_cliente_["cod_mercado"] = "IN";
        lr_cliente_["cod_continente"] = "1";
        lr_cliente_["cod_regiao"] = "1";

        var qtd_dias_atr_dupl = getValueInt("", "0") + '';
        var qtd_dias_atr_med = getValueInt("", "0") + '';
        var val_ped_carteira = getValueInt("", "0") + '';
        var val_dup_aberto = getValueInt("", "0") + '';
        var dat_ult_fat = getValueInt("", "0") + '';
        var val_limite_cred = getValueInt("", "0") + '';
        var dat_val_lmt_cr = getValueInt("", "0") + '';

        lr_cliente_["qtd_dias_atr_dupl"] = qtd_dias_atr_dupl;
        lr_cliente_["qtd_dias_atr_med"] = qtd_dias_atr_med;
        lr_cliente_["val_ped_carteira"] = val_ped_carteira;
        lr_cliente_["val_dup_aberto"] = val_dup_aberto;
        lr_cliente_["dat_ult_fat"] = dat_ult_fat;
        lr_cliente_["ies_nota_debito"] = 'N' + "";
        lr_cliente_["ies_protesto"] = getValueInt("", "S") + "";
        lr_cliente_["ies_emis_autom_nd"] = getValueInt("", "N") + "";
        lr_cliente_["tex_obs"] = getValueInt("", "0") + "";
        lr_cliente_["qtd_dias_protesto"] = getValueInt("", "0") + "";
        lr_cliente_["ies_tip_cliente"] = getValueInt("", "") + "";
        lr_cliente_["cod_float"] = getValueInt("", "0") + "";
        lr_cliente_["email_boleto"] = getValueInt(objDados.email, "") + "";

        lr_cliente_["val_limite_cred"] = val_limite_cred;
        lr_cliente_["dat_val_lmt_cr"] = dat_val_lmt_cr;
        lr_cliente_["dat_atualiz"] = dataTxt + ""; //preencher

        lr_cliente_["e_mail"] = getValueInt(objDados.email, "") + "";
        lr_cliente_["email_secund"] = getValueInt("", "") + "";

        lr_cliente_["cod_nivel_1"] = ObjParametros.canal.NIVEL1 + "";
        lr_cliente_["cod_nivel_2"] = ObjParametros.canal.NIVEL2 + "";
        lr_cliente_["cod_nivel_3"] = ObjParametros.canal.NIVEL3 + "";
        lr_cliente_["cod_nivel_4"] = ObjParametros.canal.NIVEL4 + "";
        lr_cliente_["cod_nivel_5"] = ObjParametros.canal.NIVEL5 + "";
        lr_cliente_["cod_nivel_6"] = ObjParametros.canal.NIVEL6 + "";
        lr_cliente_["cod_nivel_7"] = ObjParametros.canal.NIVEL7 + "";
        lr_cliente_["ies_nivel"] = ObjParametros.canal.IESNIVEL + "";

        lr_cliente_["cod_tip_carteira"] = getValueInt("", "01") + "";
        lr_cliente_["pais_nascimento"] = getValueInt("001", "") + "";
        lr_cliente_["pais_nacionalidade"] = getValueInt("001", "") + "";
        lr_cliente_["tip_inscricao"] = "2";
        lr_cliente_["num_inscricao"] = "0";
        lr_cliente_["sexo"] = "M";
        lr_cliente_["raca_cor"] = "1";
        lr_cliente_["estado_civil"] = "1";
        lr_cliente_["grau_instrucao"] = "1";
        lr_cliente_["categoria_sped_social"] = "101";
        lr_cliente_["dat_ini_sindicato_cooperativa"] = "";
        lr_cliente_["optante_fgts"] = "";
        lr_cliente_["dat_opcao_fgts"] = "";
        lr_cliente_["ies_aprovacao"] = "S";
        lr_cliente_["ies_situa_cliente"] = "N";

        lr_cliente.push(lr_cliente_);
        params["lr_cliente"] = lr_cliente;

        var la_cli_contatos = [{}];
        params["la_cli_contatos"] = la_cli_contatos;

        var la_vdp_cli_parametro = [{}];
        params["la_vdp_cli_parametro"] = la_vdp_cli_parametro;

        /*------------------------------
        * CONFIGURAÇÕES DE SUP FORNECEDOR
        * ----------------------------*/
        var la_sup_par_fornecedor = [{}];
        params["la_sup_par_fornecedor"] = la_sup_par_fornecedor;

        var la_cli_canal_venda = [{}];
        params["la_cli_canal_venda"] = la_cli_canal_venda;

        var la_credcad_socios = [{}];
        params["la_credcad_socios"] = la_credcad_socios;

        var la_cli_end_ent = [{}];
        params["la_cli_end_ent"] = la_cli_end_ent;

        var la_vdp_cli_grp_email = [{}];
        params["la_vdp_cli_grp_email"] = la_vdp_cli_grp_email;

        params["la_cap_par_fornec_imp"] = [{}];
        params["la_fornec_x_empresa"] = [{}];
        params["la_sup_cntt_fornec"] = [{}];
        params["la_cap_forn_dep_sped_social"] = [{}];
        params["la_sup_par_inscr_est"] = [{}];
        params["la_sup_inscr_fornec"] = [{}];
        params["la_sup_par_teg_fornec"] = [{}];
        params["la_term_ge_fornec"] = [{}];
        params["la_cap_fornec_pix"] = [{}];
        params["la_obf_grp_fisc_cli"] = [{}];
        params["la_cre_emp_cli_port"] = [{}];
        params["la_vdp_emp_cli_par"] = [{}];
        params["la_cli_cond_pgto"] = [{}];

        const objSentLogix = f_enviaCadastroLogix(params, newDataset);

    } catch (error) {
        newDataset.addRow(new Array("Dados Cliente: " + error + " linha: " + error.lineNumber));
    }

    return objSentLogix;
}

function f_getDadosPedido(pNumPedProcess, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = {
            dadosCapa: null,
            dadosRemessa: null,
            dadosTransp: null,
            dadosItens: null
        };
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        // ############################## Capa #################################
        var SQL = "select " +
            "    pedidoVenda, " +
            "    pedidoCompra, " +
            "    tipopedido, " +
            "    tipofrete, " +
            "    obspedido, " +
            "    obsnota, " +
            "    numPedidoVenda, " +
            "    numPedidoRemessa " +
            "from kbt_t_api_pedidos " +
            "where numpedprocess = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setInt(1, parseInt(pNumPedProcess))
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var data = {
                pedidoVenda: rsWD.getString("pedidoVenda"),
                pedidoCompra: rsWD.getString("pedidoCompra"),
                tipoPedido: rsWD.getString("tipopedido"),
                tipoFrete: rsWD.getString("tipofrete"),
                obsPedido: rsWD.getString("obspedido"),
                obsNota: rsWD.getString("obsnota"),
                numPedidoVenda: rsWD.getString("numPedidoVenda"),
                numPedidRemesssa: rsWD.getString("numPedidoRemessa")
            }
            wRetorno.dadosCapa = data;
        }
        if (rsWD != null) rsWD.close();
        // #####################################################################

        // ############################ Remesa #################################
        SQL = "select " +
            "    cnpj, " +
            "    inscricao, " +
            "    razao, " +
            "    fantasia, " +
            "    cep, " +
            "    codibge, " +
            "    tipologradouro, " +
            "    logradouro, " +
            "    numero, " +
            "    bairro, " +
            "    telefone, " +
            "    email " +
            "from kbt_t_api_pedido_remessa " +
            "where numpedprocess = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setInt(1, parseInt(pNumPedProcess))
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            var data = {
                cnpj: rsWD.getString("cnpj"),
                inscricao: rsWD.getString("inscricao"),
                razao: rsWD.getString("razao"),
                fantasia: rsWD.getString("fantasia"),
                cep: rsWD.getString("cep"),
                ibge: rsWD.getString("codibge"),
                tipoLogradouro: rsWD.getString("tipologradouro"),
                logradouro: rsWD.getString("logradouro"),
                numero: rsWD.getString("numero"),
                bairro: rsWD.getString("bairro"),
                telefone: rsWD.getString("telefone"),
                email: rsWD.getString("email")
            }
            wRetorno.dadosRemessa = data;
        }
        if (rsWD != null) rsWD.close();
        // #####################################################################

        // ############################ Transp #################################
        SQL = "select " +
            "    cnpj, " +
            "    inscricao, " +
            "    razao, " +
            "    fantasia, " +
            "    cep, " +
            "    codibge, " +
            "    tipologradouro, " +
            "    logradouro, " +
            "    numero, " +
            "    bairro, " +
            "    telefone, " +
            "    email " +
            "from kbt_t_api_pedido_transportadora " +
            "where numpedprocess = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setInt(1, parseInt(pNumPedProcess))
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            var data = {
                cnpj: rsWD.getString("cnpj"),
                inscricao: rsWD.getString("inscricao"),
                razao: rsWD.getString("razao"),
                fantasia: rsWD.getString("fantasia"),
                cep: rsWD.getString("cep"),
                ibge: rsWD.getString("codibge"),
                tipoLogradouro: rsWD.getString("tipologradouro"),
                logradouro: rsWD.getString("logradouro"),
                numero: rsWD.getString("numero"),
                bairro: rsWD.getString("bairro"),
                telefone: rsWD.getString("telefone"),
                email: rsWD.getString("email")
            }
            wRetorno.dadosTransp = data;
        }
        if (rsWD != null) rsWD.close();
        // #####################################################################

        // ############################ Itens #################################
        var arrItens = [];
        SQL = "select " +
            "    coditem, " +
            "    unidade, " +
            "    quantidade, " +
            "    precoVenda, " +
            "    precoCompra, " +
            "    datEntrega " +
            "from kbt_t_api_pedido_itens " +
            "where numpedprocess = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setInt(1, parseInt(pNumPedProcess))
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {

            var data = {
                coditem: rsWD.getString("coditem"),
                unidade: rsWD.getString("unidade"),
                quantidade: rsWD.getString("quantidade"),
                precoVenda: rsWD.getString("precoVenda"),
                precoCompra: rsWD.getString("precoCompra"),
                datEntrega: rsWD.getString("datEntrega")
            }
            arrItens.push(data);
        }
        wRetorno.dadosItens = arrItens;
        if (rsWD != null) rsWD.close();
        // #####################################################################

        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getDadosUnidadeCeramfix(pCnpj, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select cod_empresa, den_empresa from empresa where num_cgc = ?";
        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.setString(1, pCnpj.length() == 18 ? '0' + pCnpj : pCnpj)
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var data = {
                codEmpresa: rsWD.getString("cod_empresa"),
                nomEmpresa: rsWD.getString("den_empresa")
            }
            wRetorno = data;

        }
        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getDadosIntegrador(pCnpj, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select cod_cliente, nom_cliente from clientes where num_cgc_cpf = ?";
        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.setString(1, pCnpj.length() == 18 ? '0' + pCnpj : pCnpj)
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            var data = {
                codIntegrador: rsWD.getString("cod_cliente"),
                nomIntegrador: rsWD.getString("nom_cliente")
            }
            wRetorno = data;

        }
        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getCidadeLogix(pCodIbge, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select " +
            "    c.cod_cidade, " +
            "    '001' as pais, " +
            "    c.cod_uni_feder as uf, " +
            "    c.den_cidade " +
            "from obf_cidade_ibge ibge " +
            "    inner join cidades c on(c.cod_cidade = ibge.cidade_logix)  " +
            "where ibge.cidade_ibge = ? ";

        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.setString(1, pCodIbge)
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var data = {
                codCidade: rsWD.getString("cod_cidade"),
                codPais: rsWD.getString("pais"),
                uf: rsWD.getString("uf"),
                nomCidade: rsWD.getString("den_cidade"),
            }
            wRetorno = data;
        }

        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Cidade Logix: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getTipoLogradouroLogix(pTipoLogradouro, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select tip_logradouro from vdp_tip_logradouro where des_logradouro = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setString(1, pTipoLogradouro)
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            wRetorno = rsWD.getString("cod_cliente")
        }

        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Cidade Logix: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getDadosCliente(pCnpj, pNumProcess, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select cod_cliente, nom_cliente from clientes where num_cgc_cpf = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setString(1, pCnpj.length() == 18 ? '0' + pCnpj : pCnpj)
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var data = {
                codCliente: rsWD.getString("cod_cliente"),
                nomCliente: rsWD.getString("nom_cliente")
            }
            wRetorno = data;

        }
        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getDadosTransportadora(pCnpj, pNumProcess, newDataset) {
    try {
        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var SQL = "select cod_cliente, nom_cliente from clientes where num_cgc_cpf = ?";
        statementWD = connectionWD.prepareStatement(SQL);

        statementWD.setString(1, pCnpj.length() == 18 ? '0' + pCnpj : pCnpj)
        rsWD = statementWD.executeQuery();

        while (rsWD.next()) {
            var data = {
                codTransportadora: rsWD.getString("cod_cliente"),
                nomTransportadora: rsWD.getString("nom_cliente")
            }
            wRetorno = data;

        }
        return wRetorno;

    } catch (error) {
        newDataset.addRow(new Array("Dados Transportadora: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_getParametrosIntegracao(pCodEmpresa, pCodIntegrador, pCodCliente, pTipoVenda, newDataset) {
    try {
        var wParamIntegra = null;

        var rsWD = null;
        var connectionWD = null;
        var statementWD = null;
        var wRetorno = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup(conexaoLogix);
        connectionWD = dataSourceWD.getConnection();

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('tipo_venda', pTipoVenda, pTipoVenda, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cod_cliente_fat', pCodIntegrador, pCodIntegrador, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cod_cliente_rem', pCodCliente, pCodCliente, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("ds_parametros_integracao_api", null, constraints, null);

        if (dataset != null && dataset.rowsCount > 0) {
            wParamIntegra = {
                representante: dataset.getValue(0, "cod_representante"),
                codNatureza_fat: dataset.getValue(0, "cod_natureza_fat"),
                codFinalidade_fat: dataset.getValue(0, "finalidade_fat"),
                condPgto_fat: dataset.getValue(0, "cod_cond_pgto_fat"),
                codCarteira_fat: dataset.getValue(0, "cod_carteira_fat"),
                codTipoEntrega_fat: dataset.getValue(0, "tipo_entrega_fat"),
                codMoeda_fat: dataset.getValue(0, "cod_moeda_fat"),
                codListapreco_fat: dataset.getValue(0, "cod_list_preco_fat"),
                codNatureza_rem: dataset.getValue(0, "cod_natureza_rem"),
                codFinalidade_rem: dataset.getValue(0, "finalidade_rem"),
                condPgto_rem: dataset.getValue(0, "cod_cond_pgto_rem"),
                codCarteira_rem: dataset.getValue(0, "cod_carteira_rem"),
                codTipoEntrega_rem: dataset.getValue(0, "tipo_entrega_rem"),
                codMoeda_rem: dataset.getValue(0, "cod_moeda_rem"),
                codListapreco_rem: dataset.getValue(0, "cod_list_preco_rem"),
            }

        } else {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('tipo_venda', pTipoVenda, pTipoVenda, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('cod_cliente_fat', pCodIntegrador, pCodIntegrador, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('cod_cliente_rem', '', '', ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("ds_parametros_integracao_api", null, constraints, null);
            if (dataset != null && dataset.rowsCount > 0) {
                wParamIntegra = {
                    representante: dataset.getValue(0, "cod_representante"),
                    codNatureza_fat: dataset.getValue(0, "cod_natureza_fat"),
                    codFinalidade_fat: dataset.getValue(0, "finalidade_fat"),
                    condPgto_fat: dataset.getValue(0, "cod_cond_pgto_fat"),
                    codCarteira_fat: dataset.getValue(0, "cod_carteira_fat"),
                    codTipoEntrega_fat: dataset.getValue(0, "tipo_entrega_fat"),
                    codMoeda_fat: dataset.getValue(0, "cod_moeda_fat"),
                    codListapreco_fat: dataset.getValue(0, "cod_list_preco_fat"),
                    codNatureza_rem: dataset.getValue(0, "cod_natureza_rem"),
                    codFinalidade_rem: dataset.getValue(0, "finalidade_rem"),
                    condPgto_rem: dataset.getValue(0, "cod_cond_pgto_rem"),
                    codCarteira_rem: dataset.getValue(0, "cod_carteira_rem"),
                    codTipoEntrega_rem: dataset.getValue(0, "tipo_entrega_rem"),
                    codMoeda_rem: dataset.getValue(0, "cod_moeda_rem"),
                    codListapreco_rem: dataset.getValue(0, "cod_list_preco_rem"),
                }
            } else {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('cod_empresa', pCodEmpresa, pCodEmpresa, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('tipo_venda', pTipoVenda, pTipoVenda, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('cod_cliente_fat', '', '', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('cod_cliente_rem', '', '', ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("ds_parametros_integracao_api", null, constraints, null);
                if (dataset != null && dataset.rowsCount > 0) {
                    wParamIntegra = {
                        representante: dataset.getValue(0, "cod_representante"),
                        codNatureza_fat: dataset.getValue(0, "cod_natureza_fat"),
                        codFinalidade_fat: dataset.getValue(0, "finalidade_fat"),
                        condPgto_fat: dataset.getValue(0, "cod_cond_pgto_fat"),
                        codCarteira_fat: dataset.getValue(0, "cod_carteira_fat"),
                        codTipoEntrega_fat: dataset.getValue(0, "tipo_entrega_fat"),
                        codMoeda_fat: dataset.getValue(0, "cod_moeda_fat"),
                        codListapreco_fat: dataset.getValue(0, "cod_list_preco_fat"),
                        codNatureza_rem: dataset.getValue(0, "cod_natureza_rem"),
                        codFinalidade_rem: dataset.getValue(0, "finalidade_rem"),
                        condPgto_rem: dataset.getValue(0, "cod_cond_pgto_rem"),
                        codCarteira_rem: dataset.getValue(0, "cod_carteira_rem"),
                        codTipoEntrega_rem: dataset.getValue(0, "tipo_entrega_rem"),
                        codMoeda_rem: dataset.getValue(0, "cod_moeda_rem"),
                        codListapreco_rem: dataset.getValue(0, "cod_list_preco_rem"),
                    }
                }
            }
        }

        if (wParamIntegra != null) {
            var SQL = "select cod_nivel_1, cod_nivel_2, cod_nivel_3, cod_nivel_4, cod_nivel_5, cod_nivel_6, cod_nivel_7 from canal_venda where cod_nivel_7 = ?";
            statementWD = connectionWD.prepareStatement(SQL);

            statementWD.setString(1, wParamIntegra.representante)
            rsWD = statementWD.executeQuery();
            while (rsWD.next()) {
                var data = {
                    NIVEL1: rsWD.getString("cod_nivel_1"),
                    NIVEL2: rsWD.getString("cod_nivel_2"),
                    NIVEL3: rsWD.getString("cod_nivel_3"),
                    NIVEL4: rsWD.getString("cod_nivel_4"),
                    NIVEL5: rsWD.getString("cod_nivel_5"),
                    NIVEL6: rsWD.getString("cod_nivel_6"),
                    NIVEL7: rsWD.getString("cod_nivel_7"),
                    IESNIVEL: "07",
                }
                wParamIntegra.canal = data;
            }
        }

        return wParamIntegra;

    } catch (error) {
        newDataset.addRow(new Array("Dados Empresa: " + error + " linha: " + error.lineNumber));
    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function onMobileSync(user) {

}

var debug = false;
function printLog(tipo, msg) {

    if (debug) {
        var msgs = getValueInt("WKDef") + " - " + getValueInt("WKNumProces") + " - " + msg
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

function custom_envio_email(pNome, pMensagem) {
    var nome = '';

    var matricula = 'admin';
    var SERVER_URL = fluigAPI.getPageService().getServerURL();

    var destinatarios = new java.util.ArrayList();
    destinatarios.add('ti.sistemas@ceramfix.com.br');
    destinatarios.add('marcio@kobit.com.br');


    var parametros = new java.util.HashMap();
    parametros.put('subject', 'Integração Fluig x Protheus');
    parametros.put('SERVER_URL', SERVER_URL);
    parametros.put('NOME', nome);

    parametros.put('USUARIO', pNome);
    parametros.put('MENSAGEM', pMensagem);

    notifier.notify(matricula, 'integracao_usuarios', parametros, destinatarios, 'text/html');
    notifier.notify(matricula, 'integracao_usuarios', parametros, destinatarios, 'text/html');
}

function f_resumoEmail(pContent) {
    var nome = '';

    var matricula = 'admin';
    var SERVER_URL = fluigAPI.getPageService().getServerURL();

    var destinatarios = new java.util.ArrayList();
    destinatarios.add('ti.sistemas@ceramfix.com.br');
    //destinatarios.add('ariberto@kobit.com.br');
    //destinatarios.add('lista-rh@ceramfix.com.br');
    destinatarios.add('marcio@kobit.com.br');
    // destinatarios.add('silvio.junior@ceramfix.com.br');

    // destinatarios.add('thomazdede@yahoo.com.br');

    var parametros = new java.util.HashMap();
    parametros.put('subject', 'Integração Fluig x Protheus');
    parametros.put('SERVER_URL', SERVER_URL);
    parametros.put('NOME', nome);

    parametros.put('WorkflowMailContent', pContent);

    notifier.notify(matricula, 'TPLTASK_SEND_EMAIL_KBT', parametros, destinatarios, 'text/html');

}

function toTimeStamp(data) {
    data = data.replace('/', '-').replace('/', '-');
    var data2 = data.split("-");
    var novaData = new Date(data2[2], data2[1] - 1, data2[0]);
    novaData = novaData.getTime();
    novaData = novaData.toString().substring(0, 10)
    return novaData;
}

function dataAtualFormatada(nDias) {
    var data = new Date();
    var dia = data.getDate().toString();

    if (nDias != undefined) {
        data.setDate(data.getDate() - nDias);
    }
    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

function getValueInt(campo, padrao) {
    var valor = campo;
    var retorno = campo;
    if (padrao == "tipoPessoa") {
        if (valor.indexOf("/0000-") == -1) {
            retorno = "F";
        } else {
            retorno = "J";
        }
    }
    if (valor == "" || valor == null) {
        retorno = padrao;
    }

    return retorno;
}

function kbtReplaceAll(valor, needle, replacement) {
    return valor.split(needle).join(replacement);
};

function getValueFloat(campo, padrao) {

    var vnPadrao = padrao + "";
    var vnValor = getValueInt(campo, vnPadrao) + "";

    var valor = parseFloat(kbtReplaceAll(kbtReplaceAll(vnValor, ".", ""), ",", "."));
    return isNull(valor, parseFloat(kbtReplaceAll(kbtReplaceAll(vnPadrao, ".", ""), ",", ".")));
}

function isNull(valor, padrao) {
    if (isNaN(valor)) {
        return padrao;
    } else {
        return valor;
    }
}

function f_enviaCadastroLogix(pJSON, newDataset) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "Logix_PRD";
    var params = {};
    var Endpoint = "/LOGIXREST/kbtr00005/cliente";
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


    params = pJSON;

    data["headers"] = headers;
    data["params"] = params;
    // data["strParams"] = gson.toJson(params);
    var jj = gson.toJson(data);

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}

function f_enviaPedidoLogix(pJSON, newDataset) {
    var retorno = null;
    var metodo = "POST";
    var wServiceCode = "Logix_PRD";
    var params = {};
    var Endpoint = "/logixrest/vdpr0001/incluiPedidoVenda";
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


    params = pJSON;

    data["headers"] = headers;
    data["params"] = params;
    // data["strParams"] = gson.toJson(params);
    var jj = gson.toJson(data);

    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        retorno = jr;
    }
    return retorno;
}