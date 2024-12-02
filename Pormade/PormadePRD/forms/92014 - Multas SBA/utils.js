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
	FLUIGC.calendar('.data-fluig' );
	FLUIGC.calendar('.data-hoje' ).setDate(new Date());
	FLUIGC.calendar('.data-hora', {pickDate: true, pickTime: true, sideBySide: true } );

	$('#num_infracao').on('keypress', function(e) {
		var regex = new RegExp("^[0-9a-zA-Z\b-]+$");
		var _this = this;
		// Curta pausa para esperar colar para completar
		setTimeout( function(){
			var texto = $(_this).val();
			if(!regex.test(texto))
			{             
				$(_this).val(texto.substring(0, (texto.length-1)))
			}
		}, 100);
	});
}

function addFilho(table) {
	var row = wdkAddChild(table);
	return row;
}

function fnCustomDelete(oElement) {
	if( confirm("Deseja remover o item?") ){
		fnWdkRemoveChild(oElement);
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

function toast(message, type){
	FLUIGC.toast({
		message: message,
		type: type
	})
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