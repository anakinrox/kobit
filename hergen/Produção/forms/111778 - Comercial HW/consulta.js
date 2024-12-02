console.log('MMMMMMM ..............');

var datatable = null;

function loadDatatable() {
	
	//var isMobile = WCMAPI.isMobileAppMode();
	 
	this.datatable = FLUIGC.datatable('#consulta', {
	dataRequest: [],
	renderContent: ['pedido','cod_item','den_item','qtd','preco','cond_pagto','nf','pedido_cli', 'data_pedido', 'data_entrega'],
	//mobileMainColumns: [1,2,3],
	//Pedido, Cod Item, Den Item, Qtd, Preço Unit, Cond. Pagto, NF, Pedido Cliente, Data Pedido
	limit:10,
	responsive: true,
	tableStyle:'table table-striped table-responsive',
	emptyMessage: '<div class="text-center"></div>',
	//classSelected: 'data-datatable-selected',
	header: 
		 [  {'title': 'Pedido','size': 'col-md-1'},
			{'title': 'Cod Item','size': 'col-md-1'},
			{'title': 'Descricao','size': 'col-md-3'},
			{'title': 'Qtd','size': 'col-md-1'},
			{'title': 'Preco','size': 'col-md-1'},
			{'title': 'Cond. Pagto','size': 'col-md-2'},
			{'title': 'NF','size': 'col-md-1'},
			{'title': 'Ped. Cliente','size': 'col-md-1'},
			{'title': 'Data Ped.','size': 'col-md-1'},
			{'title': 'Prev. Entr.','size': 'col-md-1'}

		  ],
		  	
    search: {
    			enabled: false,
           		//enabled: true,
           		//searchAreaStyle: 'col-md-5',
            },
	scroll: {
				target: "#idtable",
				enabled: false
			},
	actions: {
				enabled: false,
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
				//sem erro
				//$('.table').css( 'margin-bottom', '15px' );
			}
	});
}


function consulta(){
	//////aquiiii
	
    	var codigo = $('#codigo' ).val();
    	var aen_cons = $('#aen_cons' ).val();
    	var data_de_cons = $('#data_de_cons' ).val().split("/").reverse().join("-");
    	var data_ate_cons = $('#data_ate_cons' ).val().split("/").reverse().join("-");
    	var desc_cons = $('#desc_cons' ).val();
    	    	
    	if( codigo  == ''  ){
	   		 FLUIGC.toast({
	   		        title: 'Filtro: ',
	   		        message: 'Obrigatorio informar o cliente',
	   		        type: 'warning'
	   		    });
	   		return false;
	   	}
    	
    	
    	if( data_de_cons  == '' || data_ate_cons == '' ){
    		 FLUIGC.toast({
    		        title: 'Filtro: ',
    		        message: 'Obrigatorio informar data de inicio e data de fim',
    		        type: 'warning'
    		    });
    		return false;
    	}
    	
	    var constraints = new Array();
			    
		if( codigo != ""){
			constraints.push( DatasetFactory.createConstraint('cod_cliente', codigo, codigo, ConstraintType.MUST) );
		}
		if( aen_cons != "" && aen_cons != null && aen_cons != undefined ){
			if ( aen_cons.substr(2,6) == '000000' && aen_cons != '00000000' ){
				constraints.push( DatasetFactory.createConstraint('aen_n1', aen_cons, aen_cons, ConstraintType.SHOULD) );
			}else if ( aen_cons.substr(4,4) == '0000' && aen_cons != '00000000' ){
				constraints.push( DatasetFactory.createConstraint('aen_n2', aen_cons, aen_cons, ConstraintType.SHOULD) );
			}else if ( aen_cons.substr(6,2) == '00' && aen_cons != '00000000' ){
				constraints.push( DatasetFactory.createConstraint('aen_n3', aen_cons, aen_cons, ConstraintType.SHOULD) );
			}else{			
				constraints.push( DatasetFactory.createConstraint('aen_n4', aen_cons, aen_cons, ConstraintType.SHOULD) );
			}
		}
		if( data_de_cons != "" && data_ate_cons != ""){
			constraints.push( DatasetFactory.createConstraint('dat_pedido', data_de_cons, data_ate_cons, ConstraintType.MUST) );
		}else if( data_de_cons != ""){
			constraints.push( DatasetFactory.createConstraint('dat_pedido', data_de_cons, data_de_cons, ConstraintType.MUST) );
		}else if( data_ate_cons != ""){
			constraints.push( DatasetFactory.createConstraint('dat_pedido', data_ate_cons, data_ate_cons, ConstraintType.MUST) );
		}
		
		if( desc_cons != ""){
			constraints.push( DatasetFactory.createConstraint('den_item', desc_cons, desc_cons, ConstraintType.MUST, true) );
		}

		constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('table', 'fluig_v_hist_venda_cliente', null, ConstraintType.MUST) );
	
		var order = new Array('dat_pedido desc');
		var fields = new Array('cod_empresa','num_pedido','num_pedido_repres','num_pedido_cli','dat_pedido','cod_cliente','cod_cnd_pgto','den_cnd_pgto','prz_entrega','cod_item','den_item','den_item_reduz','qtd_pecas_solic','pre_unit','num_nf'); 
		
	    var dataSet = DatasetFactory.getDataset("selectTable", fields, constraints, order);
	    
	    var regs = [];
	    
	    clearDatatable();
	    
	    if( dataSet != null && dataSet != undefined ){
	    	
		    for (var i = 0; i < dataSet.values.length; i++) {

		    	var datatableRow = {
		    			pedido: dataSet.values[i]["num_pedido"],
		    			cod_item: dataSet.values[i]["cod_item"],
		    			den_item: dataSet.values[i]["den_item"].toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
		    			qtd: numberToStr( dataSet.values[i]["qtd_pecas_solic"], 2 ),
		    			preco: numberToStr( dataSet.values[i]["pre_unit"], 2 ),
		    			cond_pagto: dataSet.values[i]["den_cnd_pgto"].toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
		    			nf: dataSet.values[i]["num_nf"],
		    			pedido_cli: dataSet.values[i]["num_pedido_cli"],
		    			data_pedido: dateToDMY( dataSet.values[i]["dat_pedido"] ),
		    			data_entrega: dateToDMY( dataSet.values[i]["prz_entrega"] )
			    };
		    	
			    regs.push(datatableRow);
		    }
	    }
	    
	    datatable.reload(regs);    		
    }
    	
function clearDatatable(){

		var numRegItem = datatable.getData().length;
		for (var i = 0; i < numRegItem; i++) {
			this.datatable.removeRow(0);
		}

		datatable.reload([]);
	}

	


function dateToDMY(dateSTR) {
	date = new Date(dateSTR);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}

function numberToStr( number, size ){
	return '<div style="text-align: right" >'+parseFloat( number ).toFixed( size ).replace('.',',')+'</div>';
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}

function dataAtualFormatada(){
    var data = new Date();
    var dia = data.getDate();
    if (dia.toString().length == 1)
      dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
      mes = "0"+mes;
    var ano = data.getFullYear();  
    return dia+"/"+mes+"/"+ano;
}

function horaAtualFormatada(){
    var data = new Date();
    var hora = data.getHours();
    if (hora.toString().length == 1)
    	hora = "0"+hora;
    var minuto = data.getMinutes();
    if (minuto.toString().length == 1)
    	minuto = "0"+minuto;  
    return hora+":"+minuto;
}