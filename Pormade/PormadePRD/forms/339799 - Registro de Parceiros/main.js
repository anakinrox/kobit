function init() {
  const atividade = document.getElementById('atividade').value;

  if (atividade == '' || atividade == '4') {
    const btnReserva = document.getElementById('btnReserva');
    const btnCidade = document.getElementById('btnCidade');
    // const btnLocal = document.getElementById('btnLocal');

    btnReserva.onclick = () => openModalReserva(btnReserva.id);
    btnCidade.onclick = () => openModalCidade(btnCidade.id);
    // btnLocal.onclick = () => openModalLocal(btnLocal.id);
    FLUIGC.calendar('#data_parceiro');
  }

  const areaInteresse = document.getElementById('area_interesse');
  if (!areaInteresse.value) {
    areaInteresse.innerHTML = '';

    const option = document.createElement('option');
    option.innerText = 'Selecione uma área de interesse';
    option.value = '';

    areaInteresse.append(option);
  }

  document.getElementById('interesse').onchange = ({ target }) => {
    areaInteresse.innerHTML = '';

    const option = document.createElement('option');
    option.innerText = 'Selecione uma área de interesse';
    option.value = '';
    areaInteresse.append(option);

    if (!target.value) return (areaInteresse.value = '');

    const intersseComAreas = {
      parceria: ['ADVI', 'ADVA', 'Store in Store'],
      compras: ['Vendedores', 'Showroom', 'Televendas']
    };
    const areas = intersseComAreas[target.value];
    const options = areas.map((area) => {
      const option = document.createElement('option');
      option.innerText = area;
      option.value = area;
      return option;
    });

    areaInteresse.append(...options);
    areaInteresse.value = '';
  };
}

function openModalReserva(componente) {
  const titulo = 'Rotas';
  const dataset = 'ds_ReservasSalas';
  const fields = 'dataIni,Data Início,horaIni,Hora Início,dataFim,Data Fim,horaFim,Hora Fim,nome_motorista,Motorista,nomeEvento,Descrição';
  const resultFields =
    'tipo,nomeColaborador,sala,nomeEvento,filial,color,conferencia,description,dataIni,dataFim,horaIni,horaFim,id_cidade,den_cidade,uf,cod_uf,cod_pais,cod_cidade,id_motorista,email_motorista,id_ajudante,email_ajudante,den_cidade_uf,nome_motorista,nome_ajudante, documentid';
  const filters = `sqlLimit,250`;
  const largura = 'default';
  const searchby = 'nomeEvento';
  modalzoom.open(titulo, dataset, fields, resultFields, filters, componente, false, largura, null, null, searchby);
}

function openModalCidade(componente) {
  modalzoom.open(
    'Cidades',
    'selectTable',
    'cidade,Cidade,uf,UF,pais,Pais',
    'cod_erp,id,cidade,cod_uf,uf,nome,cod_pais,pais',
    'dataBase,java:/jdbc/CRMDS,table,fluig_v_cidade,banco,postgresql,sqlLimit,250',
    componente,
    true,
    'default',
    null,
    null,
    "uf||'-'||cidade"
  );
}

function openModalLocal(componente) {
  const reservaId = document.getElementById('reservaId').value;

  if (!reservaId)
    return FLUIGC.toast({
      message: 'Selecione uma Rota para poder selecionar um Local',
      type: 'warning'
    });

  modalzoom.open(
    'Locais',
    'ds_solicitacao_visitas',
    'local_visita,Local,tipo_local,Tipo de Local',
    'local_visita,tipo_local',
    // 'sqlLimit,250',
    'reservaId,' + reservaId + ',sqlLimit,250',
    componente,
    false,
    'default',
    null,
    null,
    ''
  );
}

function setSelectedZoomItem(zoomItem) {
  if (zoomItem.type == 'btnReserva') {
    document.getElementById('reservaId').value = zoomItem.documentid;
    document.getElementById('reserva').value = zoomItem.description;
  } else if (zoomItem.type == 'btnCidade') {
    document.getElementById('cidade_uf').value = zoomItem.cidade.trim() + '/' + zoomItem.uf;
    document.getElementById('cod_cidade').value = zoomItem.id;
    document.getElementById('cidade').value = zoomItem.cidade;
    document.getElementById('cod_uf').value = zoomItem.cod_uf;
    document.getElementById('uf').value = zoomItem.uf;
    document.getElementById('cod_pais').value = zoomItem.cod_pais;
  } else if (zoomItem.type == 'btnLocal') {
    document.getElementById('local_parceiro').value = zoomItem.local_visita;
  }
}
