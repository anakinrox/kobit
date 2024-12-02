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

    if (pCodTable == 'manifesto') {
        rContent = ['num_manifesto', 'nom_motorista', 'data_liberacao', 'data_viagem', 'veiculo', 'num_placa', 'num_entregue', 'num_total', 'den_status', 'ts'];

        rHeader = [
            { 'title': 'Manifesto', 'dataorder': 'num_manifesto', 'width': '5%' },
            { 'title': 'Motorista', 'dataorder': 'nom_motorista', 'width': '30%' },
            { 'title': 'Data Liberação', 'dataorder': 'data_liberacao', 'width': '10%' },
            { 'title': 'Data Viagem', 'dataorder': 'data_viagem', 'width': '10%' },
            { 'title': 'Veiculo', 'dataorder': 'veiculo', 'width': '15%' },
            { 'title': 'Placa', 'dataorder': 'num_placa', 'width': '5%' },
            { 'title': 'Entregue', 'dataorder': 'num_entregue', 'width': '5%' },
            { 'title': 'Total', 'dataorder': 'num_total', 'width': '5%' },
            { 'title': 'Status', 'dataorder': 'den_status', 'width': '5%' },
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

    if (pCodTable == 'entregas') {
        rContent = ['numEntrega', 'numNota', 'numPedido', 'nomCliente', 'cidade', 'uf', 'den_status', 'ts'];

        rHeader = [
            { 'title': 'Entrega', 'dataorder': 'numEntrega', 'width': '5%', 'display': false },
            { 'title': 'Nota', 'dataorder': 'numNota', 'width': '5%' },
            { 'title': 'Pedido', 'dataorder': 'numPedido', 'width': '30%' },
            { 'title': 'Cliente', 'dataorder': 'nomCliente', 'width': '10%' },
            { 'title': 'Cidade', 'dataorder': 'cidade', 'width': '10%' },
            { 'title': 'UF', 'dataorder': 'uf', 'width': '15%' },
            { 'title': 'Status', 'dataorder': 'den_status', 'width': '5%' },
            { 'title': '', 'width': '0%' },

        ];

        dataTableEntrega = FLUIGC.datatable('#idtableEntregas_' + $this.instanceId, {
            dataRequest: dadosDatatableEntrega,
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
                    var data = dadosDatatableEntrega;
                    var search = data.filter(function (el) {
                        return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTableEntrega.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtableEntregas_' + $this.instanceId,
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

    if (pCodTable == 'logviagem') {
        rContent = ['datRegistro', 'horRegistro', 'indRegistro', 'codParada', 'descricao', 'latitude', 'longitude', 'ts'];

        rHeader = [
            { 'title': 'Data', 'dataorder': 'datRegistro', 'width': '5%' },
            { 'title': 'Hora', 'dataorder': 'horRegistro', 'width': '30%' },
            { 'title': 'Tipo', 'dataorder': 'indRegistro', 'width': '10%' },
            { 'title': 'Cod. Parada', 'dataorder': 'codParada', 'width': '10%', 'display': false },
            { 'title': 'Parada', 'dataorder': 'descricao', 'width': '10%' },
            { 'title': 'lat', 'dataorder': 'latitude', 'width': '15%', 'display': false },
            { 'title': 'long', 'dataorder': 'longitude', 'width': '5%', 'display': false },
            { 'title': '', 'width': '0%' },

        ];

        dataTableViagem = FLUIGC.datatable('#idtableLogViagem_' + $this.instanceId, {
            dataRequest: dadosDatatableViagem,
            renderContent: rContent,
            limit: 2,
            responsive: true,
            tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
            emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
            header: rHeader,
            search: {
                enabled: false,
                onSearch: function (res) {
                    // console.log( res );
                    var data = dadosDatatableViagem;
                    var search = data.filter(function (el) {
                        return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTableViagem.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtableLogViagem_' + $this.instanceId,
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

    if (pCodTable == 'manifesto') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'manifesto', 'manifesto', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numpedido', $('#num_pedido_' + $this.instanceId).val(), $('#num_pedido_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numnota', $('#num_nota_' + $this.instanceId).val(), $('#num_nota_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('motorista', $('#cod_motorista_' + $this.instanceId).val(), $('#cod_motorista_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datini', $('#dt_ini_' + $this.instanceId).val(), $('#dt_ini_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datfim', $('#dt_fim_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
        var manifesto = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (manifesto.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {

            var regs = new Array();
            for (var i = 0; i < manifesto.values.length; i++) {
                if (manifesto.values[i]["manifesto"] != undefined) {
                    var strIcone = "";

                    if (manifesto.values[i]["situacao"] != "Cancelado") {
                        strIcone += "<button type='button' class='btn btn-info' title='Visualisar entregas' data-load-entregas><i class='fluigicon fluigicon-search-test icon-xs'></i></button>";
                    }
                    if (manifesto.values[i]["situacao"] == "Pendente") {
                        strIcone += "<button type='button' title='Liberar Manifesto' class='btn btn-success'><i class='fluigicon fluigicon-verified icon-xs'></i></button>";
                        strIcone += "<button type='button' title='Cancelar Manifesto' class='btn btn-danger'><i class='fluigicon fluigicon-remove icon-xs'></i></button>";
                    }

                    if (manifesto.values[i]["checklist"] == "S") {
                        strIcone += "<button type='button' class='btn btn-primary' title='Check list' data-load-checklist><i class='fluigicon fluigicon-checked icon-xs'></i></button>";
                    }

                    var datatableRow = {
                        num_manifesto: parseInt(manifesto.values[i]["manifesto"], 10),
                        nom_motorista: manifesto.values[i]["motorista"],
                        data_liberacao: manifesto.values[i]["dat_liberacao"],
                        data_viagem: manifesto.values[i]["dat_viagem"],
                        veiculo: manifesto.values[i]["veiculo"],
                        num_placa: manifesto.values[i]["placa"],
                        num_entregue: manifesto.values[i]["entrege"],
                        num_total: manifesto.values[i]["total"],
                        den_status: manifesto.values[i]["situacao"],
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }

            dataTable.reload(regs);
        }
    }

    if (pCodTable == 'entregas') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'entregas', 'entregas', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('nummanifesto', pFiltro, pFiltro, ConstraintType.MUST));
        var entregas = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (entregas.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < entregas.values.length; i++) {
                if (entregas.values[i]["nota"] != undefined) {
                    var strIcone = "";

                    strIcone += "<button type='button' class='btn btn-info' title='Log da Viagem' data-load-logviagem><i class='fluigicon fluigicon-school-note icon-xs'></i></button>";

                    var datatableRow = {
                        numEntrega: parseInt(entregas.values[i]["numEntrega"], 10),
                        numNota: parseInt(entregas.values[i]["nota"], 10),
                        numPedido: parseInt(entregas.values[i]["pedido"], 10),
                        nomCliente: entregas.values[i]["nomCliente"],
                        cidade: entregas.values[i]["cidade"],
                        uf: entregas.values[i]["uf"],
                        den_status: entregas.values[i]["situacao"],
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }

            dataTableEntrega.reload(regs);
        }
    }

    if (pCodTable == 'checklist') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'checklist', 'entregas', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('nummanifesto', pFiltro, pFiltro, ConstraintType.MUST));
        var checkList = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (checkList.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < checkList.values.length; i++) {
                if (checkList.values[i]["datRegistro"] != undefined) {

                    var datatableRow = {
                        datRegistro: checkList.values[i]["datRegistro"],
                        horRegistro: checkList.values[i]["horRegistro"],
                        indFreios: checkList.values[i]["indFreio"],
                        indPneus: checkList.values[i]["indPneu"],
                        indMotorista: checkList.values[i]["indMotorista"],
                        obsMotorista: checkList.values[i]["obsMotorista"],
                        latitudade: checkList.values[i]["latitude"],
                        longitude: checkList.values[i]["longitude"]
                    }

                    regs.push(datatableRow);
                }
            }
            loadWindow.hide();
            return regs;
        }
    }

    if (pCodTable == 'logviagem') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'logviagem', 'logviagem', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('nummanifesto', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numentrega', pFiltro2, pFiltro2, ConstraintType.MUST));
        var viagem = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);
        if (viagem.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < viagem.values.length; i++) {
                if (viagem.values[i]["datRegistro"] != undefined) {
                    var strIcone = "";

                    if (viagem.values[i]["latitude"] != '') {
                        strIcone += "<button type='button' class='btn btn-danger' title='Localização' data-load-mapaLog><i class='fluigicon fluigicon-map-marker icon-xs'></i></button>";
                    }

                    if (viagem.values[i]["indFoto"] == 'S') {
                        strIcone += "<button type='button' class='btn btn-info' title='Fotos' data-load-fotoLog><i class='fluigicon fluigicon-camera icon-xs'></i></button>";
                    }


                    var datatableRow = {
                        datRegistro: viagem.values[i]["datRegistro"],
                        horRegistro: viagem.values[i]["horRegistro"],
                        indRegistro: viagem.values[i]["indRegistro"],
                        codParada: viagem.values[i]["codParada"],
                        descricao: viagem.values[i]["descParada"],
                        latitude: viagem.values[i]["latitude"],
                        longitude: viagem.values[i]["longitude"],
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }

            dataTableViagem.reload(regs);
        }
    }

    if (pCodTable == 'logfotos') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'logfoto', 'logfoto', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('nummanifesto', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('numentrega', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codregistro', pFiltro3, pFiltro3, ConstraintType.MUST));
        var fotos = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (fotos.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < fotos.values.length; i++) {
                if (fotos.values[i]["nomFoto"] != undefined) {

                    // foto64: fotos.values[i]["foto"],
                    var datatableRow = {
                        foto64: fotos.values[i]["foto"],
                        nomFoto: fotos.values[i]["nomFoto"],
                        latitude: fotos.values[i]["latitude"],
                        longitude: fotos.values[i]["longitude"]
                    }
                    regs.push(datatableRow);
                }
            }

            loadWindow.hide();
            return regs;
        }
    }


    loadWindow.hide();

}
