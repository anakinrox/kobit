var $this = null;
var loadWindow = null;

var MyWidget = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function () {
        // this.loadTable();
        $this = this;

        if (!this.isEditMode) {

            //Carrega Título da página
            $('#page_title').html(WCMAPI.getPageTitle());

            // Usuario Logado.
            user_code = WCMAPI.getUserCode();

            //Load do fluig
            loadWindow = FLUIGC.loading(window);
            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 28/10/2021 14:45<br>Técnico: Marcio Silva' });

            // setMask();
            // loadDataTable("default");

        }

    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-confirmar': ['click_confirmaOperacao'],
            'load-checkbox': ['click_marcarTodos']
        },
        global: {}
    },


    marcarTodos: function (htmlElement, event) {
        // alert('Alerta: 3');
        // alert('Registros: ' + dataTable.fnSettings().fnRecordsTotal());

        $("input:checkbox").each(function () {
            var check = $(this).is(':checked');
            if (check) { check = false; } else { check = true; }
            $(this).prop("checked", check);
        });

    },

    filtrar: function (htmlElement, event) {
        loadWindow.show();

        // alert('aqui2');
        // || $('#num_projeto_' + $this.instanceId).val() == ""
        if ($('#num_projeto_' + $this.instanceId).val() == '' || $('#cod_empresa_' + $this.instanceId).val() == "") {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa, Nº projeto] devem ser preenchido.',
                type: 'danger'
            });
            loadWindow.hide();
            return false;
        }
        loadDataTable('parcial');
        loadDadosDataTable('parcial');
        document.getElementById('dvbtConfirma').style.display = '';

        loadWindow.hide();

    },

    executeAction: function (htmlElement, event) {
    },


    confirmaOperacao: function (htmlElement, event) {
        // var index = dataTable.selectedRows()[0];
        // var selected = dataTable.getRow(index);

        var htmlM = '<div class="row"> ' +
            '   <div class="col-sm-8"> ' +
            '       <label class="control-label" for="txtNome">Operador</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="hidden" class="grp_operador" name="md_codOperador_' + $this.instanceId + '" id="md_codOperador_' + $this.instanceId + '" /> ' +
            '           <input type="text" class="form-control grp_operador valida" name="md_nomeOperador_' + $this.instanceId + '" id="md_nomeOperador_' + $this.instanceId + '" valida="field" readonly/> ' +
            '           <span id="bt_operadorClear" class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick=" $(\'.grp_operador\').val(\'\');" ></span> ' +
            '           <span id="bt_operador" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id);"></span> ' +
            '       </div> ' +
            '   </div> ' +
            '</div>' +

            '<div class="row"> ' +
            '   <div class="col-sm-12" align="center"> ' +
            '       &nbsp;' +
            '   </div> ' +
            '</div>' +

            '<div class="row"> ' +

            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Data inicio Apontamento</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="date" class="form-control valida" name="md_dat_ini_apon_' + $this.instanceId + '" id="md_dat_ini_apon_' + $this.instanceId + '" valida="field" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +

            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Hora inicio Apontamento</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="time" class="form-control valida" name="md_hor_ini_apon_' + $this.instanceId + '" id="md_hor_ini_apon_' + $this.instanceId + '" valida="field" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +

            '</div>' +

            '<div class="row"> ' +

            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Data Fim Apontamento</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="date" class="form-control valida" name="md_fim_ini_apon_' + $this.instanceId + '" id="md_fim_ini_apon_' + $this.instanceId + '" valida="field" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +

            '   <div class="col-sm-4"> ' +
            '       <label class="control-label" for="txtNome">Hora Fim Apontamento</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="time" class="form-control valida" name="md_hor_fim_apon_' + $this.instanceId + '" id="md_hor_fim_apon_' + $this.instanceId + '" valida="field" onkeypress="return onlynumber();"/> ' +
            '       </div> ' +
            '   </div> ' +

            '</div>';


        var md_confirmacao = FLUIGC.modal({
            title: 'Confirmar Baixa',
            content: htmlM,
            id: 'fluig-modalConfirmacao',
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

        $('#fluig-modalConfirmacao').on('click', '[data-confirma-modal]', function (ev) {
            var wCheckBox = false;
            var wOrdem = [];

            if ($('#md_codOperador_' + $this.instanceId).val() == "" || $('#md_dat_ini_apon_' + $this.instanceId).val() == "" || $('#md_hor_ini_apon_' + $this.instanceId).val() == "" || $('#md_fim_ini_apon_' + $this.instanceId).val() == "" || $('#md_hor_fim_apon_' + $this.instanceId).val() == "") {
                FLUIGC.toast({
                    message: 'Os Campos  [ Operador, Inicio e Fim Apontamentos ] devem ser preenchido.',
                    type: 'danger'
                });
                loadWindow.hide();
                return false;
            }

            $("input:checked").each(function () {
                // alert('Ordem: ' + wOpcaoes[0] + ' Operacao: ' + wOpcaoes[1] + ' CCusto: ' + wOpcaoes[2]);
                wCheckBox = true
                var wOpcaoes = $(this).attr("value").split("||");
                var wData = {
                    numOrdem: wOpcaoes[0],
                    codOperacao: wOpcaoes[1],
                    codCentroCusto: wOpcaoes[2],
                }
                wOrdem.push(wData);
            });

            if (wCheckBox == false) {
                FLUIGC.toast({
                    message: 'Nenhuma ordem foi selecionada.',
                    type: 'danger'
                });
                loadWindow.hide();
                return false;
            }



            var regData = {
                codEmpresa: $('#cod_empresa_' + $this.instanceId).val(),
                numDocumento: $('#num_projeto_' + $this.instanceId).val(),
                codItem: $('#cod_item_' + $this.instanceId).val(),
                codOperador: $('#md_codOperador_' + $this.instanceId).val().trim(),
                dataIni: $('#md_dat_ini_apon_' + $this.instanceId).val(),
                HoraIni: $('#md_hor_ini_apon_' + $this.instanceId).val(),
                DataFim: $('#md_fim_ini_apon_' + $this.instanceId).val(),
                HoraFim: $('#md_hor_fim_apon_' + $this.instanceId).val(),
                ordens: wOrdem
            }
            console.log(JSON.stringify(regData));

            FLUIGC.message.confirm({
                message: 'Confirma o Apontamento das ordens selecionadas?',
                title: 'Apontar ordens',
                labelYes: 'Confirma',
                labelNo: 'Cancelar'
            }, function (result, el, ev) {
                if (result == true) {
                    loadWindow.show();

                    var constraints = new Array();
                    constraints.push(DatasetFactory.createConstraint('indacao', 'APONTAR', 'APONTAR', ConstraintType.MUST));
                    constraints.push(DatasetFactory.createConstraint('json', JSON.stringify(regData), JSON.stringify(regData), ConstraintType.MUST));
                    DatasetFactory.getDataset("dsk_encerra_projeto", null, constraints, null, {
                        success: (data) => {
                            if (data.hasOwnProperty("values") && data.values.length > 0) {
                                if (data.values[0]['STATUS'] == 'OK') {
                                    FLUIGC.toast({
                                        title: 'Apontamento',
                                        message: "Apontamento das ordens realizadas!",
                                        type: 'success',
                                        timeout: 2000
                                    });


                                    loadDadosDataTable('parcial')
                                } else {
                                    FLUIGC.toast({
                                        message: 'Erro ao apontar ordens { ' + data.values[0]["MENSAGEM"] + ' }.',
                                        type: 'danger'
                                    });
                                }

                            }
                            loadWindow.hide();
                        },

                        error: (err) => {
                            toast("Erro ao atualizar. [ " + err + " ]", "danger");
                            loadWindow.hide();
                        },
                    });
                }
            });




            md_confirmacao.remove();
        });

    },

});


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