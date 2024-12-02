function openZoom({ field, filters }) {
    let filtersString = '';

    if (filters) {
        const filtersArr = Object.entries(filters);
        filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
        console.log(filtersString);
    }
    const configs = {
        cidades: ['Cidades', 'dsk_cidades_app', 'codigo,Código,uf,UF,cidade,Cidade', 'codigo,uf,cidade', filtersString, field, false, 'default', null, null, 'cidade']

    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, codigo, uf, cidade, ...item }) {
    // document.getElementById('objetoReservaCodigo').value = '';
    // document.getElementById('objetoReserva').value = '';


    if (type === 'cidades') {
        document.getElementById('cod_cidade').value = codigo;
        document.getElementById('uf_cidade').value = uf;
        document.getElementById('nome_cidade').value = cidade;
        return;
    }

}

function clearSelectedZoomItem(type) {
    if (type === 'cidades') {
        document.getElementById('cod_cidade').value = '';
        document.getElementById('uf_cidade').value = '';
        document.getElementById('nome_cidade').value = '';
        return;
    }
}
