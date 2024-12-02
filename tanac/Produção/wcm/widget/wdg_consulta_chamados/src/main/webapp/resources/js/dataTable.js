var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable() {
  // console.log('loadReceitas');
  rContent = ['ts', 'num_chamado', 'data_abertura', 'data_finalizacao', 'data_encerramento', 'titulo', 'solicitante', 'desc_secao', 'den_tipo', 'den_setor', 'categoria', 'subcategoria', 'prioridade', 'data_prev_inicio', 'data_prev_solucao', 'den_status', 'den_atividade'];

  rHeader = [{ 'title': '', 'width': '0%' },
  { 'title': 'Chamado', 'dataorder': 'num_chamado', 'width': '5%' },
  { 'title': 'Data Abertura', 'dataorder': 'data_abertura', 'width': '7%' },
  { 'title': 'Data Finalizado', 'dataorder': 'data_finalizacao', 'width': '7%' },
  { 'title': 'Data Encerrado', 'dataorder': 'data_encerramento', 'width': '7%' },
  { 'title': 'Título', 'dataorder': 'titulo', 'width': '16%' },
  { 'title': 'Solicitante', 'dataorder': 'titulo', 'width': '10%' },
  { 'title': 'Seção', 'dataorder': 'titulo', 'width': '10%' },
  { 'title': 'Tipo', 'dataorder': 'titulo', 'width': '10%' },
  { 'title': 'Setor Resp.', 'dataorder': 'titulo', 'width': '5%' },
  { 'title': 'Categoria', 'dataorder': 'titulo', 'width': '5%' },
  { 'title': 'SubCategoria', 'dataorder': 'titulo', 'width': '10%' },
  { 'title': 'Prior.', 'dataorder': 'prioridade', 'width': '0%' },
  { 'title': 'Data Prev. Inicio', 'dataorder': 'data_prev_inicio', 'width': '0%' },
  { 'title': 'Data Prev. Solução', 'dataorder': 'data_prev_solucao', 'width': '0%' },
  { 'title': 'Status', 'dataorder': 'den_status', 'width': '5%' },
  { 'title': 'Atividade', 'dataorder': 'den_atividade', 'width': '5%' },

  ];

  dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
    dataRequest: dadosDatatable,
    renderContent: rContent,
    limit: 10,
    responsive: true,
    tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
    emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
    header: rHeader,
    search: {
      enabled: false,
      onSearch: function (res) {
        // console.log( res );
        var data = dadosDatatable;
        var search = data.filter(function (el) {
          return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
        });
        dataTable.reload(search);
      },
      onlyEnterkey: false,
      searchAreaStyle: 'col-md-3'
    },
    scroll: {
      target: '#idtable_' + $this.instanceId,
      enabled: false
    },
    navButtons: {
      enabled: false,
    },
    draggable: {
      enabled: false
    },

  }, function (err, data) {
    if (err) {
      FLUIGC.toast({
        message: err,
        type: 'danger'
      });
    } else {
      loadWindow.hide();
    }
  });

}

