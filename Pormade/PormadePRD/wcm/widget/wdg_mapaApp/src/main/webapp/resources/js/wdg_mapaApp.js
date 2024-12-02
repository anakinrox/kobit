var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function () {
        // alert("oi OI");
        $this = this;

        if (!this.isEditMode) {
            //Carrega Título da página
            $('#page_title').html(WCMAPI.getPageTitle());

            // Usuario Logado.
            user_code = WCMAPI.getUserCode();
            //Load do fluig
            loadWindow = FLUIGC.loading(window);

            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 11/11/2021 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDadosDataTable('loadMapa', '');
        }

    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
        },
        global: {}
    },
    filtrar: function () {
        loadDadosDataTable('mapaLead', 'C');
    },
    executeAction: function (htmlElement, event) {
    }

});

