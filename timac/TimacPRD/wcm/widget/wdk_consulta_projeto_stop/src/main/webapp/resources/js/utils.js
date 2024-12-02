function setMask(){
	console.log('setMask');
	$('.decimal-6').maskMoney({precision : 6,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '',decimal : ',', defaultZero : true,allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '',decimal : ',',	defaultZero : true,allowZero : true});
	$('.integer-0').maskMoney({precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});
	$(".telefone").mask("(00) 0000-00009");
	$(".cep").mask("99999-999");
	FLUIGC.calendar('.data-fluig' );
	FLUIGC.calendar('.data-hora', {pickDate: true, pickTime: true, sideBySide: true } );
	// FLUIGC.calendar('.data-hoje' ).setDate(new Date());
}

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

function addFilho(table, campo, btn) {
	var row = wdkAddChild(table);
	setMask();

	return row;
}

function fnCustomDelete(oElement) {
	fnWdkRemoveChild(oElement);
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

function getFloatId(id) {
	var v = $("#" + id).val();
	var s = v.replace(/[^\d,-]/g, '');
	s = s.replace(",", ".");
	return parseFloat(s);
}

function getFloatValue(v) {
	var s = v.replace(/[^\d,-]/g, '');
	s = s.replace(",", ".");
	return parseFloat(s);
}

function getFloatFixed(v,d) {
	var s = v.replace(/[^\d,-]/g, '');
	s = s.replace(",", ".");
	return parseFloat(s).toFixed(d);
}

function getStringValue(v,l) {
	var s = String(v.toFixed(l)).replace('.', ',');
	return s;
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
	return retorno;
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}	