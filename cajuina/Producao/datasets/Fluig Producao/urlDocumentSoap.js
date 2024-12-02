var debug = false;
function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var datasetReturn = DatasetBuilder.newDataset();
	
	datasetReturn.addColumn( "result" );
	
	try{

		var numDocum = 27232;
		
		if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	    		if ( constraints[i].fieldName == 'documentID' ){
	    			numDocum = parseInt( constraints[i].initialValue );
	    			log.info('Entrei empresa........... '+constraints[i].initialValue );
	    		}
	        }
		}
		
		
		var logix = ServiceManager.getService('DataSetFluig'); 
		var serviceHelper  = logix.getBean();
		var serviceLocator = serviceHelper.instantiate('com.totvs.technology.ecm.dataservice.ws.ECMDatasetServiceService'); 
		var service = serviceLocator.getDatasetServicePort(); 

		var filtroArr = serviceHelper.instantiate('com.totvs.technology.ecm.dataservice.ws.SearchConstraintDtoArray'); 	
		var filtro = serviceHelper.instantiate('com.totvs.technology.ecm.dataservice.ws.SearchConstraintDto'); 
		
		filtro.setContraintType('MUST');
		filtro.setFieldName('documentID');
		filtro.setInitialValue(numDocum);
		filtro.setFinalValue(numDocum);
		filtro.setLikeSearch(false);
		

		var StringArray = serviceHelper.instantiate('net.java.dev.jaxb.array.StringArray');	
		filtroArr.getItem().add( filtro );		
		var retorno = service.getDataset(1, 'kobit', '@Ar5642Cj!', 'urlDocument', StringArray, filtroArr, StringArray);


		if( retorno.getValues().size() > 0 ){
			datasetReturn.addRow( new Array('' + retorno.getValues().get(0).getValue() ) );
		}
        
	} catch (error ){
		log.error(error );
		// datasetReturn.addRow(new Array('NOK'));
		datasetReturn.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
	}
	return datasetReturn;
	
}

function onMobileSync(user) {

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