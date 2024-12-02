var $this = null;
var myLoading2 = null;
var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {
        $this = this;

        if (this.isEditMode) {
            // código para ser executado quando estiver em modo de edição
        } else {
            myLoading2 = FLUIGC.loading(window);

            var mydate = new Date();
            var year = mydate.getFullYear();
            var daym = mydate.getDate();
        
            if (daym < 10) {
                daym = "0" + daym;
            }
        
            var monthm = mydate.getMonth() + 1;
            if (monthm < 10) {
                monthm = "0" + monthm;
            }

            var dateNow = daym + "/" + monthm + "/" + year;
            
            mydate.setDate(mydate.getDate() - 30);

            var year = mydate.getFullYear();
            var daym = mydate.getDate();
        
            if (daym < 10) {
                daym = "0" + daym;
            }
        
            var monthm = mydate.getMonth() + 1;
            if (monthm < 10) {
                monthm = "0" + monthm;
            }

            var dateMinus30 = daym + "/" + monthm + "/" + year;

            $('#data_ini_' + $this.instanceId).val(dateMinus30);
            $('#data_fim_' + $this.instanceId).val(dateNow);

            loaddataTable();

            loadBarChart();
            loadPieChart();
            loadPieChartDetail();

            setMask();
        }

    },
  
    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-imprimir ': ['click_imprimir'],
            'load-excel': ['click_loadExcel'],            
            'consulta-processo': ['click_consultaProcesso'],
            'order-by': ['click_orderBy'],
        },
        global: {}
    },
 
    filtrar: function(htmlElement, event) {

        if ( $('#myTab').find('li.active')[0].id == 'li_consulta'){
            loadDados();
        }

        if ( $('#myTab').find('li.active')[0].id == 'li_dashboard'){
            loadBarChart();
            loadPieChart();
            loadPieChartDetail();
        }
    },

    orderBy: function(htmlElement, event){
        var table = $(htmlElement).offsetParent().offsetParent()[0].getAttribute('data-edit-tbl');
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

    imprimir: function(el, ev){
		
        //		renderContent: ['usuario','data','status','valor_desp','valor_km','valor_total','bt','processo'],
		
		var html = " <!DOCTYPE html> "+
				 	" <html> "+
				 	" 	<head> "+
				 	" 		<style> "+
				 	" 			table, th, td { "+
				 	" 				border: 1px solid black; "+
				 	" 				border-collapse: collapse; "+
				 	" 			} "+
				 	" 			th, td { "+
				 	" 				padding: 5px; "+
				 	" 			} "+
				 	" 		</style> "+
				 	" 	</head> "+
				 	" <body> ";
				

		var htmlColumn = "";
        console.log('rContent......', rContent );
        console.log('rHeader.......', rHeader );
        
        for( var j = 0; j < rContent.length; j++ ){
        	console.log('header......', rContent[j], rHeader[j]['title'], rHeader[j]['width'] );
        	if( rHeader[j]['width'] != '0'
        		&& rHeader[j]['width'] != '0%'
        		&& rHeader[j]['width'] != undefined ){
        		htmlColumn += " <td style='width:  "+ rHeader[j]['width'] +";' style='font-size: 8px;' > "+ rHeader[j]['title'] +" </td> "
        	}
        }
        
        
        var data = dataTable.getData();
		
		html += "<table style='width:  100%;' >" +
			 	"	<tr>" +
			 	"		<td align='center' >" +
			 	"			<b> Projetos Stop </b>" +
			 	"		</td>" +
			 	"	</tr>" +
			 	"</table>" +
			 	"</br>" +
				"<table style='width:  100%;' border='1' >" +
				"	<tr>" +
				" 		"+ htmlColumn +
				"	</tr> ";

        
        for(var i = 0; i < data.length; i++ ){
        	//console.log('loadOcorrencia data..... ', i, data[i]);
        	console.log('entrou...... print ');
        	
        	html += "<tr  style='font-size: 8px;' >";

        	for( var j = 0; j < rContent.length; j++ ){
	           	if( rHeader[j]['width'] != '0'
	           		&& rHeader[j]['width'] != '0%'
	           		&& rHeader[j]['width'] != undefined ){
	           		if( rContent[j] != 'matricula' && rContent[j] != 'usuario' ){
	           			html += " <td> "+ data[i][rContent[j]] +" </td> ";
	           		}
	           	}
        	}
        	html += "</tr> ";
        }
        
		html += "</table>"+
        		"</body> "+
        		"</html> "; 	

        console.log('html.....',html);

        
        var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        //WindowObject.document.writeln(DocumentContainer.innerHTML);
        WindowObject.document.writeln(html);
        WindowObject.document.close();
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();

    },
    
    loadExcel: function(el, ev){

		var idTable = "";
		$("table[id^=fluig-table-]", '#table' + '_' + $this.instanceId).each(function(index){
            idTable = $(this).attr("id");
            console.log(idTable);
		});
		 
		var fileName = 'programaStop_'+WCMAPI.getUserLogin()+'_'+$.now(); 
		
		$("#"+idTable).btechco_excelexport({
					containerid: idTable,
					datatype: $datatype.Table,
					returnUri: true,
					filename: fileName
        });		 

    },

    consultaProcesso: function(el, ev){

        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        var parentOBJ;

        if (window.opener) {
            parentOBJ = window.opener.parent;
        } else {
            parentOBJ = parent;
        }

        var cfg = {
            url : "/ecm_documentview/documentView.ftl",
            maximized : true,
            title : "Anexo",
            callBack : function() {
                parentOBJ.ECM.documentView.getDocument( selected.documentid );
            },
            customButtons : []
        };
        parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
    }

});

