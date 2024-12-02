var debug = false;
var newDataset;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    try {

        var listaConstraits = {};
        listaConstraits['envelope'] = "";
        var gson = new com.google.gson.Gson();
        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
            }
        }

        if (listaConstraits['envelope'] == '') {
            listaConstraits['envelope'] = '2a21a20c-9063-42e0-86b0-4dcb320603a1';
        }

        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn("documentId");
        newDataset.addColumn("uri");
        newDataset.addColumn("name");
        newDataset.addColumn("type");
        newDataset.addColumn("idDocumento");

        var retorno = f_consultarDocumentos(listaConstraits['envelope']);
        if (retorno != null || retorno != '') {
            if (retorno.errorCode == undefined) {

                // Cria a pasta do Evelope pesquisada
                var folderID = pastaCliente(listaConstraits['envelope']);
                for (var i = 0; i < retorno.envelopeDocuments.length; i++) {
                    var idDocumento = f_criaDocumento(retorno.envelopeDocuments[i].uri, retorno.envelopeDocuments[i].name, folderID);
                    newDataset.addRow(new Array(
                        retorno.envelopeDocuments[i].documentId,
                        retorno.envelopeDocuments[i].uri,
                        retorno.envelopeDocuments[i].name,
                        retorno.envelopeDocuments[i].type,
                        idDocumento
                    ));
                }
            } else {
                newDataset.addRow(new Array("Retorno: " + gson.toJson(retorno)));
            }
        }

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
    } finally {
        return newDataset;
    }
}

function onMobileSync(user) {

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

function f_consultarDocumentos(pEnvelope, pIdDocumento) {

    var retorno = null;
    var metodo = "GET";
    var wServiceCode = "docsign";
    var params;
    var gson = new com.google.gson.Gson();
    var headers = {};
    var params;

    var account = "";
    var username = "";
    var password = "";
    var IntegratorKey = "";

    var wIdDocumento = '';

    if (pIdDocumento != undefined) {
        wIdDocumento = '/' + pIdDocumento;
        headers["Content-Transfer-Encoding"] = "binary";
    }

    var constraints = new Array();
    var dataset = DatasetFactory.getDataset("kbt_t_paramdocsign", null, constraints, null);
    if (dataset != null || dataset.rowsCount > 0) {
        account = dataset.getValue(0, "str_conta");
        username = dataset.getValue(0, "str_usuario");
        password = dataset.getValue(0, "str_senha");
        IntegratorKey = dataset.getValue(0, "str_id_integracao");
    } else {
        throw "Parâmetros de integração não encontrados";
    }

    var Endpoint = "/" + account + "/envelopes/" + pEnvelope + '/documents' + wIdDocumento;
    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: getValue("WKCompany") + "",
        serviceCode: wServiceCode,
        endpoint: Endpoint,
        timeoutService: "240",
        method: metodo,
    };

    var DocuSign = {
        "Username": username,
        "Password": password,
        "IntegratorKey": IntegratorKey
    };

    headers["Accept"] = "*/*";
    headers["X-DocuSign-Authentication"] = gson.toJson(DocuSign);

    data["headers"] = headers;
    data["params"] = params;

    // var jj = JSON.stringify(data);
    var jj = gson.toJson(data)
    var vo = clientService.invoke(jj);
    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        try {
            if (pIdDocumento == undefined) {
                var jr = JSON.parse(vo.getResult());
            } else {
                var jr = vo.getResult();
            }

            retorno = jr;
        } catch (error) {
            retorno = error
        }
    }

    return retorno;
}

function pastaCliente(pEvelope) {
    var parentFolder = 128982;

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("parentDocumentId", parentFolder, parentFolder, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST));
    var like = DatasetFactory.createConstraint("documentDescription", pEvelope + '%', pEvelope + '%', ConstraintType.SHOULD);
    like.setLikeSearch(true)
    constraints.push(like);
    var dsPasta = DatasetFactory.getDataset("document", null, constraints, null);
    var folderId = 0;
    if (dsPasta.rowsCount > 0) {
        folderId = dsPasta.getValue(0, "documentPK.documentId");
    } else {
        var cons = new Array();
        cons.push(DatasetFactory.createConstraint('FOLDER_NAME', pEvelope, null, ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('PARENT_FOLDER_CODE', parentFolder, null, ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('GROUP_HIDDEN', "", null, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset('ds_create_folder', null, cons, null);
        if (dataset.rowsCount > 0) {
            folderId = dataset.getValue(0, 'FOLDER');
        }
    }

    return folderId;
}

function f_criaDocumento(url, nomArquivo, folderID) {

    try {
        var idDocumento = null;

        var fileContents = f_downloadDoc(url);
        var fileName = nomArquivo;
        var wFile = nomArquivo;
        var wExtencao = '';

        for (y = wFile.length; y > 0; y--) {
            if (wFile.substring(y, y + 1) == ".") {
                wExtencao = wFile.substring(y, wFile.length);
                break;
            }
        }

        if (wExtencao == '') {
            wExtencao = '.pdf';
            fileName = fileName + '.pdf';
        }

        fluigAPI.getContentFilesService().upload(fileName, fileContents);
        idDocumento = f_gravaArquivo(folderID, "marcio.kobit", "Teste", fileName, 'DocSign', wExtencao);
    } catch (error) {
        newDataset.addRow(new Array("Erro Gravar: " + error + " linha: " + error.lineNumber));
    } finally {
        return idDocumento;
    }

}


function f_downloadDoc(url) {

    try {
        var httpConnection = null;
        var account = "";
        var username = "";
        var password = "";
        var IntegratorKey = "";

        var constraints = new Array();
        var dataset = DatasetFactory.getDataset("kbt_t_paramdocsign", null, constraints, null);
        if (dataset != null || dataset.rowsCount > 0) {
            account = dataset.getValue(0, "str_conta");
            username = dataset.getValue(0, "str_usuario");
            password = dataset.getValue(0, "str_senha");
            IntegratorKey = dataset.getValue(0, "str_id_integracao");
        } else {
            throw "Parâmetros de integração não encontrados";
        }

        var url = new java.net.URL("https://demo.docusign.net/restapi/v2.1/accounts/" + account + url);
        httpConnection = url.openConnection();
        httpConnection.setRequestMethod("GET");
        httpConnection.setDoInput(true);
        httpConnection.setRequestProperty("X-DocuSign-Authentication", "{\"Username\":\"" + username + "\",\"Password\":\"" + password + "\",\"IntegratorKey\":\"" + IntegratorKey + "\"}");
        httpConnection.connect();

        var bytes = com.twelvemonkeys.io.FileUtil.read(httpConnection.getInputStream());
        return bytes;

    } catch (e) {
        throw e;
    } finally {
        if (httpConnection != null) {
            httpConnection.disconnect();
        }
    }
}

function f_gravaArquivo(folderID, remetente, titulo, fileName, aprovador, extencao) {
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
    if ((extencao == '.jpeg') || (extencao == '.jpg')) {
        doc.setInternalVisualizer(false);
    } else {
        doc.setInternalVisualizer(true);
    }

    var doc = fluigAPI.getDocumentService().createDocument(doc);

    var urlPED = fluigAPI.getDocumentService().getDownloadURL(doc.getDocumentId())
    return doc.getDocumentId();
}

