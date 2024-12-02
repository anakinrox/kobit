var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {

    if (pCodTable == 'TC') {
        // rContent = ['nome', 'chefeimadiato', 'empresa', 'filial', 'sessao', 'departamento', 'funcao'];
        rContent = ['filial', 'matricula', 'nome', 'funcao', 'situacao', 'dataadmissao', 'codquipe', 'denequipe', 'codsecao', 'nomsecao', 'chefeimediato1', 'chefeimediato2', 'chefeimediato3', 'chefeimediato4'];

        rHeader = [
            { 'title': 'Filial', 'dataorder': 'filial', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Matricula', 'dataorder': 'matricula', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Funcionário', 'dataorder': 'nome', 'size': 'col-md-2', 'display': true },
            { 'title': 'Função', 'dataorder': 'funcao', 'size': 'col-sd-2', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Admissão', 'dataorder': 'dataadmissao', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Cod. Equipe', 'dataorder': 'codquipe', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Equipe', 'dataorder': 'denequipe', 'size': 'col-sd-2', 'display': true },
            { 'title': 'Cod. Seção', 'dataorder': 'codsecao', 'size': 'col-sd-1', 'display': true },
            { 'title': 'Seção', 'dataorder': 'nomsecao', 'size': 'col-md-2', 'display': true },
            { 'title': 'Chefe 1', 'dataorder': 'chefeimediato1', 'size': 'col-sd-2', 'display': true },
            { 'title': 'Chefe 2', 'dataorder': 'chefeimediato2', 'size': 'col-sd-2', 'display': true },
            { 'title': 'Chefe 3', 'dataorder': 'chefeimediato3', 'size': 'col-sd-2', 'display': true },
            { 'title': 'Chefe 4', 'dataorder': 'chefeimediato4', 'size': 'col-sd-2', 'display': true }

        ];


        dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
            dataRequest: dadosDatatable,
            renderContent: rContent,
            limit: 10,
            responsive: true,
            tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
            emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
            header: rHeader,
            "columnDefs": [
                //Estilos Das Colunas
                { className: 'text-left	', targets: [1] },
                { className: 'text-center', targets: [0, 2, 3] },
            ],
            search: {
                enabled: true,
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

    if (pCodTable == 'TC') {
        var wIndParametro = $('#indParametro_' + $this.instanceId).val();
        var wCodGestor = $('#cod_cadastro_' + $this.instanceId).val();
        var wEmpresa = $('#cod_empresa_' + $this.instanceId).val();
        var wFilial = $('#cod_filial_' + $this.instanceId).val();
        var wSecao = $('#cod_secao_' + $this.instanceId).val();
        var wDepartamento = $('#cod_departamento_' + $this.instanceId).val();
        var wFuncao = $('#cod_funcao_' + $this.instanceId).val();
        var wSituacao = $('#indSituacao_' + $this.instanceId).val();


        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'HE', 'HE', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codgestor', wCodGestor, wCodGestor, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('empresa', wEmpresa, wEmpresa, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('filial', wFilial, wFilial, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('secao', wSecao, wSecao, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('departamento', wDepartamento, wDepartamento, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('situacao', wSituacao, wSituacao, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('funcao', wFuncao, wFuncao, ConstraintType.MUST));

        DatasetFactory.getDataset("dsk_hieraquia", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        // rContent = ['filial', 'matricula', 'nome', 'funcao', 'situacao', 'dataadmissao', 'codquipe', 'denequipe', 'codsecao', 'nomsecao', 'chefeimediato1', 'chefeimediato2', 'chefeimediato3', 'chefeimediato4'];

                        var datatableRow = {
                            filial: data.values[i]["filial"],
                            matricula: data.values[i]["chapa"],
                            nome: data.values[i]["nome"],
                            funcao: data.values[i]["funcao"],
                            situacao: data.values[i]["situacao"],
                            dataadmissao: data.values[i]["dataadmissao"],
                            codquipe: sIsNull(data.values[i]["codequipe"], ''),
                            denequipe: sIsNull(data.values[i]["denequipe"], ''),
                            codsecao: data.values[i]["codsecao"],
                            nomsecao: data.values[i]["sessao"],
                            chefeimediato1: data.values[i]["chefeimadiato1"],
                            chefeimediato2: data.values[i]["chefeimadiato2"],
                            chefeimediato3: data.values[i]["chefeimadiato3"],
                            chefeimediato4: data.values[i]["chefeimadiato4"]
                        }

                        regs.push(datatableRow);

                    }
                    dataTable.reload(regs);
                    loadWindow.hide();
                }

            },

            error: (err) => {
                toast("Erro ao atualizar. [ " + err + " ]", "danger");
                loadWindow.hide();
            },
        });

    }




}


