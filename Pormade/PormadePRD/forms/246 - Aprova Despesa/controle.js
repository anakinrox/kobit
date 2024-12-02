		var valorAcum = 0;
		var tipo_despesas = {};
		
		
		var openImagen = function( idDocumento, versionDocumento, titulo ){
			var myModal = FLUIGC.modal({
			    title: titulo,
			    content:' <div class="imgModal" > '+
			    		' 	 <p><a target="&quot;_blank;&quot;"><img alt="" data-units="px" src="/api/public/ecm/document/documentfile/'+idDocumento+'/'+versionDocumento+'" style="width:100%" /></a></p> '+
			    		' </div> ', 
			    id: 'fluig-modal',
			    size: 'largesmall',
			    actions: [{
			        'label': 'Fechar',
			        'autoClose': true
			    }]
			}, function(err, data) {
			    if(err) {
			        // do error handling
			    } else {
			        // do something with data
			    }
			});
		}
		
		function loadTipoDesp(){
			
			var tipo_despesas = {};
			
			var ds = DatasetFactory.getDataset('tipo_despesa', null, null, null );
			
			if( ds != undefined && ds != null ){
				var regs = ds.values;
				for ( var y in regs ) {
					var reg = regs[y];
					console.log('reg.tipo_despesa.....',reg.tipo_despesa);
					var tipo = {};
					tipo[ 'tipo_despesa' ] = reg.tipo_despesa;
					tipo[ 'valor_padrao' ] = isNull( parseFloat( reg.valor_padrao ), 0.00 );
					tipo[ 'valor_maximo' ] = isNull( parseFloat( reg.valor_maximo ), 0.00 );
					tipo[ 'grupo_despesa' ] = reg.grupo_despesa;
					
					tipo_despesas[ reg.cod_tipo_despesa ] = tipo;
				}
			}
			//console.log('tipo_despesas......',tipo_despesas);
			return tipo_despesas;
		}

		$(document).on("change", ".valitem", function() {
			calculatotal();
		});

		function setMask(){
			$('.decimal_6').maskMoney({precision : 6,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_5').maskMoney({precision : 5,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_4').maskMoney({precision : 4,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_3').maskMoney({precision : 3,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			$('.decimal_1').maskMoney({precision : 1,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_0').maskMoney({precision : 0,thousands : '.',decimal : ',',	defaultZero : true, allowZero : true});
			$('.integer_0').maskMoney({	precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});	
		}

		function loadBody(){

			setMask();
			
			//var d = new Date();
			//console.log('d.toLocaleString()........', d.toLocaleString() );
			//$('#datadespesa').val( d.toLocaleString().substring(0,10) ) ;
						
			FLUIGC.calendar('.dataFluig' );
			if( $('#isMobile').val() == 'S' ){
				$('.resumo').show();
			}
						
			tipo_despesas = loadTipoDesp();
			setTimeout("loadSelectTipoDesp();", 2000);
			
			if( isNull( validafunctions.getFloatValue("valKM"), 0) == 0 ){
		    	$('#aba_km_bt').hide();
		    }				
			
			$('#id_aba_desp').css('font-weight', 'bold'); 
			$('#id_aba_km').css('font-weight', 'bold');
			$('#id_aba_fup').css('font-weight', 'bold');
			
			loadDespesaMes();
			calculatotal();
			trataCampo();
			autoSize();
						
			$("input[name^=valordespesaitem___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				var sValPad = isNull( $("#valor_padrao___" + seq ).val()+"", "" );
				console.log( 'sValPad', sValPad );
				valPadrao = isNull( validafunctions.getFloat( sValPad ), 0);
				console.log( 'valPadrao', valPadrao );
			    if( valPadrao != 0  ){
			    	$('#valordespesaitem___'+seq).attr('readonly',true);
			    	$('#valordespesaitem___'+seq).maskMoney('destroy');
		        }
			});

			var task = $('#task').val();
			
			if( $('#cod_processo').val() == 'adiantamento' ){
				$('#total_depesas').hide();
				$('#total_adiantamento').show();
				if ( !( task == 0 || task == 4 || task == 81 || task == 43 || task == 47 || task == 33 || task == 60 ) ){
					$('.btMobile').hide();
				}
				if ( task != 0 && task != 4 && task != 81 && task != 43 ){
					$('#valoradiant').attr('readonly',true);
				}else{
					$('#valoradiant').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
				}
			}else{
				$('#total_depesas').show();
				$('#total_adiantamento').hide();
				if ( !( task == 0 || task == 4 || task == 81 || task == 33) ){
					$('.btMobile').hide();
				}
			}
			
			trataCampoUnidade();
			
		}
		

		function validaDespData(){			
			$("select[name*=tipodespesa___]").each(function(index, value){				
				var seq = $(this).attr("name").split('___')[1];
				console.log('Verifica _desp ',seq, $('#verificar_desp___'+seq).val());
				if( $('#verificar_desp___'+seq).val() != "[]" 
					&& $('#verificar_desp___'+seq).val() != ""
					&& $('#verificar_desp___'+seq).val() != undefined ){
					$(this).css("background", "#FFECE6");
					$('#resumo___'+seq).css("background", "#FFECE6");
				}else{
					$(this).css("background", "");
					$('#resumo___'+seq).css("background", "");
				}
			});
			
			
			$("select[name*=km_inicial___]").each(function(index, value){				
				var seq = $(this).attr("name").split('___')[1];
				console.log('Verifica km ', seq, $('#verificar_km___'+seq).val() );
				if( $('#verificar_km___'+seq).val() != "[]"
					&& $('#verificar_km___'+seq).val() != ""
					&& $('#verificar_km___'+seq).val() != undefined ){
					$(this).css("background", "#FFECE6");
					$('#resumo_km___'+seq).css("background", "#FFECE6");
				}else{
					$(this).css("background", "");
					$('#resumo_km___'+seq).css("background", "");
				}
			});
			
			$("select[name*=_tipodespesa___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				console.log('Verifica _desp ',seq, $('#_verificar_desp___'+seq).val());
				if( $('#_verificar_desp___'+seq).val() != "[]" 
					&& $('#_verificar_desp___'+seq).val() != ""
					&& $('#_verificar_desp___'+seq).val() != undefined ){
					$(this).css("background", "#FFECE6");
					$('#_resumo___'+seq).css("background", "#FFECE6");
				}else{
					$(this).css("background", "");
					$('#_resumo___'+seq).css("background", "");
				}
			});
			
			$("select[name*=_km_inicial___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				console.log('Verifica _km ',seq, seq,$('#_verificar_km___'+seq).val());
				if( $('#_verificar_km___'+seq).val() != "[]"
					&& $('#_verificar_km___'+seq).val() != ""
					&& $('#_verificar_km___'+seq).val() != undefined ){
					$(this).css("background", "#FFECE6");
					$('#_resumo_km___'+seq).css("background", "#FFECE6");
				}else{
					$(this).css("background", "");
					$('#_resumo_km___'+seq).css("background", "");
				}
			});
			
		}
		
		
		function loadSelectTipoDesp(){			
			$("select[name^=tipodespesa___]").each(function(index, value){				
				loadPaiFilhoCombo( $(this).attr("name"), 'usuario_comercial', 'tipo_despesa', 'cod_tipo_despesa', 'tipo_despesa', 'matricula', $('#codsolicitante').val() );
			});			
			$("select[name^=_tipodespesa___]").each(function(index, value){				
				loadPaiFilhoCombo( $(this).attr("name"), 'usuario_comercial', 'tipo_despesa', 'cod_tipo_despesa', 'tipo_despesa', 'matricula', $('#codsolicitante').val() );
			});						
			validaDespData();
		}
		
		var beforeSendValidate = function(numState,nextState){
			
			var task = $('#task').val();
			
			console.log('task........', task);

			if( ( task == '0' || task == '4' || task == '81' )
				&& $('#cod_processo').val() == 'adiantamento'
				&& ( $('#valoradiant').val() == '' 
					|| $('#valoradiant').val() == undefined ) ){
				
				FLUIGC.toast({
			        title: 'Necess&aacute;rio preencher os campos abaixo.',
			        message: 'Valor solicitado do adiantamento.',
			        type: 'danger'
			    });
				return false;
				
			}
			
			if ( ( $('#cod_processo').val() != 'adiantamento' 
					&& ( task == '0' || task == '4' || task == '81' || task == '33' ) )
		   	  || ( $('#cod_processo').val() == 'adiantamento' 
					&& ( task == '47' || task == '33' ) ) )  {
			
				var msg = "";
				
				if ( $("#solicitante").val() == undefined || $("#solicitante").val() == "" ) {
					msg += '"Solicitante" ' ;
				}
				if ( $("#gestor").val() == undefined || $("#gestor").val() == "" ) {
					msg += '"Gestor" ' ;
				}
				
				if ( $('#cod_processo').val() != 'adiantamento' 
					&& ( $("#valordespesa").val() == undefined || $("#valordespesa").val() == "" || $("#valordespesa").val() == "0,00" ) ) {
					msg += '"Valor de Despesa" ' ;
				}
				
				console.log('Antes loop........', msg);
				
				var qtd = 0;
				$("input[name^=datadespesanf___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					qtd += 1;
					console.log('Qtd........', qtd, seq, $("#tipodespesa___" + seq ).val(), $("#valordespesaitem___" + seq).val(), $("#seqImagem___" + seq).val() );
				    if( $("#tipodespesa___" + seq ).val() == undefined || $("#tipodespesa___" + seq ).val() == ""){
			        	msg += '"Tipo de despesa: ' + qtd + '"';
			        	
			        }else if( $("#grupo_despesa___" + seq ).val() == "C" 
		        		   && $("#unidade___" + seq ).val() == ""){
			        	
		        		msg += '"Unidade: ' + qtd + '"';
		        		
		        	}
			        	
			        if( $("#valordespesaitem___" + seq).val() == undefined || $("#valordespesaitem___" + seq).val() == "" ){
			        	msg += '"valor: ' + qtd + '"' ;
			        }
			        
			        //if( $("#seqImagem___" + seq).val() == undefined || $("#seqImagem___" + seq).val() == "" ){
			        //	msg += '"Foto: ' + qtd + '"' ;
			        //}
				});

				var qtdKM = 0;
				$("input[name^=datadespesa_km___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					qtdKM += 1;
					console.log('Qtd KM........', qtdKM);
				    if( $("#km_inicial___" + seq ).val() == undefined || $("#km_inicial___" + seq ).val() == ""){
			        	msg += '"KM Inicial: ' + qtdKM + '"' ;
			        }
			        if( $("#km_final___" + seq).val() == undefined || $("#km_final___" + seq).val() == "" ){
			        	msg += '"KM Final: ' + qtdKM + '"' ;
			        }
				    //if( $("#seqImagemKM_ini___" + seq ).val() == undefined || $("#seqImagemKM_ini___" + seq ).val() == ""){
			        //	msg += '"Foto KM Inicial: ' + qtdKM + '"' ;
			        //}
			        //if( $("#seqImagemKM_ini___" + seq).val() == undefined || $("#seqImagemKM_fim___" + seq).val() == "" ){
			        //	msg += '"Foto KM Final: ' + qtdKM + '"' ;
			        //}
			        
				});
				
				if( qtdKM + qtd == 0 ){
					msg += '"Despesas ou KM "';
				}
				
				console.log('msg........', msg);
				
				if( msg != "" ){
					FLUIGC.toast({
				        title: 'Necess&aacute;rio preencher os campos abaixo.',
				        message: msg,
				        type: 'danger'
				    });
					return false;
				}
				
			}
				
			return true;
			
		}


		var fileName = "";
		
		function showCamera(parameter) {
			JSInterface.showCamera(parameter);
			trataCampo();
		}
		
		function getNomeFile(parameter) {			
			
			fileName = "";
			
			var linha = parameter.split('___')[1];
			var campo = parameter.split('___')[0];
			var iesKM = 'N';
			var iesIni = 'N';
			
			if( campo.indexOf('KM') >= 0 || campo.indexOf('km') >= 0 ){
				iesKM = 'S';
			}
			if( campo.indexOf('INI') >= 0 || campo.indexOf('ini') >= 0 ){
				iesIni = 'S';
			}
			console.log('Antes if......',iesKM,iesIni);
			
			if( iesKM == 'N' ){
				var seqImagem = isNaN(parseInt( $('#seqImagem___'+linha).val() ) ) ? 0 : parseInt( $('#seqImagem___'+linha).val() );
				seqImagem += 1;
				$('#seqImagem___'+linha).val( seqImagem );
				fileName = pad( $('#seqLinha___'+linha).val(), 3)+'_'+pad( seqImagem, 3);
				console.log('fileName.....',fileName);
				//JSInterface.showCamera( fileName );
			}else if( iesKM == 'S' ){
				var seqImagem = isNaN(parseInt( $('#seqImagemKM___'+linha).val() ) ) ? 0 : parseInt( $('#seqImagemKM___'+linha).val() );
				seqImagem += 1;
				$('#seqImagemKM___'+linha).val( seqImagem );
				fileName = '';
				if( iesIni == 'S' ){
					fileName = 'KMINI_'+pad( $('#seqLinhaKM___'+linha).val(), 3)+'_'+pad( seqImagem, 3);
					$('#seqImagemKM_ini___'+linha).val( seqImagem );
				}else{
					fileName = 'KMFIM_'+pad( $('#seqLinhaKM___'+linha).val(), 3)+'_'+pad( seqImagem, 3);
					$('#seqImagemKM_fim___'+linha).val( seqImagem );
				}
				console.log('fileName.....',fileName);
				//JSInterface.showCamera( fileName );
			}
			
			trataCampo();
		}
		
		function openFile(parameter) {
			
			var linha = parameter.split('___')[1];
			var campo = parameter.split('___')[0];
			var iesKM = 'N';
			var iesIni = 'N';
			
			if( campo.indexOf('KM') >= 0 || campo.indexOf('km') >= 0 ){
				iesKM = 'S';
			}
			if( campo.indexOf('INI') >= 0 || campo.indexOf('ini') >= 0 ){
				iesIni = 'S';
			}
			console.log('Antes if......',iesKM,iesIni);
			
			if( iesKM == 'N' && $('#docum___'+linha).val() != '' && $('#versao___'+linha).val() != '' ){
				var titulo = 'R$ '+$('#valordespesaitem___'+linha).val()+' '+$('#datadespesanf___'+linha).val()+' '+tipo_despesas[ $('#tipodespesa___'+linha).val() ]['tipo_despesa'];
				openImagen( $('#docum___'+linha).val(), $('#versao___'+linha).val(), titulo );
				//openDocument( $('#docum___'+linha).val(), $('#versao___'+linha).val() );
			}else if( iesKM == 'S' ){
				if( iesIni == 'S' && $('#documKM_ini___'+linha).val() != '' && $('#versaoKM_ini___'+linha).val() != ''  ){
					var titulo = 'KM '+$('#km_inicial___'+linha).val()+' '+$('#datadespesa_km___'+linha).val()+' KM Inicial';
					openImagen( $('#documKM_ini___'+linha).val(), $('#versaoKM_ini___'+linha).val(), titulo );
					//openDocument( $('#documKM_ini___'+linha).val(), $('#versaoKM_ini___'+linha).val() );
				}
				if( iesIni == 'N' && $('#documKM_fim___'+linha).val() != '' && $('#versaoKM_fim___'+linha).val() != ''  ){
					var titulo = 'KM '+$('#km_final___'+linha).val()+' '+$('#datadespesa_km___'+linha).val()+' KM Final';
					openImagen( $('#documKM_fim___'+linha).val(), $('#versaoKM_fim___'+linha).val(), titulo );
					//openDocument( $('#documKM_fim___'+linha).val(), $('#versaoKM_fim___'+linha).val() );
				}
			}
			
			trataCampo();
		}		
		
		function pad(number, length) {		   
		    var str = '' + number;
		    while (str.length < length) {
		        str = '0' + str;
		    }
		    return str;
		}

		
		function autoSize(){
			$('textarea').each(function (index, value){
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
			});
		}

		function isNull( valor, padrao ){
			if ( isNaN( valor ) ){
				return padrao;
			}else{
				return valor;
			}
		}		

	   function fnCustomDelete(oElement){

		   var task = $('#task').val();
		   console.log('task.....',task,$('#cod_processo').val());
		   if ( $('#cod_processo').val() == 'adiantamento' ){
	    		if ( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 && task != 33 && task != 60 ){
					FLUIGC.toast({
				        title: 'Alerta',
				        message: 'Não é pertitido excluir despesas.',
				        type: 'warning'
				    });
					return false;
	    		}
		   }else{
			   if ( task != 0 && task != 4 && task != 81 && task != 33 ){
					FLUIGC.toast({
				        title: 'Alerta',
				        message: 'Não é pertitido excluir despesas.',
				        type: 'warning'
				    });
					return false;
			   }
		   }
		   
		   fnWdkRemoveChild(oElement);

		}

	    function addTask() {
	    	
	    	var task = $('#task').val();
	    	if ( $('#cod_processo').val() == 'adiantamento' ){
	    		if ( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 && task != 33 && task != 60  ){
					FLUIGC.toast({
						title: 'Alerta',
					    message: 'Não é permitido adicionar despesas.',
					    type: 'warning'
					});
					return false;
	    		}	    		
	    	}else{
	    		if ( task != 0 && task != 4 && task != 81 && task != 33 ){
					FLUIGC.toast({
						title: 'Alerta',
					    message: 'Não é permitido adicionar despesas.',
					    type: 'warning'
					});
					return false;
	    		}
	    	}
	    	
			row = wdkAddChild('tbItens');
			
			$('.decimal_2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			$('#valordespesaitem___'+row).val('0,00');
			$('#datadespesanf___'+row).val( $('#datadespesa').val() );
			
			loadPaiFilhoCombo( 'tipodespesa___'+row, 'usuario_comercial', 'tipo_despesa', 'cod_tipo_despesa', 'tipo_despesa', 'matricula', $('#codsolicitante').val() );
				
			FLUIGC.calendar('.dataFluig' );
			//autoSize();
			
			console.log('ultSeqLinha', $('#ultSeqLinha').val() );
			var ultSeqLinha = isNaN(parseInt( $('#ultSeqLinha').val() ) ) ? 0 : parseInt( $('#ultSeqLinha').val() );
			ultSeqLinha += 1;
			$('#ultSeqLinha').val(ultSeqLinha);
			$('#seqLinha___'+row).val( pad( ultSeqLinha, 3 ) );
			
			trataCampo();
			//loadSelectTipoDesp();
			
		}

	    
	    function addKM() {

	    	var task = $('#task').val();
	    	if ( $('#cod_processo').val() == 'adiantamento' ){
	    		if ( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 && task != 33 && task != 60 ){
					FLUIGC.toast({
						title: 'Alerta',
					    message: 'Não é pertitido adicionar KM.',
					    type: 'warning'
					});
					return false;
				}	    		
	    	}else{
				if ( task != 0 && task != 4 && task != 81 && task != 33 ){
					FLUIGC.toast({
						title: 'Alerta',
					    message: 'Não é pertitido adicionar KM.',
					    type: 'warning'
					});
					return false;
				}
	    	}
	    	
	    	if( isNull( validafunctions.getFloatValue("valKM"), 0) == 0 ){
	    		alert('Vc&ecirc; n&atilde;o tem valor de KM configurado, entre em contato com seu gestor.');
	    		return false;
	    	}
	    	
			row = wdkAddChild('tbKM');
			//$('.decimal_2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			$('#km_inicial___'+row).maskMoney({precision : 0,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			$('#km_final___'+row).maskMoney({precision : 0,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			
			$('#datadespesa_km___'+row).val( $('#datadespesa').val() );
							
			FLUIGC.calendar('.dataFluig' );
			//autoSize();
			
			var ultSeqLinha = isNaN(parseInt( $('#ultSeqLinhaKM').val() ) ) ? 0 : parseInt( $('#ultSeqLinhaKM').val() );
			ultSeqLinha += 1;
			$('#ultSeqLinhaKM').val(ultSeqLinha);
			$('#seqLinhaKM___'+row).val( pad( ultSeqLinha, 3 ) );
			
			trataCampo();
			
		}


	    function trataCampo(){
	    	var task = $('#task').val();
	    	if ( $('#cod_processo').val() == 'adiantamento' ){
	    		if( task == 33 ){
	    			$('.showCamera').show();
		    		$('.openFile').show();
	    		}else if ( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 && task != 33 && task != 60 ){
	    			$('.showCamera').hide();
		    		$('.openFile').show();
		    	}else{
		    		$('.showCamera').show();
		    		$('.openFile').hide();	    		
		    	}
	    	}else{
	    		if( task == 33 ){
	    			$('.showCamera').show();
		    		$('.openFile').show();
	    		}else if( task != '0' && task != '4' && task != '81' && task != '33' ){
		    		$('.showCamera').hide();
		    		$('.openFile').show();
		    	}else{
		    		$('.showCamera').show();
		    		$('.openFile').hide();	    		
		    	}
	    	}
		    	
	    	
			$(".dataFluig").each(function(index, value){
				if( $(this).val().indexOf('-') ){
					$(this).val(  $(this).val().split('-').reverse().join('/') );
				}
				if( $(this).val() != $('#datadespesa').val()
					&& $('#datadespesa').val() != "" ){
					$(this).css("background", "#FFECE6");					
				}else{
					$(this).css("background", "");
				}
			});
			
			var tem_tem = false;
			$("input[name*=_bt_foto___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagem___'+seq).val() != undefined 
					&& $('#_seqImagem___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});
			
			if( !tem_tem ){
				$("input[name*=bt_foto___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagem___'+seq).val() != undefined 
						&& $('#seqImagem___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}

			var tem_tem = false;
			$("input[name*=_bt_fotoKM_ini___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagemKM_ini___'+seq).val() != undefined 
					&& $('#_seqImagemKM_ini___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});
			
			if( !tem_tem ){
				$("input[name*=bt_fotoKM_ini___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagemKM_ini___'+seq).val() != undefined 
						&& $('#seqImagemKM_ini___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}
			
			var tem_tem = false;
			$("input[name*=_bt_fotoKM_fim___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagemKM_fim___'+seq).val() != undefined 
					&& $('#_seqImagemKM_fim___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});

			if( !tem_tem ){
				$("input[name*=bt_fotoKM_fim___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagemKM_fim___'+seq).val() != undefined 
						&& $('#seqImagemKM_fim___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}
			
			var tem_tem = false;
			$("input[name*=_bt_open___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagem___'+seq).val() != undefined 
					&& $('#_seqImagem___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});

			if( !tem_tem ){
				$("input[name*=bt_open___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagem___'+seq).val() != undefined 
						&& $('#seqImagem___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}
			
			var tem_tem = false;
			$("input[name*=_bt_openKM_ini___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagemKM_ini___'+seq).val() != undefined 
					&& $('#_seqImagemKM_ini___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});

			if( !tem_tem ){
				$("input[name*=bt_openKM_ini___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagemKM_ini___'+seq).val() != undefined 
						&& $('#seqImagemKM_ini___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}
			
			var tem_tem = false;
			$("input[name*=_bt_openKM_fim___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				if( $('#_seqImagemKM_fim___'+seq).val() != undefined 
					&& $('#_seqImagemKM_fim___'+seq).val() != "" ){
					$(this).parent().css("background","lightgreen");
				}else{
					$(this).parent().css("background","");
				}
				tem_tem = true;
			});
			
			if( !tem_tem ){
				$("input[name*=bt_openKM_fim___]").each(function(index, value){
					var seq = $(this).attr("name").split('___')[1];
					if( $('#seqImagemKM_fim___'+seq).val() != undefined 
						&& $('#seqImagemKM_fim___'+seq).val() != "" ){
						$(this).parent().css("background","lightgreen");
					}else{
						$(this).parent().css("background","");
					}
				});
			}
	    }
	    
	    function itemremove(oElement){
	    	
	    	var task = $('#task').val();
	    	if ( $('#cod_processo').val() == 'adiantamento' ){
	    		if ( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 && task != 33 && task != 60 ){
					FLUIGC.toast({
				        title: 'Alerta',
				        message: 'Não é pertitido excluir despesas.',
				        type: 'warning'
				    });
					return false;
	    		}
	    	}else{
				if ( task != 0 && task != 4 && task != 81 && task != 33 ){
					FLUIGC.toast({
				        title: 'Alerta',
				        message: 'Não é pertitido excluir despesas.',
				        type: 'warning'
				    });
					return false;
				}
	    	}
	    	
	    	if( confirm("Deseja remover o item?") ){
	    		fnWdkRemoveChild(oElement);
	    		calculatotal();
	    	}
		}

	    
	    	    
		function calculatotal() {
			
			var kmIni = 0;
			var kmFim = 0;
			var item = 0;
			var total = 0;
			var desp = 0;
			var km = 0;
			
			var valorKM = isNull( validafunctions.getFloatValue("valKM"), 0);
			
			$("input[name^=valordespesaitem___]").each(function(index, value){

				var index = validafunctions.getPosicaoFilho($(this).attr("id"));
				var item =  isNull( validafunctions.getFloatValue("valordespesaitem___" + index), 0);
				if(  $(this).attr("id")[0] != '_' ){
					total += item;
					desp += item;
				}
				console.log( 'valor desp......', total, item, $(this).attr("id") );
				setDescItem( $(this).attr("id") );
			});
		
			$("input[name^=km_inicial___]").each(function(index, value){

				var index = validafunctions.getPosicaoFilho($(this).attr("id"));
				kmIni =  isNull( validafunctions.getFloatValue("km_inicial___" + index), 0);
				kmFim =  isNull( validafunctions.getFloatValue("km_final___" + index), 0);
				
				if( kmFim > kmIni ){
					$('#km_dia___'+index).val( kmFim - kmIni );				
					$('#km_valor_dia___'+index).val( String(( ( kmFim - kmIni ) * valorKM ).toFixed(2)).replace('.', ',') );
					console.log( 'valor km......', total, ( kmFim - kmIni ) * valorKM );
					if(  $(this).attr("id")[0] != '_' ){
						total += ( kmFim - kmIni ) * valorKM;
						km += ( kmFim - kmIni ) * valorKM;
					}
				}
				setDescKM( $(this).attr("id") );
			});
			
	    	var task = $('#task').val();
			if( $('#cod_processo').val() == 'adiantamento' ){
				console.log( 'Valores......', total, valorAcum );	
				var adiant = isNull( validafunctions.getFloatValue("valoradiant"), 0);
				$('#valorsaldo').val( String(( adiant - total ).toFixed(2)).replace('.', ',') );
				if( task != 0 && task != 4 && task != 81 && task != 43 && task != 47 ){
					$('#valoradiant').attr('readonly',true);
					console.log('Entrou read only');
				}else{
					$('#valoradiant').attr('readonly',false);
					console.log('Entrou else read only');
				}
				var saldoAcum = isNull( validafunctions.getFloatValue("saldoAcum"), 0);
				//var saldoAberto = isNull( validafunctions.getFloatValue("saldoAberto"), 0);
				console.log('adiant + saldoAcum + saldoAberto', adiant, saldoAcum );
				$('#novosaldo').val( String(( adiant + saldoAcum ).toFixed(2)).replace('.', ',') );
				//$('#saldoTotal').val( String(( adiant + saldoAcum + saldoAberto ).toFixed(2)).replace('.', ',') );
				$('#totaldespesa').val( String(( total ).toFixed(2)).replace('.', ',') );
				$('#saldoTotal').val( String(( adiant + saldoAcum - total ).toFixed(2)).replace('.', ',') );
			}else{
				console.log( 'Valores......', total, valorAcum );
				$('#valordespesa').val( String((total).toFixed(2)).replace('.', ',') );	
				$('#valormes').val( String((total + valorAcum).toFixed(2)).replace('.', ',') );				
			}
			
			if( $('#cod_processo').val() == 'adiantamento' ){
				$('#descricao_desp').val( "Adiant: "+$('#valoradiant').val() );
			}else{
				$('#descricao_desp').val( "Total: "+$('#valordespesa').val()+" Desp:"+String((desp).toFixed(2)).replace('.', ',')+" KM:"+String((km).toFixed(2)).replace('.', ',') );
			}
		}
	    
		function selectTipoDesp( id ){
			var seq = id.split('___')[1];
			console.log('Valor tipo despesa......', id, $('#'+id).val(), isNull( tipo_despesas[ $('#'+id).val() ][ 'valor_padrao' ], 0 ) );
			$('#codTipoDespesa___'+seq).val( $('#'+id).val() )
			$('#valor_maximo___'+seq).val( tipo_despesas[ $('#'+id).val() ][ 'valor_maximo' ] );
			$('#grupo_despesa___'+seq).val( tipo_despesas[ $('#'+id).val() ][ 'grupo_despesa' ] );
			
			$('#valor_padrao___'+seq).val( tipo_despesas[ $('#'+id).val() ][ 'valor_padrao' ] );
			if( isNull( tipo_despesas[ $('#'+id).val() ][ 'valor_padrao' ], 0 ) == 0 ){
				$('#valordespesaitem___'+seq).attr('readonly',false);
				$('#valordespesaitem___'+seq).maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			}else{
				$('#valordespesaitem___'+seq).val( String(( tipo_despesas[ $('#'+id).val() ][ 'valor_padrao' ] ).toFixed(2)).replace('.', ',') );
				$('#valordespesaitem___'+seq).attr('readonly',true);
				$('#valordespesaitem___'+seq).maskMoney('destroy');
			}
			
			setDescItem( id );
			calculatotal();
			trataCampoUnidade();
		} 
		
		function trataCampoUnidade(){
			var qtd = 0;
			$("select[name^=tipodespesa___]").each(function(index, value){
				var seq = $(this).attr("name").split('___')[1];
				console.log( '$("#grupo_despesa___" + seq ).val() ', seq, $("#grupo_despesa___" + seq ).val() );
				if( $("#grupo_despesa___" + seq ).val() != 'C' ){
					$("#unidade___" + seq ).val('')
					$("#unidade___" + seq ).hide();
				}else{
					$("#unidade___" + seq ).show();
					qtd += 1;
				}
			});
			if( qtd == 0 ){
				$('.unidade').hide();
			}else{
				$('.unidade').show();
			}
		}
		
		function setDescItem( id ){
			
			var seq = id.split('___')[1];
		
			if( $('#tipodespesa___'+seq).val() != ''
			 && $('#tipodespesa___'+seq).val() != undefined ){
				$('#resumo___'+seq).val(   
						$('#datadespesanf___'+seq).val().split('-').reverse().join('/').substring(0,5)+ " " +
						$('#valordespesaitem___'+seq).val()+ " " +
						tipo_despesas[ $('#tipodespesa___'+seq).val() ][ 'tipo_despesa' ].trim()
				);
			}
		}

		function setDescKM( id ){
			var seq = id.split('___')[1];
			$('#resumo_km___'+seq).val(   
					$('#datadespesa_km___'+seq).val().split('-').reverse().join('/').substring(0,5)+ " " +
					$('#km_dia___'+seq).val()+ " " +
					$('#km_valor_dia___'+seq).val()
			);
		}

		
		function formatBR(value, decimais) {

		    decimais = decimais || 2;
		    var mi = value.length - parseInt(decimais);
		    var sm = parseInt(mi / 3);
		    var regx = "", repl = "";

		    for (var i = 0; i < sm; i++) {
		        regx = regx.concat('([0-9]{3})');
		        repl = repl.concat('.$' + (i + 1));
		    }

		    regx = regx.concat('([0-9]{' + decimais + '})') + "$";
		    repl = repl.concat(',$' + (sm + 1));
		    value = value.toString().replace(new RegExp(regx, 'g'), repl);
		    return (mi % 3) === 0 ? value.substr(1) : value;
		}
	    
		function loadPaiFilhoCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
			
			console.log( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue  );

			var constraintsPai = new Array();
			var lstFilter = fildFilter.split(',');
			var lstFilterValue = fildFilterValue.split(',');
			for ( var j = 0; j < lstFilter.length; j ++ ){
				console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
				if ( lstFilter[j] != '' && lstFilter[j] != null ){
					constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
				}
			}
			var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
			
			if( datasetPai != undefined && datasetPai != null ){
				var pais = datasetPai.values;
				for ( var y in pais ) {
					var pai = pais[y];
					
					var constraintsFilhos = new Array();
					constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
					constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
					constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
					constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
					
					var orderFilhos = new Array();
					orderFilhos.push( fieldCodigo );						
					var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
					console.log('DataSet',datasetFilhos);
					if ( datasetFilhos != null ){
						var valDefault = $("#"+combo).val();
						if( combo.split('___')[0] == 'tipodespesa' ){
							valDefault = $( '#codTipoDespesa___'+combo.split('___')[1] ).val();
						}						
						$("#"+combo+" option").remove();
						var filhos = datasetFilhos.values;
						console.log('DataSet',datasetFilhos);
						console.log('DataSet',filhos);
						//$("#empresa").append("<option value='' ></option>");
						for ( var i in filhos ) {
							console.log('Linha DataSet.....',i);
							var filho = filhos[i];
							var den = '';					
							if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
								continue;
							} 
							if ( fieldDesc == '' ){
								den = filho[ fieldCodigo ];
							}else{
								if ( tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'] != undefined 
									&& tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'] != null ){
									den = tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'];
								}else{
									den = filho[ fieldDesc ];
								}
							}
							$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						}
						$("#"+combo).val( valDefault );
					}
				}
			}
		}

		function getOptCombo( combo ){
			
			var optArray = new Array();
			$("#"+combo+" option").each(function (index, value) {
				optArray.push( $(this).val() );
			});
			return optArray;
		}
		

		function openDocument(docId, docVersion) {
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
		            parentOBJ.ECM.documentView.getDocument(docId, docVersion);
		        },
		        customButtons : []
		    };
		        parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
		}
		
		function loadDespesaMes(){
					
			if( $('#cod_processo').val() == 'adiantamento' ){
				if( $('#task').val() == '0' 
				 || $('#task').val() == '4'
			     || $('#task').val() == '81'
				 || $('#task').val() == '43'
				 || $('#task').val() == '45' ){
					
					$('#saldoAcum').val( "0,00" );
					$('#saldoAberto').val( "0,00" );
					$('#saldoTotal').val( "0,00" );
					
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint("matricula", $('#codsolicitante').val(), $('#codsolicitante').val(), ConstraintType.MUST) );
					var userComerc = DatasetFactory.getDataset("usuario_comercial", null, constraints, null );
					console.log('userComerc...',userComerc);
					if ( userComerc != null && userComerc.values.length > 0 ){
						//userComerc.values[0]['saldo_adt'];
						var valInicial = 0;
						if( userComerc.values[0]['saldo_adt'] != undefined ){
							valInicial = isNull( parseFloat( userComerc.values[0]['saldo_adt'].replace('.','').replace(',','.') ), 0);
						}
						var primeiroDia = '01/01/2019';
						if( userComerc.values[0]['data_saldo_adt'] != undefined ){
							primeiroDia = userComerc.values[0]['data_saldo_adt'].split('-').reverse().join('/');
						}
						var date = new Date( $('#datadespesa').val().split('/').reverse().join('-') );
						var ultimoDia = dateToDMY( new Date(date.getFullYear(), date.getMonth() + 1, 0) );
						console.log(primeiroDia, ultimoDia);
						
						var constraints = new Array();
						constraints.push( DatasetFactory.createConstraint("codSolicitante", $('#codsolicitante').val(), null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint("dataDe", primeiroDia, null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint("dataAte", ultimoDia, null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint("processo", $('#processo').val(), null, ConstraintType.MUST) );
						var datasetFilhos = DatasetFactory.getDataset("ds_saldo_adiantamento", null, constraints, null );
						
						console.log('datasetFilhos', datasetFilhos );
						var saldoAcum = 0;
						var saldoAberto = 0;
						var saldoAprova = 0;					
						var qtdAberto = 0;
						var qtdAprova = 0;
						var qtdSemAprov = 0;
	
						if ( datasetFilhos != null ){
							var valores = datasetFilhos.values;
							for ( var i in valores ) {
								console.log('Linha DataSet.....',i);
								saldoAcum = isNull( parseFloat( valores[i]['saldo_acum'] ), 0);
								saldoAberto = isNull( parseFloat( valores[i]['saldo_aberto'] ), 0);
								saldoAprova = isNull( parseFloat( valores[i]['saldo_aprova'] ), 0);
								qtdAberto = isNull( parseFloat( valores[i]['qtd_aberto'] ), 0);
								qtdAprova = isNull( parseFloat( valores[i]['qtd_aprova'] ), 0);
								qtdSemAprov = isNull( parseFloat( valores[i]['qtd_sem_aprov'] ), 0);	
							}
						}
						console.log("qtdAberto + qtdAprova + qtdSemAprov",qtdAberto,qtdAprova,qtdSemAprov);
						if( qtdSemAprov > 0 /*( qtdAberto + qtdAprova >= 2
							  || qtdAprova >= 1 )*/ ){  
							$('#divPrincipal').hide();
							$('#divBloqueio').show();
						}
						
						$('#saldoAcum').val(  String((saldoAcum+valInicial).toFixed(2)).replace('.', ',') );
						//$('#saldoAberto').val(  String((saldoAberto).toFixed(2)).replace('.', ',') );
						calculatotal();		
					}
				}
				return;
			}
			
			var date = new Date( $('#datadespesa').val().split('/').reverse().join('-') );
			//var date = new Date();
			var primeiroDia = dateToDMY( new Date(date.getFullYear(), date.getMonth(), 1) );
			var ultimoDia = dateToDMY( new Date(date.getFullYear(), date.getMonth() + 1, 0) );
			console.log(primeiroDia, ultimoDia);
			console.log('Solic.....',$('#codsolicitante').val() );
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint("codSolicitante", $('#codsolicitante').val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("dataDe", primeiroDia, null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("dataAte", ultimoDia, null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("processo", $('#processo').val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("tipo", 'C', null, ConstraintType.MUST) );
						
			var datasetFilhos = DatasetFactory.getDataset("ds_despesas_periodo", null, constraints, null );
			
			valorAcum = 0;
			
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				var valores = datasetFilhos.values;
				//$("#empresa").append("<option value='' ></option>");
				
				for ( var i in valores ) {
					console.log('Linha DataSet.....',i);
					valorAcum += isNull( parseFloat( valores[i]['valor_total'] ), 0);
					console.log('valorAcum........',valorAcum);
					
					$('#valormes').val(  String((valorAcum).toFixed(2)).replace('.', ',') );
					
				}
			}
		}
		
		
		function dateToDMY(date) {
			//date = new Date(dateSTR);
		    var d = date.getDate();
		    var m = date.getMonth() + 1;
		    var y = date.getFullYear();
		    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
		}
