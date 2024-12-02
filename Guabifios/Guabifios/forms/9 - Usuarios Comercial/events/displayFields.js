function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);
	
	form.setHidePrintLink(true);
	
	form.setValue('descricao', form.getValue('nome_usuario')+' - '+form.getValue('cod_repres')+' - '+form.getValue('raz_social') );
	
}