var MyDataTable = SuperWidget.extend({

	myTable: null,
	myTable2: null,
	mydata: [],
	mydata2: [],
	tableData: null,
	loading : FLUIGC.loading("#wcm-content"),
	loadingaltera : FLUIGC.loading(window,{textMessage:  '<h3> Alterando... <span class="fluigicon fluigicon-pencil "></span></h3>'}),

	bindings: {
		local: {
			'datatable-selected': ['click_selected'],
			'datatable-reload': ['click_reload'],
			'voltar': ['click_voltartela'],
			'confirma-alterar':['click_confirmaalterar']
		},
		global: {}
	},

	init: function() {
	//	FLUIGC.calendar('#datade');
	//	FLUIGC.calendar('#dataate');
		this.loadTable();
		$('html,body').animate({scrollTop: 0},'slow');
	},
	
	savePreferences: function() {
		var args = {
			//	iddocumento: $("#iddocumento", this.getContext()).val()
	    	};
	    	
	    	var result = WCMSpaceAPI.PageService.UPDATEPREFERENCES(
	    			{async: false}, 
	    			this.instanceId, 
	    			args
			);
	    	
	    	if (result) {
	    		FLUIGC.toast({
	    			title: "",
	    			message: "Salvou!",
	    			type: "success"
	    		});
	    	} 
	    	else {
	    		FLUIGC.toast({
	    			title: "Atenção!",
	    			message: "Não salvou",
	    			type: "danger"
	    		});
	    	}
    },
    
    getContext: function() {
    	if (!this.context) {
    		this.context = $("#MyDataTable_" + this.instanceId);
    	}
    	return this.context;
    },
	
	filtro: function(){
		var Loading2 = FLUIGC.loading(window);
		Loading2.show();
		this.loaddata();
		this.myTable.reload(this.mydata);
		console.log('regarregou - filtro');
		Loading2.hide();
	},
	
	griddetalhes: function(){
		var Loading2 = FLUIGC.loading(window);
		Loading2.show();
		this.loaddata2();
		this.myTable2.reload(this.mydata2);
		console.log('carregou detalhes itens');
		Loading2.hide();
	},
	
	loaddata: function(){
		
		console.log('Widget Montagem');
		
		var that = this;
		
		var datasetReturned = DatasetFactory.getDataset("ds_pg_pmd_prc_tipo_porta", null, null, null);
		this.mydata = [];
	    if (datasetReturned != null && datasetReturned.values != null && datasetReturned.values.length > 0) {
	        var records = datasetReturned.values;
	        for ( var index in records) {
	            var record = records[index];
	            
	            this.mydata.push({
	            	teste : '<button id="testbut" class="btn btn-info btn-sm" data-datatable-selected ><span class="fluigicon fluigicon-pencil "></span></button>',
	            	cod_tipoporta : record.cod_tipoporta,
	            	descricao_tipoporta : record.descricao_tipoporta,
	            	porta_dupla : record.porta_dupla,
	            	descricao_porta_dupla : record.descricao_porta_dupla,	            	
	            	material_tipoporta : record.material_tipoporta,
	            	descricao_material_tipoporta : record.descricao_material_tipoporta,
	            	preco_tipoporta : record.preco_tipoporta,
	            	preco_tipoporta_formatado : record.preco_tipoporta_formatado,
	            	status_tipoporta : record.status_tipoporta,
	            	descricao_status_tipoporta : record.descricao_status_tipoporta
	            });
	        }
	        console.log(this.mydata);
	    };
		
	},
	
	loadTable: function() {
		
		this.loaddata();
		
		var that = this;
		
	    var instanceId = that.instanceId;

		that.myTable = FLUIGC.datatable('#idtable' + "_" + instanceId , {
			dataRequest: this.mydata,
			renderContent: ['teste', 
							'cod_tipoporta' , 
							'descricao_tipoporta' ,
							'material_tipoporta', 
							'descricao_material_tipoporta', 
							'descricao_porta_dupla',
							'porta_dupla',							
							'preco_tipoporta',
							'preco_tipoporta_formatado',
							'status_tipoporta', 
							'descricao_status_tipoporta'],
			header: [{
				'title': ''
			},{
				'title': 'Codigo'
			},{
				'title': 'Descrição'
			},{
				'title': 'Caracter Material',
				'display': false
			},{
				'title': 'Material'
			},{
				'title': 'Porta Dupla',
				'display': true
			},{
				'title': 'Caracter Porta Dupla',
				'display': false
			},{
				'title': 'Preço Decimal',
				'display': false
			},{
				'title': 'Preço'
			},{
				'title': 'Caracter Status',
				'display': false
			},{
				'title': 'Status'
			}],
			
			search: {
				enabled: true,
				onlyEnterkey: false,
				searchAreaStyle: 'col-md-6',
				onSearch: function(res) {
					that.myTable.reload(that.tableData);
					if (res) {
						var data = that.myTable.getData();
						var search = data.filter(function(el) {
							return (el.cod_tipoporta.toUpperCase().indexOf(res.toUpperCase()) >= 0)
										||(el.descricao_tipoporta.toUpperCase().indexOf(res.toUpperCase()) >= 0)
										||(el.descricao_porta_dupla.toUpperCase().indexOf(res.toUpperCase()) >= 0)
										||(el.descricao_material_tipoporta.toUpperCase().indexOf(res.toUpperCase()) >= 0)
										||(el.preco_tipoporta_formatado.toUpperCase().indexOf(res.toUpperCase()) >= 0)
										||(el.descricao_status_tipoporta.toUpperCase().indexOf(res.toUpperCase()) >= 0);
						});
						that.myTable.reload(search);
						
					}
				}
			},
			scroll: {
				target: "#idtable",
				enabled: true
			},
			actions: {
				enabled: false,
				template: '.mydatatable-template-row-area-buttons',
				actionAreaStyle: 'col-md-6'
			},
			navButtons: {
				enabled: false,
				//forwardstyle: 'btn-warning',
				//backwardstyle: 'btn-warning',
			},
			draggable: {
				enabled: false
			},
			classSelected: 'info',
		}, function(err, data) {
			if (err) {
				FLUIGC.toast({
					message: err,
					type: 'danger'
				});
			}
		});

		that.myTable.on('fluig.datatable.loadcomplete', function() {
			if (!that.tableData) {
				that.tableData = that.myTable.getData();
			}
		});
		
		

	},
	
	selected: function(el, ev) {
		var index = this.myTable.selectedRows()[0];
		var selected = this.myTable.getRow(index);
		this.dadosAlteracaoCadastro(selected, el, ev);
	},

	
	dadosAlteracaoCadastro:function(selected,el, ev) {
		var myLoading2 = FLUIGC.loading(window);
		myLoading2.show();
		
		$("#cod_tipoPorta_edit").val(selected.cod_tipoporta);
		$("#descricao_tipoPorta_edit").val(selected.descricao_tipoporta.trim());
		$("#porta_dupla_edit").val(selected.porta_dupla.trim());
		$("#material_tipoPorta_edit").val(selected.material_tipoporta.trim());
		$("#preco_tipoPorta_edit").val(selected.preco_tipoporta_formatado.trim());
		$("#status_tipoPorta_edit").val(selected.status_tipoporta.trim());
		
		$("#dadosAlteracao").fadeIn('1500');
		$("#tablepai").fadeOut('1500');
		$('html,body').animate({scrollTop: 0},'slow');
		myLoading2.hide();
	},
	
	confirmaalterar: function(){
		var index = this.myTable.selectedRows()[0];
		var selected = this.myTable.getRow(index);
		
		var modalconfim = FLUIGC.message.confirm({
		    message: 'Confirma Alteração?',
		    title: 'Alterar Montagem',
		    labelYes: 'Alterar',
		    labelNo: 'Cancelar',
		    autoClose: true,
		}, function(result, el, ev) {
			if(result){
				MyDataTable.loadingaltera.show(); //instancia.loading.hide(); 
								
		    	getAltera(this);
		    	/*
				MyDataTable.loadingaltera.hide(); //instancia.loading.hide();
				FLUIGC.toast({
		    		title: '',
		    		message: "Alterado..." ,
		    		type: 'success'
		    	});
				*/
			}

		});

		
	},
	
	voltartela:function(el, ev) {
		var myLoading2 = FLUIGC.loading(window);
		myLoading2.show();
		this.loaddata();
		this.myTable.reload(this.mydata);
		//alert("voltando");
		$("#tablepai").fadeIn('1500');
		$("#dadosAlteracao").fadeOut('1500');
		myLoading2.hide();
	}

});


