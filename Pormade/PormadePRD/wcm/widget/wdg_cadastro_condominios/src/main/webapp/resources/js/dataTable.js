var dataTable = null;
var dataTableItem = null;
var dataTableServico = null;
var dataTableServicoFoto = null;
var dataTableItemProposta = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];


var markers = [];
var circulos = [];
var features = [];

var map;
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

function formataTable(id) {
    var formats = {};
    $("#" + id + " thead").find("tr").each(function (el, ev) {
        $($(this).children()).each(function (el, ev) {
            formats[this.cellIndex] = this.className.replace('order-by', '');
        });
    });

    $("#" + id + " tbody").find("tr").each(function (el, ev) {
        $($(this).children()).each(function (el, ev) {
            this.className = formats[this.cellIndex];
        });
    });
}

function loadDataTable(pCodTable) {

    if (pCodTable == 'CONDOMINIO') {
        rContent = ['codigo', 'uf', 'cidade', 'condominio', 'unidade', 'concluidas', 'emconstrucao', 'saldo', 'ts'];

        rHeader = [
            { 'title': 'codigo', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': false },
            { 'title': 'UF', 'dataorder': 'uf', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Cidade', 'dataorder': 'cidade', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Condominio', 'dataorder': 'condominio', 'size': 'col-md-4', 'display': true },
            { 'title': 'Unidades', 'dataorder': 'unidade', 'size': 'col-md-1', 'display': true },
            { 'title': 'Concluídas', 'dataorder': 'concluidas', 'size': 'col-md-1', 'display': true },
            { 'title': 'Em Construção', 'dataorder': 'emconstrucao', 'size': 'col-md-1', 'display': true },
            { 'title': 'Saldo', 'dataorder': 'saldo', 'size': 'col-md-1', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

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

    if (pCodTable == 'ENGENHEIROS') {
        rContent = ['codigo', 'nome', 'telefone', 'registro', 'obras', 'ts'];

        rHeader = [
            { 'title': 'codigo', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': false },
            { 'title': 'Nome', 'dataorder': 'nome', 'size': 'col-sm-4', 'display': true },
            { 'title': 'Telefone', 'dataorder': 'telefone', 'size': 'col-sm-3', 'display': true },
            { 'title': 'Registro', 'dataorder': 'registro', 'size': 'col-md-2', 'display': true },
            { 'title': 'Obras', 'dataorder': 'obras', 'size': 'col-md-1', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];

        dataTableItem = FLUIGC.datatable('#idTBLItem_' + $this.instanceId, {
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

    if (pCodTable == 'loadMapa') {
        var objMapa = document.getElementById("idmap_" + $this.instanceId);
        objMapa.style.display = "";

        map = new google.maps.Map(objMapa, {
            center: new google.maps.LatLng(-14.235, -51.9253),
            zoom: 18,
            mapTypeId: 'hybrid',
            disableDefaultUI: true
        });

        loadWindow.hide();
    }

    if (pCodTable == 'mapMarker') {
        if (markers.length > 0) {
            deleteMarkers();
        }

        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(pFiltro), parseFloat(pFiltro2)),
            map
        });

        markers.push(marker);

        var latLng = marker.getPosition(); // returns LatLng object
        map.setCenter(latLng); // setCenter takes a LatLng object


        map.addListener('click', function (e) {
            adicionarMarcador(e.latLng.lat(), e.latLng.lng())
            // CarregarEnderecoPorLatLng();
        });

        loadWindow.hide();
    }



    if (pCodTable == 'CONDOMINIO') {

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'CONSULTA', 'CONSULTA', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codcondominio', "", "", ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_condominios", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wInstalador = ''

                        strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Adicionar' onclick=\"f_showCondominio('" + data.values[i]["id"] + "','" + data.values[i]["condominio"] + "','" + data.values[i]["uf"] + "','" + data.values[i]["cidade"] + "','" + data.values[i]["unidades"] + "','" + data.values[i]["concluidas"] + "','" + data.values[i]["emconstrucao"] + "','" + data.values[i]["latitude"] + "','" + data.values[i]["longitude"] + "');\"></i>";
                        var datatableRow = {
                            codigo: data.values[i]["id"],
                            uf: data.values[i]["uf"],
                            cidade: data.values[i]["cidade"],
                            condominio: data.values[i]["condominio"],
                            unidade: data.values[i]["unidades"],
                            concluidas: data.values[i]["concluidas"],
                            emconstrucao: data.values[i]["emconstrucao"],
                            saldo: data.values[i]["saldo"],
                            ts: strIcone
                        }
                        regs.push(datatableRow);
                    }
                    dataTable.reload(regs);
                    loadWindow.hide();
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });

    }

    if (pCodTable == 'DETAILCONDOMINIO') {


        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'CONSULTA', 'CONSULTA', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codcondominio', pFiltro3, pFiltro3, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_condominios", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var arrEng = JSON.parse(data.values[i]["eng"])

                        var strIcone = "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Engenheiro' data-remover-row></i>";
                        for (var x = 0; x < arrEng.length; x++) {
                            var datatableRow = {
                                codigo: arrEng[x]["codigo"],
                                nome: arrEng[x]["nome"],
                                telefone: arrEng[x]["telefone"],
                                registro: arrEng[x]["registro"],
                                obras: arrEng[x]["obras"],
                                ts: strIcone
                            }
                            regs.push(datatableRow);
                        }
                        dataTableItem.reload(regs);
                    }

                    loadWindow.hide();
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });

    }
}

