var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {

    if (pCodTable == 'default') {
        rContent = ['idresposta', 'datregistro', 'codpormade', 'nome', 'indganho', 'nomindicado', 'nota', 'status', 'ts'];

        rHeader = [
            { 'title': 'idresposta', 'dataorder': 'idresposta', 'width': '30%', 'display': false },
            { 'title': 'Data', 'dataorder': 'datregistro', 'width': '10%', 'display': true },
            { 'title': 'Código', 'dataorder': 'codpormade', 'width': '30%' },
            { 'title': 'Nome', 'dataorder': 'nome', 'width': '30%' },
            { 'title': 'Tipo Ganho', 'dataorder': 'indganho', 'width': '10%' },
            { 'title': 'Indicado', 'dataorder': 'nomindicado', 'width': '10%' },
            { 'title': 'Nota Geral', 'dataorder': 'nota', 'width': '10%' },
            { 'title': 'Status', 'dataorder': 'status', 'width': '10%' },
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


}

function loadDadosDataTable(pCodTable, pFiltro, pFiltro2, pFiltro3) {
    loadWindow.show();

    if (pCodTable == 'default') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('ind_acao', 'C', 'C', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datini', $('#dt_ini_' + $this.instanceId).val(), $('#matricula_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datafim', $('#dt_fim_' + $this.instanceId).val(), $('#cod_gestor_' + $this.instanceId).val(), ConstraintType.MUST));
        var jform = DatasetFactory.getDataset("dts_jotform", null, constraints, null);

        if (jform.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < jform.values.length; i++) {
                if (jform.values[i]["idresposta"] != '') {
                    var strIcone = "";
                    var strGanho = 'Ganhe 20';
                    if (jform.values[i]["indganho"] == 'true') {
                        strGanho = 'Ganhe 50';
                    }
                    var datatableRow = {
                        idresposta: jform.values[i]["idresposta"],
                        datregistro: jform.values[i]["data"].split('-').reverse().join('/'),
                        codpormade: jform.values[i]["codigoparceiro"],
                        nome: isnull(jform.values[i]["nome"], " "),
                        indganho: strGanho,
                        nomindicado: jform.values[i]["indicado"],
                        nota: isnull(jform.values[i]["notageral"], " "),
                        status: isnull(jform.values[i]["pipe"], " "),
                        ts: strIcone
                    }

                    regs.push(datatableRow);
                }
            }
            dataTable.reload(regs);
        }
    }
    loadWindow.hide();
}


function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}