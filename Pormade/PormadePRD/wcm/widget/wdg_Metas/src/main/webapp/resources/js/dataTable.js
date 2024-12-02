var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {

    if (pCodTable == 'default') {
        rContent = ['matricula', 'user_crm', 'uf', 'nom_gestorVenda', 'nom_usuario', 'cod_tipo_cadastro', 'nom_tipo_cadastro', 'meta_porta', 'meta_rodape', 'meta_ferragem', 'meta_loja_porta', 'meta_loja_ferragem', 'dat_incial', 'dat_final', 'ts'];

        rHeader = [
            { 'title': 'matricula', 'dataorder': 'matricula', 'width': '30%', 'display': false },
            { 'title': 'user_crm', 'dataorder': 'user_crm', 'width': '30%', 'display': false },
            { 'title': 'UF', 'dataorder': 'uf', 'width': '10%' },
            { 'title': 'Gestor Venda', 'dataorder': 'nom_gestorVenda', 'width': '30%' },
            { 'title': 'Usuário', 'dataorder': 'nom_usuario', 'width': '30%' },
            { 'title': 'cod_tipo_cadastro', 'dataorder': 'cod_tipo_cadastro', 'width': '30%', 'display': false },
            { 'title': 'Tipo Vendedor', 'dataorder': 'nom_tipo_cadastro', 'width': '30%' },
            { 'title': 'Meta Porta', 'dataorder': 'meta_porta', 'width': '10%' },
            { 'title': 'Meta Rodapé', 'dataorder': 'meta_rodape', 'width': '10%' },
            { 'title': 'Meta Ferragem', 'dataorder': 'meta_ferragem', 'width': '10%' },
            { 'title': 'Meta Porta Loja ', 'dataorder': 'meta_loja_porta', 'width': '10%' },
            { 'title': 'Meta Ferragem Loja', 'dataorder': 'meta_loja_ferragem', 'width': '10%' },
            { 'title': 'Vigencia Incial', 'dataorder': 'dat_incial', 'width': '10%' },
            { 'title': 'Vigencia Final', 'dataorder': 'dat_final', 'width': '10%' },
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
        constraints.push(DatasetFactory.createConstraint('matricula', $('#matricula_' + $this.instanceId).val(), $('#matricula_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codgestor', $('#cod_gestor_' + $this.instanceId).val(), $('#cod_gestor_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('nomeUF', $('#nomeUF_' + $this.instanceId).val(), $('#nomeUF_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('tipoCadastro', $('#codregistro_' + $this.instanceId).val(), $('#codregistro_' + $this.instanceId).val(), ConstraintType.MUST));
        var metas = DatasetFactory.getDataset("dts_metas", null, constraints, null);

        if (metas.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < metas.values.length; i++) {
                if (metas.values[i]["USERCRM"] != undefined) {
                    var strIcone = "";

                    strIcone += "<button type='button' class='btn btn-info' title='Editar Meta' data-load-editarMeta><i class='fluigicon fluigicon-pencil icon-xs'></i></button>";
                    strIcone += "<button type='button' class='btn btn-danger' title='Remover Meta' data-load-removerMeta><i class='fluigicon fluigicon-remove icon-xs'></i></button>";

                    var datatableRow = {
                        matricula: metas.values[i]["MATRICULA"],
                        user_crm: metas.values[i]["USERCRM"],
                        nom_gestorVenda: isnull(metas.values[i]["GESTOR"], " "),
                        uf: isnull(metas.values[i]["UF"], " "),
                        nom_usuario: isnull(metas.values[i]["USUARIO"], " "),
                        cod_tipo_cadastro: isnull(metas.values[i]["TIPO_CADASTRO"], " "),
                        nom_tipo_cadastro: isnull(metas.values[i]["NOME_TIPO_CADASTRO"], " "),
                        meta_porta: parseInt(isnull(metas.values[i]["META_PORTA"], 0), 10),
                        meta_rodape: parseInt(isnull(metas.values[i]["META_RODAPE"], 0), 10),
                        meta_ferragem: parseInt(isnull(metas.values[i]["META_FERRAGEM"], 0), 10),
                        meta_loja_porta: parseInt(isnull(metas.values[i]["META_PORTA_LOJA"], 0), 10),
                        meta_loja_ferragem: parseInt(isnull(metas.values[i]["META_FERRAGEM_PORTA"], 0), 10),
                        dat_incial: metas.values[i]["DAT_VIGENCIA_INI"].split('-').reverse().join('/'),
                        dat_final: metas.values[i]["DAT_VIGENCIA_FIM"].split('-').reverse().join('/'),
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