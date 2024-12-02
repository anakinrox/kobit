var $this = null;
var loadWindow = null;
var localChamado = null;

var MyWidget = SuperWidget.extend({
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
            // loadDataTable('usuarios');
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-removerMeta': ['click_removerMeta'],
            'order-by': ['click_orderBy'],
        }
    },

    filtrar: function (htmlElement, event) {
        var wParametro = $('#indParametro_' + $this.instanceId).val();

        if (wParametro == '' || wParametro == null) {
            FLUIGC.toast({
                message: 'Campo Parâmetro deve ser selecionado primeiro.',
                type: 'danger'
            });
            return false;
        }

        loadDadosDataTable(wParametro);
        
    },

    orderBy: function (htmlElement, event) {
        var order = htmlElement.getAttribute('data-order-by');

        dados = dataTable.getData();

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

        dataTable.reload(dados);
    },

    removerMeta: function () {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        FLUIGC.message.confirm({
            message: 'Excluir a meta do usuário "' + selected.nom_usuario + '" selecionada?',
            title: 'Remover Meta',
            labelYes: 'Sim',
            labelNo: 'Não'
        }, function (result, el, ev) {

            if (result == true) {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('ind_acao', 'R', 'R', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('matricula', selected.matricula, selected.matricula, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('usercrm', selected.user_crm, selected.user_crm, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('user_registro', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
                var metas = DatasetFactory.getDataset("dts_metas", null, constraints, null);

                if (metas.rowsCount == 0) {
                    throw "Problemas ao remover registro do dataSet: dts_metas";
                } else {
                    var regs = new Array();
                    for (var i = 0; i < metas.values.length; i++) {
                        if (metas.values[i]["STATUS"] != undefined) {
                            if (metas.values[i]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Meta removida com sucesso.',
                                    type: 'success'
                                });
                                loadDadosDataTable('default');
                            } else {
                                FLUIGC.toast({
                                    message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                    type: 'danger'
                                });
                            }
                        }
                    }
                }
            }
        });
    },
    executeAction: function (htmlElement, event) {
    }
});



