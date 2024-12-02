var $this = null;
var loadWindow = null;
var md_condominio = null;
var md_addcondominio = null;
var md_addEngenheiro = null;
var editRow = false;

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
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 06/03/2024 09:38<br>Técnico: Marcio Silva' });

            loadDataTable('CONDOMINIO');
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
        },
        global: {
            'dbclick-tbl': ['dblclick_editRow'],
            'click-tbl': ['click_cancelar'],
            'update-row': ['click_updaterow'],
            'remover-row': ['click_removerrow'],
            'order-by': ['click_orderBy'],
        }
    },

    filtrar: function (htmlElement, event) {

        loadDadosDataTable("CONDOMINIO", $('#cod_UF_' + $this.instanceId).val(), $('#cod_cidade_' + $this.instanceId).val());
    },
    removerrow: function (el, ev) {
        var row = dataTableItem.getRow(dataTableItem.selectedRows()[0]);

        FLUIGC.message.confirm({
            message: 'Remover o Engenheiro [ ' + row.nome + ' ]?',
            title: 'Remover item',
            labelYes: 'Confirma',
            labelNo: 'Cancelar'
        }, function (result, el, ev) {
            if (result == true) {
                dataTableItem.removeRow(dataTableItem.selectedRows()[0]);
            }
        });
    },
    cancelar: function (el, ev) {
        var row = dataTableItem.getRow(dataTableItem.selectedRows()[0]);

        if (editRow == true) {
            if (wCodItemSelected != row.codigo) {
                wCodItemSelected = null;
                editRow = false;
                dataTableItem.reload();
            }
        }
    },
    editRow: function (el, ev) {

        try {
            loadWindow.show();
            var row = dataTableItem.getRow(dataTableItem.selectedRows()[0]);
            dataTableItem.updateRow(dataTableItem.selectedRows()[0], row, '.template_datatable_edit');

            editRow = true;
            wCodItemSelected = row.codigo;

            $('#datatable-input-codigo').val(row.codigo);
            $('#datatable-input-nome').val(row.nome);
            $('#datatable-input-telefone').val(row.telefone);
            $('#datatable-input-registro').val(row.registro);
            $('#datatable-input-obras').val(row.obras);
            $('#datatable-input-obras').focus();
        } catch (error) {

        } finally {
            loadWindow.hide();
        }

    },
    updaterow: function (el, ev) {
        var strIcone = "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Engenheiro' data-remover-row></i>";
        var editedRow = {
            codigo: $('#datatable-input-codigo').val(),
            nome: $('#datatable-input-nome').val(),
            telefone: $('#datatable-input-telefone').val(),
            registro: $('#datatable-input-registro').val(),
            obras: $('#datatable-input-obras').val(),
            ts: strIcone
        };
        dataTableItem.updateRow(dataTableItem.selectedRows()[0], editedRow);
    },
    orderBy: function (htmlElement, event) {
        console.log('Disparou');
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


        dados = dataTableItem.getData();

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

        dataTableItem.reload(dados);
    },
});

