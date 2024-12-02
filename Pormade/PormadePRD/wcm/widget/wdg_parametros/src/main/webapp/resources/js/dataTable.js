var dataTable = null;
var dataTableItem = null;
var dataTablePerfilDisp = null;
var dataTablePerfilSet = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {

    if (pCodTable == 'TC') {
        rContent = ['codigo', 'tipo', 'situacao', 'ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': true },
            { 'title': 'Tipo', 'dataorder': 'tipo', 'size': 'col-md-5', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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

    if (pCodTable == 'PA') {
        rContent = ['codigo', 'tipocadastro', 'descricao', 'tipodados', 'valorpadrao', 'situacao', 'ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': true },
            { 'title': 'Tipo Cadastro', 'dataorder': 'tipocadastro', 'size': 'col-md-1', 'display': true },
            { 'title': 'Descrição', 'dataorder': 'descricao', 'size': 'col-md-4', 'display': true },
            { 'title': 'Tipo de Dados', 'dataorder': 'tipodados', 'size': 'col-md-1', 'display': true },
            { 'title': 'Valor Padrão', 'dataorder': 'valorpadrao', 'size': 'col-md-3', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-1', 'display': true },            
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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

    if (pCodTable == 'CA') {
        rContent = ['codigo', 'descricao', 'situacao', 'ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': true },
            { 'title': 'Categoria', 'dataorder': 'descricao', 'size': 'col-md-5', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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
    
    if (pCodTable == 'NI') {
        rContent = ['codigo', 'descricao', 'situacao', 'ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': true },
            { 'title': 'Nivel', 'dataorder': 'descricao', 'size': 'col-md-5', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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
    
    if (pCodTable == 'CATITEM') {
        // '#idTBLCatagoriaitem_' + $this.instanceId
        rContent = ['codcategoria', 'codparametro', 'parametro', 'tipodados','valor', 'ts'];

        rHeader = [
            { 'title': 'codcategoria', 'dataorder': 'codcategoria', 'size': 'col-md-1', 'display': false },
            { 'title': 'Código', 'dataorder': 'codparametro', 'size': 'col-md-1', 'display': true },
            { 'title': 'Parâmetro', 'dataorder': 'parametro', 'size': 'col-md-2', 'display': true },
            { 'title': 'Tipo Dados', 'dataorder': 'tipodados', 'size': 'col-md-1', 'display': true },
            { 'title': 'Valor', 'dataorder': 'valor', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

        dataTableItem = FLUIGC.datatable('#idTBLCatagoriaitem_' + $this.instanceId, {
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
    
    if (pCodTable == 'PE') {
        rContent = ['codigo', 'descricao', 'situacao', 'ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': true },
            { 'title': 'Perfil', 'dataorder': 'descricao', 'size': 'col-md-5', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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
    
    if (pCodTable == 'US') {
        rContent = ['codigo', 'nome', 'codperfil', 'perfil', 'codnivel', 'nivel', 'situacao','ts'];

        rHeader = [
            { 'title': 'Código', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': false },
            { 'title': 'Nome', 'dataorder': 'nome', 'size': 'col-md-5', 'display': true },
            { 'title': 'codperfil', 'dataorder': 'codperfil', 'size': 'col-md-2', 'display': false },
            { 'title': 'Perfil', 'dataorder': 'perfil', 'size': 'col-md-2', 'display': true },
            { 'title': 'codnivel', 'dataorder': 'codnivel', 'size': 'col-md-2', 'display': false },
            { 'title': 'Nível', 'dataorder': 'nivel', 'size': 'col-md-2', 'display': true },
            { 'title': 'Situação', 'dataorder': 'situacao', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

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


    if (pCodTable == 'PECATDISP') {
        // '#idTBLCatagoriaitem_' + $this.instanceId
        rContent = ['codcategoria', 'codparametro', 'parametro', 'tipodados', 'ts'];

        rHeader = [
            { 'title': 'codcategoria', 'dataorder': 'codcategoria', 'size': 'col-md-1', 'display': false },
            { 'title': 'codparametro', 'dataorder': 'codparametro', 'size': 'col-md-1', 'display': false },
            { 'title': 'Parâmetro', 'dataorder': 'parametro', 'size': 'col-md-2', 'display': true },
            { 'title': 'Tipo', 'dataorder': 'tipodados', 'size': 'col-md-1', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

        dataTablePerfilDisp = FLUIGC.datatable('#idTBLPerfiCategoriaItemDisp_' + $this.instanceId, {
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

    if (pCodTable == 'PECATSET') {
        // '#idTBLCatagoriaitem_' + $this.instanceId
        rContent = ['codcategoria', 'codparametro', 'parametro', 'tipodados', 'valor', 'ts'];

        rHeader = [
            { 'title': 'codcategoria', 'dataorder': 'codcategoria', 'size': 'col-md-1', 'display': false },
            { 'title': 'codparametro', 'dataorder': 'codparametro', 'size': 'col-md-1', 'display': false },
            { 'title': 'Parâmetro', 'dataorder': 'parametro', 'size': 'col-md-2', 'display': true },
            { 'title': 'Tipo', 'dataorder': 'tipodados', 'size': 'col-md-1', 'display': false },
            { 'title': 'Valor', 'dataorder': 'valor', 'size': 'col-md-2', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        // alert('aqui');

        dataTablePerfilSet = FLUIGC.datatable('#idTBLPerfilCategoriaItemSelect_' + $this.instanceId, {
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

    if (pCodTable == 'TC') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'TP', 'TP', ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Editar Tipo' onclick=\"f_addTCadastro('EDT','" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"></i>";

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codigo: dataset.values[i]["codigo"],
                    tipo: dataset.values[i]["descricao"],
                    situacao: wSituacao,
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTable.reload(regs);
        }
    }

    if (pCodTable == 'PA') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PA', 'PA', ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Editar Parâmetro' onclick=\"f_addParametros('EDT','" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "','" + dataset.values[i]["codigotipo"] + "','" + dataset.values[i]["tipocadastro"] + "','" + dataset.values[i]["codtipodados"] + "','" + dataset.values[i]["valorpadrao"] + "');\"></i>";
                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                // rContent = ['codigo', 'tipocadastro', 'descricao', 'tipodados', 'valorpadrao', 'situacao', 'ts'];

                var datatableRow = {
                    codigo: dataset.values[i]["codigo"],
                    tipocadastro: dataset.values[i]["tipocadastro"],
                    descricao: dataset.values[i]["descricao"],
                    tipodados: dataset.values[i]["tipodados"],
                    valorpadrao: dataset.values[i]["valorpadrao"],
                    situacao: wSituacao,
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTable.reload(regs);
        }
    }    

    if (pCodTable == 'CA') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'CA', 'CA', ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                strIcone += "<i class='flaticon flaticon-settings icon-md corVerde' title='Parâmetros' onclick=\"f_addCategoriaItem('INS','" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"></i>&nbsp;";
                // strIcone += "<i class='fluigicon fluigicon-remove icon-md corVermelha' title='Remover Parâmetro' onclick=\"alert('oi');\"></i>";
                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codigo: dataset.values[i]["codigo"],
                    descricao: dataset.values[i]["descricao"],
                    situacao: wSituacao,
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTable.reload(regs);
        }
    } 
    
    if (pCodTable == 'CATITEM') {


        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'CAITEM', 'CAITEM', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codcategoria', pFiltro, pFiltro, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Editar Parâmetro' onclick=\"f_edtCategoriaItem('EDT','" + dataset.values[i]["codparametros"] + "', '" + dataset.values[i]["parametro"] + "', '" + dataset.values[i]["tipodados"] + "', '" + dataset.values[i]["valor"] + "');\"></i>";
                strIcone += "&nbsp;<i class='fluigicon fluigicon-minus-circle icon-sm corVermelha' title='Remover Parâmetro' onclick=\"f_removerRgistro('05', '" + dataset.values[i]["codcategoria"] + "', '" + dataset.values[i]["codparametros"] + "')\"></i>";

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codcategoria: dataset.values[i]["codcategoria"],
                    codparametro: dataset.values[i]["codparametros"],
                    parametro: dataset.values[i]["parametro"],
                    tipodados: dataset.values[i]["tipodados"],
                    valor: dataset.values[i]["valor"],
                    ts: strIcone                    
                }

                regs.push(datatableRow);

            }
            dataTableItem.reload(regs);
        }
    }     
    
    if (pCodTable == 'NI') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'NI', 'NI', ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''                
                strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Editar Nível' onclick=\"f_addNivel('EDT','" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"></i>";

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codigo: dataset.values[i]["codigo"],
                    descricao: dataset.values[i]["descricao"],
                    situacao: wSituacao,
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTable.reload(regs);
        }
    }    

    if (pCodTable == 'PE') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PE', 'PE', ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                strIcone += "<i class='flaticon flaticon-settings icon-md corVerde' title='Categorias' onclick=\"f_addPerfilCategoria('" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"></i>&nbsp;";
                strIcone += "<i class='fluigicon fluigicon-user-selection icon-md corAzul' title='Perfil' onclick=\"f_addPerfilNivelCategoria('" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"></i>";

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codigo: dataset.values[i]["codigo"],
                    descricao: dataset.values[i]["descricao"],
                    situacao: wSituacao,
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTable.reload(regs);
        }
    }

    if (pCodTable == 'US') {
        loadWindow.show();
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'US', 'US', ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wSituacao = ''
                        strIcone += "<i class='flaticon flaticon-settings icon-md corVerde' title='Parâmetros das Categorias' onclick=\"f_addPerfilCategoria('" + data.values[i]["codigo"] + "','" + data.values[i]["descricao"] + "');\"></i>&nbsp;";
                        strIcone += "<i class='fluigicon fluigicon-user-selection icon-md corAzul' title='Parametros do Perfil' onclick=\"f_addPerfilNivelCategoria('" + data.values[i]["codigo"] + "','" + data.values[i]["descricao"] + "');\"></i>";

                        switch (data.values[i]["situacao"]) {
                            case "A":
                                wSituacao = 'Ativo'
                                break;
                            case "I":
                                wSituacao = 'Inativo'
                                break;
                        }
                        // rContent = ['codigo', 'nome', 'codperfil', 'perfil', 'codnivel', 'nivel', 'ts'];
                        var datatableRow = {
                            codigo: data.values[i]["codigo"],
                            nome: data.values[i]["nome"],
                            codperfil: data.values[i]["codperfil"],
                            perfil: data.values[i]["nomeperfil"],
                            codnivel: data.values[i]["codnivel"],
                            nivel: data.values[i]["nomenivel"],
                            situacao: wSituacao,
                            ts: strIcone
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

    
    if (pCodTable == 'PECATDISP') {

        var wCodPerfil = $('#md_codigo_perfil_' + $this.instanceId).val();
        var wCodCategoria = $('#cod_categoria_' + $this.instanceId).val();
        var wIndTabela = $('#indTabela_' + $this.instanceId).val();
        var wCodNivel = $('#cod_nivel_' + $this.instanceId).val();

        if (wCodCategoria == '' || (wCodNivel == '' && wCodNivel != undefined) ) {
            // FLUIGC.toast({
            //     message: 'Deve ser selecionado uma Categoria e ou Nível.',
            //     type: 'danger'
            // });
            loadWindow.hide();
            return false;
        }         

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PECATDISP', 'PECATDISP', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codperfil', wCodPerfil, wCodPerfil, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codnivel', wCodNivel, wCodNivel, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codcategoria', wCodCategoria, wCodCategoria, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('indtabela', wIndTabela, wIndTabela, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);



        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = ''
                // strIcone += "<button type='button' class='btn btn-info' title='Parâmetros' onclick=\"f_addCategoriaItem('" + dataset.values[i]["codigo"] + "','" + dataset.values[i]["descricao"] + "');\"><i class='flaticon flaticon-settings-applications icon-xs'></i></button>";dataset.values[i]["parametro"]
                strIcone += "<i class='flaticon flaticon-arrow-right icon-md corVerde' title='Incluir Parâmetro' onclick=\"f_editParametro('INS','" + wCodPerfil + "', '" + wCodNivel + "','" + dataset.values[i]["codcategoria"] + "', '" + dataset.values[i]["codparametros"] + "','" + dataset.values[i]["parametro"] + "','" + dataset.values[i]["tipodados"] + "')\"></i>";
                

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                // rContent = ['codcategoria', 'codparametro', 'parametro', 'tipodados', 'ts'];

                var datatableRow = {
                    codcategoria: dataset.values[i]["codcategoria"],
                    codparametro: dataset.values[i]["codparametros"],
                    parametro: dataset.values[i]["parametro"],
                    tipodados: dataset.values[i]["tipodados"],
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTablePerfilDisp.reload(regs);
        }
    } 

    if (pCodTable == 'PECATSET') {

        var wCodPerfil = $('#md_codigo_perfil_' + $this.instanceId).val();
        var wCodNivel = $('#cod_nivel_' + $this.instanceId).val();
        var wIndTabela = $('#indTabela_' + $this.instanceId).val();
        var wCodTabela = '';

        // alert('Perfil: ' + wCodPerfil);
        // alert('Nível: ' + wCodNivel);
        // alert('Tabela: ' + wIndTabela);  

        if (wIndTabela == 'perfilcategoria') { wCodTabela = '06'; }
        if (wIndTabela == 'perfilnivelcategoria') { wCodTabela = '07'; }



        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PECATSET', 'PECATSET', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codperfil', wCodPerfil, wCodPerfil, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codnivel', wCodNivel, wCodNivel, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('indtabela', wIndTabela, wIndTabela, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        if (dataset.rowsCount == 0) {
            throw "Registro não encontrados";
        } else {
            var regs = new Array();
            for (var i = 0; i < dataset.values.length; i++) {

                var strIcone = '';
                var wSituacao = '';
                
                strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Editar Parâmetro' onclick=\"f_editParametro('EDT','" + wCodPerfil + "','" + wCodNivel + "','" + dataset.values[i]["codcategoria"] + "','" + dataset.values[i]["codparametros"] + "', '" + dataset.values[i]["parametro"] + "', '" + dataset.values[i]["tipodados"] + "','" + dataset.values[i]["valor"] + "');\"></i>";
                strIcone += "&nbsp;<i class='fluigicon fluigicon-minus-circle icon-sm corVermelha' title='Remover Parâmetro' onclick=\"f_removerRgistro('" + wCodTabela + "','" + wCodPerfil + "','" + wCodNivel + "','" + dataset.values[i]["codcategoria"] + "','" + dataset.values[i]["codparametros"] + "')\"></i>";

                switch (dataset.values[i]["situacao"]) {
                    case "A":
                        wSituacao = 'Ativo'
                        break;
                    case "I":
                        wSituacao = 'Inativo'
                        break;
                }

                var datatableRow = {
                    codcategoria: dataset.values[i]["codcategoria"],
                    codparametro: dataset.values[i]["codparametros"],
                    parametro: dataset.values[i]["parametro"],
                    tipodados: dataset.values[i]["tipodados"],
                    valor: dataset.values[i]["valor"],
                    ts: strIcone
                }

                regs.push(datatableRow);

            }
            dataTablePerfilSet.reload(regs);
        }
    }     


    loadWindow.hide();
}


