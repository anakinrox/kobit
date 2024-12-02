var dataTable = null;
var dataTableItem = null;
var dataTableServico = null;
var dataTableServicoFoto = null;
var dataTableAceiteFoto = null;
var dataTableItemProposta = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];


function loadDataTable(pCodTable) {

    if (pCodTable == 'PROPOSTA') {
        rContent = ['codigo', 'proposta', 'data', 'equipe', 'uf', 'cidade', 'bairro', 'cliente', 'instalador', 'consultor', 'notafical', 'ts'];

        rHeader = [
            { 'title': 'codigo', 'dataorder': 'codigo', 'size': 'col-md-1', 'display': false },
            { 'title': 'Proposta', 'dataorder': 'proposta', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Data', 'dataorder': 'data', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Equipe', 'dataorder': 'equipe', 'size': 'col-sm-1', 'display': true },
            { 'title': 'UF', 'dataorder': 'uf', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Cidade', 'dataorder': 'cidade', 'size': 'col-md-1', 'display': true },
            { 'title': 'Bairro', 'dataorder': 'bairro', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Clientes', 'dataorder': 'cliente', 'size': 'col-md-2', 'display': true },
            { 'title': 'Instalador', 'dataorder': 'instalador', 'size': 'col-md-2', 'display': true },
            { 'title': 'Consultor', 'dataorder': 'consultor', 'size': 'col-md-2', 'display': true },
            { 'title': 'Nota Fiscal', 'dataorder': 'notafical', 'size': 'col-md-1', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];


        dataTableItem = FLUIGC.datatable('#idTBLPropostas_' + $this.instanceId, {
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
                target: '#idTBLPropostas_' + $this.instanceId,
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

    if (pCodTable == 'INSTALACAO') {
        rContent = ['color', 'colortexto', 'codigo', 'sequencia', 'proposta', 'tipo_proposta', 'dat_prev_producao', 'dat_emissao_nf', 'inicio', 'fim', 'equipe', 'cliente', 'instalador', 'idstatus', 'pagamento', 'status', 'token', 'idproposta', 'ts'];

        rHeader = [
            { 'title': 'cor', 'dataorder': 'color', 'size': 'col-md-2', 'display': false },
            { 'title': 'cortexto', 'dataorder': 'colortexto', 'size': 'col-md-2', 'display': false },
            { 'title': 'codigo', 'dataorder': 'codigo', 'size': 'col-sm-1', 'display': false },
            { 'title': 'sequencia', 'dataorder': 'sequencia', 'size': 'col-sm-1', 'display': false },
            { 'title': 'Proposta', 'dataorder': 'proposta', 'display': true },
            { 'title': 'Tipo', 'dataorder': 'tipo_proposta', 'display': true },
            { 'title': 'Prev. Produção', 'dataorder': 'dat_prev_producao', 'display': true },
            { 'title': 'Nota Fiscal', 'dataorder': 'dat_emissao_nf', 'display': true },
            { 'title': 'Data Início', 'dataorder': 'inicio', 'display': true },
            { 'title': 'Data Fim', 'dataorder': 'fim', 'display': true },
            { 'title': 'Equipe', 'dataorder': 'equipe', 'size': 'col-md-1', 'display': true },
            { 'title': 'Cliente', 'dataorder': 'cliente', 'size': 'col-md-2', 'display': true },
            { 'title': 'Instalador', 'dataorder': 'instalador', 'size': 'col-md-2', 'display': true },
            { 'title': 'idsituação', 'dataorder': 'idstatus', 'display': false },
            { 'title': 'Pagamento', 'dataorder': 'pagamento', 'display': true },
            { 'title': 'Situação', 'dataorder': 'status', 'display': true },
            { 'title': 'token', 'dataorder': 'token', 'size': 'col-sm-1', 'display': false },
            { 'title': 'idproposta', 'dataorder': 'idproposta', 'size': 'col-sm-1', 'display': false },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1', 'className': 'dt-body-right' }

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

    if (pCodTable == 'ITEMPROP') {
        rContent = ['proposta', 'seq', 'produto', 'descricao', 'local', 'ts'];

        rHeader = [
            { 'title': 'Proposta', 'dataorder': 'proposta', 'size': 'col-md-1', 'display': false },
            { 'title': 'Seq.', 'dataorder': 'seq', 'size': 'col-md-1', 'display': false },
            { 'title': 'Prod.', 'dataorder': 'produto', 'size': 'col-md-1', 'display': false },
            { 'title': 'Descrição', 'dataorder': 'descricao', 'size': 'col-md-5', 'display': true },
            { 'title': 'Local', 'dataorder': 'local', 'size': 'col-md-5', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-md-1' }

        ];


        dataTableItemProposta = FLUIGC.datatable('#idTBLItemProposta_' + $this.instanceId, {
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
                    dataTableItemProposta.reload(search);
                },
                onlyEnterkey: false,
                searchAreaStyle: 'col-md-3'
            },
            scroll: {
                target: ".target",
                enabled: false
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

    if (pCodTable == 'SERVICOS') {
        rContent = ['id', 'produto', 'descricao', 'ts'];

        rHeader = [
            { 'title': 'ID', 'dataorder': 'id', 'size': 'col-md-1', 'display': true },
            { 'title': 'produto', 'dataorder': 'produto', 'size': 'col-md-1', 'display': false },
            { 'title': 'Descrição', 'dataorder': 'descricao', 'size': 'col-md-8', 'display': true },
            { 'title': '', 'width': '0%' }
        ];


        dataTableServico = FLUIGC.datatable('#idTBLServico_' + $this.instanceId, {
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
                    dataTableServico.reload(search);
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

    if (pCodTable == 'ACEITE') {
        rContent = ['foto'];

        rHeader = [
            { 'title': 'Foto', 'dataorder': 'foto', 'size': 'col-md-8', 'display': true }
        ];


        dataTableAceiteFoto = FLUIGC.datatable('#idTBLAceite_' + $this.instanceId, {
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
                    dataTableServicoFoto.reload(search);
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

    if (pCodTable == 'FOTOS') {
        rContent = ['foto'];

        rHeader = [
            { 'title': 'Foto', 'dataorder': 'foto', 'size': 'col-md-8', 'display': true }
        ];


        dataTableServicoFoto = FLUIGC.datatable('#idTBLServicoFoto_' + $this.instanceId, {
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
                    dataTableServicoFoto.reload(search);
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

function loadDadosDataTable(pCodTable, pFiltro, pFiltro2, pFiltro3, pFiltro4) {
    if (gWidgetOFF) {
        FLUIGC.toast({
            message: 'O Portal está em manuteção favor aguardar para utilizar o mesmo.',
            type: 'danger'
        });

        return false;
    }

    loadWindow.show();

    if (pCodTable == 'PROPOSTA') {


        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PROPOSTA', 'PROPOSTA', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('equipe', pFiltro3, pFiltro3, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wInstalador = '';
                        var wNotaFiscal = '';

                        if (data.values[i]["Instalador"] != 'null') {
                            wInstalador = data.values[i]["Instalador"];
                        }
                        if (data.values[i]["notafiscal"] != 'null') {
                            wNotaFiscal = f_formatData(data.values[i]["notafiscal"]);
                        }

                        strIcone += "<i class='fluigicon fluigicon-fileedit icon-sm corAzul' title='Adicionar' onclick=\"f_addPropostaCell('" + data.values[i]["id"] + "','" + data.values[i]["proposta"] + "','" + data.values[i]["cliente"] + "','" + data.values[i]["idInstalador"] + "','" + wInstalador + "','','" + data.values[i]["bairro"] + "/" + data.values[i]["cidade"] + "','" + data.values[i]["consultor"] + "','" + wNotaFiscal + "');\"></i>";
                        var datatableRow = {
                            codigo: data.values[i]["id"],
                            proposta: data.values[i]["proposta"],
                            data: f_formatData(data.values[i]["data"]),
                            equipe: data.values[i]["equipe"],
                            uf: data.values[i]["uf"],
                            cidade: data.values[i]["cidade"],
                            bairro: data.values[i]["bairro"],
                            cliente: data.values[i]["cliente"],
                            instalador: wInstalador,
                            consultor: data.values[i]["consultor"],
                            notafical: wNotaFiscal,
                            ts: strIcone
                        }
                        regs.push(datatableRow);
                    }
                    dataTableItem.reload(regs);
                    loadWindow.hide();
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });

    }

    if (pCodTable == 'INSTALACAO') {

        if (pFiltro != '' && pFiltro2 != '' && pFiltro3 != '') {
            FLUIGC.toast({
                message: 'Deve ser selecionado apenas um dos fitros, UF e Cidade ou Equipe.',
                type: 'danger'
            });

            return false;
        }

        var regs = new Array();
        dataTable.reload(regs);

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'INSTALACAO', 'INSTALACAO', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('equipe', pFiltro3, pFiltro3, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('status', pFiltro4, pFiltro4, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {

                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wStatus = data.values[i]["situacao"]
                        var wToken = '';
                        var wCorIcone = (data.values[i]["cor"] == '#000000' ? 'textobranco' : 'textoblack');

                        if (data.values[i]["Instalador"] != 'null') {
                            wInstalador = data.values[i]["Instalador"];
                        }

                        if ((data.values[i]["idsituacao"] == '8') || (data.values[i]["idsituacao"] == '6') || (data.values[i]["idsituacao"] == '7') || (data.values[i]["idsituacao"] == '9') || (data.values[i]["idsituacao"] == '12')) {
                            strIcone += "<i class='fluigicon fluigicon-add-test icon-md textoblack' title='Incluir Registro' onclick=\"f_editPropostaCell('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        if (data.values[i]["idsituacao"] == '10' || data.values[i]["idsituacao"] == '1' || data.values[i]["idsituacao"] == '3' || data.values[i]["idsituacao"] == '4' || data.values[i]["idsituacao"] == '11') {
                            strIcone += "<i class='flaticon flaticon-edit-square icon-md corVerde' title='Editar Registro' onclick=\"f_editPropostaCell('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        if (data.values[i]["idsituacao"] == '10' || data.values[i]["idsituacao"] == '1') {
                            strIcone += "<i class='fluigicon fluigicon-calendar-remove icon-md corVermelha' title='Remover Registro' onclick=\"f_deleteRegistro('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        if (data.values[i]["idsituacao"] == '3') {
                            strIcone += "<i class='flaticon flaticon-email icon-md " + wCorIcone + "' title='Reenviar mensagem' onclick=\"f_enviaMensagem('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        if (data.values[i]["token"] != 'null' && data.values[i]["token"] != undefined) {
                            strIcone += "<i class='flaticon flaticon-pageview icon-md " + wCorIcone + "' title='Visualiar Serviços' onclick=\"f_viewServico('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        if ((data.values[i]["idsituacao"] == '4' || data.values[i]["idsituacao"] == '3') && data.values[i]["ind_pagamento"] == 'N') {
                            strIcone += "<i class='fluigicon fluigicon-money-circle icon-md " + wCorIcone + "' title='Enviar pagamento' onclick=\"f_enviarPagamento('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "');\"></i>";
                        }

                        switch (data.values[i]["aceite"]) {
                            case 'null':
                                strIcone += "<i class='flaticon flaticon-file-clock icon-md corAzul' aria-hidden='true' title='Aguardando Aceite da instalação'></i>";
                                break;
                            case 'S':
                                strIcone += "<i class='flaticon flaticon-file-check icon-md corVerde' aria-hidden='true' title='instalação Aceita' onclick=\"f_viewAceite('" + data.values[i]["id"] + "','" + data.values[i]["seq"] + "','" + f_formatData(data.values[i]["dat_aceite"]) + "');\"></i>";
                                break;
                            case 'N':
                                strIcone += "<i class='flaticon flaticon-file-delete icon-md corVermelha' aria-hidden='true' title='Aceite de Instalações recusado.'></i>";
                                break;
                        }

                        var wPagamento = data.values[i]["ind_pagamento"] == 'N' ? '<span style="background-color: red">Não</span>' : '<span style="background-color: green">Sim</span>';

                        var datatableRow = {
                            color: data.values[i]["cor"],
                            colortexto: data.values[i]["texto"],
                            codigo: data.values[i]["id"],
                            sequencia: data.values[i]["seq"],
                            proposta: data.values[i]["proposta"],
                            tipo_proposta: data.values[i]["tipo_proposta"],
                            dat_prev_producao: f_formatData(data.values[i]["dat_prev_producao"]),
                            dat_emissao_nf: f_formatData(data.values[i]["notafiscal"]),
                            inicio: f_formatData(data.values[i]["datainicio"]),
                            fim: f_formatData(data.values[i]["datafim"]),
                            equipe: data.values[i]["equipe"],
                            cliente: data.values[i]["cliente"],
                            instalador: data.values[i]["instalador"] != 'null' ? data.values[i]["instalador"] : '',
                            idstatus: data.values[i]["idsituacao"],
                            pagamento: wPagamento,
                            status: wStatus,
                            token: data.values[i]["token"],
                            idproposta: data.values[i]["idproposta"],
                            ts: strIcone
                        }

                        regs.push(datatableRow);
                    }
                    dataTable.reload(regs);
                    formataTable('idtable_' + $this.instanceId);

                }
                loadWindow.hide();
            },
            error: (err) => {
                loadWindow.hide();
            },
        });


    }

    if (pCodTable == 'ITEMPROP') {
        loadWindow.show();

        var regs = new Array();
        dataTableItemProposta.reload(regs);
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'ITEMPROPOSTA', 'ITEMPROPOSTA', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('proposta', pFiltro, pFiltro, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {

                    for (var i = 0; i < data.values.length; i++) {
                        var strIcone = '';

                        // rContent = ['proposta', 'id', 'descricao', 'local', 'ts'];
                        strIcone += "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Serviço' data-remover-row></i>";
                        var datatableRow = {
                            proposta: data.values[i]["idproposta"],
                            seq: data.values[i]["seq"],
                            descricao: data.values[i]["produto"],
                            local: data.values[i]["local"],
                            ts: strIcone
                        }
                        regs.push(datatableRow);
                    }
                    dataTableItemProposta.reload(regs);


                } else {
                    FLUIGC.toast({
                        message: 'Essa proposta não tem itens elegiveis para serem utilizados no APP',
                        type: 'danger'
                    });
                }

                loadWindow.hide();
            },
            error: (err) => {
                loadWindow.hide();
            },
        });
    }

    if (pCodTable == 'SERVICOS') {
        loadWindow.show();
        var regs = new Array();
        dataTableServico.reload(regs);
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'SERVICOS', 'SERVICOS', ConstraintType.MUST));
        // constraints.push(DatasetFactory.createConstraint('indfoto', 'N', 'N', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('idregistro', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('sequencia', pFiltro2, pFiltro2, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

        if (dataset.rowsCount == 0) {
            loadWindow.hide();
            throw "Registro não encontrados";
        } else {
            for (var i = 0; i < dataset.values.length; i++) {

                var wItens = JSON.parse(dataset.values[i].ITENS);

                for (var x = 0; x < wItens.length; x++) {
                    var strIcone = '';

                    if (wItens[x].situacao == 'F') {
                        strIcone += "<i class='fluigicon fluigicon-pictures icon-sm corAzul' title='Visualiar as Fotos' onclick=\"f_viewServicoFoto('" + pFiltro + "','" + pFiltro2 + "','" + wItens[x].seq + "','" + wItens[x].produto + "');\"></i>";
                    }

                    var datatableRow = {
                        id: wItens[x].seq,
                        produto: wItens[x].produto,
                        descricao: wItens[x].descricao + ' - ' + wItens[x].local,
                        ts: strIcone
                    }
                    regs.push(datatableRow);
                }
            }
            dataTableServico.reload(regs);
            loadWindow.hide();
        }
    }

    if (pCodTable == 'FOTOS') {

        loadWindow.show();

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'FOTOS', 'FOTOS', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('idregistro', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('sequencia', pFiltro2, pFiltro2, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('seqitem', pFiltro3, pFiltro3, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('produto', pFiltro4, pFiltro4, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {
                        var wImage = '';
                        var wImage = '<img src="' + data.values[i]['FOTO'] + '" id="" width="300px">';

                        var datatableRow = {
                            foto: wImage
                        }
                        regs.push(datatableRow);
                    }
                    dataTableServicoFoto.reload(regs);

                }
                loadWindow.hide();
            },
            error: (err) => {
                loadWindow.hide();
            },
        });
    }

    if (pCodTable == 'ACEITE') {

        loadWindow.show();

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'ACEITE', 'ACEITE', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('idregistro', pFiltro, pFiltro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('sequencia', pFiltro2, pFiltro2, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {
                        var wImage = '';
                        var wImage = '<img src="' + data.values[i]['FOTO'] + '" id="" width="300px">';

                        var datatableRow = {
                            foto: wImage
                        }
                        regs.push(datatableRow);
                    }
                    dataTableAceiteFoto.reload(regs);

                }
                loadWindow.hide();
            },
            error: (err) => {
                loadWindow.hide();
            },
        });
    }

}

function f_incluirRegistro() {
    if (gWidgetOFF) {
        FLUIGC.toast({
            message: 'O Portal está em manuteção favor aguardar para utilizar o mesmo.',
            type: 'danger'
        });

        return false;
    }

    var itemsToRemove = dataTableItemProposta.getData();

    widStatusAtual


    loadWindow.show();
    var widStatusAtual = f_getStats($('#md_idstatus_atual_' + $this.instanceId).val());
    var widStatusNovo = f_getStats($('#md_idstatus_' + $this.instanceId).val());
    loadWindow.hide();

    if (widStatusNovo.ordem == 5 || widStatusNovo.ordem == 10) {
        if ($('#md_idstatus_' + $this.instanceId).val() == '' || $('#cod_instalador_' + $this.instanceId).val() == '' || $('#cod_instalador_' + $this.instanceId).val() == 'null' || $('#md_nom_responsavel_' + $this.instanceId).val() == '' || $('#md_num_whats_' + $this.instanceId).val() == '' || $('#dt_ini_' + $this.instanceId).val() == '' || $('#dt_fim_' + $this.instanceId).val() == '' || (itemsToRemove.length == 0 && widStatusNovo.codigo != 11)) {
            FLUIGC.toast({
                message: 'Os Campos Instalador, Data Incício, Data Fim, Responsavel, Whats, Status e itens da proposta são obrigatórios, ',
                type: 'danger'
            });
            return false;
        }
    }


    if (widStatusNovo.codigo == 13) {
        if ($('#md_idstatus_' + $this.instanceId).val() == '' || $('#cod_instalador_' + $this.instanceId).val() == '' || $('#cod_instalador_' + $this.instanceId).val() == 'null' || $('#md_nom_responsavel_' + $this.instanceId).val() == '' || $('#md_num_whats_' + $this.instanceId).val() == '' || (itemsToRemove.length == 0 && widStatusNovo.codigo != 11)) {
            FLUIGC.toast({
                message: 'Os Campos Instalador, Responsavel, Whats, Status e itens da proposta são obrigatórios, ',
                type: 'danger'
            });
            return false;
        }
    }

    if ((widStatusAtual.ordem >= 5) && (widStatusNovo.ordem < widStatusAtual.ordem) && ([11, 12].indexOf(widStatusAtual.codigo) != -1)) {
        FLUIGC.toast({
            message: 'Não é permitido voltar essa instalação para um status de ordem menor, ',
            type: 'danger'
        });
        return false;
    }

    FLUIGC.message.confirm({
        message: 'Confirma a atualização da instalação?',
        title: 'Instalações',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {
            loadWindow.show();
            var wChkTermo = 'N';
            var arrItens = [];
            if (itemsToRemove.length > 0) {
                for (var i = 0; i < itemsToRemove.length; i++) {
                    var row = dataTableItemProposta.getData()[i];

                    wProposta = row.proposta;

                    var data = {
                        idproposta: row.proposta,
                        seq: row.seq,
                        produto: row.produto,
                        descricao: row.descricao,
                        local: row.local
                    }
                    arrItens.push(data);
                }

                if ($('#md_indTermo_' + $this.instanceId).is(':checked')) {
                    wChkTermo = 'S'
                }
            }

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'INC', 'INC', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idregistro', $('#md_id_registro_' + $this.instanceId).val(), $('#md_id_registro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('sequencia', $('#md_seq_registro_' + $this.instanceId).val(), $('#md_seq_registro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idproposta', $('#md_id_proposta_' + $this.instanceId).val(), $('#md_id_proposta_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idinstalador', $('#cod_instalador_' + $this.instanceId).val(), $('#cod_instalador_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('datinicio', $('#dt_ini_' + $this.instanceId).val(), $('#dt_ini_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('datfim', $('#dt_fim_' + $this.instanceId).val(), $('#dt_fim_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('responsavel', $('#md_nom_responsavel_' + $this.instanceId).val(), $('#md_nom_responsavel_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('whats', $('#md_num_whats_' + $this.instanceId).val(), $('#md_num_whats_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('indtermo', wChkTermo, wChkTermo, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idStatusAtual', $('#md_idstatus_atual_' + $this.instanceId).val(), $('#md_idstatus_atual_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idStatusNovo', $('#md_idstatus_' + $this.instanceId).val(), $('#md_idstatus_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('observacao', $('#md_observacao_' + $this.instanceId).val(), $('#md_observacao_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('json', JSON.stringify(arrItens), JSON.stringify(arrItens), ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

            if (dataset.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_instaladores";
            } else {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {
                            loadDadosDataTable("INSTALACAO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val(), $('#nome_equipe_' + $this.instanceId).val(), $('#idstatus_' + $this.instanceId).val());
                            md_propostaAdd.remove();

                        } else {
                            loadWindow.hide();
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataset.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                        loadWindow.hide();
                    }
                }
            }
        }
    });

}

function f_formatData(data) {
    if (data == '' || data == 'null') { return ""; }
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

function f_updateMensagem() {
    if (gWidgetOFF) {
        FLUIGC.toast({
            message: 'O Portal está em manuteção favor aguardar para utilizar o mesmo.',
            type: 'danger'
        });

        return false;
    }

    if (($('#md_nom_responsavel_' + $this.instanceId).val() == '') || ($('#md_num_whats_' + $this.instanceId).val() == '')) {
        FLUIGC.toast({
            message: 'Os Campos  [ Responsavel e WhatsAPP ] devem ser preenchidos.',
            type: 'danger'
        });
        return false;
    }


    FLUIGC.message.confirm({
        message: 'Confirma o reenvio da mensagem de aprovação do serviço?',
        title: 'Reenvio da mensagem',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {

            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'UPDMSG', 'UPDMSG', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idregistro', $('#md_id_registro_' + $this.instanceId).val(), $('#md_id_registro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('sequencia', $('#md_seq_registro_' + $this.instanceId).val(), $('#md_seq_registro_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('responsavel', $('#md_nom_responsavel_' + $this.instanceId).val(), $('#md_nom_responsavel_' + $this.instanceId).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('num_whats', $('#md_num_whats_' + $this.instanceId).val(), $('#md_num_whats_' + $this.instanceId).val(), ConstraintType.MUST));

            DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
                success: (data) => {
                    if (data.hasOwnProperty("values") && data.values.length > 0) {

                        for (var i = 0; i < data.values.length; i++) {
                            if (data.values[i]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Registro atualizar e mensagem enviada.',
                                    type: 'success',
                                    timeout: 'fast'
                                });
                                md_mensagemReSend.remove();
                            } else {
                                FLUIGC.toast({
                                    message: 'Mensagem não enviado motivo [" ' + data.values[i]["MENSAGEM"] + ' "]',
                                    type: 'danger'
                                });
                            }
                        }

                    }
                    loadWindow.hide();
                },
                error: (err) => {
                    loadWindow.hide();
                },
            });


            // console.log('Foi tiozao kkkkk')
            // md_mensagemReSend.remove();
        }
    });
}

function formataTable(id) {
    var wId = id.split('_')[0];

    if (wId == 'idtable') {
        var objTable = $("#" + id);
        objTable[0].children[0].className = "table table-datatable table table-responsive table-bordered table-condensed";

        $("#" + id + " tbody").find("tr").each(function (el, ev) {
            this.style = "background-color:" + this.cells[0].textContent;
            var corTexto = this.cells[1].textContent;
            $($(this).children()).each(function (el, ev) {
                this.style = "display: " + this.style.display + ";color: " + corTexto;
            });
        });
    }
}

function f_getStats(pidStatus) {
    try {
        var wRetorno = null;
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'STATUS', 'STATUS', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('status', pidStatus, pidStatus, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

        if (dataset.values.length > 0) {
            for (var i = 0; i < dataset.values.length; i++) {
                var data = {
                    codigo: dataset.values[i]["codigo"],
                    descricao: dataset.values[i]["descricao"],
                    sync: dataset.values[i]["sync"],
                    ordem: dataset.values[i]["ordem"]
                }

                wRetorno = data;
            }
        }
    } catch (error) {

    } finally {
        return wRetorno;
    }
}

function f_getVersao(indDisparo) {
    try {
        var wRetorno = null;
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'VERSION', 'VERSION', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codwidget', gCodWidget, gCodWidget, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

        if (dataset.values.length > 0) {
            for (var i = 0; i < dataset.values.length; i++) {
                if (indDisparo != undefined) {
                    $('#idVersao').val(dataset.values[i]["numversion"]);
                    $('#strVersao').text("Ver.: " + dataset.values[i]["strversion"]);
                    gWidgetOFF = dataset.values[i]["manutencao"]
                } else {

                    var wVeraoAtual = parseInt($('#idVersao').val());
                    var wVeraoNova = parseInt(dataset.values[i]["numversion"]);
                    gWidgetOFF = dataset.values[i]["manutencao"];

                    if (wVeraoAtual < wVeraoNova) {
                        try {
                            if (md_propostaAdd.isOpen() == false) {
                                $('#idVersao').val(dataset.values[i]["numversion"]);
                                $('#strVersao').text("Ver.: " + dataset.values[i]["strversion"]);
                                location.assign(location.href);
                            }
                        } catch (error) {
                            if (md_propostaAdd == null) {
                                $('#idVersao').val(dataset.values[i]["numversion"]);
                                $('#strVersao').text("Ver.: " + dataset.values[i]["strversion"]);
                                location.assign(location.href);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {

    } finally {
        return wRetorno;
    }
}