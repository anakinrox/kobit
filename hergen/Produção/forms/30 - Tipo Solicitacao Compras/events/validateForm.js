function validateForm(form){
	
	if( form.getValue("ativo") == ""
	 || form.getValue("regularizacao") == ""
     || form.getValue("tipo_erp") == ""
     || form.getValue("den_tipo_solic") == "" ){
		throw "Existe campos obrigatários não preenchidos! (Descrição, Tipo, Regularização ou Ativo)"
	}
	
}