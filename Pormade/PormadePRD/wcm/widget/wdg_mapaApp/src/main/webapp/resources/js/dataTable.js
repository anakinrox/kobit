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
var features = [];

var map
var iconBase = "/wdg_mapaApp/resources/images/";
var icons = {
    parking: {
        name: "Movel",
        icon: iconBase + "iconCaminhao3.png",
    },
    library: {
        name: "Condominio",
        icon: iconBase + "iconecasa2.png",
    },
    info: {
        name: "Carretinha",
        icon: iconBase + "iconecaretinha.png",
    },
};


function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function hideMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
}

function loadDataTable(pCodTable) {

    if (pCodTable == 'rotas') {
        rContent = ['documentid', 'veiculo', 'numPlaca', 'nomMotorista', 'nomAjudante', 'dataInicio', 'dataFim', 'nomTitulo', 'ts'];

        rHeader = [
            { 'title': 'documentid', 'dataorder': 'documentid', 'width': '5%', 'display': true },
            { 'title': 'Veículo', 'dataorder': 'veiculo', 'width': '5%' },
            { 'title': 'Placa', 'dataorder': 'numPlaca', 'width': '5%' },
            { 'title': 'Motorista', 'dataorder': 'nomMotorista', 'width': '30%' },
            { 'title': 'Especificador', 'dataorder': 'nomAjudante', 'width': '30%' },
            { 'title': 'Data Início', 'dataorder': 'dataInicio', 'width': '10%' },
            { 'title': 'Data Fim', 'dataorder': 'dataFim', 'width': '10%' },
            { 'title': 'Título', 'dataorder': 'nomTitulo', 'width': '15%' },
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

function loadDadosDataTable(pCodTable, pIndBusca, pFiltro, pFiltro2, pFiltro3) {
    loadWindow.show();

    if (pCodTable == 'loadMapa') {
        var objMapa = document.getElementById("idmapVisitas_" + $this.instanceId);
        objMapa.style.display = "";

        map = new google.maps.Map(objMapa, {
            center: new google.maps.LatLng(-14.235, -51.9253),
            zoom: 4,
            mapTypeId: 'hybrid'
        });

        // if (pIndBusca == undefined || pIndBusca == '') {
        // const legend = document.getElementById("legend_" + $this.instanceId);
        const legend = document.getElementById("legend");

        for (const key in icons) {
            const type = icons[key];
            const name = type.name;
            const icon = type.icon;
            const div = document.createElement("div_" + $this.instanceId);

            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }

        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
        // }
    }


    if (pCodTable == 'mapaLead') {
        var wShowResult = [];
        if ($("#chk_movel").is(':checked')) {
            wShowResult.push(true);

            if (($('#dt_ini_' + $this.instanceId).val() == "") || ($('#dt_fim_' + $this.instanceId).val() == "")) {
                FLUIGC.toast({
                    message: 'Deve ser informado um período para busca',
                    type: 'danger'
                });

                loadWindow.hide();
                return false;
            }

        } else { wShowResult.push(false); }
        if ($("#chk_condominio").is(':checked')) { wShowResult.push(true); } else { wShowResult.push(false); }
        if ($("#chk_carretinha").is(':checked')) { wShowResult.push(true); } else { wShowResult.push(false); }


        if (markers.length > 0) {

            deleteMarkers();
            // markers = [];
            // features = [];

            // if (wShowResult[0] == false || wShowResult[1] == false || wShowResult[2] == false) { loadDadosDataTable('loadMapa', 'Reload'); }
            // loadDadosDataTable('loadMapa', 'Reload');

            // info_Window = new google.maps.InfoWindow();
            // info_Window.close();

            // markers.length = 0;
            // features.length = 0;
        }

        if (pIndBusca == '0') {
            loadWindow.hide();
            return false;
        }


        var wCodMotorista = $('#cod_motorista_' + $this.instanceId).val() != undefined ? $('#cod_motorista_' + $this.instanceId).val() : null;



        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('endpoint', 'mapa', 'mapa', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('indMapa', pIndBusca, pIndBusca, ConstraintType.MUST));

        constraints.push(DatasetFactory.createConstraint('placa', $('#cod_veiculo_' + $this.instanceId).val(), $('#cod_veiculo_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datainicio', $('#dt_ini_' + $this.instanceId).val(), $('#dt_ini_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('datafim', $('#dt_fim_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('motorista', $('#cod_motorista_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', $('#cod_UF_' + $this.instanceId).val(), $('#cod_UF_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', $('#cod_cidade_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('wresult', JSON.stringify(wShowResult), JSON.stringify(wShowResult), ConstraintType.MUST));
        var lead = DatasetFactory.getDataset("dsk_tracking", null, constraints, null);

        if ((lead != null)) {

            for (var i = 0; i < lead.values.length; i++) {

                var image = '';
                switch (lead.values[i]["indRegistro"]) {
                    case "PM":
                        image = iconBase + 'iconCaminhao3.png';
                        break;
                    case "CD":
                        image = iconBase + 'iconecasa2.png';
                        break;
                    case "CT":
                        image = iconBase + 'iconecaretinha.png';
                        break;
                }


                // if (pIndBusca == 'C') {
                var html = '';
                switch (lead.values[i]["indRegistro"]) {
                    case "PM":
                        html = '<div class="test">Local: ' + lead.values[i]["local"] + "<br>";
                        html += '<br>Dia:' + lead.values[i]["data"].split('-').reverse().join('/') + (lead.values[i]["hora"] != "" && lead.values[i]["hora"] != 'null' ? ' Hora: ' + lead.values[i]["hora"] + "<br>" : "<br>");
                        html += 'Cidade: ' + lead.values[i]["cidade"] + "<br>";
                        html += 'UF: ' + lead.values[i]["uf"] + "<br>";
                        html += 'Motorista: ' + lead.values[i]["motorista"] + "<br>";
                        html += (lead.values[i]["parceiro"] != "" && lead.values[i]["parceiro"] != 'null' ? 'Contato: ' + lead.values[i]["parceiro"] : "") + "<br>";
                        html += '</div> ';
                        break;
                    case "CD":
                        html = '<div class="test">Condomínio: ' + lead.values[i]["local"] + "<br>";
                        html += 'Cidade: ' + lead.values[i]["cidade"] + "<br>";
                        html += 'UF: ' + lead.values[i]["uf"] + "<br>";
                        html += 'Unidades: ' + lead.values[i]["unidades"] + "<br>";
                        html += 'Concluídas: ' + lead.values[i]["concluidas"] + "<br>";
                        html += 'Em construcao: ' + lead.values[i]["construcao"] + "<br>";
                        html += '</div> ';
                        break;
                    case "CT":
                        html = '<div class="test">Motorista: ' + lead.values[i]["motorista"] + "<br>";
                        html += 'Placa: ' + lead.values[i]["placa"] + "<br>";
                        html += 'Ligado: ' + lead.values[i]["local"] + "<br>";
                        html += 'Velocidade: ' + lead.values[i]["parceiro"] + "<br>";
                        html += '</div> ';
                        break;

                }

                const infowindow = new google.maps.InfoWindow({
                    content: html,
                    ariaLabel: "Visita",
                });

                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(lead.values[i]["latitude"]), parseFloat(lead.values[i]["longitude"])),
                    map,
                    title: lead.values[i]["local"],
                    icon: image
                });

                marker.addListener("click", () => {
                    infowindow.open({
                        anchor: marker,
                        map,
                    });
                });

                // }

                markers.push(marker);
            }
        }
    }


    loadWindow.hide();

}
