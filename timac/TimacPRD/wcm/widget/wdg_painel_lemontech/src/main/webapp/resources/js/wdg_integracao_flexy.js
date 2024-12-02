var $this = null;
var loadWindow = null;
var localChamado = null;
var editRow = false;
var wCodItemSelected = null;

var MyDataTable = SuperWidget.extend({


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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 23/09/2021 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable("default");
        }

    },

    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'datatable-add-row': ['click_incluirItem'],
            'load-removerItem': ['click_delRow'],
            'datatable-edit-row': ['click_editRow'],
            'update-row': ['click_updaterow'],
            'dbclick-tbl': ['dblclick_editRow'],
            'click-tbl': ['click_cancelar'],
            'datatable-ajustar': ['click_ajustar'],
        },
        global: {}
    },

    filtrar: function (htmlElement, event) {
        loadDadosDataTable('default');
    },

    addRow: function (el, ev) {
        var row = {
            id: "11",
            name: "Santa Catarina",
            uf: "SC"
        };

        dataTable.addRow(0, row);
    },

    ajustar: function (el, ev) {
        if (($('#cod_empresa_' + $this.instanceId).val() == "")) {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa ] devem ser preenchido.',
                // type: 'danger'
            });
            return false;
        };


        var htmlM = '<div class="row"> ' +
            '   <div class="col-sm-5"> ' +
            '       <label class="control-label" for="txtNome">Ajustar</label> ' +
            '       <div class="input-group"> ' +
            '           <div class="custom-radio-inline custom-radio-primary"> ' +
            '               <input type="radio" name="md_tipo_ajuste_' + $this.instanceId + '" value="Valor"> ' +
            '               <label for="radio-1c">Valor</label> ' +
            '           </div> ' +
            '           <div class="custom-radio-inline custom-radio-primary"> ' +
            '               <input type="radio" name="md_tipo_ajuste_' + $this.instanceId + '" value="Estoque" > ' +
            '               <label for="radio-2c">Estoque</label> ' +
            '           </div> ' +
            '           <div class="custom-radio-inline custom-radio-primary"> ' +
            '               <input type="radio" name="md_tipo_ajuste_' + $this.instanceId + '" value="Ambos" > ' +
            '               <label for="radio-2c">Ambos</label> ' +
            '           </div> ' +
            '       </div> ' +
            '   </div> ' +
            '   <div class="col-sm-5"> ' +
            '       <label class="control-label" for="txtNome">Perc Ajuste</label> ' +
            '       <div class="input-group"> ' +
            '           <input type="text" class="form-control grp_user valida" name="perc_ajuste_geral_' + $this.instanceId + '" id="perc_ajuste_geral_' + $this.instanceId + '" onkeypress="return onlynumber();"  valida="field"/> ' +
            '       </div> ' +
            '   </div> ' +
            '</div>';


        var md_AjustarFlexy = FLUIGC.modal({
            title: 'Ajuste Geral',
            content: htmlM,
            id: 'fluig-modalAjuste',
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

        $('#fluig-modalAjuste').on('click', '[data-confirma-modal]', function (ev) {

            var codEmpresa = $('#cod_empresa_' + $this.instanceId).val();
            var indAjusta = $('input[name="md_tipo_ajuste_' + $this.instanceId + '"]:checked').val();
            var percAjuste = $('#perc_ajuste_geral_' + $this.instanceId).val();

            if (indAjusta == undefined) {
                FLUIGC.toast({
                    message: 'Deve selecionar o que será ajustado.',
                    type: 'danger'
                });
                return
            }


            if ((parseInt(percAjuste) == 0) || (percAjuste == '')) {
                FLUIGC.toast({
                    message: 'Deve informado o Percentual do ajueste.',
                    type: 'danger'
                });
                return
            }

            FLUIGC.message.confirm({
                message: 'Ajustar  a [ ' + indAjusta + ' ] de TODOS os registros?',
                title: 'Ajuste Geral',
                labelYes: 'Confirma',
                labelNo: 'Cancelar'
            }, function (result, el, ev) {


                if (result == true) {
                    loadWindow.show();

                    var constraints = new Array();
                    constraints.push(DatasetFactory.createConstraint('indacao', 'AJUSTAR', 'AJUSTAR', ConstraintType.MUST));
                    constraints.push(DatasetFactory.createConstraint('codempresa', codEmpresa, codEmpresa, ConstraintType.MUST));
                    constraints.push(DatasetFactory.createConstraint('indajuste', indAjusta, indAjusta, ConstraintType.MUST));
                    constraints.push(DatasetFactory.createConstraint('percajuste', percAjuste, percAjuste, ConstraintType.MUST));
                    constraints.push(DatasetFactory.createConstraint('userregistro', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));

                    DatasetFactory.getDataset("dsk_flexy", null, constraints, null, {
                        success: (data) => {
                            if (data.hasOwnProperty("values") && data.values.length > 0) {
                                if (data.values[0]["STATUS"] == "OK") {
                                    FLUIGC.toast({
                                        message: 'Registros Ajustados com sucesso.',
                                        type: 'success'
                                    });
                                    loadDadosDataTable('default');
                                } else {
                                    FLUIGC.toast({
                                        message: 'Erro ao ajustar os registros [ ' + data.values[0]["MENSAGEM"] + ' ].',
                                        type: 'danger'
                                    });
                                }
                            }
                            loadWindow.hide();
                        },

                        error: (err) => {
                            loadWindow.hide();
                        },
                    });
                }
            });
            md_AjustarFlexy.remove();
        });
    },

    cancelar: function (el, ev) {
        var row = dataTable.getRow(dataTable.selectedRows()[0]);

        if (editRow == true) {
            if (wCodItemSelected != row.codItem) {
                wCodItemSelected = null;
                editRow = false;
                dataTable.reload();
            }
        }
    },

    incluirItem: function () {

        if (($('#cod_empresa_' + $this.instanceId).val() == "")) {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa ] devem ser preenchido.',
                // type: 'danger'
            });
            return false;
        }

        if (($('#cod_lista_flexy_' + $this.instanceId).val() == "null") || ($('#cod_lista_flexy_' + $this.instanceId).val() == "")) {
            FLUIGC.toast({
                message: 'Empresa sem os parâmetros da Flexy configurados.',
                type: 'danger'
            });
            return false;
        }


        // var htmlM = '<div class="row"> ' +
        //     '   <div class="col-sm-6"> ' +
        //     '       <label class="control-label" for="txtNome">Familia</label> ' +
        //     '       <div class="input-group"> ' +
        //     '           <input type="hidden" class="grp_user" name="md_cod_familia_' + $this.instanceId + '" id="md_cod_familia_' + $this.instanceId + '" /> ' +
        //     '           <input type="text" class="form-control grp_user valida" name="md_den_familia_' + $this.instanceId + '" id="md_den_familia_' + $this.instanceId + '" valida="field" readonly/> ' +
        //     '           <span id="bt_familiaClear" class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="f_validaDisable(this, \'\')" ></span> ' +
        //     '           <span id="bt_familia" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="f_validaDisable(this, \'\')"></span> ' +
        //     '       </div> ' +
        //     '   </div> ' +

        //     '   <div class="col-sm-6"> ' +
        //     '       <label class="control-label" for="txtNome">Item</label> ' +
        //     '       <div class="input-group"> ' +
        //     '           <input type="hidden" class="grp_user" name="md_cod_item_' + $this.instanceId + '" id="md_cod_item_' + $this.instanceId + '" /> ' +
        //     '           <input type="text" class="form-control grp_user valida" name="md_nome_item_' + $this.instanceId + '" id="md_nome_item_' + $this.instanceId + '" valida="field" readonly/> ' +
        //     '           <span id="bt_itemClear" class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="f_validaDisable(this, \'\')" ></span> ' +
        //     '           <span id="bt_item" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="f_validaDisable(this, \'\')"></span> ' +
        //     '       </div> ' +
        //     '   </div> ' +
        //     '</div>';
        var htmlM = '';


        var md_ItemFlexy = FLUIGC.modal({
            title: 'Incluir Itens',
            content: htmlM,
            id: 'fluig-modalItens',
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

        $('#fluig-modalItens').on('click', '[data-confirma-modal]', function (ev) {

            codEmpresa = $('#cod_empresa_' + $this.instanceId).val();
            codFamilia = $('#md_cod_familia_' + $this.instanceId).val();
            codItem = $('#md_cod_item_' + $this.instanceId).val().trim();

            if ((codFamilia == "")) {
                FLUIGC.toast({
                    message: 'Campo Família deve estar preenchido.',
                    type: 'danger'
                });
                return false;
            }

            var regData = {
                codEmpresa: codEmpresa,
                codFamilia: codFamilia,
                codItem: codItem
            }

            // console.log("Incluindo itens: " + JSON.stringify(regData));
            loadWindow.show();

            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'INCLUIR', 'INCLUIR', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codempresa', codEmpresa, codEmpresa, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('codfamilia', codFamilia, codFamilia, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('coditem', codItem, codItem, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('userregistro', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));

            DatasetFactory.getDataset("dsk_flexy", null, constraints, null, {
                success: (data) => {
                    if (data.hasOwnProperty("values") && data.values.length > 0) {
                        if (data.values[0]["STATUS"] == "OK") {
                            FLUIGC.toast({
                                message: 'Item Incluida/Atualizada com sucesso.',
                                type: 'success'
                            });
                            loadDadosDataTable('default');
                        } else {
                            FLUIGC.toast({
                                message: 'Erro ao incluir Item [ ' + data.values[0]["MENSAGEM"] + ' ].',
                                type: 'danger'
                            });
                        }
                    }
                    loadWindow.hide();
                    md_ItemFlexy.remove();
                },

                error: (err) => {
                    // toast(data.values[0]['MSG'], "danger");
                    loadWindow.hide();
                    md_ItemFlexy.remove();
                },
            });

        });
    },

    delRow: function (el, ev) {
        var row = dataTable.getRow(dataTable.selectedRows()[0]);
        // row.codItem
        // alert("aqui");
        // return;

        FLUIGC.message.confirm({
            message: 'Remover o item [ ' + row.codItem + ' ] da lista?',
            title: 'Remover item',
            labelYes: 'Confirma',
            labelNo: 'Cancelar'
        }, function (result, el, ev) {


            if (result == true) {
                loadWindow.show();

                var codEmpresa = $('#cod_empresa_' + $this.instanceId).val();

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'EXCLUIR', 'EXCLUIR', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('codempresa', codEmpresa, codEmpresa, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('coditem', row.codItem, row.codItem, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('userregistro', WCMAPI.userCode, WCMAPI.userCode, ConstraintType.MUST));

                DatasetFactory.getDataset("dsk_flexy", null, constraints, null, {
                    success: (data) => {
                        if (data.hasOwnProperty("values") && data.values.length > 0) {
                            if (data.values[0]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'Item removido com sucesso.',
                                    type: 'success'
                                });
                                loadDadosDataTable('default');
                            } else {
                                FLUIGC.toast({
                                    message: 'Erro ao remover Item [ ' + data.values[0]["MENSAGEM"] + ' ].',
                                    type: 'danger'
                                });
                            }
                        }
                        loadWindow.hide();
                    },

                    error: (err) => {
                        loadWindow.hide();
                    },
                });
            }
        });


    },

    editRow: function (el, ev) {
        loadWindow.show();

        var row = dataTable.getRow(dataTable.selectedRows()[0]);
        dataTable.updateRow(dataTable.selectedRows()[0], row, '.template_datatable_edit');

        editRow = true;
        wCodItemSelected = row.codItem;


        $('#datatable-input-id').val(row.codItem);
        $('#datatable-input-nomeItem').val(row.nomeItem);
        $('#datatable-input-multiplo').val(row.multiplo);

        $('#datatable-input-valorCusto').val(row.valorCusto);
        $('#datatable-input-valorCal').val(row.valorCal);
        $('#datatable-input-percVenda').val(row.percVenda);
        $('#datatable-input-valorVenda').val(row.valorVenda);
        $('#datatable-input-estqHome').val(row.estqHome);
        $('#datatable-input-percEstoque').val(row.percEstoque);
        $('#datatable-input-estqDisp').val(row.estqDisp);
        $('#datatable-input-estqSite').val(row.estqSite);
        $('#datatable-input-refFlexy').val(row.refFlexy);
        $('#datatable-input-sincroniazado').val(row.sincroniazado);
        $('#datatable-input-usuarioCriado').val(row.usuarioCriado);
        $('#datatable-input-datRegistro').val(row.datRegistro);

        $('#datatable-input-percVenda').focus();

        loadWindow.hide();

    },

    updaterow: function (el, ev) {

        var wRefCode = '';
        if ($('#datatable-input-refFlexy').val() != 'null') {
            wRefCode = $('#datatable-input-refFlexy').val();
        }

        var regData = {
            codItem: $('#datatable-input-id').val().trim(),
            valCusto: $('#datatable-input-valorCusto').val().toString().replace(",", "."),
            valCalc: $('#datatable-input-valorCal').val().toString().replace(",", "."),
            percVenda: $('#datatable-input-percVenda').val(),
            valVenda: $('#datatable-input-valorVenda').val().toString().replace(",", "."),
            estqHome: $('#datatable-input-estqHome').val().toString().replace(".", ""),
            percEstq: $('#datatable-input-percEstoque').val(),
            estqDisp: $('#datatable-input-estqDisp').val().toString().replace(".", ""),
            estqSite: $('#datatable-input-estqSite').val().toString().replace(".", ""),
            refFlexy: wRefCode,
            userregistro: WCMAPI.userCode
        }
        // console.log(JSON.stringify(regData));

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('indacao', 'ATUALIZAR', 'ATUALIZAR', ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('codempresa', $('#cod_empresa_' + $this.instanceId).val(), $('#cod_empresa_' + $this.instanceId).val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('json', JSON.stringify(regData), JSON.stringify(regData), ConstraintType.MUST));
        DatasetFactory.getDataset("dsk_flexy", null, constraints, null, {
            success: (data) => {
                if (data.hasOwnProperty("values") && data.values.length > 0) {
                    if (data.values[0]['STATUS'] == 'OK') {
                        FLUIGC.toast({
                            title: '',
                            message: "Atualizado!",
                            type: 'success',
                            timeout: 2000
                        });

                        editRow = false;
                        wCodItemSelected = null;
                        loadDadosDataTable('default')
                    } else {
                        FLUIGC.toast({
                            message: 'Erro ao incluir Item { ' + data.values[0]["MENSAGEM"] + ' }.',
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

        // console.log("JSon a envia: " + JSON.stringify(regData));

        // var editedRow = {
        //     id: $('#datatable-input-id').val(),
        //     name: $('#datatable-input-name').val(),
        //     uf: $('#datatable-input-uf').val()
        // };
        // dataTable.updateRow(dataTable.selectedRows()[0], editedRow);


    },

    showColumn: function (el, ev) {
        var index = 1;
        dataTable.showColumn(index);
    },

    hideColumn: function (el, ev) {
        var index = 1;
        dataTable.hideColumn(index);
    },

    reload: function (el, ev) {
        dataTable.reload();
    },

    selected: function (el, ev) {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);
        FLUIGC.toast({
            title: '',
            message: "{\"id\" :" + selected.id + ", \"name\" :" + selected.name + " , \"uf\" :" + selected.uf + "}",
            type: 'success'
        });

    }

});