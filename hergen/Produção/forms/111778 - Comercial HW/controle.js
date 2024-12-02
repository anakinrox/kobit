		var ies_setor = "";
		var aen = "";
		var sit_financeira = "";

		$(document).bind("DOMNodeRemoved", function(e){
			var target = $(e.target);
			if( target.html().indexOf("id='pai_filho_modal'" ) > 0 || target.html().indexOf("id='modal-zoom'" ) ){
					//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
					parent.$('#workflowview-header').show();
			}
		});

		function setDescricao(){
			if( $('#empresa_reduz').val() == '' || $('#empresa_reduz').val() == undefined ){
				$('#descricao_form').val( $('#empresa').val().trim()+' - '+$('#resumo').val().trim() );
			}else{
				$('#descricao_form').val( $('#empresa_reduz').val().trim()+' - '+$('#resumo').val().trim() );
			}
		}

	   function fnCustomDelete(oElement){
	
			fnWdkRemoveChild(oElement);
		}

	   
		function setTemperatura(){
			console.log('Entrei temperatura');
			loadDsPFCombo( "detalhe_temp", "temperatura", "detalhe", "detalhe", "", "cod_temperatura", $('#temperatura').val(), "detalhe" );
			//loadDsPFCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder){
		}
		
		function setTurbina(){
			console.log('Entrei turbina');
			loadDsPFCombo( "detalhe_turbina", "tipo_turbina", "detalhe", "detalhe", "", "tipo_turbina", $('#tipo_turbina').val(), "detalhe" );
			//loadDsPFCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder){
		}
		
		function setValvula(){
			console.log('Entrei valvula');
			loadDsPFCombo( "detalhe_valvula", "tipo_valvula", "detalhe", "detalhe", "", "tipo_valvula", $('#tipo_valvula').val(), "detalhe" );
			//loadDsPFCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder){
		}
		
	   
	   function changeSetor(){
		   if( $('#task').val() != '0' 
					&& $('#task').val() != '1' 
					&& $('#task').val() != '30' 
					&& $('#task').val() != '11' ){
			   $('#ies_setor').val( ies_setor );   
		   }
	   }
	   
	   function changeAEN(){
		   if( $('#task').val() != '0' 
					&& $('#task').val() != '1' 
					&& $('#task').val() != '30' 
					&& $('#task').val() != '11' ){
			   $('#aen').val( aen );   
		   }
	   }
		   
		function loadBody(){
				
			console.log(' task............... ', $('#task').val() );
			
			autosize(document.querySelectorAll('textarea'));
			
			var d = new Date(); 
			$('#data_fup').val( d.toLocaleString() ) ;
			$('#data_com').val( d.toLocaleString() ) ;
			$('#data_atr').val( d.toLocaleString() ) ;
			
			var calendarDaraPrevEnt = FLUIGC.calendar("input[id^='data_prev_entr']", {pickDate: true, pickTime: true, sideBySide: true } );
			
			FLUIGC.calendar('#data_de_cons' );
			FLUIGC.calendar('#data_ate_cons' );
			
			var calendarDaraPrevFup = FLUIGC.calendar('#data_prev_fup', {pickDate: true, pickTime: true, sideBySide: true } );
			//calendarDaraPrevFup.setDate( d.toLocaleDateString()+' 00:00' );
			
			var calendarDaraPrevCom = FLUIGC.calendar('#data_prev_com', {pickDate: true, pickTime: true, sideBySide: true } );
			//calendarDaraPrevCom.setDate( d.toLocaleDateString()+' 00:00' );
			
			var calendarDaraPrevCom = FLUIGC.calendar('#data_prev_atr', {pickDate: true, pickTime: true, sideBySide: true } );
			
			var calendarDaraPrevExt = FLUIGC.calendar('#data_eng_externa', {pickDate: true, pickTime: true, sideBySide: true } );
			
			
			if( $('#task').val() == '0' || $('#task').val() == '1' || $('#task').val() == '11' ){
				$('#data_abert').val( d.toLocaleString() ) ;
				
				var calendarDaraPrev = FLUIGC.calendar('#data_prev', {pickDate: true, pickTime: true, sideBySide: true } );
				//calendarDaraPrev.setDate( d.toLocaleDateString()+' 00:00' );
				
				var calendarDaraPrevOrc = FLUIGC.calendar('#data_prev_orcamento', {pickDate: true, pickTime: true, sideBySide: true } );
				//calendarDaraPrevOrc.setDate( d.toLocaleDateString()+' 00:00' );
				
			}
			
			if( $('#task').val() == '114' || $('#task').val() == '87' ){
				
				var calendarDaraAssOrc = FLUIGC.calendar('#data_assumida_orcamento', {pickDate: true, pickTime: true, sideBySide: true } );
				//calendarDaraAssOrc.setDate( d.toLocaleDateString()+' 00:00' );
				//calendarDaraAssOrc.setMinDate( d );
				//calendarDaraAssOrc.setMaxDate( new Date( $('#data_prev_orcamento').val() ) );

				$('#data_assumida_orcamento').prop('readonly',false);
				$('#num_orc_logix').prop('readonly',false);				
			}

			if( $('#task').val() == '11' ){
				$('#data_prev_orcamento').prop('readonly',false);
				$('#data_prev').prop('readonly',false);
				$('#data_assumida_orcamento').prop('readonly',false);
				$('#num_orc_logix').prop('readonly',false);	
			}
			
			if( $('#task').val() == '104' ){
				$('#num_orc_logix').prop('readonly',false);
			}
			
			$("#data_assumida_orcamento").css("background-color","#F5A9A9");
			$("#num_orc_logix").css("background-color","#F5A9A9");
			
			qtd = 0;
			$( "input[name*=data_hist___]" ).each(function( index ) {
				qtd += 1;
			});
			if ( qtd == 0 ){
				$("#hist").hide();
			}
			
			qtd = 0;
			$( "input[name*=data_hist_com___]" ).each(function( index ) {
				qtd += 1;
			});
			if ( qtd == 0 ){
				$("#hist_com").hide();
			}

			qtd = 0;
			$( "input[name*=data_hist_atr___]" ).each(function( index ) {
				qtd += 1;
			});
			if ( qtd == 0 ){
				$("#hist_atraso").hide();
			}			
			
			if( $('#task').val() != '127'
				&& $('#task').val() != '157'
				&& $('#task').val() != '159'
				&& $('#task').val() != '178'
			 	&& $('#task').val() != '33'
			 	&& $('#task').val() != '54' ){
				$("#div_fechamento").hide();
			}
			
			ies_setor = $('#ies_setor').val();
			aen = $('#aen').val();
			if( $('#task').val() != '0' 
				&& $('#task').val() != '1' 
				&& $('#task').val() != '30' 
				&& $('#task').val() != '11' 
				&& $('#task').val() != '145' ){

				$('#data_prev').prop('readonly',true);
				$('#cnpj').prop('readonly',true);
				$('#empresa').prop('readonly',true);
				$('#cidade').prop('readonly',true);
				$('#ies_setor').prop('readonly',true);
				$('#aen').prop('readonly',true);
				$('#resumo').prop('readonly',true);
				$('#detalhe').prop('readonly',true);
				$('#data_prev_orcamento').prop('readonly',true);
			}
			
//			data_assumida_orcamento
			if( $('#task').val() != '33' 
				&& $('#task').val() != '29' 
				&& $('#task').val() != '127'
			 	&& $('#task').val() != '54' 
			 	&& $('#task').val() != '157' 
			 	&& $('#task').val() != '159' ){
				$('#aba_followup').hide();
			}
			
			if( $('#task').val() != '141' ){
				sit_financeira = $('#situacao_financeira').val();
				$('#parecer_financeiro').prop('readonly',true);
			}

			if( $('#task').val() == '157' ){
				$('#num_orc_logix').prop('readonly',false);
			}			
			
			
			$('#valor_previsto').maskMoney( { precision:2, thousands:'.',decimal:','} );
			$('#valor_fechado').maskMoney( { precision:2, thousands:'.',decimal:','} );
			
			$('.integer-0').maskMoney( { precision:0, thousands:'',decimal:''} );
			
			
			$("#descricao").val( "" );
			$("#data_prev_fup").val( "" );
			$("#tipo_fup").val( "" );
			$("#descricao_com").val( "" );
			$("#data_prev_com").val( "" );
			$("#tipo_com").val( "" );	
			
			$("#motivo_atraso").val( "" );
			$("#data_prev_atr").val( "" );
			$("#justificativa").val( "" );
			
			/*if( $('#ult_den_motivo_atraso').val() == '' ){
				$('#ult_den_motivo_atraso').val('Atraso Operacional do autor da tarefa');
			}*/
			
			loadDatatable();
			   setTemperatura();
			   setTurbina();
			   setValvula();
		}
				
		var beforeSendValidate = function(numState,nextState){

			var campos = "";
			var consiste = false;
			if( $('#data_prev').val() == "" 
				|| $('#projeto').val() == ""
				|| $('#empresa').val() == ""
				|| $('#cidade').val() == ""
				|| $('#ies_setor').val() == ""
				|| $('#resumo').val() == ""
				//|| $('#detalhe').val() == "" 
					){
				campos += 'Projeto, Cliente, Cidade, Setor, Resumo, Detalhe, ';
				consiste = true;
			}
			if( nextState == '17' &&
				$('#data_prev_com').val() == "" ){
				campos += 'Data Prev. Comunicacao Interna, ';
				consiste = true;
			}
			
			if( ( ( nextState == '127' || nextState == '131' ) && $('#task').val() != '157' ) &&
				$('#data_prev_fup').val() == "" ){
				campos += 'Data Prev. Folow UP, ';
				consiste = true;
			}

			if( $('#task').val() == '141'  
				&& $('#situacao_financeira').val() == "" ){
				
				campos += 'Liberacao Financeira, ';
				consiste = true;
				
			}
			
			if( ( nextState == '54' || nextState == '153' || nextState == '157' ) &&
				$('#ies_fechamento').val() == "" ){
				campos += 'Resultado Fechamento, ';
				consiste = true;
			}			
			
			if( ( nextState == '54' || nextState == '153' || nextState == '157' ) &&
				$('#ies_fechamento').val() == "P" &&
				$('#motivo').val() == "" ){
				campos += 'Motido, ';
				consiste = true;
			}
			
			if( $('#task').val() == '157' && nextState == '54' ){
				var qtd = 0;
				var qtdBranco = 0;
				$('input[name^="cod_item___"]').each(function(i){
					qtd += 1;
					if( $(this).val() == '' ){
						qtdBranco += 1; 	
					}
				});
				if( qtd == 0 || qtdBranco > 0 ){
					campos += 'Itens, ';
					consiste = true;					
				}
			}
			
			if( ( ( $('#task').val() == '87' || $('#task').val() == '114' ) && nextState != '13' ) 
					&& ( $('#data_assumida_orcamento').val() == '' ) ){
				campos += 'Data Assunida para entrega do or&ccedil;amento, ';
				consiste = true;
			}
			
			if( ( ( $('#task').val() == '104' || $('#task').val() == '114' ) && nextState != '13' ) 
					&& ( $('#num_orc_logix').val() == '' ) ){
				campos += 'Numero do or&ccedil;amento, ';
				consiste = true;
			}
			
			if( ( $('#task').val() == '87' || $('#task').val() == '114' )  && nextState != '13' ){
				var dtA = transformaData( $('#data_assumida_orcamento').val() );
				var dtP = transformaData(  $('#data_prev_orcamento').val() );
				console.log( dtP, dtA );
				if( dtP < dtA ){
					console.log( 'data Menor' );
					setTimeout("$('#data_assumida_orcamento').focus();", 1);
					campos += 'Data Assumida Maior que Data Solicitada, ';
					consiste = true;
				}
			}

			if( ( $('#task').val() == '30' || $('#task').val() == '127' )  && nextState == '11' ){
				$('#data_assumida_orcamento').val('');
				$('#num_orc_logix').val('');
			}

			if( $('#task').val() == '29' 
				&& ( nextState == '33' || nextState == '127' )
				&& $('#valor_previsto').val() == '' ){
				campos += 'Valor Previsto, ';
				consiste = true;
			}
			
			var qtd = 0;
			$('.hw-sat').each(function(i){
				if( $(this).prop('checked') ){
					qtd += 1; 	
				}
			});
			if( ( $('#qtd_hw_sat').val() == "" || $('#qtd_hw_sat').val() == "0" ) 
				&& qtd != 0 ){
				campos += 'Você selecionou itens do grupo HW-SAT, mas não definiu quantidade! ';
				consiste = true;
			}
			if( ( $('#qtd_hw_sat').val() != "" && $('#qtd_hw_sat').val() != "0" ) 
				&& qtd == 0 ){
				campos += 'Você definou quantidade para grupo HW-SAT, mas não selecionou nenhum item! ';
				consiste = true;
			}
			
			var qtd = 0;
			$('.hw-sam').each(function(i){
				if( $(this).prop('checked') ){
					qtd += 1; 	
				}
			});
			if( ( $('#qtd_hw_sam').val() == "" || $('#qtd_hw_sam').val() == "0" ) 
				&& qtd != 0 ){
				campos += 'Você selecionou itens do grupo HW-SAM, mas não definiu quantidade! ';
				consiste = true;
			}
			if( ( $('#qtd_hw_sam').val() != "" && $('#qtd_hw_sam').val() != "0" ) 
				&& qtd == 0 ){
				campos += 'Você definou quantidade para grupo HW-SAM, mas não selecionou nenhum item! ';
				consiste = true;
			}
			
			var qtd = 0;
			$('.hw-h').each(function(i){
				if( $(this).prop('checked') ){
					qtd += 1; 	
				}
			});
			if( ( $('#qtd_hw_h').val() == "" || $('#qtd_hw_h').val() == "0" ) 
				&& qtd != 0 ){
				campos += 'Você selecionou itens do grupo HW-H, mas não definiu quantidade! ';
				consiste = true;
			}
			if( ( $('#qtd_hw_h').val() != "" && $('#qtd_hw_h').val() != "0" ) 
				&& qtd == 0 ){
				campos += 'Você definou quantidade para grupo HW-H, mas não selecionou nenhum item! ';
				consiste = true;
			}

			var qtd = 0;
			$('.hw-e').each(function(i){
				if( $(this).prop('checked') ){
					qtd += 1; 	
				}
			});
			if( ( $('#qtd_hw_e').val() == "" || $('#qtd_hw_e').val() == "0" ) 
				&& qtd != 0 ){
				campos += 'Você selecionou itens do grupo HW-E, mas não definiu quantidade! ';
				consiste = true;
			}
			if( ( $('#qtd_hw_e').val() != "" && $('#qtd_hw_e').val() != "0" ) 
				&& qtd == 0 ){
				campos += 'Você definou quantidade para grupo HW-E, mas não selecionou nenhum item! ';
				consiste = true;
			}
			
			var qtd = 0;
			if( $('#tipo_turbina').val() != "" ){ qtd += 1 };
			console.log('turbina', qtd);
			//if( $('#detalhe_turbina').val() != "" && $('#detalhe_turbina').val() != undefined ){ qtd += 1 };
			//console.log('turbina', qtd);
			if( $('#qtd_turbina').val() != "" && $('#qtd_turbina').val() != "0" ){ qtd += 1 };
			console.log('turbina', qtd);
			if( qtd != 0 && qtd != 2 ){
				campos += 'Existem inconsistências na configuração da turbina! ';
				consiste = true;
			}
			
			var qtd = 0;
			if( $('#tipo_valvula').val() != "" ){ qtd += 1 };
			//if( $('#detalhe_valvula').val() != "" && $('#detalhe_valvula').val() != undefined ){ qtd += 1 };
			if( $('#qtd_valvula').val() != "" && $('#qtd_valvula').val() != "0" ){ qtd += 1 };
			console.log('valvula', qtd);
			if( qtd != 0 && qtd != 2 ){
				campos += 'Existem inconsistências na configuração da valvula! ';
				consiste = true;
			}
			
			if( consiste ){
				alert( 'Existem campo nao preenchidos.'+campos );
				return false;
			}		
			
			
			if( ( $('#task').val() == '87' || $('#task').val() == '114' ) && nextState == '13' ) {
				$('#data_assumida_orcamento').val('');
			}
			
			if( ( numState == 1 || numState == 11 ) && nextState == 42 ){
				$("#data_prazo").val( $("#data_prev_com").val() );
				$("#data_prazo_orig").val( $("#data_prev_com").val() );	
			}else if( ( $("#ies_setor").val() == 'O' && numState == 2 )
				   || ( $("#ies_setor").val() == 'A' && numState == 7 )
				   || ( $("#ies_setor").val() == 'P' && numState == 9 ) ){
				
				$("#data_prazo").val( $("#data_prazo_orig").val() );
			}else{
				$("#data_prazo").val( $("#data_prev_com").val() );
			}
			
			/*
			console.log("-beforeSendValidate-");
			var d = new Date();
			
			if( $("#descricao").val() != ""){
				var row = wdkAddChild('folowup'); 
				$('#data_hist___'+row).val( d.toLocaleString() ) ;
				$('#data_prev_hist___'+row).val( $("#data_prev_fup").val() ) ;
				$('#tipo_hist___'+row).val( $("#tipo_fup").val() ) ;
				$('#user_hist___'+row).val( $("#user_fup").val() ) ;
				$('#cod_user_hist___'+row).val( $("#cod_user_fup").val() ) ;
				$('#desc_hist___'+row).val( $("#descricao").val() ) ;				
			}
			
			if( $("#descricao_com").val() != ""){
				var row = wdkAddChild('cominicacao'); 
				$('#data_hist_com___'+row).val( d.toLocaleString() ) ;
				$('#data_prev_hist_com___'+row).val( $("#data_prev_com").val() ) ;
				$('#tipo_hist_com___'+row).val( $("#tipo_com").val() ) ;
				$('#user_hist_com___'+row).val( $("#user_com").val() ) ;
				$('#cod_user_hist_com___'+row).val( $("#cod_user_com").val() ) ;
				$('#desc_hist_com___'+row).val( $("#descricao_com").val() ) ;
			}
			*/
			
			console.log("numState: " + numState);
			console.log("nextState: " + nextState);  
			//throw("Erro Xyz");
		}

		
		function transformaData( dt ){
			
			var dtA = dt.split(' ');
			var data = dtA[0].split('/').reverse().join('');
			var hora = dtA[1].split(':').join('');
			
			return data+hora;
			
		}
		
		function validaData(){
			var dtA = transformaData( $('#data_assumida_orcamento').val() );
			var dtP = transformaData( $('#data_prev_orcamento').val() );
			
			console.log( dtP, dtA );
			if( dtA > dtP ){
				console.log( 'data Menor' );
				setTimeout("$('#data_assumida_orcamento').focus();", 1);
			}else{
				console.log( 'data Maior' );
			}
			
		}
		
		function calcTotalItem(id){
			var seq = id.split('___')[1];
			var total = isNull( Math.round( parseFloat( $('#preco_unit___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 )
					  * isNull( Math.round( parseFloat( $('#qtd_solic___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
			$('#preco_total___'+seq).val( flot2char( total, 2 ) );
			
			var total_geral = 0;
			$( "input[name*=preco_total___]" ).each(function( index ) {
				total_geral += isNull( Math.round( parseFloat( $(this).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
			})
			
			$('#total_geral').val( flot2char( total_geral, 2 ) );
			
		}

		function flot2char(x,p) {
		    x = x.toFixed(p).toString();
		    var pattern = /(-?\d+)(\d{3})/;
		    var inteiro = x.split('.')[0];
		    while (pattern.test(inteiro))
		        inteiro = inteiro.replace(pattern, "$1.$2");
		    return inteiro+','+x.split('.')[1];
		}
		
		
		function addLinha( tabela, origem ){
			
			var seq = 0;
			
			console.log('addLinha inicio');
			
			if( tabela == 'itens_solic' ){
				
				seq = wdkAddChild( tabela );
				autoSize();

				$('#qtd_solic___'+seq).maskMoney( { precision:3, thousands:'.',decimal:','} );
				$('#preco_unit___'+seq).maskMoney( { precision:2, thousands:'.',decimal:','} );
				
				var calendarDaraPrevEnt = FLUIGC.calendar('#data_prev_entr___'+seq);
				
				console.log('addLinha calendarDaraPrevEnt',calendarDaraPrevEnt);
				
				if(  origem == 'button' ){
					$('#cod_item___'+seq).focus();
				}
				
				document.body.scrollTop = $('#qtd_solic___'+seq).offset().top;
				
			}

			setUpper();
			return seq;
		}

		function exitObsArea( e ){
			 if (e.keyCode == 9) {
				var r = confirm("Deseja adicionar um novo item?");
				if (r == true) {
					addLinha( 'itens_solic', 'field' );
				}
				return false;
			 }
			 return true;
		}		
		
		function setUpper(){
			
			$("textarea").keypress( function(e) {
		        var chr = String.fromCharCode(e.which);
				console.log( e.target.type, chr );
				if ( "\"Â´`|^<>".indexOf(chr) > 0  ){
					console.log( ' controle..... ',chr );
					return false;
		        }
		     });
			
		}		

		function autoSize(){

			$('textarea').each(function (){
				$(this).on(
					 'keyup input keypress keydown change',
					 function(e) {
					  var tamanhoMin = $(this).attr('rows')
						* $(this).css('line-height').replace(
						  /[^0-9\.]+/g, '');
					  $(this).css({
					   'height' : 'auto'
					  });
					  var novoTamanho = this.scrollHeight
						+ parseFloat($(this).css("borderTopWidth"))
						+ parseFloat($(this).css("borderBottomWidth"));
					  if (tamanhoMin > novoTamanho)
					   novoTamanho = tamanhoMin;
					  $(this).css({
					   'height' : novoTamanho
					  });
					 }).css({
					'overflow' : 'hidden',
					'resize' : 'none'
				   }).delay(0).show(0, function() {
					var el = $(this);
					setTimeout(function() {
					 el.trigger('keyup');
					}, 100);
				   });
			})
		}

		function isNull( valor, padrao ){
			if ( isNaN( valor ) ){
				return padrao;
			}else{
				return valor;
			}
		}		

				
		function selectMotivo(){
			
			
			$('#den_motivo_atraso').val( $( "#motivo_atraso option:selected" ).text() );
			$('#ult_den_motivo_atraso').val( $('#den_motivo_atraso').val() );
			$('#ult_data_prev_atr').val( $( "#data_prev_atr" ).val() );
			
		}
		
		function selectMotivoHist( id ){
			var seq = id.split('___')[1]; 
			$('#motivo_atraso_hist_atr___'+seq).val( $('#cod_motivo_atraso_hist_atr___'+seq).val() );
		}
		
		function selectSitFinanc(){
		
			var cons = new Array();
			cons.push( DatasetFactory.createConstraint( 'cod_motivo', $('#situacao_financeira').val(), $('#situacao_financeira').val(), ConstraintType.MUST) );
			var dataset = DatasetFactory.getDataset( 'motivo_aprov_financeiro', null, cons, null);
			console.log('Data set motivo_aprov_financeiro....',dataset );
			if ( dataset != null ){
				for (var x = 0; x < dataset.values.length; x++) {
					$('#tipo_motivo').val( dataset.values[x].tipo_motivo );
					console.log('tipo_motivo....', $('#tipo_motivo').val() );
				}
			}
			
			if( $('#task').val() != '141' ){
				$('#situacao_financeira').val( sit_financeira );
			}
			
		}