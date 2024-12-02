var dataTable = null;
var dataTableFotos = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];
var token = '';


function loadDataTable(pCodTable) {

    if (pCodTable == 'SERVICOS') {
        rContent = ['id', 'seq', 'produto', 'descricao', 'local', 'ts'];

        rHeader = [
            { 'title': 'id', 'dataorder': 'id', 'size': 'col-md-1', 'display': false },
            { 'title': 'seq', 'dataorder': 'seq', 'size': 'col-md-1', 'display': false },
            { 'title': 'produto', 'dataorder': 'produto', 'size': 'col-md-1', 'display': false },
            { 'title': 'Descrição', 'dataorder': 'descricao', 'size': 'col-md-6', 'display': true },
            { 'title': 'Local', 'dataorder': 'local', 'size': 'col-md-4', 'display': true },
            { 'title': '', 'width': '0%' }
        ];


        dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
            dataRequest: dadosDatatable,
            renderContent: rContent,
            limit: 10,
            responsive: true,
            tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
            emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
            header: rHeader,
            search: {
                enabled: false,
                onSearch: function (res) {
                    // console.log( res );
                    var data = dadosDatatable;
                    var search = data.filter(function (el) {
                        return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTable.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtable_' + $this.instanceId,
                enabled: false
            },
            navButtons: {
                enabled: false,
            },
            draggable: {
                enabled: false
            },

        }, function (err, data) {
            if (err) {
                FLUIGC.toast({
                    message: err,
                    type: 'danger'
                });
            } else {
                loadWindow.hide();
            }
        });
    }

    if (pCodTable == 'FOTOS') {
        rContent = ['foto'];

        rHeader = [
            { 'title': 'Foto', 'dataorder': 'foto', 'size': 'col-md-8', 'display': true }
        ];


        dataTableFotos = FLUIGC.datatable('#idTBLFotos_' + $this.instanceId, {
            dataRequest: dadosDatatable,
            renderContent: rContent,
            limit: 10,
            responsive: true,
            tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
            emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
            header: rHeader,
            search: {
                enabled: false,
                onSearch: function (res) {
                    // console.log( res );
                    var data = dadosDatatable;
                    var search = data.filter(function (el) {
                        return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTable.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtable_' + $this.instanceId,
                enabled: false
            },
            navButtons: {
                enabled: false,
            },
            draggable: {
                enabled: false
            },

        }, function (err, data) {
            if (err) {
                FLUIGC.toast({
                    message: err,
                    type: 'danger'
                });
            } else {
                loadWindow.hide();
            }
        });
    }
}

function loadImagens(pIndAcao, pFiltro1, pFiltro2, pFiltro3) {

    var wparams = window.location.href.split('/');
    token = atob(wparams[(wparams.length - 1)]);

    if (pIndAcao == 'FOTOS') {
        loadWindow.show();
        // return false;
        const constraintDS = [
            publicDataset.createConstraint("indacao", 'FOTOS', 'FOTOS', ConstraintType.MUST),
            publicDataset.createConstraint("idregistro", pFiltro1, pFiltro1, ConstraintType.MUST),
            publicDataset.createConstraint("seqitem", pFiltro2, pFiltro2, ConstraintType.MUST),
            publicDataset.createConstraint("produto", pFiltro3, pFiltro3, ConstraintType.MUST)
        ];


        publicDataset.getDataset("dsk_instaladores", null, constraintDS, null, {
            success: data => {

                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var x = 0; x < data.values.length; x++) {
                        // console.log(data.values[x]['FOTO']);
                        var wImage = '<img src="' + data.values[x]['FOTO'] + '" id="idFotoMotoro" width="300px">';

                        var datatableRow = {
                            foto: wImage
                        }
                        regs.push(datatableRow)
                    }

                    // console.log(data.values[]);
                    dataTableFotos.reload(regs);
                    loadWindow.hide();
                } else {
                    loadWindow.hide();
                }
            }
        });

    }


    if (pIndAcao == 'SERVICOS') {
        // return false;
        const constraintDS = [
            publicDataset.createConstraint("indacao", 'SERVICOS', 'SERVICOS', ConstraintType.MUST),
            publicDataset.createConstraint("idregistro", token, token, ConstraintType.MUST)
        ];

        loadWindow.show();
        publicDataset.getDataset("dsk_instaladores", null, constraintDS, null, {
            success: data => {

                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    if (data.values.length > 0) {
                        $("#nomCLiente").text(data.values[0]['RESPONSAVEL']);
                    }

                    var wItens = JSON.parse(data.values[0].ITENS);
                    for (var x = 0; x < wItens.length; x++) {
                        var strIcone = "";
                        strIcone += "<button type='button' class='btn btn-info btn-xs' title='Visualizar Fotos' data-load-visualizarFoto><i class='flaticon flaticon-broken-image icon-md' aria-hidden='true'></i></button>";

                        var datatableRow = {
                            id: token,
                            seq: wItens[x]['seq'],
                            produto: wItens[x]['produto'],
                            descricao: wItens[x]['descricao'],
                            local: wItens[x]['local'],
                            ts: strIcone
                        }
                        regs.push(datatableRow)
                    }

                    // console.log(data.values[]);
                    dataTable.reload(regs);
                    loadWindow.hide();
                } else {
                    loadWindow.hide();
                }
            }
        });
        // loadWindow.hide();
    }

}

function f_mensagem(pSize, pTitulo, pMensagem) {
    bootbox.alert({
        size: pSize,
        title: pTitulo,
        message: pMensagem,
        callback: function () { /* your callback code */ }
    });
}


$(document).ready(function () {
    $('input[type=radio][name=aprovar]').change(function () {
        if (this.value == "S") {
            $('#idMotivoAprovacao').css('display', 'none');

            $('#idNotaAprovacao').css('display', 'inline');

        } else if (this.value == "N") {
            $('#idMotivoAprovacao').css('display', 'inline');
            $('#idNotaAprovacao').css('display', 'none');
            $('#desc_motivo').focus();
        }
    });
});