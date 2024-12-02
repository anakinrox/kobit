function createDataset(fields, constraints, sortFields) {

	log.info('Inicio dataset dsC_GetStatusAssinatura');
	var dataset = DatasetBuilder.newDataset();

	
	
	dataset.addColumn('status');
	dataset.addColumn('email');
	dataset.addColumn('autoRespondedReason');
	dataset.addColumn('roleName');
	dataset.addColumn('declinedReason');
	dataset.addColumn('name');
	
	log.info("EXECUTANDO CONSULTA DE STATUS ");
	
	//var envolpID = String(constraints[0].initialValue);
	
	//var envolpID = "0d023c2c-db37-41cb-9190-4050d5c2339a";
	//var envolpID = "0e86b50e-586a-4514-bd79-7ca77c2a289c";//fields[0];
	if( fields != null ){
		if( fields.length > 0 ){
			var envolpID = String(fields[0]);	
		}else{
			var envolpID = 	"9ff901c8-90c8-40ff-af25-5c36d4c6920f";
		}
	}else{
		var envolpID = 	"9ff901c8-90c8-40ff-af25-5c36d4c6920f";
	}
	
	//var envolpID = 	"834d550b-0940-4e1c-9fbb-c7795ff12f72";

	
	//envolpID = "1b8301ce-ca95-4804-9e6e-274af4502e3c";


	log.info("EXECUTANDO CONSULTA DE STATUS " + envolpID);
	
	
	try {
		
		 
		var endPoint = '12508112/envelopes/'+envolpID+"/recipients";
		
		var clientService = fluigAPI.getAuthorizeClientService();

		var data = {
			companyId: "1",
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
	            'X-DocuSign-Authentication':'{"Username":"assinatura.fluig@timacagro.com.br","Password":"AssinaFLUIG","IntegratorKey":"d3e35dc2-f44f-4e7a-8f4b-fefbc0a77d3d"}'
	        }
		}

		var vo = clientService.invoke(JSON.stringify(data));

		log.info('vo');
		log.info(vo);
		
		log.info('retorno');
		log.info(vo.getResult());
				

		var resultado = JSON.parse(vo.getResult())
		var x = resultado;
		log.info('Resultado de X:');
		log.info(x);
		if (x.recipientCount == 0) { // Erro na consulta
	
			dataset.addRow(new Array('Sem Info','Sem Info','Sem Info','Sem Info','Sem Info','Sem Info'));
		} else { // Sucesso na consulta
			for( var i = 0; i < x.recipientCount; i++ ){
				dataset.addRow(new Array( x.signers[i]['status'], x.signers[i]['email'], x.signers[i]['autoRespondedReason'], x.signers[i]['roleName'], x.signers[i]['declinedReason'], x.signers[i]['name']  ) );
			}
		}
		
		
	} catch (err) {
		log.info(err)
		dataset.addRow(new Array('Erro', 'Erro', 'Erro', 'Erro', 'Erro', 'Erro'))
	}
	log.info('Fim dataset dsC_GetStatusAssinatura');
	return dataset
}