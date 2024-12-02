var endpoint = '';
// var wToken = 'q8YnHU7qGmOYDiqPwkmQdNCIdIPqVwtimgOhqBjeDu';
var wToken = 'ooz9r0f72PMRWbI0xvddUiTyD5tpRGXtWEpPOq37Sq';

function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {


}

function createDataset(fields, constraints, sortFields) {

    printLog("info", "## Lincros START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');
    newDataset.addColumn('mensagem');
    newDataset.addColumn('protocolo');


    try {

        var connectionWD = null;
        var statementWD = null;
        var rsWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "set isolation to dirty read";
        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.executeUpdate();

        var SQL = "SELECT ";
        SQL += "    a.cod_empresa,  ";
        SQL += "    a.remetente,  ";
        SQL += "    a.cep_remetente,  ";
        SQL += "    a.num_om,  ";
        SQL += "    a.dat_emis, ";
        SQL += "    a.num_pedido,  ";
        SQL += "    sum( a.qtd_reservada ) as qtd_reservada,  ";
        SQL += "    sum( a.peso ) as peso, ";
        SQL += "    0 as cubagem,  "; //sum( a.cubagem )
        SQL += "    sum( a.qtd_volume_om ) as volume,  ";
        SQL += "    sum( a.valor ) as valor, ";
        SQL += "    a.cod_cliente,  ";
        SQL += "    a.destinatario,  ";
        SQL += "    a.cep_destinatario, ";
        SQL += "    a.cod_transpor, ";
        SQL += "    ped.ies_frete, ";
        SQL += "    nat.cod_cliente as cod_conta_ordem, ";
        SQL += "    substr(replace(replace(replace(clic.num_cgc_cpf,'.',''),'/',''),'-',''),2,15)  as conta_ordem, ";
        SQL += "    cad.consignatario as cod_consig, ";
        SQL += "    substr(replace(replace(replace(clir.num_cgc_cpf,'.',''),'/',''),'-',''),2,15)  as consignatario ";
        SQL += "FROM kbt_v_om a  ";
        SQL += "    inner join pedidos ped on (ped.cod_empresa = a.cod_empresa)";
        SQL += "     and (ped.num_pedido = a.num_pedido)";

        SQL += "    left join ped_item_nat nat on ( ped.cod_empresa = nat.cod_empresa";
        SQL += "     and ped.num_pedido = nat.num_pedido";
        SQL += "     and nat.num_sequencia = 0 )";
        SQL += "    left join clientes clic on (clic.cod_cliente = nat.cod_cliente)";

        SQL += "    left join ped_consg_adic cad on (cad.Empresa = ped.cod_Empresa";
        SQL += "     and cad.pedido = ped.num_pedido)";

        SQL += "    left join clientes clir on (clir.cod_cliente = cad.consignatario)";

        SQL += "WHERE a.cod_empresa = '01'  ";
        SQL += "    and ( a.cod_transpor = '0' OR a.cod_transpor = '' OR a.cod_transpor IS NULL ) ";
        SQL += "    and not exists (select 1 from kbt_t_om where cod_Empresa = a.cod_Empresa and num_om = a.num_om) ";
        SQL += "    and ped.ies_frete in (1,2,4,5) ";
        SQL += "group by  ";
        SQL += "    a.cod_empresa,  ";
        SQL += "    a.remetente,  ";
        SQL += "    a.cep_remetente,  ";
        SQL += "    a.num_om,  ";
        SQL += "    a.dat_emis, ";
        SQL += "    a.num_pedido,  ";
        SQL += "    a.cod_cliente,  ";
        SQL += "    a.destinatario,  ";
        SQL += "    a.cep_destinatario, ";
        SQL += "    a.cod_transpor, ";
        SQL += "    ped.ies_frete, ";
        SQL += "    nat.cod_cliente, ";
        SQL += "    clic.num_cgc_cpf, ";
        SQL += "    cad.consignatario, ";
        SQL += "    clir.num_cgc_cpf ";


        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            endpoint = "/criarSync?token=" + wToken;

            SQL = "select ";
            SQL += "   emp.den_empresa as razao, ";
            SQL += "   emp.den_reduz as fantasia, ";
            SQL += "   replace(emp.ins_estadual,'/','') as inscricao, ";
            SQL += "   emp.end_telegraf as email, ";
            SQL += "   emp.end_empresa as logradouro, ";
            SQL += "   '' as numero, ";
            SQL += "   '' as complemento, ";
            SQL += "   emp.den_bairro as bairro, ";
            SQL += "   emp.uni_feder as uf, ";
            SQL += "   replace(emp.cod_cep,'-','') as cod_cep, ";
            SQL += "   emp.num_telefone as telefone ";
            SQL += "FROM empresa emp ";
            SQL += "WHERE cod_empresa = '01' ";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsEmitente = statementWD.executeQuery();
            // printLog("info", "SQL: " + SQL);

            while (rsEmitente.next()) {

                var wRemetente = {
                    cnpj: rsWD.getString("remetente") + "",
                    nome: rsEmitente.getString("razao") + "",
                    fantasia: rsEmitente.getString("fantasia") + "",
                    inscricaoEstadual: rsEmitente.getString("inscricao") + "",
                    email: rsEmitente.getString("email") + "",
                    cep: parseInt(rsWD.getString("cep_remetente")),
                    logradouro: rsEmitente.getString("logradouro") + "",
                    numero: rsEmitente.getString("numero") + "",
                    complemento: rsEmitente.getString("complemento") + "",
                    bairro: rsEmitente.getString("bairro") + "",
                    uf: rsEmitente.getString("uf") + "",
                    cep: rsEmitente.getString("cod_cep") + "",
                    latitude: "",
                    longitude: "",
                    ibge: "",
                    fone: rsEmitente.getString("telefone") + ""
                }

            }
            if (rsEmitente != null) rsEmitente.close();


            SQL = "select ";
            SQL += "    vCli.razao_social, ";
            SQL += "    vCli.razao_social_reduz as fantasia, ";
            SQL += "    replace(c.ins_estadual,'/','') as inscricao, ";
            SQL += "    vCli.correio_eletronico as email, ";
            SQL += "    vCli.telefone_1 as telefone, ";
            SQL += "    vCli.logradouro, ";
            SQL += "    vCli.num_iden_lograd as numero, ";
            SQL += "    vCli.compl_endereco as complemento, ";
            SQL += "    vCli.bairro, ";
            SQL += "    city.cod_cidade, ";
            SQL += "    city.cod_uni_feder as uf, ";
            SQL += "    replace(c.cod_cep,'-','') as cod_cep, ";
            SQL += "    ibge.cidade_ibge as ibge ";
            SQL += "from vdp_cli_fornec_cpl vCli ";
            SQL += "    inner join clientes c on (c.cod_cliente = vCli.cliente_fornecedor) ";
            SQL += "    inner join cidades city on (city.cod_cidade = c.cod_cidade) ";
            SQL += "    left join obf_cidade_ibge ibge on (ibge.cidade_logix = c.cod_cidade) ";
            SQL += "where tip_cadastro ='C' and cliente_fornecedor = '" + rsWD.getString("cod_cliente") + "' ";
            statementWD = connectionWD.prepareStatement(SQL);
            var rsDestinatario = statementWD.executeQuery();

            while (rsDestinatario.next()) {

                var wDestinatario = {
                    cnpj: rsWD.getString("destinatario") + "",
                    nome: rsDestinatario.getString("razao_social") + "",
                    fantasia: rsDestinatario.getString("fantasia") + "",
                    inscricaoEstadual: rsDestinatario.getString("inscricao") + "",
                    email: rsDestinatario.getString("email") + "",
                    logradouro: rsDestinatario.getString("logradouro") + "",
                    numero: rsDestinatario.getString("numero") + "",
                    complemento: rsDestinatario.getString("complemento") + "",
                    bairro: rsDestinatario.getString("bairro") + "",
                    uf: rsDestinatario.getString("uf") + "",
                    cep: rsDestinatario.getString("cod_cep") + "",
                    latitude: "",
                    longitude: "",
                    ibge: rsDestinatario.getString("ibge") + "",
                    fone: rsDestinatario.getString("telefone") + ""
                }
            }


            var wEnderecoRemetente = null;
            if ((rsWD.getString("cod_consig") != null) || (rsWD.getString("cod_conta_ordem") != null)) {
                SQL = "select ";
                SQL += "   emp.end_empresa as logradouro, ";
                SQL += "  '' as numero, ";
                SQL += "   '' as complemento, ";
                SQL += "   emp.den_bairro as bairro, ";
                SQL += "   emp.uni_feder as uf, ";
                SQL += "   replace(emp.cod_cep,'-','') as cod_cep ";
                SQL += "FROM empresa emp ";
                SQL += "WHERE cod_empresa = '01' ";
                statementWD = connectionWD.prepareStatement(SQL);
                var EnderecoRemetente = statementWD.executeQuery();
                //printLog("info", "SQL: " + SQL);

                while (EnderecoRemetente.next()) {

                    var wEnderecoRemetente = {
                        logradouro: EnderecoRemetente.getString("logradouro") + "",
                        numero: EnderecoRemetente.getString("numero") + "",
                        complemento: EnderecoRemetente.getString("complemento") + "",
                        bairro: EnderecoRemetente.getString("bairro") + "",
                        uf: EnderecoRemetente.getString("uf") + "",
                        cep: EnderecoRemetente.getString("cod_cep") + "",
                        latitude: "",
                        longitude: "",
                        ibge: "",
                    }

                }
                if (EnderecoRemetente != null) EnderecoRemetente.close();
            }

            var wEnderecoDestinatario = null;
            if ((rsWD.getString("cod_consig") != null) || (rsWD.getString("cod_conta_ordem") != null)) {

                var wCodigo = '';
                if (rsWD.getString("cod_consig") != null) {
                    wCodigo = rsWD.getString("cod_consig")
                }
                if (rsWD.getString("cod_conta_ordem") != null) {
                    wCodigo = rsWD.getString("cod_conta_ordem")
                }

                SQL = "select ";
                SQL += "    vCli.logradouro, ";
                SQL += "    vCli.num_iden_lograd as numero, ";
                SQL += "    vCli.compl_endereco, ";
                SQL += "    vCli.bairro, ";
                SQL += "    city.cod_cidade, ";
                SQL += "    city.cod_uni_feder as uf, ";
                SQL += "    replace(c.cod_cep,'-','') as cod_cep, ";
                SQL += "    ibge.cidade_ibge as ibge ";
                SQL += "from vdp_cli_fornec_cpl vCli ";
                SQL += "    inner join clientes c on (c.cod_cliente = vCli.cliente_fornecedor) ";
                SQL += "    inner join cidades city on (city.cod_cidade = c.cod_cidade) ";
                SQL += "    left join obf_cidade_ibge ibge on (ibge.cidade_logix = c.cod_cidade) ";
                SQL += "where tip_cadastro ='C' and cliente_fornecedor = '" + wCodigo + "' ";
                statementWD = connectionWD.prepareStatement(SQL);
                var rsEnderecoDestinatario = statementWD.executeQuery();

                while (rsEnderecoDestinatario.next()) {

                    var wEnderecoDestinatario = {
                        logradouro: rsEnderecoDestinatario.getString("logradouro") + "",
                        numero: rsEnderecoDestinatario.getString("numero") + "",
                        complemento: rsEnderecoDestinatario.getString("compl_endereco") + "",
                        bairro: rsEnderecoDestinatario.getString("bairro") + "",
                        uf: rsEnderecoDestinatario.getString("uf") + "",
                        cep: rsEnderecoDestinatario.getString("cod_cep") + "",
                        latitude: "",
                        longitude: "",
                        ibge: rsEnderecoDestinatario.getString("ibge") + "",
                    }
                }
                if (rsEnderecoDestinatario != null) rsEnderecoDestinatario.close();
            }


            var wData = {
                numero: rsWD.getString("num_om") + "",
                serie: "3",
                emitente: wRemetente,
                destinatario: wDestinatario,
                enderecoRetirada: wEnderecoRemetente,
                enderecoEntrega: wEnderecoDestinatario,
                modalidadeFrete: "0",
                tipoOperacao: "1",
                dataEmissao: f_dataHoje() + "",
                peso: parseFloat(rsWD.getString("peso")),
                pesoLiquido: parseFloat(rsWD.getString("peso")),
                cubagem: parseFloat(rsWD.getString("cubagem")),
                volumes: parseFloat(rsWD.getString("volume")),
                quantidadeItens: parseFloat(rsWD.getString("qtd_reservada")),
                valor: parseFloat(rsWD.getString("valor")),
                valorProdutos: parseFloat(rsWD.getString("valor")),
                prazoCliente: f_dataHoje() + ""
            }

            printLog("info", "## Registro: " + JSON.stringify(wData))

            var wRretorno = f_incluiRegistro(wData);
            printLog("info", "## Retorno: " + JSON.stringify(wRretorno))
            if (wRretorno.status == "CONFIRMADO") {
                var wUID = wRretorno.protocolo;

                var SQL = "insert into kbt_t_om (cod_Empresa, num_om, ies_situacao, num_protocolo) values ";
                SQL += "    ('" + rsWD.getString("cod_empresa") + "'," + rsWD.getString("num_om") + ",'E'," + wUID + ")";

                statementWD = connectionWD.prepareStatement(SQL);
                statementWD.executeUpdate();

                newDataset.addRow(new Array(
                    wRretorno.status + "",
                    "",
                    wUID + ""
                ));

            } else {
                newDataset.addRow(new Array(
                    wRretorno.status + "",
                    wRretorno.mensagem + "",
                    wUID + ""
                ));
            }


        }

        // consultar os registro em aberto
        var SQL = "select ";
        SQL += "    om.cod_empresa, ";
        SQL += "    om.num_om, ";
        SQL += "    om.num_protocolo, ";
        SQL += "    substr(replace(replace(replace(emp.num_cgc,'.',''),'/',''),'-',''),2,15) as remetente ";
        SQL += "    from kbt_t_om om ";
        SQL += "    join empresa emp on (emp.cod_Empresa = om.cod_Empresa) ";
        SQL += "    join ordem_montag_mest omm on (om.cod_empresa = omm.cod_empresa and om.num_om = omm.num_om) ";
        SQL += "   where om.ies_situacao  = 'E' and om.num_protocolo  is not null and omm.num_nff is null ";
        SQL += "     and (omm.cod_transpor = '0' OR omm.cod_transpor = '' OR omm.cod_transpor IS NULL) ";

        printLog("info", "## Prenota SQL : " + SQL);

        statementWD = connectionWD.prepareStatement(SQL);
        rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            endpoint = "/situacao?token=" + wToken;

            var wNotas = {
                cnpjEmissorPreNotaFiscal: rsWD.getString("remetente") + "",
                numeroPreNotaFiscal: parseInt(rsWD.getString("num_om")),
                seriePreNotaFiscal: "3"
            }

            var prenota = [];
            prenota.push(wNotas);

            var wData = {
                prenotas: prenota
            }

            printLog("info", "## Prenota: " + JSON.stringify(wData));

            var wRretorno = f_consultaSituacao(wData);

            printLog("info", "## Retorno: " + JSON.stringify(wRretorno));

            if (wRretorno.status == "CONFIRMADO") {
                if (wRretorno.prenotas[0].situacao == 1) {
                    var trechos = wRretorno.prenotas[0].trechos;

                    for (i = 0; i < trechos.length; i++) {

                        var wCNPJ = f_formatarCNPJ(trechos[i].cnpjTransportadora);
                        var SQL = "select cod_fornecedor, raz_social from fornecedor where num_cgc_cpf = '0" + wCNPJ + "' and ies_fornec_ativo = 'A' ";
                        statementWD = connectionWD.prepareStatement(SQL);
                        var rsTransp = statementWD.executeQuery();

                        var wCodFornecedor = '';
                        while (rsTransp.next()) {
                            wCodFornecedor = rsTransp.getString("cod_fornecedor");
                        }

                        var SQL = "update kbt_t_om set ies_situacao = 'R' where cod_empresa = '" + rsWD.getString("cod_empresa") + "' and num_om = " + rsWD.getString("num_om");
                        statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();

                        var SQL = "update ordem_montag_mest set cod_transpor = '" + wCodFornecedor + "' where cod_empresa = '" + rsWD.getString("cod_empresa").trim() + "' and num_om = " + rsWD.getString("num_om");
                        statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();

                        newDataset.addRow(new Array(
                            wRretorno.status + "",
                            wCodFornecedor + "",
                            wCNPJ + ""
                        ));
                    }
                }
            }
        }


        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();


    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }



}

