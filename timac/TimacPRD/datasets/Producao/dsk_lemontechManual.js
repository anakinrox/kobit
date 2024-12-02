var newDataset;
var userId = "9ed623508dd4c3746080b0d4e1454704";
var senha = "f51a812ef7abbb1bff7e1f548f6549c8";
var clientKey = "timac_agro_prod";

function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        printLog("info", "## Integração Lemontech ##");
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('status');

        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        var connectionWD = dataSourceWD.getConnection();


        var date = new Date();
        var primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var wTotRegistros = 0;
        var wNumRegistro = 1;

        primeiroDia = f_formataData(primeiroDia);
        primeiroDia = '2021-12-01';
        ultimoDia = f_formataData(ultimoDia);
        ultimoDia = '2022-03-31';


        var envelope = '    <soapenv:Body>';
        envelope += '    <ser:pesquisarSolicitacao>';
        envelope += '       <version>4.0</version>';
        envelope += '       <dataInicial>' + primeiroDia + 'T00:00:00</dataInicial>';
        envelope += '       <dataFinal>' + ultimoDia + 'T23:59:59</dataFinal>';
        envelope += '       <registroInicial>' + wNumRegistro + '</registroInicial>';
        envelope += '       <sincronizado>true</sincronizado>';
        envelope += '       <exibirPendentesAprovacao>false</exibirPendentesAprovacao>';
        envelope += '       <exibirRemarks>true</exibirRemarks>';
        envelope += '       <exibirAprovadas>true</exibirAprovadas> ';
        envelope += '      <tipoSolicitacao>EXPENSE</tipoSolicitacao> ';
        envelope += '    </ser:pesquisarSolicitacao>';
        envelope += '    </soapenv:Body>';

        // var envelope = '<soapenv:Body>';
        // envelope += '     <ser:pesquisarSolicitacao>';
        // envelope += '     <version>4.0</version>';
        // envelope += '     <idSolicitacaoRef>10632628</idSolicitacaoRef>';
        // envelope += '     <exibirCancelados>false</exibirCancelados>';
        // envelope += '     <exibirPendentesAprovacao>false</exibirPendentesAprovacao>';
        // envelope += '     </ser:pesquisarSolicitacao>';
        // envelope += ' </soapenv:Body>';

        var objRetorno = f_getLemontech(envelope, 'C');
        if (objRetorno.resultadoAcao == "SUCESSO") {
            wTotRegistros = parseInt(objRetorno.numeroSolicitacoes);

            newDataset.addRow(new Array("Registros: " + wTotRegistros));

            if (wTotRegistros > 0) {
                try {
                    if (objRetorno.solicitacao[0].idSolicitacao != undefined) {
                        var wLength = Object.keys(objRetorno.solicitacao).length;
                        for (i = 0; i < wLength; i++) {
                            f_trataRegistro(objRetorno.solicitacao[i])
                        }
                    }
                } catch (error) {
                    f_trataRegistro(objRetorno.solicitacao)
                }
            }

            if (wTotRegistros > wNumRegistro) { wNumRegistro = wNumRegistro + 50; }

            while (wNumRegistro < wTotRegistros) {
                var envelope = '    <soapenv:Body>';
                envelope += '    <ser:pesquisarSolicitacao>';
                envelope += '       <version>4.0</version>';
                envelope += '       <dataInicial>' + primeiroDia + 'T00:00:00</dataInicial>';
                envelope += '       <dataFinal>' + ultimoDia + 'T23:59:59</dataFinal>';
                envelope += '       <registroInicial>' + wNumRegistro + '</registroInicial>';
                envelope += '       <sincronizado>true</sincronizado>';
                envelope += '       <exibirPendentesAprovacao>false</exibirPendentesAprovacao>';
                envelope += '       <exibirRemarks>true</exibirRemarks>';
                envelope += '       <exibirAprovadas>true</exibirAprovadas> ';
                envelope += '      <tipoSolicitacao>EXPENSE</tipoSolicitacao> ';
                envelope += '    </ser:pesquisarSolicitacao>';
                envelope += '    </soapenv:Body>';

                var objRetorno = f_getLemontech(envelope, 'C');
                if (objRetorno.resultadoAcao == "SUCESSO") {
                    newDataset.addRow(new Array("Registros Atual: " + wNumRegistro));

                    if (parseInt(objRetorno.numeroSolicitacoes) > 0) {
                        try {
                            if (objRetorno.solicitacao[0].idSolicitacao != undefined) {
                                var wLength = Object.keys(objRetorno.solicitacao).length;
                                for (i = 0; i < wLength; i++) {
                                    f_trataRegistro(objRetorno.solicitacao[i])
                                }
                            }
                        } catch (error) {
                            f_trataRegistro(objRetorno.solicitacao)
                        }
                    }
                }
                wNumRegistro = wNumRegistro + 50;
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Error" + error + " - Linha: " + error.lineNumber));
    } finally {
        if (connectionWD != null) connectionWD.close();
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {


}

function onMobileSync(user) { }

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

function f_getLemontech(envelope, indAcao) {
    var retorno;

    var soap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://lemontech.com.br/selfbooking/wsselfbooking/services"> ';
    soap += '    <soapenv:Header>';
    soap += '    <ser:userPassword>' + senha + '</ser:userPassword>';
    soap += '    <ser:userName>' + userId + '</ser:userName>';
    soap += '    <ser:keyClient>' + clientKey + '</ser:keyClient>';
    soap += '    </soapenv:Header>';
    soap += envelope;
    soap += '</soapenv:Envelope>';


    var gson = new com.google.gson.Gson();
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + '',
        serviceCode: 'lemontech',
        endpoint: '',
        method: 'POST',
        timeoutService: '100',
        strParams: soap,
        options: {
            encoding: 'UTF-8',
            mediaType: 'text/xml'
        }
    }

    try {
        var vo = clientService.invoke(JSON.stringify(data));

        if (vo.getResult() == '' || vo.getResult().isEmpty()) {
            throw 'Retorno esta vazio';
        } else {
            // var jr = JSON.parse(vo.getResult());
            var jr = vo.getResult();

            if (indAcao == 'C') {
                var XMLString = jr;
                var json = new org.json.XML.toJSONObject(XMLString);
                var parse = JSON.parse(json.toString());
                var objRetorno = parse["S:Envelope"]["S:Body"]["ns2:pesquisarSolicitacaoResponse"];
                jr = objRetorno;
            }

            retorno = jr;
        }
    } catch (error) {
        retorno = null;
    }
    return retorno;
}

function f_criaDocumento(objFoto, obj, folderID, seq) {

    var wFotos = objFoto.imagens.imagem;
    var wLengthFotos = Object.keys(wFotos).length;

    for (var x = 0; x < wLengthFotos; x++) {
        var endImagem = '';

        if (wLengthFotos == 1) {
            endImagem = wFotos.urlImagem.replace(/&amp;/g, '&');
        } else {
            endImagem = wFotos[x].urlImagem.replace(/&amp;/g, '&');
        }


        var urlDownload = new java.net.URL(endImagem);
        var is = urlDownload.openStream();
        var bytesBuffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
        var baos = new java.io.ByteArrayOutputStream();
        var len = 0;

        while ((len = is.read(bytesBuffer, 0, bytesBuffer.length)) != -1) {
            baos.write(bytesBuffer, 0, len);
        }

        var fileContents = baos.toByteArray();
        baos.close();

        var fileName = '';
        var wFile = endImagem.split("?AWS");

        for (y = wFile[0].length; y > 0; y--) {
            if (wFile[0].substring(y, y + 1) == ".") {
                var wExtencao = wFile[0].substring(y, wFile[0].length);
                break;
            }
        }

        if ((wExtencao == '.jpeg') || (wExtencao == '.jpg')) {
            fileName = "image_" + seq + "_" + x + wExtencao;
        } else {
            fileName = "Arquivo_" + seq + "_" + x + wExtencao;
        }

        // newDataset.addRow(new Array("Valor2: " + objFoto.valor + " - " + endImagem));
        // newDataset.addRow(new Array("AWS: " + wFile[1]));
        // newDataset.addRow(new Array("Valor2:" + objFoto.valor + " Despesa: " + objFoto.tipoDespesa));

        fluigAPI.getContentFilesService().upload(fileName, fileContents);
        var idDocumento = f_gravaArquivo(folderID, "marcio.kobit", "Teste", fileName, obj.aprovador.nome);
        f_atualizaDocumento(idDocumento, obj.idSolicitacao, obj.solicitante.nomeCompleto, obj.aprovador.nome, obj.atendimento.posto, obj.descricaoCentroCusto, obj.dataAprovacao, objFoto.tipoDespesa, objFoto.valor);
    }
    var envelope = '   <soapenv:Body>';
    envelope += '        <ser:sincronizarSolicitacao>';
    envelope += '        <idSolicitacao>' + obj.idSolicitacao + '</idSolicitacao>';
    envelope += '        <sincronizado>true</sincronizado>';
    envelope += '        </ser:sincronizarSolicitacao>';
    envelope += '    </soapenv:Body>';

    f_getLemontech(envelope, 'G'); // Atualiza registro
}


function f_trataRegistro(obj) {

    try {
        if (obj.expense.prestacaoContas.status == 'APROVADO') {
            var retorno = f_gravaRegistro(obj.idSolicitacao, obj.expense.prestacaoContas.status, 'S');

            if (retorno == false) {
                newDataset.addRow(new Array("Solicitacao: " + obj.idSolicitacao + ' - ' + obj.solicitante.nome + ' + Status: ' + obj.expense.prestacaoContas.status));
                var folderID = pastaCliente(obj.idSolicitacao, obj.solicitante.nome)
                arquivosPasta(folderID);

                var objLancamentos = obj.expense.prestacaoContas.itens.item;
                var wLengthLacamentos = Object.keys(objLancamentos).length;
                if (obj.expense.prestacaoContas.itens.item.tipoDespesa == undefined) {
                    for (x = 0; x < wLengthLacamentos; x++) {
                        f_criaDocumento(objLancamentos[x], obj, folderID, x)
                    }
                } else {
                    f_criaDocumento(obj.expense.prestacaoContas.itens.item, obj, folderID, 0)
                }

            }
            // f_gravaRegistro(obj.idSolicitacao, obj.expense.prestacaoContas.status, 'S');
        }
    } catch (error) { }
}

function f_gravaArquivo(folderID, remetente, titulo, fileName, aprovador) {
    var parentFolder = folderID;

    var doc = new com.fluig.sdk.api.document.DocumentVO();
    // doc.setColleagueId(remetente);
    doc.setDeleted(false);
    doc.setDocumentDescription(titulo);
    doc.setPhisicalFile(fileName);
    doc.setDocumentType('2'); // 1 - Pasta; 2 - Documento; 3 - Documento Externo; 4 - Fichario; 5 - Fichas; 9 - Aplicativo; 10 - Relatorio.
    doc.setDownloadEnabled(true);
    doc.setInheritSecurity(true);
    doc.setParentDocumentId(parentFolder);
    doc.setPrivateDocument(false);
    // doc.setPublisherId(remetente);
    doc.setUpdateIsoProperties(true);
    doc.setUserNotify(false);
    doc.setExtraData("aprovador", aprovador);
    doc.setIndexed(true); //o default era false
    doc.setActiveVersion(true);
    doc.setTranslated(false);
    doc.setImutable(false);
    doc.setInternalVisualizer(true);

    var doc = fluigAPI.getDocumentService().createDocument(doc);

    var urlPED = fluigAPI.getDocumentService().getDownloadURL(doc.getDocumentId())
    return doc.getDocumentId();
}


function pastaCliente(solicitacao, description) {
    var parentFolder = 327308;

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("parentDocumentId", parentFolder, parentFolder, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST));
    var like = DatasetFactory.createConstraint("documentDescription", solicitacao + '%', solicitacao + '%', ConstraintType.SHOULD);
    like.setLikeSearch(true)
    constraints.push(like);
    var dsPasta = DatasetFactory.getDataset("document", null, constraints, null);
    var folderId = 0;
    if (dsPasta.rowsCount > 0) {
        folderId = dsPasta.getValue(0, "documentPK.documentId");
    } else {
        var cons = new Array();
        cons.push(DatasetFactory.createConstraint('FOLDER_NAME', solicitacao + ' - ' + description, null, ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('PARENT_FOLDER_CODE', parentFolder, null, ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('GROUP_HIDDEN', "", null, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset('ds_create_folder', null, cons, null);
        if (dataset.rowsCount > 0) {
            folderId = dataset.getValue(0, 'FOLDER');
        }
    }

    return folderId;
}

function arquivosPasta(parentFolder) {
    var retorno = false;
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("parentDocumentId", parentFolder, parentFolder, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST));
    var dsArquivo = DatasetFactory.getDataset("document", null, constraints, null);
    if (dsArquivo.rowsCount > 0) {
        retorno = true;
        for (x = 0; x < dsArquivo.rowsCount; x++) {
            var wDocumentID = dsArquivo.getValue(x, "documentPK.documentId");
            // var wDocumentoNome = dsArquivo.getValue(x, "documentDescription");
            fluigAPI.getDocumentService().deleteDocument(wDocumentID); //documentId tem que ser int
            // newDataset.addRow(new Array("Doc ID: " + wDocumentID + ' + Nome: ' + wDocumentoNome));
        }
    }

    return retorno;
}


function f_atualizaDocumento(idDocumento, idSolicitacao, solicitante, aprovador, atendimento, centro_custo, data_aprovacao, tipo_despesa, valor_despesa) {
    var retorno;

    var ds = DatasetFactory.getDataset('userIntegraFluig', null, null, null);
    var userEcm = ds.getValue(0, "user_fluig");
    var senhaEcm = ds.getValue(0, "pass_fluig");

    var soap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">';
    soap += '    <soapenv:Header/>';
    soap += '    <soapenv:Body>';
    soap += '    <ws:setDocumentCustomFields>';
    soap += '        <username>' + userEcm + '</username>';
    soap += '        <password>' + senhaEcm + '</password>';
    soap += '        <companyId>1</companyId>';
    soap += '        <documentCustomFields>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>idSolicitacao</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + idSolicitacao + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>solicitante</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + solicitante + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>aprovador</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + aprovador + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>atendimento</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + atendimento + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>centro_custo</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + centro_custo + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>data_aprovacao</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + data_aprovacao + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';

    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>tipo_despesa</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + tipo_despesa + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';
    soap += '            <item>';
    soap += '                <companyId>1</companyId>';
    soap += '                <customFieldId>valor_despesa</customFieldId>';
    soap += '                <documentId>' + idDocumento + '</documentId>';
    soap += '                <valueId>' + valor_despesa + '</valueId>';
    soap += '                <version>1000</version>';
    soap += '            </item>';



    soap += '        </documentCustomFields>';
    soap += '    </ws:setDocumentCustomFields>';
    soap += '    </soapenv:Body>';
    soap += '</soapenv:Envelope>';


    var gson = new com.google.gson.Gson();
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + '',
        serviceCode: 'ECMCustomFieldsService',
        endpoint: '',
        method: 'POST',
        timeoutService: '100',
        strParams: soap,
        options: {
            encoding: 'UTF-8',
            mediaType: 'text/xml'
        }
    }

    try {
        var vo = clientService.invoke(JSON.stringify(data));
        if (vo.getResult() == '' || vo.getResult().isEmpty()) {
            throw 'Retorno esta vazio';
        } else {
            var jr = vo.getResult();
            retorno = jr;
        }
    } catch (error) {
        retorno = null;
    }

    return retorno;
}

function f_formataData(pdata) {
    var data = new Date(pdata),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF;
}


function f_gravaRegistro(pNumSV, pStatus, pIntegrado) {

    retorno = false;
    try {
        // newDataset.addRow(new Array("Gravando Registro"));
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        var connectionWD = dataSourceWD.getConnection();
        var wIncluido = false;

        var SQL = "select numSV, status, integrado from FLUIG_PRD.dbo.kbt_t_lemontech where numSV = " + pNumSV;
        var statementWD = connectionWD.prepareStatement(SQL);
        var rsWD = statementWD.executeQuery();
        while (rsWD.next()) {
            wIncluido = true;
            if (rsWD.getString("status").trim() != pStatus.trim()) {
                var sqlUPD = "update kbt_t_lemontech set numSV = numSV ";
                if (rsWD.getString("status") != pStatus) {
                    sqlUPD += ",status = '" + pStatus + "'";
                }
                if (rsWD.getString("integrado") != pIntegrado) {
                    sqlUPD += ",integrado = '" + pIntegrado + "'";
                }

                sqlUPD += " where numSV = " + pNumSV;
                var statementWD = connectionWD.prepareStatement(sqlUPD);
                statementWD.executeUpdate();

            } else {
                retorno = true;
            }
        }
        if (wIncluido == false) {
            var sqlUPD = "insert into kbt_t_lemontech (numSV, status, integrado) values (" + pNumSV + ",'" + pStatus + "','" + pIntegrado + "')";
            var statementWD = connectionWD.prepareStatement(sqlUPD);
            statementWD.executeUpdate();
        }
    } catch (error) {

    } finally {
        if (rsWD != null) rsWD.close();
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return retorno;
    }

}