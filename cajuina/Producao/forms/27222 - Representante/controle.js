var abaTotal = 5;
var aba = 1;
var qtd = 0;
var qtdSleep = 0;

var valAtu = "";

var loadingPrincipial = FLUIGC.loading("divPrincipal");
loadingPrincipial.title = "Carregando......";

loading = FLUIGC.loading(window, {
	textMessage : '<h3>Filtrando Informa&ccedil;&otilde;es...</h3>',
	title : null,
	css : {
		padding : 0,
		margin : 0,
		width : '30%',
		top : '40%',
		left : '35%',
		textAlign : 'center',
		color : '#000',
		border : '3px solid #aaa',
		backgroundColor : '#fff',
		cursor : 'wait'
	},
	overlayCSS : {
		backgroundColor : '#000',
		opacity : 0.6,
		cursor : 'wait'
	},
	cursorReset : 'default',
	baseZ : 1000,
	centerX : true,
	centerY : true,
	bindEvents : true,
	fadeIn : 200,
	fadeOut : 400,
	timeout : 0,
	showOverlay : true,
	onBlock : null,
	onUnblock : null,
	ignoreIfBlocked : false
});

$(document)
		.bind(
				"DOMNodeRemoved",
				function(e) {

					if (e.target.nodeName == 'LI') {
						var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
						if (target.html().indexOf(
								'class="select2-selection__choice"') > 0) {
							if ($('#den_item_edit').val() == null
									&& target.html().indexOf(
											'id="den_item_edit"') > 0) {
								clearItem('den_item');
							}
						}
					}

					var target = $(e.target);
					// console.log('antes zIndex '+target.html() );
					if (target.html().indexOf(
							"class=\"fluig-style-guide modal\"") >= 0) {
						// console.log('entrii para alterar zIndex');
						parent.$('#workflowView-cardViewer').css('zIndex', 0);
					}

					// if ( e.target.nodeName == 'SPAN' ){
					// var target = $(e.target.parentNode.parentNode);
					// if( $('#den_item_edit').val() != ''
					// && $('#den_item_edit').val() != undefined
					// && $('#den_item_edit').val() != null
					// && target.html().indexOf('id="den_item_edit"' ) > 0 ){
					// clearItem( 'den_item' );
					// }
					// }

				});

function fnGerente( nm ){

	 $('.gerente').hide();
	 $('.supervisor').hide();

	if( $('#tipo_cadastro').val() == 'G' ){
		$('.gerente').show();
	}else if( $('#tipo_cadastro').val() == 'V' ){
		$('.supervisor').show();	
	}
	
}

function clearItem(origem) {

	if (origem == 'cod_item') {
		zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
		zoomDestino.clear();
	}

	$('#cod_item_zoom_edit').val('');
	$('#cod_item_edit').val('');
	$('#peso_edit').val('');
	$('#qtd_pad_edit').val('');

	$('#cod_lin_prod_edit').val('');
	$('#cod_lin_recei_edit').val('');
	$('#cod_seg_merc_edit').val('');
	$('#cod_cla_uso_edit').val('');
	$('#cod_grupo_item_edit').val('');
	$('#cod_tip_carteira_edit').val('');
	$('#um_edit').val('');

	$('#valor_unit_edit').val('');
	$('#valor_unit_lista_edit').val('');
	$('#valor_total_edit').val('');

	$('#desconto_edit').val('');
	$('#quantidade_edit').val('');
	$('#qtd_pad_edit').val('');
	$('#data_entrega_edit').val('');

	$('#pedido_cli_edit').val('');
	$('#seq_pedido_cli_edit').val('');

	$('#linha_edit').val('0');

	$('#obs_item_1_edit').val("");
	$('#obs_item_2_edit').val("");
	$('#obs_item_3_edit').val("");
	$('#obs_item_4_edit').val("");
	$('#obs_item_5_edit').val("");

	$('#ies_mix').val("");
	$('#pct_desc_adic_edit').val("");

	$('#inf_obs').prop("checked", false);
	setObsItem();

	if ($('#ies_inf_pedido').val() == "S") {
		$('#info_Pedido').show();
	} else {
		$('#info_Pedido').hide();
	}

	$('#sequencia_edit').val("");

}

function getLinhaCampoPF(campo) {
	return campo.substring(campo.indexOf('___') + 3, campo.length);
}

function fnCustomDelete(oElement) {

	/*seq = getIdParentChild(oElement).split('___')[1];
	console.log('fnCustomDelete', $('#processo').val(),
			$('#sequencia___' + seq).val());
	if ($('#processo').val() == 'alt_pedido'
			&& $('#sequencia___' + seq).val() != "") {
		FLUIGC
				.toast({
					title : 'Valida&ccedil;&atilde;o: ',
					message : 'N&atilde;o &eacute; permitido excluir item original do pedido.',
					type : 'warning',
					timeout : 'fast'
				});
		return false;
	}*/
	fnWdkRemoveChild(oElement);
	
}

/*function getIdParentChild(element) {
	var form, row = null;
	var hasRow = false;
	var hasForm = false;
	console.log('element....', element);
	console.log('hasrow....', hasRow);
	console.log('hasform....', hasForm);
	while (element != null) {
		console.log('entrou while');
		if (element.id != null) {
			console.log('entrou if1');
			console.log('nodename ', element.nodeName.toUpperCase())
			if (!hasRow && element.nodeName.toUpperCase() == "TR") {
				console.log('entrou if2');
				row = element;
				hasRow = true;
				console.log('row...', row);
				break;
			} else {
				console.log('entrou if3');
				if (!hasForm && element.nodeName.toUpperCase() == "FORM") {
					console.log('entrou if4');
					form = element;
					hasForm = true;
				}
			}
		}
		element = element.parentNode;
		console.log('element2... ', element);
	}
	var arrayInput = $(row).find("input");
	$.each(arrayInput, function(index, input) {
		if ($(input).prop("readonly")) {
			console.log('entrou if readonly');
			$.each($(form).find("input[type=hidden]"),
							function(i, inputHidden) {
								var idInput = $(input).attr("name");
								var idInputHidden = "_"
										+ $(inputHidden).attr("name");
								if (idInput
										&& idInputHidden.valueOf() == idInput.valueOf()) {
									console.log('entrou if remove');
									$(inputHidden).remove();
								}
							});
		}
	});
	console.log(' row...... ', row);
	console.log(' parent...... ', $(row).attr('id'));
	return $(row).attr('id');
}*/

