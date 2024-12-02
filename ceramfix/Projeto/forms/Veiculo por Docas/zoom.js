var seq = 0;
function openZoom({ field, filters }, id) {

    if ((id != null) || (id != undefined)) {
        var sLast = id.split('_').length;
        seq = id.split('_')[(sLast - 1)];

    }

    let filtersString = '';

    if (filters) {
        const filtersArr = Object.entries(filters);
        filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
        console.log(filtersString);
    }
    const configs = {
        veiculo: ['Veículos', 'kbt_t_tipo_veiculo', 'codigo,Código,descricao,Descricao', 'codigo,descricao', filtersString, field, false, 'default', null, null, 'descricao'],
        doca: ['Docas', 'kbt_t_docas', 'codigo,Código,nome_unidade,Empresa,doca,Descricao', 'codigo,nome_unidade,doca', filtersString, field, false, 'default', null, null, 'doca']
    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, codigo, descricao, doca, nome_unidade, ...item }) {
    if (type === 'doca') {
        document.getElementById('cod_doca___' + seq).value = codigo;
        document.getElementById('empresa___' + seq).value = nome_unidade;
        document.getElementById('doca___' + seq).value = doca;
        return;
    }

    if (type === 'veiculo') {
        document.getElementById('cod_veiculo').value = codigo;
        document.getElementById('veiculo').value = descricao;
        return;
    }

    // if (type === 'departamento') {
    //     document.getElementById('cod_departamento').value = estruturaId;
    //     document.getElementById('nome_departamento').value = estruturaNome;
    //     return;
    // }

    // if (type === 'unidade') {
    //     document.getElementById('cod_unidade').value = lojaCodigo;
    //     document.getElementById('nome_unidade').value = lojaNome;
    //     return;
    // }

    // if (type === 'comunidade') {
    //     document.getElementById('cod_comunidade').value = alias;
    //     document.getElementById('nome_comunidade').value = name;
    //     return;
    // }



}
