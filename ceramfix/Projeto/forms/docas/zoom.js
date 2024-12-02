function openZoom({ field, filters }, id) {
    let filtersString = '';

    if ((id != null) || (id != undefined)) {
        var sLast = id.split('_').length;
        seq = id.split('_')[(sLast - 1)];

    }

    // grupos: ['Comunidade', 'communityDataset', 'alias,Código,name,Comunidade', 'alias,name', filtersString, field, false, 'default', null, null, 'name']

    if (filters) {
        const filtersArr = Object.entries(filters);
        filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
        console.log(filtersString);
    }
    const configs = {
        unidade: ['Unidade', 'fdwt_lojas', 'lojaCodigo,Código,lojaNome,Unidade', 'lojaCodigo,lojaNome', filtersString, field, false, 'default', null, null, 'lojaNome'],
        horario: ['Horários', 'kbt_t_expediente', 'codigo,Código,horaini,Início,horafim,Fim', 'codigo,horaini,horafim', filtersString, field, false, 'default', null, null, 'horaini']

    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, lojaCodigo, lojaNome, codigo, horaini, horafim,  ...item }) {
    // document.getElementById('objetoReservaCodigo').value = '';
    // document.getElementById('objetoReserva').value = '';



    if (type === 'unidade') {
        document.getElementById('cod_unidade').value = lojaCodigo;
        document.getElementById('nome_unidade').value = lojaNome;
        return;
    }

    if (type === 'horario') {
        document.getElementById('cod_horario___' + seq).value = codigo;
        document.getElementById('hor_inicio___' + seq).value = horaini;
        document.getElementById('hor_fim___' + seq).value = horafim;
        return;
    }

}

function clearSelectedZoomItem(type) {


    if (type === 'unidade') {
        document.getElementById('cod_unidade').value = '';
        document.getElementById('nome_unidade').value = '';
        return;
    }

}