function loadBarChart(){

    myLoading2.show();

    var tPai = getTable('stop','');
    // var tFilho1 = getTable('stop','reacao_pessoas');
    // var tFilho2 = getTable('stop','posicao_pessoas');
    // var tFilho3 = getTable('stop','protecao_pessoas');
    // var tFilho4 = getTable('stop','ferramenta_equipamento');
    // var tFilho5 = getTable('stop','procedimentos');
    // var tFilho6 = getTable('stop','padrao_limpeza');

    var SQL =   
    
    "select "+
    "    zona, "+
    "    mes, "+
    "    sum(media_total) media_total "+
    "from  "+
    "( "+
    // "    select  "+
    // "        sc.zona, "+
    // "        month(u.START_DATE) mes, "+
    // "        (select ROUND(SUM(cast(it1.resp1 as int)),2) from "+tFilho1+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) + "+
    // "        (select ROUND(SUM(cast(it1.resp2 as int)),2) from "+tFilho2+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) + "+
    // "        (select ROUND(SUM(cast(it1.resp3 as int)),2) from "+tFilho3+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) + "+
    // "        (select ROUND(SUM(cast(it1.resp4 as int)),2) from "+tFilho4+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) + "+
    // "        (select ROUND(SUM(cast(it1.resp5 as int)),2) from "+tFilho5+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) + "+
    // "        (select ROUND(SUM(cast(it1.resp6 as int)),2) from "+tFilho6+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) as media_total "+
    // "     "+
    // "    from  "+
    // "        "+tPai+" sc  "+
    // "        join documento dc on (dc.cod_empresa = sc.companyid and dc.nr_documento = sc.documentid and dc.nr_versao = sc.version)  "+
    // "        join anexo_proces an on (an.COD_EMPRESA = sc.companyid and an.NR_DOCUMENTO = sc.documentid)  "+
    // "        join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA and u.NUM_PROCES = an.NUM_PROCES )  "+
    // "        join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT )  "+
    // "        join fdn_user ra on ( ra.USER_ID = na.USER_ID )  "+
    // "    where  "+
    // "        dc.versao_ativa = 1 "+  
    // "        and u.status <> 1  ";
    "       select  "+
    "           sc.zona ,"+
    "           month( convert(datetime, sc.data_refer, 103) ) mes, "+
    "           count(an.NUM_PROCES) as media_total     "+
    "       from  "+
     "          "+tPai+" sc  "+
    "           join documento dc on (dc.cod_empresa = sc.companyid and dc.nr_documento = sc.documentid and dc.nr_versao = sc.version)  "+
    "           join anexo_proces an on (an.COD_EMPRESA = sc.companyid and an.NR_DOCUMENTO = sc.documentid)  "+
    "           join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA and u.NUM_PROCES = an.NUM_PROCES )  "+
    "           join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT )  "+
    "           join fdn_user ra on ( ra.USER_ID = na.USER_ID )  "+
    "       where  "+
    "           dc.versao_ativa = 1 "+
    "           and u.status <> 1  ";

    if( $('#zona_'+$this.instanceId ).val() != '' ){
        SQL += " and sc.zona = '"+ $('#zona_'+$this.instanceId ).val() +"' ";
      }
    
    if( $('#area_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.area = '"+ $('#area_'+$this.instanceId ).val() +"' ";
    }

    if( $('#setor_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.setor = '"+ $('#setor_'+$this.instanceId ).val() +"' ";
    }

    if( $('#matricula_'+$this.instanceId ).val() != '' ){
        SQL += " and u.COD_MATR_REQUISIT = '"+ $('#matricula_'+$this.instanceId ).val() +"' ";
    }

    if( $('#data_ini_'+$this.instanceId ).val() != '' && $('#data_fim_'+$this.instanceId ).val() != '' ){

        var data_ini = $('#data_ini_'+$this.instanceId ).val().split('/').reverse().join('-');
        var data_fim = $('#data_fim_'+$this.instanceId ).val().split('/').reverse().join('-');
        
        //SQL += " and CAST(u.START_DATE AS DATE) between '" +data_ini+ "' and '"+data_fim+ "' ";
        SQL += " and case when charindex( '-', sc.data_refer ) <> 0 "+ 
        		"			then convert(datetime, sc.data_refer, 101) "+
        		"			else convert(datetime, sc.data_refer, 103) end between '" +data_ini+ "' and '"+data_fim+ "' ";
        
    }

    SQL +=  "       group by sc.zona, month( convert(datetime, sc.data_refer, 103) ) "+
            ") T "+
            "group by  "+
            "    zona, "+
            "    mes "+
            "order by  "+
            "    zona, "+
            "    mes ";

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));

    var callback = {
        success: function(dataSet) {
        	
        	console.log(' callback loadBarChart ');
        	
            var data = {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul","Ago","Set","Out","Nov","Dez"],
                datasets: []
            };
        
            var setor = '';
            var array_setores = new Array();
            for(var i = 0; i < dataSet.values.length; i++ ){
                if (setor != dataSet.values[i]['zona']) {
                    setor = dataSet.values[i]['zona'];
                    array_setores.push(dataSet.values[i]['zona'])
                }
            }
        
            for(var i = 0; i < array_setores.length; i++ ){
                var array_valores = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
                for(var j = 0; j < dataSet.values.length; j++ ){
                    if (array_setores[i] == dataSet.values[j]['zona']) {
                        array_valores[getFloatValue(dataSet.values[j]['mes']) - 1] += parseFloat(dataSet.values[j]['media_total']);
                    }
                }
                data.datasets.push({label: array_setores[i],
                                    data: array_valores});
            }
        
            console.log(data);
            
        
            var options = { 
                legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>;border: 1px solid <%=datasets[i].strokeColor%>;"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>: <%=datasets[i].value%></li><%}%></ul>'
            };
            
            var width = $("#chart1").width() * 1.07;
            var height = $("#chart1").width() * 100 / 400;
        
            var barChart1 = FLUIGC.chart('#chart1', {
                id: 'bar_chart',
                width: width,
                height: height,
                /* See the list of options */
            });
            var barChart = barChart1.bar(data, options);
            var legend = barChart.generateLegend();
            console.log('legend',legend);
            document.getElementById('legend_chart1').innerHTML = legend;
        
            myLoading2.hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    };

    dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);
}

