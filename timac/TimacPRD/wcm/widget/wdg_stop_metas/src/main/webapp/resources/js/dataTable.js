var dataTable = null;
var dadosDatatable = [];
var dataTableEntrega = null;
var dadosDatatableEntrega = [];
var dataTableViagem = null;
var dadosDatatableViagem = [];
var rContent = [];
var rHeader = [];
var markers = [];
var circulos = [];
var map;

function loadDataTable(pCodTable) {

    if (pCodTable == 'default') {
        rContent = ['nom_cargo', 'nom_are', 'nom_usuario', 'ano', 'mes01', 'mes02', 'mes03', 'mes04', 'mes05', 'mes06', 'mes07', 'mes08', 'mes09', 'mes10', 'mes11', 'mes12', 'dat_atualizacao', 'ts'];

        rHeader = [
            { 'title': 'Cargo', 'dataorder': 'nom_cargo', 'width': '30%' },
            { 'title': 'Area', 'dataorder': 'nom_area', 'width': '30%' },
            { 'title': 'Usuário', 'dataorder': 'nom_usuario', 'width': '30%' },
            { 'title': 'Ano', 'dataorder': 'ano', 'width': '10%' },
            { 'title': 'Mês 01', 'dataorder': 'mes01', 'width': '10%' },
            { 'title': 'Mês 02', 'dataorder': 'mes02', 'width': '10%' },
            { 'title': 'Mês 03', 'dataorder': 'mes03', 'width': '10%' },
            { 'title': 'Mês 04', 'dataorder': 'mes04', 'width': '10%' },
            { 'title': 'Mês 05', 'dataorder': 'mes05', 'width': '10%' },
            { 'title': 'Mês 06', 'dataorder': 'mes06', 'width': '10%' },
            { 'title': 'Mês 07', 'dataorder': 'mes07', 'width': '10%' },
            { 'title': 'Mês 08', 'dataorder': 'mes08', 'width': '10%' },
            { 'title': 'Mês 09', 'dataorder': 'mes09', 'width': '10%' },
            { 'title': 'Mês 10', 'dataorder': 'mes10', 'width': '10%' },
            { 'title': 'Mês 11', 'dataorder': 'mes11', 'width': '10%' },
            { 'title': 'Mês 12', 'dataorder': 'mes12', 'width': '10%' },
            { 'title': 'Data', 'dataorder': 'dat_atualizacao', 'width': '10%' },
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


        if ($('#ano_' + $this.instanceId).val() == "") {
            FLUIGC.toast({
                message: 'Pelo menos o filtro "ANO" deve ser informado para realizar a consulta.',
                type: 'danger'
            });

            loadWindow.hide();
            return false;

        }


        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('ind_acao', 'C', 'C', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('area', $('#area_' + $this.instanceId).val(), $('#area_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cargo', $('#cargo_' + $this.instanceId).val(), $('#cargo_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('usuario', $('#matricula_' + $this.instanceId).val(), $('#matricula_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('ano', $('#ano_' + $this.instanceId).val(), $('#ano_' + $this.instanceId).val(), ConstraintType.MUST));
        var metas = DatasetFactory.getDataset("dts_metas_stop", null, constraints, null);

        if (metas.rowsCount == 0) {
            throw "Não cadastrado o parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < metas.values.length; i++) {
                if (metas.values[i]["CARGO"] != undefined) {
                    var strIcone = "";

                    strIcone += "<button type='button' class='btn btn-info' title='Editar Meta' data-load-editarMeta><i class='fluigicon fluigicon-pencil icon-xs'></i></button>";
                    strIcone += "<button type='button' class='btn btn-danger' title='Remover Meta' data-load-removerMeta><i class='fluigicon fluigicon-trash icon-xs'></i></button>";

                    var datatableRow = {
                        nom_cargo: metas.values[i]["CARGO"],
                        nom_are: metas.values[i]["AREA"],
                        nom_usuario: isnull(metas.values[i]["USUARIO"], " "),
                        ano: parseInt(isnull(metas.values[i]["ANO"], 0), 10),
                        mes01: parseInt(isnull(metas.values[i]["MES01"], 0), 10),
                        mes02: parseInt(isnull(metas.values[i]["MES02"], 0), 10),
                        mes03: parseInt(isnull(metas.values[i]["MES03"], 0), 10),
                        mes04: parseInt(isnull(metas.values[i]["MES04"], 0), 10),
                        mes05: parseInt(isnull(metas.values[i]["MES05"], 0), 10),
                        mes06: parseInt(isnull(metas.values[i]["MES06"], 0), 10),
                        mes07: parseInt(isnull(metas.values[i]["MES07"], 0), 10),
                        mes08: parseInt(isnull(metas.values[i]["MES08"], 0), 10),
                        mes09: parseInt(isnull(metas.values[i]["MES09"], 0), 10),
                        mes10: parseInt(isnull(metas.values[i]["MES10"], 0), 10),
                        mes11: parseInt(isnull(metas.values[i]["MES11"], 0), 10),
                        mes12: parseInt(isnull(metas.values[i]["MES12"], 0), 10),
                        dat_atualizacao: isnull(metas.values[i]["ATUALIZADO"], " "),
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