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
        usuarios: ['Usuarios', 'colleague', 'colleagueId,Código,colleagueName,Nome', 'colleagueId,colleagueName', 'active,true', field, false, 'default', null, null, 'colleagueName']
    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, colleagueId, colleagueName, ...item }) {
    console.log(type + ' - ' + colleagueId + ' - ' + colleagueName)
    if (type === 'usuarios') {
        document.getElementById('cod_matricula_novo___' + seq).value = colleagueId;
        document.getElementById('nome_usuario_novo___' + seq).value = colleagueName;
        return;
    }

}


function clearSelectedZoomItem(type) {

}