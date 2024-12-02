var dataTable = null;
var dataTablePend = null;
var dataTableErros = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(pCodTable) {

    if (pCodTable == 'SYNC') {

        rContent = ['descricao', 'dataset', 'intervalo', 'ultimo', 'proximo', 'status', 'tempo', 'permissao', 'ts'];
        rHeader = [
            { 'title': 'Integração', 'dataorder': 'descricao', 'size': 'col-sm-2', 'display': true },
            { 'title': 'Dataset', 'dataorder': 'dataset', 'size': 'col-sm-1', 'display': false },
            { 'title': 'Intervalo', 'dataorder': 'intervalo', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Último Disparo', 'dataorder': 'ultimo', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Próximo Disparo', 'dataorder': 'proximo', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Status', 'dataorder': 'status', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Ult. Execucão', 'dataorder': 'tempo', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Permissão', 'dataorder': 'permissao', 'size': 'col-sm-1', 'display': false },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-sm-2', 'className': 'dt-body-right' }
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

    if (pCodTable == 'PEND') {

        rContent = ['cadastro', 'mensagem', 'vendedor', 'cliente', 'dat_inclusao', 'status', 'retorno', 'ts'];
        rHeader = [
            { 'title': 'Cadastro', 'dataorder': 'cadastro', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Mensagem', 'dataorder': 'mensagem', 'size': 'col-sm-4', 'display': true },
            { 'title': 'Vendedor', 'dataorder': 'vendedor', 'size': 'col-sm-2', 'display': true },
            { 'title': 'Cliente', 'dataorder': 'cliente', 'size': 'col-sm-3', 'display': true },
            { 'title': 'Incluído', 'dataorder': 'dat_inclusao', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Status', 'dataorder': 'status', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Retorno', 'dataorder': 'retorno', 'size': 'col-sm-1', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-sm-2', 'className': 'dt-body-right' }
        ];


        dataTablePend = FLUIGC.datatable('#idtable_pend_' + $this.instanceId, {
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

    if (pCodTable == 'ERROS') {

        rContent = ['id', 'data', 'error', 'ts'];
        rHeader = [
            { 'title': 'id', 'dataorder': 'id', 'size': 'col-sm-1', 'display': false },
            { 'title': 'Data', 'dataorder': 'data', 'size': 'col-sm-1', 'display': true },
            { 'title': 'Log', 'dataorder': 'error', 'size': 'col-md-4', 'display': true },
            { 'title': '', 'dataorder': 'ts', 'size': 'col-sm-2', 'className': 'dt-body-right' }
        ];


        dataTableErros = FLUIGC.datatable('#idTBLErros_' + $this.instanceId, {
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

    if (pCodTable == 'SYNC') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'AGENDAMENTO', 'AGENDAMENTO', ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wStatus = ''

                        // if (data.values[i]["Instalador"] != 'null') {
                        //     wInstalador = data.values[i]["Instalador"];
                        // }

                        if (data.values[i]["status"] != null) { wStatus = data.values[i]["status"] }
                        switch (data.values[i]["status"]) {
                            case 'C':
                                wStatus = 'Concluído';
                                strIcone += "<i class='fluigicon fluigicon-pause corVermelha' title='Pausar integração' onclick=\"f_iniciarPausar('" + data.values[i]["dataset"] + "','PA');\"></i>";
                                strIcone += "&nbsp;<i class='flaticon flaticon-undo icon-sm corAzul' title='Rodar integração' onclick=\"f_validaDisparo('" + data.values[i]["dataset"] + "','" + data.values[i]["permissao"] + "');\"></i>";
                                break;
                            case 'E':
                                wStatus = 'Em execução';
                                break;
                            case 'F':
                                wStatus = 'Com erro';
                                strIcone += "<i class='fluigicon fluigicon-pause corVermelha' title='Pausar integração' onclick=\"f_iniciarPausar('" + data.values[i]["dataset"] + "','PA');\"></i>";
                                strIcone += "&nbsp;<i class='flaticon flaticon-undo icon-sm corAzul' title='Rodar integração' onclick=\"f_validaDisparo('" + data.values[i]["dataset"] + "','" + data.values[i]["permissao"] + "');\"></i>";
                                break;
                            case 'P':
                                wStatus = 'Pausado';
                                strIcone += "<i class='fluigicon fluigicon-player-portrait corVerde' title='Iniciar integração' onclick=\"f_iniciarPausar('" + data.values[i]["dataset"] + "','PL');\"></i>";
                                strIcone += "&nbsp;<i class='flaticon flaticon-undo icon-sm corAzul' title='Rodar integração' onclick=\"f_validaDisparo('" + data.values[i]["dataset"] + "','" + data.values[i]["permissao"] + "');\"></i>";
                                break;
                            default:
                                wStatus = 'Primeiro disparo';
                                strIcone += "<i class='fluigicon fluigicon-pause corVermelha' title='Pausar integração' onclick=\"f_iniciarPausar('" + data.values[i]["dataset"] + "','PA');\"></i>";
                                strIcone += "&nbsp;<i class='flaticon flaticon-undo icon-sm corAzul' title='Rodar integração' onclick=\"f_validaDisparo('" + data.values[i]["dataset"] + "','" + data.values[i]["permissao"] + "');\"></i>";
                                break;
                        }


                        if (data.values[i]["log"] == '1') {
                            strIcone += "&nbsp;<i class='fluigicon fluigicon-control-log corVermelha' title='Visualizar Log' onclick=\"f_visualizarLog('" + data.values[i]["dataset"] + "');\"></i>";
                        }



                        var datatableRow = {
                            descricao: data.values[i]["descricao"],
                            dataset: data.values[i]["dataset"],
                            intervalo: data.values[i]["intervalo"],
                            ultimo: f_formatData(data.values[i]["ultimo"], 'T'),
                            proximo: f_formatData(data.values[i]["proximo"], 'T'),
                            status: wStatus,
                            tempo: data.values[i]["tempo"] + ' Min.',
                            permissao: data.values[i]["permissao"],
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


    if (pCodTable == 'ERROS') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'ERROS', 'ERROS', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('dataset', pFiltro, pFiltro, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wStatus = ''
                        strIcone += "<i class='fluigicon fluigicon-enrollment-verified corVerde' title='Confirma Leitura' onclick=\"f_confirmaLeitura('" + data.values[i]["id"] + "','" + pFiltro + "');\"></i>";
                        // 

                        var datatableRow = {
                            id: data.values[i]["id"],
                            data: data.values[i]["data"],
                            error: data.values[i]["log"],
                            ts: strIcone
                        }
                        regs.push(datatableRow);
                    }
                    dataTableErros.reload(regs);
                    loadWindow.hide();
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });
    }

    if (pCodTable == 'PEND') {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'PEND', 'PEND', ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {

                        var strIcone = '';
                        var wStatus = ''
                        // strIcone += "<i class='fluigicon fluigicon-enrollment-verified corVerde' title='Confirma Leitura' onclick=\"f_confirmaLeitura('" + data.values[i]["id"] + "','" + pFiltro + "');\"></i>";
                        // 
                        // rContent = ['cadastro', 'mensagem', 'vendedor', 'cliente', 'dat_inclusao', 'status', 'retorno', 'ts'];
                        var datatableRow = {
                            cadastro: data.values[i]["cadastro"],
                            mensagem: data.values[i]["mensagem"],
                            vendedor: data.values[i]["vendedor"],
                            cliente: data.values[i]["cliente"],
                            dat_inclusao: data.values[i]["dat_inclusao"],
                            status: data.values[i]["status"],
                            retorno: data.values[i]["retorno"],
                            ts: strIcone
                        }
                        regs.push(datatableRow);
                    }
                    dataTablePend.reload(regs);
                    loadWindow.hide();
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });
    }

}

function f_disparaDataset(pNomeDataSet) {

    try {
        loadWindow.show();
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'EXEC', 'EXEC', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('dataset', pNomeDataSet, pNomeDataSet, ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {
                        if (data.values[i]["retorno"] == false) {

                            var constraints = new Array();
                            DatasetFactory.getDataset(pNomeDataSet, null, constraints, null, {
                                success: (data) => {
                                    if (data.hasOwnProperty("values") && data.values.length > 0) {
                                        loadWindow.hide();
                                    }
                                },
                                error: (err) => {
                                    loadWindow.hide();
                                },
                            });
                        }

                    }
                }

            },
            error: (err) => {
                loadWindow.hide();
            },
        });

    } catch (error) {
        loadWindow.hide();
    }
}

function f_formatData(data, indRetorno) {
    var datFormatado = '';
    // alert(data);
    if (data != '' && data != null) {
        // var lData = data + 'T00:00:00';
        var lData = data;
        var dtRegistro = new Date(lData),
            dia = (dtRegistro.getDate()),
            diaF = (dia.toString().length == 1) ? '0' + dia : dia,
            mes = (dtRegistro.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.toString().length == 1) ? '0' + mes : mes,
            anoF = dtRegistro.getFullYear(),
            hora = (dtRegistro.getHours().toString().length == 1) ? '0' + dtRegistro.getHours() : dtRegistro.getHours(),
            minuto = (dtRegistro.getMinutes().toString().length == 1) ? '0' + dtRegistro.getMinutes() : dtRegistro.getMinutes(),
            segundos = (dtRegistro.getUTCSeconds().toString().length == 1) ? '0' + dtRegistro.getUTCSeconds() : dtRegistro.getUTCSeconds();

        if (indRetorno == undefined || indRetorno == 'D') {
            datFormatado = diaF + "/" + mesF + "/" + anoF;
        }
        if (indRetorno != undefined && indRetorno == 'T') {
            datFormatado = diaF + "/" + mesF + "/" + anoF + ' ' + hora + ':' + minuto;
        }
    }

    return datFormatado;
}


function f_validaDisparo(pDataSet, permissao) {

    if (permissao == 'S') {
        if (WCMAPI.isAdmin()) {
            FLUIGC.toast({
                message: 'Você não tem permissão para executar essa rotina.',
                type: 'danger',
                timeout: 2000
            });
            return false;
        }
    }

    FLUIGC.message.confirm({
        message: 'Executar integração?',
        title: 'Disparo manual',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {
        if (result == true) {
            f_disparaDataset(pDataSet);
        }
    });

}


function f_visualizarLog(pDataSet) {


    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLErros_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    md_errosintegracao = FLUIGC.modal({
        title: 'Erros Integração',
        content: htmlM,
        id: 'fluig-errosintegracao',
        size: 'large',
        actions: [{
            'label': 'Sair',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-errosintegracao').ready(function () {


        loadDataTable('ERROS');
        loadDadosDataTable("ERROS", pDataSet);


    });


}

function f_iniciarPausar(pDataSet, pStatus) {
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'PLAYPAUSE', 'PLAYPAUSE', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('dataset', pDataSet, pDataSet, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('status', pStatus, pStatus, ConstraintType.MUST));
    DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
        success: (data) => {
            if (data.hasOwnProperty("values") && data.values.length > 0) {
                loadDadosDataTable("SYNC");
            }

        },
        error: (err) => {
        },
    });

}




function f_confirmaLeitura(idLog, dastaset) {
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'LIMPA', 'LIMPA', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('id', idLog, idLog, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('dataset', dastaset, dastaset, ConstraintType.MUST));
    DatasetFactory.getDataset("dsk_integracao_velis", null, constraints, null, {
        success: (data) => {
            if (data.hasOwnProperty("values") && data.values.length > 0) {

                md_errosintegracao.remove();
                loadDadosDataTable("SYNC");
            }

        },
        error: (err) => {
        },
    });

}