var dataTable = null;
var dadosDatatable = [];

function loadAbastecimento(){
  console.log('loadAbastecimento');

  rContent = ['motorista','placa','data_abastecimento', 'nome_posto','den_cidade_uf', 'valor_abast', 'qtd_litros', 'valor_litro', 'pago','ts'];
                  
  rHeader = [ {'title': 'Motorista','dataorder': 'motorista','width':'10%' },
              {'title': 'Placa','dataorder': 'placa','width':'10%' },
              {'title': 'Data Abastecimento','dataorder': 'data_abastecimento','width':'10%' },
              {'title': 'Posto','dataorder': 'nome_posto','width':'10%' },
              {'title': 'Cidade/UF','dataorder': 'den_cidade_uf','width':'10%' },
              {'title': 'Valor Abastecido','dataorder': 'valor_abast','width':'10%' },
              {'title': 'Quantidade Litros','dataorder': 'qtd_litros','width':'10%' },
              {'title': 'Valor Litro','dataorder': 'valor_litro','width':'10%' },
              {'title': 'Pago','dataorder': 'pago','width':'10%' },
              {'title': '','display': false, 'width':'0%'},
            ];

  if ( $('#agrupador_' + $this.instanceId).val() == 'nome_posto'){
    rContent = ['nome_posto','den_cidade_uf','motorista','placa','data_abastecimento', 'valor_abast', 'qtd_litros', 'valor_litro', 'pago','ts'];
                  
    rHeader = [ {'title': 'Posto','dataorder': 'nome_posto','width':'10%' },
              {'title': 'Cidade/UF','dataorder': 'den_cidade_uf','width':'10%' },
              {'title': 'Motorista','dataorder': 'motorista','width':'10%' },
              {'title': 'Placa','dataorder': 'placa','width':'10%' },              
              {'title': 'Data Abastecimento','dataorder': 'data_abastecimento','width':'10%' },
              {'title': 'Valor Abastecido','dataorder': 'valor_abast','width':'10%' },
              {'title': 'Quantidade Litros','dataorder': 'qtd_litros','width':'10%' },
              {'title': 'Valor Litro','dataorder': 'valor_litro','width':'10%' },
              {'title': 'Pago','dataorder': 'pago','width':'10%' },
              {'title': '','display': false, 'width':'2%'},
            ];
  }
  
  dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
  dataRequest: dadosDatatable,
  renderContent: rContent,
  limit:10,
  responsive: true,
  // tableStyle:'table table-striped table-responsive',
  emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
  header: rHeader,			  	
    search: {
      enabled: false,
        onSearch: function(res) {
          console.log( res );
            var data = dadosDatatable;
            var search = data.filter(function(el) {
                return (el.des_def_proces.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.den_status.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.num_proces.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.full_name_requisit.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.full_name.toUpperCase().indexOf(res.toUpperCase())>= 0 ||
                        el.start_date.toUpperCase().indexOf(res.toUpperCase())>= 0 ||
                        el.end_date.toUpperCase().indexOf(res.toUpperCase())>= 0) 
            });
            dataTable.reload(search); 
        },
        onlyEnterkey: false,
        searchAreaStyle: 'col-md-3'
    },
  scroll: {
        target: '#idtable_'+$this.instanceId,
        enabled: false
      },
  navButtons: {
        enabled: false,
      },
  draggable: {
        enabled: false
      },

  }, function(err, data) {
    if (err) {
        FLUIGC.toast({
          message: err,
          type: 'danger'
        });
      }else
      {
      }
  });
  
  loadDadosAbastecimento();

}

