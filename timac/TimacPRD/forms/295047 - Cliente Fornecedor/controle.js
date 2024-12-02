var loadWindow = FLUIGC.loading(window);
var tblHist = null;
var loadFinanc = false;
var bloqueio = false;
// var modalTable = null;

var tipoDeParaOper = {};

/*
var tipoDeParaOper = { "6": "C",
					   "7": "F",
					   "10": "T",
					   "8": "A",
					   "9": "M" };
*/
/*
var tipoDeParaOper = { "1": "C",
					   "2": "F",
					   "3": "T",
					   "4": "A",
					   "5": "M" };
*/

function atualizaAnexos(){
	$(".anexos").val("");
	$.each(parent.ECM.attachmentTable.getData(), function(i,attachment) {
        console.log( attachment.description );
        try{
        	$("#"+attachment.description).val( attachment.description );
        }catch(e){
        	
        }
  	});
}

var beforeSendValidate = function(numState, nextState){
	
	var task = $('#task').val();

	atualizaAnexos();

	required();
	
	var iesRet = true;
	
	// if( $('#num_cgc_cpf').val().length != 19 ){
	// 	FLUIGC.toast({ title: '',message: 'Você deve informar um CPF ou CNPJ válido. ( CNPJ(099.999.999/9999-99) ou CPF(999.999.999/0000-99) ' , type: 'warning' });
	// 	iesRet = false;
	// }
	// if( $('#cod_cliente').val() == "" ){
	// 	var constraints = new Array();
	// 	constraints.push(DatasetFactory.createConstraint("cod_cliente", $('#num_cgc_cpf').val() , $('#num_cgc_cpf').val(), ConstraintType.MUST));
	// 	constraints.push(DatasetFactory.createConstraint("table", 'clientes' , null, ConstraintType.MUST));
	// 	var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null );
	// 	if( ds.values.length > 0 ){
	// 		toast('CNPJ/CPJ Já cadastrado!','warning');
	// 		iesRet = false;
	// 	}    
	// }
	
	
	if( ['163','167','171','175','179','183','187'].indexOf( nextState+'' ) > -1 ){
    	$('#obs_hist').addClass('required');
        $('#obs_hist').addClass('valida');
        
        if( $('#obs_hist').val() == "" ){
        	alert( 'Para reprovar você deve informar uma observação.' );
        	return false;
        }else{
        	return true;
        }
        
        
	}else{
        $('#obs_hist').removeClass('required');
        $('#obs_hist').removeClass('valida');
	}
	
    
    
	if( $('#ies_operacao').val() == "I" ){
		$('#obs_hist').attr("readonly",false);
		if( ['0','1'].indexOf( $("#task").val() ) >= 0 ){
			$('#obs_hist').addClass('required');
			$('#obs_hist').addClass('valida');
			
			$('#num_cgc_cpf').addClass('required');
			$('#num_cgc_cpf').addClass('valida');
		}
        //$('#simples_nacional').removeClass('ctrFiscal');
	}else{
        //$('#simples_nacional').addClass('ctrFiscal');
	}
	/*
    if( $('#num_banco').val() != "" 
     && ['T','F'].indexOf( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] ) != -1 ){
    	$('.grp_banco').addClass('required');
        $('.grp_banco').addClass('valida');
    }else{
    	$('.grp_banco').removeClass('required');
    	$('.grp_banco').removeClass('valida');
    }*/
    
	
	if (task == 0 || task == 2 ){
        $('#integra_k2').addClass('required');
        $('#integra_k2').addClass('valida');
		
		
		// $("input[name^=email_nfe___]").each(function (index, value) {
		// 	var seq = $(this).attr('id').split('___')[1];
		// 	if( $('#ies_excluido___'+seq).val() != "S" ){
		// 		if( !valida( '#'+$(this).attr('id') ) ){
		// 			iesRet = false;
		// 		}
		// 	}
		// });	
	}

	if( $('#ies_operacao').val() != "I"  ){
	    if ( !valida('.valida') ){
	        iesRet = false;
	    }
	    if( ( $("#ies_nacional_internacional").val() == "N" || $('#ies_operacao').val() == "A" )
	    	&& !valida('#num_cgc_cpf') ){
	    	iesRet = false;
	    }
	}else{
		if ( ['0','1'].indexOf( $("#task").val() ) >= 0 
		&& ( !valida('#obs_hist') || !valida('#num_cgc_cpf') ) ){
	        iesRet = false;
	    }
	}
	
	if( !iesRet ){
		toast('Existem campos obrigatórios não preenchidos','warning');
	}
	
	if( $('#ies_cpf_cnpj').val() == 'CPF'  ){
		if( !validaCPF( $('#num_cgc_cpf').val().trim().replace('/0000-','-') ) ){
			FLUIGC.toast({ title: '',message: 'CPF inválido.' , type: 'warning' });
			iesRet = false;
		}
	}else{
		if( $('#ies_nacional_internacional').val() != 'I' ){
			if( !validaCNPJ( $('#num_cgc_cpf').val().trim().replace('/0000-','-') ) ){
				FLUIGC.toast({ title: '',message: 'CNPJ inválido.' , type: 'warning' });
				iesRet = false;
			}
	        /*if( !validaIE( $('#ins_estadual').val().trim(), $('#uf').val() ) ){
	            FLUIGC.toast({ title: '',message: 'Inscrição Estadual inválida.' , type: 'warning' });
	            iesRet = false;
	        }*/
		}
	}
	
	if( $("#ies_nacional_internacional").val() != "I"
		&& $("#cep").val().replace(".","").replace("-","").length < 8 ){
		FLUIGC.toast({ title: '',message: 'CEP inválido.' , type: 'warning' });
		iesRet = false;
	}
	
	/*if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' 
	 && $("#ins_estadual").val() != "" 
     && $('#ies_cpf_cnpj').val() == 'CPF' 
     && $("#ies_nacional_internacional").val() == "N"
     && $('#ies_operacao').val() != "I" ){
	
		$("input[name^=ie_entrega___]").each(function (index, value) {
		 	var seq = $(this).attr('id').split('___')[1];
		 	
		 	if( $(this).attr('readonly') ){
				$(this).css({'background-color' : '#EEEEEE'});
			}else{
				$(this).css({'background-color' : '#FFFFFF'});
			}
		 	
		 	if( $('#ie_entrega___'+seq).val() == "" 
		  	 && ( $('#desc_logradouro_entrega___'+seq).val() != $('#desc_logradouro').val()
		  	   || $('#cep_entrega___'+seq).val() != $('#cep').val()
		  	   || $('#endereco_entrega___'+seq).val() != $('#endereco').val()
		  	   || $('#numero_entrega___'+seq).val() != $('#numero').val()
		  	   || $('#bairro_entrega___'+seq).val() != $('#bairro').val()
		  	   || $('#cod_cidade_entrega___'+seq).val() != $('#cod_cidade').val() ) ){
		 		
		 		$(this).css({'background-color' : '#FFE4C4'});
		 		FLUIGC.toast({ title: '',message: 'Inscrição estadual de entrega obrigatória.' , type: 'warning' });
		 		iesRet = false;
		        
		 	}
		});
	}*/
	
	// var qtd = 0;

	
	// if( qtd == 0 ){
	// 	FLUIGC.toast({ title: '',message: 'Você deve informar ao menos um e-mail para NFE!' , type: 'warning' });
	// 	iesRet = false;
	// };
	
	// $("input[name^=nom_contato___]").each(function (index, value) {
	// 	qtd += 1;
    //     var seq = $(this).attr('id').split('___')[1];
    //     if( $('#ies_contato_excluido___'+seq).val() != "S" ){
    //         if ( this.value.trim() == "" ){
    //             FLUIGC.toast({ title: '',message: 'Você deve informar um nome para o contato.' , type: 'warning' });
    //             iesRet = false;
    //         }
            
    //         if( this.value.trim() != ""
    //         && $('#telefone_contato___'+seq).val() == "" 
    //         && $('#email_contato___'+seq).val() == "" ){
    //             FLUIGC.toast({ title: '',message: 'Você deve informar e-mail ou telefone para o contato.' , type: 'warning' });
    //             iesRet = false;
    //         }
    //     }
	// });

	$(".mail").each(function (index, value) {
		if( this.value.trim() != "" ){
			if ( !validaEmail( this.value.trim() ) ){
				FLUIGC.toast({ title: '',message: 'E-Mail do contato inválido ('+this.value+')' , type: 'warning' });
                iesRet = false;
			}
		}
	});

    // if ( nextState == 9 ){
    // 	marcaCampos();
    // }
	
	atualizaFlags();
	
	return iesRet;
	
}

function loadBody(){

	var dsTipo = DatasetFactory.getDataset("tipo_de_operacao", null, null, null);
	
	for( var i = 0; i < dsTipo.values.length; i++ ){
		tipoDeParaOper[ dsTipo.values[i]["cod_operacao"] ] = dsTipo.values[i]["tipo_de_para"] ; 	
	}
	
    /*var ds = DatasetFactory.getDataset("zona_area_solicitante_rm", null, null, null);
    console.log(ds);*/

	console.log('loadBody');
    var task = $('#task').val();

    loadDsCombo('ies_tipo_operacao', 'dsk_tipo_operacao_user', 'cod_operacao', 'den_operacao', 'matricula', $('#user_abertura').val(), 'cod_operacao', 'N', 'S', 'S');

    // loadDsCombo('ies_zona', 'ds_zonas_rm', 'desc_zona', 'desc_zona', '', '', 'desc_zona', 'N', 'S', 'S');
    if ( $('#ies_tipo_operacao').val() ){
    	loadDsCombo('ies_zona', 'selectPaiFilho', 'cod_zona', 'den_zona', 'dataset,table,cod_operacao', 'tipo_de_operacao,tbl_papeis,'+$('#ies_tipo_operacao').val(), 'den_zona', 'N', 'S', 'S');
    }
    
    if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
    	loadDsCombo('sup_subtipo_fornec', 'selectLogix', 'subtipo_fornecedor', 'des_subtipo_fornec', 'table,___not___subtipo_fornecedor', 'sup_subtipo_fornec,99', 'subtipo_fornecedor', 'N', 'S', 'S');	
    }else{
    	loadDsCombo('sup_subtipo_fornec', 'selectLogix', 'subtipo_fornecedor', 'des_subtipo_fornec', 'table,___not______in___subtipo_fornecedor', 'sup_subtipo_fornec,99|0|1', 'subtipo_fornecedor', 'N', 'S', 'S');	
    }
    
    loadDsCombo('area_solicitante', 'ds_areas_rm', 'desc_area', 'desc_area', '', '', 'desc_area', 'N', 'S', 'S');

    //loadDsCombo('ies_tip_fornec', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_COLUMN_LEGEND,fornecedor,ies_tip_fornec', 'legend_text', 'N', 'S', 'S');
    
    
    //loadDsCombo('simples_nacional', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_VIRTUAL_COLUMN_LEGEND,par_clientes,virtual_optante_simples', 'legend_text', 'N', 'S', 'S');
    loadDsCombo('ies_tip_conta', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name,___in___legend_value', 'FRM_VIRTUAL_COLUMN_LEGEND,fornecedor,virtual_tipo_conta,C|P', 'legend_text', 'N', 'S', 'S');
    // loadDsCombo('ies_pix', 'selectLogix', 'legend_value', 'legend_text', 'table,___in___table_name', 'FRM_COLUMN_LEGEND,cap_fornec_pix', 'legend_text', 'N', 'S', 'S');
    loadDsCombo('categoria_cnh', 'selectLogix', 'categoria', 'des_categoria', 'table', 'cap_cat_sefip', 'categoria', 'N', 'S', 'S');

    loadDsCombo('cod_mercado', 'selectLogix', 'cod_mercado', 'den_mercado', 'table', 'mercado', 'den_mercado', 'N', 'S', 'S');    
    loadDsCombo('cod_continente', 'selectLogix', 'cod_continente', 'den_continente', 'table', 'continente', 'den_continente', 'N', 'S', 'S');
    loadDsCombo('cod_regiao', 'selectLogix', 'cod_regiao', 'den_regiao', 'table', 'regiao', 'den_regiao', 'N', 'S', 'S');
    
    loadDsCombo('cod_tip_carteira', 'selectLogix', 'cod_tip_carteira', 'den_tip_carteira', 'table', 'fluig_tipo_carteira', 'den_tip_carteira', 'N', 'S', 'S');
        
    
    $('.cnpj').mask('00.000.000/0000-00');
    $(".telefone").mask("(00) 0000-00009");
    $('#agencia').mask("####");
    //$('#dig_agencia').mask("#");
    $('#conta_corrente').mask("###############");
    //$('#dig_conta').mask("#");

    setUpper();
    // controleTipoCadastro();
	// if (task == 0 || task == 1){
    //     trataRepres();
	// }

	
	// if ( $('#tipo_cadastro').val() == "E" ){
	// 	loadDadosCliente($('#cod_cliente').val(), "N" );
	// 	$('#tipo_cadastro').val("L");
	// 	loadTipoDocumentos(false);
	// } else {
    //     loadTipoDocumentos(false);
    // }
	
	
	  validaCampoIsento();
      validaCampoNumero();
	
	// marcaCampos();
    
  	controleOrigem();
  	
	displayFields();
    // if ( $('#num_cgc_cpf').val() == '' && $('#cod_cliente').val() != '' ){
    //     loadDadosCliente($('#cod_cliente').val());
    //}

	setPaisSancionado();
	setConflito();

  	atualizaFlags();
	
  	atualizaAnexos();
	//controleTipoCadastro();
	
}

function loadComboTipo(){
	
	var tipFornec = $("#ies_tip_fornec").val();
	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){ 

		loadDsCombo('ies_tip_fornec', 'selectDataSet', 'documentid', 'tipo_fornecedor', 'dataset,ativo,___in___tipo_cadastro', 'tipo_fornecedor,S,C|A', 'tipo_fornecedor', 'N', 'S', 'S');
	}else if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
		
		loadDsCombo('ies_tip_fornec', 'selectDataSet', 'documentid', 'tipo_fornecedor', 'dataset,ativo,___in___tipo_cadastro,ies_tip_fornec', 'tipo_fornecedor,S,F|A,2', 'tipo_fornecedor', 'N', 'S', 'N');
		
		tipFornec = $("#ies_tip_fornec option:first").val();		
		//tipFornec = '129022';
		//tipFornec = '691627';
		//tipFornec = '691662';
		
		$(".gera-ap-branco").remove();
	    $('#gera_ap').val( $("#forma_pagamento").val() );
	}else{
		loadDsCombo('ies_tip_fornec', 'selectDataSet', 'documentid', 'tipo_fornecedor', 'dataset,ativo,___in___tipo_cadastro', 'tipo_fornecedor,S,F|A', 'tipo_fornecedor', 'N', 'S', 'S');
	}
	$("#ies_tip_fornec").val( tipFornec );
	
}


function eraser( obj ){
	if( bloqueio ){
		if( !( obj == '.grp_lote' && $("#task").val() == "2" )
	     && !( obj == '.grp_lote' && $("#task").val() == "66" ) ){
			return false;
		}
	}
	if( obj.indexOf('.') == 0 ){
		$( obj ).val('');
	}else{
		if( obj.indexOf('eraser_logradouro_entrega') == 0 ){
			var seq = obj.split("___")[1];
			$("#tip_logradouro_entrega___"+seq).val("");
			$("#desc_logradouro_entrega___"+seq).val("");
			$("#eraser_logradouro_entrega___"+seq).val("");
			$("#zoom_logradouro_entrega___"+seq).val("");
		}
	}
}


function setConflito(){
	if( $('#conflito_interesse').val() == "S" ){
		$('.conflito_interesse').show();
		$('#conflito_interesse_texto').addClass('valida');
	}else{
		$('#conflito_interesse').val("N");
		$('.conflito_interesse').hide();
		$('#conflito_interesse_texto').removeClass('valida');
	}
}

function validaCampoNumero(){
    if( ( $('#numero').val() == 'SN' || $('#numero').val() == 'S/N' ) ){
		$( '#sem_numero' ).attr('checked', true);
        setSemNumero( 'sem_numero', 'numero' );
	}

    if( $('#numero_cobranca').val() == 'SN' || $('#numero_cobranca').val() == 'S/N' ){
		$( '#sem_numero_cobranca' ).attr('checked', true);
        setSemNumero( 'sem_numero_cobranca', 'numero_cobranca' );
	}  

    $("input[name^=numero_entrega___]").each(function (index, value) {
    	var seq = $(this).attr('id').split('___')[1];
    	if( $('#numero_entrega___'+seq).val() == 'SN' || $('#numero_entrega___'+seq).val() == 'S/N'  ){
    		$( '#sem_numero_entrega___'+seq ).attr('checked', true);
			setSemNumero( 'sem_numero_entrega___'+seq, 'numero_entrega' );
    	}
	});

}

function validaCampoIsento(){
	
	if( $('#ins_estadual').val().trim() == "ISENTO" && $("#ies_cpf_cnpj").val() == "CNPJ" && $("#ies_nacional_internacional").val() == "N" ){
        //$("#isento_ie").prop( "checked", true );
        $('#ins_estadual').val("");
    }
	
    //setIsento( 'isento_ie', 'ins_estadual', 'uf' );
    

    /*if( $('#ie_cobranca').val().trim() == "ISENTO" ){
        $("#isento_ie_cobranca").prop( "checked", true );
        setIsento( 'isento_ie_cobranca', 'ie_cobranca', 'uf_cobranca' );
    }

    if( $('#ie_entrega').val().trim() == "ISENTO" ){
        $("#isento_ie_entrega").prop( "checked", true );
        setIsento( 'isento_ie_entrega', 'ie_entrega', 'uf_entrega' );
    }*/
}

function setPaisSancionado(){
		
	var constraintsFilhos = new Array();
	constraintsFilhos.push( DatasetFactory.createConstraint("cod_pais", $("#cod_pais").val(), $("#cod_pais").val(), ConstraintType.MUST) );
	var datasetFilhos = DatasetFactory.getDataset("ds_paises_nao_sancionados", null, constraintsFilhos, null );
	console.log('DataSet',datasetFilhos);
	if ( datasetFilhos != null && datasetFilhos.values.length > 0 ){
		$("#ies_sancionado").val("N");
		$("#div_nao_sancionado").show();
	}else{
		$("#ies_sancionado").val("S");
		$("#div_nao_sancionado").hide();
	}
}

function setGeraAP(){
	
	readOnlyAllK(false,'.gera_ap');
	$('#gera_ap').val( $("#forma_pagamento").val() )
	readOnlyAllK(true,'.gera_ap');
}