function f_formatData(data) {
    var lData = data + 'T00:00:00';
    var dtRegistro = new Date(lData),
        dia = (dtRegistro.getDate()),
        diaF = (dia.toString().length == 1) ? '0' + dia : dia,
        mes = (dtRegistro.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.toString().length == 1) ? '0' + mes : mes,
        anoF = dtRegistro.getFullYear();
    var datFormatado = diaF + "/" + mesF + "/" + anoF;

    return datFormatado;
}

function f_incluirItemN() {
    openItens('zoom_itens');
}

function openItens(id) {

    var load = FLUIGC.loading(window, { textMessage: 'Carregando Itens...' });
    load.show();

    // console.log('Novo Arquivo');

    var compon = new Array();
    compon['columns'] = ['select', 'idengenheiro', 'nome', 'telefone', 'registro'];
    compon['values'] = [];
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'ENGENHEIROS', 'ENGENHEIROS', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('codcondominio', $('#id_condominio_' + $this.instanceId).val(), $('#id_condominio_' + $this.instanceId), ConstraintType.MUST));
    DatasetFactory.getDataset("dsk_condominios", null, constraints, null, {
        success: (compon) => {
            // console.log('compon......', compon);

            var fields = [
                {
                    'field': 'select',
                    'titulo': '<input type="checkbox" id="checkAll" name="checkAll" class="form-control checkAll" \>',
                    'type': 'checkbox',
                    'style': 'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
                    'class': 'form-control checkItem',
                    'livre': '',
                    'width': '5%'
                },
                {
                    'field': 'idengenheiro',
                    'titulo': '<input type="text" id="idengenheiro" name="idengenheiro" class="form-control filter" placeholder="Código" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-right fs-sm-padding-right',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '5%'
                },
                {
                    'field': 'nome',
                    'titulo': '<input type="text" id="nome" name="nome" class="form-control filter" placeholder="Nome" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-left fs-sm-padding-left',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '20%'
                },
                {
                    'field': 'telefone',
                    'titulo': '<input type="text" id="telefone" name="telefone" class="form-control filter" placeholder="telefone" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-right fs-sm-padding-right',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '7%'
                },
                {
                    'field': 'registro',
                    'titulo': '<input type="text" id="registro" name="registro" class="form-control filter" placeholder="registro" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-right fs-sm-padding-right',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '6%'
                },
            ];


            var retorno = modalTable('zoom_eng', 'Engenheiros', fields, compon.values, 'large', id, 'N');
            load.hide();
            // console.log(retorno);
        }
    });
}

function returnModalTable(retorno) {
    // console.log('retorno.....', retorno.id, retorno);
    // var lista = retorno.idChave.split('___')[0].split('_')[2];
    if (retorno.id == 'zoom_eng') {
        var wNumLinha = null;
        var wItens = [];
        ['select', 'idengenheiro', 'nome', 'telefone', 'registro'];
        loadWindow.show();
        for (var i = 0; i < retorno.dados.length; i++) {
            if (retorno.dados[i].select == 'S') {
                var data = {
                    idengenheiro: retorno.dados[i].idengenheiro.trim(),
                    nome: retorno.dados[i].nome.trim(),
                    telefone: retorno.dados[i].telefone.trim(),
                    registro: retorno.dados[i].registro,
                    obras: 0
                }
                wItens.push(data);
            }
        }

        if (wItens.length > 0) {
            var regs = dataTableItem.getData(0);
            for (var i = 0; i < wItens.length; i++) {
                var strIcone = '';
                strIcone += "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Serviço' data-remover-row></i>";

                var datatableRow = {
                    codigo: wItens[i]["idengenheiro"],
                    nome: wItens[i]["nome"],
                    telefone: wItens[i]["telefone"],
                    registro: wItens[i]["registro"],
                    obras: wItens[i]["obras"],
                    ts: strIcone
                }
                regs.push(datatableRow);
            }
            dataTableItem.reload(regs);
        }

        loadWindow.hide();

    }

    return true;

}