function isUndefined(campo) {
	if (campo == null || campo == undefined) {
		return "";
	} else {
		return campo;
	}
}

function nextPage() {
	if (validaAba(aba)) {
		$("#aba_" + aba).hide();
		if (aba == 1)
			$("#btn_cancel").show();
		aba++;
		$("#aba_" + aba).show();
		if (aba == abaTotal)
			$("#btn_confirma").hide();

		$('#current_step').html(aba);
		$('#total_steps').html(abaTotal);

		clearItem('movto');
		setCeiOBS();
	}
}

function lastPage() {
	if (aba == abaTotal)
		$("#btn_confirma").show();
	$("#aba_" + aba).hide();
	aba--;
	$("#aba_" + aba).show();
	if (aba == 1)
		$("#btn_cancel").hide();

	$('#current_step').html(aba);
	$('#total_steps').html(abaTotal);

	clearItem('movto');

}

var beforeSendValidate = function(numState, nextState) {

	console.log('Aba....' + aba);
	console.log('Valida....' + validaAba(aba));
	if ((aba == 4 || aba == 5) && validaAba(aba)) {
		if ($('#task').val() == "0" || $('#task').val() == "1"
				|| $('#task').val() == "33") {
			if ($('#processo').val() != 'alt_pedido') {
				alert("O Numero do pedido sera enviado posteriormente para seu e-mail cadastrado.");
			} else {
				alert("Uma copia do pedido sera enviado posteriormente para seu e-mail cadastrado.");
			}
		}
		return true;
	} else {
		return false;
	}
}

