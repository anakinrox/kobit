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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 20/02/2023 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable('TC');
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-excel': ['click_loadExcel'],
            'order-by': ['click_orderBy'],
        }
    },

    loadExcel: function (el, ev) {

        var idTable = "";
        $("table[id^=fluig-table-]", '#idtable' + '_' + $this.instanceId).each(function (index) {
            idTable = $(this).attr("id");
        });

        //Nome arquivo
        var fileName = 'hierarquia_' + WCMAPI.getUserLogin() + '_' + $.now();
        var table = document.getElementById('idtable' + '_' + $this.instanceId).children[1];

        exportToXLS(table, fileName, 'hierarquia');

    },

    filtrar: function (htmlElement, event) {
        loadDadosDataTable('TC');
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

    executeAction: function (htmlElement, event) {
    }
});