function loadDadosAbastecimento(){
  var agrupador = $('#agrupador_'+$this.instanceId).val();

  var tSolicao = getTable( 'acerto_viagem', '' );
  var tAbastecimento = getTable( 'acerto_viagem', 'abastecimento' );
  var tVeiculo = getTable( 'veiculo', '' );
  var tPosto = getTable( 'posto_abastecimento', '' );

  var dt_ini = $('#dt_ini_' + $this.instanceId).val().split('/').reverse().join('/');
  var dt_fim = $('#dt_fim_' + $this.instanceId).val().split('/').reverse().join('/');

  var SQL = "	select an.num_proces, "+
            "     sc.*, " +
            "     (select cid.nome_posto  from ML0016784  cid "+
            "     join documento dc on (dc.cod_empresa = cid.companyid  "+
            "                      and dc.nr_documento = cid.documentid  "+
            "                      and dc.nr_versao = cid.version "+
            "                      and dc.VERSAO_ATIVA = 1 ) "+
            "     where replace(replace(replace( cid.cnpj_posto, '.', ''), '-',''),'/', '') = replace(replace(replace( it.cnpj_posto, '.', ''), '-',''),'/', '') "+
            "     limit 1 ) as nome_posto, "+
            "			it.*, " +
            "     (select cid.den_cidade_uf from "+tPosto+" cid "+
            "       join documento dc on (dc.cod_empresa = cid.companyid  "+
            "                 and dc.nr_documento = cid.documentid  "+
            "                  and dc.nr_versao = cid.version "+
            "                  and dc.VERSAO_ATIVA = 1 ) "+
            "                  where replace(replace(replace( cid.cnpj_posto, '.', ''), '-',''),'/', '') = replace(replace(replace( it.cnpj_posto, '.', ''), '-',''),'/', '') "+
            "                  limit 1 ) as den_cidade_uf  "+
            "	from "+ tSolicao +" sc "+
            "	join documento dc on (dc.cod_empresa = sc.companyid "+
                  "			           and dc.nr_documento = sc.documentid "+
                  " 			           and dc.nr_versao = sc.version) "+
            "	join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+ 
            "					   and an.NR_DOCUMENTO = sc.documentid) "+                       
            "	join "+ tAbastecimento +" it on (it.companyid = sc.companyid "+
                  "			       		and it.documentid = sc.documentid "+
                  "			       		and it.version = sc.version) "+
            " left join "+ tVeiculo +" pr on ( pr.vel_placa = sc.placa ) "+
            "	where dc.versao_ativa = 1 ";

  if ($('#data_refer_' + $this.instanceId).val() == 'S') {
    SQL +=  "  and STR_TO_DATE( IFNULL(sc.data_saida,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }
  
  if ($('#data_refer_' + $this.instanceId).val() == 'C') {
      SQL +=  "  and STR_TO_DATE( IFNULL(sc.data_chegada,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }

  if ($('#data_refer_' + $this.instanceId).val() == 'F') {
      SQL +=  "  and STR_TO_DATE( IFNULL(sc.data_fechamento,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }

  if ($('#data_refer_' + $this.instanceId).val() == 'L') {
    SQL +=  "  and STR_TO_DATE( IFNULL(it.data_abastecimento,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }

  if ($('#cod_motorista_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.matricula_fluig = '" + $('#cod_motorista_' + $this.instanceId).val() + "'";
  }

  if ($('#placa_' + $this.instanceId).val() != '') {
      SQL +=  " 	and sc.placa = '" + $('#placa_' + $this.instanceId).val() + "'";
  }
  
  if ($('#posto_proprio_' + $this.instanceId).val() == 'S') {
  	SQL +=  " 	and it.cnpj_posto = '81.639.023/0018-90' ";
  }else if ($('#posto_proprio_' + $this.instanceId).val() == 'N') {
	  SQL +=  " 	and it.cnpj_posto != '81.639.023/0018-90' ";
  }
  
  if ($('#cod_posto_' + $this.instanceId).val() != '') {
    SQL +=  " 	and it.cnpj_posto = '" + $('#cod_posto_' + $this.instanceId).val() + "'";
  }

  if ($('#pago_abastecimento_' + $this.instanceId).val() != '') {
    SQL +=  " 	and it.cod_fatura = '" + $('#pago_abastecimento_' + $this.instanceId).val() + "'";
  }
  
  if ($('#cod_proprietaria_' + $this.instanceId).val() != '') {
	 SQL +=  " 	and pr.vel_proprietario = '" + $('#cod_proprietaria_' + $this.instanceId).val() + "'";
  }

  if ($('#estado_' + $this.instanceId).val() != '') {
    SQL +=  " 	and  (select cid.uf from "+tPosto+" cid "+
            "         join documento dc on (dc.cod_empresa = cid.companyid  "+
            "                          and dc.nr_documento = cid.documentid  "+
            "                          and dc.nr_versao = cid.version "+
            "                          and dc.VERSAO_ATIVA = 1 ) "+
            "                  where replace(replace(replace( cid.cnpj_posto, '.', ''), '-',''),'/', '') = replace(replace(replace( it.cnpj_posto, '.', ''), '-',''),'/', '') limit 1 ) = '" + $('#estado_' + $this.instanceId).val() + "'";
  }

  if ($('#nf_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.nf_abastecimento = '" + $('#nf' + $this.instanceId).val() + "'";
  }
  
  SQL += " order by "+ agrupador +", STR_TO_DATE( IFNULL(it.data_abastecimento,'00/00/0000'), '%d/%m/%Y' ) ";
  
  console.log(SQL);
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));

  var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
  console.log('select');
  console.log(dataSet.values);

  var regs = new Array();
  
  var qtdLitros = 0;
  var valorTotal = 0;
  var qtdLitrosGer = 0;
  var valorTotalGer = 0;
  
  if( dataSet != null && dataSet != undefined ){

      for (var i = 0; i < dataSet.values.length; i++) {

          // ts = '<button class="btn btn-info btn-xs" data-reabre-processo title="Reabre processo" > '+
          //       '	<span class="fluigicon fluigicon-add-test icon-sm"> '+
          //       '</button>';

          var datatableRow = {
            motorista: dataSet.values[i].motorista,
            placa: dataSet.values[i].placa,
            data_abastecimento: dataSet.values[i].data_abastecimento,
            nome_posto: dataSet.values[i].nome_posto,
            den_cidade_uf: dataSet.values[i].den_cidade_uf,
            valor_abast: dataSet.values[i].valor_abastecimento,
            qtd_litros: dataSet.values[i].qtd_litros_abastecimento,
            valor_litro: dataSet.values[i].valor_litro_abastecimento,
            pago: dataSet.values[i].fatura,
              // ts: ts
          };
          regs.push(datatableRow);
          
          qtdLitros += getFloatValue( dataSet.values[i].qtd_litros_abastecimento );
          valorTotal += getFloatValue( dataSet.values[i].valor_abastecimento );
          qtdLitrosGer += getFloatValue( dataSet.values[i].qtd_litros_abastecimento );
          valorTotalGer += getFloatValue( dataSet.values[i].valor_abastecimento );        

          
          if( i+1 == dataSet.values.length || dataSet.values[i][agrupador] != dataSet.values[i+1][agrupador] ){
        	  
              var datatableRow = {
                motorista: '',
                placa: '',
                data_abastecimento: '',
                nome_posto: '',
                den_cidade_uf: '',
                valor_abast: getStringValue( valorTotal, 2),
                qtd_litros: getStringValue( qtdLitros, 2),
                valor_litro: getStringValue( valorTotal / qtdLitros, 2),
                pago: '',
                        // ts: ts
              };
              regs.push(datatableRow);
              qtdLitros = 0;
              valorTotal = 0;
          }
          if( i+1 == dataSet.values.length ){
        	  var datatableRow = {
                motorista: '',
                placa: '',
                data_abastecimento: '',
                nome_posto: '',
                den_cidade_uf: '',
                valor_abast: getStringValue( valorTotalGer, 2),
                qtd_litros: getStringValue( qtdLitrosGer, 2),
                valor_litro: getStringValue( valorTotalGer / qtdLitrosGer, 2),
                pago: '',
                              // ts: ts
              };
              regs.push(datatableRow);
          }
          
      }

      dadosDatatable = regs;
      dataTable.reload(regs); 
      $('td').css("font-size","13px");

  } else {
      FLUIGC.toast({
          title: 'Atenção: ',
          message: 'Nenhum dado encontrado',
          type: 'warning'
      });
  }
  

}