function autoSize() {
	$('textarea').each(
			function() {
				this.setAttribute('style', 'height:' + (this.scrollHeight + 32)
						+ 'px;overflow-y:hidden;');
			}).on('input', function() {
		// style="height: 32px; overflow-y: hidden;"
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
}

function setCorFilhos(id, color) {
	// console.log('entrei color',id);
	$('div, span', $('#' + id + '_grp')).each(function() {
		// console.log('entrei grupo color',
		// $(this).attr('class') );
		if ($(this).hasClass('bootstrap-tagsinput') /*
													 * ||
													 * $(this).hasClass('select2-selection--multiple')
													 */) {
			$($(this)).css({
				'background-color' : color
			});
		}
	});
}

function validaAba(aba) {

	if ($("#modo").val() == "VIEW") {
		return true;
	}

	var msg = '';
	var msg_valida = '';

	setFocus = true;

	if (aba == 4) {
		if (qtdItens() == 0) {
			msg += 'N&atilde;o existe itens no pedido! ';
		}
		if ($('#cod_item_edit').val() != ""
				|| $('#quantidade_edit').val() != ""
				|| $('#desconto_edit').val() != "") {
			msg += 'Existe item em edi&ccedil;&atilde;o! ';
		}
	}

	$('input, select', $('#aba_' + aba))
			.each(
					function() {

						if (($(this).attr('pf') != "S" || ($(this).attr('pf') == "S" && $(
								this).attr('name').indexOf('___') != -1))
						// && !$(this).attr( 'readonly' )
						) {

							// $( '#'+$(this).attr('id')
							// ).css({'background-color' : '#FFFFFF'});
							// setCorFilhos( $(this).attr('id'), '#FFFFFF' );

							console.log('ATR Valida......', $(this).attr(
									'valida'));
							if ($(this).attr('valida') != undefined
									&& $(this).attr('valida') != ""
									&& ($(this).val() == ""
											|| $(this).val() == null || $(this)
											.val() == undefined)) {

								$('#' + $(this).attr('id')).css({
									'background-color' : '#FFFFFF'
								});
								setCorFilhos($(this).attr('id'), '#FFFFFF');
								// ############
								// ############
								if (!((aba == 1 && $(this).attr('id') == 'cei')
										|| (aba == 3
												&& !$('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent')
										|| (aba == 3
												&& $('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent_sel') || (aba == 3
										&& $('#tipo_logradouro_ent').val() == ""
										&& $('#cep_ent').val() == ""
										&& $('#cidade_ent').val() == null
										&& $('#numero_ent').val() == ""
										&& $('#endereco_ent').val() == ""
										&& ($('#bairro_ent').val() == "" || $(
												'#bairro_ent_sel').val() == "") && ($(
										'#bairro_ent_sel').val() == ""
										|| $('#bairro_ent_sel').val() == null || $(
										'#bairro_ent_sel').val() == undefined)))) {
									$($(this)).css({
										'background-color' : '#FFE4C4'
									});
									setCorFilhos($(this).attr('id'), '#FFE4C4');
									msg += ' ' + $(this).attr('valida');

									if (setFocus) {
										setFocus = false;
										// $(this).focus();
										console.log('ID......'
												+ $(this).attr('id'));
										setTimeout("$('#" + $(this).attr('id')
												+ "').focus();", 1);
									}
								}
							}

							if (aba == 1
									&& $(this).attr('id') == 'cei'
									&& $.inArray($('#cod_tip_cli').val(),
											getListaTipoCliente()) > -1
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Tipo de cliente obriga informar CEI!';
							}

							if (aba == 1 && $(this).attr('id') == 'ped_cliente'
									&& $('#ies_inf_pedido').val() == 'S'
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Este cliente obriga informar o n&uacute;mero de pedido!';
							}

							if (aba == 2
									&& $(this).attr('id') == 'tipo_desconto'
									&& $('#pct_desc_adicional').val() != ""
									&& $('#pct_desc_adicional').val() != "0,00"
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Deve ser informado tipo de desconto!';
							}

							if ($(this).val() != '') {

								if ($(this).attr('regra') == 'cnpjcpf') {
									var valido = false;
									var tipo = '';
									if ($(this).val().indexOf('/0000-') == -1) {
										console.log('CNPJ...' + $(this).val()
												+ ' '
												+ $(this).val().substring(1));
										valido = validaCNPJ($(this).val()
												.substring(1));
										tipo = 'CNPJ';
									} else {
										console.log('CPF...'
												+ $(this).val()
												+ ' '
												+ $(this).val().replace(
														'/0000-', ''));
										valido = validaCPF($(this).val()
												.replace('/0000-', ''));
										tipo = 'CPF';
									}
									if (!valido) {
										$($(this)).css({
											'background-color' : '#FFA500'
										});
										setCorFilhos($(this).attr('id'),
												'#FFA500');
										msg_valida += ' ' + tipo
												+ ' Inv&aacute;lido!';
									}
								}

								if ($(this).attr('regra') == 'cnpj'
										&& !validaCNPJ($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CNPJ Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'cpf'
										&& !validaCPF($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CPF Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'cep'
										&& !validaCEP($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CEP Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'email'
										&& !validaEmail($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' E-Mail Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'ie'
										&& !validaIE($(this).val(), $(
												'#'
														+ $(this).attr(
																'campoEstado'))
												.val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' Inscri&ccedil;&atilde;o Estadual Inv&aacute;lido!';
								}

								if (msg_valida != '' && setFocus) {
									setFocus = false;
									// $(this).focus();
									setTimeout("$('#" + $(this).attr('id')
											+ "').focus();", 1);
								}

							}
						}
					});

	if (msg != "" || msg_valida != "") {
		if (msg != "") {
			FLUIGC.toast({
				title : 'Preenchimento: ',
				message : 'Voc&ecirc; deve informar os campos: ' + msg,
				type : 'warning',
				timeout : 'slow'
			});
		}
		if (msg_valida != "") {
			FLUIGC.toast({
				title : 'Valida&ccedil;&atilde;o: ',
				message : msg_valida,
				type : 'warning',
				timeout : 'slow'
			});
		}
		return false;
	}

	/*
	 * if ( aba == 1 && $('#tipo_cadastro').val() == 'N' && validaExistCNPJ(
	 * $('#cnpj').val() ) ){
	 * 
	 * var msgTipo = '';
	 * 
	 * if( $('#cnpj').val().indexOf('/0000-') == -1 ){ msgTipo = 'CNPJ j&atilde;
	 * cadastrado!!'; }else{ msgTipo = 'CPF j&atilde; cadastrado!!'; }
	 * 
	 * FLUIGC.toast({ title: 'Valida&ccedil;&atilde;o: ', message: msgTipo,
	 * type: 'danger', timeout: 'slow' }); return false; }
	 */

	return true;
}

/*
 * var confirmOnPageExit = function (e) { // If we haven't been passed the event
 * get the window.event e = e || window.event; var message = 'VocÃª deseja
 * continuar?'; // For IE6-8 and Firefox prior to version 4 if (e) {
 * e.returnValue = message; } // For Chrome, Safari, IE8+ and Opera 12+ return
 * message; };
 * 
 * window.onbeforeunload = confirmOnPageExit;
 */

function setMaskNumber(){
	
	$('.decimal_6').maskMoney({
		precision : 6,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_5').maskMoney({
		precision : 5,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_4').maskMoney({
		precision : 4,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_3').maskMoney({
		precision : 3,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_2').maskMoney({
		precision : 2,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_1').maskMoney({
		precision : 1,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_0').maskMoney({
		precision : 0,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.integer_0').maskMoney({
		precision : 0,
		thousands : '',
		decimal : '',
		defaultZero : true,
		allowZero : true
	});
	
}

function loadBody() {

	// alert( 'VarGlobal 1 ' );
	// alert( localStorage.getItem("teste1") );
	// console.log( 'VarGlobal 2', localStorage.getItem("teste2") );

	// window.onbeforeunload = false;
	if ($('#processo').val() == "inc_pedido") {
		if ($('#task').val() == "0" || $('#task').val() == "33" || $('#task').val() == "1") {
			$("#desc_medio").hide();
			$("#mix_geral").hide();
			$("#lb_desc_medio").hide();
			$("#lb_mix_geral").hide();
		}
	}
	
	if ($('#processo').val() == "alt_pedido") {
		if ($('#task').val() == "0" || $('#task').val() == "33" || $('#task').val() == "1") {
			$("#desc_medio").hide();
			$("#mix_geral").hide();
			$("#lb_desc_medio").hide();
			$("#lb_mix_geral").hide();
			
		}
	}

	$('#current_step').html(aba);
	$('#total_steps').html(abaTotal);

	var data_coleta = FLUIGC.calendar('#data_coleta');
	var data_entrega_edit = FLUIGC.calendar('#data_entrega_edit');

	autoSize();
	// parent.$('#workflowView-cardViewer').css( 'zIndex', 100 );

	console.log('set lista 001', $("#lista_preco").val());
	console.log('set lista 001', $("#lista_preco_hd").val());

	setMaskNumber();

	$(".validaAltera").focus(function() {
		console.log('entrei validaAltera focus');
		valAtu = this.value;
	});

	$(".validaAltera").blur(function() {
		console.log('entrei validaAltera blur');
		if (valAtu != this.value) {
			$('#seq_end').val("0");
		}
		valAtu = "";
	});

	$(".validaAltera").change(function() {
		console.log('entrei validaAltera change');
		if (valAtu != this.value) {
			$('#seq_end').val("0");
		}
		valAtu = "";
	});

	fnGerente('');
}

function setFilterCliente(qtd) {
	console.log('TIPO_CADASTRO_DE_USUARIO1', $('#tipoCadUser').val());
	console.log('setFilterCliente..... 1', qtd, $('#razao_social').val());
	if (qtd >= 1000
			|| (qtd == 0 && $('#razao_social').val() != ""
					&& $('#razao_social').val() != null && $('#razao_social').val() != undefined)) {
		console.log('PRIMEIRO IF.....', $('#razao_social').val());
		// loading.hide();
		return false;
	}
	try {
		// loading.show();
		if ($('#tipoCadUser').val() == 'A') {
			console.log('TIPO_CADASTRO_DE_USUARIO2', $('#tipoCadUser').val());
			reloadZoomFilterValues('razao_social', "");
		} else {
			console.log('Tipo .......',$('#processo').val());
			if ($('#razao_social').val() == ""
					|| $('#razao_social').val() == null ) {
				console.log("filter ......IES_PEDIDO,S,COD_USER,"+ $("#userFluig").val());
				reloadZoomFilterValues('razao_social', "IES_PEDIDO,S,COD_USER,"+$("#userFluig").val());
			} 
			if ($('#processo').val() == 'alt_pedido') {
				console.log('DISABLE CAMPO.......');
				zoomDestino = window[$("#razao_social").attr('filter-instance')];
				zoomDestino.disable(true);
				console.log('disable cliente.......');
			}
		}
		console.log('ANTES UPPER');
		setUpper();
		if ($('#editar').val() == 'S') {
			console.log('IF EDITAR.......');
			loadPedidoEdit($('#empresa').val(), $('#num_pedido').val());
		}
		// loading.hide();
	} catch (e) {
		console.log('erro.....', qtd, e);
		qtd += 1;
		setTimeout("setFilterCliente( " + qtd + " );", 10);
	}
}

function setUpper() {

	$("input")
			.keypress(
					function(e) {
						var chr = String.fromCharCode(e.which);
						var name_campo;
						name_campo = $(this).attr("name");

						if (name_campo == "data_coleta") {
							if ("'\"!#$%ÃÂ¨&*()+=\ÃÂ´`[]{}?;:>,<\|~ÃÃ§"
									.indexOf(chr) > 0) {
								return false;
							}
						} else {
							if ("'\"!@#$%ÃÂ¨&*()_+=-\ÃÂ´`[]{}/?;:.>,<\|~ÃÃ§"
									.indexOf(chr) > 0) {
								return false;
							}
						}
					});

	$("input").keyup(function() {
		$(this).val($(this).val().toUpperCase());
	});
}

function maskFone(id) {
	if ($('#' + id).val().length > 14) {
		$('#' + id).unmask();
		$('#' + id).mask("(99) 99999-9999");
	} else {
		$('#' + id).unmask();
		$('#' + id).mask("(99) 9999-9999?9");
	}
}

function mascara(src, mask) {
	var i = src.value.length;
	var saida = mask.substring(0, 1);
	var texto = mask.substring(i);
	if (texto.substring(0, 1) != saida) {
		src.value += texto.substring(0, 1);
	}
}

function alteraCampos(idCampo, campo1, campo2) {
	if ($("#" + idCampo).is(':checked')) {
		$('#' + campo1).hide();
		$('#' + campo2).show();
	} else {
		$('#' + campo1).show();
		$('#' + campo2).hide();
	}
}

function setSemNumero(idCampo, idCampoNum, idCampoUF) {
	if ($("#" + idCampo).is(':checked')) {
		$('#' + idCampoNum).attr('readonly', true);
		$('#' + idCampoNum).attr('type', 'text');
		$('#' + idCampoNum).css('background-color', '#DEDEDE');
		$('#' + idCampoNum).val('S/N');
	} else {
		$('#' + idCampoNum).attr('readonly', false);
		$('#' + idCampoNum).attr('type', 'number');
		$('#' + idCampoNum).css('background-color', '#FFFFFF');
		$('#' + idCampoNum).val();
	}
}

function setIsento(idCampo, idCampoIE, idCampoUF) {
	console.log('IE_________');
	if ($("#" + idCampo).is(':checked')) {
		$('#' + idCampoIE).unmask();
		$('#' + idCampoIE).attr('readonly', true);
		$('#' + idCampoIE).css('background-color', '#DEDEDE');
		$('#' + idCampoIE).val('ISENTO');
	} else {
		$('#' + idCampoIE).unmask();
		$('#' + idCampoIE).attr('readonly', false);
		$('#' + idCampoIE).css('background-color', '#FFFFFF');
		if ($('#' + idCampoIE).val() == 'ISENTO') {
			console.log('IE_________');
			$('#' + idCampoIE).val('');
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
		} else {
			var tmp = $('#' + idCampoIE).val();
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
			console.log('IE_________' + tmp);
			$('#' + idCampoIE).val(tmp);
		}

	}
}

var mascaraIE = {
	'RS' : '999-9999999',
	'SC' : '999.999.999',
	'PR' : '99999999-99',
	'SP' : '999.999.999.999',
	'MG' : '999.999.999/9999',
	'RJ' : '99.999.99-9',
	'ES' : '999.999.99-9',
	'BA' : '999.999.99-9',
	'SE' : '999999999-9',
	'AL' : '999999999',
	'PE' : '99.9.999.9999999-9',
	'PB' : '99999999-9',
	'RN' : '99.999.999-9',
	'PI' : '999999999',
	'MA' : '999999999',
	'CE' : '99999999-9',
	'GO' : '99.999.999-9',
	'TO' : '99999999999',
	'MT' : '999999999',
	'MS' : '999999999',
	'DF' : '99999999999-99',
	'AM' : '99.999.999-9',
	'AC' : '99.999.999/999-99',
	'PA' : '99-999999-9',
	'RO' : '999.99999-9',
	'RR' : '99999999-9',
	'AP' : '999999999'
};

function setMaskIE(uf, id) {
	$('#' + id).unmask();
	$('#' + id).val('');
	if (mascaraIE.hasOwnProperty(uf))
		$('#' + id).mask(mascaraIE[uf]);
}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}

function removeLote() {
	if ($('#cod_item_edit').val() == "") {
		return false;
	}
	var quant = isNull(Math.round(parseFloat($('#quantidade_edit').val()
			.replace('.', '').replace(',', '.')) * 100) / 100, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad_edit').val()
			.replace('.', '').replace(',', '.')) * 100) / 100, 1);
	if (quant <= 0) {
		return false;
	}
	$('#quantidade_edit').val(
			String((quant - quant_mult).toFixed(0)).replace('.', ','));
	calcDescTotal('quantidade_mais');
	if (quant - quant_mult <= 0) {
		$('#quantidade_edit').val("");
	}
}

function addLote() {
	if ($('#cod_item_edit').val() == "") {
		return false;
	}
	var quant = isNull(Math.round(parseFloat($('#quantidade_edit').val()
			.replace('.', '').replace(',', '.')) * 100) / 100, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad_edit').val()
			.replace('.', '').replace(',', '.')) * 100) / 100, 1);
	$('#quantidade_edit').val(
			String((quant + quant_mult).toFixed(0)).replace('.', ','));
	calcDescTotal('quantidade_menus');
}

function calcDescTotal(id) {

	console
			.log('Calculo....AAAA....', id, ' valor ', $('#desconto_edit')
					.val());

	if ($('#cod_item_edit').val() == "") {
		$('#quantidade_edit').val("");
		$('#desconto_edit').val("");
		$('#valor_unit_edit').val("");
	} else {
		if ($('#desconto_edit').val() == "") {
			$('#desconto_edit').val("0,00");
		}
	}

	if (id.indexOf('___') < 0) {
		seq = '_edit';
	} else {
		seq = '___' + id.split('___')[1];
	}

	console.log('Calculo....BBBB.....', '#valor_unit_lista' + seq, $(
			'#valor_unit_lista' + seq).val());

	var val_lista = isNull(Math.round(parseFloat($('#valor_unit_lista' + seq)
			.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var val_item = isNull(Math.round(parseFloat($('#valor_unit' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var perc_desc_tab = isNull(Math.round(parseFloat($('#pct_desc_adic' + seq)
			.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var perc_desc = isNull(Math.round(parseFloat($('#desconto' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var perc_desc_ped = isNull(Math.round(parseFloat($('#pct_desc_adicional')
			.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var quant = isNull(Math.round(parseFloat($('#quantidade' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 1);

	/*
	 * if ( id == 'desconto_edit' ){ $('#valor_unit_edit').val( String( (
	 * val_lista - ( val_lista perc_desc / 100 ) ).toFixed(3) ).replace('.',',') ); }
	 * else
	 */
	if (id == 'valor_unit_edit') {
		if (val_lista > val_item) {
			FLUIGC
					.toast({
						title : 'Pre&ccedil;o: ',
						message : 'Pre&ccedil;o Unit&aacute;rio nÃÂÃÂÃÂÃÂ£o pode ser inferior a R$: '
								+ String(val_lista.toFixed(3))
										.replace('.', ','),
						type : 'warning',
						timeout : 'fast'
					});
			// $('#valor_unit_edit').focus();
			setTimeout("$('#valor_unit" + seq + "').focus();", 1);
			return false;
		}
	}

	console.log('Teste ', quant % quant_mult);

	if (id == "quantidade_edit") {
		if ((quant % quant_mult) != 0) {

			// $('#quantidade_edit').focus();
			setTimeout("$('#quantidade_edit').focus();", 1);

			FLUIGC.toast({
				title : 'Quantidade: ',
				message : 'A quantidade deve ser multiplo de: '
						+ String(quant_mult.toFixed(0)).replace('.', ','),
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	var val_calc = val_item - (val_item * perc_desc_ped / 100);
	val_calc = val_calc - (val_calc * perc_desc / 100);

	var val_bruto = val_item;
	var val_minimo = val_item - (val_item * perc_desc_tab / 100);

	$('#valor_total' + seq).val(
			String((val_calc * quant).toFixed(3)).replace('.', ','));

	if (id == "grava_edit" && $("#sequencia_edit").val() == "") {

		if ((val_calc * quant) < 0.001) {

			if (quant == 0) {
				setTimeout("$('#quantidade_edit').focus();", 1);
			} else {
				setTimeout("$('#desconto_edit').focus();", 1);
			}

			FLUIGC.toast({
				title : 'Valor Total: ',
				message : 'Valor total do item n&atilde;o pode ser zerado.',
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	return {
		'total_liquido' : val_calc * quant,
		'total_bruto' : val_bruto * quant,
		'total_minimo' : val_minimo * quant
	};

}

function gravaItem(table, alteraMotivo) {

	if ($('#cod_item_edit').val() == "" || !calcDescTotal('grava_edit')) {
		return false;
	}

	var total = isNull(Math.round(parseFloat($('#valor_total_edit').val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	if ($('#sequencia_edit').val() == "" && total == 0) {
		FLUIGC.toast({
			title : 'Valida&ccedil;&atilde;o: ',
			message : 'Item com valor zerado.',
			type : 'warning',
			timeout : 'fast'
		});
		setTimeout("$('#cod_item_edit').focus();", 1);
		return false;
	}

	if ($('#ies_inf_pedido').val() == 'N'
			&& ($('#linha_edit').val() == null
					|| $('#linha_edit').val() == undefined
					|| $('#linha_edit').val() == "" || $('#linha_edit').val() == "0")) {
		var duplicado = 'N';
		$("input[name^='cod_item___']")
				.each(
						function() {
							console.log('Item...', $(this).val());
							if ($(this).val() == $('#cod_item_edit').val()) {
								FLUIGC
										.toast({
											title : 'Valida&ccedil;&atilde;o: ',
											message : 'N&atilde;o &eacute; permitido informar item duplicado',
											type : 'warning',
											timeout : 'fast'
										});
								duplicado = 'S';
								setTimeout("$('#cod_item_edit').focus();", 1);
								return false;
							}
						});
		if (duplicado == 'S') {
			setTimeout("$('#cod_item_edit').focus();", 1);
			return false;
		}
	}

	if ($('#ies_inf_pedido').val() == 'S') {
		var msg = "";
		if ($('#pedido_cli_edit').val() == "") {
			$($('#pedido_cli_edit')).css({
				'background-color' : '#FFE4C4'
			});
			msg += ' N&uacute;mero de pedido n&atilde;o informado!';
			setTimeout("$('#pedido_cli_edit').focus();", 1);
		} else {
			$($('#pedido_cli_edit')).css({
				'background-color' : '#FFFFFF'
			});
		}
		if ($('#seq_pedido_cli_edit').val() == "") {
			$($('#seq_pedido_cli_edit')).css({
				'background-color' : '#FFE4C4'
			});
			msg += ' Sequencia do item no pedido n&atilde;o informado!';
			setTimeout("$('#seq_pedido_cli_edit').focus();", 1);
		} else {
			$($('#seq_pedido_cli_edit')).css({
				'background-color' : '#FFFFFF'
			});
		}
		if (msg != "") {
			FLUIGC.toast({
				title : 'Valida&ccedil;&atilde;o: ',
				message : msg,
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	if ($('#desconto_edit').val() != "" && $('#tipo_desconto').val() == ""
			&& $('#desconto_edit').val() != "0,00") {
		setTipDescModal();
		return false;
	}

	var seq = "0";
	console.log('grava_000');
	if ($('#linha_edit').val() == '0') {
		seq = wdkAddChild(table);
	} else {
		seq = $('#linha_edit').val();
	}

	var qtd = isNull(Math.round(parseFloat($('#quantidade_edit').val().replace(
			'.', '').replace(',', '.')) * 10000) / 10000, 0);
	var qtd_orig = isNull(Math.round(parseFloat($('#qtd_orig___' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);

	console.log('Antes..... load motivo..... ', $('#cod_motivo_edit').val(),
			alteraMotivo, qtd, qtd_orig);
	if ((qtd < qtd_orig && $('#cod_motivo_edit').val() == "")
			|| (qtd < qtd_orig && alteraMotivo == true)) {
		console.log('dentro..... load motivo..... ');
		setMotCancelModal();
		return false;
	}
	console.log('Depois..... load motivo..... ');

	console.log('grava_001');

	$('#cod_item___' + seq).val($('#cod_item_edit').val());
	$('#peso___' + seq).val($('#peso_edit').val());
	$('#qtd_pad___' + seq).val($('#qtd_pad_edit').val());

	$('#cod_lin_prod___' + seq).val($('#cod_lin_prod_edit').val());
	$('#cod_lin_recei___' + seq).val($('#cod_lin_recei_edit').val());
	$('#cod_seg_merc___' + seq).val($('#cod_seg_merc_edit').val());
	$('#cod_cla_uso___' + seq).val($('#cod_cla_uso_edit').val());
	$('#cod_grupo_item___' + seq).val($('#cod_grupo_item_edit').val());
	$('#cod_tip_carteira___' + seq).val($('#cod_tip_carteira_edit').val());
	$('#um___' + seq).val($('#um_edit').val());
	$('#data_entrega___' + seq).val($('#data_entrega_edit').val());

	$('#valor_unit___' + seq).val($('#valor_unit_edit').val());
	$('#valor_unit_lista___' + seq).val($('#valor_unit_lista_edit').val());
	$('#pct_desc_adic___' + seq).val($('#pct_desc_adic_edit').val());

	if ($('#desconto_edit').val() == "") {
		$('#desconto___' + seq).val("0,00");
	} else {
		$('#desconto___' + seq).val($('#desconto_edit').val());
	}

	// $('#desconto___'+seq).val( $('#desconto_edit').val( ) );
	$('#quantidade___' + seq).val($('#quantidade_edit').val());
	$('#qtd_pad___' + seq).val($('#qtd_pad_edit').val());
	$('#valor_total___' + seq).val($('#valor_total_edit').val());

	$('#den_item___' + seq).val($('#den_item_edit').val());
	$('#den_item_reduz___' + seq).val($('#den_item_reduz_edit').val());

	$('#pedido_cli_item___' + seq).val($('#pedido_cli_edit').val());
	$('#seq_pedido_cli_item___' + seq).val($('#seq_pedido_cli_edit').val());

	$('#obs_item_1___' + seq).val($('#obs_item_1_edit').val());
	$('#obs_item_2___' + seq).val($('#obs_item_2_edit').val());
	$('#obs_item_3___' + seq).val($('#obs_item_3_edit').val());
	$('#obs_item_4___' + seq).val($('#obs_item_4_edit').val());
	$('#obs_item_5___' + seq).val($('#obs_item_5_edit').val());

	$('#ies_mix___' + seq).val($('#ies_mix_edit').val());
	$('#cod_motivo___' + seq).val($('#cod_motivo_edit').val());

	$('#sequencia___' + seq).val($('#sequencia_edit').val());

	clearItem('cod_item');

	$('#linha_edit').val('0');

	atulizaRecalcTotal('grava_edit');

}

function editItem(id) {

	var seq = id.split('___')[1];

	// var objDestino = { inputId:'den_item_edit', inputName:'den_item_edit',
	// cod_item:$('#cod_item___'+seq).val( ),
	// den_item:$('#den_item___'+seq).val( ) };
	zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
	zoomDestino.setValue($('#den_item___' + seq).val());

	$('#linha_edit').val(seq);

	$('#cod_item_edit').val($('#cod_item___' + seq).val());
	$('#peso_edit').val($('#peso___' + seq).val());
	$('#qtd_pad_edit').val($('#qtd_pad___' + seq).val());

	$('#cod_lin_prod_edit').val($('#cod_lin_prod___' + seq).val());
	$('#cod_lin_recei_edit').val($('#cod_lin_recei___' + seq).val());
	$('#cod_seg_merc_edit').val($('#cod_seg_merc___' + seq).val());
	$('#cod_cla_uso_edit').val($('#cod_cla_uso___' + seq).val());
	$('#cod_grupo_item_edit').val($('#cod_grupo_item___' + seq).val());
	$('#cod_tip_carteira_edit').val($('#cod_tip_carteira___' + seq).val());
	$('#um_edit').val($('#um___' + seq).val());
	$('#data_entrega_edit').val($('#data_entrega___' + seq).val());

	$('#valor_unit_edit').val($('#valor_unit___' + seq).val());
	$('#valor_unit_lista_edit').val($('#valor_unit_lista___' + seq).val());
	$('#pct_desc_adic_edit').val($('#pct_desc_adic___' + seq).val());

	if ($('#desconto___' + seq).val() == "") {
		$('#desconto_edit').val("0,00");
	} else {
		$('#desconto_edit').val($('#desconto___' + seq).val());
	}
	$('#quantidade_edit').val($('#quantidade___' + seq).val());
	$('#qtd_pad_edit').val($('#qtd_pad___' + seq).val());
	$('#valor_total_edit').val($('#valor_total___' + seq).val());

	$('#den_item_reduz_edit').val($('#den_item_reduz___' + seq).val());

	$('#pedido_cli_edit').val($('#pedido_cli_item___' + seq).val());
	$('#seq_pedido_cli_edit').val($('#seq_pedido_cli_item___' + seq).val());

	$('#obs_item_1_edit').val($('#obs_item_1___' + seq).val());
	$('#obs_item_2_edit').val($('#obs_item_2___' + seq).val());
	$('#obs_item_3_edit').val($('#obs_item_3___' + seq).val());
	$('#obs_item_4_edit').val($('#obs_item_4___' + seq).val());
	$('#obs_item_5_edit').val($('#obs_item_5___' + seq).val());

	$('#ies_mix_edit').val($('#ies_mix___' + seq).val());
	if ($('#cod_motivo___' + seq).val() != "") {
		$('#cod_motivo_edit').val($('#cod_motivo___' + seq).val());
	}

	$('#sequencia_edit').val($('#sequencia___' + seq).val());

	setTimeout("$('#cod_item_edit').focus();", 1);

}

function atulizaRecalcTotal(id) {

	var total = 0.0;
	var qtd_tot = 0.0;
	var qtd_mix = 0.0;
	var qtd_desc_sup = 0.0;
	var total_bruto = 0.0;
	var total_minimo = 0.0;

	$("input[name^='cod_item___']")
			.each(
					function() {
						console.log('Item...', $(this).attr('name'));

						var oTotal = calcDescTotal($(this).attr('name'));

						total += oTotal.total_liquido;
						total_bruto += oTotal.total_bruto;
						total_minimo += oTotal.total_minimo;

						var seq = $(this).attr('name').split('___')[1];

						console.log('Qtd ', $('#quantidade___' + seq).val());
						console.log('Peso ', $('#peso___' + seq).val());

						var qtd = isNull((Math.round(parseFloat($(
								'#quantidade___' + seq).val().replace('.', '')
								.replace(',', '.')) * 10000) / 10000)
								* Math.round(parseFloat($('#peso___' + seq)
										.val().replace('.', '').replace(',',
												'.')) * 10000) / 10000, 0);
						qtd_tot += qtd;
						if ($('#ies_mix___' + seq).val() == 'S') {
							qtd_mix += qtd;
						}
						console.log('Qtd Total', qtd_tot);
						console.log('Qtd Mix', qtd_mix);
						console.log('Valor', total);

						var desc = isNull((Math.round(parseFloat($(
								'#desconto___' + seq).val().replace('.', '')
								.replace(',', '.')) * 10000) / 10000), 0);
						var desc_tabela = isNull((Math.round(parseFloat($(
								'#pct_desc_adic___' + seq).val().replace('.',
								'').replace(',', '.')) * 10000) / 10000), 0);

						if (desc > desc_tabela) {
							qtd_desc_sup += 1;
						}
					});
	console.log('Valor Total', String((total).toFixed(3)).replace('.', ','));

	var mix = 0;
	if (qtd_tot != 0) {
		mix = (qtd_mix / qtd_tot) * 100;
		console.log('Mix', mix);
	}

	var max_desc = 0;
	if (total_bruto != 0) {
		max_desc = (total_bruto - total_minimo) / total_bruto * 100;
		console.log('Max Desc', max_desc);
	}

	var med_desc = 0;
	if (total_bruto != 0) {
		med_desc = (total_bruto - total) / total_bruto * 100;
		console.log('Max Desc', max_desc);
	}

	$('#mix_geral').val(String((mix).toFixed(2)).replace('.', ','));
	$('#valor_total_geral').val(String((total).toFixed(2)).replace('.', ','));
	$('#qtd_item_desc_sup').val(
			String((qtd_desc_sup).toFixed(2)).replace('.', ','));

	$('#valor_minimo').val(String((total_minimo).toFixed(2)).replace('.', ','));
	$('#valor_bruto').val(String((total_bruto).toFixed(2)).replace('.', ','));
	$('#desc_medio').val(String((med_desc).toFixed(2)).replace('.', ','));
	$('#desc_maximo').val(String((max_desc).toFixed(2)).replace('.', ','));

	if (parseFloat($('#desc_medio').val().replace(',', '.')) > parseFloat($(
			'#desc_maximo').val().replace(',', '.'))
			+ parseFloat($('#perc_desc_ger_reg').val().replace(',', '.'))) {
		$('#ies_desc_medio_reg').val('S');
	} else {
		$('#ies_desc_medio_reg').val('N');
	}

	if (parseFloat($('#mix_geral').val().replace(',', '.')) <= parseFloat($(
			'#perc_mix_ger_reg').val().replace(',', '.'))) {
		$('#ies_mix_geral_reg').val('S');
	} else {
		$('#ies_mix_geral_reg').val('N');
	}

	if (parseFloat($('#desc_medio').val().replace(',', '.')) > parseFloat($(
			'#desc_maximo').val().replace(',', '.'))
			+ parseFloat($('#perc_desc_ger_nac').val().replace(',', '.'))) {
		$('#ies_desc_medio_nac').val('S');
	} else {
		$('#ies_desc_medio_nac').val('N');
	}

	if (parseFloat($('#mix_geral').val().replace(',', '.')) <= parseFloat($(
			'#perc_mix_ger_nac').val().replace(',', '.'))) {
		$('#ies_mix_geral_nac').val('S');
	} else {
		$('#ies_mix_geral_nac').val('N');
	}
}

function validaPedSeq(id) {
	if ($('#cod_item_edit').val() == "") {
		$('#' + id).val("");
		return false;
	}
}

function qtdItens() {
	var total = 0;
	$("input[name^='cod_item___']").each(function() {
		total += calcDescTotal($(this).attr('name')).total_liquido;
	});
	return total;
}

function setObsItem() {

	if ($('#inf_obs').is(":checked") && $('#cod_item_edit').val() != "") {
		$('#obs_item').show();
	} else {
		$('#obs_item').hide();
		$('#inf_obs').prop("checked", false);
	}
}

function setCeiOBS() {
	console.log('CEI.......' + $('#cei').val());
	if ($('#cei').val().trim() != "" && $('#cei').val().trim() != undefined
			&& $('#cei').val().trim() != null) {
		$('#texto_nf_1').val('CEI: ' + $('#cei').val());
		// $('#texto_nf_1').prop("readonly",true);
	}// else{
	// $('#texto_nf_1').prop("readonly",false);
	// }
}

function setTipDescModal() {

	html = $('#div_tip_desc').html();
	html = html.replace('id="tipo_desconto"', 'id="tipo_desconto_mod"');
	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Tipo Desconto.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('.confirmar').click(function() {
				$('#tipo_desconto').val($('#tipo_desconto_mod').val());
				gravaItem('ped_itens', true);
			});
		}
	});
}

function setMotCancelModal() {

	html = $('#div_mot_cancel').html();
	html = html.replace('id="mot_cancel"', 'id="mot_cancel_mod"');
	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Motivo Cancelamento.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('#mot_cancel_mod').val($('#cod_motivo_edit').val());
			$('.confirmar').click(function() {
				$('#cod_motivo_edit').val($('#mot_cancel_mod').val());
				gravaItem('ped_itens', false);
			});
		}
	});
}

function getDescModal(preco, desc) {

	var valUnit = Math.round(parseFloat($('#valor_unit_edit').val().replace(
			'.', '').replace(',', '.')) * 10000) / 10000;

	html = "<div> Deseja utilizar o valor da ultima venda. <br>";
	if (preco > valUnit) {
		html += " Pre&ccedil;o: R$ "
				+ String((preco).toFixed(3)).replace('.', ',') + " <br> ";
	}
	html += " Desconto: " + String((desc).toFixed(2)).replace('.', ',')
			+ "% </div>";

	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Desconto.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('.confirmar').click(
					function() {
						if (preco > valUnit) {
							$('#valor_unit_edit').val(
									String((preco).toFixed(3))
											.replace('.', ','));
						}
						$('#desconto_edit').val(
								String((desc).toFixed(2)).replace('.', ','));
						calcDescTotal('ultimo_preco');
						// $('#tipo_desconto').val(
						// $('#tipo_desconto_mod').val() );
						gravaItem('ped_itens', true);
					});
		}
	});
}

function converteMoeda(valor) {
	var inteiro = null, decimal = null, c = null, j = null;
	var aux = new Array();
	valor = "" + valor;
	c = valor.indexOf(".", 0);
	// encontrou o ponto na string
	if (c > 0) {
		// separa as partes em inteiro e decimal
		inteiro = valor.substring(0, c);
		decimal = valor.substring(c + 1, valor.length);
	} else {
		inteiro = valor;
	}

	// pega a parte inteiro de 3 em 3 partes
	for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
		aux[c] = inteiro.substring(j - 3, j);
	}

	// percorre a string acrescentando os pontos
	inteiro = "";
	for (c = aux.length - 1; c >= 0; c--) {
		inteiro += aux[c] + '.';
	}
	// retirando o ultimo ponto e finalizando a parte inteiro

	inteiro = inteiro.substring(0, inteiro.length - 1);

	decimal = parseInt(decimal);
	if (isNaN(decimal)) {
		decimal = "00";
	} else {
		decimal = "" + decimal;
		if (decimal.length === 1) {
			decimal = "0" + decimal;
		}
	}

	valor = inteiro + "," + decimal;

	return valor;

}

function alteraPreco(id) {

	if (isNull(Math.round(parseFloat($('#valor_unit_edit').val().replace('.',
			'').replace(',', '.')) * 10000) / 10000, 0) != 0
			&& isNull(Math.round(parseFloat($('#valor_unit_lista_edit').val()
					.replace('.', '').replace(',', '.')) * 10000) / 10000, 0) == 0) {

		$('#' + id).val('0.000');
		FLUIGC
				.toast({
					title : 'Preco: ',
					message : 'Nao é permitido alterar preco, se nao localizado preco do item na lista de preco.',
					type : 'danger',
					timeout : 'slow'
				});
		setTimeout("$('#valor_unit_edit').focus();", 1);
	}

}

function fnFirstDefault( campo ){
	
	var row = 9999;
	$( "input[name*="+campo.substring( 0, campo.indexOf('___')+3 )+"]" ).each(function( index ) {
			if ($(this).prop("checked") == true){
				row = 9999;
				return false;
			}
			var rowAtu = parseInt( $(this).attr('name').substring( $(this).attr('name').indexOf('___')+3, $(this).attr('name').length ) );
			if ( rowAtu < row ){
				 row = rowAtu;
			}
	}); 
	if ( row != 9999){
		$( '#'+campo.substring( 0, campo.indexOf('___')+3 )+row ).prop("checked", true); 
	}
}