function loadDadosDataTable() {
  loadWindow.show();

  var tPai = getTable('chamados', '');

  // WHEN (u.STATUS = 0 and NUM_SEQ_ESTADO in (70,57,65,90)) THEN 'Encerrado'


  var SQL = "	select  " +
    " u.NUM_PROCES as num_chamado, " +
    " sc.titulo, " +
    " sc.den_solicitante, " +
    " sc.desc_secao, " +
    " sc.den_tipo, " +
    " sc.den_setor, " +
    " sc.categoria, " +
    " sc.subcategoria, " +
    " sc.prioridade, " +
    " na.login, ra.full_name, " +
    " sc.data_abertura, " +
    " sc.hora_abertura, " +
    " CASE " +
    " WHEN LTRIM(RTRIM(sc.prev_inicio_atendimento)) <> ' ' then CONVERT(DATETIME, sc.prev_inicio_atendimento, 103) " +
    "   else null " +
    " end as prev_inicio_atendimento, " +
    " CASE " +
    " WHEN LTRIM(RTRIM(sc.prev_solucao)) <> ' ' then CONVERT(DATETIME, sc.prev_solucao, 103) " +
    "   else null " +
    " end as prev_solucao, " +
    " CASE " +
    " 	WHEN hp.NUM_SEQ_ESTADO IN (70, 57, 65, 90) " +
    " 	OR tp.LOG_ATIV IS NULL THEN ( " +
    " 	SELECT " +
    " 		CONVERT(DATETIME, max(movto_date_time), 103) " +
    " 	FROM " +
    " 		HISTOR_PROCES a " +
    " 	WHERE " +
    " 		COD_EMPRESA = an.COD_EMPRESA " +
    " 		AND NUM_PROCES = an.NUM_PROCES " +
    " 		AND NUM_SEQ_ESTADO IN (70, 57) " +
    " 		AND ( hp.NUM_SEQ_ESTADO IN (70, 57, 65, 90) " +
    " 			OR tp.LOG_ATIV IS NULL ) ) " +
    " 	ELSE NULL " +
    " END AS dat_finalizacao, " +
    " CONVERT(DATETIME, u.END_DATE, 103) as dat_encerramento, " +
    " CASE " +
    " 	WHEN u.STATUS = 0 " +
    " 	AND hp.NUM_SEQ_ESTADO IN (70, 57, 65, 90) THEN 'Finalizado' " +
    " 	WHEN u.STATUS = 0 THEN 'Aberto' " +
    " 	WHEN u.STATUS = 2 THEN 'Encerrado' " +
    " 	WHEN u.STATUS = 1 THEN 'Cancelado' " +
    " 	ELSE '' " +
    " END AS den_status, " +
    " v.DES_ESTADO as atividade " +
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
    " LEFT JOIN estado_proces v ON (v.COD_EMPRESA = tp.COD_EMPRESA " +
    "                         AND v.COD_DEF_PROCES = u.COD_DEF_PROCES " +
    "                         AND v.NUM_SEQ = hp.NUM_SEQ_ESTADO " +
    "                         AND v.NUM_VERS = u.NUM_VERS) " +
    " join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) " +
    " join fdn_user ra on ( ra.USER_ID = na.USER_ID ) " +
    "	where dc.versao_ativa = 1 ";

  if ($('#cod_atendente_' + $this.instanceId).val() != '') {
    SQL += " and (SELECT COUNT(*) " +
      "       from tar_proces " +
      "      where CD_MATRICULA = '" + $('#cod_atendente_' + $this.instanceId).val() + "' " +
      "        AND tar_proces.COD_EMPRESA = an.COD_EMPRESA " +
      "        AND tar_proces.num_proces = an.num_proces ) > 0";
  }

  if ($('#num_chamado_' + $this.instanceId).val() != '') {
    SQL += " and u.NUM_PROCES = " + $('#num_chamado_' + $this.instanceId).val();
  }

  var objCkeck1 = document.getElementById("checkbox-1_" + $this.instanceId);
  var objCkeck2 = document.getElementById("checkbox-2_" + $this.instanceId);
  var objCkeck3 = document.getElementById("checkbox-3_" + $this.instanceId);
  var objCkeck4 = document.getElementById("checkbox-4_" + $this.instanceId);

  if (objCkeck1.checked || objCkeck2.checked || objCkeck3.checked || objCkeck4.checked) {
    var wIndFiltro = false;
    SQL += " and ( ";

    if (objCkeck1.checked) {
      SQL += " u.status = 0 and hp.NUM_SEQ_ESTADO not in (70,57,65,90)";
      wIndFiltro = true;
    }

    if (objCkeck4.checked) {
      if (wIndFiltro) { SQL += " or "; }
      SQL += " u.status = 2";
      wIndFiltro = true;
    }

    if (objCkeck3.checked) {
      if (wIndFiltro) { SQL += " or "; }
      SQL += " u.status = 1";
      wIndFiltro = true;
    }

    if (objCkeck2.checked) {
      if (wIndFiltro) { SQL += " or "; }
      SQL += " u.STATUS = 0 and hp.NUM_SEQ_ESTADO in (70,57,65,90) ";
      wIndFiltro = true;
    }

    SQL += " ) ";
  }

  if ($('#titulo_' + $this.instanceId).val() != '') {
    SQL += " and sc.titulo like '%" + $('#titulo_' + $this.instanceId).val() + "%' ";
  }

  if ($('#cod_solicitante_' + $this.instanceId).val() != '') {
    SQL += " and sc.mat_solicitante = '" + $('#cod_solicitante_' + $this.instanceId).val() + "' ";
  }

  if ($('#cod_atividade_' + $this.instanceId).val() != '') {
    SQL += " 	and hp.num_seq_estado = '" + $('#cod_atividade_' + $this.instanceId).val() + "'";
  }

  if ($('#cod_secao_' + $this.instanceId).val() != '') {
    SQL += " and sc.cod_secao = '" + $('#cod_secao_' + $this.instanceId).val() + "' ";
  }

  if ($('#cod_tipo_' + $this.instanceId).val() != '') {
    SQL += " and sc.cod_tipo = '" + $('#cod_tipo_' + $this.instanceId).val() + "' ";
  }

  if ($('#cod_setor_' + $this.instanceId).val() != '') {
    SQL += " and sc.cod_setor = '" + $('#cod_setor_' + $this.instanceId).val() + "' ";
  }

  if ($('#cod_categoria_' + $this.instanceId).val() != '') {
    SQL += " and sc.cod_categoria = '" + $('#cod_categoria_' + $this.instanceId).val() + "' ";
  }

  if ($('#subcategoria_' + $this.instanceId).val() != '') {
    SQL += " and sc.subcategoria = '" + $('#subcategoria_' + $this.instanceId).val() + "' ";
  }

  if ($('#dt_ini_' + $this.instanceId).val() != '' && $('#dt_fim_' + $this.instanceId).val() != '') {
    var dat_ini = $('#dt_ini_' + $this.instanceId).val().split('/').reverse().join('-');
    var dat_fim = $('#dt_fim_' + $this.instanceId).val().split('/').reverse().join('-');
    SQL += " and cast( u.start_date as date ) between '" + dat_ini + "' and '" + dat_fim + "' ";
  }

  SQL += " order by sc.prioridade desc ";

  // console.log("SQL: " + SQL);


  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS', null, ConstraintType.MUST));

  var callback = {
    success: function (dataSet) {
      // console.log(dataSet.values);
      if (dataSet != null && dataSet != undefined) {

        var data = dataSet.values;

        btnTS = '<button id="testbut" class="btn btn-info btn-xs" data-consulta-processo> ' +
          '	<span class="fluigicon fluigicon-process icon-sm"> ' +
          '</button>' +
          '<button id="testbut" class="btn btn-success btn-xs" data-aponta-horas> ' +
          '	<span class="fluigicon fluigicon-tag icon-sm"> ' +
          '</button>';

        var regs = new Array();
        for (var i = 0; i < data.length; i++) {
          var datatableRow = {
            ts: btnTS,
            num_chamado: data[i]['num_chamado'],
            data_abertura: data[i]['data_abertura'] + ' ' + dataFormatada('2021-01-01 ' + data[i]['hora_abertura'], 'H'),
            data_finalizacao: dataFormatada(data[i]['dat_finalizacao'], 'T'),
            data_encerramento: dataFormatada(data[i]['dat_encerramento'], 'T'),
            titulo: data[i]['titulo'],
            solicitante: data[i]['den_solicitante'],
            desc_secao: data[i]['desc_secao'],
            den_tipo: data[i]['den_tipo'],
            den_setor: data[i]['den_setor'],
            categoria: data[i]['categoria'],
            subcategoria: data[i]['subcategoria'],
            prioridade: data[i]['prioridade'],
            data_prev_inicio: dataFormatada(data[i]['prev_inicio_atendimento'], 'T'),
            data_prev_solucao: dataFormatada(data[i]['prev_solucao'], 'T'),
            den_status: data[i]['den_status'],
            den_atividade: data[i]['atividade'],

          }
          regs.push(datatableRow);
        }

        dataTable.reload(regs);
        loadWindow.hide();

      } else {
        toast('Nenhum dado encontrado', 'warning');
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  };

  function formataData(data) {
    var dataRetorno = ' ';
    if (data != 'null') {
      dataRetorno = data.split('-').reverse().join('/')
    }
    return dataRetorno;
  }

  function dataFormatada(d, indRetorno) {
    var dataRetorno = ' ';
    if (d != 'null' && d != '') {
      var data = new Date(d),
        dia = data.getDate(),
        mes = data.getMonth() + 1,
        ano = data.getFullYear(),
        hora = data.getHours(),
        minutos = data.getMinutes(),
        segundos = data.getSeconds();

      if (indRetorno == 'T') { dataRetorno = [adicionaZero(dia), adicionaZero(mes), ano].join('/') + ' ' + [adicionaZero(hora), adicionaZero(minutos)].join(':'); }
      if (indRetorno == 'D') { dataRetorno = [adicionaZero(dia), adicionaZero(mes), ano].join('/'); }
      if (indRetorno == 'H') { dataRetorno = [adicionaZero(hora), adicionaZero(minutos)].join(':'); }
    }
    return dataRetorno;
  }

  function adicionaZero(numero) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }


  var dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);

}