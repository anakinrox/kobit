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
        cargo: ['Cargos', 'fdwt_estrutura_empresa_cargo', 'cargoId,Código,cargoNome,Cargo', 'cargoId,cargoNome', filtersString, field, false, 'default', null, null, 'cargoNome'],
        curso: ['Cursos', 'dsk_lms', 'idcurso,Código,codcurso,code,curso,Curso', 'idcurso,codcurso,curso', filtersString, field, false, 'default', null, null, 'curso'],
        departamento: ['Departamentos', 'fdwt_estrutura_empresa', 'estruturaId,Código,estruturaNome,Departamento', 'estruturaId,estruturaNome', filtersString, field, false, 'default', null, null, 'estruturaNome'],
        unidade: ['Unidade', 'fdwt_lojas', 'lojaCodigo,Código,lojaNome,Unidade', 'lojaCodigo,lojaNome', filtersString, field, false, 'default', null, null, 'lojaNome'],
        comunidade: ['Comunidade', 'communityDataset', 'alias,Código,name,Comunidade', 'alias,name', filtersString, field, false, 'default', null, null, 'name']


    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, cargoId, cargoNome, idcurso, codcurso, curso, estruturaId, estruturaNome, alias, name, lojaCodigo, lojaNome, ...item }) {
    if (type === 'cargo') {
        document.getElementById('cod_cargo___' + seq).value = cargoId;
        document.getElementById('nome_cargo___' + seq).value = cargoNome;
        return;
    }

    if (type === 'curso') {
        document.getElementById('id_curso').value = idcurso;
        document.getElementById('code_curso').value = codcurso;
        document.getElementById('nome_curso').value = curso;
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

    if (type === 'comunidade') {
        document.getElementById('cod_comunidade').value = alias;
        document.getElementById('nome_comunidade').value = name;
        return;
    }



}
