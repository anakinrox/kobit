function main() {
    const formMode = getFormMode();

    // if (formMode != 'VIEW') {
    //     const dateConfig = {
    //         pickDate: true,
    //         pickTime: true,
    //         sideBySide: true,
    //         language: 'pt_BR'
    //     };
    // FLUIGC.calendar('#dataHoraInicio', dateConfig);
    // FLUIGC.calendar('#dataHoraFim', dateConfig);


    const $btnZoomCargo = document.getElementById('bt_cargo');
    $btnZoomCargo.addEventListener('click', () => openZoom({ field: 'cargo' }));

    const $btnZoomTipoObjetoReserva = document.getElementById('btnZoomTipoObjetoReserva');
    $btnZoomTipoObjetoReserva.addEventListener('click', () => openZoom({ field: 'tipoObjetoReserva' }));

    const $btnZoomObjetoReserva = document.getElementById('btnZoomObjetoReserva');

    $btnZoomObjetoReserva.addEventListener('click', () => {
        const empresa = document.getElementById('empresaCodigo').value;
        const tipoObjetoReserva = document.getElementById('tipoObjetoReservaCodigo').value;
        if (empresa == '' || tipoObjetoReserva == '')
            return FLUIGC.toast({
                message: 'Selecionar Empresa e Tipo de Objeto de Reserva',
                type: 'warning'
            });

        const filters = { empresa, tipo: tipoObjetoReserva };
        openZoom({ field: 'objetoReserva', filters });
    });

    const $btnClearEmpresa = document.getElementById('btnClearEmpresa');
    $btnClearEmpresa.addEventListener('click', () => {
        document.getElementById('empresa').value = '';
        document.getElementById('empresaCodigo').value = '';
    });

    const $btnClearTipoObjetoReserva = document.getElementById('btnClearTipoObjetoReserva');
    $btnClearTipoObjetoReserva.addEventListener('click', () => {
        document.getElementById('tipoObjetoReserva').value = '';
        document.getElementById('tipoObjetoReservaCodigo').value = '';
    });

    const $btnClearObjetoReserva = document.getElementById('btnClearObjetoReserva');
    $btnClearObjetoReserva.addEventListener('click', () => {
        document.getElementById('objetoReserva').value = '';
        document.getElementById('objetoReservaCodigo').value = '';
    });
}

const settings = {
    changeDelay: 200,
    control: 'wheel',
    defaultValue: '#4C25E6',
    inline: false,
    letterCase: 'uppercase',
    opacity: true,
    position: 'bottom left'
};

window.cor = FLUIGC.colorpicker('#cor', settings);

