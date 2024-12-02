var $this = null;
var loadWindow = null;
var localChamado = null;
var md_propostaAdd = null;
var md_propostadisp = null;
var md_Aceites = null;
var md_Servicos = null;
var md_ServicosFoto = null;
var editRow = false;
var wCodItemSelected = null;
var gCodWidget = "wdg_instaladores";
var gWidgetOFF = false;

var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function () {
        $this = this;

        if (!this.isEditMode) {

            //Carrega Título da página
            $('#page_title').html(WCMAPI.getPageTitle());

            // Usuario Logado.
            user_code = WCMAPI.getUserCode();

            //Load do fluig
            loadWindow = FLUIGC.loading(window);
            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 20/01/2023 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable('INSTALACAO');
            loadDsCombo('idstatus_' + $this.instanceId, 'dsk_instaladores', 'codigo', 'descricao', 'indacao', 'STATUS', 'descricao', 'N', 'S', 'S');

            f_getVersao('F');
            setInterval(f_getVersao, 60000);
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],

        },
        global: {
            'dbclick-tbl': ['dblclick_editRow'],
            'click-tbl': ['click_cancelar'],
            'update-row': ['click_updaterow'],
            'remover-row': ['click_removerrow'],
            'order-by': ['click_orderBy'],
        }
    },

    executeAction: function (htmlElement, event) {
    },

    filtrar: function (htmlElement, event) {

        loadDadosDataTable("INSTALACAO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val(), $('#nome_equipe_' + $this.instanceId).val(), $('#idstatus_' + $this.instanceId).val());
    },

    removerrow: function (el, ev) {
        var row = dataTableItemProposta.getRow(dataTableItemProposta.selectedRows()[0]);

        FLUIGC.message.confirm({
            message: 'Remover o Serviço [ ' + row.descricao + ' - ' + row.local + ' ]?',
            title: 'Remover item',
            labelYes: 'Confirma',
            labelNo: 'Cancelar'
        }, function (result, el, ev) {
            if (result == true) {
                dataTableItemProposta.removeRow(dataTableItemProposta.selectedRows()[0]);
            }
        });
    },

    cancelar: function (el, ev) {
        var row = dataTableItemProposta.getRow(dataTableItemProposta.selectedRows()[0]);

        if (editRow == true) {
            if (wCodItemSelected != row.seq) {
                wCodItemSelected = null;
                editRow = false;
                dataTableItemProposta.reload();
            }
        }
    },

    editRow: function (el, ev) {

        try {
            loadWindow.show();

            var row = dataTableItemProposta.getRow(dataTableItemProposta.selectedRows()[0]);
            dataTableItemProposta.updateRow(dataTableItemProposta.selectedRows()[0], row, '.template_datatable_edit');

            editRow = true;
            wCodItemSelected = row.seq;

            $('#datatable-input-proposta').val(row.proposta);
            $('#datatable-input-seq').val(row.seq);
            $('#datatable-input-produto').val(row.produto);
            $('#datatable-input-descricao').val(row.descricao);
            $('#datatable-input-local').val(row.local);

            $('#datatable-input-local').focus();


        } catch (error) {

        } finally {
            loadWindow.hide();
        }

    },

    updaterow: function (el, ev) {

        var editedRow = {
            proposta: $('#datatable-input-proposta').val(),
            seq: $('#datatable-input-seq').val(),
            produto: $('#datatable-input-produto').val(),
            descricao: $('#datatable-input-descricao').val(),
            local: $('#datatable-input-local').val(),
            ts: ''
        };
        dataTableItemProposta.updateRow(dataTableItemProposta.selectedRows()[0], editedRow);
    },

    orderBy: function (htmlElement, event) {
        var order = htmlElement.getAttribute('data-order-by');
        var wIdTable = htmlElement.parentElement.parentElement.parentElement.parentElement.id;
        var wObjTable;

        switch (wIdTable.split('_')[0]) {
            case "idTBLItemProposta":
                dados = dataTableItemProposta.getData();
                wObjTable = dataTableItemProposta;
                break;
            case "idtable":
                dados = dataTable.getData();
                wObjTable = dataTable;
                break;
            case "idTBLPropostas":
                dados = dataTableItem.getData();
                wObjTable = dataTableItem;
                break;
            case "idTBLServico":
                dados = dataTableServico.getData();
                wObjTable = dataTableServico;
                break;
            case "idTBLServicoFoto":
                dados = dataTableServicoFoto.getData();
                wObjTable = dataTableServicoFoto;
                break;
        }


        if (htmlElement.children[1].classList.contains("dropup")) {
            this.orderAscDesc = "ASC";
        } else {
            this.orderAscDesc = "DESC";
        }

        if (htmlElement.children[1].classList.contains("dropup")) {
            //this.orderAscDesc = "ASC";
            dados.sort(function (a, b) {
                var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });
        } else {
            //this.orderAscDesc = "DESC";
            dados.sort(function (a, b) {
                var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                if (a1 == b1) return 0;
                return a1 < b1 ? 1 : -1;
            });
        }

        wObjTable.reload(dados);
        formataTable(wIdTable);

    },

});

