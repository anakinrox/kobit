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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 09/06/2021 09:38<br>Técnico: Marcio Silva' });

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

        var hoje = new Date();
        var anoAtual = hoje.getFullYear();

        var nomCargo = "";
        var nomArea = "";
        var nomUsuario = "";
        var ano = anoAtual;
        var mes01 = "0";
        var mes02 = "0";
        var mes03 = "0";
        var mes04 = "0";
        var mes05 = "0";
        var mes06 = "0";
        var mes07 = "0";
        var mes08 = "0";
        var mes09 = "0";
        var mes10 = "0";
        var mes11 = "0";
        var mes12 = "0";

        if (localChamado == null) {

            var index = dataTable.selectedRows()[0];
            var selected = dataTable.getRow(index);
            nomCargo = selected.nom_cargo;
            nomArea = selected.nom_are;
            nomUsuario = selected.nom_usuario;
            ano = selected.ano;
            mes01 = selected.mes01;
            mes02 = selected.mes02;
            mes03 = selected.mes03;
            mes04 = selected.mes04;
            mes05 = selected.mes05;
            mes06 = selected.mes06;
            mes07 = selected.mes07;
            mes08 = selected.mes08;
            mes09 = selected.mes09;
            mes10 = selected.mes10;
            mes11 = selected.mes11;
            mes12 = selected.mes12;
        }

        localChamado = null;

        var htmlM = '<div class="row"> ' +
            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Cargo</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="hidden" class="grp_cargo" name="cargoF_' + $this.instanceId + '" id="cargoF_' + $this.instanceId + '"/> ' +
            '           <input type="text" class="form-control grp_user valida" name="nome_cargoF_' + $this.instanceId + '" id="nome_cargoF_' + $this.instanceId + '" valida="field"  value="' + nomCargo + '" readonly/> ' +
            '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_cargo\').val(\'\') "></span> ' +
            '           <span id="bt_cargoF" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span> ' +
            '       </div> ' +
            '   </div> ' +
            '    ' +
            '   <div class="col-sm-2"> ' +
            '       <label class="control-label" for="md_areaF_' + $this.instanceId + '">Área</label> ' +
            '       <select name="md_areaF_' + $this.instanceId + '" id="md_areaF_' + $this.instanceId + '" class="form-control"> ' +
            '           <option value=""> </option> ' +
            '           <option value="COM">COM</option> ' +
            '           <option value="ADM">ADM</option> ' +
            '           <option value="IND">IND</option> ' +
            '           <option value="ER">ER</option> ' +
            '           <option value="' + nomArea + '" selected>' + nomArea + '</option> ' +
            '       </select> ' +
            '   </div> ' +
            '    ' +
            '   <div class="col-sm-5"> ' +
            '       <label class="control-label" for="txtNome">Usuário</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="hidden" class="grp_user" name="md_matriculaF_' + $this.instanceId + '" id="md_matriculaF_' + $this.instanceId + '"/> ' +
            '           <input type="text" class="form-control grp_user valida" name="md_nome_usuarioF_' + $this.instanceId + '" id="md_nome_usuarioF_' + $this.instanceId + '" valida="field" value="' + nomUsuario + '" readonly/> ' +
            '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_user\').val(\'\')"></span> ' +
            '           <span id="bt_userF" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-md-3"> ' +
            '       <div class="col-md-10" style="padding-left: 0px; padding-right: 0px"> ' +
            '           <label for="exampleTag">Ano</label> ' +
            '           <input type="Number" name="ano_' + $this.instanceId + '" id="ano_' + $this.instanceId + '" maxlength="4" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" value="' + ano + '" class="form-control data-fluig"> ' +
            '       </div>' +
            '   </div>' +
            '</div>' +

            '<div class="row"> ' +
            '   <div class="col-sm-12" align="center"> ' +
            '       &nbsp;' +
            '   </div> ' +
            '</div>' +

            '<div class="row"> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome" align="center">01</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes01_' + $this.instanceId + '" id="md_mes01_' + $this.instanceId + '" valida="field"  value="' + mes01 + '" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">02</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes02_' + $this.instanceId + '" id="md_mes02_' + $this.instanceId + '" valida="field"value="' + mes02 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">03</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes03_' + $this.instanceId + '" id="md_mes03_' + $this.instanceId + '" valida="field" value="' + mes03 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">04</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes04_' + $this.instanceId + '" id="md_mes04_' + $this.instanceId + '" valida="field" value="' + mes04 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">05</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes05_' + $this.instanceId + '" id="md_mes05_' + $this.instanceId + '" valida="field" value="' + mes05 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">06</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes06_' + $this.instanceId + '" id="md_mes06_' + $this.instanceId + '" valida="field" value="' + mes06 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">07</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes07_' + $this.instanceId + '" id="md_mes07_' + $this.instanceId + '" valida="field" value="' + mes07 + '" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">08</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes08_' + $this.instanceId + '" id="md_mes08_' + $this.instanceId + '" valida="field" value="' + mes08 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">09</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes09_' + $this.instanceId + '" id="md_mes09_' + $this.instanceId + '" valida="field" value="' + mes09 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">10</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes10_' + $this.instanceId + '" id="md_mes10_' + $this.instanceId + '" valida="field" value="' + mes10 + '" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">11</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes11_' + $this.instanceId + '" id="md_mes11_' + $this.instanceId + '" valida="field" value="' + mes11 + '"  onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-1" align="center"> ' +
            '       <label class="control-label" for="txtNome">12</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control valida" name="md_mes12_' + $this.instanceId + '" id="md_mes12_' + $this.instanceId + '" valida="field" value="' + mes12 + '" onkeypress="return onlynumber();"/> ' +
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

            nomCargo = $('#nome_cargoF_' + $this.instanceId).val();
            nomArea = $('#md_areaF_' + $this.instanceId).val();


            if ($('#md_matriculaF_' + $this.instanceId).val() != "") {
                nomUsuario = $('#md_matriculaF_' + $this.instanceId).val();
            } else {
                nomUsuario = $('#md_nome_usuarioF_' + $this.instanceId).val();
            }


            if ((nomCargo != "") && (nomArea != "") && (nomUsuario != "")) {
                FLUIGC.toast({
                    message: 'Deve ser informado "Cargo/Área" ou "Usuário", os dois não podem ser usados.',
                    type: 'danger'
                });

                return false;
            }

            mes01 = $('#md_mes01_' + $this.instanceId).val();
            mes02 = $('#md_mes02_' + $this.instanceId).val();
            mes03 = $('#md_mes03_' + $this.instanceId).val();
            mes04 = $('#md_mes04_' + $this.instanceId).val();
            mes05 = $('#md_mes05_' + $this.instanceId).val();
            mes06 = $('#md_mes06_' + $this.instanceId).val();
            mes07 = $('#md_mes07_' + $this.instanceId).val();
            mes08 = $('#md_mes08_' + $this.instanceId).val();
            mes09 = $('#md_mes09_' + $this.instanceId).val();
            mes10 = $('#md_mes10_' + $this.instanceId).val();
            mes11 = $('#md_mes11_' + $this.instanceId).val();
            mes12 = $('#md_mes12_' + $this.instanceId).val();

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('ind_acao', 'I', 'I', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('area', nomArea, nomArea, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('cargo', nomCargo, nomCargo, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', nomUsuario, nomUsuario, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes01', mes01, mes01, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes02', mes02, mes02, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes03', mes03, mes03, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes04', mes04, mes04, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes05', mes05, mes05, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes06', mes06, mes06, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes07', mes07, mes07, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes08', mes08, mes08, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes09', mes09, mes09, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes10', mes10, mes10, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes11', mes11, mes11, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('mes12', mes12, mes12, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('matricula', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));
            console.log(JSON.stringify(constraints));

            var metas = DatasetFactory.getDataset("dts_metas_stop", null, constraints, null);

            if (metas.rowsCount == 0) {
                throw "Problemas ao Incluir/Atualizar registro do dataSet: dts_metas_stop";
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
            message: 'Excluir a meta selecionada?',
            title: 'Remover Meta',
            labelYes: 'Sim',
            labelNo: 'Não'
        }, function (result, el, ev) {
            if (result == true) {

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('ind_acao', 'R', 'R', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('area', selected.nom_are, selected.nom_are, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('cargo', selected.nom_cargo, selected.nom_cargo, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('usuario', selected.nom_usuario, selected.nom_usuario, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('ano', selected.ano, selected.ano, ConstraintType.MUST));
                var metas = DatasetFactory.getDataset("dts_metas_stop", null, constraints, null);

                if (metas.rowsCount == 0) {
                    throw "Problemas ao remover registro do dataSet: dts_metas_stop";
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

            // this.someFunc();
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