function f_showCondominio(pIdCondominio, pNomCondominio, pUF, pCidade, pUnidades, pConcluidas, pConstrucao, pLatitude, pLongitude) {

    // alert('ID: ' + pIdPorposta + ' Proposta: ' + pNumProposta + ' CLiente: ' + pCliente + ' IdInstalador: ' + pIdInstalador + ' Instalador: ' + pNomInstalador);

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Condomínio</label>' +
        '       <input type="hidden" class="" name="id_condominio_' + $this.instanceId + '" id="id_condominio_' + $this.instanceId + '" value="' + pIdCondominio + '"/>' +
        '       <input type="hidden" class="" name="md_latitude_' + $this.instanceId + '" id="md_latitude_' + $this.instanceId + '"/>' +
        '       <input type="hidden" class="" name="md_longitude_' + $this.instanceId + '" id="md_longitude_' + $this.instanceId + '"/>' +
        '       <input type="text" class="form-control grp_condominio valida" name="nome_condominio_' + $this.instanceId + '" id="nome_condominio_' + $this.instanceId + '" valida="field" value="' + pNomCondominio + '" />' +
        '   </div> ' +

        '   <div class="col-md-6"> ' +
        '       <div class="col-md-3"> ' +
        '           <label class="control-label" for="">UF</label> ' +
        '           <input type="text" class="form-control" id="uf_' + $this.instanceId + '" name="uf_' + $this.instanceId + '"  value="' + pUF + '"readonly/> ' +
        '       </div> ' +
        '       <div class="col-md-8"> ' +
        '           <label class="control-label" for="">Cidade</label> ' +
        '           <input type="text" class="form-control" id="cidade_' + $this.instanceId + '" name="cidade_' + $this.instanceId + '"  value="' + pCidade + '" readonly/> ' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-2"> ' +
        '       <label class="control-label" for="txtNome">Unidades</label> ' +
        '       <input type="number" class="form-control grp_user valida" name="md_num_unidades_' + $this.instanceId + '" id="md_num_unidades_' + $this.instanceId + '" value="' + pUnidades + '"valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-2"> ' +
        '       <label class="control-label" for="txtNome">Concluídas</label> ' +
        '       <input type="number" class="form-control grp_user valida" name="md_num_concluidas_' + $this.instanceId + '" id="md_num_concluidas_' + $this.instanceId + '" value="' + pConcluidas + '"valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-2"> ' +
        '       <label class="control-label" for="txtNome">Em consutrução</label> ' +
        '       <input type="number" class="form-control grp_user valida" name="md_num_construcao_' + $this.instanceId + '" id="md_num_construcao_' + $this.instanceId + '" value="' + pConstrucao + '"valida="field"/> ' +
        '   </div> ' +

        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Mapa<i class="flaticon flaticon-pin-map icon-xl" aria-hidden="true" onclick="f_addCondominio(\'' + pIdCondominio + '\',\'' + pNomCondominio + '\',\'' + pUF + '\',\'' + pCidade + '\');"></i></label> ' +
        '       <div id="idmap_' + $this.instanceId + '" style="width:80%;height:250px;"></div>  ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '   &nbsp; ' +
        '   </div> ' +
        '</div> ' +

        '<div class="row"> ' +
        '   <div class="col-md-12" align="center"> ' +
        '       <div class="panel panel-success class"> ' +
        '           <div class="panel-heading fs-txt-center"> ' +
        '               <table width="100%"> ' +
        '                   <tr> ' +
        '                       <td width="100%" align="right"><button type="button" class="fluigicon fluigicon-plus-sign fluigicon-sm" onclick="f_incluirItemN();"></button></td> ' +
        '                   </tr> ' +
        '               </table> ' +
        '           </div> ' +
        '           <div class="panel-body"> ' +
        '               <div style="position:relative;overflow:hidden; height:253px;overflow-y: scroll"><div id="idTBLItem_' + $this.instanceId + '" data-dbclick-tbl data-click-tbl></div></div>' +
        '           </div> ' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-12" style="display:flex; justify-content: flex-end"> ' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-danger btn-lg btn-block" title=Cancelar" onclick="md_condominio.remove();"><i class="flaticon flaticon-close icon-xs" aria-hidden="true"></i> Cancelar</button>' +
        '       </div>' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-success btn-lg btn-block" title="Confirma" onclick="f_alteradoRegistro();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Confirmar</button>' +
        '       </div>' +
        '   </div> ' +

        '</div>';


    md_condominio = FLUIGC.modal({
        title: 'Condomínio',
        content: htmlM,
        id: 'fluig-condominio',
        size: 'full',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_condominio').ready(function () {


        loadDataTable('ENGENHEIROS');
        loadDadosDataTable('loadMapa');
        loadDadosDataTable('mapMarker', pLatitude, pLongitude);
        loadDadosDataTable('DETAILCONDOMINIO', '', '', pIdCondominio);


    });
}

