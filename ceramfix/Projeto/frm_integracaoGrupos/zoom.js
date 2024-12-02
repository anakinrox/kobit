function openZoom({ field, filters }) {
    let filtersString = '';



    if (filters) {
        const filtersArr = Object.entries(filters);
        filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
        console.log(filtersString);
    }
    const configs = {
        cargo: ['Cargos', 'fdwt_estrutura_empresa_cargo', 'cargoId,Código,cargoNome,Cargo', 'cargoId,cargoNome', filtersString, field, false, 'default', null, null, 'cargoNome'],
        departamento: ['Departamentos', 'fdwt_estrutura_empresa', 'estruturaId,Código,estruturaNome,Departamento', 'estruturaId,estruturaNome', filtersString, field, false, 'default', null, null, 'estruturaNome'],
        unidade: ['Unidade', 'fdwt_lojas', 'lojaCodigo,Código,lojaNome,Unidade', 'lojaCodigo,lojaNome', filtersString, field, false, 'default', null, null, 'lojaNome'],
        grupos: ['Grupos', 'group', 'groupId,Código,groupDescrition,Grupo', 'groupId,groupDescrition', filtersString, field, false, 'default', null, null, 'groupDescrition']


    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, cargoId, cargoNome, estruturaId, estruturaNome, alias, name, lojaCodigo, lojaNome, groupId, groupDescrition, ...item }) {
    // document.getElementById('objetoReservaCodigo').value = '';
    // document.getElementById('objetoReserva').value = '';


    if (type === 'cargo') {
        document.getElementById('cod_cargo').value = cargoId;
        document.getElementById('nome_cargo').value = cargoNome;
        return;
    }

    if (type === 'departamento') {
        document.getElementById('cod_departamento').value = estruturaId;
        document.getElementById('nome_departamento').value = estruturaNome;
        return;
    }

    if (type === 'unidade') {
        document.getElementById('cod_unidade').value = lojaCodigo;
        document.getElementById('nome_unidade').value = lojaNome;
        return;
    }

    if (type === 'grupo') {
        document.getElementById('cod_grupo').value = groupId;
        document.getElementById('nome_grupo').value = groupDescrition;
        return;
    }



}
