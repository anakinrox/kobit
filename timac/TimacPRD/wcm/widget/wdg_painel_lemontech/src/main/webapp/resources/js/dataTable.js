var dataTable = null;
var dadosDatatable = null;
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {


    if (pCodTable == "default") {

        // alert('aqui')

        mydata = [];
        rContent = ['numsv', 'dataregistro', 'status', 'ts'];
        rHeader = [
            { 'title': 'Nº SV', 'dataorder': 'numsv', 'width': '30%' },
            { 'title': 'Importado', 'dataorder': 'dataregistro', 'width': '30%' },
            { 'title': 'Status', 'dataorder': 'status', 'width': '30%' },
            { 'title': '', 'width': '0%' }

        ];

        dataTable = FLUIGC.datatable('#idtable' + "_" + $this.instanceId, {
            dataRequest: mydata,
            renderContent: rContent,
            limit: 10,
            responsive: true,
            tableStyle: 'table table-striped table-responsive',
            header: rHeader,
            search: {
                enabled: false,
                onSearch: function (res) {
                    var data = dadosDatatable;
                    var search = data.filter(function (el) {
                        return (el.nomeItem.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.codItem.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.nomeItem.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTable.reload(search);
                },
                onlyEnterkey: true,
                searchAreaStyle: 'col-md-5'
            },
            scroll: {
                target: ".target",
                enabled: true
            },
            actions: {},
            navButtons: {},
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

function loadDadosDataTable(pCodTable, pFiltro, pFiltro2, pFiltro3) {
    loadWindow.show();

    if (pCodTable == 'default') {

        dadosDatatable = [];
        dataTable.reload(dadosDatatable);

        if ($('#dt_ini_' + $this.instanceId).val().trim() != "" && $('#dt_fim_' + $this.instanceId).val().trim() == "") {
            FLUIGC.toast({
                message: 'Os Campo  [ Data Início e Fim ] devem ser preenchido.',
                type: 'danger'
            });
            loadWindow.hide();
            return false;
        }

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'CONSULTAR', 'CONSULTAR', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numsv', $('#num_sv_' + $this.instanceId).val(), $('#num_sv_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datini', $('#dt_ini_' + $this.instanceId).val(), $('#dt_ini_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datfim', $('#dt_fim_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
        DatasetFactory.getDataset("dts_consulta_lemontech", null, constraints, null, {
            success: (lemon) => {
                if (lemon.hasOwnProperty("values") && lemon.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < lemon.values.length; i++) {
                        var strIcone = "";
                        if (lemon.values[i]["status"] == 'APROVADO') {
                            strIcone += "<button type='button' class='btn btn-danger btn-xs' title='Integrar novamente' data-load-removerItem><i class='fluigicon fluigicon-remove icon-xs' aria-hidden='true'></i></button>";
                        }

                        var datatableRow = {
                            numsv: lemon.values[i]["numsv"],
                            dataregistro: lemon.values[i]["data"],
                            status: lemon.values[i]["status"],
                            ts: strIcone
                        }

                        regs.push(datatableRow);
                        // }
                    }
                    dadosDatatable = regs;
                    dataTable.reload(regs);


                }
                loadWindow.hide();
            },

            error: (err) => {
                // toast(data.values[0]['MSG'], "danger");
                loadWindow.hide();
            },
        });

    }
}


function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}


function f_validaDisable(objClick, disable) {
    if ((disable == "") || (disable == null)) {

        if (objClick.id == "bt_itemClear") {
            $('.grp_user').val('');
            return false;
        }

        if (objClick.id == "bt_refClear") {
            $('.grp_user2').val('');
            return false;
        }

        if (objClick.id == "bt_familiaClear") {
            $('.grp_user2').val('');
            return false;
        }

        zoom(objClick.id)

    }

}


function clearSelectedZoomItem(type) {

}

