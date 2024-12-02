function servicetask138(attempt, message) {
	
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
	
	var c1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', hAPI.getCardValue("user_abertura"), hAPI.getCardValue("user_abertura"), ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset('colleague', null, constraints, null);
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

	
	var html = "<br><h1><b>Solicitação de Cadastro de Cliente / Fornecedor - Aguardando K2</b></h1>" +
		"<br>" +
		"<br><b>Código LOGIX:</b> "+hAPI.getCardValue("cod_cliente_fornecedor") +" "+
		"<br><b>Nome:</b> "+hAPI.getCardValue("raz_social") +" " +
		"<br><b>Tipo de Operação:</b> "+ tipo +"" +
		//"<br><b>Situação:</b> Aguardando a realização do cadastro no sistema K2 pelo solicitante do processo ("+ colleagueMap.getValue(0, "colleagueName") +") <a href='https://roullier-rec.onk2.com/Workspace/Form/RCP__F__Home' target='_blank'><font face='Verdana, Geneva, sans-serif'><span style='font-size: 12px;'><b>Link:</b> https://roullier-rec.onk2.com/Workspace/Form/RCP__F__Home</span></font></a> " +
		"<br><b>Situação:</b> Aguardando a realização do cadastro no sistema K2 pelo solicitante do processo ("+ colleagueMap.getValue(0, "colleagueName") +") <a href='https://roullier.onk2.com/Workspace/Form/RCP__F__Home' target='_blank'><font face='Verdana, Geneva, sans-serif'><span style='font-size: 12px;'><b>Link:</b> https://roullier.onk2.com/Workspace/Form/RCP__F__Home</span></font></a> " +
		"<br><b>Data Cadastro:</b> "+ sdf.format(dtNow) +" " +
		"<br><br><b>Atenção: Para realizar o cadastro no K2 deve ser utilizado o código LOGIX informado acima. </b> " ;
	
	var parametros = new java.util.HashMap();
	parametros.put("WorkflowMailContent", html);
	parametros.put("SERVER_URL", "http://10.20.0.64/");
	//Este parÃ¢metro Ã© obrigatÃ³rio e representa o assunto do e-mail
	parametros.put("subject", "Cadastro do "+ tipo +" "+ hAPI.getCardValue("cod_cliente_fornecedor") +" - "+ hAPI.getCardValue("raz_social") +" - Processo: "+getValue("WKNumProces") );
	parametros.put("subject", "Processo: "+getValue("WKNumProces") +" Aguardando K2 - Cadastro do "+ tipo +" "+ hAPI.getCardValue("cod_cliente_fornecedor") +" - "+ hAPI.getCardValue("raz_social")  );
	
	//Monta lista de destinatÃ¡rios
	var destinatarios = new java.util.ArrayList();
	destinatarios.add( hAPI.getCardValue('user_abertura' ).trim() );
	//destinatarios.add( 'amjunior@gmail.com' );
	//destinatarios.add( 'amjunior@gmail.com' );
	log.info('Serv... 003');
	//Envia e-mail
	notifier.notify("adm", "TPLTASK_SEND_EMAIL", parametros, destinatarios, "text/html");
	
}