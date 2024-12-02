     function calcImpostosSimula(){
    	 
    	var insEstadual = $("#ins_estadual").val().replace("[^0-9]", "").trim();
    	var finalidade = "1";
    	if (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO") {
    		finalidade = "2";
    	} else if( $("#cod_class").val() == "U" || $("cod_class").val() == "u" ){
    		finalidade = "3";
    	}
    	 
    	var html = "<body class='fluig-style-guide' >" +
			    "<div class='table-responsive' style='overflow: auto; height: 220px;'>" +
			    	"<table style='width: 100%;' >" +
			    	"	<tr>" +
			    	"		<td>Código</td> "+
			    	"		<td>Den. Item</td> "+
			    	"		<td>Valor Merc.</td> "+
			    	"		<td>% ICMS</td> "+
			    	"		<td>% ICMS DIF.</td> "+
			    	"		<td>% PIS</td> "+
			    	"		<td>% COFINS</td> "+
			    	"		<td>% IPI</td> "+
			    	"		<td>% ICMS ST</td> "+
			    	"		<td>Total</td> "+
			    	"	</tr>";
    	function formatNumber(valor,casas){
    		return String((valor).toFixed(casas)).replace('.', ',');
    	}
    	var total = 0;
    	var linha = 0;
    	var totalDif = 0;
    	var totalIPI = 0;
    	var totalST = 0;
    	var totalMerc = 0;
    	
 		$("input[name^='cod_item___']").each(function() {
		
 			linha += 1;
 			var seq = $(this).attr("id").split("___")[1];
 			
 			var ct = new Array();
 			ct.push( DatasetFactory.createConstraint( 'cod_empresa', 		$("#empresa").val(), 				$("#empresa").val(), 				ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'cod_cliente', 		$("#cod_cliente").val(), 			$("#cod_cliente").val(), 			ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'uf', 				$("#estado_ent").val(), 			$("#estado_ent").val(), 			ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'nat_operacao', 		$("#nat_operacao").val(), 			$("#nat_operacao").val(), 			ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'cod_tipo_carteira', 	$("#cod_tip_carteira_cli").val(), 	$("#cod_tip_carteira_cli").val(), 	ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'finalidade', 		finalidade, 						finalidade, 						ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'cod_item', 			$("#cod_item___"+seq).val(), 		$("#cod_item___"+seq).val(), 		ConstraintType.MUST) );
 			ct.push( DatasetFactory.createConstraint( 'valor', 				'100', 								'100', 								ConstraintType.MUST) );
 			
			var ds = DatasetFactory.getDataset( 'dsk_calc_impostos', null, ct, null);
			 	
			var valor = isNull( Math.round( parseFloat( $('#valor_total___'+seq).val().replace( /\./g, '').replace( ',', '.') ) * 100 ) / 100, 1 );
			
			totalDif += valor * ( finalidade == "1" ? parseFloat( ds.values[0]["icms_difal"] ) : 0 ) / 100;
			totalIPI += valor * parseFloat( ds.values[0]["ipi"] ) / 100;
			totalST += valor * parseFloat( ds.values[0]["st"] ) / 100;
			totalMerc += isNull( Math.round( parseFloat( $('#valor_total___'+seq).val().replace( /\./g, '').replace( ',', '.') ) * 100 ) / 100, 1 );
			
			
			valor += valor * parseFloat( ds.values[0]["ipi"] ) / 100;
			valor += valor * parseFloat( ds.values[0]["st"] ) / 100;
			valor += valor * ( finalidade == "1" ? parseFloat( ds.values[0]["icms_difal"] ) : 0 ) / 100;
			
			total += valor;
			
			var stl = "	style='background-color: gainsboro;' ";
			if( linha % 2 ){	
				stl = " style='background-color: beige;' ";
			}	
			
			
			valDif = ( finalidade == "1" ? formatNumber( parseFloat( ds.values[0]["icms_difal"] ), 2 ) : "0,00" );
			
			html += "<tr "+ stl +" >" +
				    "		<td>"+ $("#cod_item___"+seq).val() +"</td> "+
				    "		<td>"+ $("#den_item___"+seq).val() +"</td> "+
				    "		<td align='left'>"+ $("#valor_total___"+seq).val() +"</td> "+
				    "		<td align='left'>"+ formatNumber( parseFloat( ds.values[0]["icms"] ), 2 ) +"</td> "+
				    "		<td align='left'>"+ valDif +"</td> "+
				    "		<td align='left'>"+ formatNumber( parseFloat( ds.values[0]["pis"] ), 2 ) +"</td> "+
				    "		<td align='left'>"+ formatNumber( parseFloat( ds.values[0]["cofins"] ), 2 ) +"</td> "+
				    "		<td align='left'>"+ formatNumber( parseFloat( ds.values[0]["ipi"] ), 2 ) +"</td> "+
				    "		<td align='left'>"+ formatNumber( parseFloat( ds.values[0]["st"] ), 2 ) +"</td> "+
				    "		<td align='left'>"+ formatNumber( valor, 2 ) +"</td> "+
				    " </tr>";
			
			
		});
 		
 		var totalFrete = 0;
 		
 		if( $("#tipo_frete_logix").val() != '1' ){
			var ct = new Array();
			ct.push( DatasetFactory.createConstraint( 'cod_empresa', 		$("#empresa").val(), 				$("#empresa").val(), 				ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'cod_cliente', 		$("#cod_cliente").val(), 			$("#cod_cliente").val(), 			ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'cod_transportador', 	$("#cod_trans").val(), 				$("#cod_trans").val(), 				ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'cod_cidade_ent', 	$("#cod_cidade_ent").val(), 		$("#cod_cidade_ent").val(), 		ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'peso_total', 		$("#peso_total_geral").val().replace( /\./g, '').replace( ',', '.'), 	$("#peso_total_geral").val().replace( /\./g, '').replace( ',', '.'), 		ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'cubagem_total', 		'0', 								'0', 								ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint( 'valor_total', 		total, 								total, 							ConstraintType.MUST) );
				
			var ds = DatasetFactory.getDataset( 'dsk_calc_frete', null, ct, null);
			
			if(ds.values.length > 0){
				if( totalFrete = ds.values[0]["status"] == "OK" ){
					totalFrete = parseFloat( ds.values[0]["valor_frete"] );
				}
			}
 		}
 		
		html += "<tr >" +
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>Mercadoria</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalMerc, 2 ) +"</b></td> "+
	    " </tr>"+
	    "<tr >" +
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>IPI</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalIPI, 2 ) +"</b></td> "+
	    " </tr>"+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>ICMS ST</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalST, 2 ) +"</b></td> "+
	    " </tr>"+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>Valor NF</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalMerc + totalIPI + totalST, 2 ) +"</b></td> "+
	    " </tr>"+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>Dif. Alicota</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalDif, 2 ) +"</b></td> "+
	    " </tr>"+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>Frete FOB</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalFrete, 2 ) +"</b></td> "+
	    " </tr>"+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td></td> "+
	    "		<td>Valor Total</td> "+
	    "		<td align='left'><b>"+ formatNumber( totalMerc + totalIPI + totalST +totalDif + totalFrete, 2 ) +"</b></td> "+
	    " </tr>";
 		
 		html += "</table>"+
	    "</div>" +
	    "</body>";	
    	 
     
     parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
		
	var myModal = FLUIGC.modal({
				title: "Simulação Tributaria (*após efetivar o pedido os valor podem sofrem variação!)",
				content: html,
				id: 'modal_tributos',
				formModal: false,
				size: "full",
				actions: [{
					'label': 'Fechar',
					'autoClose': true
				}]
			}, function(err, data) {
				if(err) {
					// do error handling
				} else {
				
					
				}
			});			
			
     }