function getAltera(instacia){
	
	var cod_tipoporta_edit = $('#cod_tipoPorta_edit').val().trim();
	var descricao_tipoporta_edit = $('#descricao_tipoPorta_edit').val().trim();
	var porta_dupla_edit = $('#porta_dupla_edit').val().trim();
	var material_tipoporta_edit = $('#material_tipoPorta_edit').val().trim();
	var preco_tipoporta_edit = $('#preco_tipoPorta_edit').val().trim();
	var status_tipoporta_edit = $('#status_tipoPorta_edit').val().trim();
	
	preco_tipoporta_edit = preco_tipoporta_edit.replace('.','');
	preco_tipoporta_edit = preco_tipoporta_edit.replace(',','.');	
	
	var c1 = DatasetFactory.createConstraint('cod_tipoPorta_edit', cod_tipoporta_edit , cod_tipoporta_edit, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint('descricao_tipoPorta_edit', descricao_tipoporta_edit , descricao_tipoporta_edit, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint('porta_dupla_edit', porta_dupla_edit, porta_dupla_edit, ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint('material_tipoPorta_edit', material_tipoporta_edit, material_tipoporta_edit, ConstraintType.MUST);
	var c5 = DatasetFactory.createConstraint('preco_tipoPorta_edit', preco_tipoporta_edit, preco_tipoporta_edit, ConstraintType.MUST);
	var c6 = DatasetFactory.createConstraint('status_tipoPorta_edit', status_tipoporta_edit, status_tipoporta_edit, ConstraintType.MUST);
		
	var datasetReturned = DatasetFactory.getDataset("ds_pg_alt_pmd_prc_tipo_porta", null, new Array(c1,c2,c3,c4,c5,c6), null);
	
	console.log("Executou Alteracao: " + datasetReturned);
	
	successCallBackAltera(datasetReturned,instacia);
	
}


function successCallBackAltera(retornoAlteracao,instancia){
	
	var status = retornoAlteracao.values[0].STATUS;
	var mensagem = retornoAlteracao.values[0].ERROR;
	if(status == "SUCCESS"){
		//recarregaDados(instancia);		
		//$("#tablepai").fadeIn('1500');
		//$("#dadosAlteracao").fadeOut('1500');
		//$('html,body').animate({scrollTop: 0},'slow');
		MyDataTable.loadingaltera.hide() //instancia.loading.hide(); 
		FLUIGC.toast({
    		title: '',
    		message: "Alterado com Sucesso..." ,
    		type: 'success'
    	});
	}else{
		//recarregaDados(instancia);		
		MyDataTable.loadingaltera.hide() //instancia.loading.hide(); 
		console.log('ERROR');
		FLUIGC.toast({
    		title: '',
    		message: "ERRO: " + mensagem ,
    		type: 'danger'
    	});
	}
}