function loadPieChart() {
    myLoading2.show();

    var tPai = getTable('stop','');
    var tFilho1 = getTable('stop','reacao_pessoas');
    var tFilho2 = getTable('stop','posicao_pessoas');
    var tFilho3 = getTable('stop','protecao_pessoas');
    var tFilho4 = getTable('stop','ferramenta_equipamento');
    var tFilho5 = getTable('stop','procedimentos');
    var tFilho6 = getTable('stop','padrao_limpeza');

    var SQL =   "select "+
                "    sum(media1) media1, "+
                "    sum(media2) media2, "+
                "    sum(media3) media3, "+
                "    sum(media4) media4, "+
                "    sum(media5) media5, "+
                "    sum(media6) media6 "+
                "from  "+
                "( "+
                "select "+
                "ROUND((select ROUND(SUM(cast(it1.resp1 as int)),2) from "+tFilho1+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media1,  "+
                "ROUND((select ROUND(SUM(cast(it1.resp2 as int)),2) from "+tFilho2+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media2,  "+
                "ROUND((select ROUND(SUM(cast(it1.resp3 as int)),2) from "+tFilho3+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media3,  "+
                "ROUND((select ROUND(SUM(cast(it1.resp4 as int)),2) from "+tFilho4+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media4,  "+
                "ROUND((select ROUND(SUM(cast(it1.resp5 as int)),2) from "+tFilho5+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media5,  "+
                "ROUND((select ROUND(SUM(cast(it1.resp6 as int)),2) from "+tFilho6+" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),2) media6 "+
                "from "+ tPai +" sc "+
                "join documento dc on (dc.cod_empresa = sc.companyid "+
                "                and dc.nr_documento = sc.documentid "+
                "                and dc.nr_versao = sc.version) "+
                "join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+
                "                and an.NR_DOCUMENTO = sc.documentid) "+
                "join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA "+
                "                        and u.NUM_PROCES = an.NUM_PROCES ) "+
                "join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) "+
                "join fdn_user ra on ( ra.USER_ID = na.USER_ID ) "+
                "where dc.versao_ativa = 1 "+
                "      and u.status <> 1  ";

    if( $('#zona_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.zona = '"+ $('#zona_'+$this.instanceId ).val() +"' ";
    }

    if( $('#area_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.area = '"+ $('#area_'+$this.instanceId ).val() +"' ";
    }

    if( $('#setor_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.setor = '"+ $('#setor_'+$this.instanceId ).val() +"' ";
    }

    if( $('#matricula_'+$this.instanceId ).val() != '' ){
        SQL += " and u.COD_MATR_REQUISIT = '"+ $('#matricula_'+$this.instanceId ).val() +"' ";
    }

    if( $('#data_ini_'+$this.instanceId ).val() != '' && $('#data_fim_'+$this.instanceId ).val() != '' ){

        var data_ini = $('#data_ini_'+$this.instanceId ).val().split('/').reverse().join('-');
        var data_fim = $('#data_fim_'+$this.instanceId ).val().split('/').reverse().join('-');
        //var data_ini = $('#data_ini_'+$this.instanceId ).val();
        //var data_fim = $('#data_fim_'+$this.instanceId ).val();
        
        //SQL += " and CAST(u.START_DATE AS DATE) between '" +data_ini+ "' and '"+data_fim+ "' ";
        SQL += " and case when charindex( '-', sc.data_refer ) <> 0 "+ 
        		"			then convert(datetime, sc.data_refer, 101) "+
        		"			else convert(datetime, sc.data_refer, 103) end between '" +data_ini+ "' and '"+data_fim+ "' ";
    }

    SQL += ") T ";

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));  

    var callback = {
        success: function(dataSet) {

            console.log('dataSet', dataSet);
            console.log(' callback loadPieChart ');

            var data = [  { label: 'Reação Pessoas',
                                value: parseFloat(dataSet.values[0]["media1"])
                            },
                            { label: 'Posição Pessoas',
                                value: parseFloat(dataSet.values[0]["media2"])
                            },
                            { label: 'Proteção Pessoas',
                                value: parseFloat(dataSet.values[0]["media3"])
                            },
                            { label: 'Ferra Equip.',
                                value: parseFloat(dataSet.values[0]["media4"])
                            },
                            { label: 'Procedimentos',
                                value: parseFloat(dataSet.values[0]["media5"])
                            },
                            { label: 'Padrão Limpeza',
                                value: parseFloat(dataSet.values[0]["media6"])
                            },
                        ];

            var width = $("#chart2").width() * 1.07;
            var height = $("#chart2").width() * 100 / 300;
            // var options = { legendTemplate: "1" };

            var options = { 
                legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"> '+
                                '    <%console.log("segments",segments); for (var i = 0; i < segments.length; i++){%> '+
                                '        <li><span style="background-color: <%=segments[i].fillColor%>; border: 1px solid <%=segments[i].strokeColor%>;"> '+
                                '            </span><%if(segments[i].label){%><%=segments[i].label%><%}%>: <%=segments[i].value%> '+
                                '        </li><%}%> '+
                                '</ul>'
            };

            var pieChart0 = FLUIGC.chart('#chart2', {
                id: 'pie_chart',
                width: width,
                height: height,
                /* See the list of options */
            });
            // call the pie function
            var pieChart = pieChart0.pie(data, options);
            var legend = pieChart.generateLegend();
            console.log('legend', legend);
            document.getElementById('legend_chart2').innerHTML = legend;
            myLoading2.hide();
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    };

    dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);


}

function loadPieChartDetail() {

    myLoading2.show();
    var tPai = getTable('stop','');
    var tbl1 = getTable('stop','reacao_pessoas');
    var tbl2 = getTable('stop','posicao_pessoas');
    var tbl3 = getTable('stop','protecao_pessoas');
    var tbl4 = getTable('stop','ferramenta_equipamento');
    var tbl5 = getTable('stop','procedimentos');
    var tbl6 = getTable('stop','padrao_limpeza');

    var tFilhos = new Array();
    tFilhos.push(tbl1, tbl2, tbl3, tbl4, tbl5, tbl6);

    for (var i = 0; i < tFilhos.length; i++) {
        var seq = i + 1;
        
        var SQL =   "select "+
                    "    it1.questao"+ seq +", "+
                    "    sum(cast(resp"+ seq +" as int)) as resp"+ seq +" "+
                    "from "+ tPai +" sc "+
                    "join documento dc on (dc.cod_empresa = sc.companyid "+
                    "                and dc.nr_documento = sc.documentid "+
                    "                and dc.nr_versao = sc.version) "+
                    "join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+
                    "                and an.NR_DOCUMENTO = sc.documentid) "+
                    "join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA "+
                    "                        and u.NUM_PROCES = an.NUM_PROCES ) "+
                    "join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) "+
                    "join fdn_user ra on ( ra.USER_ID = na.USER_ID ) "+
                    "join "+ tFilhos[i] +" it1 on (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version) "+
                    "where dc.versao_ativa = 1 "+
                    "      and u.status <> 1  ";

        if( $('#zona_'+$this.instanceId ).val() != '' ){
        SQL += " and sc.zona = '"+ $('#zona_'+$this.instanceId ).val() +"' ";
        }
    
        if( $('#area_'+$this.instanceId ).val() != '' ){
        SQL += " and sc.area = '"+ $('#area_'+$this.instanceId ).val() +"' ";
        }
    
        if( $('#setor_'+$this.instanceId ).val() != '' ){
        SQL += " and sc.setor = '"+ $('#setor_'+$this.instanceId ).val() +"' ";
        }

        if( $('#matricula_'+$this.instanceId ).val() != '' ){
            SQL += " and u.COD_MATR_REQUISIT = '"+ $('#matricula_'+$this.instanceId ).val() +"' ";
        }

        if( $('#data_ini_'+$this.instanceId ).val() != '' && $('#data_fim_'+$this.instanceId ).val() != '' ){

            var data_ini = $('#data_ini_'+$this.instanceId ).val().split('/').reverse().join('-');
            var data_fim = $('#data_fim_'+$this.instanceId ).val().split('/').reverse().join('-');
            //var data_ini = $('#data_ini_'+$this.instanceId ).val();
            //var data_fim = $('#data_fim_'+$this.instanceId ).val();
        	
            //SQL += " and CAST(u.START_DATE AS DATE) between '" +data_ini+ "' and '"+data_fim+ "' ";
            SQL += " and case when charindex( '-', sc.data_refer ) <> 0 "+ 
        		"			then convert(datetime, sc.data_refer, 101) "+
        		"			else convert(datetime, sc.data_refer, 103) end between '" +data_ini+ "' and '"+data_fim+ "' ";
        }
        
        SQL+=   "group by "+
                "    it1.questao"+ seq +" ";

        console.log(SQL);

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));  

        var callback = {
            success: function(dataSet) {

                console.log('dataSet', dataSet);

                console.log(' callback loadPieChartDetail ');
                
                var seq = dataSet.columns[0].split('questao')[1];

                var data = new Array();

                for(var j = 0; j < dataSet.values.length; j++ ){
                    data.push({ label: dataSet.values[j]["questao"+seq],
                                value: parseFloat(dataSet.values[j]["resp"+seq])
                            });
                };

                console.log(data);

                var width = $("#pieChart"+seq).width() * 1.07;
                var height = $("#pieChart"+seq).width() * 100 / 300;
                // var options = { legendTemplate: "1" };

                var options = { 
                    legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"> '+
                                    '    <%console.log("segments",segments); for (var i = 0; i < segments.length; i++){%> '+
                                    '        <li><span style="background-color: <%=segments[i].fillColor%>; border: 1px solid <%=segments[i].strokeColor%>;"> '+
                                    '            </span><%if(segments[i].label){%><%=segments[i].label%><%}%>: <%=segments[i].value%> '+
                                    '        </li><%}%> '+
                                    '</ul>'
                };

                var pieChart1 = FLUIGC.chart('#pieChart'+seq, {
                    id: 'pie_chart'+seq,
                    width: width,
                    height: height,
                    /* See the list of options */
                });
                // call the pie function
                var pieChart_1 = pieChart1.pie(data, options);
                var legend = pieChart_1.generateLegend();
                document.getElementById('legend_pieChart'+seq).innerHTML = legend;
                // if ( seq == 1){
                //     var pieChart1 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_1 = pieChart1.pie(data, options);
                // }
                // if ( seq == 2){
                //     var pieChart2 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_2 = pieChart2.pie(data, options);
                // }
                // if ( seq == 3){
                //     var pieChart3 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_3 = pieChart3.pie(data, options);
                // }
                // if ( seq == 4){
                //     var pieChart4 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_4 = pieChart4.pie(data, options);
                // }
                // if ( seq == 5){
                //     var pieChart5 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_5 = pieChart5.pie(data, options);
                // }
                // if ( seq == 6){
                //     var pieChart6 = FLUIGC.chart('#pieChart'+seq, {
                //         id: 'pie_chart'+seq,
                //         width: width,
                //         height: height,
                //         /* See the list of options */
                //     });
                //     // call the pie function
                //     var pieChart_6 = pieChart6.pie(data, options);
                // }
                
                myLoading2.hide();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        };

        dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);
        
    }
}

function loadGraficos(){
    
    if ( $('#myTab').find('li.active')[0].id == 'li_consulta'){
        loadPieChart();
        loadPieChartDetail();
    }

}