function f_addTCadastro(pAcaoBanco, pCodigo, pDescricao) {
    var wCodigo = "";
    var descricao = "";

    if (pCodigo != undefined) {
        wCodigo = pCodigo;
        descricao = pDescricao;
    }

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Tipo</label> ' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_cadastro' + $this.instanceId + '" id="md_codigo_cadastro' + $this.instanceId + '" value="' + wCodigo + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nomeCadastro_' + $this.instanceId + '" id="md_nomeCadastro_' + $this.instanceId + '" valida="field" value="' + descricao + '"/> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_tipoCadastro = FLUIGC.modal({
        title: 'Tipo Cadastro',
        content: htmlM,
        id: 'fluig-tipoCadastro',
        size: 'small',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-tipoCadastro').on('click', '[data-confirma-modal]', function (ev) {
        var wAcaoBanco = $('#md_indacao_' + $this.instanceId).val();
        var wCodigo = $('#md_codigo_cadastro' + $this.instanceId).val();
        var wDescricao = $('#md_nomeCadastro_' + $this.instanceId).val();

        if ((wDescricao == "")) {
            FLUIGC.toast({
                message: 'O campo "TIPO" deve estar preenchido.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDTIPO', 'ADDTIPO', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('acaobanco', wAcaoBanco, wAcaoBanco, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codigocadastro', wCodigo, wCodigo, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomecadastro', wDescricao, wDescricao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_tipoCadastro.remove();
    });
}

function f_addParametros(pAcaoBanco, pCodigo, pDescricao, pCodTipo, pNomTipo, pTipoDados, pValorPadrao) {
    var wCodigo = "";
    var wDescricao = "";
    var wTipoDados = "";
    var wCodTipo = "";
    var wNomeTipo = "";
    var wValor = "";

    if (pCodigo != undefined) {
        wCodigo = pCodigo;
        wDescricao = pDescricao;
        wCodTipo = pCodTipo;
        wNomeTipo = pNomTipo;
        wTipoDados = pTipoDados;
        wValor = pValorPadrao;
    }


    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Tipo Cadastro</label>' +
        '       <div class="input-group">' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '           <input type="hidden" class="grp_tipocadastro" name="cod_tipocadastro_' + $this.instanceId + '" id="cod_tipocadastro_' + $this.instanceId + '" value="' + wCodTipo + '"/>' +
        '           <input type="text" class="form-control grp_tipocadastro valida" name="nome_tipocadastro_' + $this.instanceId + '" id="nome_tipocadastro_' + $this.instanceId + '" value="' + wNomeTipo + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_tipocadastro\').val(\'\')"></span>' +
        '           <span id="bt_tipocadastro" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-md-8"> ' +
        '       <label class="control-label" for="txtNome">Descrição</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigoParametro_' + $this.instanceId + '" id="md_codigoParametro_' + $this.instanceId + '" value="' + wCodigo + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nomeParametro_' + $this.instanceId + '" id="md_nomeParametro_' + $this.instanceId + '" valida="field" value="' + wDescricao + '"/> ' +
        '   </div> ' +
        '</div>' +
    
        '<div class="row"> ' +
        '   <div class="col-md-5"> ' +
        '       <label class="control-label" for="tipo_dados_' + $this.instanceId + '">Tipo de Dados</label> ' +
        '       <div class="input-group"> ' +
        '           <select id="tipo_dados_' + $this.instanceId + '" name="tipo_dados_' + $this.instanceId + '" class="form-control grp_user valida"> ' +
        '               <option value="" selected> <<< Escolha o Tipo de dados >>> </option> ' +
        '               <option value="S">String</option> ' +
        '               <option value="D">Date</option> ' +
        '               <option value="N">Number</option> ' +
        '               <option value="F">FLoat</option> ' +
        '               <option value="T">Time</option> ' +
        '           </select> ' +
        '       </div> ' +
        '   </div> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Valor Padrão</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="valor_padrao_' + $this.instanceId + '" id="valor_padrao_' + $this.instanceId + '" value="' + wValor + '"> ' +
        '   </div> ' +
        '</div>' +


        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_parametros = FLUIGC.modal({
        title: 'Parâmetros',
        content: htmlM,
        id: 'fluig-parametros',
        size: 'large',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-parametros').ready(function () {
        if (wTipoDados != '') { $('#tipo_dados_' + $this.instanceId).val(wTipoDados); }
    });

    $('#fluig-parametros').on('click', '[data-confirma-modal]', function (ev) {
        var wAcaoBanco = $('#md_indacao_' + $this.instanceId).val();
        var wCodParametro = $('#md_codigoParametro_' + $this.instanceId).val(); 
        var codTipoCadastro = $('#cod_tipocadastro_' + $this.instanceId).val();
        var nomeParametro = $('#md_nomeParametro_' + $this.instanceId).val();
        var tipoDados = $('#tipo_dados_' + $this.instanceId).val();
        var valorPadrao = $('#valor_padrao_' + $this.instanceId).val();

        if (codTipoCadastro == "" || nomeParametro == "" || tipoDados == "" || tipoDados == "") {
            FLUIGC.toast({
                message: 'Os campos "Tipo Cadastro, Descrição, Tipo de Dados e Valor Padrão" devem estar preenchidos.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();
            
            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDPARAMETRO', 'ADDPARAMETRO', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('acaobanco', wAcaoBanco, wAcaoBanco, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codigocadastro', wCodParametro, wCodParametro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('tipocadastro', codTipoCadastro, codTipoCadastro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomeparametro', nomeParametro, nomeParametro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('tipodados', tipoDados, tipoDados, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('valorpadrao', valorPadrao, valorPadrao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_parametros.remove();
    });
}

function f_addNivel(pAcaoBanco, pCodigo, pDescricao) {
    var wCodigo = "";
    var descricao = "";    

    if (pCodigo != undefined) {
        wCodigo = pCodigo;
        descricao = pDescricao;
    }


    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Nivel</label> ' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_nivel_' + $this.instanceId + '" id="md_codigo_nivel_' + $this.instanceId + '" value="' + wCodigo + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nome_nivel_' + $this.instanceId + '" id="md_nome_nivel_' + $this.instanceId + '" valida="field" value="' + descricao + '"/> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_niveis = FLUIGC.modal({
        title: 'Niveis',
        content: htmlM,
        id: 'fluig-niveis',
        size: 'small',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-niveis').on('click', '[data-confirma-modal]', function (ev) {
        var wAcaoBanco = $('#md_indacao_' + $this.instanceId).val();
        var wCodigo = $('#md_codigo_nivel_' + $this.instanceId).val();
        var wDescricao = $('#md_nome_nivel_' + $this.instanceId).val();

        if ((wDescricao == "")) {
            FLUIGC.toast({
                message: 'O campo "Nivel" deve estar preenchido.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDNIVEL', 'ADDNIVEL', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('acaobanco', wAcaoBanco, wAcaoBanco, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codigocadastro', wCodigo, wCodigo, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomecadastro', wDescricao, wDescricao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_niveis.remove();
    });
}

function f_addCategoria() {

    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Categoria</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_categoria_' + $this.instanceId + '" id="md_codigo_categoria_' + $this.instanceId + '" value="' + wCodigo + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nome_categoria_' + $this.instanceId + '" id="md_nome_categoria_' + $this.instanceId + '" valida="field" value="' + descricao + '"/> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_categoria = FLUIGC.modal({
        title: 'Categorias',
        content: htmlM,
        id: 'fluig-categoria',
        size: 'small',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-categoria').on('click', '[data-confirma-modal]', function (ev) {
        descricao = $('#md_nome_categoria_' + $this.instanceId).val();

        if ((descricao == "")) {
            FLUIGC.toast({
                message: 'O campo "Categoria" deve estar preenchido.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDCATEGORIA', 'ADDCATEGORIA', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomecadastro', descricao, descricao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_categoria.remove();
    });
}

function f_edtCategoriaItem(pAcaoBanco, pCodParametro, pNomeParametro, pTipoDados, pValorPadrao) {

   
    $('#md_indacao_' + $this.instanceId).val(pAcaoBanco);
    $('#cod_parametro_' + $this.instanceId).val(pCodParametro);
    $('#nome_parametros_' + $this.instanceId).val(pNomeParametro);
    $('#tipo_dados_' + $this.instanceId).val(pTipoDados);
    $('#valor_dados_' + $this.instanceId).val(pValorPadrao)

}

function f_addCategoriaItem(pAcaoBanco, cpCodCategoria, pNomeCategoria ) {

    var wTipoDados = "";
    var wCodParametro = "";
    var wNomePatrametro = "";
    var wTipoDados = "";
    var wValor = '';

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '       <label class="control-label" for="txtNome">Categoria</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_categoria_' + $this.instanceId + '" id="md_codigo_categoria_' + $this.instanceId + '" value="' + cpCodCategoria + '"/> ' +
        '       <label class="control-label" for=""><strong>' + pNomeCategoria +'</strong></label> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Parâmetro</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_parametro" name="cod_parametro_' + $this.instanceId + '" id="cod_parametro_' + $this.instanceId + '" value="' + wCodParametro + '"/>' +
        '           <input type="text" class="form-control grp_parametro valida" name="nome_parametros_' + $this.instanceId + '" id="nome_parametros_' + $this.instanceId + '" valida="field" value="' + wNomePatrametro + '" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_parametro\').val(\'\')"></span>' +
        '           <span id="bt_parametro" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +

        '   <div class="col-md-2"> ' +
        '       <label class="control-label" for="txtNome">Tipo dados</label>' +
        '           <input type="text" class="form-control valida" name="tipo_dados_' + $this.instanceId + '" id="tipo_dados_' + $this.instanceId + '" valida="field" value="' + wTipoDados + '" readonly/>' +
        '   </div> ' +

        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">Valor</label>' +
        '        <input type="text" class="form-control valida" name="valor_dados_' + $this.instanceId + '" id="valor_dados_' + $this.instanceId + '" valida="field" value="' + wValor + '"/>' +
        '   </div> ' +    
        
        '   <div class="col-md-3"> ' +
        '       <label class="textobranco" for="txtNome">_</label>' +
        '       <button type="button" class="btn btn-primary btn-lg btn-block" title="Parâmetros" onclick="f_incluirItemCategoria();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Adicionar</button>' +
        '   </div> ' +            

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLCatagoriaitem_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';    


    var md_categoriaitem = FLUIGC.modal({
        title: 'Incluir Parâmetros',
        content: htmlM,
        id: 'fluig-categoriaitem',
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

    $('#fluig-categoriaitem').ready(function () {
        // alert('Executou');
        loadDataTable('CATITEM');
        loadDadosDataTable('CATITEM', $('#md_codigo_categoria_' + $this.instanceId).val());
    });

}

function f_addPerfil(pAcaoBanco, pValor) {

    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '       <label class="control-label" for="txtNome">Perfil</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_perfil' + $this.instanceId + '" id="md_codigo_perfil' + $this.instanceId + '" value="' + wCodigo + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nome_perfil_' + $this.instanceId + '" id="md_nome_perfil_' + $this.instanceId + '" valida="field" value="' + descricao + '"/> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_perfil = FLUIGC.modal({
        title: 'Perfil',
        content: htmlM,
        id: 'fluig-perfil',
        size: 'small',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-perfil').on('click', '[data-confirma-modal]', function (ev) {
        descricao = $('#md_nome_perfil_' + $this.instanceId).val();

        if ((descricao == "")) {
            FLUIGC.toast({
                message: 'O campo "Perfil" deve estar preenchido.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDPERFIL', 'ADDPERFIL', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomecadastro', descricao, descricao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_perfil.remove();
    });
}

function f_addPerfilCategoria(cpCodPefil, pNomePerfil) {

    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Perfil</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_perfil_' + $this.instanceId + '" id="md_codigo_perfil_' + $this.instanceId + '" value="' + cpCodPefil + '"/> ' +
        '       <h2><label class="control-label" for=""><strong>' + pNomePerfil + '</strong></label> </h2>' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Categoria</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_nivel" name="indTabela_' + $this.instanceId + '" id="indTabela_' + $this.instanceId + '" value="perfilcategoria"/>' +
        '           <input type="hidden" class="grp_categoria" name="cod_categoria_' + $this.instanceId + '" id="cod_categoria_' + $this.instanceId + '"/>' +
        '           <input type="text" class="form-control grp_categoria valida" name="nome_categoria_' + $this.instanceId + '" id="nome_categoria_' + $this.instanceId + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_categoria\').val(\'\')"></span>' +
        '           <span id="bt_categoria" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +

        '   <div class="col-md-3"> ' +
        '       <label class="textobranco" for="txtNome">_</label>' +
        '       <button type="button" class="btn btn-primary btn-lg btn-block" title="Carregar dados" onclick="loadDadosDataTable(\'PECATDISP\');"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Listar</button>' +
        '   </div> ' +

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLPerfiCategoriaItemDisp_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '   <div class="col-md-6" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLPerfilCategoriaItemSelect_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    var md_perfilcategoria = FLUIGC.modal({
        title: 'Perfil Categorias',
        content: htmlM,
        id: 'fluig-perfilcategoria',
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

    $('#fluig-perfilcategoria').ready(function () {
        // alert('Executou');
        loadDataTable('PECATDISP');
        loadDataTable('PECATSET');
        loadDadosDataTable('PECATSET');
        // loadDadosDataTable('CATITEM', $('#md_codigo_categoria_' + $this.instanceId).val());
    });

}

function f_addPerfilNivelCategoria(cpCodPefil, pNomePerfil) {

    var wCodigo = "";
    var descricao = "";

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-12"> ' +
        '       <label class="control-label" for="txtNome">Niveis Perfil</label> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_perfil_' + $this.instanceId + '" id="md_codigo_perfil_' + $this.instanceId + '" value="' + cpCodPefil + '"/> ' +
        '       <h2><label class="control-label" for=""><strong>' + pNomePerfil + '</strong></label> </h2>' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Nivel</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_nivel" name="indTabela_' + $this.instanceId + '" id="indTabela_' + $this.instanceId + '" value="perfilnivelcategoria"/>' +
        '           <input type="hidden" class="grp_nivel" name="cod_nivel_' + $this.instanceId + '" id="cod_nivel_' + $this.instanceId + '"/>' +
        '           <input type="text" class="form-control grp_nivel valida" name="nome_nivel_' + $this.instanceId + '" id="nome_nivel_' + $this.instanceId + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_nivel\').val(\'\')"></span>' +
        '           <span id="bt_nivel" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +        
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Categoria</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_categoria" name="cod_categoria_' + $this.instanceId + '" id="cod_categoria_' + $this.instanceId + '"/>' +
        '           <input type="text" class="form-control grp_categoria valida" name="nome_categoria_' + $this.instanceId + '" id="nome_categoria_' + $this.instanceId + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_categoria\').val(\'\')"></span>' +
        '           <span id="bt_categoria" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +

        '   <div class="col-md-3"> ' +
        '       <label class="textobranco" for="txtNome">_</label>' +
        '       <button type="button" class="btn btn-primary btn-lg btn-block" title="Carregar dados" onclick="loadDadosDataTable(\'PECATDISP\');"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Listar</button>' +
        '   </div> ' +

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLPerfiCategoriaItemDisp_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '   <div class="col-md-6" align="center"> ' +
        '       <div class="panel-body"><div id="idTBLPerfilCategoriaItemSelect_' + $this.instanceId + '"></div></div>' +
        '   </div> ' +
        '</div>';


    var md_perfilnivelcategoria = FLUIGC.modal({
        title: 'Perfil Categorias por Nível',
        content: htmlM,
        id: 'fluig-perfilnivelcategoria',
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

    $('#fluig-perfilnivelcategoria').ready(function () {
        loadDataTable('PECATDISP');
        loadDataTable('PECATSET');

        loadDadosDataTable('PECATSET');
    });

}

function f_editParametro(pIndAcao, pCodPerfil, pCodNivel, pCodCategoria, pCodParametro, pDescParametro, pTipoDados, pValorParametro) {

    var wValor = "";

    if (pValorParametro != undefined) { wValor = pValorParametro}

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-3"> ' +
        '       <label class="control-label" for="txtNome">Parâmetro</label> ' +
        '       <input type="hidden" class="grp_user" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pIndAcao + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_parametro_' + $this.instanceId + '" id="md_codigo_parametro_' + $this.instanceId + '" value="' + pCodParametro + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_categoria_' + $this.instanceId + '" id="md_codigo_categoria_' + $this.instanceId + '" value="' + pCodCategoria + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_perfil_' + $this.instanceId + '" id="md_codigo_perfil_' + $this.instanceId + '" value="' + pCodPerfil + '"/> ' +
        '       <input type="hidden" class="grp_user" name="md_codigo_nivel_' + $this.instanceId + '" id="md_codigo_nivel_' + $this.instanceId + '" value="' + pCodNivel + '"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nome_categoria_' + $this.instanceId + '" id="md_nome_categoria_' + $this.instanceId + '" valida="field" value="' + pDescParametro + '" readonly/> ' +
        '   </div> ' +
        '   <div class="col-md-2"> ' +
        '       <label class="control-label" for="txtNome">Tipo Dados</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_tipo_dados_' + $this.instanceId + '" id="md_tipo_dados_' + $this.instanceId + '" valida="field" value="' + pTipoDados + '" readonly/> ' +
        '   </div> ' +  
        '   <div class="col-md-5"> ' +
        '       <label class="control-label" for="txtNome">Valor</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_valor_dados_' + $this.instanceId + '" id="md_valor_dados_' + $this.instanceId + '" valida="field"  value="' + wValor  + '"/> ' +
        '   </div> ' +        

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_editParametro = FLUIGC.modal({
        title: 'Dados do Parâmetro',
        content: htmlM,
        id: 'fluig-editParametro',
        size: 'large',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-editParametro').on('click', '[data-confirma-modal]', function (ev) {
        var wCodAcao = $('#md_indacao_' + $this.instanceId).val();
        var wCodPerfil = $('#md_codigo_perfil_' + $this.instanceId).val();
        var wCodCategoria = $('#md_codigo_categoria_' + $this.instanceId).val();
        var wCodParametro = $('#md_codigo_parametro_' + $this.instanceId).val();
        var wCodNivel = $('#md_codigo_nivel_' + $this.instanceId).val();
        var wValor = $('#md_valor_dados_' + $this.instanceId).val();

        f_incluirCategoriaPerfil(wCodAcao, wCodPerfil, wCodNivel, wCodCategoria, wCodParametro, wValor)

        // return true;

        // descricao = $('#md_nome_categoria_' + $this.instanceId).val();

        // if ((descricao == "")) {
        //     FLUIGC.toast({
        //         message: 'O campo "Categoria" deve estar preenchido.',
        //         type: 'danger'
        //     });
        //     return false;
        // }


        // try {
        //     var constraints = new Array();
        //     constraints.push(DatasetFactory.createConstraint('indacao', 'ADDCATEGORIA', 'ADDCATEGORIA', ConstraintType.MUST));
        //     constraints.push(DatasetFactory.createConstraint('nomecadastro', descricao, descricao, ConstraintType.MUST));
        //     var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

        //     if (dataSet.rowsCount == 0) {
        //         throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
        //     } else {
        //         var regs = new Array();
        //         for (var i = 0; i < dataSet.values.length; i++) {
        //             if (dataSet.values[i]["STATUS"] != undefined) {
        //                 if (dataSet.values[i]["STATUS"] == "OK") {
        //                     FLUIGC.toast({
        //                         message: 'Registro Incluida/Atualizada com sucesso.',
        //                         type: 'success'
        //                     });
        //                     loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
        //                 } else {
        //                     FLUIGC.toast({
        //                         message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
        //                         type: 'danger'
        //                     });
        //                 }
        //             }
        //         }
        //     }
        // } catch (error) {
        //     console.log('Erro: ' + error);
        // }

        md_editParametro.remove();
    });
}

function f_addUsuario(pAcaoBanco, pCodigo, pDescricao, pCodTipo, pNomTipo, pTipoDados, pValorPadrao) {
    var wCodigo = "";
    var wDescricao = "";
    var wTipoDados = "";
    var wCodTipo = "";
    var wNomeTipo = "";
    var wValor = "";

    if (pCodigo != undefined) {
        wCodigo = pCodigo;
        wDescricao = pDescricao;
        wCodTipo = pCodTipo;
        wNomeTipo = pNomTipo;
        wTipoDados = pTipoDados;
        wValor = pValorPadrao;
    }


    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-10"> ' +
        '       <label class="control-label" for="txtNome">Usuário</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="" name="md_indacao_' + $this.instanceId + '" id="md_indacao_' + $this.instanceId + '" value="' + pAcaoBanco + '"/> ' +
        '           <input type="hidden" class="grp_user" name="cod_usuario_' + $this.instanceId + '" id="cod_usuario_' + $this.instanceId + '" value="' + wCodTipo + '"/>' +
        '           <input type="text" class="form-control grp_user valida" name="nome_usuario_' + $this.instanceId + '" id="nome_usuario_' + $this.instanceId + '" value="' + wNomeTipo + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_user\').val(\'\')"></span>' +
        '           <span id="bt_usuario" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-md-10"> ' +
        '       <label class="control-label" for="txtNome">Perfil</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_perfil" name="cod_perfil_' + $this.instanceId + '" id="cod_perfil_' + $this.instanceId + '" value="' + wCodTipo + '"/>' +
        '           <input type="text" class="form-control grp_perfil valida" name="nome_perfil_' + $this.instanceId + '" id="nome_perfil_' + $this.instanceId + '" value="' + wNomeTipo + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_perfil\').val(\'\')"></span>' +
        '           <span id="bt_perfil" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-10"> ' +
        '       <label class="control-label" for="txtNome">Nível</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_nivel" name="cod_nivel_' + $this.instanceId + '" id="cod_nivel_' + $this.instanceId + '" value="' + wCodTipo + '"/>' +
        '           <input type="text" class="form-control grp_nivel valida" name="nome_nivel_' + $this.instanceId + '" id="nome_nivel_' + $this.instanceId + '" value="' + wNomeTipo + '" valida="field" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_nivel\').val(\'\')"></span>' +
        '           <span id="bt_nivelU" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +        

        '<div class="row"> ' +
        '   <div class="col-sm-12" align="center"> ' +
        '       &nbsp;' +
        '   </div> ' +
        '</div>';


    var md_usuarios = FLUIGC.modal({
        title: 'Usuários',
        content: htmlM,
        id: 'fluig-usuarios',
        size: 'small',
        actions: [{
            'label': 'Salvar',
            'bind': 'data-confirma-modal',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-usuarios').ready(function () {
        // if (wTipoDados != '') { $('#tipo_dados_' + $this.instanceId).val(wTipoDados); }
    });

    $('#fluig-usuarios').on('click', '[data-confirma-modal]', function (ev) {
        var wAcaoBanco = $('#md_indacao_' + $this.instanceId).val();
        var wCodParametro = $('#md_codigoParametro_' + $this.instanceId).val();
        var codTipoCadastro = $('#cod_tipocadastro_' + $this.instanceId).val();
        var nomeParametro = $('#md_nomeParametro_' + $this.instanceId).val();
        var tipoDados = $('#tipo_dados_' + $this.instanceId).val();
        var valorPadrao = $('#valor_padrao_' + $this.instanceId).val();

        if (codTipoCadastro == "" || nomeParametro == "" || tipoDados == "" || tipoDados == "") {
            FLUIGC.toast({
                message: 'Os campos "Tipo Cadastro, Descrição, Tipo de Dados e Valor Padrão" devem estar preenchidos.',
                type: 'danger'
            });
            return false;
        }


        try {
            var constraints = new Array();

            constraints.push(DatasetFactory.createConstraint('indacao', 'ADDPARAMETRO', 'ADDPARAMETRO', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('acaobanco', wAcaoBanco, wAcaoBanco, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codigocadastro', wCodParametro, wCodParametro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('tipocadastro', codTipoCadastro, codTipoCadastro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomeparametro', nomeParametro, nomeParametro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('tipodados', tipoDados, tipoDados, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('valorpadrao', valorPadrao, valorPadrao, ConstraintType.MUST));
            var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

            if (dataSet.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
            } else {
                var regs = new Array();
                for (var i = 0; i < dataSet.values.length; i++) {
                    if (dataSet.values[i]["STATUS"] != undefined) {
                        if (dataSet.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Registro Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable($('#indParametro_' + $this.instanceId).val());
                        } else {
                            FLUIGC.toast({
                                message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Erro: ' + error);
        }

        md_usuarios.remove();
    });
}



function f_carregarDadosNivel() {

    var wCodPerfil = $('#md_codigo_perfil_' + $this.instanceId).val();
    var wCodCategoria = $('#cod_categoria_' + $this.instanceId).val();
    var wCodNivel = $('#cod_nivel_' + $this.instanceId).val();

    if (wCodPerfil == '' || wCodCategoria == '' || wCodNivel == '') {
        // FLUIGC.toast({
        //     message: 'O Campo  [ Parâmetro ] devem ser preenchido.',
        //     type: 'danger'
        // });
        // loadWindow.hide();
        return false;
    } 

    loadDadosDataTable('PECATDISP');
}

function f_incluirItemCategoria() {
    var wCodAcao = $('#md_indacao_' + $this.instanceId).val();
    if (wCodAcao == '') { wCodAcao = 'INS';  }
    var wCodCategoria = $('#md_codigo_categoria_' + $this.instanceId).val();
    var wCodParametro = $('#cod_parametro_' + $this.instanceId).val();
    var wValor = $('#valor_dados_' + $this.instanceId).val();

    if (wCodParametro == '') {
        FLUIGC.toast({
            message: 'O Campo  [ Parâmetro ] devem ser preenchido.',
            type: 'danger'
        });
        loadWindow.hide();
        return false;
    }


    FLUIGC.message.confirm({
        message: 'Inluir novo parâmetro nesse categoria?',
        title: 'Incluir Item',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {
            loadWindow.show();

            try {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'ADDCATEGORIAITEM', 'ADDCATEGORIAITEM', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('acaobanco', wCodAcao, wCodAcao, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codcategoria', wCodCategoria, wCodCategoria, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codparametro', wCodParametro, wCodParametro, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('valorparametro', wValor, wValor, ConstraintType.MUST));
                var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

                if (dataSet.rowsCount == 0) {
                    throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
                } else {
                    var regs = new Array();
                    for (var i = 0; i < dataSet.values.length; i++) {
                        if (dataSet.values[i]["STATUS"] != undefined) {
                            if (dataSet.values[i]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Registro Incluida/Atualizada com sucesso.',
                                    type: 'success'
                                });
                                loadDadosDataTable('CATITEM', wCodCategoria);;
                                $('#cod_parametro_' + $this.instanceId).val('');
                                $('#nome_parametros_' + $this.instanceId).val('')
                                $('#tipo_dados_' + $this.instanceId).val('');
                                $('#valor_dados_' + $this.instanceId).val('');
                            } else {
                                loadWindow.hide();
                                FLUIGC.toast({
                                    message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                    type: 'danger'
                                });

                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Erro: ' + error);
            }
            loadWindow.hide();
        }
    });
}

function f_incluirCategoriaPerfil(pCodAcao, pCodPerfil, pCodNivel, pCodCategoria, pCodParametro, pValor) {
    FLUIGC.message.confirm({
        message: 'Inluir parâmetro desse categoria?',
        title: 'Incluir Item',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {

        if (result == true) {
            loadWindow.show();

            // var wValor = prompt("Informe o valor para parâmetro selecionado", "");

            try {

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'ADDPERFILCATEGORIA', 'ADDPERFILCATEGORIA', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('acaobanco', pCodAcao, pCodAcao, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codperfil', pCodPerfil, pCodPerfil, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codnivel', pCodNivel, pCodNivel, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codcategoria', pCodCategoria, pCodCategoria, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codparametro', pCodParametro, pCodParametro, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('valorparametro', pValor, pValor, ConstraintType.MUST));
                var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

                if (dataSet.rowsCount == 0) {
                    throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
                } else {
                    var regs = new Array();
                    for (var i = 0; i < dataSet.values.length; i++) {
                        if (dataSet.values[i]["STATUS"] != undefined) {
                            if (dataSet.values[i]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Registro Incluida/Atualizada com sucesso.',
                                    type: 'success'
                                });
                                loadDadosDataTable('PECATDISP');
                                loadDadosDataTable('PECATSET');

                            } else {
                                loadWindow.hide();
                                FLUIGC.toast({
                                    message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                    type: 'danger'
                                });

                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Erro: ' + error);
            }
            loadWindow.hide();
        }
    });
}


function f_removerRgistro(pCodTabela, pChave1, pChave2, pChave3, pChave4) {

    FLUIGC.message.confirm({
        message: 'Remover registro selecionado?',
        title: 'Remover Registro',
        labelYes: 'Confirma',
        labelNo: 'Cancelar'
    }, function (result, el, ev) {
        if (result == true) {
            loadWindow.show();

            try {
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'DELLREG', 'DELLREG', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codtabela', pCodTabela, pCodTabela, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('chave1', pChave1, pChave1, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('chave2', pChave2, pChave2, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('chave3', pChave3, pChave3, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('chave4', pChave4, pChave4, ConstraintType.MUST));
                var dataSet = DatasetFactory.getDataset("dsk_parametros_geral", null, constraints, null);

                if (dataSet.rowsCount == 0) {
                    throw "Problemas ao Incluir/Atualizar registro do dataSet: dsk_parametros_geral";
                } else {
                    var regs = new Array();
                    for (var i = 0; i < dataSet.values.length; i++) {
                        if (dataSet.values[i]["STATUS"] != undefined) {
                            if (dataSet.values[i]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Registro removido com sucesso.',
                                    type: 'success'
                                });

                                switch (pCodTabela) {
                                    case "01":
                                        loadDadosDataTable('TC');
                                        break;
                                    case "02":
                                        loadDadosDataTable('PA');
                                        break;
                                    case "03":
                                        loadDadosDataTable('NI');
                                        break;
                                    case "04":
                                        loadDadosDataTable('CA');
                                        break;
                                    case "05":
                                        loadDadosDataTable('CATITEM', pChave1);
                                        break;
                                    case "06":
                                        loadDadosDataTable('PECATDISP');
                                        loadDadosDataTable('PECATSET');
                                        break; 
                                    case "07":
                                        loadDadosDataTable('PECATDISP');
                                        loadDadosDataTable('PECATSET');
                                        break;                                     
                                }

                            } else {
                                loadWindow.hide();
                                FLUIGC.toast({
                                    message: 'Erro: -[ ' + dataSet.values[i]["MENSAGEM"] + ' ]- ',
                                    type: 'danger'
                                });

                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Erro: ' + error);
            }
            loadWindow.hide();
        }
    });
}

function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    //var regex = /^[0-9.,]+$/;
    var regex = /^[0-9.]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function f_validaDisable(objClick, disable) {
    if ((disable == "") || (disable == null)) {

        if (objClick.id == "bt_userClear") {
            $('.grp_user').val('');
        }

        if (objClick.id == "bt_tipoClear") {
            $('.grp_user2').val('');
        }


        if ((objClick.id == "bt_userF") || (objClick.id == "bt_cadastroF")) {
            zoom(objClick.id)
        }

    }

}


function f_incluirItem() {
    var wParametro = $('#indParametro_' + $this.instanceId).val();

    if (wParametro == '' || wParametro == null) {
        FLUIGC.toast({
            message: 'Campo Parâmetro deve ser selecionado primeiro.',
            type: 'danger'
        });
        return false;
    }


    switch (wParametro) {
        case "TC":
            f_addTCadastro('INS');
            break;
        case "PA":
            f_addParametros('INS');
            break;
        case "CA":
            f_addCategoria('INS');
            break;        
        case "NI":
            f_addNivel('INS');
            break;
        case "PE":
            f_addPerfil('INS');
            break;
        case "US":
            f_addUsuario('INS');
            break;
    }


}

function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null") {
        return valorAlter;
    } else {
        return valor
    }
}