function f_addCondominio(pIdCondominio, pNomCondominio, pUF, pCidade) {

    // alert('ID: ' + pIdPorposta + ' Proposta: ' + pNumProposta + ' CLiente: ' + pCliente + ' IdInstalador: ' + pIdInstalador + ' Instalador: ' + pNomInstalador);

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-8"> ' +
        '       <label class="control-label" for="txtNome">Condomínio</label> ' +
        '       <input type="hidden" class="form-control grp_user valida" name="md_id_condominio_' + $this.instanceId + '" id="md_id_condominio_' + $this.instanceId + '" valida="field"/> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_condominio_' + $this.instanceId + '" id="md_condominio_' + $this.instanceId + '" valida="field"/> ' +
        '   </div> ' +
        '</div>' +
        '<div class="row"> ' +
        '   <div class="col-sm-4"> ' +
        '       <label class="control-label" for="txtNome">UF</label> ' +
        '       <div class="input-group"> ' +
        '           <input name="md_UF_' + $this.instanceId + '" id="md_UF_' + $this.instanceId + '" type="text" class="form-control grp_md_uf" readonly> ' +
        '               <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_md_uf\').val(\'\')"></span> ' +
        '               <span id="bt_md_uf" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"> ' +
        '                   <input name="cod_md_UF_' + $this.instanceId + '" id="cod_md_UF_' + $this.instanceId + '" type="hidden" class="grp_md_uf"> ' +
        '               </span> ' +
        '       </div> ' +
        '   </div> ' +
        '   <div class="col-sm-6"> ' +
        '       <label class="control-label" for="txtNome">Cidade</label> ' +
        '       <div class="input-group"> ' +
        '           <input name="md_cidade_' + $this.instanceId + '" id="md_cidade_' + $this.instanceId + '" type="text" class="form-control grp_md_cidade" readonly> ' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_md_cidade\').val(\'\')"></span> ' +
        '           <span id="md_bt_cidade" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"> ' +
        '              <input name="md_cod_cidade_' + $this.instanceId + '" id="md_cod_UF_' + $this.instanceId + '" type="hidden" class="grp_md_cidade"> ' +
        '           </span> ' +
        '       </div> ' +
        '   </div> ' +

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Endereço</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_endereco_' + $this.instanceId + '" id="md_endereco_' + $this.instanceId + '" valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Bairro</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_bairro_' + $this.instanceId + '" id="md_bairro_' + $this.instanceId + '" valida="field"/> ' +
        '   </div> ' +

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '   &nbsp; ' +
        '   </div> ' +
        '</div> ' +

        '<div class="row"> ' +
        '   <div class="col-md-12" style="display:flex; justify-content: flex-end"> ' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-danger btn-lg btn-block" title=Cancelar" onclick="md_addcondominio.remove();"><i class="flaticon flaticon-close icon-xs" aria-hidden="true"></i> Cancelar</button>' +
        '       </div>' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-success btn-lg btn-block" title="Confirma" onclick="f_incluirRegistro();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Confirmar</button>' +
        '       </div>' +
        '   </div> ' +

        '</div>';


    md_addcondominio = FLUIGC.modal({
        title: 'Condomínio',
        content: htmlM,
        id: 'fluig-addcondominio',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_addcondominio').ready(function () {

        if (pIdCondominio != undefined && pIdCondominio != '') {
            $('#md_id_condominio_' + $this.instanceId).val(pIdCondominio);
            $('#md_condominio_' + $this.instanceId).val(pNomCondominio);
            $('#cod_md_UF_' + $this.instanceId).val(pUF);
            $('#md_UF_' + $this.instanceId).val(pUF);
            $('#md_cidade_' + $this.instanceId).val(pCidade);
        }

    });
}

function f_addEngenheiro() {

    // alert('ID: ' + pIdPorposta + ' Proposta: ' + pNumProposta + ' CLiente: ' + pCliente + ' IdInstalador: ' + pIdInstalador + ' Instalador: ' + pNomInstalador);

    var htmlM = '<div class="row"> ' +
        '   <div class="col-md-8"> ' +
        '       <label class="control-label" for="txtNome">Nome</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_engenheiro_' + $this.instanceId + '" id="md_engenheiro_' + $this.instanceId + '" valida="field"/> ' +
        '   </div> ' +
        '</div>' +


        '<div class="row"> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Telefone</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_num_telefone_' + $this.instanceId + '" id="md_num_telefone_' + $this.instanceId + '" onkeyup="handlePhone(event);" maxlength="25" placeholder="(00) 00000-0000" data-contato valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">Registro</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_registro_' + $this.instanceId + '" id="md_registro_' + $this.instanceId + '" valida="field"/> ' +
        '   </div> ' +

        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '   &nbsp; ' +
        '   </div> ' +
        '</div> ' +

        '<div class="row"> ' +
        '   <div class="col-md-12" style="display:flex; justify-content: flex-end"> ' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-danger btn-lg btn-block" title=Cancelar" onclick="md_addEngenheiro.remove();"><i class="flaticon flaticon-close icon-xs" aria-hidden="true"></i> Cancelar</button>' +
        '       </div>' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-success btn-lg btn-block" title="Confirma" onclick="f_incluirEngenheiro();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Confirmar</button>' +
        '       </div>' +
        '   </div> ' +

        '</div>';


    md_addEngenheiro = FLUIGC.modal({
        title: 'Engenheiro',
        content: htmlM,
        id: 'fluig-engenheiro',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_addEngenheiro').ready(function () {


    });
}