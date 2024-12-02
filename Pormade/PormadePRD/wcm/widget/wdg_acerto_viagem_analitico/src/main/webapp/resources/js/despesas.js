var dataTable = null;
var dadosDatatable = [];

function loadDespesas(){
  console.log('loadDespesas');

  rContent = ['motorista','placa','data_despesa', 'tipo_despesa', 'nf_despesa', 'valor_despesa'];
                  
  rHeader = [ {'title': 'Motorista','dataorder': 'motorista','width':'10%' },
              {'title': 'Placa','dataorder': 'placa','width':'10%' },
              {'title': 'Data Despesa','dataorder': 'data_despesa','width':'10%' },
              {'title': 'Tipo Despesa','dataorder': 'tipo_despesa','width':'10%' },
              {'title': 'NF Despesa','dataorder': 'nf_despesa','width':'10%' },
              {'title': 'Valor Despesa','dataorder': 'valor_despesa','width':'10%' },
              {'title': '','display': false, 'width':'0%'},
            ];
  
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

  loadDadosDespesas();

}

function loadDadosDespesas(){
  var tSolicao = getTable( 'acerto_viagem', '' );
  var tDespesas = getTable( 'acerto_viagem', 'despesas' );
  var tVeiculo = getTable( 'veiculo', '' );

  var dt_ini = $('#dt_ini_' + $this.instanceId).val().split('/').reverse().join('/');
  var dt_fim = $('#dt_fim_' + $this.instanceId).val().split('/').reverse().join('/');

  var SQL = "	select sc.*, " +
          "			it.*, " +
          "     IFNULL(it.nf_despesa,'') as nf_despesa_x "+
          "	from "+ tSolicao +" sc "+
          "	join documento dc on (dc.cod_empresa = sc.companyid "+
                "			           and dc.nr_documento = sc.documentid "+
                " 			           and dc.nr_versao = sc.version) "+
          "	join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+ 
          "					   and an.NR_DOCUMENTO = sc.documentid) "+                       
          "	join "+ tDespesas +" it on (it.companyid = sc.companyid "+
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
    SQL +=  "  and STR_TO_DATE( IFNULL(it.data_despesa,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }

  if ($('#cod_motorista_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.matricula_fluig = '" + $('#cod_motorista_' + $this.instanceId).val() + "'";
  }

  if ($('#placa_' + $this.instanceId).val() != '') {
      SQL +=  " 	and sc.placa = '" + $('#placa_' + $this.instanceId).val() + "'";
  }

  if ($('#cod_despesa_' + $this.instanceId).val() != '') {
    SQL +=  " 	and it.cod_tipo_despesa = '" + $('#cod_despesa_' + $this.instanceId).val() + "'";
  }
  
  if ($('#cod_proprietaria_' + $this.instanceId).val() != '') {
	 SQL +=  " 	and pr.vel_proprietario = '" + $('#cod_proprietaria_' + $this.instanceId).val() + "'";
  }

  if ($('#estado_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.cod_uni_feder = '" + $('#estado_' + $this.instanceId).val() + "'";
  }

  if ($('#nf_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.nf_despesa = '" + $('#nf' + $this.instanceId).val() + "'";
  }
  
  SQL += " order by motorista, STR_TO_DATE( IFNULL(it.data_despesa,'00/00/0000'), '%d/%m/%Y' ) ";
  
  console.log(SQL);
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));

  var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
  console.log('select');
  console.log(dataSet.values);

  var regs = new Array();
  var valorTotal = 0;
  var valorTotalGer = 0;
  
  if( dataSet != null && dataSet != undefined ){

      for (var i = 0; i < dataSet.values.length; i++) {

          // ts = '<button class="btn btn-info btn-xs" data-reabre-processo title="Reabre processo" > '+
          //       '	<span class="fluigicon fluigicon-add-test icon-sm"> '+
          //       '</button>';
          // console.log(dataSet.values[i].motorista, dataSet.values[i].nf_despesa)

          var datatableRow = {
            motorista: dataSet.values[i].motorista,
            placa: dataSet.values[i].placa,      
            data_despesa: dataSet.values[i].data_despesa,
            tipo_despesa: dataSet.values[i].tipo_despesa,
            nf_despesa: dataSet.values[i].nf_despesa_x,
            valor_despesa: dataSet.values[i].valor_despesa,
              // ts: ts
          };

          regs.push(datatableRow);
          
          valorTotal += getFloatValue( dataSet.values[i].valor_despesa );
          valorTotalGer += getFloatValue( dataSet.values[i].valor_despesa );
          
          if( i+1 == dataSet.values.length
                  || dataSet.values[i].motorista != dataSet.values[i+1].motorista ){
               	  
               var datatableRow = {
            		    motorista: dataSet.values[i].motorista,
                    placa: '',      
                    data_despesa: '',
                    tipo_despesa: '',
                    nf_despesa: '',
                    valor_despesa: getStringValue( valorTotal, 2),
              }
              regs.push(datatableRow);
               valorTotal = 0;
          }
          
            if( i+1 == dataSet.values.length ){
                var datatableRow = {
                	    	motorista: '',
                        placa: '',      
                        data_despesa: '',
                        tipo_despesa: '',
                        nf_despesa: '',
                        valor_despesa: getStringValue( valorTotalGer, 2),
                     }
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