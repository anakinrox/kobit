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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 03/10/2021 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable("default");
        }

    },

    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-removerItem': ['click_delRow'],
        },
        global: {}
    },

    filtrar: function (htmlElement, event) {
        loadDadosDataTable('default');
    },

    delRow: function (el, ev) {
        var row = dataTable.getRow(dataTable.selectedRows()[0]);
        // row.codItem
        // alert("aqui");
        // return;

        FLUIGC.message.confirm({
            message: 'Sincroniar a SV [ ' + row.numsv + ' ]?',
            title: 'Forçar sincronização',
            labelYes: 'Confirma',
            labelNo: 'Cancelar'
        }, function (result, el, ev) {


            if (result == true) {
                loadWindow.show();

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'INTEGRAR', 'INTEGRAR', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('numsv', row.numsv, row.numsv, ConstraintType.MUST));

                DatasetFactory.getDataset("dts_consulta_lemontech", null, constraints, null, {
                    success: (data) => {
                        if (data.hasOwnProperty("values") && data.values.length > 0) {
                            if (data.values[0]["STATUS"] == "OK") {
                                FLUIGC.toast({
                                    message: 'SV Sincronizado com sucesso.',
                                    type: 'success'
                                });
                                loadDadosDataTable('default');
                            } else {
                                FLUIGC.toast({
                                    message: 'Erro ao sincronizar o Item.',
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
});

