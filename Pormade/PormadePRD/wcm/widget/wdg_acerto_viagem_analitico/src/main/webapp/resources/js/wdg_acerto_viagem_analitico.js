var $this = null;

var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {

        $this = this;

        var SQL = "select * from ptv_motorista_cadastro_mtc "+
                "where mtc_proprietario_motorista = 'P'";

        var constraints = new Array();
        constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixDS', null, ConstraintType.MUST) );
        constraints.push( DatasetFactory.createConstraint('sql', SQL, null, ConstraintType.MUST) );
        var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
        console.log('asda', dataSet.values);

        mostraFiltros();

        setMask();

    },
  
    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_loadFiltro'],
            'order-by': ['click_orderBy'],
            'load-excel': ['click_loadExcel']
            
        },
        global: {}
    },
 
    loadFiltro: function() {
        console.log('loadFiltro');
            

        $('#idtable_' + $this.instanceId).html('');
        // dataTable.destroy();

        var tipo = $('#lancamentos_' + $this.instanceId).val();

        if ( $('#dt_ini_' + $this.instanceId).val() == '' || $('#dt_fim_' + $this.instanceId).val() == '') {
            alert('Informe data início e fim');
            // $that.datatable.hideLoading();
            return false;
        }

        if (tipo == 'R'){
            loadReceitas();
        }

        if (tipo == 'D'){
            loadDespesas();
        }

        if (tipo == 'G'){
            loadDescarga();
        }

        if (tipo == 'A'){
            loadAbastecimento();
        }

    },

    loadExcel: function(el, ev){

		var idTable = "";
		$("table[id^=fluig-table-]", '#idtable' + '_' + $this.instanceId).each(function(index){
			idTable = $(this).attr("id");
		});
		 
		var fileName = 'geraInventario_'+WCMAPI.getUserLogin()+'_'+$.now(); 
		
		$("#"+idTable).btechco_excelexport({
					containerid: idTable,
					datatype: $datatype.Table,
					returnUri: true,
					filename: fileName
        });		 

    },

    orderBy: function(htmlElement, event){
        var order = htmlElement.getAttribute('data-order-by');
        
        dados = dataTable.getData();
        
        if( htmlElement.children[1].classList.contains("dropup") ){
            this.orderAscDesc = "ASC";
        }else{
            this.orderAscDesc = "DESC";
        }
        
        if( htmlElement.children[1].classList.contains("dropup") ){
            //this.orderAscDesc = "ASC";
            dados.sort(function(a, b){
                var a1= a[order].toLowerCase(), b1= b[order].toLowerCase();
                if(a1== b1) return 0;
                return a1 > b1? 1: -1;
            });
        }else{
            //this.orderAscDesc = "DESC";
            dados.sort(function(a, b){
                var a1= a[order].toLowerCase(), b1= b[order].toLowerCase();
                if(a1== b1) return 0;
                return a1 < b1? 1: -1;
            });
        }

        dataTable.reload(dados);
    },

});

function mostraFiltros() {
    $('.receitas').hide();
    $('.despesas').hide();
    $('.descarga').hide();
    $('.abastecimento').hide();

    var str = $( "#lancamentos_"+ $this.instanceId +" option:selected" ).text();

    $('.'+str.toLowerCase()).show();
}