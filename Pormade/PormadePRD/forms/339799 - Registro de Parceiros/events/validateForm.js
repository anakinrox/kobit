function validateForm(form) {
  var atividade = getValue('WKNumState');
  var message = '';
  var isEmpty = getEmptyValidator(form);

  if (atividade == 0 || atividade == 4) {
    if (isEmpty('reserva')) message += 'O campo Rota é obriagatório\n';
    if (isEmpty('contato')) message += 'O campo Contato é obriagatório\n';
    if (isEmpty('local_parceiro')) message += 'O campo Local é obriagatório\n';
    if (isEmpty('telefone')) message += 'O campo Telefone é obriagatório\n';
    if (isEmpty('cidade')) message += 'O campo Cidade é obriagatório\n';
    if (isEmpty('data_parceiro')) message += 'O campo Data é obriagatório\n';
  }
  if (message != '') throw message;
}

function getEmptyValidator(form) {
  return function (field) {
    var value = form.getValue(field);
    return value == null || value.trim().length() == 0 || typeof value === undefined;
  };
}