function f_validaItemFilho(pCodItem) {
    var wRetorno = false;
    try {
        $('input[name^="cod_item___"]').each(function (index, value) {
            var seq = $(this).attr("id").split('___')[1];
            if ($(this).val != '') {
                if ($('#cod_item___' + seq).val().trim() == pCodItem.trim() && wRetorno == false) {
                    wRetorno = true;
                }
            }

        });
    } catch (error) { }

    return wRetorno;
}

function f_alteradoRegistro() {
    var itemsDataEng = dataTableItem.getData();

    // if ($('#cod_instalador_' + $this.instanceId).val() == '' || $('#md_nom_responsavel_' + $this.instanceId).val() == '' || $('#md_num_whats_' + $this.instanceId).val() == '' || $('#dt_ini_' + $this.instanceId).val() == '' || $('#dt_fim_' + $this.instanceId).val() == '' || itemsToRemove.length == 0) {
    //     FLUIGC.toast({
    //         message: 'Os Campos Instalador, Data Incício, Data Fim, Responsavel, Whats e itens da proposta são obrigatórios, ',
    //         type: 'danger'
    //     });
    //     return false;
    // }

    FLUIGC.message.confirm({
        message: 'Confirma a Alteração do condomínio?',
        title: 'Alteração condomínio',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {
            loadWindow.show();

            var pIdCondominio = $('#id_condominio_' + $this.instanceId).val();
            var arrItens = [];
            if (itemsDataEng.length > 0) {
                for (var i = 0; i < itemsDataEng.length; i++) {
                    var row = dataTableItem.getData()[i];

                    var data = {
                        idengenheiro: row.codigo,
                        nome: row.nome,
                        telefone: row.telefone,
                        registro: row.registro,
                        obras: row.obras
                    }
                    arrItens.push(data);
                }
            }

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'UPD', 'UPD', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codcondominio', pIdCondominio, pIdCondominio, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('condominio', $('#nome_condominio_' + $this.instanceId).val(), $('#nome_condominio_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('unidades', $('#md_num_unidades_' + $this.instanceId).val(), $('#md_num_unidades_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('concluidas', $('#md_num_concluidas_' + $this.instanceId).val(), $('#md_num_concluidas_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('construcao', $('#md_num_construcao_' + $this.instanceId).val(), $('#md_num_construcao_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('latitude', $('#md_latitude_' + $this.instanceId).val(), $('#md_latitude_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('longitude', $('#md_longitude_' + $this.instanceId).val(), $('#md_longitude_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('json', JSON.stringify(arrItens), JSON.stringify(arrItens), ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_condominios", null, constraints, null);

            if (dataset != null) {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {
                            loadDadosDataTable("CONDOMINIO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val());
                            md_condominio.remove();
                        } else {
                            loadWindow.hide();
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataset.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }

                    }
                }
            }
            loadWindow.hide();
        }
    });

}


