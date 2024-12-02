function displayFields(form, customHTML){ 
	//carrega o campo do código
	if ( form.getValue( 'codigo') == '' ){
		log.info('ENTROU IF' );
		//recupera o ultimo registro desse form
		var ult_registro = 0;
		var ult_registro_encontrado = 0;
		var constraints = new Array();
		var dataset = DatasetFactory.getDataset("dsTipoLocal", null, constraints, null);
		if (dataset != null && dataset.rowsCount>0) {
			log.info('ENTROU IF 2' );
			for (i = 0; i < dataset.rowsCount; i++) {
				log.info('ENTROU FOR '+parseInt(dataset.getValue(i,"codigo")) );
				ult_registro_encontrado = parseInt(dataset.getValue(i,"codigo"));
				log.info('TESTE1 '+parseInt(ult_registro_encontrado));
				log.info('TESTE2 '+ parseInt(ult_registro));
				if (parseInt(ult_registro_encontrado) > parseInt(ult_registro)) {
					form.setValue('codigo', (parseInt(ult_registro_encontrado))+1);
					log.info('ENTROU FOR X2 '+parseInt(ult_registro_encontrado) );
					ult_registro = parseInt(ult_registro_encontrado);
				}
			}
		} else {
			log.info('ENTROU ELSE' );
			form.setValue('codigo', ult_registro+1);
		}
		
	}
	//fim carga do campo do código
	
}
