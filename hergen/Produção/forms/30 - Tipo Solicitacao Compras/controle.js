function loadBody() {
  console.log('entrei loadBody');

  loadDsCombo('empresa', 'selectLogix', 'cod_empresa', 'den_reduz', 'table', 'empresa', 'cod_empresa', 'S');
  loadDsCombo('cod_mod_embar', 'selectLogix', 'cod_mod_embar', 'den_mod_embar', 'table', 'modo_embarque', 'cod_mod_embar', 'S', 'S', 'S');
  //$('.decimal-0').maskMoney({ precision: 0, thousands: '', decimal: ',' });
}