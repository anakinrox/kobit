function displayFields(form, customHTML) {
  form.setShowDisabledFields(true);
  form.setHidePrintLink(true);

  var matric = getValue('WKUser');
  var constraint = DatasetFactory.createConstraint('colleaguePK.colleagueId', matric, matric, ConstraintType.MUST);
  var colleagueDataSet = DatasetFactory.getDataset('colleague', null, [constraint], null);
  var usuario = colleagueDataSet.getValue(0, 'colleagueName');
  var idUsuario = colleagueDataSet.getValue(0, 'colleaguePK.colleagueId');

  if (form.getFormMode() == 'ADD' || form.getFormMode() == 'MOD') {
    form.setValue('responsavelCodigo', idUsuario);
    form.setValue('responsavel', usuario);
  }

  customHTML.append('<script>');
  customHTML.append('function getMobile() { return ' + form.getMobile() + '; };');
  customHTML.append("function getFormMode() { return '" + form.getFormMode() + "'; };");
  customHTML.append("function getCardId() { return '" + form.getDocumentId() + "'; };");
  customHTML.append('</script>');
}
