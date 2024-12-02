var $this = null;
var user_code = null;
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

            // Usuario Logado.
            user_code = WCMAPI.getUserCode();

            //Load do fluig
            loadWindow = FLUIGC.loading(window);

            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 30/09/2021 09:38<br>Técnico: Marcio M. Silva' });
            setMask();
            loadDataTable();
        }

    },

    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },

    executeAction: function (htmlElement, event) {
    }

});

