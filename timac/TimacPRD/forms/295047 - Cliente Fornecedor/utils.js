//mascara dos campos precisa do jquery.maskMoney.min.js
function setMask(){
	// console.log('setMask');
	$('.decimal-6').maskMoney({precision : 6,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true,allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.integer-0').maskMoney({precision : 0,thousands : '.',decimal : '', defaultZero : true,allowZero : true});
	$(".telefone").mask("(00) 0000-00009");
	//$(".maskFone").mask("(99) 9999-9999?9");
	$(".cep").mask("99999-999");
	FLUIGC.calendar('.data-fluig' );
	FLUIGC.calendar('.data-hora', {pickDate: true, pickTime: true, sideBySide: true } );

	// Mascara de CPF e CNPJ mesmo campo
	// var CpfCnpjMaskBehavior = function (val) {
	// 	return /*val.replace(/\D/g, '').length <= 11 ? '000.000.000-009' :*/ '000.000.000/0000-00';
	// },
	
	// cpfCnpjpOptions = {
	// 	onKeyPress: function(val, e, field, options) {
	// 		field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
	// 	}
	// };

	$('.cnpj_cpf').mask("000.000.000/0000-00");

    //setMaskIE( $('#cod_uni_feder').val(), 'ins_estadual' );
}

function onlynumber(evt) {
	   var theEvent = evt || window.event;
	   var key = theEvent.keyCode || theEvent.which;
	   key = String.fromCharCode( key );
	   //var regex = /^[0-9.,]+$/;
	   var regex = /^[0-9.\-//]+$/;
	   if( !regex.test(key) ) {
	      theEvent.returnValue = false;
	      if(theEvent.preventDefault) theEvent.preventDefault();
	   }
	}

function maskFone( id ){
	if($('#'+id).val().length > 14 ) {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 99999-9999");  
	} else {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 9999-9999?9");  
	} 
}

var mascaraIE = {
		'RS': '999-9999999',
		'SC': '999.999.999',
		'PR': '99999999-99',
		'SP': '999.999.999.999',
		'MG': '999.999.999/9999',
		'RJ': '99.999.99-9',
		'ES': '999.999.99-9',
		'BA': '999.999.999',
		'SE': '999999999-9',
		'AL': '999999999',
		//'PE': '99.9.999.9999999-9',
		'PE': '9999999-99',
		'PB': '99999999-9',
		'RN': '99.999.999-9',
		'PI': '999999999',
		'MA': '999999999',
		'CE': '99.999999-9',
		'GO': '99.999.999-9',
		'TO': '99999999999',
		'MT': '999999999',
		'MS': '999999999',
		'DF': '99999999999-99',
		'AM': '99.999.999-9',
		'AC': '99.999.999/999-99',
		'PA': '99-999999-9',
		'RO': '999.99999-9',
		'RR': '99999999-9',
		'AP': '999999999'
	};

function setMaskIE( uf, id ){
	var vIE = $('#'+id).val();
	if( uf == "" || uf == undefined || uf == null || uf == "null" ){
		$('#'+id).attr( 'readonly', true );
		$('#'+id).unmask();
		return false;
	}
	$('#'+id).attr( 'readonly', false );
	if ( mascaraIE.hasOwnProperty(uf) ){
		$('#'+id).val('');
		$('#'+id).mask( mascaraIE[uf] );
		setTimeout( "$('#"+id+"').val( '"+ vIE +"' )", 10 );
	}
}


/*** Funções para controle de pai fiho ***/
	//Adiciona filho na table não funciona em widget
	/*function addFilho(table, campo, btn) {
		
		if( bloqueio ){
			return false;
		}
		
		var row = wdkAddChild(table);
		setMask();

		if( table == "end_entrega" ){
			$('#ies_cpf_cnpj_entrega___'+row ).val("CNPJ")
			controleCpfCnpjEndereco( 'ies_cpf_cnpj_entrega___'+row );
		}
		
		return row;
	}*/
	
	//Deleta filho da table
	function fnCustomDelete(oElement) {
		fnWdkRemoveChild(oElement);
	}

	//Deleta filho com mensagem de confirmação
	function itemremove(oElement){	  
		if( bloqueio ){
			return false;
		}
		if( confirm("Deseja remover o item?") ){
			fnWdkRemoveChild(oElement);
		}
	}

/*** Funções para controle de formulário ***/
	//Remove atributo readOnly dos campos
	function removeReadOnly(campos) {
		var campo = campos.split(',');
		for (var i = 0; i < campo.length; ++i) {
			$('#'+campo[i]).removeAttr('readonly');
		}
	}

	//Habilita ou Desabilita delete e pesquisa do formulario
	function setInvisible(campos, divs) {
		var lista_campos = campos.split(",");
		var lista_divs = divs.split(",");

		var x = 0;
		for (x; x < lista_campos.length; x++) {
			$(lista_campos[x]).attr('style', 'display:none');
		}
		x = 0;
		for (x; x < lista_divs.length; x++) {
			$(lista_divs[x]).attr('class', '');
		}
	}

	//Desabilita entrada de dados
	function readOnlyAll(obj) {
		$(obj + ' input, '+obj+' textarea, '+obj+' select').each(function () {
			
			if( $(this).attr('id') == undefined ){
				return true;
			}
			
			if( $(this).is('select') ){
				$('#'+ $(this).attr('id') +' option:not(:selected)').attr('disabled', 'disabled');
			}
			
			if( $(this).prop("type") == "checkbox" ) {
				$(this).prop("disabled", true);
			}else{
				$(this).attr('readonly',true);
			}
			
			// $(this).attr("readonly", true);
		});
	}

	function readOnlyAllK( tipo, grupo ){
		console.log('Entrei Read Only....');
		if( grupo == undefined || grupo == "" ){
			$('input, select, textarea').each(function(){
				
				if( $(this).attr('id') == undefined ){
					return true;
				}
				
				var vnTIpo = tipo;
				if( $(this).hasClass('readonly') ){
					vnTIpo = true;
				}
				//console.log('Entrei Read Only campo....',$(this).attr('id'));
				if( $(this).is('select') ){			
					if( vnTIpo )
						$('#'+ $(this).attr('id') +' option:not(:selected)').attr('disabled', 'disabled');
					else
						$('#'+ $(this).attr('id') +' option:not(:selected)').removeAttr('disabled');
				}else{
					if( $(this).prop("type") == "checkbox" ) {
						$(this).prop("disabled", vnTIpo);
					}else{
						$(this).attr('readonly',vnTIpo);
					}
				}
				/*if( !tipo ){
					$(this).css({'background-color' : '#FFFFFF', 'color': 'black' });
				}*/
			});
		}else{
			$(grupo).each(function(){
				
				if( $(this).attr('id') == undefined ){
					return true;
				}
				
				var vnTIpo = tipo;
				if( $(this).hasClass('readonly') ){
					vnTIpo = true;
				}
				//console.log('Entrei Read Only campo....',$(this).attr('id'));
				if( $(this).is('select') ){			
					if( vnTIpo )
						$('#'+ $(this).attr('id') +' option:not(:selected)').attr('disabled', 'disabled');
					else
						$('#'+ $(this).attr('id') +' option:not(:selected)').removeAttr('disabled');
				}else{
					if( $(this).prop("type") == "checkbox" ) {
						$(this).prop("disabled", vnTIpo);
					}else{
						$(this).attr('readonly',vnTIpo);
					}
					if( vnTIpo ){
						$(this).removeClass('decimal-7');
						$(this).removeClass('decimal-6');
						$(this).removeClass('decimal-5');
						$(this).removeClass('decimal-4');
						$(this).removeClass('decimal-3');
						$(this).removeClass('decimal-2');
						$(this).removeClass('decimal-1');
						$(this).removeClass('decimal-0');
						$(this).removeClass('integer-0');
						$(this).removeClass('data-fluig');
					}
				}
				/*if( !tipo ){
					$(this).css({'background-color' : '#FFFFFF', 'color': 'black' });
				}*/
			});
		}
	}
	
	//Desabilita entrada de dados
	function removeEdicao(obj) {
		$(obj).each(function () {
			if( $(this).is('select') ){
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', true);
			}
			$(this).attr('readonly',true);
			// $(this).attr("readonly", true);
		});
	}

	//Habilita entrada de dados
	function habilitaEdicao(obj) {
		$(obj).each(function () {
			if( $(this).is('select') ){
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', false);
			}
			$(this).removeAttr('readonly');
			// $(this).attr("readonly", true);
		});
	}

	//Desabilita pesquisa do input
	function disableSeach(obj) {
		$(obj + ' div').each(function(){
			if ( $(this).hasClass('input-group') && !$(this).hasClass('notHide')){
				$(this).removeClass('input-group');
				$(this).children().each(function(){
					if( $(this).hasClass('input-group-addon') ){
						$(this).hide();
					};
				});
			};
		});
	}

	//Habilita pesquisa do input
	function enableSeach(obj) {
		$(obj + ' div').each(function(){
			$(this).addClass('input-group')
			$(this).children().each(function(){
				if( $(this).hasClass('input-group-addon') ){
					$(this).show();
				};
			});
		});
	}


	//Busca dados do Cnpj da Receita
	function cnpj_receita(cnpj, cb){
		var wcnpj = cnpj.replace(/\D/g, '');
		
		if( wcnpj.length == 15 ){
			wcnpj = wcnpj.substr(1,15);
		}
		
		if (wcnpj != "") {
			if(validaCNPJ(cnpj)) {
				
				var d = $.Deferred();
				var url = "https://www.receitaws.com.br/v1/cnpj/"+ wcnpj;
	
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: url,
					crossDomain: true,
					data: "",
					timeout: 3000
				}).pipe(function(p){
					return p;
				}).done(function(result){
					d.resolve(result);
					if ( result.status == 'OK' ){
						
						if( result.situacao == "ATIVA" ){
							cb.success(result);	
						}else{		
							//FLUIGC.toast({ title: '', message: "CNPJ na situação "+result.situacao, type: 'danger' });
							cb.success(result);
							//cb.error(result);
						}
					} else {
						FLUIGC.toast({ title: '',message: result.message , type: 'danger' });
						cb.error(result);
					}
				}).fail(function(data){
					d.reject
					cb.error(data);
				});
	
			}else{
				//  FLUIGC.toast({ title: '',message: 'CNPJ inválido.' , type: 'warning' });
				//  cb.success(result);
			}
		}
	}

	//Busca endereço CEP
	function buscaCEP(cep, cb){
		var wCep = cep.replace(/\D/g, '');
		if (wCep != "") {				
			var d = $.Deferred();
			var url = "https://viacep.com.br/ws/"+ wCep +"/json/";

			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: url,
				crossDomain: true,
				data: "",
				timeout: 3000
			}).pipe(function(p){
				return p;
			}).done(function(result){
				d.resolve(result);
				cb.success(result);	
			}).fail(function(data){
				d.reject
				cb.error(data);
				FLUIGC.toast({ title: '',message: 'CEP Inválido', type: 'danger' });	
			});
		}
	}
	

	//Retira acentos
	function retira_acentos(palavra) {
		com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
		sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
		nova = '';
		for (i = 0; i < palavra.length; i++) {
			if (com_acento.search(palavra.substr(i, 1)) >= 0) {
				nova += sem_acento.substr(com_acento.search(palavra.substr(i, 1)), 1);
			}
			else {
				nova += palavra.substr(i, 1);
			}
		}
		return nova.replace("'", "\'");
	}

	//Converte String para Float pelo id
	function getFloatId(id) {
		var v = $("#" + id).val();
		var s = v.replace(/[^\d,-]/g, '');
		s = s.replace(",", ".");
		return parseFloat(s);
	}

	//Converte String para Float pelo valor
	function getFloatValue(v) {
		var s = v.replace(/[^\d,-]/g, '');
		s = s.replace(",", ".");
		return parseFloat(s);
	}

	//Converte String para Float pelo valor com casas decimais
	function getFloatFixed(v,d) {
		var s = v.replace(/[^\d,-]/g, '');
		s = s.replace(",", ".");
		return parseFloat(s).toFixed(d);
	}

	//Converte de Float para String com casas decimais
	function getStringValue(v,l) {
		var s = String(v.toFixed(l)).replace('.', ',');
		return s;
	}

	//Formata valor
	function formatStringValue(v,l) {
		var s = String(parseFloat(v).toFixed(l)).replace('.', ',');
		return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	//Textarea autosize
	function autoSize(){

		console.log('entrei autoSize()');
	
		$('textarea').each(function (){
			console.log('textarea', $(this).attr('name') );
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


	//Valida campos obrigatórios
	function valida( lCampos, pnGrp ) {

		var retorno = true;
		var idFocu = '';
		
		var vnGrp = pnGrp;
		if( vnGrp == "" || vnGrp == undefined ){
			vnGrp = ".fluig-style-guide";	
		}
		
		console.log('Entrei valida....', lCampos, vnGrp);
		
		var campos = [];
		
		$( lCampos, vnGrp ).each(
			function() {
				
				if( $(this).attr('readonly') ){
					$(this).css({'background-color' : '#EEEEEE'});
				}else{
					$(this).css({'background-color' : '#FFFFFF'});
				}
				
				console.log( 'field-valida', $(this).val(), $(this).attr('field-valida'), $(this).attr('value-valida') );
				
				if( $(this).attr('field-valida') != "" && $(this).attr('field-valida') != undefined ){
					console.log('Entrou teste field', $( '#'+$(this).attr('field-valida') ).val(), 'X' , $(this).attr('value-valida'), 'X' ,  $(this).val() );
					if( $( '#'+$(this).attr('field-valida') ).val() == $(this).attr('value-valida')
					&& $(this).val() == "" ){
						
						$(this).css({'background-color' : '#FFE4C4'});
						//alert( $(this).attr('name') );
						console.log('Validado... ', $(this).attr('name') );
						campos.push( $(this).attr('name') ); 
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}
					if( $(this).attr('value-valida') == "!" 
						&& $( '#'+$(this).attr('field-valida') ).val() != "" 
						&& $( '#'+$(this).attr('field-valida') ).val() != "0" 
						&& $( '#'+$(this).attr('field-valida') ).val() != "0,000000"
						&& $(this).val() == "" ){
								
						$(this).css({'background-color' : '#FFE4C4'});
						//alert( $(this).attr('name') );
						console.log('Validado... ', $(this).attr('name') );
						campos.push( $(this).attr('name') );
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}
				}else{
					//tratar se o campo for do tipo decimal e o valor for 0
					if ($(this).hasClass("decimal-5") || $(this).hasClass("decimal-0")){
						if ( $(this).val()=='0'  || $(this).val()=='0,00000' ){
							if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
								
								$(this).css({'background-color' : '#FFE4C4'});
								campos.push( $(this).attr('name') );
								retorno = false;
								if( idFocu == '' ){
									idFocu = $(this).attr('id');
								}
							}
						}
					}
					
					if( ( $(this).val() == ""
						|| $(this).val() == null
						|| $(this).val() == "null"
						|| $(this).val() == undefined ) ){
						console.log('Name', $(this).attr('name') );
						if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
								
							$(this).css({'background-color' : '#FFE4C4'});
							//alert( $(this).attr('name') );
							console.log('Validado... ', $(this).attr('name') );
							campos.push( $(this).attr('name') );
							retorno = false;
							if( idFocu == '' ){
								idFocu = $(this).attr('id');
							}
						}
					}
				}
				console.log('ENTROU4');		
			});
		if( idFocu != '' ){
			setTimeout("$('#"+idFocu+"').focus();", 1);
		}
		if( campos.length > 0 ){
			alert( 'Existem campos não Preenchidos.\n '+campos.join('\n') )
		}
		return retorno;
	}

	//Converte valor NaN por outro valor
	function isNull( valor, padrao ){
		if ( isNaN( valor ) ){
			return padrao;
		}else{
			return valor;
		}
	}


//Converte número para extenso
String.prototype.extenso = function(c){
	var ex = [
			["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
			["dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"],
			["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
			["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
	];
	var a, n, v, i, n = this.replace(c ? /[^,\d]/g : /\D/g, "").split(","), e = " e ", $ = "real", d = "centavo", sl;
	for(var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []){
			j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
			if(!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
			for(a = -1, l = v.length; ++a < l; t = ""){
					if(!(i = v[a] * 1)) continue;
					i % 100 < 20 && (t += ex[0][i % 100]) ||
					i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
					s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
					((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("?o", "?es") : ex[3][t]) : ""));
			}
			a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
			a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
	}
	return r.join(e);
}

/*** Funções para controle de data ***/

	//formata data dd/mm/yyyy
	function formataData(data){
		var year = data.getFullYear();
		var daym = data.getDate();

		if (daym < 10) {
			daym = "0" + daym;
		}

		var monthm = data.getMonth() +1;
		if (monthm < 10) {
			monthm = "0" + monthm;
		}

		var dateNow = daym + "/" + monthm + "/" + year;

		return dateNow;
	}

	//Mês em extenso
	var arrayMes = new Array();
		arrayMes[1] = "Janeiro"; arrayMes[2] = "Fevereiro"; arrayMes[3] = "Março"; arrayMes[4] = "Abril"; arrayMes[5] = "Maio"; arrayMes[6] = "Junho";
		arrayMes[7] = "Julho"; arrayMes[8] = "Agosto"; arrayMes[9] = "Setembro"; arrayMes[10] = "Outubro"; arrayMes[11] = "Novembro"; arrayMes[12] = "Dezembro";
		
	//retorna ultimo dia mês
	function retUltimoDia(year, month){
		var ultimoDia = (new Date(year, month, 0)).getDate();
		return ultimoDia;
	}

	//retorna data atual
	function DataHoje(){
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
	
		return dateNow;
	}
	
	//retorna hora atual
	function HoraHoje(){
		var mydate = new Date();
		var hour = mydate.getHours();
		var minute = mydate.getMinutes();
		var second = mydate.getSeconds();
	
		if (hour < 10) {
			hour = "0" + hour;
		}
	
		if (minute < 10) {
			minute = "0" + minute;
		}
	
		if (second < 10) {
			second = "0" + second;
		}
	
		var hourNow = hour + ":" + minute + ":" + second;
	
		return hourNow;
	}

	//diferença entre datas em horas
	function diffDatesHours(date1, date2){
		var diffMs = (date2 - date1);
		// console.log(date1, date2, diffMs);
		var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
		// console.log( diffHrs );
		var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
		// console.log( diffMins );
		var diffSec = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000);
		// console.log( diffSec );
		var hora = (diffHrs < 10) ? '0' + diffHrs : diffHrs;
		var minuto = (diffMins < 10) ? '0' + diffMins : diffMins;
		var segundo = (diffSec < 10) ?  '0' + diffSec : diffSec;
		var diff = hora + ':' + minuto + ':' + segundo;
		return diff
	}

	function hoursToMinutes(hour){
		var hora = parseInt(hour.split(':')[0]) * 60;
		var minutos = hora + parseInt(hour.split(':')[1]);
		return minutos;
	}


//Mensagem customizada
function toast(message, type){
	FLUIGC.toast({
		message: message,
		type: type
	})
}

//Recupera nome tabela pelo dataset
function getTable( dataSet, table ){
	var ct =  new Array();
	ct.push( DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST)) ;
	if( table != ""
	 && table != null
	 && table != undefined){
		ct.push( DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST)) ;
	}
	var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);
	
	if( table != ""
	 && table != null
	 && table != undefined){
		return ds.values[0]['tableFilha'];
	}else{
		return ds.values[0]['table'];
	}	
}



function loadDsPfCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldOrder, clear, blankLine, fieldDefault ){
	
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
			var lstOrder = fieldOrder.split(',');
			for ( var j = 0; j < lstOrder.length; j ++ ){
				orderFilhos.push( lstOrder[j] );
			}
					
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				
				var valDefault = $("#"+combo).val();
				
				if( clear != 'N' && clear != false ){
					$("#"+combo+" option").remove();
					if( blankLine == 'S' || blankLine == false || blankLine == undefined || blankLine == null ){
						$("#"+combo).append("<option value='' ></option>");
					}
				}
				
				var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				console.log('DataSet',filhos);
				//$("#empresa").append("<option value='' ></option>");
				for ( var i in filhos ) {
					
					console.log('Linha DataSet.....',i);
					var filho = filhos[i];
					
					if ( ( valDefault == "" || valDefault == null ) && 
						 ( filho[ fieldDefault ] || filho[ fieldDefault ] == "on" || filho[ fieldDefault ] == "S" || filho[ fieldDefault ] == "checked" ) ){
						valDefault = filho[ fieldCodigo ];
					}
					
					var den = '';					
					if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
						continue;
					} 
					if ( fieldDesc == '' ){
						den = filho[ fieldCodigo ];
					}else if( fieldCodigo == fieldDesc ){
						den = filho[ fieldDesc ];
					}else{
						den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
					}
					$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
				}
				$("#"+combo).val( valDefault );
			}
		}
	}
}
		

function getDsPaiFilho( dataSet, table, fildFilter, fildFilterValue, fields ){	
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
	console.log('datasetPai.........', datasetPai );
	
	var lstFields = fields.split(',');
	
	var lstReturn = new Array();
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, null );
			//console.log('datasetFilhos.........', datasetFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				lstReturn = lstReturn.concat( datasetFilhos.values );
				console.log('lstReturn.....', lstReturn);
			}
		}
	}
	console.log('lstReturn.....', lstReturn);
	return lstReturn;
}




