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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 23/09/2021 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable('default');
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-editarMeta': ['click_editarMeta'],
            'load-removerMeta': ['click_removerMeta'],
            'order-by': ['click_orderBy'],
        }
    },

    filtrar: function (htmlElement, event) {
        loadDadosDataTable('default');
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

    editarMeta: function () {

        var btnSeleccao = "";
        var userCRM = "";
        var matricula = "";
        var nomUsuario = "";
        var UF = "";
        var metaPorta = "0";
        var metaRodape = "0";
        var metaFerragem = "0";
        var metaPortaLoja = "0";
        var metaFerragemLoja = "0";
        var dat_ini_vigencia = "";
        var dat_fim_vigencia = "";
        var codTipoCadastro = "";
        var nomTipoCadastro = "";

        if (localChamado == null) {
            var index = dataTable.selectedRows()[0];
            var selected = dataTable.getRow(index);

            userCRM = selected.user_crm;
            matricula = selected.matricula;
            nomUsuario = selected.nom_usuario;
            UF = selected.uf;
            metaPorta = selected.meta_porta;
            metaRodape = selected.meta_rodape;
            metaFerragem = selected.meta_ferragem;
            metaPortaLoja = selected.meta_loja_porta;
            metaFerragemLoja = selected.meta_loja_ferragem;
            dat_ini_vigencia = selected.dat_incial.split('/').reverse().join('-');
            dat_fim_vigencia = selected.dat_final.split('/').reverse().join('-');
            codTipoCadastro = selected.cod_tipo_cadastro;
            nomTipoCadastro = selected.nom_tipo_cadastro;
            btnSeleccao = "disabled";
        }

        localChamado = null;
        var htmlM = '<div class="row"> ' +
            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Usuário</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="hidden" class="grp_user" name="md_matriculaF_' + $this.instanceId + '" id="md_matriculaF_' + $this.instanceId + '" value="' + matricula + '"/> ' +
            '           <input type="hidden" class="grp_user" name="md_userCRM_' + $this.instanceId + '" id="md_userCRM_' + $this.instanceId + '" value="' + userCRM + '"/> ' +
            '           <input type="hidden" class="grp_user" name="md_codGestorF_' + $this.instanceId + '" id="md_codGestorF_' + $this.instanceId + '" /> ' +
            '           <input type="text" class="form-control grp_user valida" name="md_nome_usuarioF_' + $this.instanceId + '" id="md_nome_usuarioF_' + $this.instanceId + '" valida="field" value="' + nomUsuario + '" readonly/> ' +
            '           <span id="bt_userClear" class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="f_validaDisable(this, \'' + btnSeleccao + '\')" ></span> ' +
            '           <span id="bt_userF" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="f_validaDisable(this, \'' + btnSeleccao + '\')"></span> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-3"> ' +
            '       <label class="control-label" for="md_nomeUFF_' + $this.instanceId + '">Estado</label> ' +
            '       <div class="input-group"> ' +
            '           <select id="md_nomeUFF_' + $this.instanceId + '" name="md_nomeUFF_' + $this.instanceId + '" class="form-control grp_user valida"> ' +
            '               <option value="" >Escolha o estado</option> ' +
            '               <option value="' + UF + '" selected>' + UF + '</option> ' +
            '               <option value="AC">Acre</option> ' +
            '               <option value="AL">Alagoas</option> ' +
            '               <option value="AP">Amapá</option> ' +
            '               <option value="AM">Amazonas</option> ' +
            '               <option value="BA">Bahia</option> ' +
            '               <option value="CE">Ceará</option> ' +
            '               <option value="DF">Distrito Federal</option> ' +
            '               <option value="ES">Espírito Santo</option> ' +
            '               <option value="GO">Goiás</option> ' +
            '               <option value="MA">Maranhão</option> ' +
            '               <option value="MT">Mato Grosso</option> ' +
            '               <option value="MS">Mato Grosso do Sul</option> ' +
            '               <option value="MG">Minas Gerais</option> ' +
            '               <option value="PA">Pará</option> ' +
            '               <option value="PB">Paraíba</option> ' +
            '               <option value="PR">Paraná</option> ' +
            '               <option value="PE">Pernambuco</option> ' +
            '               <option value="PI">Piauí</option> ' +
            '               <option value="RJ">Rio de Janeiro</option> ' +
            '               <option value="RN">Rio Grande do Norte</option> ' +
            '               <option value="RS">Rio Grande do Sul</option> ' +
            '               <option value="RO">Rondônia</option> ' +
            '               <option value="RR">Roraima</option> ' +
            '               <option value="SC">Santa Catarina</option> ' +
            '               <option value="SP">São Paulo</option> ' +
            '               <option value="SE">Sergipe</option> ' +
            '               <option value="TO">Tocantins</option> ' +
            '           </select> ' +
            '       </div> ' +
            '   </div> ' +

            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Tipo Cadastro</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="hidden" class="grp_user" name="codregistroF_' + $this.instanceId + '" id="codregistroF_' + $this.instanceId + '" value="' + codTipoCadastro + '"/> ' +
            '           <input type="text" class="form-control grp_user2 valida" name="nome_registroF_' + $this.instanceId + '" id="nome_registroF_' + $this.instanceId + '" valida="field" value="' + nomTipoCadastro + '" readonly/> ' +
            '           <span id="bt_tipoClear" class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="f_validaDisable(this, \'\')" ></span> ' +
            '           <span id="bt_cadastroF" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="f_validaDisable(this, \'\')"></span> ' +
            '       </div> ' +
            '   </div> ' +

            '</div>' +

            '<div class="row"> ' +
            '   <div class="col-sm-12" align="center"> ' +
            '       &nbsp;' +
            '   </div> ' +
            '</div>' +

            '<div class="row"> ' +
            '   <div class="col-sm-2" align="center"> ' +
            '       <label class="control-label" for="txtNome" align="center">Porta</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_metaPorta_' + $this.instanceId + '" id="md_metaPorta_' + $this.instanceId + '" valida="field"  value="' + metaPorta + '" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-2" align="center"> ' +
            '       <label class="control-label" for="txtNome">Rodape</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_metaRodape_' + $this.instanceId + '" id="md_metaRodape_' + $this.instanceId + '" valida="field"value="' + metaRodape + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-2" align="center"> ' +
            '       <label class="control-label" for="txtNome">Ferragem</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_metaFerragem_' + $this.instanceId + '" id="md_metaFerragem_' + $this.instanceId + '" valida="field" value="' + metaFerragem + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-2" align="center"> ' +
            '       <label class="control-label" for="txtNome">Porta Loja</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_metaPortaLoja_' + $this.instanceId + '" id="md_metaPortaLoja_' + $this.instanceId + '" valida="field" value="' + metaPortaLoja + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-2" align="center"> ' +
            '       <label class="control-label" for="txtNome">Ferragem Loja</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_metaFerragemLoja_' + $this.instanceId + '" id="md_metaFerragemLoja_' + $this.instanceId + '" valida="field" value="' + metaFerragemLoja + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '</div>' +
            '<div class="row"> ' +
            '   <div class="col-sm-3" align="center"> ' +
            '       <label class="control-label" for="txtNome">Inico Vigencia</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="date" class="form-control valida" name="md_dat_ini_vigencia_' + $this.instanceId + '" id="md_dat_ini_vigencia_' + $this.instanceId + '" valida="field" value="' + dat_ini_vigencia + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-3" align="center"> ' +
            '       <label class="control-label" for="txtNome">Fim Vigencia</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="date" class="form-control valida" name="md_dat_fim_vigencia_' + $this.instanceId + '" id="md_dat_fim_vigencia_' + $this.instanceId + '" valida="field" value="' + dat_fim_vigencia + '" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '</div>';


        var md_metas = FLUIGC.modal({
            title: 'Meta',
            content: htmlM,
            id: 'fluig-modalMetas',
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

        $('#fluig-modalMetas').on('click', '[data-confirma-modal]', function (ev) {
            codGestor = $('#md_codGestorF_' + $this.instanceId).val();
            nomUF = $('#md_nomeUFF_' + $this.instanceId).val();
            codTipoCadastro = $('#codregistroF_' + $this.instanceId).val();
            userCRM = $('#md_userCRM_' + $this.instanceId).val();
            matricula = $('#md_matriculaF_' + $this.instanceId).val();
            metaPorta = $('#md_metaPorta_' + $this.instanceId).val();
            metaRodape = $('#md_metaRodape_' + $this.instanceId).val();
            metaFerragem = $('#md_metaFerragem_' + $this.instanceId).val();
            metaPortaLoja = $('#md_metaPortaLoja_' + $this.instanceId).val();
            metaFerragemLoja = $('#md_metaFerragemLoja_' + $this.instanceId).val();
            dat_ini_vigencia = $('#md_dat_ini_vigencia_' + $this.instanceId).val().split('/').reverse().join('-');
            dat_fim_vigencia = $('#md_dat_fim_vigencia_' + $this.instanceId).val().split('/').reverse().join('-');


            if ((userCRM == "") || (matricula == "") || (metaPorta == "") || (metaRodape == "")
                || (metaFerragem == "") || (metaPortaLoja == "") || (metaFerragemLoja == "")
                || (dat_ini_vigencia == "") || (dat_fim_vigencia == "") || (nomUF == "")) {
                FLUIGC.toast({
                    message: 'Todos os campos devem estar preenchidos.',
                    type: 'danger'
                });
                return false;
            }


            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('ind_acao', 'I', 'I', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('matricula', matricula, matricula, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codgestor', codGestor, codGestor, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('nomeUF', nomUF, nomUF, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('indVendedor', codTipoCadastro, codTipoCadastro, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usercrm', userCRM, userCRM, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('metaporta', metaPorta, metaPorta, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('metarodape', metaRodape, metaRodape, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('metaferragem', metaFerragem, metaFerragem, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('metaportaloja', metaPortaLoja, metaPortaLoja, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('metaferragemloja', metaFerragemLoja, metaFerragemLoja, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('dat_ini_vigencia', dat_ini_vigencia, dat_ini_vigencia, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('dat_fim_vigencia', dat_fim_vigencia, dat_fim_vigencia, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('user_registro', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            var metas = DatasetFactory.getDataset("dts_metas", null, constraints, null);

            if (metas.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dts_metasp";
            } else {
                var regs = new Array();
                for (var i = 0; i < metas.values.length; i++) {
                    if (metas.values[i]["STATUS"] != undefined) {
                        if (metas.values[i]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Meta Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable('default');
                        } else {
                            FLUIGC.toast({
                                message: 'Problemas ao Incluir/Atualizar o registro.',
                                type: 'danger'
                            });
                        }
                    }
                }
            }
            md_metas.remove();
        });
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
                                    message: 'Problemas ao remover o registro.',
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