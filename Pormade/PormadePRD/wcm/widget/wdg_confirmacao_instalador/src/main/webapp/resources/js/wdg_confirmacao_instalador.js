var $this = null;
var loadWindow = null;


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


            //Load do fluig
            loadWindow = FLUIGC.loading(window);
            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 29/06/2023 09:38<br>Técnico: Marcio Silva' });

            loadDataTable('SERVICOS');
            loadImagens('SERVICOS');
        }
    },

    //BIND de eventos
    bindings: {
        local: {

        },
        global: {
            'load-visualizarFoto': ['click_viewFoto'],
            'load-confirmaInstalacao': ['click_confirmaInstalacao']


        }
    },

    viewFoto: function (el, ev) {
        var row = dataTable.getRow(dataTable.selectedRows()[0]);

        var htmlM = '' +
            '<div class="row"> ' +
            '   <div class="col-md-12" align="center"> ' +
            '       <span class="label label-info"> ' + row.descricao + ' </span>' +
            '   </div> ' +
            '   <div class="col-md-12" align="center"> ' +
            '       <div class="panel-body"><div id="idTBLFotos_' + $this.instanceId + '" data-dbclick-tbl data-click-tbl></div></div>' +
            '   </div> ' +
            '</div>';


        md_ServicoFotos = FLUIGC.modal({
            title: 'Fotos do Serviço',
            content: htmlM,
            id: 'fluig-servicoFotos',
            size: 'large',
            actions: []
        }, function (err, data) {
            if (err) {
                // do error handling
            } else {

            }
        });

        $('#fluig-md_ServicoFotos').ready(function () {

            loadDataTable('FOTOS');
            loadImagens('FOTOS', row.id, row.seq, row.produto);

        });

    },

    confirmaInstalacao: function (el, ev) {
        var wRadioAprova = $('input[name="aprovar"]:checked').val();
        var wRadioNota = $('input[name="numNota"]:checked').val();
        var wDescMotivo = $('#desc_motivo').val();
        var wRadioVisitaObra = $('input[name="foi_local"]:checked').val();

        // alert('Aprova: ' + wRadioAprova);
        // alert('Visita: ' + wRadioVisitaObra);
        // alert('Motivo: ' + wDescMotivo);



        if (wRadioAprova == undefined || wRadioVisitaObra == undefined) {
            FLUIGC.toast({
                message: 'Deve selecionar uma das opções na aprovação',
                type: 'danger'
            });
            $('#radio-1').focus();
            return false;
        }

        if (wRadioAprova == 'S' && wRadioNota == undefined) {
            FLUIGC.toast({
                message: 'Por favor selecione a nota para essa instalação.',
                type: 'danger'
            });
            return false;
        }

        if (wRadioAprova == 'N' && wDescMotivo.trim() == '') {
            FLUIGC.toast({
                message: 'Como não foi aprovado a instalação favor descreve os motivos.',
                type: 'danger'
            });
            $('#desc_motivo').focus();
            return false;
        }


        var htmlM = '' +
            '<div class="row"> ' +
            '   <div class="col-md-10"> ' +
            '       <label class="control-label" for="txtNome">Token</label> ' +
            '       <input type="number" class="form-control grp_user valida" name="md_token_' + $this.instanceId + '" id="md_token_' + $this.instanceId + '" min="0" max="4" maxlength="4" onKeyPress="if(this.value.length==4) return false;" valida="field"/> ' +
            '   </div> ' +
            '</div>';


        md_confirmacaoServico = FLUIGC.modal({
            title: 'Confirmação do Serviço',
            content: htmlM,
            id: 'fluig-md_confirmacaoServico',
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

        $('#fluig-md_confirmacaoServico').on('click', '[data-confirma-modal]', function (ev) {
            var wToken = $('#md_token_' + $this.instanceId).val();

            if (wToken == "") {
                FLUIGC.toast({
                    message: 'Código TOKEN deve ser informado..',
                    type: 'danger'
                });
                return false;
            }




            const constraintDS = [
                publicDataset.createConstraint("indacao", 'UPD', 'UPD', ConstraintType.MUST),
                publicDataset.createConstraint("idregistro", token, token, ConstraintType.MUST),
                publicDataset.createConstraint("wtoken", wToken, wToken, ConstraintType.MUST),
                publicDataset.createConstraint("aprovar", wRadioAprova, wRadioAprova, ConstraintType.MUST),
                publicDataset.createConstraint("visitouobra", wRadioVisitaObra, wRadioVisitaObra, ConstraintType.MUST),
                publicDataset.createConstraint("obsobra", wDescMotivo, wDescMotivo, ConstraintType.MUST),
                publicDataset.createConstraint("numnota", wRadioNota, wRadioNota, ConstraintType.MUST),
            ];


            publicDataset.getDataset("dsk_instaladores", null, constraintDS, null, {
                success: data => {

                    if (data.hasOwnProperty("values") && data.values.length > 0) {
                        var regs = new Array();
                        for (var x = 0; x < data.values.length; x++) {

                            if (data.values[x]['STATUS'] == 'OK') {
                                $('.CorpoMensagem').hide();
                                $('.CorpoConfirmacao').show();
                            } else {
                                FLUIGC.toast({
                                    message: 'O código Token informado está incorreto, Favor verificar',
                                    type: 'danger'
                                });
                                loadWindow.hide();
                                return false;
                            }
                        }
                        loadWindow.hide();
                        md_confirmacaoServico.remove();
                    } else {
                        loadWindow.hide();
                        md_confirmacaoServico.remove();
                    }
                }
            });

        });

    }

});

