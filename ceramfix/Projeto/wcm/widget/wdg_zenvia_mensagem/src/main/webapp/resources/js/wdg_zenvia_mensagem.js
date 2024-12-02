var $this = null;
var loadWindow = null;

var MyWidget = SuperWidget.extend({
    init() {
        // throw new Error('Widget não deve ser adicionada diretamente na página');
        // f_visualizarLog();

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

            // this.app = new Vue({
            //     el: '#app',
            //     data: {
            //         dataTable: '',
            //         dadosDatatable: []
            //     }
            // });

            // loadDataTable('SYNC');
            // loadDadosDataTable('SYNC');

            // createModalComponent();
            f_zenvia_visualizarConversa('554791832890', '5547988112917', 'Marcio', 'M....');
        }
    }
});

