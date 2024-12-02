function createDataset(fields, constraints, sortFields) {
	// return fCreateDataset(fields, constraints, sortFields)
	return fCreateDataset(fields, constraints, sortFields)
}

function fCreateDataset(fields, constraints, sortFields) {
	log.info('Inicio dataset dsC_GetStatusAssinatura');
	var dataset = DatasetBuilder.newDataset();

	
	
	
	dataset.addColumn('status');
	dataset.addColumn('envelopeId');
	dataset.addColumn('expireEnabled');
	dataset.addColumn('expireDateTime');
	dataset.addColumn('expireAfter');
	
	//var envolpID = String(constraints[0].initialValue);
	
	//var envolpID = "0d023c2c-db37-41cb-9190-4050d5c2339a";
	//var envolpID = "0e86b50e-586a-4514-bd79-7ca77c2a289c";//fields[0];
	//var envolpID = String(fields[0]);
	var envolpID = 	"d69f54a1-e029-4f11-9030-03087374c89e";


	
	
	
	try {
		
		 
		var endPoint = '12508112/envelopes/'+envolpID+'/documents/1';
		
		var clientService = fluigAPI.getAuthorizeClientService();

		var data = {
			companyId: "" + getValue('WKCompany') + "",
			serviceCode: 'DocuSign_Envelopes',
			endpoint: endPoint,
			method: 'get',
			timeoutService: '200',
			options: {
				useSSL: false
			},
	        headers: {
	            //Authorization: 'Bearer ' + acess_Token
				'Content-Type': 'application/json',
	            'X-DocuSign-Authentication':'{"Username":"assinatura.fluig@timacagro.com.br","Password":"AssinaFLUIG","IntegratorKey":"d3e35dc2-f44f-4e7a-8f4b-fefbc0a77d3d"}',
	            'Accept-Encoding': 'gzip, deflate, br',
	            'Connection':'keep-alive',
	            'Accept': '*/*'
	        }
		}

		var vo = clientService.invoke(JSON.stringify(data));

		log.info('vo');
		log.info(vo);
		
		log.info('retorno');
		//log.info(vo.getResult());
		log.info(vo.getResult().getClass().getName());
		
		

		//log.info(resultado);
		
		createFormPdfAttachment(vo.getResult());

		//var resultado = JSON.parse(vo.getResult());
		
		//var x = resultado;
		//log.info('Resultado de X:');
		//log.info(x);
		if (x.length == 0) { // Erro na consulta
	
			dataset.addRow(new Array('Sem Info','Sem Info','Sem Info','Sem Info','Sem Info'));
		} else { // Sucesso na consulta
			dataset.addRow(new Array(x.status, x.envelopeId, x.expireEnabled, x.expireDateTime, x.expireAfter));
		}
		
		
	} catch (err) {
		log.info(err)
		dataset.addRow(new Array('Erro', 'Erro', 'Erro', 'Erro'))
	}
	log.info('Fim dataset dsC_GetStatusAssinatura');
	return dataset
}


function byteDocs(stream2){
	
	return stream2.getBytes();
	
	//IOUtils.toInputStream(initialString)
	//ByteArrayInputStream
	var is = org.apache.commons.io.IOUtils.toInputStream(stream2);
	
	//return org.apache.pdfbox.pdmodel.PDDocument();
	
	/*
	return is;
	
	return is.readAllBytes();
*/
	
	//return stream.getBytes();
	//var is 			= stream2;//.getBytes();//urlDownload.openStream();
	
	
	
    var bytesBuffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
    var baos 		= new java.io.ByteArrayOutputStream();
    var len 		= 0;

    while ((len = is.read(bytesBuffer, 0, bytesBuffer.length)) != -1) {
        baos.write(bytesBuffer, 0, len);
    }


    
    var fileContents = baos.toByteArray();

    baos.close();

    
    log.info("RETORNOX");
	
	log.info(fileContents);
	
	//return java.util.Base64.getEncoder().encodeToString(fileContents);

    return fileContents;
	

	
	
	
	//var file = new java.io.File.File(stream2);
	
	
	
	log.info("RETORNOX");
	
	log.info(stream2);
	
	
	log.info("RETORNO2");
	log.info(stream2.getBytes());
	
	var retorn = java.util.Base64.getEncoder().encodeToString(stream2.getBytes());
	log.info("RETORNO");
	log.info(retorn);
	var bytesArray = java.util.Base64.getDecoder().decode(retorn);
	log.info("RETORNO 3");
	log.info(bytesArray);
	
	
	
	return bytesArray;
	
}




/**
 * Cria um PDF com os dados do formulário e o anexa ao Processo
 *
 * @throws {string} Exceção com a mensagem de erro
 */
function createFormPdfAttachment(stream) {
    var serviceHelper = ServiceManager.getService("ECMDocumentService").getBean();
    var service = serviceHelper.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService").getDocumentServicePort();

    if (service == null) {
        log.error("Erro ao carregar ECMDocumentService");
        throw "Erro ao gerar PDF do formulário";
    }

    try {
    	
    	
        var fileName = "Contratação.pdf";
        var attachment = serviceHelper.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");
        attachment.setFileName(fileName);
        attachment.setFileSize(1);
        attachment.setAttach(true);
        attachment.setEditing(false);
        attachment.setPrincipal(true);
        attachment.setFilecontent(byteDocs(stream));

        var attachmentArray = serviceHelper.instantiate("com.totvs.technology.ecm.dm.ws.AttachmentArray");
        attachmentArray.getItem().add(attachment);

        var FOLDER_FORM_PDF = '11881';

        //var fluigCredentials = getFluigWebServiceUser();

        var result = service.createSimpleDocument(
            'totvs2',//fluigCredentials.username,
            'Timac#2021',//fluigCredentials.password,
            1,
            FOLDER_FORM_PDF,
            "totvs2",
            fileName,
            attachmentArray
        );

        log.info('FINALIZADO ANEXO');

        
       // hAPI.attachDocument(result.getItem().get(0).getDocumentId());
    } catch (err) {
        log.error(err);
        throw "Erro ao gerar PDF do formulário";
    }
}