function onMobileSync(user) {

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


function f_incluiRegistro(jsonFile) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "lincros",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = jsonFile;

    var headers = {};
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["params"] = params;

    var gson = new com.google.gson.Gson();
    var datajson = gson.toJson(data);

    var jj = datajson;
    var vo = clientService.invoke(jj);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }
}

function f_consultaSituacao(jsonFile) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: "lincros",
        endpoint: endpoint,
        timeoutService: "240",
        method: "POST",
    };

    var params = jsonFile;

    var headers = {};
    headers["Content-Type"] = "application/json";
    data["headers"] = headers;
    data["params"] = params;

    var jj = JSON.stringify(data);
    var vo = clientService.invoke(jj);

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }
}


function f_formatarCNPJ(valorDoTextBox) {

    //Remove tudo o que não é dígito
    var v = valorDoTextBox.replace(/\D/g, "")

    if (v.length < 14) { //CPF

        //Coloca um ponto entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d)/, "$1.$2")

        //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d)/, "$1.$2")

        //Coloca um hífen entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    } else { //CNPJ

        //Coloca ponto entre o segundo e o terceiro dígitos
        v = v.replace(/^(\d{2})(\d)/, "$1.$2")

        //Coloca ponto entre o quinto e o sexto dígitos
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")

        //Coloca uma barra entre o oitavo e o nono dígitos
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")

        //Coloca um hífen depois do bloco de quatro dígitos
        v = v.replace(/(\d{4})(\d)/, "$1-$2")

    }

    return v;
}

function f_dataHoje() {
    // Obtém a data/hora atual
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    var str_data = anoF + "-" + mesF + "-" + diaF;

    var hora = data.getHours();          // 0-23
    var min = data.getMinutes();        // 0-59
    var seg = data.getSeconds();        // 0-59


    // Formata a data e a hora (note o mês + 1)
    // var str_data = ano4 + '-' + (mes + 1) + '-' + dia;
    var str_hora = hora + ':' + min + ':' + seg;

    // Mostra o resultado
    return str_data + ' ' + str_hora;
}