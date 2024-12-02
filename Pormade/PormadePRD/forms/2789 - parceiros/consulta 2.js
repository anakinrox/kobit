console.log('MMMMMMM ..............');

var datatable = null;

function loadDatatable() {
	
	//var isMobile = WCMAPI.isMobileAppMode();
	 
	this.datatable = FLUIGC.datatable('#consulta', {
	dataRequest: [],
	renderContent: ['tipo','status','data','cidade','local','assunto','palestrante'],
	limit:10,
	responsive: true,
	tableStyle:'table table-striped table-responsive',
	emptyMessage: '<div class="text-center"></div>',
	//classSelected: 'data-datatable-selected',
	header: 
		 [  {'title': 'Tipo','size': 'col-md-1'},
			{'title': 'Staus','size': 'col-md-1'},
			{'title': 'Data','size': 'col-md-1'},
			{'title': 'Cidade','size': 'col-md-1'},
			{'title': 'local','size': 'col-md-2'},
			{'title': 'Assunto','size': 'col-md-2'},
			{'title': 'Responsavel','size': 'col-md-2'},
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
	
		console.log('consulta......');
	
    	var cnpj_cpf = $('#cnpj_cpf').val().replace('.','').replace('.','').replace('.','').replace('-','').replace('/','');

    	clearDatatable();
    	
    	if( $('#nome').val() == "" && cnpj_cpf == "" ){
    		return false;
    	}
    	
    	var regs = [];
    	
    	var sql = " select * from fluig_v_palestra_visita "+
    			  "	 where 1=1 ";
    	if( cnpj_cpf != "" ){
    		sql += " and ( cnpj_cpf_pessoa = '"+ cnpj_cpf +"' "+
    			   "    or nome_pessoa = '"+ $('#nome').val() +"' ) ";
    	}else{
    		sql += " and nome_pessoa = '"+ $('#nome').val() +"' ";
    	}
    	
	    var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/FluigDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('sql', sql, null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('table', 'fluig_v_palestra_visita', null, ConstraintType.MUST) );
		var order = new Array('');
		var fields = new Array(); 			
	    var dataSet = DatasetFactory.getDataset("select", fields, constraints, order);
	    if( dataSet != null && dataSet != undefined ){
		    for (var i = 0; i < dataSet.values.length; i++) {
		    	var datatableRow = {
		    			tipo: dataSet.values[i]["origem"],
		    			status: dataSet.values[i]["den_status"],
		    			data: dataSet.values[i]["data_palestra"],
		    			cidade: dataSet.values[i]["cidade"],
		    			local: dataSet.values[i]["local_palestra"],
		    			assunto: dataSet.values[i]["assunto"],
		    			palestrante: dataSet.values[i]["palestrante"]
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