function displayFields(){
	// console.log('displayFields');

    // $('.rg').mask("99.999.999-0");
    $('.cep').mask("99999-999");
    // $('#num_ident_fiscal').mask()
    FLUIGC.calendar('.data-fluig', {maxDate: DataHoje()}  );

    var task = $('#task').val();
    
    if ( $('#ies_tipo_operacao').val() ){
        // $('.menu').show();
    } else {
        $('.menu').hide();
    }
    
    if( $("#xpednitemped").val() == "" ){
    	$("#xpednitemped").val("N");
    }
    
    $('#id_aba_dados_bancarios').hide();
    readOnlyAllK(false,'.gera_ap');
    
    $('.rh').hide();
    
    /*if ( task  == 8) {
		$('#cnpj_produtor_rural option:not(:selected)').attr('disabled', 'disabled');
    	$("#obs_produtor_rural").attr('readonly',true);
    }*/
    
    
    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
        //Cliente
        $('#title').text('Cliente');
        $('.fornecedor').hide();
        $('.fornecedor_cpf').hide();
        $('.motorista').hide();
        $('.autonomo').hide();
        $('.cliente').show();
        $('.classe').show();
        $('.transportador').hide();
        
    
        
    }

    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'F' 
      || tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
    	
        //Fornecedor / Transportador
        $('#title').text('Fornecedor');
        //$('#cod_tip_cliente').val('98');
        if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
            $('#title').text('Transportador');
            //$('#cod_tip_cliente').val('99');
            $('.transportador').show();
            $(".gera_ap").show();
            readOnlyAllK(true,'.gera_ap');
        }else{
        	$('.transportador').hide();
        	if( $("#gera_ap").val() == "" ){
        		$("#gera_ap").val("S");
        	}
        }
        $('.cliente').hide();
        $('.motorista').hide();
        $('.autonomo').hide();
        $('.fornecedor').show();
        $('.fornecedor_cpf').show();
        $('.classe').hide();
        
        $('#id_aba_dados_bancarios').show();
        /*if( $('#ies_cpf_cnpj').val() == "CPF" ){
        	$('#id_aba_dados_bancarios').hide();
        }else{*/
        	//$('#id_aba_dados_bancarios').show();
        /*}*/
    }

    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'A' ){
        //Autônomo
        $('#cod_tip_cliente').val('98');
        $('#title').text('Autônomo');
        $('.cliente').hide();
        $('.fornecedor').hide();
        $('.fornecedor_cpf').hide();
        $('.motorista').hide();
        $('.autonomo').show();
        $('.divCpfCnpj').show();
        $('.classe').hide();
        $('.transportador').hide();
        
        $('#id_aba_dados_bancarios').show();
        // $('.menu').show();
        
    }
    
    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'M' ){
        //Motorista
        $('#cod_tip_cliente').val('98');
        $('#title').text('Motorista');
        $('.cliente').hide();
        $('.fornecedor').hide();
        $('.fornecedor_cpf').hide();
        $('.autonomo').hide();
        $('.motorista').show();
        $('.divCpfCnpj').show();
        $('.classe').hide();
        $('.transportador').hide();
        //$('#id_aba_dados_bancarios').hide();
        // $('.menu').show();

    }
    controleOrigem();

    if ( ['0','1','163','167','171','175','179','183','187'].indexOf( task ) == -1 ){
        $('.divIesOperacao').show();
        if ( $('#ies_operacao').val() == 'N') {
            $('#ies_operacao option:not(:selected)').prop('disabled', true);
        } else {
            $("#ies_operacao option[value='N']").prop('disabled', true);
        }
        required();
        readOnlyAll('.header');
    }
    /*
    if( $('#iesFiscal').val() != "S" ){
    	$('.fiscal').hide();
    }
    */
    if( $('#iesCredito').val() != "S" ){
    	$('.credito').hide();
    }
    /*if( $('#iesRH').val() != "S" ){
    	$('.rh').hide();
    }*/

    if( task == 53 || task == 51 ){
    	$('.compras').show();
    	$('.aprovacao').show();
    	$('.fiscal').show();
    	$('.rh').show();
    	$('.credito').show();	
    }else{
    	
    	// Revisão Cadastro
	    if ( task  == 2 ) {
	    	bloqueio = true;
	        readOnlyAll('.menu');
	        habilitaEdicao('.compras');
	    	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
	            $(".gera_ap").show();
	            readOnlyAllK(true,'.gera_ap');
	    	}
	        
	        
	    }else{
	    	$('.compras').hide();
	    	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
	            $(".gera_ap").show();
	            readOnlyAll('.gera_ap');
	    	}
	    }
	
	    // Aprovação Cadastro
	    if ( task  == 8) {
	    	bloqueio = true;
	        readOnlyAll('.menu');
	        habilitaEdicao('.aprovacao');
	        $('.aprovacao').show();
	        readOnlyAllK(true,'.produtor-rural');
	    }else{
	    	$('.aprovacao').hide();
	    }
	
	    if( ['10'].indexOf(task ) == -1 ){
	    	$('.fiscal').hide();
	    	readOnlyAllK(true,'.fiscal');
	    	$('#li_aba_demais_informacoes').hide();
	    }
	    
	    // Revisão fiscal
	    if( ['0','1','163','167','171','175','179','183','187'].indexOf( task ) >= 0 && $('#iesFiscal').val() == "S" ){
    		$('.fiscal-ini').show();
    		habilitaEdicao('.fiscal-ini');
    		if( $("#zona_franca").val() == "" || $("#zona_franca").val() == null ){
    			$("#zona_franca").val("N");
    		}		
    		if( $("#isento_ir").val() == "" || $("#isento_ir").val() == null ){
    			$("#isento_ir").val("N");
    		}		
    		if( $("#credito_presumido").val() == "" || $("#credito_presumido").val() == null ){
    			$("#credito_presumido").val("N");
    		}
    		    		
    	}else if( task  == 10) {
	    	bloqueio = true;
	        readOnlyAll('.menu');
	        habilitaEdicao('.fiscal');
	        $('.fiscal').show();
	        habilitaEdicao('.gera_ap');
	        $('.compras').show();
	        readOnlyAllK(false,'.ctrFiscal');
	        //readOnlyAllk(true,'.produtor-rural');
	        if( $('#ies_nacional_internacional').val() != "N" ){
	        	habilitaEdicao('.ctrFiscalInter');
	        }
	    }else{
	    	$('.fiscal').hide();
	    	/*if( $('#ies_cpf_cnpj').val() == 'CPF' ){
	    		$('#li_aba_demais_informacoes').hide();
	    	}*/
	    }
	    
	    if( ['0','1','163','167','171','175','179','183','187','10'].indexOf( task ) >= 0 ){
	    	habilitaEdicao('.inicio-fiscal-total');
	    }

	    
	    // Revisão RH
	    if ( task  == 78) {
	    	bloqueio = true;
	        readOnlyAll('.menu');
	        habilitaEdicao('.rh');
	        $('.rh').show();
	    }else{
	    	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] != 'A' ){
	    		$('.rh').hide();
	    	}
	    } 
	
	    // Aprovação Crédito
	    if ( task  == 66) {
	    	bloqueio = true;
	        readOnlyAll('.menu');
	        readOnlyAllK(false,'.end-cobranca');
	        readOnlyAllK(false,'.lgpd');
	        habilitaEdicao('.lgpd');
	        habilitaEdicao('.end-cobranca');
	        
	        if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
	        	$('.credito').show();	
	        	$('.aprovacao').hide();
	        }else{
	        	$('.credito').hide();	
	        	$('.aprovacao').show();
	        }
	    }else{
	    	$('.credito').hide();
	    	$('.aprovacao').hide();
	    }
	}
   
    if ( /*task != 0 && task != 1 && task != 22 && task != 2 && task != 8 && task != 10 && task != 78 && task != 66*/
    		['0','1','2','8','10','78','66','163','167','171','175','179','183','187'].indexOf( task+'') == -1 		
    ) {
    	bloqueio = true;
    	readOnlyAll('');
    }
    
    if( ['0','1','163','167','171','175','179','183','187'].indexOf( task ) == -1  ){
    	readOnlyAllK(true,".cabecalho");
    }
    
    $('#obs_hist').removeAttr('readonly');

    controleRecupJudicial();
    controleLGPD();
    
    setTipoOperacao();
    
    if( ['0','1','163','167','171','175','179','183','187'].indexOf( task ) == -1  ){
        $("#num_cgc_cpf").attr("readonly",true);
    }
    
    // Revisão fiscal
    if( ['0','1','163','167','171','175','179','183','187'].indexOf( $("#task").val() ) >= 0 && $('#iesFiscal').val() == "S" ){
		$('.fiscal-ini').show();
		habilitaEdicao('.fiscal-ini');
		if( $("#zona_franca").val() == "" || $("#zona_franca").val() == null ){
			$("#zona_franca").val("N");
		}
	}else{
		$('.fiscal-ini').hide();
	}
    
    
	if( ( $('#ies_operacao').val() == "N" || $('#ies_operacao').val() == "" ) 
	   && $('#ies_nacional_internacional').val() == "I"  ){
		  $(".divCpfCnpj").hide();
	}else if( $('#ies_tipo_operacao').val() == "" || $('#ies_nacional_internacional').val() == "" ){
		$(".divCpfCnpj").hide();
	}else{
		$(".divCpfCnpj").show();
	}

	controleCpfCnpj();
}

function required(){
    
	if( $("#ies_operacao").val() == "I" ){
    	var required = [];
    	var requiredPf = [];
	}else if ( $('#ies_tipo_operacao').val() ){
	
	   	/*tipoDeParaOper = { "6": "C",
					   "7": "F",
					   "10": "F",
					   "8": "A",
					   "9": "M" } */
	    	
	   	var required = [];
	   	var requiredPf = [];
	    	
	    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
	          //Cliente
	       	requiredPf = ['cnpj_entrega','endereco_entrega','numero_entrega','bairro_entrega','cod_cidade_entrega','den_cidade_entrega','uf_entrega']
	        required = [ 'tipo_cliente',
	                     'nom_contao_comercial',
	                     'cod_mercado','cod_continente','cod_regiao'
	                    ];
	       	
	       	if( $('#cod_tip_cliente').val() != '97' ){
	       		required = required.concat( ['email_contato_comercial','celular_contato_comercial','telefone_contato_comercial'] );
	       	}
	       	
	       	if( $('#ies_cpf_cnpj').val() == 'CNPJ' ){
	       		required = required.concat( ['raz_social_reduz'] );
	       	}
	       	
	       	if( $('#num_suframa').val() != "" ){
            	required = required.concat( ['dat_validade_suframa'] );
            }
	       	
        	if( $('#ies_nacional_internacional').val() == "N" ){
        		
        		if( $('#task' ).val() == "66" 
        		 && $("#iesAGRISK").val() == "N"
        	     && $('#ies_cpf_cnpj').val() == 'CPF'
        		 && ["97","16","11"].indexOf( $("#cod_tip_cliente").val() ) == -1 ){
        			required = required.concat( ['consulta_AGRISK','obs_AGRISK'] );
        		}
        		
        		/*
        		var enderDiff = false
        		$("input[name^=ie_entrega___]").each( function (index, value) {
        			var seq = $(this).attr('id').split('___')[1];
        		 	if( $('#desc_logradouro_entrega___'+seq).val() != $('#desc_logradouro').val()
        		     || $('#cep_entrega___'+seq).val() != $('#cep').val()
        			 || $('#endereco_entrega___'+seq).val() != $('#endereco').val()
        			 || $('#numero_entrega___'+seq).val() != $('#numero').val()
        			 || $('#bairro_entrega___'+seq).val() != $('#bairro').val()
        			 || $('#cod_cidade_entrega___'+seq).val() != $('#cod_cidade').val() ){
        			 		
        				enderDiff = true;
        			}	        
        		});
        		
        		if( enderDiff ){
        			required = required.concat( ['ins_estadual'] );
        		}
        		*/
        	}
	        	
        	if( $('#ies_cpf_cnpj').val() == 'CPF' && $('#ies_nacional_internacional').val() == "N" ){
        		if( $('#task' ).val() == '10' ){
	        		required = required.concat( ['utiliza_nfe'] );
	                if( $("#utiliza_nfe").val() == "S" ){
	            		required = required.concat( ['data_nfe','modelo_nf_fr'] );
	            	}
        		}
                required = required.concat( ['cnpj_produtor_rural'] );
	            if( $("#cnpj_produtor_rural").val() == "S" ){
	            	required = required.concat( ['obs_produtor_rural'] );
                }
        	}
	        	
        	if( $('#cod_tip_carteira').val() != "" || $('#nom_repres').val() != "" ){
        		required = required.concat( ['cod_tip_carteira','nom_repres'] );
        	}
        	
        	 /*if( $('#ies_nacional_internacional').val() == "N" && $('#ies_cpf_cnpj').val() == "CNPJ" ){
        		 required = required.concat( ['anexo_contrato_social'] );
        	 }*/
	        	
        	 if( $("#cod_pais").val() == "001" ){
        		 requiredPf = requiredPf.concat( ['cep_entrega'] ); 
        	 }
	        	 
        	 
             if( $("#ies_nacional_internacional").val() == "N" && ["16","98"].indexOf( $("#cod_tip_cliente").val() ) == -1  ){
             	required = required.concat( ['termo_lgpd','anexo_ficha_cadastral'] );
             }
             
             var temEndCob = false;
             var listaEndCob = [];
             $(".end-cobranca").each(function (){
            	if( $(this).val() != null ){
	             	if( $(this).val().trim() != "" ){
	             		temEndCob = true;
	             	}
            	}
             	listaEndCob.push( $(this).attr('id') );
             });
             if( temEndCob ){
             	required = required.concat( listaEndCob );
	           	 if( $("#cod_pais").val() == "001" ){
	        		 required = required.concat( ['cep_cobranca'] );
	           	 }
             }
	        	 
        }
	
        if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'F' 
          || tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T'  ){
            //Fornecedor / Transportador
            required = ['nom_contao_comercial','email_contato_comercial','ies_tip_fornec','sup_subtipo_fornec','pagto_deposito_credito','raz_social_reduz'];
            
            if( $("#ies_nacional_internacional").val() == "N" ){
            	required = required.concat( ['telefone_contato_comercial','email2_contato_comercial'] );
		        if( $("#ies_tip_fornec").val() != "691653" ){
            		required = required.concat( ['termo_lgpd'] );
            		if( $('#ies_cpf_cnpj').val() == "CNPJ" ){
            			required = required.concat( ['anexo_contrato_social'] );
            		}
            	}

	            	
            	/*if( $('#ies_cpf_cnpj').val() == 'CNPJ' && $('#ies_nacional_internacional').val() == "N" ){
	        		required = required.concat( ['ins_estadual'] );
	        	}else{
	        		if( $('#task' ).val() == '78' && $('#ies_nacional_internacional').val() == "N" ){
	        			required = required.concat( ['ins_estadual'] );
	        		} 
	        	}*/
            }else{
	            	
            }
            
            if( $("#ies_nacional_internacional").val() == "N" && $("#ies_tip_fornec").val() != "691653" ){
             	required = required.concat( ['anexo_ficha_cadastral_assinada'] );
             }

            if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
            	$('#gera_ap').val( $("#forma_pagamento").val() );
            }
            
            if( $('#ies_cpf_cnpj').val() == 'CPF' && $('#ies_nacional_internacional').val() == "N" ){
            	if( $('#task' ).val() == '10' ){
	        		required = required.concat( ['utiliza_nfe'] );
	        		
	                if( $("#utiliza_nfe").val() == "S" ){
	            		required = required.concat( ['data_nfe','modelo_nf_fr'] );
	            	}
            	}
        	    
        	}
            /*if( $('#task' ).val() == '2' || $('#task' ).val() == '66' ){
    			required = required.concat( ['nom_lote'] );
    		}*/
	            
            /*if( $('#task' ).val() == '10' 
             && $('#ies_nacional_internacional').val() == "N"
             && $('#ies_cpf_cnpj').val() == "CNPJ" ){
            	required = required.concat( ['simples_nacional'] );
            }*/
	            
            if( $('#task' ).val() == '2' ){
            	required = required.concat( ['gera_ap'] );
            }
	            
	        if( $("#ies_tip_fornec").val() != "691653"  ){    
            	var temGrp = false;
            	var listaCampoBanco = [];
            	$(".grp_banco").each(function (){
            		if( $(this).val() != null ){
	            		if( $(this).val().trim() != "" ){
	            			temGrp = true;
	            		}
            		}
            		listaCampoBanco.push( $(this).attr('id') );
            	});
            	if( temGrp ){
            		required = required.concat( listaCampoBanco ); 
            		if( $("#ies_nacional_internacional").val() == "N" ){
            			required = required.concat( ['anexo_dados_bancarios'] );
            		}else{
            			required = required.concat( ['anexo_comprovante_conta'] );
            		}
            	}
            }
        }
        
	
        if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'A' ){
            //Autônomo
            required = ['ins_estadual','org_emissor_uf','pis','cargo','servico_prestado','termo_lgpd','raz_social_reduz'];
            
            /*if( $('#task' ).val() == '2' || $('#task' ).val() == '66' ){
    			required = required.concat( ['nom_lote'] );
    		}*/
            /*
            var temGrp = false;
            var listaCampoBanco = [];
            $(".grp_banco").each(function (){
            	if( $(this).val().trim() != "" ){
            		temGrp = true;
            	}
            	listaCampoBanco.push( $(this).attr('id') );
            });
            if( temGrp ){
            	required = required.concat( listaCampoBanco );
            	required = required.concat( ['anexo_comprovante_conta'] );

            }*/
            /*
            if( $('#task' ).val() == '2' ){
            	required = required.concat( ['gera_ap'] );
            }*/
        }
	        
        if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'M' ){
        	required = required.concat( ['raz_social_reduz'] );
            //Motorista
            /*if( $('#task' ).val() == '2' || $('#task' ).val() == '66' ){
    			required = required.concat( ['nom_lote'] );
    		}*/
            //required = ['termo_lgpd'];

        }
	
        if( $("#ies_operacao").val() == "A" || $("#ies_nacional_internacional").val() == "N" ){
         	required = required.concat( ['num_cgc_cpf'] );
        }
        
 
        if( $('#task' ).val() == '10' ){
        	if( $("#ies_nacional_internacional").val() != "N" ){
        		required = required.concat( ['pais_dispensa_nif','dispensa_nif'] );
        		if( $("#dispensa_nif").val() == "N" ){
        			required = required.concat( ['numero_nif'] );
        		}
        	}
        	
        }
        //if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] != "C" ){
	        if( $('#termo_lgpd').val() == "S" ){
	            required = required.concat( ['anexo_termo_lgpd'] );
	        }else if( $('#termo_lgpd').val() == "N" ){
	        	required = required.concat( ['justificativa_lgpd'] );
	        }
        //}
        if( $('#conflito_interesse').val() == "S" ){
        	required = required.concat( ['conflito_interesse_texto'] );
        }
        
        /*if( $("#cnpj_produtor_rural").val() == "S" ){
        	required = required.concat( ['obs_produtor_rural'] );
        }*/
        required = required.concat( ['ies_tipo_operacao','ies_nacional_internacional','conflito_interesse','ies_zona','area_solicitante','cod_pais','den_pais','raz_social','endereco','numero','bairro','cod_cidade','den_cidade',
                                     'uf'] )
	
        if( $("#cod_pais").val() == "001" ){
        	required = required.concat( ['cep'] ); 
        }                                     
	}
	        
    $('.menu input,.menu textarea,.menu select').each(function () {
        var seq = this.id.split('___')[1];
        var id = this.id; 
        if( seq ){
          	id = this.id.split('___')[0];
           	if( requiredPf.indexOf( id ) != -1 ){
            	if (!$(this).hasClass('valida') ) $(this).addClass('valida');
	        } else {
	        	$(this).removeClass('valida');
	              //  $(this).val('');	            
            }
        }else{
        	if( required.indexOf( this.id ) != -1 ){
            	if ( !$(this).hasClass('valida') ) $(this).addClass('valida');
	        } else {
	        	$(this).removeClass('valida');
              //  $(this).val('');	            
            }
       }
   });
}

