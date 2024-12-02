var inputsCEP = $('#logradouro, #bairro, #localidade, #uf, #ibge');
var inputsRUA = $('#cep, #bairro, #ibge');
var validacep = /^[0-9]{8}$/;

function limpa_formulário_cep(alerta) {
  if (alerta !== undefined) {
    alert(alerta);
  }

  inputsCEP.val('');
}

function get(url) {

 $.get(url, function(data) {

    if (!("erro" in data)) {

      if (Object.prototype.toString.call(data) === '[object Array]') {
        var data = data[0];
      }

      console.log( 'Data.....',data );
      
      //$.each(data, function(nome, info) {
      //  $('#' + nome).val(nome === 'cep' ? info.replace(/\D/g, '') : info).attr('info', nome === 'cep' ? info.replace(/\D/g, '') : info);
      //});
      
      if( $('#endereco').val() == "" ){
    	  $('#endereco').val( data["logradouro"] );
      }
     
      if( $('#bairro').val() == "" ){
    	  $('#bairro').val( data["bairro"] );
      }

      console.log( 'Antes cidade...........');
      
      if( $('#cidade').val() == "" ){

    	 console.log( 'Antes data set cidade...........');
    	  
		 var constraints = new Array();
		 
		 constraints.push( DatasetFactory.createConstraint("to_ascii(cidade)", retira_acentos(data["localidade"]), retira_acentos(data["localidade"]), ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint("uf", data["uf"], data["uf"], ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint("dataBase", "java:/jdbc/CRMDS", null, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint("table", "fluig_v_pon_cidades", null, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint("banco", "postgresql", null, ConstraintType.MUST) );
		
		 console.log( 'constraints...........', constraints);
		 
		 var fields = new Array('id','cod_erp','cod_cidade','cod_uf','cod_pais');
		 
		 console.log( 'fields...........', fields);
		 
		 var dataset = DatasetFactory.getDataset("selectTable", fields, constraints, null );
			
		 console.log( 'dataset...........', data["localidade"] );
		 
		if ( dataset != null ){
			if( dataset.values.length > 0 ) {
				console.log('Linha DataSet.....',i);
				$('#id_cidade').val( dataset.values[0]['valor_total'] );
  	    	    $('#cidade').val( data["localidade"] );
		    	$('#uf').val( data["uf"] );
		    	$('#den_cidade_uf').val( data["localidade"]+"/"+data["uf"] );
		    	
		    	$('#cod_uf').val( dataset.values[0]["cod_uf"] );
		    	$('#cod_pais').val( dataset.values[0]["cod_pais"] );
		    	$('#cod_cidade').val( dataset.values[0]["cod_cidade"] );
		    	
			}else{
				alert( 'Não localizado cidade '+data["localidade"]+"/"+data["uf"] );
			}
		}else{
			alert( 'Não localizado cidade '+data["localidade"]+"/"+data["uf"] );
		}
    	  
    	  
      }      
      
    } else {
    	limpa_formulário_cep("CEP não encontrado.");
    }

  });
}

// Digitando RUA/CIDADE/UF
$('#logradouro, #localidade, #uf').on('blur', function(e) {
  if ($('#logradouro').val() !== '' && $('#logradouro').val() !== $('#logradouro').attr('info') && $('#localidade').val() !== '' && $('#localidade').val() !== $('#localidade').attr('info') && $('#uf').val() !== '' && $('#uf').val() !== $('#uf').attr('info')) {
    inputsRUA.val('...');
    get('https://viacep.com.br/ws/' + $('#uf').val() + '/' + $('#localidade').val() + '/' + $('#logradouro').val() + '/json/');
  }
});


function buscaCep( id ){
	
	var cep = $('#'+id).val().replace(/\D/g, '');
	
	console.log('Antes IF ',cep);
	
	if (cep !== "" && validacep.test(cep)) {
		inputsCEP.val('...');
		get('https://viacep.com.br/ws/' + cep + '/json/');
		
	}else {
	    limpa_formulário_cep(cep == "" ? undefined : "Formato de CEP inválido.");
	}
	
}

// Digitando CEP
$('#cep').on('blur', function(e) {
  console.log('Entrei CEP', e);
  var cep = $('#cep').val().replace(/\D/g, '');
  console.log('Antes IF ',cep);  
  if (cep !== "" && validacep.test(cep)) {
    inputsCEP.val('...');
    get('https://viacep.com.br/ws/' + cep + '/json/');
  } else {
    limpa_formulário_cep(cep == "" ? undefined : "Formato de CEP inválido.");
  }
});


function retira_acentos(palavra) { 
    com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ'; 
    sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'; 
    nova=''; 
    for(i=0;i<palavra.length;i++) { 
        if (com_acento.search(palavra.substr(i,1))>=0) { 
            nova+=sem_acento.substr(com_acento.search(palavra.substr(i,1)),1); 
        } 
        else { 
            nova+=palavra.substr(i,1); 
        } 
    } 
    return nova; 
}