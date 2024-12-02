function displayFields(form, customHTML) {

	
	if ( form.getValue( 'data_refer' ) == '' ){
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_refer', sdf.format(dtNow) );
	}		
	
	customHTML.append('<script>');
	customHTML.append("function getCompanyId() { return '" + getValue('WKCompany') + "'; };");
	customHTML.append("function getUserCode() { return '" + getValue('WKUser') + "'; };");
	customHTML.append('function getMobile() { return ' + form.getMobile() + '; };');
	customHTML.append("function getFormMode() { return '" + form.getFormMode() + "'; };");
	customHTML.append("function getCardId() { return '" + form.getDocumentId() + "'; };");
	customHTML.append('</script>');

}