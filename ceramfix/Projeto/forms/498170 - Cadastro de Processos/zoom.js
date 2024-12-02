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
        processos: ['Processos', 'processDefinition', 'processId,Código,processDescription,Descrição', 'processId,processDescription', filtersString, field, false, 'default', null, null, 'processDescription']


    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, processId, processDescription, ...item }) {


    if (type === 'processos') {
        document.getElementById('cod_proc').value = processId;
        document.getElementById('descr_proc').value = processDescription;
        return;
    }

}
