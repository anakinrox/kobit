function displayFields(form, customHTML) {

	customHTML.append('<script>');
	customHTML.append("function getCompanyId() { return '" + getValue('WKCompany') + "'; };");
	customHTML.append("function getUserCode() { return '" + getValue('WKUser') + "'; };");
	customHTML.append('function getMobile() { return ' + form.getMobile() + '; };');
	customHTML.append("function getFormMode() { return '" + form.getFormMode() + "'; };");
	customHTML.append("function getCardId() { return '" + form.getDocumentId() + "'; };");
	customHTML.append('</script>');

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);


	if (form.getValue('codigo') == '') {
		log.info('ENTROU IF');
		//recupera o ultimo registro desse form
		var ult_registro = 0;
		var ult_registro_encontrado = 0;
		var constraints = new Array();
		var dataset = DatasetFactory.getDataset("ds_cadastro_epi", null, constraints, null);
		if (dataset != null && dataset.rowsCount > 0) {
			log.info('ENTROU IF 2');
			for (i = 0; i < dataset.rowsCount; i++) {
				log.info('ENTROU FOR' + parseInt(dataset.getValue(i, "codigo")));
				ult_registro_encontrado = parseInt(dataset.getValue(i, "codigo"));
				if (parseInt(ult_registro_encontrado) > parseInt(ult_registro)) {
					form.setValue('codigo', (parseInt(ult_registro_encontrado)) + 1);
					log.info('ENTROU FOR2' + parseInt(ult_registro_encontrado.toInteger));
				}
			}
		} else {
			log.info('ENTROU ELSE');
			form.setValue('codigo', ult_registro + 1);
		}

	}

}