function f_editPropostaCell(pIdRegistro, pSeqRegistro) {

    // alert('ID: ' + pIdPorposta + ' Proposta: ' + pNumProposta + ' CLiente: ' + pCliente + ' IdInstalador: ' + pIdInstalador + ' Instalador: ' + pNomInstalador);

    var htmlM = '<div class="row"> ' +
        '   <div class="col-sm-2"> ' +
        '       <label class="control-label" for="txtNome">Proposta</label> ' +
        '       <input type="hidden" class="grp_user" name="md_id_registro_' + $this.instanceId + '" id="md_id_registro_' + $this.instanceId + '" value="' + pIdRegistro + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_seq_registro_' + $this.instanceId + '" id="md_seq_registro_' + $this.instanceId + '" value="' + pSeqRegistro + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_id_proposta_' + $this.instanceId + '" id="md_id_proposta_' + $this.instanceId + '"/> ' +
        '       <h3><label class="control-label" for=""><strong id="md_num_proposta_' + $this.instanceId + '"></strong></label> </h3>' +
        '   </div> ' +
        '   <div class="col-md-5"> ' +
        '       <label class="control-label" for="txtNome">Cliente</label> ' +
        '       <div class="input-group">' +
        '           <h3><label class="control-label" for=""><strong id="md_nom_cliente_' + $this.instanceId + '"></strong></label> </h3>' +
        '       </div> ' +
        '   </div> ' +
        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">Bairro/Cidade</label> ' +
        '       <div class="input-group">' +
        '           <h3><label class="control-label" for=""><strong id="md_bairro_cidade_' + $this.instanceId + '"></strong></label> </h3>' +
        '       </div> ' +
        '   </div> ' +

        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-md-5"> ' +
        '       <label class="control-label" for="txtNome">Consultor</label> ' +
        '       <div class="input-group">' +
        '           <h3><label class="control-label" for=""><strong id="md_nom_consultor_' + $this.instanceId + '"></strong></label> </h3>' +
        '       </div> ' +
        '   </div> ' +

        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">Assinar Termo</label> ' +
        '       <div class="custom-checkbox custom-checkbox-info"> ' +
        '           <input type="checkbox" name="md_indTermo_' + $this.instanceId + '" id="md_indTermo_' + $this.instanceId + '"> ' +
        '               <label for="md_indTermo_' + $this.instanceId + '">Sim</label> ' +
        '       </div> ' +
        '   </div> ' +
        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">Nota Emitida</label> ' +
        '       <div class="input-group">' +
        '           <h3><label class="control-label" for=""><strong id="md_nota_emitida_' + $this.instanceId + '"></strong></label> </h3>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Instalador</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_instalador" name="cod_instalador_' + $this.instanceId + '" id="cod_instalador_' + $this.instanceId + '" oldvalue=""/>' +
        '           <input type="text" class="form-control grp_instalador valida" name="nome_instalador_' + $this.instanceId + '" id="nome_instalador_' + $this.instanceId + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_instalador\').val(\'\')"></span>' +
        '           <span id="bt_instalador" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +

        '   <div class="col-md-6"> ' +
        '       <div class="col-md-6"> ' +
        '           <label class="control-label" for="exampleTag">Data Início</label> ' +
        '           <input type="date" class="form-control" id="dt_ini_' + $this.instanceId + '" name="dt_ini_' + $this.instanceId + '" /> ' +
        '       </div> ' +
        '       <div class="col-md-6"> ' +
        '           <label class="control-label" for="exampleTag">Data Fim</label> ' +
        '           <input type="date" class="form-control" id="dt_fim_' + $this.instanceId + '" name="dt_fim_' + $this.instanceId + '" /> ' +
        '       </div> ' +
        '   </div> ' +

        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Responsável</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nom_responsavel_' + $this.instanceId + '" id="md_nom_responsavel_' + $this.instanceId + '" maxlength="25" valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">WhatsAPP</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_num_whats_' + $this.instanceId + '" id="md_num_whats_' + $this.instanceId + '"  maxlength="25" placeholder="(00) 00000-0000" data-contato valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Status</label> ' +
        '           <input type="hidden"  name="md_idstatus_atual_' + $this.instanceId + '" id="md_idstatus_atual_' + $this.instanceId + '"/>' +
        '       <select class="form-control" id="md_idstatus_' + $this.instanceId + '" name="md_idstatus_' + $this.instanceId + '"></select> ' +
        '   </div> ' +
        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Observação</label> ' +
        '       <textarea class="form-control grp_user valida" style="resize: none" id="md_observacao_' + $this.instanceId + '" name="md_observacao_' + $this.instanceId + '" rows="3" cols="95"></textarea > ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '   &nbsp; ' +
        '   </div> ' +
        '</div> ' +

        '<div class="row"> ' +
        '   <div class="col-md-12" align="center"> ' +
        '       <div class="panel panel-success class"> ' +
        '           <div class="panel-heading fs-txt-center"> ' +
        '               <table width="100%"> ' +
        '                   <tr> ' +
        '                       <td width="100%" align="right"><button type="button" class="fluigicon fluigicon-plus-sign fluigicon-sm" onclick="f_incluirItemN();"></button></td> ' +
        '                   </tr> ' +
        '               </table> ' +
        '           </div> ' +
        '           <div class="panel-body"> ' +
        '               <div style="position:relative;overflow:hidden; height:243px;overflow-y: scroll"><div id="idTBLItemProposta_' + $this.instanceId + '" data-dbclick-tbl data-click-tbl></div></div>' +
        '           </div> ' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-12" style="display:flex; justify-content: flex-end"> ' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-danger btn-lg btn-block" title=Cancelar proposta" onclick="md_propostaAdd.remove();"><i class="flaticon flaticon-close icon-xs" aria-hidden="true"></i> Cancelar</button>' +
        '       </div>' +
        '       <div class="col-sd-2">' +
        '           <button type="button" id="bt_confirmar" class="btn btn-success btn-lg btn-block" title="Confirma propostar" onclick="f_incluirRegistro();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Confirmar</button>' +
        '       </div>' +
        '   </div> ' +

        '</div>';


    md_propostaAdd = FLUIGC.modal({
        title: 'Instalação',
        content: htmlM,
        id: 'fluig-propostaAdd',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-propostaAdd').ready(function () {
        // Contato
        $("[data-contato]").mask("(99) 99999-999?9");
        $("[data-contato]").on('change', function () {
            if ($(this).val().length <= 14) {
                $(this).mask("(99) 9999-9999?9");
            } else {
                $(this).mask("(99) 99999-999?9");
            }
        });

        loadWindow.show();

        loadDsCombo('md_idstatus_' + $this.instanceId, 'dsk_instaladores', 'codigo', 'descricao', 'indacao,interacao', 'STATUS,M', 'descricao', 'N', 'S', 'S');;
        loadDataTable('ITEMPROP');

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'INSTALACAO', 'INSTALACAO', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('uf', '', '', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('cidade', '', '', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('equipe', '', '', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('status', '', '', ConstraintType.MUST));

        constraints.push(DatasetFactory.createConstraint('idregistro', pIdRegistro, pIdRegistro, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('sequencia', pSeqRegistro, pSeqRegistro, ConstraintType.MUST));


        DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    var regs = new Array();
                    for (var i = 0; i < data.values.length; i++) {
                        var wNotaFiscal = '';
                        if (data.values[i]["notafiscal"] != 'null') {
                            wNotaFiscal = f_formatData(data.values[i]["notafiscal"]);
                        }

                        $('#md_id_proposta_' + $this.instanceId).val(data.values[i]["idproposta"]);
                        $('#md_num_proposta_' + $this.instanceId).text(data.values[i]["proposta"]);
                        $('#md_nom_cliente_' + $this.instanceId).text(data.values[i]["cliente"]);
                        $('#cod_instalador_' + $this.instanceId).attr('oldvalue', data.values[i]["idinstalador"] != 'null' ? data.values[i]["idinstalador"] : '');
                        $('#cod_instalador_' + $this.instanceId).val(data.values[i]["idinstalador"] != 'null' ? data.values[i]["idinstalador"] : '');
                        $('#nome_instalador_' + $this.instanceId).val(data.values[i]["instalador"] != 'null' ? data.values[i]["instalador"] : '');
                        $('#md_num_whats_' + $this.instanceId).val(data.values[i]["telefone"]);
                        $('#md_bairro_cidade_' + $this.instanceId).text(data.values[i]["bairro"] + "/" + data.values[i]["cidade"]);
                        $('#md_nom_consultor_' + $this.instanceId).text(data.values[i]["consultor"]);
                        $('#md_nota_emitida_' + $this.instanceId).text(wNotaFiscal);
                        $('#dt_ini_' + $this.instanceId).val(data.values[i]["datainicio"]);
                        $('#dt_fim_' + $this.instanceId).val(data.values[i]["datafim"]);
                        $('#md_nom_responsavel_' + $this.instanceId).val(data.values[i]["responsavel"] != 'null' ? data.values[i]["responsavel"] : '');
                        $('#md_num_whats_' + $this.instanceId).val(data.values[i]["telefone"] != 'null' ? data.values[i]["telefone"] : '');


                        $('#md_indTermo_' + $this.instanceId).prop("checked", ((data.values[i]["termo"] == 'S' ? true : false)));

                        $('#md_idstatus_' + $this.instanceId + ' option[value="' + data.values[i]["idsituacao"] + '"]').attr("selected", "selected");
                        $('#md_idstatus_atual_' + $this.instanceId).val(data.values[i]["idsituacao"]);
                        $('#md_observacao_' + $this.instanceId).val((data.values[i]["observacao"] != 'null' ? data.values[i]["observacao"] : ''));

                        var wItens = JSON.parse(data.values[i]["itens"]);
                        var regs = new Array();
                        for (var x = 0; x < wItens.length; x++) {
                            if (wItens[x].local.trim() != 'TERMO') {
                                var strIcone = '';

                                if (wItens[x].situacao != 'F') {
                                    strIcone += "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Serviço' data-remover-row></i>";
                                }

                                var datatableRow = {
                                    proposta: wItens[x].proposta,
                                    seq: wItens[x].seq,
                                    produto: wItens[x].produto,
                                    descricao: wItens[x].descricao,
                                    local: wItens[x].local,
                                    ts: strIcone
                                }
                                regs.push(datatableRow);
                            }
                        }
                        dataTableItemProposta.reload(regs);

                        var widStatusAtual = f_getStats($('#md_idstatus_atual_' + $this.instanceId).val());
                        if (widStatusAtual.ordem >= 9) {
                            $("#bt_confirmar").css("display", "none");
                        }
                    }
                }
                loadWindow.hide();
            },
            error: (err) => {
                loadWindow.hide();
            },
        });

    });
}

