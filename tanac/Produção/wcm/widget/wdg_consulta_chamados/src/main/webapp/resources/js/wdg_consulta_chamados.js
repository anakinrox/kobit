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
        //Carrega Título da página
        $('#page_title').html(WCMAPI.getPageTitle());
        //Carrega usuário logado
        user_code = WCMAPI.getUserCode();
        //Load do fluig
        loadWindow = FLUIGC.loading(window);
        //Mostra o load
        // loadWindow.show();
        // loadWindow.hide();

        // verifica se está em modo de edição
        if (!this.isEditMode) {
            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 10/05/2021 09:38<br>Técnico: Tiago Tsukahara' });

            setMask();
            loadDataTable();

        }

    },

    //BIND de eventos
    bindings: {
        local: {
            'consulta-processo': ['click_consultaProcesso'],
            'load-filtrar': ['click_loadFiltro'],
            'aponta-horas': ['click_apontaHoras'],
            'load-excel': ['click_loadExcel'],
            'order-by': ['click_orderBy'],
        },
        global: {}
    },

    loadFiltro: function () {
        loadDadosDataTable();
    },

    loadExcel: function (el, ev) {

        var idTable = "";
        $("table[id^=fluig-table-]", '#idtable' + '_' + $this.instanceId).each(function (index) {
            idTable = $(this).attr("id");
        });

        //Nome arquivo
        var fileName = 'consultaChamados_' + WCMAPI.getUserLogin() + '_' + $.now();

        $("#" + idTable).btechco_excelexport({
            containerid: idTable,
            datatype: $datatype.Table,
            returnUri: true,
            filename: fileName
        });

    },


    consultaProcesso: function () {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        // console.log("Console: " + selected);

        var processo = selected.num_chamado;

        var WCMAPI = window.parent.WCMAPI;

        var url = WCMAPI.getTenantURL() + '/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + processo;

        window.open(url, '_blank');
    },

    apontaHoras: function () {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        // console.log("Index: " + index + " Selected: " + selected);
        // console.log("Campo Numchamado1: " + selected.md_num_chamado);
        // console.log("Campo DataFinalizado: " + selected.dat_finalizacao);


        var html = '<div class="row"> ' +
            '	<div class="col-md-5"> ' +
            '		<label for="exampleTag">Chamado</label> ' +
            '		<input type="text" class="form-control valida" id="md_chamado" name="md_chamado" readonly/> ' +
            '	</div> ' +
            '	<div class="col-md-7"> ' +
            '		<label for="exampleTag">Atendente</label> ' +
            '		<input type="text" class="form-control valida" id="md_usuario" name="md_usuario" readonly/> ' +
            '		<input type="hidden" id="md_cod_usuario" name="md_cod_usuario" /> ' +
            '	</div> ' +
            '</div>' +
            '<div class="row"> ' +
            '	<div class="col-md-6"> ' +
            '		<div class="col-md-6 fs-no-padding"> ' +
            '			<div class="form-group"> ' +
            '				<label for="exampleTag">Data Ini</label> ' +
            '				<input type="date" class="form-control valida" id="md_data_ini" name="md_data_ini" /> ' +
            '			</div> ' +
            '		</div> ' +
            '		<div class="col-md-6 fs-no-padding"> ' +
            '			<div class="form-group"> ' +
            '				<label for="exampleTag">Hora Ini</label> ' +
            '				<input type="time" class="form-control valida" step="1" id="md_hora_ini" name="md_hora_ini" /> ' +
            '			</div> ' +
            '		</div> ' +
            '	</div> ' +
            '	<div class="col-md-6"> ' +
            '		<div class="col-md-6 fs-no-padding"> ' +
            '			<div class="form-group"> ' +
            '				<label for="exampleTag">Data Fim</label> ' +
            '				<input type="date" class="form-control valida" id="md_data_fim" name="md_data_fim" /> ' +
            '			</div> ' +
            '		</div> ' +
            '		<div class="col-md-6 fs-no-padding"> ' +
            '			<div class="form-group"> ' +
            '				<label for="exampleTag">Hora Fim</label> ' +
            '				<input type="time" class="form-control valida" step="1" id="md_hora_fim" name="md_hora_fim" /> ' +
            '			</div> ' +
            '		</div> ' +
            '	</div> ' +
            '</div>' +
            '<div class="row"> ' +
            '	<div class="col-md-12"> ' +
            '		<textarea class="form-control valida" rows="2" id="md_apontamento" name="md_apontamento" ></textarea> ' +
            '	</div> ' +
            '</div>';

        var md_apontamento = FLUIGC.modal({
            title: 'Apontamento Hora',
            content: html,
            id: 'fluig-modal',
            size: 'large',
            actions: [{
                'label': 'Apontar',
                'bind': 'data-confirma-modal',
            }, {
                'label': 'Cancelar',
                'autoClose': true
            }]
        }, function (err, data) {
            if (err) {
                // do error handling
            } else {
                // do something with data

                $('#md_data_ini').val(DataHoje().split('/').reverse().join('-'));
                // $('#md_data_ini').attr( 'max', DataHoje().split('/').reverse().join('-') );
                $('#md_hora_ini').val(HoraHoje());
                $('#md_data_fim').val(DataHoje().split('/').reverse().join('-'));
                $('#md_data_fim').attr('max', DataHoje().split('/').reverse().join('-'));
                $('#md_cod_usuario').val(user_code);
                $('#md_chamado').val(selected.num_chamado)

                var constraints = new Array();

                constraints.push(DatasetFactory.createConstraint('colleagueId', user_code, user_code, ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset('colleague', null, constraints, null);
                $('#md_usuario').val(dataset.values[0]['colleagueName']);
            }
        });

        $('#fluig-modal').on('click', '[data-confirma-modal]', function (ev) {
            var index = dataTable.selectedRows()[0];
            var selected = dataTable.getRow(index);

            var dataCompleta = selected.data_encerramento;
            var data = dataCompleta.split(' ')[0];
            var hora = dataCompleta.split(' ')[1];
            var dt_encerrado = new Date(data.split('/').reverse().join('-') + ' ' + hora);

            var dataCompleta = selected.data_abertura;
            var data = dataCompleta.split(' ')[0];
            var hora = dataCompleta.split(' ')[1];
            var dt_abertura = new Date(data.split('/').reverse().join('-') + ' ' + hora);


            var dt_ini = new Date($('#md_data_ini').val() + ' ' + $('#md_hora_ini').val());
            var dt_ini = new Date($('#md_data_ini').val() + ' ' + $('#md_hora_ini').val());
            var dt_fim = new Date($('#md_data_fim').val() + ' ' + $('#md_hora_fim').val());
            var dt_hoje = new Date();

            if (dt_ini - dt_hoje > 0) {
                toast('Data inicial não pode ser maior que hoje', 'danger');
                return false;
            }

            if (dt_ini - dt_hoje > 0) {
                toast('Data inicial não pode ser maior que hoje', 'danger');
                return false;
            }

            if (dt_fim - dt_hoje > 0) {
                toast('Data final não pode ser maior que hoje', 'danger');
                return false;
            }

            if (dt_ini - dt_fim > 0) {
                toast('Data inicial não pode ser maior que data final', 'danger');
                return false;
            }

            if (dt_fim > dt_encerrado) {
                toast('Data do apontamento não pode ser posterior à data de encerramento do chamado', 'danger');
                return false;
            }

            if (dt_ini < dt_abertura) {
                toast('Data do apontamento não pode ser inferior à data da abertura do chamado', 'danger');
                return false;
            }

            var qtd = 0;
            var constraints = new Array();

            $("input[name*=md_], textarea[name*=md_]").each(function (index) {
                if ($(this).val() == '' && $(this).hasClass('valida')) {
                    qtd++;
                }

                constraints.push(DatasetFactory.createConstraint(this.id.replace('md_', ''), this.value, 'field', ConstraintType.MUST));
            });

            if (qtd > 0) {
                toast('Existem campos obrigatórios não preenchidos', 'danger');
                return false;
            }

            var tPai = getTable('chamados', '');

            // Valida numero de chamado
            var SQL = "	select sc.*, na.login, ra.full_name" +
                "	from " + tPai + " sc " +
                "	join documento dc on (dc.cod_empresa = sc.companyid " +
                "			           and dc.nr_documento = sc.documentid " +
                " 			           and dc.nr_versao = sc.version) " +
                "	join anexo_proces an on (an.COD_EMPRESA = sc.companyid " +
                "					   and an.NR_DOCUMENTO = sc.documentid) " +
                " join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA " +
                "                        and u.NUM_PROCES = an.NUM_PROCES ) " +
                " left join tar_proces tp on (tp.COD_EMPRESA = an.COD_EMPRESA  " +
                "                      and tp.NUM_PROCES = an.NUM_PROCES  " +
                "                      and tp.LOG_ATIV = '1' )  " +
                " left join histor_proces hp on (hp.COD_EMPRESA = tp.COD_EMPRESA  " +
                "                         and hp.NUM_PROCES = tp.NUM_PROCES  " +
                "                         and hp.NUM_SEQ_MOVTO = tp.NUM_SEQ_MOVTO)  " +
                " join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) " +
                " join fdn_user ra on ( ra.USER_ID = na.USER_ID ) " +
                "	where dc.versao_ativa = 1 " +
                "   and sc.num_chamado <> '0' " +
                " and sc.num_chamado = '" + $('#md_chamado').val() + "' " +
                " order by sc.prioridade desc ";

            var ct = new Array();
            ct.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
            ct.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
            var ds = DatasetFactory.getDataset("select", null, ct, null);

            var qtd = 0;
            if (ds != null && ds != undefined) {
                qtd = ds.values.length;
            }

            if (qtd == 0) {
                toast('Chamado não existe', 'danger');
                return false;
            }

            constraints.push(DatasetFactory.createConstraint('atividade', '4', '4', ConstraintType.MUST));

            constraints.push(DatasetFactory.createConstraint('processo', 'wf_apontamento_chamado', 'wf_apontamento_chamado', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('usuario', user_code, user_code, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('iniciarProcesso', 'S', 'S', ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset('processo_movimento', null, constraints, null);

            // console.log(dataset);
            toast('Apontamento efetuado com sucesso, processo: ' + dataset.values[0]['atividade'] + ' !', 'success');

            md_apontamento.remove();
        });

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

});