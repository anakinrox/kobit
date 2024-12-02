function openZoom({ field, filters }) {
  let filtersString = '';

  if (filters) {
    const filtersArr = Object.entries(filters);
    filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
    console.log(filtersString);
  }
  const configs = {
    empresa: ['Empresa', 'dsEmpresaReserva', 'codigo,Código,descricao,Empresa,timeZone,TimeZone', 'codigo,descricao,timeZone', filtersString, field, false, 'default', null, null, 'descricao'],
    tipoObjetoReserva: ['Tipo de Objeto de Reserva', 'dsTipoObjetoReserva', 'codigo,Código,descricao,Descrição', 'codigo,descricao', filtersString, field, false, 'default', null, null, 'descricao'],
    objetoReserva: ['Objeto de Reserva', 'dsObjetosReserva', 'codigo,Código,descricao,Descrição', 'codigo,descricao,cor', filtersString, field, false, 'default', null, null, 'descricao']
  };

  const config = configs[field];
  if (config) {
    modalzoom.open(...config);
  }
}

function setSelectedZoomItem({ type, codigo, descricao, cor, ...item }) {
  document.getElementById('objetoReservaCodigo').value = '';
  document.getElementById('objetoReserva').value = '';

  if (type === 'empresa') {
    document.getElementById('empresaCodigo').value = codigo;
    document.getElementById('empresa').value = descricao;
    document.getElementById('timeZone').value = item.timeZone;
    return;
  }

  if (type === 'tipoObjetoReserva') {
    document.getElementById('tipoObjetoReservaCodigo').value = codigo;
    document.getElementById('tipoObjetoReserva').value = descricao;
    return;
  }

  if (type === 'objetoReserva') {
    document.getElementById('objetoReservaCodigo').value = codigo;
    document.getElementById('objetoReserva').value = descricao;
    window.cor.value(cor);
    return;
  }
}
