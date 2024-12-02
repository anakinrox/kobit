var dataTable = null;
var dadosDatatable = [];

function loadDescarga() {
  console.log('loadDescarga');

  rContent = ['motorista', 'placa', 'data_descarga', 'ajudante', 'telefone', 'valor_descarga', 'ts'];

  rHeader = [{ 'title': 'Motorista', 'dataorder': 'motorista', 'width': '10%' },
  { 'title': 'Placa', 'dataorder': 'placa', 'width': '10%' },
  { 'title': 'Data Descarga', 'dataorder': 'data_descarga', 'width': '10%' },
  { 'title': 'Ajudante', 'dataorder': 'ajudante', 'width': '10%' },
  { 'title': 'Telefone', 'dataorder': 'telefone', 'width': '10%' },
  { 'title': 'Valor Descarga', 'dataorder': 'valor_descarga', 'width': '10%' },
  { 'title': '', 'display': false, 'width': '0%' },
  ];

  dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
    dataRequest: dadosDatatable,
    renderContent: rContent,
    limit: 10,
    responsive: true,
    // tableStyle:'table table-striped table-responsive',
    emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
    header: rHeader,
    search: {
      enabled: false,
      onSearch: function (res) {
        console.log(res);
        var data = dadosDatatable;
        var search = data.filter(function (el) {
          return (el.des_def_proces.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.den_status.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.num_proces.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.full_name_requisit.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.full_name.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.start_date.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
            el.end_date.toUpperCase().indexOf(res.toUpperCase()) >= 0)
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
    }
  });

  loadDadosDescarga();

}

function loadDadosDescarga() {
  var tSolicao = getTable('acerto_viagem', '');
  var tDescarga = getTable('acerto_viagem', 'descarga');
  // var tVeiculo = getTable('veiculo', '');
  var tVeiculo = getTable('cadastro_veiculos', '');

  var dt_ini = $('#dt_ini_' + $this.instanceId).val().split('/').reverse().join('/');
  var dt_fim = $('#dt_fim_' + $this.instanceId).val().split('/').reverse().join('/');

  var SQL = "	select sc.*, " +
    "			it.* " +
    "	from " + tSolicao + " sc " +
    "	join documento dc on (dc.cod_empresa = sc.companyid " +
    "			           and dc.nr_documento = sc.documentid " +
    " 			           and dc.nr_versao = sc.version) " +
    "	join anexo_proces an on (an.COD_EMPRESA = sc.companyid " +
    "					   and an.NR_DOCUMENTO = sc.documentid) " +
    "	join " + tDescarga + " it on (it.companyid = sc.companyid " +
    "			       		and it.documentid = sc.documentid " +
    "			       		and it.version = sc.version) " +
    " left join " + tVeiculo + " pr on ( pr.placa = sc.placa ) " +
    " join documento dc2 on (dc2.cod_empresa = pr.companyid " +
    " 			 and dc2.nr_documento = pr.documentid " +
    " 			 and dc2.nr_versao = pr.version " +
    " 			 and dc2.versao_ativa = 1) " +

    "	where dc.versao_ativa = 1 ";

  if ($('#data_refer_' + $this.instanceId).val() == 'S') {
    SQL += "  and STR_TO_DATE( IFNULL(sc.data_saida,'00/00/0000'), '%d/%m/%Y' ) between '" + dt_ini + "' AND '" + dt_fim + "'";
  }

  if ($('#data_refer_' + $this.instanceId).val() == 'C') {
    SQL += "  and STR_TO_DATE( IFNULL(sc.data_chegada,'00/00/0000'), '%d/%m/%Y' ) between '" + dt_ini + "' AND '" + dt_fim + "'";
  }

  if ($('#data_refer_' + $this.instanceId).val() == 'F') {
    SQL += "  and STR_TO_DATE( IFNULL(sc.data_fechamento,'00/00/0000'), '%d/%m/%Y' ) between '" + dt_ini + "' AND '" + dt_fim + "'";
  }

  if ($('#data_refer_' + $this.instanceId).val() == 'L') {
    SQL += "  and STR_TO_DATE( IFNULL(it.data_descarga,'00/00/0000'), '%d/%m/%Y' ) between '" + dt_ini + "' AND '" + dt_fim + "'";
  }

  if ($('#cod_motorista_' + $this.instanceId).val() != '') {
    SQL += " 	and sc.matricula_fluig = '" + $('#cod_motorista_' + $this.instanceId).val() + "'";
  }

  if ($('#placa_' + $this.instanceId).val() != '') {
    SQL += " 	and sc.placa = '" + $('#placa_' + $this.instanceId).val() + "'";
  }

  if ($('#cod_ajudante_' + $this.instanceId).val() != '') {
    SQL += " 	and it.ajudante_descarga = '" + $('#den_ajudante_' + $this.instanceId).val() + "'";
  }

  if ($('#cod_proprietaria_' + $this.instanceId).val() != '') {
    SQL += " 	and pr.empresa = '" + $('#cod_proprietaria_' + $this.instanceId).val() + "'";
  }

  if ($('#estado_' + $this.instanceId).val() != '') {
    SQL += " 	and sc.cod_uni_feder = '" + $('#estado_' + $this.instanceId).val() + "'";
  }

  if ($('#nf_' + $this.instanceId).val() != '') {
    SQL += " 	and sc.nf_descarga = '" + $('#nf' + $this.instanceId).val() + "'";
  }

  SQL += " order by motorista, STR_TO_DATE( IFNULL(it.data_descarga,'00/00/0000'), '%d/%m/%Y' ) ";

  console.log(SQL);
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS', null, ConstraintType.MUST));

  var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
  console.log('select');
  console.log(dataSet.values);

  var regs = new Array();

  var valorTotal = 0;
  var valorTotalGer = 0;

  if (dataSet != null && dataSet != undefined) {

    for (var i = 0; i < dataSet.values.length; i++) {

      // ts = '<button class="btn btn-info btn-xs" data-reabre-processo title="Reabre processo" > '+
      //       '	<span class="fluigicon fluigicon-add-test icon-sm"> '+
      //       '</button>';

      var datatableRow = {
        motorista: dataSet.values[i].motorista,
        placa: dataSet.values[i].placa,
        data_descarga: dataSet.values[i].data_descarga,
        ajudante: dataSet.values[i].ajudante_descarga,
        telefone: dataSet.values[i].telefone_descarga,
        valor_descarga: dataSet.values[i].valor_descarga,
        // ts: ts
      };

      regs.push(datatableRow);

      valorTotal += getFloatValue(dataSet.values[i].valor_descarga);
      valorTotalGer += getFloatValue(dataSet.values[i].valor_descarga);

      if (i + 1 == dataSet.values.length
        || dataSet.values[i].motorista != dataSet.values[i + 1].motorista) {

        var datatableRow = {
          motorista: dataSet.values[i].motorista,
          placa: '',
          data_descarga: '',
          ajudante: '',
          telefone: '',
          valor_descarga: getStringValue(valorTotal, 2),
        }
        regs.push(datatableRow);
        valorTotal = 0;
      }

      if (i + 1 == dataSet.values.length) {
        var datatableRow = {
          motorista: '',
          placa: '',
          data_descarga: '',
          ajudante: '',
          telefone: '',
          valor_descarga: getStringValue(valorTotalGer, 2),
        }
        regs.push(datatableRow);
      }

    }

    dadosDatatable = regs;
    dataTable.reload(regs);
    $('td').css("font-size", "13px");

  } else {
    FLUIGC.toast({
      title: 'Atenção: ',
      message: 'Nenhum dado encontrado',
      type: 'warning'
    });
  }


}