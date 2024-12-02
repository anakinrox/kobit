function afterStateEntry(sequenceId) {
  if (sequenceId == 5) {
    var solicitacao = getValue('WKNumProces') + '';
    hAPI.setCardValue('num_solic', solicitacao);
  }

  hAPI.setCardValue('atividade', sequenceId + '');
}
