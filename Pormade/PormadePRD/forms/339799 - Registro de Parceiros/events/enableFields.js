function enableFields(form) {
  form.setShowDisabledFields(true);
  form.setHidePrintLink(true);

  var atividade = getValue('WKNumState');
  var enable = getEnableFields(form);

  disableAll(form);

  if (atividade == 0 || atividade == 4) {
    enable('contato', true);
    enable('local_parceiro', true);
    enable('nome', true);
    enable('telefone', true);
    enable('data_parceiro', true);
    enable('interesse', true);
    enable('area_interesse', true);
  }
}

function getEnableFields(form) {
  return function (field, enabled) {
    form.setEnabled(field, enabled);
  };
}

function disableAll(form) {
  var enable = getEnableFields(form);
  enable('contato', false);
  enable('local_parceiro', false);
  enable('nome', false);
  enable('telefone', false);
  enable('data_parceiro', false);
  enable('interesse', false);
  enable('area_interesse', false);
}
