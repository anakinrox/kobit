function setMask(){
	console.log('setMask');
	$('.decimal-6').maskMoney({precision : 6,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true,allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '.',decimal : ',',	defaultZero : true,allowZero : true});
	$('.integer-0').maskMoney({precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});
	$(".telefone").mask("(00) 0000-00009");
	$(".cep").mask("99999-999");
	// $(".cnpj").mask("99.999.999/9999-999");
	console.log('s1');
	// FLUIGC.calendar('.data-fluig' );
	console.log('s2');
	FLUIGC.calendar('.data-hora', {pickDate: true, pickTime: true, sideBySide: true } );
	console.log('s3');
	// FLUIGC.calendar('.hora-fluig', {pickDate: false, pickTime: true } );
	console.log('s4');
}

function addFilho(table) {
	var row = wdkAddChild(table);
	setMask();
	return row;
}


function readOnlyAll( tipo, grupo ){
	console.log('Entrei Read Only....');
	if( grupo == undefined || grupo == "" ){
		$('input, select, textarea').each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
			}
		});
	}else{
		$(grupo).each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
			}
		});
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

function validaEmail( idEmail ) {
	
	email = $('#'+idEmail).val();

	if ( email == undefined || email == null || email == '' ){
		return false;
	}
	usuario = email.substring(0, email.indexOf("@"));
	dominio = email.substring(email.indexOf("@")+ 1, email.length);
	if ((usuario.length >=1) &&
		(dominio.length >=3) && 
		(usuario.search("@")==-1) && 
		(dominio.search("@")==-1) &&
		(usuario.search(" ")==-1) && 
		(dominio.search(" ")==-1) &&
		(dominio.search(".")!=-1) &&      
		(dominio.indexOf(".") >=1)&& 
		(dominio.lastIndexOf(".") < dominio.length - 1)) {
			return true;
	}else{
			FLUIGC.toast({
				message: 'Email inválido!',
				type: 'warning'
			})
			return false;
	}
}

function validaCNPJ(cnpj){
	if ( cnpj == undefined || cnpj == null || cnpj == '' ){
		return false;
	}
    //var cnpj = ObjCnpj.value;
    var valida = new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
    var dig1= new Number;
    var dig2= new Number;

    exp = /\.|\-|\//g;
    cnpj = cnpj.toString().replace( exp, "" ); 
    var digito = new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));

    for( var i = 0; i<valida.length; i++){
            dig1 += (i>0? (cnpj.charAt(i-1)*valida[i]):0);  
            dig2 += cnpj.charAt(i)*valida[i];       
    }
    dig1 = (((dig1%11)<2)? 0:(11-(dig1%11)));
    dig2 = (((dig2%11)<2)? 0:(11-(dig2%11)));

    if(((dig1*10)+dig2) != digito){
		return false;
	}else{
		return true;
	}
}

function getFloatValue(id) {
	var v = $("#" + id).val();
	var s = v.replace(/[^\d,-]/g, '');
	s = s.replace(",", ".");
	return parseFloat( isNull(s,"0") );
}

function getStringValue(v,l) {
	var s = String(v.toFixed(l)).replace('.', ',');
	return s;
}


function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}

function today() {
	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();
	
	var output = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day;

	return output;	
}

function valida( lCampos, pnGrp ) {

	var retorno = true;
	var idFocu = '';
	
	var vnGrp = pnGrp;
	if( vnGrp == "" || vnGrp == undefined ){
		vnGrp = ".fluig-style-guide";	
	}
	
	console.log('Entrei valida....', lCampos, vnGrp);
		
	$( lCampos, vnGrp ).each(
		function() {

			if ( $(this).attr('name').split('_xxx').length <= 1) {
				console.log( );

				if( $(this).attr('readonly') ){
					$(this).css({'background-color' : '#EEEEEE'});
				}else{
					$(this).css({'background-color' : '#FFFFFF'});
				}
				
				console.log( 'Name', $(this).attr('name'), 'valida', $(this).attr('valida') );
				
				if( $(this).attr('valida') == 'field'
					&& $(this).val() == ""){

						console.log('Entrou teste field', $(this).attr('valida'), 'X' ,  $(this).val() );
						
						$(this).css({'background-color' : '#FFE4C4'});
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}

				if( $(this).attr('valida') == "value" 
					&& ($(this).val() == "0" 
						|| $(this).val() == "0,00"
						|| $(this).val() == "") ){
					
						console.log('Entrou teste value', $(this).attr('valida'), 'X' ,  $(this).val() );	

						$(this).css({'background-color' : '#FFE4C4'});
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}
				console.log('ENTROU4');
			}
			
		});

	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;
}

function DataHoje(){
	var mydate = new Date();
	var year = mydate.getFullYear();
	var daym = mydate.getDate();

	if (daym < 10) {
		daym = "0" + daym;
	}

	var monthm = mydate.getMonth() +1;
	if (monthm < 10) {
		monthm = "0" + monthm;
	}

	var dateNow = daym + "/" + monthm + "/" + year;

	return dateNow;
}

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

function DataHoraHoje() {
	var mydate = new Date();
	var day = mydate.getDate();
	var month = mydate.getMonth()+1;	
	var year = mydate.getFullYear()
	var hour = mydate.getHours();
	var minute = mydate.getMinutes();
	var second = mydate.getSeconds();

	var output = (day<10 ? '0' : '') + day + '/' + (month<10 ? '0' : '') + month + '/' + year + ' ' + 
				 (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;

	return output;
}

function fnCustomDelete(oElement){
 
    //Customização
    // alert ("Eliminando filho!");
 
    // Chamada a funcao padrao, NAO RETIRAR
    fnWdkRemoveChild(oElement);
 
    //Customização
    // alert ("Filho eliminado!");
}