function f_incluirRegistro() {
    var wMensagem = 'Confirma a inclusão do Condomínio?';
    var wMTitulo = 'Incluir Condomínio';

    if ($('#md_id_condominio_' + $this.instanceId).val() != undefined && $('#md_id_condominio_' + $this.instanceId).val() != '') {
        var wMensagem = 'Confirma a alteração do Condomínio?';
        var wMTitulo = 'Atualizar Condomínio';
    }

    if ($('#md_condominio_' + $this.instanceId).val() == '' || $('#md_UF_' + $this.instanceId).val() == '' || $('#md_cidade_' + $this.instanceId).val() == '' || $('#md_endereco_' + $this.instanceId).val() == '' || $('#md_bairro_' + $this.instanceId).val() == '') {
        FLUIGC.toast({
            message: 'Os Campos Condomínio, UF, Cidade, Endereço e Bairro são obrigatórios, ',
            type: 'danger'
        });
        return false;
    }

    FLUIGC.message.confirm({
        message: wMensagem,
        title: wMTitulo,
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {
        if (result == true) {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'FINDCOOD', 'FINDCOOD', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codcondominio', $('#md_id_condominio_' + $this.instanceId).val(), $('#md_id_condominio_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('condominio', $('#md_condominio_' + $this.instanceId).val(), $('#md_condominio_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('uf', $('#cod_md_UF_' + $this.instanceId).val(), $('#cod_md_UF_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('cidade', $('#md_cidade_' + $this.instanceId).val(), $('#md_cidade_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('bairro', $('#md_bairro_' + $this.instanceId).val(), $('#md_bairro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('endereco', $('#md_endereco_' + $this.instanceId).val(), $('#md_endereco_' + $this.instanceId).val(), ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_condominios", null, constraints, null);
            if (dataset != null) {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {

                            if ($('#md_id_condominio_' + $this.instanceId).val() == undefined || $('#md_id_condominio_' + $this.instanceId).val() == '') {
                                var constraints = new Array();
                                constraints.push(DatasetFactory.createConstraint('indacao', 'CONSULTA', 'CONSULTA', ConstraintType.MUST));
                                constraints.push(DatasetFactory.createConstraint('uf', '', '', ConstraintType.MUST));
                                constraints.push(DatasetFactory.createConstraint('cidade', '', '', ConstraintType.MUST));
                                constraints.push(DatasetFactory.createConstraint('codcondominio', dataset.values[i]["MENSAGEM"], dataset.values[i]["MENSAGEM"], ConstraintType.MUST));
                                DatasetFactory.getDataset("dsk_condominios", null, constraints, null, {
                                    success: (data) => {
                                        if (data.hasOwnProperty("values") && data.values.length > 0) {
                                            var regs = new Array();
                                            for (var x = 0; x < data.values.length; x++) {
                                                md_addcondominio.remove();
                                                f_showCondominio(data.values[x]["id"], data.values[x]["condominio"], data.values[x]["uf"], data.values[x]["cidade"], data.values[x]["unidades"], data.values[x]["concluidas"], data.values[x]["emconstrucao"], data.values[x]["latitude"], data.values[x]["longitude"])
                                            }

                                        }

                                    },
                                    error: (err) => {
                                        loadWindow.hide();
                                    },
                                });
                            } else {
                                loadDadosDataTable("CONDOMINIO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val());
                                md_addcondominio.remove();
                                md_condominio.remove();

                                loadWindow.hide();
                            }
                        }

                    }
                }
            }
            loadWindow.hide();
        }
    });
}

function f_incluirEngenheiro() {
    if ($('#md_engenheiro_' + $this.instanceId).val() == '' || $('#md_num_telefone_' + $this.instanceId).val() == '' || $('#md_registro_' + $this.instanceId).val() == '') {
        FLUIGC.toast({
            message: 'Os Campos Nome, Telefone e Registro são obrigatórios, ',
            type: 'danger'
        });
        return false;
    }

    FLUIGC.message.confirm({
        message: 'Confirma a inclusão do Engenheiro?',
        title: 'Incluir Engenheiro',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {
        if (result == true) {
            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'INCENG', 'INCENG', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nome', $('#md_engenheiro_' + $this.instanceId).val(), $('#md_engenheiro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('telefone', $('#md_num_telefone_' + $this.instanceId).val(), $('#md_num_telefone_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('registro', $('#md_registro_' + $this.instanceId).val(), $('#md_registro_' + $this.instanceId).val(), ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_condominios", null, constraints, null);

            if (dataset != null) {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {
                            md_addEngenheiro.remove();
                        } else {
                            FLUIGC.toast({
                                message: dataset.values[i]["MENSAGEM"],
                                type: 'danger'
                            });
                            // return false;
                        }
                    }
                }
            }
            loadWindow.hide();
        }
    });
}


const handlePhone = (event) => {
    let input = event.target
    input.value = phoneMask(input.value)
}

const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    return value
}

function adicionarMarcador(latitude, longitude) {

    if (markers.length > 0) {
        deleteMarkers();
    }

    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
    });

    markers.push(marker);

    $('#md_latitude_' + $this.instanceId).val(latitude);
    $('#md_longitude_' + $this.instanceId).val(longitude)

}