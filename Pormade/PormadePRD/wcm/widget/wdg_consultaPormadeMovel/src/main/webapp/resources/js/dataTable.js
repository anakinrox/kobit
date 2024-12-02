var dataTable = null;
var dadosDatatable = [];

var dataTableVisitas = null;
var dadosDatatableVisitas = [];

var dataTableParceiros = null;
var dadosDatatableParceiros = [];
var rContent = [];
var rHeader = [];
var markers = [];
var circulos = [];
var map;


function loadDataTable(pCodTable) {

    if (pCodTable == 'rotas') {
        rContent = ['proposta', 'instalador', 'data', 'observacao', 'ts'];

        rHeader = [
            { 'title': 'Proposta', 'dataorder': 'proposta', 'width': '5%', 'display': true },
            { 'title': 'Instalador', 'dataorder': 'instalador', 'width': '5%' },
            { 'title': 'Data', 'dataorder': 'data', 'width': '10%' },
            { 'title': 'Observação', 'dataorder': 'observacao', 'width': '15%' },
            { 'title': '', 'width': '0%' }

        ];

        dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
            dataRequest: dadosDatatable,
            renderContent: rContent,
            scrollY: "200px",
            scrollCollapse: true,
            paging: true,
            limit: 30,
            offset: 0,
            patternKey: 'text',
            limitkey: 'per_page',
            offsetKey: 'page',
            // responsive: true,
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

    if (pCodTable == 'visitas') {
        rContent = ['documentid', 'codigoVisita', 'cidade', 'local', 'data', 'latitude', 'longitude', 'ts'];

        rHeader = [
            { 'title': 'documentid', 'dataorder': 'documentid', 'width': '5%', 'display': false },
            { 'title': 'cod Visita', 'dataorder': 'codigoVisita', 'width': '5%', 'display': false },
            { 'title': 'Cidade', 'dataorder': 'cidade', 'width': '5%' },
            { 'title': 'Local', 'dataorder': 'local', 'width': '30%' },
            { 'title': 'Data', 'dataorder': 'data', 'width': '10%', 'display': false },
            { 'title': 'Lat.', 'dataorder': 'latitude', 'width': '10%', 'display': false },
            { 'title': 'Long.', 'dataorder': 'longitude', 'width': '15%', 'display': false },
            { 'title': '', 'width': '0%' },

        ];

        dataTableVisitas = FLUIGC.datatable('#idtableVisitas_' + $this.instanceId, {
            dataRequest: dadosDatatableVisitas,
            renderContent: rContent,
            limit: 30,
            offset: 0,
            patternKey: 'text',
            limitkey: 'per_page',
            offsetKey: 'page',
            responsive: false,
            tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
            emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
            header: rHeader,
            scrollY: "200px",
            scrollCollapse: true,
            paging: true,
            search: {
                enabled: false,
                onSearch: function (res) {
                    // console.log( res );
                    var data = dadosDatatableVisitas;
                    var search = data.filter(function (el) {
                        return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                    });
                    dataTableVisitas.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtableVisitas_' + $this.instanceId,
                enabled: true
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

    if (pCodTable == 'parceiros') {
        rContent = ['cidadeuf', 'local', 'nome', 'telefone', 'latitude', 'longitude', 'ts'];

        rHeader = [
            { 'title': 'Cidade/UF', 'dataorder': 'cidadeuf', 'width': '5%' },
            { 'title': 'Local', 'dataorder': 'local', 'width': '30%' },
            { 'title': 'Nome', 'dataorder': 'nome', 'width': '10%' },
            { 'title': 'Telefone', 'dataorder': 'telefone', 'width': '10%', 'display': true },
            { 'title': 'lat', 'dataorder': 'latitude', 'width': '15%', 'display': false },
            { 'title': 'long', 'dataorder': 'longitude', 'width': '5%', 'display': false },
            { 'title': '', 'width': '0%' },

        ];

        dataTableParceiros = FLUIGC.datatable('#idtableParceiro_' + $this.instanceId, {
            dataRequest: dadosDatatableParceiros,
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
                    dataTableParceiros.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: '#idtableParceiro_' + $this.instanceId,
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

    if (pCodTable == 'rotas') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'rotas', 'rotas', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('placa', $('#cod_veiculo_' + $this.instanceId).val(), $('#cod_veiculo_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datainicio', $('#dt_ini_' + $this.instanceId).val(), $('#dt_ini_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datafim', $('#dt_fim_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
        var rotas = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        // constraints.push(DatasetFactory.createConstraint('indacao', 'ADDUSER', 'ADDUSER', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('fname', 'Eduardo', 'Eduardo', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('lname', 'Teixeira', 'Teixeira', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('email', 'eduardo13062011@gmail.com', 'eduardo13062011@gmail.com', ConstraintType.MUST));

        // constraints.push(DatasetFactory.createConstraint('indacao', 'FINDCOURSE', 'FINDCOURSE', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('idUser', '3207', '3207', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('idCurso', '30', '30', ConstraintType.MUST));
        // var rotas = DatasetFactory.getDataset("dsk_moodle", null, constraints, null);

        if (rotas.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            // alert(JSON.stringify(rotas.values));
            return false;
            var regs = new Array();
            for (var i = 0; i < rotas.values.length; i++) {

                if (rotas.values[i]["documentID"] != undefined) {
                    var strIcone = "";
                    strIcone += "<button type='button' class='btn btn-info' title='Visualisar Visitas' data-load-visitas><i class='flaticon flaticon-group-person icon-sm'></i></button>";
                    strIcone += "<button type='button' class='btn btn-danger' title='Visitas no Mapa' data-load-visitasMap><i class='flaticon flaticon-pin-map icon-sm'></i></button>";

                    var datatableRow = {
                        documentid: parseInt(rotas.values[i]["documentID"], 10),
                        veiculo: rotas.values[i]["veiculo"],
                        numPlaca: rotas.values[i]["placa"],
                        nomMotorista: rotas.values[i]["motorista"],
                        nomAjudante: rotas.values[i]["ajudante"],
                        dataInicio: rotas.values[i]["datInicio"],
                        dataFim: rotas.values[i]["datFim"],
                        nomTitulo: rotas.values[i]["titulo"],
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }

            dataTable.reload(regs);
        }
    }

    if (pCodTable == 'visitas') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'visitas', 'visitas', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('documentid', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('coords', "", "", ConstraintType.MUST));
        var visitas = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (visitas.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < visitas.values.length; i++) {
                if (visitas.values[i]["idCidade"] != undefined) {
                    var strIcone = "";

                    strIcone += "<button type='button' class='btn btn-info' title='Visualisar Parceiros' data-load-parceiros><i class='flaticon flaticon-group-person icon-sm'></i></button>";
                    strIcone += "<button type='button' class='btn btn-danger' title='Parceiros no Mapa' data-load-parceirosMap><i class='flaticon flaticon-pin-map icon-sm'></i></button>";
                    var datatableRow = {
                        documentid: pFiltro,
                        codigoVisita: visitas.values[i]["idCidade"],
                        cidade: visitas.values[i]["cidade"],
                        local: visitas.values[i]["local"],
                        data: '',
                        latitude: visitas.values[i]["latitude"],
                        longitude: visitas.values[i]["longitude"],
                        ts: strIcone
                    }
                    // data: visitas.values[i]["data"],
                    regs.push(datatableRow);
                }
            }
            dataTableVisitas.reload(regs);
        }
    }

    if (pCodTable == 'visitasMap') {

        if (markers.length > 0) {
            info_Window = new google.maps.InfoWindow();
            info_Window.close();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
        }
        var objMapa = document.getElementById("idmapVisitas_" + $this.instanceId);
        objMapa.style.display = "";

        map = new google.maps.Map(objMapa, {
            center: new google.maps.LatLng(-14.235, -51.9253),
            zoom: 3,
            mapTypeId: 'roadmap'
        });

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'visitas', 'visitas', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('documentid', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('coords', "S", "S", ConstraintType.MUST));
        var visitas = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (visitas.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < visitas.values.length; i++) {
                if (visitas.values[i]["idCidade"] != undefined) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(parseFloat(visitas.values[i]["latitude"]), parseFloat(visitas.values[i]["longitude"])),
                        title: visitas.values[i]["local"]
                    });

                    var html = '<div class="test">' + visitas.values[i]["local"] + '</div> ';
                    info_Window = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, "click", function () {
                        info_Window.setContent(html);
                        info_Window.open(map, marker);
                    });

                    markers.push(marker);
                }
            }
        }
    }


    if (pCodTable == 'parceiros') {
        var constraints = new Array();

        // alert('Filtro1: ' + pFiltro);
        // alert('Filtro2: ' + pFiltro2);
        constraints.push(DatasetFactory.createConstraint('endpoint', 'parceiros', 'parceiros', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('documentid', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('local', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('coords', "", "", ConstraintType.MUST));
        var parceiros = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (parceiros.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < parceiros.values.length; i++) {
                if (parceiros.values[i]["cidade"] != undefined) {
                    var strIcone = "";

                    // strIcone += "<button type='button' class='btn btn-info' title='Log da Viagem' data-load-logviagem><i class='fluigicon fluigicon-school-note icon-xs'></i></button>";
                    //   rContent = ['cidadeuf', 'local', 'nome', 'telefone', 'latitude', 'longitude', 'ts'];
                    var datatableRow = {
                        cidadeuf: parceiros.values[i]["cidade"],
                        local: parceiros.values[i]["local"],
                        nome: parceiros.values[i]["nome"],
                        telefone: parceiros.values[i]["telefone"],
                        latitude: parceiros.values[i]["latitude"],
                        longitude: parceiros.values[i]["longitude"],
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }

            dataTableParceiros.reload(regs);
        }
    }

    if (pCodTable == 'ParceirosMap') {

        if (markers.length > 0) {
            info_Window = new google.maps.InfoWindow();
            info_Window.close();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
        }
        var objMapa = document.getElementById("idmapParceiros_" + $this.instanceId);
        objMapa.style.display = "";

        map = new google.maps.Map(objMapa, {
            center: new google.maps.LatLng(-14.235, -51.9253),
            zoom: 3,
            mapTypeId: 'roadmap'
        });

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'parceiros', 'parceiros', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('documentid', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('local', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('coords', "S", "S", ConstraintType.MUST));
        var parceiros = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if (parceiros.rowsCount == 0) {
            throw "Não cadastrato parametro para esse tipo de integração.";
        } else {
            var regs = new Array();
            for (var i = 0; i < parceiros.values.length; i++) {
                if (parceiros.values[i]["cidade"] != undefined) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(parseFloat(parceiros.values[i]["latitude"]), parseFloat(parceiros.values[i]["longitude"])),
                        title: parceiros.values[i]["nome"]
                    });

                    var html = '<div class="test">' + parceiros.values[i]["local"] + '</div> ';
                    info_Window = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, "click", function () {
                        info_Window.setContent(html);
                        info_Window.open(map, marker);
                    });

                    markers.push(marker);
                }
            }
        }
    }


    loadWindow.hide();

}