function setZona(){
	
	var constraintsFilhos = new Array();
	constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tbl_papeis", "tbl_papeis", ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", $('#documentidOperacao').val(), $('#documentidOperacao').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", $('#versionOperacao').val(), $('#versionOperacao').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("cod_zona", $('#ies_zona').val(), $('#ies_zona').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
	var datasetFilhos = DatasetFactory.getDataset("tipo_de_operacao", null, constraintsFilhos, null );
	console.log('DataSet',datasetFilhos);
	if ( datasetFilhos != null && datasetFilhos.values.length > 0 ){
		if( datasetFilhos.values[0]["cod_papel_credito"] != "" ){
			$('#iesCredito').val("S");
		}else{
			$('#iesCredito').val("N");
		}
		$('#integraPadraoK2').val( datasetFilhos.values[0]["integra_k2"] );
		$('#integra_k2').val( datasetFilhos.values[0]["integra_k2"] );
		if( datasetFilhos.values[0]["integra_k2"] == "S" ){
			$('#den_integra_k2').val( "Sim" );
		}else{
			$('#den_integra_k2').val( "Não" );
		}
	}
}

function atualizaFlags(){
	
	var constraintsFilhos = new Array();
	constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tbl_papeis", "tbl_papeis", ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", $('#documentidOperacao').val(), $('#documentidOperacao').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", $('#versionOperacao').val(), $('#versionOperacao').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("cod_zona", $('#ies_zona').val(), $('#ies_zona').val(), ConstraintType.MUST) );
	constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
	var datasetFilhos = DatasetFactory.getDataset("tipo_de_operacao", null, constraintsFilhos, null );
	console.log('DataSet',datasetFilhos);
	if ( datasetFilhos != null && datasetFilhos.values.length > 0 ){
		if( datasetFilhos.values[0]["cod_papel_credito"] != "" ){
			$('#iesCredito').val("S");
		}else{
			$('#iesCredito').val("N");
		}
		if( datasetFilhos.values[0]["cod_papel_rev"] != "" ){
			$('#iesRevisao').val("S");
		}else{
			$('#iesRevisao').val("N");
		}
		if( datasetFilhos.values[0]["cod_papel_fiscal"] != "" ){
			$('#iesFiscal').val("S");
		}else{
			$('#iesFiscal').val("N");
		}
		if( datasetFilhos.values[0]["cod_papel_aprov"] != "" ){
			$('#iesAprovacao').val("S");
		}else{
			$('#iesAprovacao').val("N");
		}
		if( datasetFilhos.values[0]["cod_papel_rh"] != "" ){
			$('#iesRH').val("S");
		}else{
			$('#iesRH').val("N");
		}
	}
	
	if( $("#pagto_deposito_credito").val() == "" || $("#pagto_deposito_credito").val() == null ){
		$("#pagto_deposito_credito").val("N");
	}
	
}

function controleTipoCadastro(){

    loadWindow.show();
    $('.menu').hide();
    $('.divIesOperacao').hide();
    $('.nav-tabs a:first').tab('show');
    
    $('#ies_tipo_cadastro').val( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] );
    
    cleanDados();
    // loadDsCombo('ies_nacional_internacional', 'tipo_de_operacao', 'cod_operacao', 'den_operacao', '', '', 'cod_operacao', 'N', 'S', 'S')
    var constraints = [
        DatasetFactory.createConstraint('cod_operacao', $('#ies_tipo_operacao').val(), $('#ies_tipo_operacao').val(), ConstraintType.MUST),
    ];

    loadDsCombo('ies_zona', 'selectPaiFilho', 'cod_zona', 'den_zona', 'dataset,table,cod_operacao', 'tipo_de_operacao,tbl_papeis,'+$('#ies_tipo_operacao').val(), 'den_zona', 'N', 'S', 'S');
    
    if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
    	loadDsCombo('sup_subtipo_fornec', 'selectLogix', 'subtipo_fornecedor', 'des_subtipo_fornec', 'table,___not______in___subtipo_fornecedor', 'sup_subtipo_fornec,99|98|97|2', 'subtipo_fornecedor', 'N', 'S', 'S');	
    }else{
    	loadDsCombo('sup_subtipo_fornec', 'selectLogix', 'subtipo_fornecedor', 'des_subtipo_fornec', 'table,___not______in___subtipo_fornecedor', 'sup_subtipo_fornec,99|0|1', 'subtipo_fornecedor', 'N', 'S', 'S');	
    }

    
    DatasetFactory.getDataset('tipo_de_operacao', null, constraints, null, {
        success: (data) => {
        	
        	$('#documentidOperacao').val( data.values[0]['documentid'] );
            $('#versionOperacao').val( data.values[0]['version'] );
            setZona();
            
            if (data.hasOwnProperty("values") && data.values.length > 0) {
                $('#ies_nacional_internacional').val('');
                $('#ies_cpf_cnpj').val( '' );
                $('#num_cgc_cpf').val( '' );
                
                $('#cod_papel_aprov_inat_me').val(data.values[0]['cod_papel_aprov_inat_me']);
                $('#cod_papel_aprov_inat_mi').val(data.values[0]['cod_papel_aprov_inat_mi']);
                
                if ( data.values[0]['nacional_internacional'] == 'S' ){
                    $('.nacional_internacional').show();
                } else {
                    $('.nacional_internacional').hide();
                }
                if ( data.values[0]['cpf_cnpj'] != 'A' ){
                    $('#ies_nacional_internacional').val('N');
                    $('#ies_cpf_cnpj').val(data.values[0]['cpf_cnpj']);
                    $('#ies_cpf_cnpj option:not(:selected)').prop('disabled', true);
                } else {
                    $('#ies_cpf_cnpj option:not(:selected)').prop('disabled', false);
                    $('#ies_cpf_cnpj').val( '' );
                }

                displayFields();
                //required();

                loadWindow.hide();
                
            } else {
                $('#ies_nacional_internacional').val('');
                $('.nacional_internacional').hide();
                displayFields();
                //required();
                loadWindow.hide();
            }
        } 
        
        
    });    

}

function controleCpfCnpj(){
    
    if ( $('#ies_cpf_cnpj').val() ){
    	if( ['0','1','163','167','171','175','179','183','187'].indexOf( $('#task').val() ) >= 0 ){
    		$('#num_cgc_cpf').removeAttr('readonly');
    	}
    } else {
        if ( !$('#num_cgc_cpf').prop('readonly') ) $('#num_cgc_cpf').attr('readonly', true);
        $('#num_cgc_cpf').val('');
    }

    $(".clear-fornec-cpf").show();
    $('.raz_social_reduz').show();
    if ( $('#ies_cpf_cnpj').val() == 'CPF'){
        $('#num_cgc_cpf').mask("000.000.000-00");
        $('.lb_cpf_cnpj').text( 'CPF' );
        if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'A'
         || tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'M' ){
        	$('#lb_ins_estadual').text('RG');
        	$(".div-rg").hide();
        }else{
        	$('#lb_ins_estadual').text('Inscrição Estadual');
        	$(".div-rg").show();
        }
        if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
            $('.raz_social_reduz').hide();
        }
        //$('#ins_estadual').mask("99.999.999-0");
        $('.lb_data_abertura').text( 'Data Nascimento' );
        //disableSeach('.ins_estadual');
        $('.fornecedor_cpf').show();
        $(".clear-fornec-cpf").hide();
        
        //if( $("#isento_ie").is(':checked') ){
        //	$("#ins_estadual").val("");
        //}
        //$("#isento_ie").prop("checked",false);
    	//$("#isento_ie").hide();
    	//$("#ins_estadual").attr("readonly",false);
    	
    }
    
    if ( $('#ies_cpf_cnpj').val() == 'CNPJ'){
        $('#num_cgc_cpf').mask("00.000.000/0000-00");
        $('.lb_cpf_cnpj').text( 'CNPJ' );
        // $('.ins_estadual').show();
        $('#lb_ins_estadual').text('Inscrição Estadual');
        $(".div-rg").hide();
        $('.lb_data_abertura').text( 'Data Abertura Empresa' );
        $('#ins_estadual').unmask();
        //enableSeach('.ins_estadual');
        // if ( !$('#ins_estadual').hasClass('valida') ) $('#ins_estadual').addClass('valida');
        $('.fornecedor_cpf').hide();
        
        //$("#isento_ie").show();
        
    }
  
    if( $("#ies_nacional_internacional").val() == "I" ){
    	$('.lb_cpf_cnpj').text( 'Código' );
    }
    //validaCampoIsento();
    
    /*
    if( $('#task').val() != "10" ){
    	if( $('#ies_cpf_cnpj').val() == 'CPF' ){
    		$('#li_aba_demais_informacoes').hide();
			//$('.simples').hide();
    	}else{
    		if( $('#ies_nacional_internacional').val() == 'N' ){
    			$('#li_aba_demais_informacoes').show();
    			//$('.simples').show();
    		}else{
    			$('#li_aba_demais_informacoes').hide();
    			//$('.simples').hide();
    		}
    	}
	}
    */
    $(".cli-pf").hide();
    $(".cli-pj").hide();
    $(".fonenc-pf").hide();
    $(".fonenc-pj").hide();
    if( $('#ies_cpf_cnpj').val() == 'CPF' ){
    	$('.rec-judicial').hide();
    	//$('.simples').hide();
    	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' 
    	 && $('#ies_nacional_internacional').val() == 'N' ){
    		$(".cli-pf").show();
    	}
    	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'F' 
       	 && $('#ies_nacional_internacional').val() == 'N' ){
       		$(".fonenc-pf").show();
       	}
	}else{
		if( $('#ies_nacional_internacional').val() == 'N' ){
			//$('.simples').show();
			if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){ 
				$('.rec-judicial').hide();
			}else{
				$('.rec-judicial').show();
			}
			
			if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
				$(".cli-pj").show();
		    }
		    if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'F' || tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'T' ){
		    	$(".fonenc-pf").show();
		    }
		}else{
			//$('.simples').hide();
			$('.rec-judicial').hide();
		}
	}
    
    controleCampos();
    setTipoFornecedor();
    
  /*  
    if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "F" ){
    	if( $('#ies_nacional_internacional').val() == 'N' ){
    		$('#lb_anexo_comprovante_conta').text('Ficha cadastral assinada');
    	}else{
    		$('#lb_anexo_comprovante_conta').text('Anexo Comprovante de Conta');
    	}
    }
    
    if( $('#ies_nacional_internacional').val() == 'N' ){
    	 $('#lb_anexo_dados_bancarios').text('Anexo Declaração de dados bancários (Assinada)');
    }else{
    	 $('#lb_anexo_dados_bancarios').text('Ficha cadastral assinada');
    }
    */
    

    
    controlaCampoCEP();
}

function controleCampos(){
	
    $(".ctr-dinamico").hide();
    var chaveTipo = tipoDeParaOper[ $('#ies_tipo_operacao').val() ]+"-"+$('#ies_nacional_internacional').val();
    $("."+chaveTipo).show();

    var chaveTipo = tipoDeParaOper[ $('#ies_tipo_operacao').val() ]+"-"+$('#ies_nacional_internacional').val()+"-"+$('#task').val();
    $("."+chaveTipo).show();
    
    if( $('#ies_cpf_cnpj').val() == 'CPF' && tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" ){
    	$(".produtor-rural").show();
    	readOnlyAllK(false,'.produtor-rural');
    }else{
    	$(".produtor-rural").hide();
    	readOnlyAllK(true,'.produtor-rural');
    }
    
    if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" 
     && chaveTipo == 'C-N-66'
     && $('#ies_cpf_cnpj').val() == 'CPF' ){
    	readOnlyAllK(false,'#obs_AGRISK');
    }else{
    	$(".AGRISK").hide();
    }


}

function setTipoFornecedor(){
	
	controleCampos()
	
	 var ctt = new Array(); 
	 ctt.push( DatasetFactory.createConstraint("documentid", $("#ies_tip_fornec").val(), $("#ies_tip_fornec").val(), ConstraintType.MUST) );				
     var dst = DatasetFactory.getDataset("tipo_fornecedor", null, ctt, null);
	 if( dst.values.length > 0 ) {
		 if( dst.values[0]["ies_tip_fornec"].trim() == "3" ){
			 $(".TF-CLI").show();
		 }
	 }
	 
}



function controlaCampoCEP(){
	$(".div-cep").show();
    if( $('#ies_nacional_internacional').val() == 'I' ){
        $(".div-cep").hide();
    }
}

function controleCpfCnpjEndereco(id){

	var seq = id.split('___')[1];
	var cpl_seq = '';
	if( seq ){
		cpl_seq = '___'+seq;
	}
	var campo = id.split('___')[0];
		
    var cpl = '';
    if ( campo.split('_')[3] ) cpl = '_' + campo.split('_')[3];

    if ( $('#ies_cpf_cnpj' + cpl + cpl_seq ).val() == 'CPF'){
        $('#cnpj' + cpl + cpl_seq ).mask("000.000.000-00");
        $( $('#ie' + cpl + cpl_seq ).parent().parent().children()[0] ).html('RG');
      //  $('#ie' + cpl + cpl_seq ).mask("99.999.999-0");
        //disableSeach('.ins_estadual' + cpl + cpl_seq );
        $( $('#cnpj' + cpl + cpl_seq ).parent().children()[0] ).html('CPF');
    }
    
    if ( $('#ies_cpf_cnpj' + cpl + cpl_seq ).val() == 'CNPJ'){
        $('#cnpj' + cpl + cpl_seq ).mask("00.000.000/0000-00");
        $( $('#ie' + cpl + cpl_seq ).parent().parent().children()[0] ).html('Inscrição Estadual');
      //  $('#ie' + cpl + cpl_seq ).unmask();
        //enableSeach('.ins_estadual' + cpl + cpl_seq );
        $( $('#cnpj' + cpl + cpl_seq ).parent().children()[0] ).html('CNPJ');
    }
    controlaCampoCEP();
}

function cleanDados(){
    $('.menu input,.menu textarea,.menu select').each(function () {
        if ( !$(this).hasClass('notClean') ){
            $(this).val('');
        }
    });
}

// function trataRepres(){

//     var constraints = new Array();
//     constraints.push(DatasetFactory.createConstraint("user", parent.WCMAPI.userCode , parent.WCMAPI.userCode, ConstraintType.MUST));
//     var dsRepres = DatasetFactory.getDataset("dsk_cad_repres", null, constraints, null)

//     if (dsRepres && dsRepres != ''){
//         if ( dsRepres.values.length > 0 ){
//             if ( dsRepres.values[0]['tipo_cadastro'] == 'C' ){
//                 disableSeach('.representante');
//             }
            
//             $('#cod_repres').val( dsRepres.values[0]['lst_repres'].split('|')[0] );
//             $('#nom_repres').val( dsRepres.values[0]['nome_usuario'] );
//             $('#responsavel').val( dsRepres.values[0]['responsavel'] );
//         }
//     }
// }

function addMail(table) {
	var row = wdkAddChild(table);
	
	var nId = 0;
	$("input[name^=id_email___]").each(function (index, value) {
		if( nId < parseInt( $(this).val() ) ){
			nId = parseInt( $(this).val() );
		}
	});
	$('#id_email___'+row).val( nId+1 );
	$('#ies_excluido___'+row).val( "A" );
    $('#ies_excluido___'+row).parent().parent().addClass( "has-success" );
	
	setMask();

	return row;
}

function addContato(table) {

    var row = wdkAddChild(table);

    var nId = 0;
	$("input[name^=num_contato___]").each(function (index, value) {
		if( nId < parseInt( $(this).val() ) ){
			nId = parseInt( $(this).val() );
		}
	});

    $('#num_contato___'+row).val( nId+1 );
	$('#ies_contato_excluido___'+row).val( "A" );
    $('#ies_contato_excluido___'+row).parent().parent().addClass( "has-success" );

	return row;

}

function fnRemoveContato( obj ) {
	var seq = obj.children[0].id.split('___')[1];
	if( $('#ies_contato_excluido___'+seq).val() == "A" ){
		fnWdkRemoveChild(obj);	
	}else{
		$('#ies_contato_excluido___'+seq).val("S");
		// $(obj).parent().parent().hide();
        $(obj).parent().attr('disabled', 'disabled');
        $(obj).parent().parent().addClass('has-error');
	}
}

function fnRemoveMail( obj ) {
	var seq = obj.children[0].id.split('___')[1];
	if( $('#ies_excluido___'+seq).val() == "A" ){
		fnWdkRemoveChild(obj);	
	}else{
		$('#email_nfe___'+seq).val("");
		$('#ies_excluido___'+seq).val("S");
		// $(obj).parent().parent().hide();
        $(obj).parent().attr('disabled', 'disabled');
        $(obj).parent().parent().addClass('has-error');
	}
}