function f_addProposta(cpCodPefil, pNomePerfil) {

    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLPropostas_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    md_propostadisp = FLUIGC.modal({
        title: 'Propostas Disponíveis',
        content: htmlM,
        id: 'fluig-propostadisp',
        size: 'full',
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

    $('#fluig-propostadisp').ready(function () {


        if ($('#cod_cidade_' + $this.instanceId).val() == '' && $('#cod_UF_' + $this.instanceId).val() == '' && $('#nome_equipe_' + $this.instanceId).val() == '') {
            FLUIGC.toast({
                message: 'Selecione um dos filtros UF e Cidade ou Equipe.',
                type: 'danger'
            });
            md_propostadisp.remove();
            return false;
        }


        if ($('#cod_cidade_' + $this.instanceId).val() != '' && $('#cod_UF_' + $this.instanceId).val() != '' && $('#nome_equipe_' + $this.instanceId).val() != '') {
            FLUIGC.toast({
                message: 'Deve ser selecionado apenas um dos fitros, UF e Cidade ou Equipe.',
                type: 'danger'
            });
            md_propostadisp.remove();
            return false;
        }


        loadDataTable('PROPOSTA');
        loadDadosDataTable("PROPOSTA", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val(), $('#nome_equipe_' + $this.instanceId).val());


    });

}

function f_viewServico(idregistro, numSeq) {

    var htmlM = ' ' +
        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLServico_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    md_Servicos = FLUIGC.modal({
        title: 'Serviços Executados',
        content: htmlM,
        id: 'fluig-md_Servicos',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_Servicos').ready(function () {
        // Contato

        loadDataTable('SERVICOS');
        loadDadosDataTable('SERVICOS', idregistro, numSeq);

    });
}

function f_viewAceite(idregistro, numSeq, datAceite) {

    var htmlM = ' ' +
        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       Data Aceite: ' + datAceite + ' ' +
        '   </div> ' +
        '</div> ' +
        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLAceite_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    md_Aceites = FLUIGC.modal({
        title: 'Identificador do Aceite',
        content: htmlM,
        id: 'fluig-md_Aceites',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_Aceites').ready(function () {
        // Contato

        loadDataTable('ACEITE');
        loadDadosDataTable('ACEITE', idregistro, numSeq);

    });
}

function f_deleteRegistro(idRegistro, idSeq) {

    FLUIGC.message.confirm({
        message: 'Confirma a exclusão dessa Instalacão?',
        title: 'Excluir instalação',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {
            FLUIGC.toast({
                message: 'Removendo proposta: ' + idproposta,
                type: 'success'
            });

            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'DEL', 'DEL', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idregistro', idRegistro, idRegistro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('sequencia', idSeq, idSeq, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

            if (dataset.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_instaladores";
            } else {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {
                            loadDadosDataTable("INSTALACAO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataset.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                        loadWindow.hide();
                    }
                }
            }

        } else {
            FLUIGC.toast({
                message: 'Não aprovou a remoção da proposta: ' + idproposta,
                type: 'danger'
            });
        }

    });
}

function f_viewServicoFoto(idRegistro, idseq, idSeqItem, pIdProduto) {


    var htmlM = ' ' +
        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLServicoFoto_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    md_ServicosFoto = FLUIGC.modal({
        title: 'Fotos do serviço',
        content: htmlM,
        id: 'fluig-md_ServicosFoto',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_ServicosFoto').ready(function () {
        // Contato

        loadDataTable('FOTOS');
        loadDadosDataTable('FOTOS', idRegistro, idseq, idSeqItem, pIdProduto);

    });
}

function f_enviarPagamento(idRegistro, idSeq) {

    FLUIGC.message.confirm({
        message: 'Confirma o envio para pagamento?',
        title: 'Enviar para Pagamento',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {

            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'PAG', 'PAG', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idregistro', idRegistro, idRegistro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('sequencia', idSeq, idSeq, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset("dsk_instaladores", null, constraints, null);

            if (dataset.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_instaladores";
            } else {
                for (var i = 0; i < dataset.values.length; i++) {
                    if (dataset.values[i]["STATUS"] != undefined) {
                        if (dataset.values[i]["STATUS"] == "OK") {
                            loadDadosDataTable("INSTALACAO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val(), $('#nome_equipe_' + $this.instanceId).val(), $('#idstatus_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataset.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                        loadWindow.hide();
                    }
                }
            }

            FLUIGC.toast({
                message: 'Enviado.....',
                type: 'success'
            });



        }

    });
}