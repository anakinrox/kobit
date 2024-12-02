var dataTable = null;
var dadosDatatable = null;
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {


    if (pCodTable == "parcial") {

        mydata = [];
        rContent = ['codItem', 'nomeItem', 'numOrdem', 'coditemReq', 'nomeItemReq', 'codOper', 'nomeOper', 'saldo', 'ts'];
        rHeader = [
            { 'title': 'Item', 'dataorder': 'codItem', 'width': '10%' },
            { 'title': 'Produto', 'dataorder': 'nomeItem', 'width': '30%' },
            { 'title': 'Ordem', 'dataorder': 'numOrdem', 'width': '30%', 'display': true },
            { 'title': 'Cod. Item Req.', 'dataorder': 'coditemReq', 'width': '30%', 'display': false },
            { 'title': 'Item Req.', 'dataorder': 'nomeItemReq', 'width': '30%', 'display': false },
            { 'title': 'Cod. Operação', 'dataorder': 'codOper', 'width': '30%', 'display': false },
            { 'title': 'Operação', 'dataorder': 'nomeOper', 'width': '30%', 'display': false },
            { 'title': 'Saldo', 'dataorder': 'saldo', 'width': '30%', 'display': true },
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
            actions: {
                enabled: false,
                template: '.mydatatable-template-row-area-buttons',
                actionAreaStyle: 'col-md-6'
            },
            navButtons: {
                enabled: false,
                forwardstyle: 'btn-warning',
                backwardstyle: 'btn-warning',
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

function loadDadosDataTable(pCodTable, pFiltro, pFiltro2, pFiltro3) {
    loadWindow.show();

    if (pCodTable == 'parcial') {

        dadosDatatable = [];
        dataTable.reload(dadosDatatable);

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'ORDENS', 'ORDENS', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codempresa', $('#cod_empresa_' + $this.instanceId).val(), $('#cod_empresa_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numordem', $('#num_projeto_' + $this.instanceId).val(), $('#num_projeto_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('coditempai', $('#cod_item_' + $this.instanceId).val(), $('#cod_item_' + $this.instanceId).val(), ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_encerra_projeto", null, constraints, null, {
            success: (projeto) => {
                if (projeto.hasOwnProperty("values") && projeto.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < projeto.values.length; i++) {
                        var strIcone = "";
                        strIcone += " <input type='checkbox' id='ordens' value='" + projeto.values[i]["ordem"].trim() + "||" + projeto.values[i]["codoper"].trim() + "||" + projeto.values[i]["centrocusto"].trim() + "'>";

                        var datatableRow = {
                            codItem: projeto.values[i]["codigo"],
                            nomeItem: projeto.values[i]["item"],
                            numOrdem: projeto.values[i]["ordem"],
                            coditemReq: projeto.values[i]["coditemreq"],
                            nomeItemReq: projeto.values[i]["itemreq"],
                            codOper: projeto.values[i]["codoper"],
                            nomeOper: projeto.values[i]["operacao"],
                            saldo: (parseInt(projeto.values[i]["qtdplanejado"]) - parseInt(projeto.values[i]["qtdboas"])),
                            ts: strIcone
                        }


                        regs.push(datatableRow);

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