function marcaCampos(){

	if( ! $('#oldData').val() ){
		return false;
	}
	
    var json = JSON.parse( $('#oldData').val() );
    var keys = Object.keys(json);
    var camposAlterados = [];
    $("input,textarea").each(function () {
        
        if( keys.indexOf(this.id) != -1 ) {
            $(this).parent().removeClass('has-error');
            if ( $(this).hasClass('decimal-2') ){
                if ( formatStringValue( json[this.id], 2).trim() != $(this).val().trim() ) {
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else if ( $(this).hasClass('data-fluig') ) {
                if ( json[this.id].split('-').reverse().join('/') != $(this).val().trim() ){
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else if ( $(this).hasClass('telefone') ) {
                if ( json[this.id].replace('(','').replace(')','').replace('-','').replace(' ','').trim() != $(this).val().replace('(','').replace(')','').replace('-','').replace(' ','').trim() ){
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else {
                if ( json[this.id].trim() != $(this).val().trim() ){
                    camposAlterados.push(this.id);
                    $(this).parent().addClass('has-error');
                }                
            }
            
        }
        
    });

    $('#camposAlterados').val( camposAlterados );

}


function controleOrigem(){
	
	loadComboTipo();
	
    $('.menu').hide();
    if ( $('#ies_nacional_internacional').val() ){
        $('.menu').show();
        if( $('#conflito_interesse').val() == "" ){
        	$('#conflito_interesse').val("N");
        }
        if ( $('#ies_nacional_internacional').val() == 'N' ){
            // $('.divIesCpfCnpj').show();
            $('.divCpfCnpj').show();
            $('.nacional').show();
            $('.divIesOperacao').show();
            if ( $('#ies_cpf_cnpj option:not(:selected)').prop('disabled') ){
                $('.divIesCpfCnpj').hide();
            } else {
                $('.divIesCpfCnpj').show();
            }
            // disableSeach( '.divCpfCnpj' );
            // $('#num_cgc_cpf').removeAttr('readonly');
            $('#cod_pais').val('001');
            $('#den_pais').val('BRASIL');
            disableSeach('.divPais');
            
            $(".clear-fornec-inter").show();
            $('.show-fornec-inter').hide();
           
            //$('.simples').show();
            
            if( $('#task').val() != "10" ){
            	$('#li_aba_demais_informacoes').hide();
            }
            
            if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" ){
            	$(".clear-cliente").hide();
            	$('#li_aba_endereco_entrega').show();
            }
            
            
            
        } else {
            // $('.divIesCpfCnpj').hide();
            $('.nacional').hide();
            $('.divCpfCnpj').show();
            $('.divIesOperacao').show();
            $('#ies_cpf_cnpj').val('CNPJ');
            
            $(".clear-fornec-inter").hide();
            if( $("#task").val() != "10" ){
            	$('#li_aba_demais_informacoes').hide();
            }
            $('#li_aba_endereco_entrega').hide();
            
            $(".clear-fornec-inter").hide();
            $('.show-fornec-inter').show();
            $(".clear-cliente").hide();
            // enableSeach( '.divCpfCnpj' );
            enableSeach('.divPais');
            // $('#num_cgc_cpf').attr('readonly', true);
            //$('#ies_operacao option').prop('disabled', false);
            //$('#ies_operacao option:not(:selected)').prop('disabled', true);
            
            //$('.simples').hide();
            
            if( $('#cod_pais').val() == '001' ){
            	$('#cod_pais').val('');
            	$('#den_pais').val('');
            }
            
        }
    } else {
        // $('.divIesCpfCnpj').hide();
        $('.divCpfCnpj').hide();
        $('.nacional').hide();
        $('.divIesOperacao').hide();
    }
    
    controleCpfCnpj();
    $("input[name^=ies_cpf_cnpj_entrega___]").each(function (index, value) {
    	controleCpfCnpjEndereco( $(this).attr('id') );
    });
    controlaCampoCEP();
    //controleCpfCnpjEndereco('ies_cpf_cnpj_cobranca');
    controleLGPD();
}

function limpaCgcCpf(){
    $('#num_cgc_cpf').val('');
    $('#ies_operacao option').prop('disabled', false);
    $('#ies_operacao').val('N');
    $('#ies_operacao option:not(:selected)').prop('disabled', true);
    $('.menu').show();
    if( $('#conflito_interesse').val() == "" ){
    	$('#conflito_interesse').val("N");
    }
}

function controleEdicao(){
    var value = $('#ies_operacao').val();

    if ( value == 'N'){
        if ( $('#ies_nacional_internacional').val() == 'I' ){
            $('.edit_internacional').hide();
        }

        habilitaEdicao('.novo');
    }

    if ( value == 'A' ){
        if ( $('#ies_nacional_internacional').val() == 'I' ){
            $('.edit_internacional').show();
        }
        removeEdicao('.novo');
    }
    
}

function controleLGPD(){
    $('.divLGPD').hide();
    $('.jusLGPD').hide();
    $('.divRowLgpd').show();
    if( $("#ies_nacional_internacional").val() == "I" || tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "M"  ){
    	$('.divRowLgpd').hide();	
    }else{
	    if ( $('#termo_lgpd').val() == 'S'){
	    	$('.divLGPD').show();
		}else if ( $('#termo_lgpd').val() == 'N'){
			$('.jusLGPD').show();
	    }
    }
}

function controleRecupJudicial(){
    if ( $('#ies_recup_judicial').val() == 'S'){
        $('.divJudicial').show();
    	$('#obs_recup_judicial').addClass('required');
        $('#obs_recup_judicial').addClass('valida');
    }else{
        $('.divJudicial').hide();
    	$('#obs_recup_judicial').removeClass('required');
        $('#obs_recup_judicial').removeClass('valida');
    }
}

function controlePix(){
    $('#chave_pix').unmask();
    if ( $( "#ies_pix option:selected" ).text() == 'Telefone'){
        $('#chave_pix').mask("(00) 0000-00009");
    }

    if ( $( "#ies_pix option:selected" ).text() == 'E-mail'){
        
    }

    if ( $( "#ies_pix option:selected" ).text() == 'CPF'){
        $('#chave_pix').mask("000.000.000-00");
    }

    if ( $( "#ies_pix option:selected" ).text() == 'CNPJ'){
        $('#chave_pix').mask('00.000.000/0000-00');
    }
}

function validaPix(){
    if ( $( "#ies_pix option:selected" ).text() == 'Telefone'){
    }

    if ( $( "#ies_pix option:selected" ).text() == 'E-mail'){
        if ( !validaEmail( $('#chave_pix').val() ) ){
            FLUIGC.toast({ title: '',message: 'E-Mail inválido ('+$('#chave_pix').val()+')' , type: 'warning' });
            // $('#chave_pix').val('');
        }
    }

    if ( $( "#ies_pix option:selected" ).text() == 'CPF'){
        if( !validaCPF( $('#chave_pix').val() ) ){
            FLUIGC.toast({ title: '',message: 'CPF inválido.' , type: 'warning' });
            // $('#chave_pix').val('');
        }  
    }

    if ( $( "#ies_pix option:selected" ).text() == 'CNPJ'){
        if( !validaCNPJ( $('#chave_pix').val() ) ){
            FLUIGC.toast({ title: '',message: 'CPF inválido.' , type: 'warning' });
            // $('#chave_pix').val('');
        }
    }
}

// function loadDadosCliente(cod_cliente, view ){

//     loadWindow.show();

//     var camposNaoLimpar = ['descritor','isManager','tipo_cadastro', 'tipo_cadastro_user','task','oldData'];

//     $('.financeiro').show();
    
//     if( view == "S" ){
//     	$('.followup').hide();
//     }
    
//     //Carrega dados Cliente
//     var constraints = new Array();
//     constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente , cod_cliente, ConstraintType.MUST));
//     constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_clientes' , null, ConstraintType.MUST));
//     DatasetFactory.getDataset("selectLogix", null, constraints, null, {
//         success: function(dataSet){
//             // console.log(dataSet.values);
//             if( dataSet != null && dataSet != undefined ){
//                 var data = dataSet.values[0];
//                 $('#oldData').val( JSON.stringify( data ) );
//                 $("input,select,textarea").each(function () {
//                     // console.log('looop  ',$(this).attr( 'id' ), $(this).val(), $(this).attr( 'type' ) );

//                     if( camposNaoLimpar.indexOf(this.id) == -1 && this.id.indexOf('___') == -1  ) {
//                         if ( data[this.id] != undefined && data[this.id] != 'null' && data[this.id] != null ){
//                             if ( $(this).hasClass('decimal-2') ){
//                                 this.value = formatStringValue( data[this.id], 2).trim();
//                             } else if ( $(this).hasClass('data-fluig') && data[this.id] != ''){
//                                 this.value = data[this.id].split('-').reverse().join('/'); // formataData( new Date( data[this.id] ) ).trim();
//                             } else if ( $(this).hasClass('telefone') && data[this.id] != ''){
//                             	var bFone = data[this.id].replace(/[^0-9]/g,'');
//                             	bFone = '('+bFone.substring(0,2)+') '+bFone.substring(2,6)+'-'+bFone.substring(6,11)
//                                 this.value = bFone;
//                             } else {
//                                 this.value = data[this.id].trim();
//                             }                                        
//                         } else {
//                             this.value = '';
//                         }
//                     }
                    
//                 });
                
//                 $('#num_cgc_cpf_matriz').val("");
                
//                 if( $('#ins_estadual').val().trim() == "ISENTO" ){
//                 	$("#isento_ie").prop( "checked", true );
//                 	setIsento( 'isento_ie', 'ins_estadual', 'cod_uni_feder' );
//                 }else{
//                 	if( !validaIE( $('#ins_estadual').val().trim(), $('#cod_uni_feder').val() ) ){
//                 		FLUIGC.toast({ title: '',message: 'Inscrição Estadual inválida.' , type: 'warning' });
//                 		$('#ins_estadual').val("");
//                 	}
//                 	setMaskIE( $('#cod_uni_feder').val().trim(), 'ins_estadual' );
//                 }
                
//                 if( $.isNumeric( $('#num_iden_lograd').val() ) ){
//                 	$('#sem_numero').prop('checked', false);
//                     //$('#num_iden_lograd').val( data.numero );
//                 	setSemNumero( 'sem_numero', 'num_iden_lograd' );
//                 }else{
//                 	$('#sem_numero').prop('checked', true);
//                 	setSemNumero( 'sem_numero', 'num_iden_lograd' );
//                 }
                
//                 if ( $('#task').val() != '5' ){
//                     readOnlyAll('');
//                     disableSeach('');
//                     $('.bt_tbl').hide();
//                 }
                

//                 carregaResponsavel( data['cod_repres'] );

//                 // Carrega Contatos
//                 var constraints = new Array();
//                 constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente , cod_cliente, ConstraintType.MUST));                                
//                 constraints.push(DatasetFactory.createConstraint("table", 'cli_contatos' , null, ConstraintType.MUST));
//                 var ds = DatasetFactory.getDataset("selectLogix", ['num_contato','nom_contato','email','num_telefone'], constraints, ['num_contato'])
                
//                 if ( ds.values.length > 0 ){
//                     for (var i = 0; i < ds.values.length; i++ ){
//                         var seq = wdkAddChild('contatos');
//                         if ( ds.values[i]['email'].trim() == 'null' ) ds.values[i]['email'] = '';
//                         $('#num_contato___'+seq).val( ds.values[i]['num_contato'].trim() );
//                         $('#nom_contato___'+seq).val( ds.values[i]['nom_contato'].trim() );
//                         $('#telefone_contato___'+seq).val( ds.values[i]['num_telefone'].trim() );
//                         $('#email_contato___'+seq).val( ds.values[i]['email'].trim() );
//                     }
//                 }

//                 // Carrega Emails NFE
//                 var constraints = new Array();
//                 constraints.push(DatasetFactory.createConstraint("cliente", cod_cliente , cod_cliente, ConstraintType.MUST));                                
//                 constraints.push(DatasetFactory.createConstraint("table", 'vdp_cli_grp_email' , null, ConstraintType.MUST));
//                 var ds = DatasetFactory.getDataset("selectLogix", ['seq_email','email'], constraints, ['seq_email'])
                
//                 if ( ds.values.length > 0 ){
//                     for (var i = 0; i < ds.values.length; i++ ){
//                         var seq = wdkAddChild('emails_nfe');
//                         $('#id_email___'+seq).val( ds.values[i]['seq_email'].trim() );
//                         $('#email_nfe___'+seq).val( ds.values[i]['email'].trim() );
//                         $('#ies_excluido___'+seq).val( "N" );
//                     }
//                 }

//                 loadDocumentos(data['num_cgc_cpf'], data['nom_cliente'], true );
                
//                 // loadTipoDocumentos(true);
                
//                 // Carrega Grupo Econômico
//                 var constraints = new Array();
//                 constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente , cod_cliente, ConstraintType.MUST));                                
//                 constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_grupo_economico' , null, ConstraintType.MUST));
//                 var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null)
                
//                 if ( ds.values.length > 0 ){
//                     $('#num_cgc_cpf_matriz').val(  ds.values[0]['num_cgc_cpf'] );
//                     for (var i = 0; i < ds.values.length; i++ ){
//                         var seq = wdkAddChild('grp_economico');
//                         $('#cgc_cpf_grp_econ___'+seq).val( ds.values[i]['num_cgc_cpf_grp_econ'].trim() );
//                         $('#cod_cliente_grp_econ___'+seq).val( ds.values[i]['cod_cliente_grp_econ'].trim() );
//                         $('#nom_cliente_grp_econ___'+seq).val( ds.values[i]['nom_cliente_grp_econ'].trim() );
//                     }
//                 }

//             };

//             $('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true,allowZero : true});
            
//             loadWindow.hide();

//         },

//         error: function(jqXHR, textStatus, errorThrown) {
//             console.log(jqXHR, textStatus, errorThrown);
//             loadWindow.hide();
//         }
//     });

// }

// function loadFinanceiroAba(cod_cliente, view ){
	
// 	if( loadFinanc ){
// 		return true;
// 	}
	
//     loadWindow.show();

//     $('.financeiro').show();
    
//     if( view == "S" ){
//     	$('.followup').hide();
//     }
    
//     //Carrega dados Cliente
//     var constraints = new Array();
//     constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente , cod_cliente, ConstraintType.MUST));
//     constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_clientes' , null, ConstraintType.MUST));
//     DatasetFactory.getDataset("selectLogix", null, constraints, null, {
//         success: function(dataSet){
//             // console.log(dataSet.values);
//             if( dataSet != null && dataSet != undefined ){
//                 var data = dataSet.values[0];
                
//                 // Carrega dados financeiro
//                 var constraints = new Array();
//                 constraints.push(DatasetFactory.createConstraint('cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST));
//                 constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_grupo_financeiro', null, ConstraintType.MUST));
//                 var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null);

//                 if ( ds.values.length > 0 ){
//                     for (var i = 0; i < ds.values.length; i++ ){
//                         for ( var j = 0; j < ds.columns.length; j++){
//                             var value = ds.values[i][ ds.columns[j] ];
                            
//                             if ( $('#'+ds.columns[j]).hasClass('decimal-2') ){
//                                 value = formatStringValue( ds.values[i][ ds.columns[j] ], 2).trim();
//                             }
                            
//                             if ( $('#'+ds.columns[j]).hasClass('data-fluig') 
//                               || $('#'+ds.columns[j]).hasClass('data-view') ){
//                             	if( ds.values[i][ ds.columns[j] ] == 'null' )
//                             		value = '';
//                             	else
//                             		value = ds.values[i][ ds.columns[j] ].split('-').reverse().join('/'); //formataData( new Date( ds.values[i][ ds.columns[j] ] ) ).trim();
//                             }

//                             $('#'+ds.columns[j]).val( value );
//                         }
//                     }
//                 }

//             };

//             $('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true,allowZero : true});
            
//             loadFinanc = true;
            
//             loadWindow.hide();

//         },

//         error: function(jqXHR, textStatus, errorThrown) {
//             console.log(jqXHR, textStatus, errorThrown);
//             loadWindow.hide();
//         }
//     });
	
// }


function carregaResponsavel(cod_repres){
    // Carrega Responsável
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("cod_repres", cod_repres , cod_repres, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("ies_responsavel_default", 'on' , 'on', ConstraintType.MUST));                                
    constraints.push(DatasetFactory.createConstraint("table", 'responsavel' , null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("dataset", 'representante' , null, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset("selectPaiFilho", null, constraints, null)

    if ( ds.values.length > 0 ){
        $('#responsavel').val( ds.values[0]['responsavel'] );
    } else {
        $('#responsavel').val('');
    }
}

// function loadDocumentos(num_cgc_cpf, nom_cliente, hide){

//         //Verifica se tem documentos para visualizar
//         var folder = pastaCliente(num_cgc_cpf, nom_cliente );
//         $("input[name^=cod_tipo_documento___]").each(function (index, value) {
            
//             var seq = this.id.split('___')[1];
//             if ( folder != '' ){
//                 var constraints = new Array();
//                 constraints.push( DatasetFactory.createConstraint("parentDocumentId", folder, folder, ConstraintType.MUST) );
//                 constraints.push( DatasetFactory.createConstraint("documentTypeId", this.value, this.value, ConstraintType.MUST) );
//                 constraints.push( DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST) );
//                 constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );
//                 //constraints.push( DatasetFactory.createConstraint("sqlLimit",1, 1, ConstraintType.MUST) );
//                 var ds = DatasetFactory.getDataset("document", null, constraints, null);

//                 if ( ds.values.length == 0) {
//                 	if (hide){
//                     	//$('#seq_doc2___'+seq).parent().parent().parent().hide();
//                       	$('#seq_doc___'+seq).parent().removeClass('btn-success');
//                     }
//                 } else {
//                 	if( ds.values[0]["documentPK.documentId"] == "" ){
//                 		if (hide){
//                         	//$('#seq_doc2___'+seq).parent().parent().parent().hide();
//                           	$('#seq_doc___'+seq).parent().removeClass('btn-success');
//                         }
//                 	}else{
//                 		$('#seq_doc___'+seq).parent().addClass('btn-success');
//                 	}
//                 }

//                 //if (hide) $('#seq_doc2___'+seq).parent().hide();

//             } /*else {
//                 $('#seq_doc2___'+seq).parent().parent().parent().hide();
//             }*/

//         });

//     // }
// }

function setSemNumero( idCampo, idCampoNum ){
	
	var seq = idCampo.split('___')[1];
	var cpl = '';
	if( seq ){
		cpl = '___'+seq;
	}
	
	if ( $('#' + idCampo).is(':checked') ){
		$('#'+idCampoNum+cpl).attr( 'readonly', true );
		$('#'+idCampoNum+cpl).attr('type', 'text');
		$('#'+idCampoNum+cpl).css('background-color' , '#DEDEDE');
		$('#'+idCampoNum+cpl).val('S/N');
	}else{
		$('#'+idCampoNum+cpl).removeAttr( 'readonly');
		$('#'+idCampoNum+cpl).attr('type', 'number');
		$('#'+idCampoNum+cpl).css('background-color' , '#FFFFFF');
		$('#'+idCampoNum+cpl).val();
	}
}

function setUpper() {

    $(".upper").keypress(
        function (e) {
            var chr = String.fromCharCode(e.which);
            var name_campo;
            name_campo = $(this).attr("name");

            if ("'\"^¨´`\|~".indexOf(chr) > 0) {
                return false;
            }
        });

    $(".upper").keyup(function () {
        $(this).val($(this).val().toUpperCase());
    });
}

function setIsento( idCampo, idCampoIE, idCampoUF ){
	//não controlado mais 'ISENTO'
	return true;
/*	var seq = idCampo.split('___')[1];
	var cpl = '';
	if( seq ){
		cpl = '___'+seq;
	}
	
	// console.log( 'IE_________' );
	if ( $("#"+idCampo).is(':checked') ){
		$('#'+idCampoIE+cpl).unmask();
		$('#'+idCampoIE+cpl).attr( 'readonly', true );
		$('#'+idCampoIE+cpl).css('background-color' , '#DEDEDE');
		$( '#'+idCampoIE+cpl).val('ISENTO');
		
		clearTables('end_entrega');
		
	}else{
		$('#'+idCampoIE+cpl).unmask();
		$('#'+idCampoIE+cpl).removeAttr( 'readonly' );
		$('#'+idCampoIE+cpl).css('background-color' , '#FFFFFF');
		if ( $( '#'+idCampoIE+cpl ).val() == 'ISENTO' ){
			console.log( 'IE_________' );
			$( '#'+idCampoIE+cpl).val('');
			setMaskIE( $('#'+idCampoUF+cpl).val(), idCampoIE+cpl );
		}else if ( $( '#'+idCampoUF+cpl ).val() != '' ){
			var tmp = $( '#'+idCampoIE+cpl ).val();
			setMaskIE( $('#'+idCampoUF+cpl ).val(), idCampoIE+cpl );
			console.log( 'IE_________'+tmp );
			$( '#'+idCampoIE+cpl ).val( tmp );
		}
		
	}*/
}

// function setIE(){
// 	if( $('#ins_estadual').val() != "" 
//    	 && !validaIE( $('#ins_estadual').val(), $('#cod_uni_feder').val() ) ){
// 		FLUIGC.toast({ title: '',message: 'Inscrição Estadual inválida.' , type: 'warning' });
// 	}
// }


function dadosCEP(id){
	
    var cpl = '';
    var seq = id.split('___')[1];
    if( seq != undefined ){
    	seq = '___'+seq
    }else{
    	seq = '';
    }
    if ( id.split('_')[1] ) cpl = '_' + id.split('_')[1];
    cpl = cpl+seq;

    if ( $('#cod_cidade_ibge' + cpl).val() != '' ){
        FLUIGC.message.confirm({
            message: 'Deseja atualizar o cep?',
            // title: 'Remove gallery',
            labelYes: 'Sim',
            labelNo: 'Não'
        }, function(result, el, ev) {
            if ( result ){
                buscaCEP( $('#cep' + cpl).val(), {
                    success: function(data){
                        $('#cod_cidade_ibge' + cpl).val( data.ibge );
                        $('#bairro' + cpl).val( data.bairro.toUpperCase() );
                        if( $("#cod_pais").val() )
                        if( $("#cod_pais").val() == "001" ){
                        	zoom('zoom_cidade' + cpl, 'cod_cidade_ibge' + cpl);
                        }
                        
                        var tipo = buscaTipoLogradouro(data.logradouro.toUpperCase());	
                        if( tipo.status ){
                            $("#tip_logradouro"+cpl).val( tipo.tip_logradouro.trim() );
                            $("#desc_logradouro"+cpl).val( tipo.des_logradouro );
                            
                            if( tipo.logradouro.length > 20 ){
                            	FLUIGC.toast({ title: '',message: 'Logradourou superior a 20 characteres. ('+tipo.logradouro+') Endereço foi truncado, favor revisar.' , type: 'danger' });
                            }                            
                            $("#endereco"+cpl).val( tipo.logradouro.substring(0,20) );
                        }                
                    },    
                    error: function(error){
                        console.log(error);
                    }
                });
            }
        });
    } else {
        buscaCEP( $('#cep' + cpl).val(), {
            success: function(data){
                $('#cod_cidade_ibge' + cpl).val( data.ibge );
                $('#bairro' + cpl).val( data.bairro.toUpperCase() );
                zoom('zoom_cidade' + cpl, 'cod_cidade_ibge' + cpl);
                
                var tipo = buscaTipoLogradouro(data.logradouro.toUpperCase());	
                if( tipo.status ){
                    $("#tip_logradouro"+cpl).val( tipo.tip_logradouro.trim() );
                    $("#desc_logradouro"+cpl).val( tipo.des_logradouro );
                    if( tipo.logradouro.length > 20 ){
                    	FLUIGC.toast({ title: '',message: 'Logradourou superior a 20 characteres. ('+tipo.logradouro+') Endereço foi truncado, favor revisar.' , type: 'danger' });
                    }                            
                    $("#endereco"+cpl).val( tipo.logradouro.substring(0,20) );
                    
                }                
            },    
            error: function(error){
                console.log(error);
            }
        });
    }
}


function consultaCpfCnpj() {

   /* if ( $('#ies_operacao').val() != '' ){
        return false;
    } */

  /*  if ( $('#ies_nacional_internacional').val() == 'I' ){
        return false;
    } */

    loadWindow.show();

    var cgc_cpf = "";
        
    if ( !$('#num_cgc_cpf').val() ) {
        FLUIGC.toast({ title: '',message: 'Informe CPF ou CPNJ!' , type: 'warning' });
        if ( $('#ies_nacional_internacional').val() == 'N' ) $('.divIesOperacao').hide();
        $('.menu').hide();
        loadWindow.hide();
        return false;
    }

    if( $('#ies_cpf_cnpj').val() == "CPF" ){
    	cgc_cpf = $("#num_cgc_cpf").val().replace('-','/0000-');
	    if( $("#ies_nacional_internacional").val() != "I" && !validaCPF( $('#num_cgc_cpf').val() ) ){
	    	FLUIGC.toast({ title: '',message: 'CPF inválido.' , type: 'warning' });
	        $('.menu').hide();
	        $('.divIesOperacao').hide();
	        loadWindow.hide();
	        return false;
	    }
	}
	
	if( $('#ies_cpf_cnpj').val() == "CNPJ" ){
		cgc_cpf = "0" + $("#num_cgc_cpf").val();
	    if( $("#ies_nacional_internacional").val() != "I" && !validaCNPJ( $('#num_cgc_cpf').val() ) ){
	    	FLUIGC.toast({ title: '',message: 'CNPJ inválido.' , type: 'warning' });
	        $('.menu').hide();
	        $('.divIesOperacao').hide();
	        loadWindow.hide();
	        return false;
	    }
    }
    
    if( $('#num_cgc_cpf').val() != "00.000.000/0000-00" ){
	    var ct = new Array();
		ct.push(DatasetFactory.createConstraint('dataset', 			'cliente_fornecedor',		null, 						ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('w.status', 		'0', 						'0', 						ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('num_cgc_cpf', 		$('#num_cgc_cpf').val(), 	$('#num_cgc_cpf').val(), 		ConstraintType.MUST));
		var fd = new Array();
		var od = new Array();
		var ds = DatasetFactory.getDataset('selectDataSetProces', fd, ct, od);
		if( ds.values.length > 0 ){
			alert( " CPF/CNPJ "+ $('#num_cgc_cpf').val() +" já possui um processo de cadastro em aberto! ("+ ds.values[0]["num_proces"] +" - "+ ds.values[0]["nome_user_requisit"] +") " );
			$('#cod_cliente_fornecedor').val( "" );
			setTimeout("$('#num_cgc_cpf').focus();", 1);
	        $('.menu').hide();
	        $('.divIesOperacao').hide();
			loadWindow.hide();
			return false;
		}
    }
    
    var cod_cliente = cgc_cpf.replace(/\D/g,'');

    if ( $('#cod_cliente_fornecedor').val() ) var cod_cliente = $('#cod_cliente_fornecedor').val();

	$('#ies_achou_cli_fornec').val("N");
	
	if( cod_cliente == '000000000000000' ){
		$('#ies_operacao').val('N');
		$('#ies_operacao').removeAttr('readonly');
		loadWindow.hide();
		return true;
	}
	
    var constraints = new Array();
    if( $('#cod_cliente_fornecedor').val() ){
    	constraints.push(DatasetFactory.createConstraint("___in___cod_cliente_fornecedor", cod_cliente , null, ConstraintType.MUST));
    }else{
    	constraints.push(DatasetFactory.createConstraint("___in___num_cgc_cpf", cgc_cpf , null, ConstraintType.MUST));
    }
    constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_cliente_fornecedor' , null, ConstraintType.MUST));
    DatasetFactory.getDataset("selectLogix", null, constraints, null, {
        success: function(data) {
            if( data.values.length > 0 ){
            	
            	if( $("#ies_nacional_internacional").val() != data.values[0]["ies_pais"] ){
            		$('#num_cgc_cpf').val("");
            		loadWindow.hide();
            		return false;
            	}
            	
            	$('#ies_achou_cli_fornec').val("S");
            	if( $('#ies_operacao').val() != "I" ){
            		$('#ies_operacao').val('A');
            	}
                //ies_sit_cliente, ies_sit_fornecedor
                readOnlyAll('.header');
                $("#ies_operacao option[value='I']").prop('disabled', false);
                $('#ies_operacao').removeAttr('readonly');
                
                $('#cod_cliente_fornecedor').val( data.values[0]["cod_cliente_fornecedor"] );
                
                $('#ies_sit_cliente').val( data.values[0]["ies_sit_cliente"] );
                $('#ies_sit_fornecedor').val( data.values[0]["ies_sit_fornecedor"] );
                
                if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" ){
            		$('#ies_sit_cliente').val( 'A' );
            	}else{
            		$('#ies_sit_fornecedor').val( 'A' );
            	}
                
                cod_cliente = data.values[0]["cod_cliente_fornecedor"];

                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint("num_cgc_cpf", cod_cliente , null, ConstraintType.MUST));
                DatasetFactory.getDataset("dsk_consulta_cpf_cnpj", null, constraints, null, {
                    success: function(data) {
                        if( data.values.length > 0 && data.values[0]['status'] == '100' ){
                            var json = JSON.parse( data.values[0]['retorno'] );
                            dadosCliente(json).then( (retorno) => {
                                loadWindow.hide();
                            });
                            //**//
                        }
                    },
                    error: function(error){
                        console.log(error);
                        loadWindow.hide();
                    }
                } );
            } else {
            	if( $("#ies_nacional_internacional").val() == "I" ){
            		$('#num_cgc_cpf').val("");
            		loadWindow.hide();
            		return false;
            	}
                $('#ies_operacao').val('N');
                if( $('#ies_cpf_cnpj').val() == "CNPJ" ){
                	
                	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" ){
                		$('#ies_sit_cliente').val( 'A' );
                		$('#ies_sit_fornecedor').val( 'I' );
                	}else{
                		$('#ies_sit_cliente').val( 'S' );
                		$('#ies_sit_fornecedor').val( 'A' );
                	}
                	
                	loadReceita();
                	
                }else{
                	if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "C" ){
                		$('#ies_sit_cliente').val( 'A' );
                		$('#ies_sit_fornecedor').val( 'I' );
                	}else{
                		$('#ies_sit_cliente').val( 'S' );
                		$('#ies_sit_fornecedor').val( 'A' );
                	}
                	loadWindow.hide();
                }
                readOnlyAll('.header');
                $('#ies_operacao').removeAttr('readonly');
            }
            // setTipoOperacao();
            //loadWindow.hide();
            $('.divIesOperacao').show();
            //$('#ies_operacao option').prop('disabled', false);
            $('.menu').show();
            if( $('#conflito_interesse').val() == "" ){
            	$('#conflito_interesse').val("N");
            }
        }
    });
}

function loadReceita(){
	
	cnpj_receita( $('#num_cgc_cpf').val(), {
        success: function(data){
        	
        	if( data.cep != "" ) $('#cep').val( data.cep.replace('.','') );
        	if( data.bairro != "" ) $('#bairro').val( data.bairro.toUpperCase() );
        	if( data.logradouro != "" ){
        		if( data.logradouro.length > 20 ){
                	FLUIGC.toast({ title: '',message: 'Logradourou superior a 20 characteres. ('+data.logradouro+') Endereço foi truncado, favor revisar.' , type: 'danger' });
                }
        		$('#endereco').val( data.logradouro.substring(0,20).toUpperCase() );
        	}
        	if( data.numero != "" ) $('#numero').val( data.numero );
        	if( data.complemento != "" ) $('#complemento').val( data.complemento );
            if( data.fantasia != "" ) $('#raz_social_reduz').val( data.fantasia );
            if( data.nome != "" ) $('#raz_social').val( data.nome );
            if( data.abertura != "" ) $('#dat_abert').val( data.abertura.split('/').reverse().join('-') );

            if( data.situacao_especial == "RECUPERACAO JUDICIAL" ){
            	$('#ies_recup_judicial').val( "S" );
            }else{
            	$('#ies_recup_judicial').val( "N" );
            }
            controleRecupJudicial();
            
            if( data.situacao != "ATIVA" ){
            	FLUIGC.toast({ title: '',message: 'CNPJ em situação '+data.situacao , type: 'danger' });
            }
            
            /*if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
                herdaEnderecoCliente();
            }*/

            buscaCEP(data.cep, {
                success: function(data){
                    console.log(data);
                    
                    $('#cod_cidade_ibge').val( data.ibge );
                    if ( data.bairro ) $('#bairro').val( data.bairro.toUpperCase() );
                    zoom('zoom_cidade', 'cod_cidade_ibge');
                    
                    var tipo = buscaTipoLogradouro(data.logradouro.toUpperCase());	
                    if( tipo.status ){
                        $("#tip_logradouro").val( tipo.tip_logradouro.trim() );
                        $("#desc_logradouro").val( tipo.des_logradouro );
                        
                        if( tipo.logradouro.length > 20 ){
                        	FLUIGC.toast({ title: '',message: 'Logradourou superior a 20 characteres. ('+tipo.logradouro+') Endereço foi truncado, favor revisar.' , type: 'danger' });
                        }                            
                        $("#endereco").val( tipo.logradouro.substring(0,20) );
                        //$("#endereco").val( tipo.logradouro );
                    }

                    /*
                    if ( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == 'C' ){
                        herdaEnderecoCliente();

                        zoom('zoom_cidade_entrega', 'cod_cidade_ibge_entrega');
                        zoom('zoom_cidade_cobranca', 'cod_cidade_ibge_cobranca');
                    }*/

                    loadWindow.hide();
                    // setMaskIE( $('#cod_uni_feder').val(), 'ins_estadual' );
                },

                error: function(error){
                    console.log(error);
                    loadWindow.hide();
                }
            });

            loadWindow.hide();

        },
        error: function(error){
            console.log(error);
            $('.menu').hide();
            $("#num_cgc_cpf").prop("readonly",false);
            loadWindow.hide();
        }
    } );
	
	
}

function setTipoOperacao(){
	// habilitaEdicao("#ies_operacao");
	if( $('#num_cgc_cpf').val() != "" )
		$('.divIesOperacao').show();
	// if( $('#ies_achou_cli_fornec').val() == "N" ){
	// 	 readOnlyAll('#ies_operacao');
	// }else{
	// 	$('#novo').prop('disabled', true);
	// }
	if( $('#ies_operacao').val() == "I" ){
		readOnlyAll('');
		$('#obs_hist').attr("readonly",false);
		if( ['0','1'].indexOf( $("#task").val() ) >= 0 ){
			$('#obs_hist').addClass('required');
			$('#obs_hist').addClass('valida');
		}
	}
	if( $('#ies_operacao').val() == "N"
	 && $('#num_cgc_cpf').val() == ""
     && $('#ies_nacional_internacional').val() == "I"  ){
		if( $('#ies_cpf_cnpj').val() == "CPF" ){
			$('#num_cgc_cpf').val("000.000.000-00");
			
		}
		if( $('#ies_cpf_cnpj').val() == "CNPJ" ){
			$('#num_cgc_cpf').val("00.000.000/0000-00");
		}
		readOnlyAll("#num_cgc_cpf");
		$("#num_cgc_cpf").attr('readonly',true);
	}
	
	if( ( $('#ies_operacao').val() == "N" || $('#ies_operacao').val() == "" ) 
	 && $('#ies_nacional_internacional').val() == "I"  ){
		$(".divCpfCnpj").hide();
	}else if( $('#ies_tipo_operacao').val() == "" || $('#ies_nacional_internacional').val() == "" ){
		$(".divCpfCnpj").hide();
	}else{
		$(".divCpfCnpj").show();
	}
	
	if( $('#ies_operacao').val() != "" ){
		readOnlyAllK(true,".cabecalho");
	}

}

function setIEendereco( id ){
	
	var seq = id.split("___")[1];
	
		if( $('#ie_entrega___'+seq).val() == "" 
		 && $('#desc_logradouro_entrega___'+seq).val() == $('#desc_logradouro').val()
		 && $('#cep_entrega___'+seq).val() == $('#cep').val()
		 && $('#endereco_entrega___'+seq).val() == $('#endereco').val()
		 && $('#numero_entrega___'+seq).val() == $('#numero').val()
		 && $('#bairro_entrega___'+seq).val() == $('#bairro').val()
		 && $('#cod_cidade_entrega___'+seq).val() == $('#cod_cidade').val() ){

		   		$('#ie_entrega___'+seq).val( $('#ins_estadual').val( ) );
			 	
	}
}

function dadosCliente( json ){
    return new Promise( (resolve, reject) => {
        console.log(json);

       /* var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("___in___cod_cliente_fornecedor", json['cod_cliente'] , json['cod_cliente'] , ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_cliente_fornecedor_cpl' , null, ConstraintType.MUST));
        DatasetFactory.getDataset("selectLogix", null, constraints, null, {
            success: function (data){
                if( data.values.length > 0 ){
                    console.log(data.values);

                    var ies_pix = data.values[0]["tipo_chave_pix"];
                    if ( data.values[0]["tipo_chave_pix"] == '03' ){
                        if ( data.values[0]["chave_pix"].trim().length > 11 ){
                            var ies_pix = '06'
                        }
                    }
                    $('#ies_pix').val( ies_pix );
                    $('#chave_pix').val( data.values[0]["chave_pix"].trim() );
                    $('#categoria_cnh').val( parseFloat( data.values[0]["categoria_sefip"] ) );
                    $('#pis').val( data.values[0]["pis"].trim() );
                    $('#ies_tip_conta').val( data.values[0]["tipo_conta"].trim() );

                    $('#ies_cpf_cnpj_cobranca').val(ies_fis_juridica);
                    //controleCpfCnpjEndereco('ies_cpf_cnpj_cobranca');
                    resolve();
                }
            }
        });*/

        $('#numero').val( json["num_iden_lograd"] );
        
        if ( json['dat_fundacao'] ){
            var dataCad = json['dat_fundacao'].split('T')[0]
        } else {
            var dataCad = json['dat_cadastro'].split('T')[0];
        }

        $('#dat_abert').val( dataCad );
        $('#dat_cadastro').val( json['dat_cadastro'].split('T')[0].split('-').reverse().join('/') );
        $('#dat_atualiz').val( json['dat_atualiz'].split('T')[0].split('-').reverse().join('/') );
        
        $('#cep').val( json["cod_cep"].replace(/[\.,\-]/g,'').replace(/(\d{2})(\d{3})(\d{3})/, '$1$2-$3') );

     	 var ctt = new Array(); 
		 
		 if( tipoDeParaOper[ $('#ies_tipo_operacao').val() ] == "T" ){
			 ctt.push( DatasetFactory.createConstraint("ies_tip_fornec",  "2",  "2", ConstraintType.MUST) );
		 }else{
			 ctt.push( DatasetFactory.createConstraint("ies_tip_fornec",  json['ies_tip_fornec'],  json['ies_tip_fornec'], ConstraintType.MUST) );			 
		 }
		 
	     var dst = DatasetFactory.getDataset("tipo_fornecedor", null, ctt, null);
		 if( dst.values.length > 0 ) {
			 $('#ies_tip_fornec').val( dst.values[0]["documentid"] );
		 }	
        
		 $('#xpednitemped').val( json['ies_tip_fornec'] );
        
        for( var x = 0; x < json["cli_end_ent"].length; x++ ){
        	
        	if( json["cli_end_ent"][x]["tip_endereco_end_cob"] == "E" ){
        		var row = wdkAddChild( "end_entrega" );
        		$('.cep').mask("99999-999");
                $('#sequencia_end_entrega___'+row).val( json["cli_end_ent"][x]["sequencia_end_cob"] );
                //$('#cnpj_entrega___'+row).val( json["cli_end_ent"][x]["num_cgc"] );
                //$('#ie_entrega___'+row).val( json["cli_end_ent"][x]["ins_estadual"] );
                $('#tip_logradouro_entrega___'+row).val( json["cli_end_ent"][x]["tip_logradouro_end_cob"] );
                zoom('zoom_logradouro_entrega___'+row, 'tip_logradouro_entrega___'+row);
                $('#endereco_entrega___'+row).val( json["cli_end_ent"][x]["logradouro_end_cob"] );
                $('#numero_entrega___'+row).val( json["cli_end_ent"][x]["num_iden_lograd_end_cob"] );
                $('#complemento_entrega___'+row).val( json["cli_end_ent"][x]["complemento_endereco_end_cob"] );
                $('#bairro_entrega___'+row).val( json["cli_end_ent"][x]["bairro_cobr_entga"] );
                $('#cod_cidade_entrega___'+row).val( json["cli_end_ent"][x]["cod_cidade_end_cob"] );
                zoom('zoom_cidade_entrega___'+row, 'cod_cidade_entrega___'+row);
                $('#cep_entrega___'+row).val( json["cli_end_ent"][x]["cod_cep_end_cob"].replace(/[\.,\-]/g,'').replace(/(\d{2})(\d{3})(\d{3})/, '$1$2-$3') );
                var ies_fis_juridica = 'CNPJ';
                if( json["cli_end_ent"][x]["num_cgc"] != null && json["cli_end_ent"][x]["num_cgc"] != undefined ){
	                if ( json["cli_end_ent"][x]["num_cgc"].indexOf('/0000') != -1 ) {
	                    ies_fis_juridica = 'CPF';
	                }
                }
                $('#ies_cpf_cnpj_entrega___'+row).val(ies_fis_juridica);
                controleCpfCnpjEndereco('ies_cpf_cnpj_entrega___'+row);
                                
                $('#ie_entrega___'+row).val( json["cli_end_ent"][x]["ins_estadual"] )
                
                /*
            	if( $('#ie_entrega___'+row).val() == "" 
            	 && $('#cep_entrega___'+row).val() == json["cod_cep"]
            	 && $('#endereco_entrega___'+row).val() == json["logradouro"]
            	 && $('#numero_entrega___'+row).val() == json["num_iden_lograd"]
            	 && $('#bairro_entrega___'+row).val() == json["BAIRRO"]
            	 && $('#cod_cidade_entrega___'+row).val() == json["cod_cidade"] ){            		
            		$('#ie_entrega___'+row).val( json["ins_estadual"] );
           		}
                */
        	}
        	if( json["cli_end_ent"][x]["tip_endereco_end_cob"] == "C" ){
                $('#sequencia_end_cobranca').val( json["cli_end_ent"][x]["sequencia_end_cob"] );
                //$('#cnpj_cobranca').val( json["cli_end_ent"][x]["num_cgc"] );
                //$('#ie_cobranca').val( json["cli_end_ent"][x]["ins_estadual"] );
                $('#tip_logradouro_cobranca').val( json["cli_end_ent"][x]["tip_logradouro_end_cob"] );
                zoom('zoom_logradouro_cobranca', 'tip_logradouro_cobranca');
                $('#endereco_cobranca').val( json["cli_end_ent"][x]["logradouro_end_cob"] );
                $('#numero_cobranca').val( json["cli_end_ent"][x]["num_iden_lograd_end_cob"] );
                $('#complemento_cobranca').val( json["cli_end_ent"][x]["complemento_endereco_end_cob"] );
                if( json["cli_end_ent"][x]["bairro_cobr_entga"] == "" || json["cli_end_ent"][x]["bairro_cobr_entga"] == null ){
                	$('#bairro_cobranca').val("CENTRO");
                }else{
                	$('#bairro_cobranca').val( json["cli_end_ent"][x]["bairro_cobr_entga"] );
                }
                $('#cod_cidade_cobranca').val( json["cli_end_ent"][x]["cod_cidade_end_cob"] );
                zoom('zoom_cidade_cobranca', 'cod_cidade_cobranca');
                $('#cep_cobranca').val( json["cli_end_ent"][x]["cod_cep_end_cob"].replace(/[\.,\-]/g,'').replace(/(\d{2})(\d{3})(\d{3})/, '$1$2-$3') );
                var ies_fis_juridica = 'CNPJ';
                if( json["cli_end_ent"][x]["num_cgc"] != null && json["cli_end_ent"][x]["num_cgc"] != undefined ){
	                if ( json["cli_end_ent"][x]["num_cgc"].indexOf('/0000') != -1 ) {
	                    ies_fis_juridica = 'CPF';
	                }
                }
                $('#ies_cpf_cnpj_cobranca').val(ies_fis_juridica);
                //controleCpfCnpjEndereco('ies_cpf_cnpj_cobranca');
        	}
            
        }   

        if( json["cli_canal_venda"].length > 0 ){
        	$('#cod_tip_carteira').val( json["cli_canal_venda"][0]["cod_tip_carteira"] );
        	$('#cod_repres').val( json["cli_canal_venda"][0]["cod_nivel_"+json["cli_canal_venda"][0]["ies_nivel"].replace('0','') ] );
        	if( $('#cod_repres').val() ){
        		zoom('bt_representante','cod_repres');
        	}
        }
        
        $('#nom_contao_comercial').val( json["nom_contato"] );
        $('#classe').val( json["cod_class"] );
        $('#email2_contato_comercial').val( json["email_secund"] );
        $('#cod_tip_cliente').val( json["ies_tip_cliente"] );
        $('#tip_logradouro').val( json["tip_logradouro"] );
        zoom('zoom_logradouro','tip_logradouro');
        $('#uf').val( json["cod_uni_feder"] );
        if( json['num_agencia'] ){
        	$('#agencia').val( json['num_agencia'].split('-')[0] );
        	if( json['num_agencia'].split('-')[1] != undefined ){
        		$('#dig_agencia').val( json['num_agencia'].split('-')[1] );
        	}
        }
        if( json['num_conta_banco'] ){
        	$('#conta_corrente').val( json["num_conta_banco"].split('-')[0] ),
        	$('#dig_conta').val( json["num_conta_banco"].split('-')[1] );
        }
        if( json["cod_banco"] != "" && json["cod_banco"] != "0" && json["cod_banco"] != null ){
        	$('#num_banco').val( json["cod_banco"]+"" );
            zoom('zoom_banco', 'num_banco');
        }
        $('#pagto_deposito_credito').val( json["ies_dep_cred"] );
        $('#raz_social_reduz').val( json["nom_reduzido"] );
        $('#ins_estadual').val( json["ins_estadual"] );
        //$('#cod_pais').val( json["cod_pais"] );
        $('#cod_cidade').val( json["cod_cidade"]);
        zoom('zoom_cidade', 'cod_cidade');
        $('#email2_contato_comercial').val( json["correi_eletr_secd"] );
        //$('#cod_pais').val( json["pais_nascimento"] );
        $('#email_contato_comercial').val( json["e_mail"] );
        $('#raz_social').val( json["razao_social"] );
        $('#raz_social').val( json["nom_cliente"] );
        $('#num_ident_fiscal').val( json["num_inscr_inss"] );
        $('#org_emissor_uf').val( json["cod_org_emis"] );
        $('#cnh').val( json['num_cart_motorista'] );
        $('#cod_cbo').val( json['num_cbo']);
        zoom('zoom_cbo', 'cod_cbo');
        //$('#justificativa').val( json["tex_obs"] );
        $('#bairro').val( json["BAIRRO"] );
        $('#raz_social_reduz').val( json["nom_guerra"] );
        $('#raz_social_reduz').val( json["razao_social_reduz"] );
        $("#endereco").val( json["logradouro"] );
        //$('#justificativa').val( json["tex_observ"] );
        $('#complemento').val( json["COMPL_ENDERECO"] );
        //$('#cod_cidade').val( json["cod_cidade_pgto"] );
        if( json["cod_tip_cli"] == 'null' || json["cod_tip_cli"] == null || json["cod_tip_cli"] == undefined ){
        	$('#cod_tip_cliente').val( "98" );
        }else{
        	$('#cod_tip_cliente').val( json["cod_tip_cli"] );
        }
        zoom('zoom_tipo_cliente','cod_tip_cliente');
        $('#email_contato_comercial').val( json["correio_eletronico"] );
        $('#raz_social_reduz').val( json["raz_social_reduz"] );
        $('#raz_social').val( json["raz_social"] );
        $('#telefone_contato_comercial').val( json["num_telefone"] );
        $('#bairro').val( json["den_bairro"] );
        $('#celular_contato_comercial').val( json["num_tel_celular"] );
        $('#email3_contato_comercial').val( json["correi_eletr_venda"] );
        $('#simples_nacional').val( json["eh_simples_nacional"] );
        $('#contibuinte_ipi').val( json["ies_contrib_ipi"] );
        
        $('#cod_portador').val( json["cod_portador"] );
        $('#ies_tip_portador').val( json["ies_tip_portador"] );
        zoom('zoom_portador','cod_portador');
        
        $('#cod_mercado').val( json["cod_mercado"] );
        $('#cod_continente').val( json["cod_continente"] );
        $('#cod_regiao').val( json["cod_regiao"] );

        $('#gera_ap').val( json["ies_gera_ap"] );
        $('#forma_pagamento').val( json["ies_gera_ap"] );
        
        if( json["sup_par_fornecedor"].length > 0 ){
        	for( var i = 0; i < json["sup_par_fornecedor"].length; i++ ){
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'lote_pagamento_forne' ){
        			$('#cod_lote_pgto').val( json["sup_par_fornecedor"][i]["parametro_val"] );
        			if( $('#cod_lote_pgto').val() ){
        				zoom('zoom_lote_pgto','cod_lote_pgto');
        			}
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'subtipo_fornecedor' ){
        			$('#sup_subtipo_fornec').val( (json["sup_par_fornecedor"][i]["parametro_numerico"]+"").split(".")[0] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'num_inscr_inss_2' ){
        			$('#pis').val( json["sup_par_fornecedor"][i]["parametro_texto"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'tipo_conta_bc' ){
        			$('#ies_tip_conta').val( json["sup_par_fornecedor"][i]["parametro_texto"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'cred_pis_cofins' ){
        			$('#credito_presumido').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ind_ret_pis_cof' ){
        			$('#tipo_retencao').val( json["sup_par_fornecedor"][i]["parametro_texto"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_contrib_csl' ){
        			$('#retencao_csl').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_contrib_cofins' ){
        			$('#retencao_cofins').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'retencao_iss' ){
        			$('#retem_iss').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_contrib_pis' ){
        			$('#retencao_pis').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_reside_exterior' ){
        			$('#reside_exterior').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_dispensado_nif' ){
        			$('#dispensa_nif').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_pais_dispens_nif' ){
        			$('#pais_dispensa_nif').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		

        		if( json["sup_par_fornecedor"][i]["parametro"] == 'dat_ini_utiliz_nf-e' ){
        			if( json["sup_par_fornecedor"][i]["parametro_dat"] != null ){
        				$('#data_nfe').val( json["sup_par_fornecedor"][i]["parametro_dat"].split("T")[0].split("/").reverse().join("-") );
        			}
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'ies_utiliza_NFe' ){
        			$('#utiliza_nfe').val( json["sup_par_fornecedor"][i]["parametro_booleano"] );
        		}
        		if( json["sup_par_fornecedor"][i]["parametro"] == 'modelo_nf_fornec' ){
        			$('#modelo_nf_fr').val( json["sup_par_fornecedor"][i]["parametro_texto"] );
        		}
        	}
        }
               
        if( json["vdp_cli_parametro"].length > 0 ){
        	for( var i = 0; i < json["vdp_cli_parametro"].length; i++ ){
        		
        		if( json["vdp_cli_parametro"][i]["parametro"] == 'xpednitemped' ){
        			if( json["vdp_cli_parametro"][i]["val_parametro"] == "S" ){
        				$('#xpednitemped').val( "S" );
        			}else{
        				$('#xpednitemped').val( "N" );
        			}
        		}
        		
        	}
        }
     // Carrega Emails NFE
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("cliente", $("#cod_cliente_fornecedor").val(), $("#cod_cliente_fornecedor").val(), ConstraintType.MUST));                                
        constraints.push(DatasetFactory.createConstraint("table", 'vdp_cli_grp_email' , null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset("selectLogix", ['grupo_email','seq_email','email'], constraints, ['seq_email'])
        
        if ( ds.values.length > 0 ){
            for (var i = 0; i < ds.values.length; i++ ){
                var seq = wdkAddChild('emails_nfe');
                $('#grupo_email___'+seq).val( ds.values[i]['grupo_email'].trim() );
                $('#id_email___'+seq).val( ds.values[i]['seq_email'].trim() );
                $('#email_nfe___'+seq).val( ds.values[i]['email'].trim() );
                $('#ies_excluido___'+seq).val( "N" );
            }
        }
        
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("cod_cliente_fornecedor", $("#cod_cliente_fornecedor").val(), $("#cod_cliente_fornecedor").val(), ConstraintType.MUST));                                
        constraints.push(DatasetFactory.createConstraint("dataset", "cliente_fornecedor", "cliente_fornecedor", ConstraintType.MUST));                                
        constraints.push(DatasetFactory.createConstraint("consulta_AGRISK", "", "", ConstraintType.MUST_NOT));                                
        var ds = DatasetFactory.getDataset("selectDataSet", ['cod_cliente_fornecedor'], constraints, null)
        
        if( ds.values.length > 0 ){
        	$("#iesAGRISK").val("S");
        }else{
        	$("#iesAGRISK").val("N");
        }
        
        validaCampoNumero();
        validaCampoIsento();
        
        required();
        
        if( $("#ies_nacional_internacional").val() == 'N' && $('#ies_cpf_cnpj').val() == "CNPJ" ){
        	loadReceita();
        }
        
    });
}

function herdaEnderecoCliente(){
    $('#cnpj_cobranca').val( $('#num_cgc_cpf').val() );
    $('#cep_cobranca').val( $('#cep').val().replace(/[\.,\-]/g,'').replace(/(\d{2})(\d{3})(\d{3})/, '$1$2-$3') );
    $('#tip_logradouro_cobranca').val( $('#tip_logradouro').val() );
    $('#desc_logradouro_cobranca').val( $('#desc_logradouro').val() );
    $('#bairro_cobranca').val( $('#bairro').val() );
    $('#endereco_cobranca').val( $('#endereco').val() );
    $('#numero_cobranca').val( $('#numero').val() );
    $('#complemento_cobranca').val( $('#complemento').val() );
    // $('#cod_cidade_cobranca').val( $('#cod_cidade').val() );
    $('#cod_cidade_ibge_cobranca').val( $('#cod_cidade_ibge').val() );
    // $('#den_cidade_cobranca').val( $('#den_cidade').val() );    
    // $('#uf_cobranca').val( $('#uf').val() );

    $('#cnpj_entrega').val( $('#num_cgc_cpf').val() );
    $('#cep_entrega').val( $('#cep').val().replace(/[\.,\-]/g,'').replace(/(\d{2})(\d{3})(\d{3})/, '$1$2-$3') );
    $('#tip_logradouro_entrega').val( $('#tip_logradouro').val() );
    $('#desc_logradouro_entrega').val( $('#desc_logradouro').val() );
    $('#bairro_entrega').val( $('#bairro').val() );
    $('#endereco_entrega').val( $('#endereco').val() );
    $('#numero_entrega').val( $('#numero').val() );
    $('#complemento_entrega').val( $('#complemento').val() );
    // $('#cod_cidade_entrega').val( $('#cod_cidade').val() );
    $('#cod_cidade_ibge_entrega').val( $('#cod_cidade_ibge').val() );
    // $('#den_cidade_entrega').val( $('#den_cidade').val() );    
    // $('#uf_entrega').val( $('#uf').val() );
}

function buscaTipoLogradouro(logradouro){
	console.log('logradouro...',logradouro);
	var tipo = logradouro.split(' ')[0];
	
	var constraints = new Array();
	var fields = new Array();
	//constraints.push(DatasetFactory.createConstraint("des_logradouro", tipo, tipo, ConstraintType.SHOULD));
	constraints.push(DatasetFactory.createConstraint("tip_logradouro_busca", tipo, tipo, ConstraintType.SHOULD));
	constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_tip_logradouro', null, ConstraintType.MUST));
	fields.push('tip_logradouro','des_logradouro')
	var ds = DatasetFactory.getDataset("selectLogix", fields, constraints, null);
	console.log('ds',ds);
	
	var retorno = {};
	retorno['status'] = false;
	
	if( ds.values.length > 0 ){
		retorno['tip_logradouro'] = ds.values[0]["tip_logradouro"];
		retorno['des_logradouro'] = ds.values[0]["des_logradouro"];
		retorno['logradouro'] = logradouro.split(' ').slice(1).join(' ');
		retorno['status'] = true;	
	}else{
		retorno['tip_logradouro'] = "";
		retorno['des_logradouro'] = "";
		retorno['logradouro'] = logradouro;
		retorno['status'] = true;	
	}
	return retorno;
}


function showCamera(name){
    // console.log("Disparou >>> showCamera()");
  
    // var campo = id.split('___')[0];
    // var index = id.split('___')[1];
  
    // console.log(campo,index);
  
    // var seq = getSeq( index );

    // var nome_documento = $('#cod_tipo_documento___' + index ).val() + ' | ' + $('#tipo_documento___' + index ).val() + '___' + seq;

    // removeAnexo(index);
    // console.log( obj );
    var teste = JSInterface.showCamera(name);
  
    // console.log(teste);
    $(window.top.document).find('#attachmentsStatusTab').trigger('click');
    $("#" + name).val( name );
    
    // setTimeout(function(){
    //   Anexo();
    // }, 1000);
  
}

function getSeq( seq ){

    var index = 0;

    if ( $('#seq_doc___' + seq).val() != '' ) index = parseInt( $('#seq_doc___' + seq).val() );

    index ++;

    $('#seq_doc___' + seq).val( index );

    return index;

}

function removeAnexo(nome_documento) {
	
    $.each(parent.ECM.attachmentTable.getData(), function(i,attachment) {
		console.log(i,attachment);
        if ( nome_documento == attachment.description){
            parent.WKFViewAttachment.removeAttach([i]);
        }		
    });

}


//Adiciona filho na table não funciona em widget
function addFilho(table, campo, btn) {
	
	if( bloqueio /*|| $("#ins_estadual").val() == "" || $('#ies_cpf_cnpj').val() == 'CNPJ'*/ ){
		return false;
	}
	
	var row = wdkAddChild(table);
	setMask();

	if( table == "end_entrega" ){
		$('#ies_cpf_cnpj_entrega___'+row ).val("CNPJ")
		controleCpfCnpjEndereco( 'ies_cpf_cnpj_entrega___'+row );
	}
	
	return row;
}

function addMail(table) {
	var row = wdkAddChild(table);
	
	var nId = 1;
	$("input[name^=id_email___]").each(function (index, value) {
		if( nId < parseInt( $(this).val() ) ){
			nId = parseInt( $(this).val() );
		}
	});
	$('#id_email___'+row).val( nId+1 );
	$('#ies_excluido___'+row).val( "A" );
    $('#ies_excluido___'+row).parent().parent().addClass( "has-success" );
	
	setMask();

	return row;
}

function fnRemoveMail( obj ) {
	var seq = obj.children[0].id.split('___')[1];
	if( $('#ies_excluido___'+seq).val() == "A" ){
		fnWdkRemoveChild(obj);	
	}else{
		$('#email_nfe___'+seq).val("");
		$('#ies_excluido___'+seq).val("S");
		// $(obj).parent().parent().hide();
        $(obj).parent().attr('disabled', 'disabled');
        $(obj).parent().parent().addClass('has-error');
	}
}

// function loadTipoDocumentos(bol) {

//     if ( parent.WKFViewAttachment ){
//         console.log(parent.WKFViewAttachment.attachmentsDocs);
//         var lstDocs = parent.WKFViewAttachment.attachmentsDocs; 
//         var html = '<ul class="list-group fs-no-margin"> ';;
//         for ( doc in lstDocs ) {
//             const { documentId, description, physicalFileName, attachedDate, version } = lstDocs[doc];
//             html += `	<li class="list-group-item fs-sm-padding-top fs-sm-padding-bottom">
//                     		<span class="badge badge-primary fs-cursor-pointer" onclick="openFile( '${documentId}', '${version}' )"><i class="flaticon flaticon-documents icon-sm"></i></span>
//                     		<a class="fs-cursor-pointer" href="javascript:openFile( '${documentId}', '${version}' )">${attachedDate} - ${description} | ${physicalFileName}</a>'
//                     	</li> `;

//         }
//         html += '</ul>';
//         $('#novos_documentos').append( html );
//     }

//     var qtd = 0;
//     // $("input[name^=cod_tipo_documento___]").each(function (index, value) {
//     //     qtd++;
//     // });
//     $('#documentos > tbody > tr:not(:first)').remove();
//     if ( qtd == 0 ){
//         // Carrega Tipos Documentos
//         var constraints = new Array();
//         constraints.push( DatasetFactory.createConstraint("table", 'kbt_v_tipo_documento', null, ConstraintType.MUST) );
//         var dsTipoDocumento = DatasetFactory.getDataset("selectTable", null, constraints, null);

//         //Carrega papeis
//         var constraints = new Array();
//         constraints.push(DatasetFactory.createConstraint("colleagueId",  parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST));
//         var dsPapeis = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);

//         if ( dsTipoDocumento.values.length > 0 ){
//             //Retorna tipos de documentos
//             var tipos_documentos = Array.from(new Set(dsTipoDocumento.values.filter(doc => dsPapeis.values.filter(papel => doc.id_edit_pool === papel['workflowColleagueRolePK.roleId']).length).map((o) => o.cod_tipo_documento)));

//             if ( tipos_documentos.length > 0 ){
//                 var arrObj = new Array();
//                 for (var i = 0; i < tipos_documentos.length; i++ ){
//                     arrObj.push( dsTipoDocumento.values.filter(doc => doc.cod_tipo_documento === tipos_documentos[i]  )[0] );
//                 }

//                 for (var i = 0; i < arrObj.length; i++ ){

//                     // if ( arrObj[i]['ies_obrigatorio'] == 'on' ){
//                         var seq = wdkAddChild('documentos');
//                         $('#cod_tipo_documento___'+seq).val( arrObj[i]['cod_tipo_documento'] );
//                         $('#ies_inform_data___'+seq).val( arrObj[i]['ies_inform_data'] );
//                         $('#tipo_documento___'+seq).val( arrObj[i]['tipo_documento'] );
//                     // }
                    
//                 }
                
//             }

//             if( $('#num_cgc_cpf').val() != '' && $('#nom_cliente').val() != '' ) 
//             	loadDocumentos($('#num_cgc_cpf').val(), $('#nom_cliente').val(), bol );

//         }
//     }

// }

// function loadFinanceiro(id){

//     var seq = id.split('___')[1];

//     var html =  '<div class="row"> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_pedidos" class="control-label">Pedidos</label> '+
//                 '        <div class="input-group"> '+
//                 '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_pedidos\',\'md_cod_cliente\')"></span> '+
//                 '           <input type="hidden" id="md_cod_cliente"/> '+
//                 '           <input type="text" id="md_val_pedidos" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '        </div> '+
//                 '    </div>					 '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_cheques" class="control-label">Cheques</label> '+
//                 '        <div class="input-group"> '+
//                 '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_cheques\',\'md_cod_cliente\')"></span> '+
//                 '           <input type="text" id="md_val_cheques" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '        </div> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="saldo" class="control-label">Saldo</label> '+
//                 '        <input type="text" id="md_saldo" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_debito_vencido" class="control-label">Total Títulos Vencidos</label> '+
//                 '        <div class="input-group"> '+
//                 '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_tit_venc\',\'md_cod_cliente\')"></span> '+                
//                 '           <input type="text" id="md_val_debito_vencido" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '        </div> '+
//                 '   </div> '+
//                 '</div> '+
//                 '<div class="row"> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_debito_a_venc" class="control-label">Total Títulos a Vencer</label> '+
//                 '        <div class="input-group"> '+
//                 '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_tit_a_venc\',\'md_cod_cliente\')"></span> '+
//                 '           <input type="text" id="md_val_debito_a_venc" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '       </div> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="saldo_adiantamento" class="control-label">Saldo Adiantamento</label> '+
//                 '        <input type="text" id="md_saldo_adiantamento" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_maior_acumulo" class="control-label">Valor do maior acumulo</label> '+
//                 '        <input type="text" id="md_val_maior_acumulo" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="dat_ult_analise" class="control-label">Data ultima analise</label> '+
//                 '        <input type="text" id="md_dat_ult_analise" class="form-control data-fluig" readonly/> '+
//                 '    </div> '+
//                 '</div> '+
//                 '<div class="row"> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="dat_maior_acumulo" class="control-label">Data do maior acumulo</label> '+
//                 '        <input type="text" id="md_dat_maior_acumulo" class="form-control data-fluig" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_ult_fat" class="control-label">Valor da ultima fatura</label> '+
//                 '        <input type="text" id="md_val_ult_fat" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="dat_ult_fat" class="control-label">Data da ultima fatura</label> '+
//                 '        <input type="text" id="md_dat_ult_fat" class="form-control data-fluig" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_ult_pedido" class="control-label">Valor ultimo Pedido</label> '+
//                 '        <input type="text" id="md_val_ult_pedido" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '</div> '+
//                 '<div class="row"> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="dat_ult_pedido" class="control-label">Data ultimo Pedido</label> '+
//                 '        <input type="text" id="md_dat_ult_pedido" class="form-control data-fluig" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="val_maior_fat" class="control-label">Valor da maior fatura</label> '+
//                 '        <input type="text" id="md_val_maior_fat" class="form-control fs-text-right decimal-2" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="dat_maior_fat" class="control-label">Data da maior fatura</label> '+
//                 '        <input type="text" id="md_dat_maior_fat" class="form-control data-fluig" readonly/> '+
//                 '    </div> '+
//                 '    <div class="col-md-3"> '+
//                 '        <label for="" class="control-label" >&nbsp;</label> '+
//                 '        <button class="form-control btn btn-primary" type="button" onclick="loadHist(\'md_tit_pago\',\'md_cod_cliente\')">Títulos Pagos</button> '+
//                 '    </div> '+
//                 '</div> ';

//     var modalFin = FLUIGC.modal({
// 		title: 'Dados financeiros | ' + $('#nom_cliente_grp_econ___' + seq).val(),
// 		content: html,
// 		id: 'modal_financeiro',
//         size: 'large',
// 		actions: [{
// 			'label': 'Imprimir',
//             'bind': 'data-imprime-credito',
// 			'classType': 'btn-info',
// 		},{
// 			'label': 'Fechar',
// 			'classType': 'btn-danger',
// 			'autoClose': true
// 		}]
// 	}, function(err, data) {
// 		if(err) {
// 			// do error handling
// 		} else {
// 			// do something with data
//             loadWindow.show();
//             var constraints = new Array();
//             constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#cod_cliente_grp_econ___'+seq).val(), $('#cod_cliente_grp_econ___'+seq).val(), ConstraintType.MUST));
//             constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_cliente_financeiro', null, ConstraintType.MUST));
//             DatasetFactory.getDataset("selectLogix", null, constraints, null, {
//                 success: function(data){

//                     for (var i = 0; i < data.values.length; i++){
//                         for ( var j = 0; j < data.columns.length; j++){
//                             var value = data.values[i][ data.columns[j] ];
                            
//                             if ( $('#md_'+data.columns[j]).hasClass('decimal-2') ){
//                                 value = formatStringValue( data.values[i][ data.columns[j] ], 2);
//                             }

//                             if ( $('#md_'+data.columns[j]).hasClass('data-fluig') ){
//                                 //value = formataData( new Date( data.values[i][ data.columns[j] ] ) );
//                                 value = data.values[i][ data.columns[j] ].split('-').reverse().join('/');
//                             }

//                             $('#md_'+data.columns[j]).val( value );
//                         }
//                     }

//                     $('#md_cod_cliente').val( $('#cod_cliente_grp_econ___'+seq).val() );

//                     loadWindow.hide();
//                 },

//                 error: function(error){

//                 }
//             })            
// 		}
// 	});

//     $('#modal_financeiro').on('click','[data-imprime-credito]', function(ev){

//         var data = {};
//             data['cod_cliente'] = $('#md_cod_cliente').val();
//             data['val_ult_fat'] = $('#md_val_ult_fat').val();
//             data['dat_ult_fat'] = $('#md_dat_ult_fat').val();
//             data['val_maior_acumulo'] = $('#md_val_maior_acumulo').val();
//             data['dat_maior_acumulo'] = $('#md_dat_maior_acumulo').val();
//             data['val_maior_fat'] = $('#md_val_maior_fat').val();
//             data['dat_maior_fat'] = $('#md_dat_maior_fat').val();
//             data['val_debito_vencido'] = $('#md_val_debito_vencido').val();
//             data['val_debito_a_venc'] = $('#md_val_debito_a_venc').val();
//             data['grupo'] = 'N';
//             data['tipo'] = 'credito';

//         getPrint( data );

//     });

// }

// function printGrupo(){
    
//     var data = {};
//         data['cod_cliente'] = $('#cod_cliente').val();
//         data['val_ult_fat'] = $('#val_ult_fat').val();
//         data['dat_ult_fat'] = $('#dat_ult_fat').val();
//         data['val_maior_acumulo'] = $('#val_maior_acumulo').val();
//         data['dat_maior_acumulo'] = $('#dat_maior_acumulo').val();
//         data['val_maior_fat'] = $('#val_maior_fat').val();
//         data['dat_maior_fat'] = $('#dat_maior_fat').val();
//         data['val_debito_vencido'] = $('#val_debito_vencido').val();
//         data['val_debito_a_venc'] = $('#val_debito_a_venc').val();
//         data['grupo'] = 'S';
//         data['tipo'] = 'credito';

//         getPrint( data );
// }

// function loadHist(tipo, cliente){
    
//     var constraints = new Array();
//     var orderby = new Array();

//     if ( tipo == 'md_pedidos'){
//         var title = 'PEDIDOS';
//         var content = '';
//         var table = 'kbt_v_pedidos';
//         var wHeader = [{"display": false},
//         {"display": false},
//         {"display": false},
//         {"display": false},
//         {"display": false},
//         {"display": false},
//         {"title":"Cliente", "size": 'text-left colspan-pint-12', "dataorder": "nom_cliente"},
//         {"display": false},
//         {"display": false},
//         {"title":"Portador", "size": 'text-right number colspan-pint-3', "dataorder": "cod_portador"},
//         {"title":"Num Pedido", "size": 'text-right number colspan-pint-3', 'dataorder': 'num_pedido'},
//         {"title":"Data Pedido", "size": 'date colspan-pint-3', "dataorder": "dat_pedido"},
//         {"title":"Valor Pedido", "size": 'text-right colspan-pint-3', 'dataorder': 'valor_pedido'}];
//     }

//     if ( tipo == 'md_cheques' ){
//         var title = 'CHEQUES';
//         var content = '';
//         var table = 'kbt_v_cheques';
//         var wHeader = [
//                         {"display": false}, //origem,
//                         {"display": false}, //cod_empresa,
//                         {"display": false}, //den_empresa,
//                         {"display": false}, //den_reduz,
//                         {"display": false}, //uf_emp,
//                         {"display": false}, //cod_cliente,
//                         {"title":"Cliente", "size": 'text-left colspan-pint-8', "dataorder": "nom_cliente"}, //nom_cliente,
//                         {"display": false}, //nom_reduzido,
//                         {"display": false}, //cod_uni_feder,
//                         {"title": "Portador", "size": 'text-right number colspan-pint-2', 'dataorder': 'cod_portador'}, //cod_portador,
//                         {"display": false}, //nom_portador,
//                         {"display": false}, //nom_abr_portador,
//                         {"title": "Cod Tip Desp", 'size': 'colspan-pint-1', 'dataorder': 'cod_tip_despesa'}, //cod_tip_despesa,
//                         {"title": "Den Tip Desp", 'size': 'colspan-pint-3' ,'dataorder': 'nom_tip_despesa'}, //nom_tip_despesa,
//                         {"display": false}, //num_ap,
//                         {"title":"NF", 'size': 'number colspan-pint-2', 'dataorder': 'num_nf'}, //num_nf,
//                         {"title": "Data Venc", 'size': 'date colspan-pint-3', 'dataorder':'dat_vencto'}, //dat_vencto,
//                         {"title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_che'}, //valor_che,
//                         {"display": false} //valor_che_vencido
//                     ];
//     }

//     if ( tipo == 'md_tit_venc' ){

//         /*var ct = new Array();
//         ct.push(DatasetFactory.createConstraint("table", "kbt_v_pct_juros", null, ConstraintType.MUST));
//         var dsJuros = DatasetFactory.getDataset("selectLogix", null, ct, null)

//         var juro = '0,00';
//         if ( dsJuros ){
//             if ( dsJuros.values.length > 0 ){
//                 juro = getStringValue( parseFloat(dsJuros.values[0]['pct_juro_mora']),2 );
//             }
//         }
// */
    	
//         var title = 'TÍTULOS VENCIDOS';

//         var content = '<div class="row">'+
//                     '<div class="col-md-3 col-md-offset-9 "> '+
//                     '    <label for="" class="control-label">Valor Total</label> '+
//                     '    <input type="text" id="md_tot_tit_venc" class="form-control" style="text-align: right;" readonly/>'+
//                     '</div>'+
// /*                    '<div class="col-md-2"> '+
//                     '    <label for="" class="control-label">% Juros</label> '+
//                     '    <input type="text" id="md_pct_juro" class="form-control" style="text-align: right;" value="'+juro+'" onblur="recalculaJuros()"/>'+
//                     '</div>'+
//                     '<div class="col-md-3"> '+
//                     '    <label for="" class="control-label">Valor Juros</label> '+
//                     '    <input type="text" id="md_val_juro" class="form-control" style="text-align: right;" readonly/>'+
//                     '</div>'+
//                     '<div class="col-md-3"> '+
//                     '    <label for="" class="control-label">Valor com Juros</label> '+
//                     '    <input type="text" id="md_val_c_juro" class="form-control" style="text-align: right;" readonly/>'+
//                     '</div>'+
//                     '<div class="col-md-1"> '+
//                     '    <label for="" class="control-label">&nbsp;</label> '+
//                     '    <button class="form-control btn btn-primary fluigicon fluigicon-cog" type="button" onclick="recalculaJuros()"></button>'+
//                     '</div>'+*/
//                     '</div>'; 
    	
//         var table = 'kbt_v_titulos';
//         var wHeader = [
//                         {"display": false}, //origem,
//                         {"display": false}, //cod_empresa,
//                         {"display": false}, //den_empresa,
//                         {"display": false}, //den_reduz,
//                         {"display": false}, //uf_emp,
//                         {"display": false}, //cod_cliente,
//                         {"title":"Cliente", "size": 'text-left colspan-pint-10', "dataorder": "nom_cliente"}, //nom_cliente,
//                         {"display": false}, //nom_reduzido,
//                         {"display": false}, //cod_uni_feder,
//                         {"display": false}, //cod_portador,
//                         {"display": false}, //nom_portador,
//                         {"display": false}, //nom_abr_portador,
//                         {"display": false}, //cod_tip_despesa,
//                         {"display": false}, //nom_tip_despesa,
//                         {"title": "Duplicata", 'size colspan-pint-2': 'number','dataorder': 'num_ap'}, //num_ap,
//                         {"display": false}, //num_nf,
//                         {"title": "Emissao", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao'}, //dat_emissao,
//                         {"title": "Vencimento", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencimento'}, //dat_vencimento,
//                         {"title": "Dias Vencto", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao'}, //dias_vencimento,
//                         {"display": false}, //valor_cre,
//                         {"title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_cre_vencido'}, //valor_cre_vencido,
//                         {"display": false}, //valor_cre_a_vencer
//                         {"display": false}, //valor_juro
//                         {"display": false}, //valor_c_juro
//                     ];
        
//         constraints.push(DatasetFactory.createConstraint("valor_cre_vencido", "0", "0", ConstraintType.MUST_NOT));
//     }

//     if ( tipo == 'md_tit_a_venc' ){

//         var title = 'TÍTULOS A VENCER';
//         var content = '<div class="row">'+
// 				        '<div class="col-md-3 col-md-offset-9 "> '+
// 				        '    <label for="" class="control-label">Valor Total</label> '+
// 				        '    <input type="text" id="md_tot_tit_a_venc" class="form-control" style="text-align: right;" readonly/>'+
// 				        '</div>'+
// 				        '</div>'
//         var table = 'kbt_v_titulos';
//         var wHeader = [
//                         {"display": false}, //origem,
//                         {"display": false}, //cod_empresa,
//                         {"display": false}, //den_empresa,
//                         {"display": false}, //den_reduz,
//                         {"display": false}, //uf_emp,
//                         {"display": false}, //cod_cliente,
//                         {"title":"Cliente", "size": 'text-left colspan-pint-12', "dataorder": "nom_cliente"}, //nom_cliente,
//                         {"display": false}, //nom_reduzido,
//                         {"display": false}, //cod_uni_feder,
//                         {"display": false}, //cod_portador,
//                         {"display": false}, //nom_portador,
//                         {"display": false}, //nom_abr_portador,
//                         {"display": false}, //cod_tip_despesa,
//                         {"display": false}, //nom_tip_despesa,
//                         {"title": "Duplicata", 'size': 'number colspan-pint-3','dataorder': 'num_ap'}, //num_ap,
//                         {"display": false}, //num_nf,
//                         {"title": "Emissao", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao'}, //dat_emissao,
//                         {"title": "Vencimento", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencimento'}, //dat_vencimento,
//                         {"display": false}, //dias_vencimento
//                         {"display": false}, //valor_cre,
//                         {"display": false}, //valor_cre_vencido,
//                         {"title": "Valor", "size": 'text-right number colspan-pint-3','dataorder': 'valor_cre_a_vencer'} //valor_cre_a_vencer
//                     ];
//         constraints.push(DatasetFactory.createConstraint("valor_cre_a_vencer", "0", "0", ConstraintType.MUST_NOT));
//     }

//     if ( tipo == 'md_tit_pago' ){

//         var ct = new Array();
//         ct.push(DatasetFactory.createConstraint("table", "kbt_v_pct_juros", null, ConstraintType.MUST));
//         var dsJuros = DatasetFactory.getDataset("selectLogix", null, ct, null)

//         var juro = '0,00';
//         if ( dsJuros ){
//             if ( dsJuros.values.length > 0 ){
//                 juro = getStringValue( parseFloat(dsJuros.values[0]['pct_juro_mora']),2 );
//             }
//         }        

//         if ( $('#md_documento').val() != '' && $('#md_documento').val() ){

//             constraints.push(DatasetFactory.createConstraint('___like___num_docum', $('#md_documento').val(), $('#md_documento').val(), ConstraintType.MUST));

//         } else {

//             if ( $('#md_portador').val() ){
//                 var portadores = $('#md_portador').val().replace(',','|')
//                 constraints.push(DatasetFactory.createConstraint('___in___cod_portador', portadores, portadores, ConstraintType.MUST));
//             }

//             if ( $('#md_n_portador').val() ){
//                 var portadores = $('#md_n_portador').val().replace(',','|')
//                 constraints.push(DatasetFactory.createConstraint('___in___cod_portador', portadores, portadores, ConstraintType.MUST_NOT));
//             }

//             if ( $('#md_tipo_documento').val() ){
//                 var tipo_documento = $('#md_tipo_documento').val().replace(',','|')
//                 constraints.push(DatasetFactory.createConstraint('___in___ies_tip_docum', tipo_documento, tipo_documento, ConstraintType.MUST));
//             }

//             if ( $('#md_n_tipo_documento').val() ){
//                 var tipo_documento = $('#md_n_tipo_documento').val().replace(',','|')
//                 constraints.push(DatasetFactory.createConstraint('___in___ies_tip_docum', tipo_documento, tipo_documento, ConstraintType.MUST_NOT));
//             }

//             if ( $('#md_dat_ini').val() && $('#md_dat_fim').val() ){
//                 constraints.push(DatasetFactory.createConstraint('___date___dat_credito', $('#md_dat_ini').val().split('/').reverse().join('/'), $('#md_dat_fim').val().split('/').reverse().join('/'), ConstraintType.MUST));
//                 var dt_ini = $('#md_dat_ini').val();
//                 var dt_fim = $('#md_dat_fim').val();
//             } else {
//                 var date = new Date();
//                 var dt_fim = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate() )).slice(-2);
//                 date.setDate(date.getDate() - 30); 
//                 var dt_ini = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + "01";
//                 // var dt_fim = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + retUltimoDia( date.getFullYear(), (date.getMonth() + 1) );
    
//                 constraints.push(DatasetFactory.createConstraint('___date___dat_credito', dt_ini, dt_fim, ConstraintType.MUST));
    
//                 var dt_ini = dt_ini.split('-').reverse().join('/');
//                 var dt_fim = dt_fim.split('-').reverse().join('/');
//             }

//         }

//         orderby = ['num_docum, dat_credito']

//         var title = 'TÍTULOS PAGOS';
//         var content = '<div class="row">'+
//                     '<div class="col-md-3"> '+
//                     '    <label for="" class="control-label">Documento</label> '+
//                     '    <input type="text" id="md_documento" class="form-control" style="text-align: right;" onblur="clearTable()" />'+
//                     '</div>'+
//                     '<div class="col-md-4"> '+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '       <label for="" class="control-label">Data Ini</label> '+
//                     '       <input type="text" id="md_dat_ini" class="form-control md_data" value="'+dt_ini+'" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '       <label for="" class="control-label">Data Fim</label> '+
//                     '       <input type="text" id="md_dat_fim" class="form-control md_data" value="'+dt_fim+'" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '</div>'+
//                     '<div class="col-md-2"> '+
//                     '    <label for="" class="control-label">% Juros</label> '+
//                     '    <input type="text" id="md_pct_juro" class="form-control" style="text-align: right;" value="'+juro+'" onblur="clearTable()"/>'+ //recalculaJuros()
//                     '</div>'+
//                     '<div class="col-md-2"> '+
//                     '    <label for="" class="control-label">Tot Desc/Juro</label> '+
//                     '    <input type="text" id="md_tot_desc_juro" class="form-control" style="text-align: right;" readonly />'+
//                     '</div>'+
//                     '<div class="col-md-1"> '+
//                     '    <label for="" class="control-label">&nbsp;</label> '+
//                     '    <button class="form-control btn btn-primary fluigicon fluigicon-cog" type="button" onclick="loadHist(\'md_tit_pago\', \'cod_cliente\')"></button>'+
//                     '</div>'+
//                     '<div class="col-md-4"> '+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '      <label for="" class="control-label">Portador Incluir</label> '+
//                     '      <input type="text" id="md_portador" class="form-control portador" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '      <label for="" class="control-label">Tip Doc Incluir</label> '+
//                     '      <input type="text" id="md_tipo_documento" class="form-control tipo_documento" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '</div>'+
//                     '<div class="col-md-4"> '+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '      <label for="" class="control-label">Portador Excluir</label> '+
//                     '      <input type="text" id="md_n_portador" class="form-control portador" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '   <div class="col-md-6 fs-no-padding"> '+
//                     '      <label for="" class="control-label">Tip Doc Excluir</label> '+
//                     '      <input type="text" id="md_n_tipo_documento" class="form-control tipo_documento" onblur="clearTable()" />'+
//                     '   </div>'+
//                     '</div>'+
//                     '<div class="col-md-1"> '+
//                     '    <label for="" class="control-label">Grupo Econ?</label> '+
//                     '    <select id="md_grupo" class="form-control" onchange="clearTable()"> '+
//                     '        <option value="S">Sim</option> '+
//                     '        <option value="N">Não</option> '+
//                     '     </select> '+
//                     '</div>'+
//                     '</div>';
//         var table = 'kbt_v_titulos_pagos';
//         var wHeader = [
//                         {"title": "Empresa", "size": 'text-right number colspan-pint-1', 'dataorder': 'cod_empresa'}, //cod_empresa,
//                         {"display": false}, //num_docum,
//                         {"title": "Documento", "size": 'text-right number colspan-pint-3', 'dataorder': 'num_docum'}, //num_docum,
//                         {"display": false}, //ies_tip_docum,
//                         {"title": "Portador", "size": 'text-right number colspan-pint-1', 'dataorder': 'cod_portador'}, //cod_portador,
//                         // {"title": "Tipo Port.", "size": 'text-right number', 'dataorder': 'ies_tip_portador'}, //ies_tip_portador,
//                         {"title": "Cliente", "size": 'text-left colspan-pint-6', 'dataorder': 'nom_cliente'}, //ies_tip_portador,
//                         {"title": "Data Venc.", "size": 'date colspan-pint-3', 'dataorder': 'dat_venc'}, //dat_venc,
//                         {"title": "Data Cred.", "size": 'date colspan-pint-3', 'dataorder': 'dat_credito'}, //dat_credito,
//                         {"title": "Dias Atraso Antec", "size": 'text-right number colspan-pint-1', 'dataorder': 'dias_ant_atraso'}, //dias_ant_atraso,
//                         {"title": "Valor Pago", "size": 'text-right number colspan-pint-3', 'dataorder': 'val_pago'}, //val_pago
//                         {"title": "Valor Desc Juro", "size": 'text-right number colspan-pint-3', 'dataorder': 'val_juro'}, //val_juro
//                     ];
        
//     }

//     var modalTable = FLUIGC.modal({
//         title: title,
//         content: content + '<div id="table_'+tipo+'"></div>',
//         id: tipo,
//         size: 'full',
//         actions: [{
//             'label': 'Imprimir',
//             'classType': 'btn-info imprime',
//             'bind': 'data-imprime-hist'
//         },{
//             'label': 'Fechar',
//             'classType': 'btn-danger',
//             'autoClose': true
//         }]
//     }, function(err, data) {
//         if(err) {
//             // do error handling
//         } else {

//             /* Portadores */
//             var ct = new Array();
//             ct.push(DatasetFactory.createConstraint("table", "portador", null, ConstraintType.MUST));
//             var dsPortador = DatasetFactory.getDataset("selectLogix", null, ct, ['cod_portador']);
            
//             var portadores = dsPortador.values.map( o => o.cod_portador );

//             /* Instantiated new autocomplete */
//             var autoPortadorExcluir = FLUIGC.autocomplete('#md_n_portador', {
//                 source: substringMatcher(portadores),
//                 // name: 'cities',
//                 displayKey: 'description',
//                 tagClass: 'tag-gray',
//                 type: 'tagAutocomplete'
//             });

//             /* Instantiated new autocomplete */
//             var autoPortador = FLUIGC.autocomplete('#md_portador', {
//                 source: substringMatcher(portadores),
//                 // name: 'cities',
//                 displayKey: 'description',
//                 tagClass: 'tag-gray',
//                 type: 'tagAutocomplete'
//             });

//             /* Tipo Documento */
//             var ct = new Array();
//             ct.push(DatasetFactory.createConstraint("table", "par_tipo_docum", null, ConstraintType.MUST));
//             var dsTipo_documento = DatasetFactory.getDataset("selectLogix", ['distinct','ies_tip_docum'], ct, ['ies_tip_docum']);
            
//             var tipo_documento = dsTipo_documento.values.map( o => o.ies_tip_docum );
            
//             var autoTipoPortador = FLUIGC.autocomplete('.tipo_documento', {
//                 source: substringMatcher(tipo_documento),
//                 // name: 'cities',
//                 displayKey: 'description',
//                 tagClass: 'tag-gray',
//                 type: 'tagAutocomplete'
//             });

//             // $('#modal_hist').find('[data-imprime-hist]').unbind();

//             var foo = $._data($("#"+tipo)[0], "events").click;

//             if ( foo.filter( fo => fo.selector == "[data-imprime-hist]").length == 0 ){

//                 autoPortadorExcluir.add({
//                     description: '904'
//                 });

//                 $('#'+tipo).on('click','[data-imprime-hist]', function(el, ev){
//                     console.log( el, ev );
//                     var data = {};
//                     data['cod_cliente'] = $('#cod_cliente').val();
//                     data['grupo'] = $('#md_grupo').val() ? $('#md_grupo').val() : 'S';
//                     data['tipo'] = 'dtl';
//                     data['title'] = title;
//                     data['table'] = tipo;
//                     // data['header'] = wHeader.filter(obj => obj.display != false).map( obj => obj.title );
            
//                     if (tipo == 'md_tit_venc'){
//                         var objArr = {};
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr['Total'] = $('#md_tot_tit_venc').val();
//                         /*objArr['% Juro'] = $('#md_pct_juro').val();
//                         objArr['Juros'] = $('#md_val_juro').val();
//                         objArr['Tot. c/Jur'] = $('#md_val_c_juro').val();*/
//                         data['footer'] = objArr;
//                     }
                    
//                     if (tipo == 'md_tit_a_venc'){
//                         var objArr = {};
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr['Total'] = $('#md_tot_tit_a_venc').val();
//                         data['footer'] = objArr;
//                     }


//                     if (tipo == 'md_tit_pago'){
//                         data['title'] = title + ' '+ $('#md_dat_ini').val() +' ATÉ '+ $('#md_dat_fim').val() +'  | % Juro: ' + $('#md_pct_juro').val();
//                         var objArr = {};
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr[''] = '';
//                         objArr['% Juro'] = $('#md_pct_juro').val();
//                         objArr['Tot. Desc/Juro'] = $('#md_tot_desc_juro').val();
//                         data['footer'] = objArr;
//                     }
            
//                     getPrint( data );
            
//                 });
//             }

//         }
//     });

//     montaTableHist(cliente, tipo, constraints, orderby, table, wHeader);

// }

// function montaTableHist(cliente, tipo, constraints, orderby, table, wHeader){
//     loadWindow.show();

//     if( cliente.split('_')[0] == 'md' ){
//     	constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#'+cliente).val(), $('#'+cliente).val(), ConstraintType.MUST));
//     }else{
//     	var codClientes = [];
//     	$("input[name^=cod_cliente_grp_econ___]").each(function (index, value) {
//     		codClientes.push( this.value );
//     	});
//     	constraints.push(DatasetFactory.createConstraint('___in___cod_cliente', codClientes.join('|'), codClientes.join('|'), ConstraintType.MUST));
//     }
//     //constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#'+cliente).val(), $('#'+cliente).val(), ConstraintType.MUST));
//     constraints.push(DatasetFactory.createConstraint('sqlLimit', '9999', '9999', ConstraintType.MUST));
//     constraints.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
//     DatasetFactory.getDataset("selectLogix", null, constraints, orderby, {
//         success: function(data){
//         	var tot_cre_a_vencer = 0;
//             var tot_cre_vencido = 0;
//             var tot_cre_vencido_juro = 0;
//             var tot_cre_vencido_c_juro  = 0;
//             var tot_desc_juro = 0;

//             for (var i = 0; i < data.values.length; i++){
//                 for ( var j = 0; j < data.columns.length; j++){
//                     if ( data.columns[j].indexOf('val') >= 0 ){
//                         data.values[i][ data.columns[j] ] = formatStringValue( data.values[i][ data.columns[j] ], 2 );
//                     } else if ( data.columns[j].indexOf('dat_') >= 0 ){
//                         data.values[i][ data.columns[j] ] =  data.values[i][ data.columns[j] ].split('-').reverse().join('/') ;//formataData( new Date( data.values[i][ data.columns[j] ].replace('-','/') ) );
//                     }
//                 }
                
//                 if ( tipo == 'md_tit_venc'){
//                     //if ( i == 0){
//                     //    data.columns.push('valor_juro');
//                     //    data.columns.push('valor_c_juro');
//                     //}
//                     var valor = parseFloat( data.values[i][ 'valor_cre_vencido' ].replaceAll('.','').replace(',','.') );
//                     //var pct = parseFloat( $('#md_pct_juro').val().replace(',','.') ) / 100 ;
//                     //data.values[i][ 'valor_juro' ] = formatStringValue( valor * pct, 2 ) ;
//                     //data.values[i][ 'valor_c_juro' ] = formatStringValue( valor + ( valor * pct ), 2 ) ;

//                     tot_cre_vencido += valor;
//                     //tot_cre_vencido_juro += valor * pct;
//                     //tot_cre_vencido_c_juro += valor + ( valor * pct );

//                 }

//                 if ( tipo == 'md_tit_a_venc'){
//                     var valor = parseFloat( data.values[i][ 'valor_cre_a_vencer' ].replaceAll('.','').replace(',','.') );
//                     tot_cre_a_vencer += valor;
//                 }
                
                
//                 if ( tipo == 'md_tit_pago'){
//                     if ( i == 0 ){
//                         data.columns.push('val_juro');
//                     }

//                     var valor = parseFloat( data.values[i][ 'val_pago' ].replaceAll('.','').replace(',','.') );
//                     var dias = parseFloat( data.values[i][ 'dias_ant_atraso' ] ) ;
//                     var pct = parseFloat( $('#md_pct_juro').val().replace(',','.') ) / 100 ;
//                     var taxa = (pct / 30) *  dias;

//                     data.values[i][ 'val_juro' ] = formatStringValue(  ( valor * taxa ), 2 ) ;

//                     tot_desc_juro += valor * taxa;

//                     $('#md_pct_juro').maskMoney({precision : 2,thousands : '',decimal : ',', defaultZero : true,allowZero : true});

//                     FLUIGC.calendar('.md_data' );
//                 }

//             }
            
//             if ( tipo == 'md_tit_a_venc'){
//             	$('#md_tot_tit_a_venc').val( formatStringValue( tot_cre_a_vencer, 2) );
//             }
            
//             if ( tipo == 'md_tit_venc'){
//                 //$('#md_pct_juro').maskMoney({precision : 2,thousands : '',decimal : ',', defaultZero : true,allowZero : true});
//                 $('#md_tot_tit_venc').val( formatStringValue( tot_cre_vencido, 2) );
//                 //$('#md_val_juro').val( formatStringValue( tot_cre_vencido_juro, 2) );
//                 //$('#md_val_c_juro').val( formatStringValue( tot_cre_vencido_c_juro, 2) );

//                 //FLUIGC.calendar('.md_data' );
//             } 
            
//             if ( tipo == 'md_tit_pago'){
//                 $('#md_pct_juro').maskMoney({precision : 2,thousands : '',decimal : ',', defaultZero : true,allowZero : true});
//                 $('#md_tot_desc_juro').val( formatStringValue( tot_desc_juro, 2) );
//                 FLUIGC.calendar('.md_data' );
//             }

//             tblHist = FLUIGC.datatable('#table_'+tipo, {
//                 dataRequest: data.values,
//                 renderContent: data.columns,
//                 header: wHeader,
//                 search: {enabled: false,},
//                 navButtons: {
//                     enabled: false,
//                 },
                
//             }, function(err, data) {
//                 // DO SOMETHING (error or success)                        
//             });

//             $('#table_'+tipo).on('click','[data-order-by]',function(event){
//                 var order = this.getAttribute('data-order-by');
//                 var types = this.classList;

//                 dados = tblHist.getData();

//                 var classList = this.children[1].classList;
                
//                 if( classList.contains("dropup") ){
//                     //this.orderAscDesc = "ASC";
//                     dados.sort(function(a, b){
//                         if ( types.contains('date') ){
//                             var a1 = new Date(a[order].split('/').reverse().join('/')) , b1 = new Date(b[order].split('/').reverse().join('/'));
//                         } else if ( types.contains('number') ){
//                             var a1 = getFloatValue( a[order].replaceAll('.','') ), b1 = getFloatValue( b[order].replaceAll('.','') );
//                         } else {
//                             var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
//                         }
//                         if(a1 == b1) return 0;
//                         return a1 > b1? 1: -1;
//                     });
//                 }else{
//                     //this.orderAscDesc = "DESC";
//                     dados.sort(function(a, b){
//                         if ( types.contains('date') ){
//                             var a1 = new Date(a[order].split('/').reverse().join('/')) , b1 = new Date(b[order].split('/').reverse().join('/'));
//                         } else if ( types.contains('number') ){
//                             var a1 = getFloatValue( a[order].replaceAll('.','') ), b1 = getFloatValue( b[order].replaceAll('.','') );
//                         } else {
//                             var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
//                         }
//                         if(a1== b1) return 0;
//                         return a1 < b1? 1: -1;
//                     });
//                 }

//                 tblHist.reload(dados);
//                 formataTable('table_' + tipo);
//             });

//             formataTable('table_' + tipo);

//             loadWindow.hide();
//         },

//         error: function(error){

//         }
//     });
// }

// function recalculaJuros(){
//     console.log('teste', tblHist.getData() );
//     data = tblHist.getData();

//     var tot_cre_a_vencer = 0;
//     var tot_cre_vencido = 0;
//     var tot_cre_vencido_juro = 0;
//     var tot_cre_vencido_c_juro = 0;

//     for (var i = 0; i < data.length; i++){
//         var valor = parseFloat( data[i][ 'valor_cre_vencido' ].replaceAll('.','').replace(',','.') );
//         var valorVencer = parseFloat( data[i][ 'valor_cre_a_vencer' ].replaceAll('.','').replace(',','.') );
//         var pct = parseFloat( $('#md_pct_juro').val().replace(',','.') ) / 100 ;
//         data[i][ 'valor_juro' ] = formatStringValue( valor * pct, 2 ) ;
//         data[i][ 'valor_c_juro' ] = formatStringValue( valor + ( valor * pct ), 2 ) ;

//         tot_cre_a_vencer += valorVencer;
//         tot_cre_vencido += valor;
//         tot_cre_vencido_juro += valor * pct;
//         tot_cre_vencido_c_juro += valor + ( valor * pct );
//     }

//     $('#md_tot_tit_a_venc').val( formatStringValue( tot_cre_a_vencer, 2) );
//     $('#md_tot_tit_venc').val( formatStringValue( tot_cre_vencido, 2) );
//     $('#md_val_juro').val( formatStringValue( tot_cre_vencido_juro, 2) );
//     $('#md_val_c_juro').val( formatStringValue( tot_cre_vencido_c_juro, 2) );

//     tblHist.reload(data);

//     formataTable('table_tit_venc');

// }

// function formataTable(table){

//     $("#"+table).find("tr").each(function(el,ev){
//         $($(this).children()).each(function(el,ev){
//             if ($(this).css('display') != 'none'){
//                 var index = this.cellIndex;
//                 if ( $( $(this).closest('table').find('thead > tr')[0].cells[ index ] ).hasClass('text-right') ){
//                     $(this).addClass('text-right');
//                 }
//             };
//         });
//     });
// }

// function substringMatcher(strs) {
//     return function findMatches(q, cb) {
//         var matches, substrRegex;
 
//         matches = [];
 
//         substrRegex = new RegExp(q, 'i');
 
//         $.each(strs, function (i, str) {
//             if (substrRegex.test(str)) {
//                 matches.push({
//                     description: str
//                 });
//             }
//         });
//         cb(matches);
//     };
// }

// function clearTable() {
	

// 	tblHist.destroy();
	
// }
