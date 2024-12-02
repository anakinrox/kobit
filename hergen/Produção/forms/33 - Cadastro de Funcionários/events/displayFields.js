function displayFields(form, customHTML) {

	customHTML.append('<script>');
	customHTML.append("function getCompanyId() { return '" + getValue('WKCompany') + "'; };");
	customHTML.append("function getUserCode() { return '" + getValue('WKUser') + "'; };");
	customHTML.append('function getMobile() { return ' + form.getMobile() + '; };');
	customHTML.append("function getFormMode() { return '" + form.getFormMode() + "'; };");
	customHTML.append("function getCardId() { return '" + form.getDocumentId() + "'; };");
	customHTML.append('</script>');

}