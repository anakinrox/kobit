var dataTable = null;
var dadosDatatable = [];

function loadReceitas(){
  console.log('loadReceitas');

  rContent = ['motorista','placa','data_receita', 'tipo_receita', 'tipo_frete', 'valor_receita', 'valor_ajuda_custo','obs_receita', 'ts'];
                  
  rHeader = [ {'title': 'Motorista','dataorder': 'motorista','width':'10%' },
              {'title': 'Placa','dataorder': 'placa','width':'10%' },
              {'title': 'Data Receita','dataorder': 'data_receita','width':'10%' },
              {'title': 'Tipo Receita','dataorder': 'tipo_receita','width':'10%' },
              {'title': 'Tipo Frete','dataorder': 'tipo_frete','width':'10%' },
              {'title': 'Valor Recebido','dataorder': 'valor_receita','width':'10%' },
              {'title': 'Ajuda Custo','dataorder': 'valor_ajuda_custo','width':'10%' },
              {'title': 'Observação','dataorder': 'obs_receita','width':'10%' },
              {'title': '','display':false, 'width':'0%'},
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
                return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0 ) 
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


  loadDadosReceitas();

}

function loadDadosReceitas(){
  var tSolicao = getTable( 'acerto_viagem', '' );
  var tReceitas = getTable( 'acerto_viagem', 'receitas' );
  var tVeiculo = getTable( 'veiculo', '' );

  var dt_ini = $('#dt_ini_' + $this.instanceId).val().split('/').reverse().join('/');
  var dt_fim = $('#dt_fim_' + $this.instanceId).val().split('/').reverse().join('/');

  var SQL = "	select sc.*, " +
          "			it.* " +
          "	from "+ tSolicao +" sc "+
          "	join documento dc on (dc.cod_empresa = sc.companyid "+
                "			           and dc.nr_documento = sc.documentid "+
                " 			           and dc.nr_versao = sc.version) "+
          "	join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+ 
          "					   and an.NR_DOCUMENTO = sc.documentid) "+                       
          "	join "+ tReceitas +" it on (it.companyid = sc.companyid "+
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
    SQL +=  "  and STR_TO_DATE( IFNULL(it.data_receira,'00/00/0000'), '%d/%m/%Y' ) between '"+dt_ini+"' AND '"+dt_fim+"'";
  }

  if ($('#cod_motorista_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.matricula_fluig = '" + $('#cod_motorista_' + $this.instanceId).val() + "'";
  }

  if ($('#placa_' + $this.instanceId).val() != '') {
      SQL +=  " 	and sc.placa = '" + $('#placa_' + $this.instanceId).val() + "'";
  }

  if ($('#den_receita_' + $this.instanceId).val() != '') {
    SQL +=  " 	and it.tipo_receita = '" + $('#den_receita_' + $this.instanceId).val() + "'";
  }

  if ($('#tipo_frete_' + $this.instanceId).val() != '') {
    if ( $('#tipo_frete_' + $this.instanceId).val() == 'P' ) {
      SQL +=  " 	and it.tipo_frete in ('" + $('#tipo_frete_' + $this.instanceId).val() + "','')";
    } else {
      SQL +=  " 	and it.tipo_frete = '" + $('#tipo_frete_' + $this.instanceId).val() + "'";
    }    
    
  }

  if ($('#retorno_' + $this.instanceId).val() == 'S') {
    SQL +=  " 	and it.cod_tipo_receita != 'PRO'";
  }

  if ($('#retorno_' + $this.instanceId).val() == 'N') {
    SQL +=  " 	and it.cod_tipo_receita = 'PRO'";
  }
  
  if ($('#cod_proprietaria_' + $this.instanceId).val() != '') {
	 SQL +=  " 	and pr.vel_proprietario = '" + $('#cod_proprietaria_' + $this.instanceId).val() + "'";
  }

  if ($('#estado_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.cod_uni_feder = '" + $('#estado_' + $this.instanceId).val() + "'";
  }

  if ($('#nf_' + $this.instanceId).val() != '') {
    SQL +=  " 	and sc.nf_retorno = '" + $('#nf' + $this.instanceId).val() + "'";
  }
  
  SQL += " order by motorista, STR_TO_DATE( IFNULL(it.data_receira,'00/00/0000'), '%d/%m/%Y' ) ";
  
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
  
  var ajudaTotal = 0;
  var ajudaTotalGer = 0;
  
  if( dataSet != null && dataSet != undefined ){

      for (var i = 0; i < dataSet.values.length; i++) {

          // ts = '<button class="btn btn-info btn-xs" data-reabre-processo title="Reabre processo" > '+
          //       '	<span class="fluigicon fluigicon-add-test icon-sm"> '+
          //       '</button>';

          var tipo_frete = '';
          if (dataSet.values[i].tipo_frete == 'T') {
            tipo_frete = 'Terceiro'
          }

          if (dataSet.values[i].tipo_frete == 'P' || dataSet.values[i].tipo_frete == '') {
            tipo_frete = 'Pormade'
          }

          if (dataSet.values[i].tipo_frete == 'R') {
            tipo_frete = 'Retorno'
          }

          var datatableRow = {
        	  motorista: dataSet.values[i].motorista,
            placa: dataSet.values[i].placa,      
            data_receita: dataSet.values[i].data_receira,
            tipo_receita: dataSet.values[i].tipo_receita,
            tipo_frete: tipo_frete,
            valor_receita: dataSet.values[i].valor_receita,
            valor_ajuda_custo: dataSet.values[i].valor_ajuda_custo,
            obs_receita: dataSet.values[i].obs_receita,
              // ts: ts
          };

          regs.push(datatableRow);
          
          valorTotal += getFloatValue( dataSet.values[i].valor_receita );
          valorTotalGer += getFloatValue( dataSet.values[i].valor_receita );
          
          ajudaTotal += getFloatValue( dataSet.values[i].valor_ajuda_custo );
          ajudaTotalGer += getFloatValue( dataSet.values[i].valor_ajuda_custo );
          
          if( i+1 == dataSet.values.length
                  || dataSet.values[i].motorista != dataSet.values[i+1].motorista ){
        	  var datatableRow = {
        	        	motorista: dataSet.values[i].motorista,
        	            placa: '',      
        	            data_receita: '',
                      tipo_receita: '',
                      tipo_frete: '',
        	            valor_receita:  getStringValue( valorTotal, 2),
                      valor_ajuda_custo:  getStringValue( ajudaTotal, 2),
                      obs_receita: '',
        	              // ts: ts
        	          };
        	  regs.push(datatableRow);
        	  valorTotal = 0;
        	  ajudaTotal = 0;
          }
          
          if( i+1 == dataSet.values.length ){
            
        	  var datatableRow = {
      	        	motorista: '',
      	            placa: '',      
      	            data_receita: '',
                    tipo_receita: '',
                    tipo_frete: '',
      	            valor_receita:  getStringValue( valorTotalGer, 2),
                    valor_ajuda_custo:  getStringValue( ajudaTotalGer, 2),
                    obs_receita: '',
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