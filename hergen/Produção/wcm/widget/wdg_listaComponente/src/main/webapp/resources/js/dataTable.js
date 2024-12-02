var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable() {
  // console.log('loadReceitas');
  rContent = ['data_liberacao', 'quantidade', 'den_item', 'cod_item', 'tp', 'kit', 'df', 'num_op', 'obs', 'ts', 'empresa'];

  rHeader = [{ 'title': 'Data Liberacao', 'dataorder': 'data_liberacao', 'width': '10%' },
  { 'title': 'Quant.', 'dataorder': 'quantidade', 'width': '10%' },
  { 'title': 'Item', 'dataorder': 'den_item', 'width': '10%' },
  { 'title': 'Cod. Item', 'dataorder': 'cod_item', 'width': '10%' },
  { 'title': 'TP', 'dataorder': 'tp', 'width': '10%' },
  { 'title': 'KIT', 'dataorder': 'kit', 'width': '10%' },
  { 'title': 'DF', 'dataorder': 'df', 'width': '10%' },
  { 'title': 'OP', 'dataorder': 'num_op', 'width': '10%' },
  { 'title': 'Observação', 'dataorder': 'obs', 'width': '10%' },
  { 'title': '', 'width': '0%' },
  { 'title': '', 'width': '0%', 'display': false },
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
        console.log(res);
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

  loadDadosDataTable();

}

function loadDadosDataTable() {
  loadWindow.show();

  // var tPai = getTable('chamados','');

  var SQL = "select est.cod_empresa, " +
    "	 est.nivel, " +
    "  est.cod_item_compon,  " +
    "  it.den_item,  " +
    "  it.den_item_reduz,  " +
    "  it.ies_tip_item, " +
    "  est.quantidade, " +
    "  NVL(itc.kit, itcp.kit) as kit, " +
    "  NVL(itc.def_fornecimento, itcp.def_fornecimento) as cod_fornecimento " +
    "from eis_v_estrutura_n10 est  " +
    "join item it on (it.cod_empresa = est.cod_empresa  " +
    "      and it.cod_item = est.cod_item_compon) " +
    "left join kbt_t_item_compl itc on (est.cod_item_compon = itc.cod_item) " +
    "left join kbt_t_item_compl_projeto itcp on (est.cod_item_compon = itcp.cod_item) " +
    // "left join kbt_t_item_compl itc on (est.cod_empresa = itc.empresa "+
    // "                and est.cod_item_pai = itc.cod_item) "+
    // "left join kbt_t_item_compl_projeto itcp on (est.cod_empresa = itcp.empresa "+
    // "                and est.cod_item_pai = itcp.cod_item) "+
    "where est.cod_item_pai = '151811' and est.cod_empresa = '02' ";
  /*
    if ( $('#num_chamado_' + $this.instanceId).val() != '' ){
      SQL += " and u.NUM_PROCES = " + $('#num_chamado_' + $this.instanceId).val() ;
    }
    
    if ( $('#situacao_' + $this.instanceId).val() != '' ){
      SQL += " and u.status = " + $('#situacao_' + $this.instanceId).val();
    }
  
    if ( $('#titulo_' + $this.instanceId).val() != '' ){
      SQL += " and sc.titulo like '%" + $('#titulo_' + $this.instanceId).val() + "%' ";
    }
    
    if ( $('#cod_solicitante_' + $this.instanceId).val() != '' ){
      SQL += " and sc.mat_solicitante = '" + $('#cod_solicitante_' + $this.instanceId).val() + "' ";
    }
  
    if ($('#cod_atividade_' + $this.instanceId).val() != '') {
      SQL +=  " 	and hp.num_seq_estado = '" + $('#cod_atividade_' + $this.instanceId).val() + "'";
    }
  
    if ( $('#cod_secao_' + $this.instanceId).val() != '' ){
      SQL += " and sc.cod_secao = '" + $('#cod_secao_' + $this.instanceId).val() + "' ";
    }
  
    if ( $('#cod_tipo_' + $this.instanceId).val() != '' ){
      SQL += " and sc.cod_tipo = '" + $('#cod_tipo_' + $this.instanceId).val() + "' ";
    }
  
    if ( $('#cod_setor_' + $this.instanceId).val() != '' ){
      SQL += " and sc.cod_setor = '" + $('#cod_setor_' + $this.instanceId).val() + "' ";
    }
  
    if ( $('#cod_categoria_' + $this.instanceId).val() != '' ){
      SQL += " and sc.cod_categoria = '" + $('#cod_categoria_' + $this.instanceId).val() + "' ";
    }
    
    if ( $('#subcategoria_' + $this.instanceId).val() != '' ){
      SQL += " and sc.subcategoria = '" + $('#subcategoria_' + $this.instanceId).val() + "' ";
    }
    */
  SQL += " order by est.cod_composto ";

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS', null, ConstraintType.MUST));

  var callback = {
    success: function (dataSet) {
      console.log(dataSet.values);
      if (dataSet != null && dataSet != undefined) {

        var data = dataSet.values;

        btnTS = '<button id="testbut" class="btn btn-info btn-xs" data-consulta-processo> ' +
          '	<span class="fluigicon fluigicon-process icon-sm"> ' +
          '</button>';

        var arrKits = loadTable('kbt_t_kit', ['cod_kit', 'den_kit']);
        var arrDefFornec = loadTable('kbt_t_fornecimento', ['cod_fornecimento', 'den_fornecimento']);

        var regs = new Array();
        for (var i = 0; i < data.length; i++) {
          var optKits = '<option value=""></option>';
          var optDefFornec = '<option value=""></option>';
          // Carrega combo kits
          for (var x = 0; x < arrKits.length; x++) {
            // console.log(arrKits[x]);
            if (arrKits[x]['cod_kit'].trim() == data[i]['kit'].trim()) {
              optKits += '<option value="' + arrKits[x]['cod_kit'].trim() + '" selected>' + arrKits[x]['cod_kit'].trim() + '</option>';
            } else {
              optKits += '<option value="' + arrKits[x]['cod_kit'].trim() + '">' + arrKits[x]['cod_kit'].trim() + '</option>';
            }

          }

          //Carrega combo def Fornec
          for (var x = 0; x < arrDefFornec.length; x++) {
            // console.log(arrDefFornec[x]);
            if (arrDefFornec[x]['cod_fornecimento'].trim() == data[i]['cod_fornecimento'].trim()) {
              optDefFornec += '<option value="' + arrDefFornec[x]['cod_fornecimento'].trim() + '" selected>' + arrDefFornec[x]['cod_fornecimento'].trim() + '</option>';
            } else {
              optDefFornec += '<option value="' + arrDefFornec[x]['cod_fornecimento'].trim() + '">' + arrDefFornec[x]['cod_fornecimento'].trim() + '</option>';
            }
          }

          var datatableRow = {
            data_liberacao: data[i]['nivel'],
            quantidade: data[i]['quantidade'],
            den_item: "".padStart(parseInt(data[i]['nivel'] * 18), '&nbsp;') + data[i]['den_item'],
            cod_item: data[i]['cod_item_compon'].trim(),
            den_tipo: data[i]['ies_tip_item'],
            tp: '',
            kit: '<select class="form-control" onchange="atualizaItem(this.id)" name="kit_' + $this.instanceId + '___' + i + '" id="kit_' + $this.instanceId + '___' + i + '">' + optKits + '</select>',
            // kit: '',
            df: '<select class="form-control" onchange="atualizaItem(this.id)" name="def_fornec_' + $this.instanceId + '___' + i + '" id="def_fornec_' + $this.instanceId + '___' + i + '">' + optDefFornec + '</select>',
            // df : '',
            num_op: '',
            obs: '',
            ts: btnTS,
            empresa: data[i]['cod_empresa']
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

  var dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);

}

function loadTable(table, fields) {

  console.log('## Table', table);

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("dataBase", 'java:/jdbc/LogixDS', null, ConstraintType.MUST));

  var dataSet = DatasetFactory.getDataset("selectTable", fields, constraints, null);

  return dataSet.values;

}

function atualizaItem(id) {

  var kit = $('#kit_' + $this.instanceId + '___' + id.split('___')[1]).val();
  var df = $('#def_fornec_' + $this.instanceId + '___' + id.split('___')[1]).val();

  var selected = dataTable.getRow(dataTable.selectedRows()[0]);

  console.log(selected.cod_item.trim(), kit, df);

  var projeto = '0';
  if ($('#projeto_' + $this.instanceId).val() !== "") {
    projeto = $('#projeto_' + $this.instanceId).val();
  }

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('empresa', selected.empresa, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('cod_item', selected.cod_item, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('projeto', projeto, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('cod_item_conjunto', '', null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('kit', kit, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('def_fornecimento', df, null, ConstraintType.MUST));
  var dataSet = DatasetFactory.getDataset("ds_lk", null, constraints, null);

  if (dataSet.values[0]['status'] == 'OK') {
    toast('Item salvo', 'success');
  } else {
    toast('Erro ao salvar', 'danger');
  }


}