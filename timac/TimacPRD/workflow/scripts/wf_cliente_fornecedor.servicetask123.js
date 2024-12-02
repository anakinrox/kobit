function servicetask123(attempt, message) {

	var tipo = "Fornecedor";
	if( hAPI.getCardValue("ies_tipo_cadastro") == "C" ){
		tipo = "Cliente";
	}else if( hAPI.getCardValue("ies_tipo_cadastro") == "A" ){
		tipo = "Fornecedor Autonomo";
	}else if( hAPI.getCardValue("ies_tipo_cadastro") == "M" ){
		tipo = "Motorista";
	}else if( hAPI.getCardValue("ies_tipo_cadastro") == "T" ){
		tipo = "Transportador";
	} 
	
	var operacao = "Novo";
	if( hAPI.getCardValue("ies_operacao") == "A" ){
		operacao = "Alteração";
	}else if( hAPI.getCardValue("ies_operacao") == "I" ){
		operacao = "Bloqueio";
	} 
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
	
	var html = "<br><h1><b>Solicitação de Cadastro de Cliente / Fornecedor - Finalizado</b></h1>" +
		"<br>" +
		"<br><b>Código Logix:</b> "+hAPI.getCardValue("cod_cliente_fornecedor") +" "+
		"<br><b>Nome:</b> "+hAPI.getCardValue("raz_social") +"" +
		"<br><b>Tipo de Operação:</b> "+ tipo +"" +
		"<br><b>Situação:</b> Cadastro Finalizado. " +
		"<br><b>Data Cadastro:</b> "+ sdf.format(dtNow) +"" +
		"<br> ";
	
	var parametros = new java.util.HashMap();
	parametros.put("WorkflowMailContent", html);
	parametros.put("SERVER_URL", "http://10.20.0.64/");
	//Este parÃ¢metro Ã© obrigatÃ³rio e representa o assunto do e-mail
	parametros.put("subject", "Processo: "+getValue("WKNumProces") +" Finalizado - Cadastro do "+ tipo +" "+ hAPI.getCardValue("cod_cliente_fornecedor") +" - "+ hAPI.getCardValue("raz_social")  );
	
	//Monta lista de destinatÃ¡rios
	var destinatarios = new java.util.ArrayList();
	destinatarios.add( hAPI.getCardValue('user_abertura' ).trim() );
	//destinatarios.add( 'amjunior@gmail.com' );
	//destinatarios.add( 'amjunior@gmail.com' );
	log.info('Serv... 003');
	//Envia e-mail
	notifier.notify("adm", "TPLTASK_SEND_EMAIL", parametros, destinatarios, "text/html");
	
}