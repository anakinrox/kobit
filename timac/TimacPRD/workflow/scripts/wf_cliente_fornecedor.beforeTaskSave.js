function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    var strDate = sdf.format( new Date() );
	if( hAPI.getCardValue("obs_hist") != ""){	
		
		var user = getValue("WKUser");	

		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('colleaguePK.colleagueId', user, user, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
		
        var childData = new java.util.HashMap();
        childData.put("data_hist", strDate );
//        childData.put("tipo_hist", hAPI.getCardValue("data_prev_fup") );
        childData.put("user_hist", dataset.getValue(0,"colleagueName") );
        childData.put("cod_user_hist", user );
        childData.put("desc_hist", hAPI.getCardValue("obs_hist") );
        hAPI.addCardChild("historico", childData);
        hAPI.setCardValue("obs_hist", "");
	}	
	
	
	if( hAPI.getCardValue("ies_operacao") == "I" ){
		return true;
	}
	
	/*if( getValue('WKNumState') == 1 || getValue('WKNumState') == 0 ){
		 var attachments = hAPI.listAttachments();
		 var hasAttachment = false;
		 var lstAttachment = [];
		 for (var i = 0; i < attachments.size(); i++) {
		      var attachment = attachments.get(i);
		      log.info('Entrei anexos........'+ attachment.getDocumentDescription() );
		      lstAttachment.push( attachment.getDocumentDescription()+"" );
		 }
		
		 log.info('lstAttachment........ '+lstAttachment.length+' .... '+hAPI.getCardValue("ies_tipo_cadastro")+ '...... '+["F","A","T"].indexOf( hAPI.getCardValue("ies_tipo_cadastro") ) );
		 log.info('hAPI.getCardValue("num_banco")........ #'+hAPI.getCardValue("num_banco")+"#....." );
		 if( ["F","A","T"].indexOf( hAPI.getCardValue("ies_tipo_cadastro")+"" ) != -1
		  && hAPI.getCardValue("num_banco") != "" ){
			 log.info('Entrei segundo IF........'+ lstAttachment.indexOf( "anexo_dados_bancarios" ) );
		  	 if( lstAttachment.indexOf( "anexo_dados_bancarios" ) == -1 && hAPI.getCardValue("ies_tipo_cadastro") == "I"  ){
				 throw "Favor anexar Dados bancários.";
			 }
		  	 if( lstAttachment.indexOf( "anexo_comprovante_conta" ) == -1 && hAPI.getCardValue("ies_tipo_cadastro") == "N" && hAPI.getCardValue("ies_tipo_cadastro")+"" != 'T' ){
				 throw "Favor anexar Comprovente de Conta.";
			 }
		  	 if( lstAttachment.indexOf( "anexo_ficha_cadastral_assinada" ) == -1 && hAPI.getCardValue("ies_tipo_cadastro")+"" != 'A' ){
				 throw "Favor anexar Ficha Cadastral Assinada.";
			 }
		 }
		 if( hAPI.getCardValue("ies_tipo_cadastro") == "N" ){
			 if( ["F","T"].indexOf( hAPI.getCardValue("ies_tipo_cadastro")+"" ) != -1 ){
				 if( hAPI.getCardValue("ies_cpf_cnpj")+"" == "CNPJ" 
				  && lstAttachment.indexOf( "anexo_contrato_social" ) == -1 ){
					 throw "Favor anexar contrato social.";
				 }
				 if( lstAttachment.indexOf( "anexo_ficha_cadastral_assinada" ) == -1 ){
					 throw "Favor anexar Ficha cadastral.";
				 }
			 }
			 
			 
			 if( ["C"].indexOf( hAPI.getCardValue("ies_tipo_cadastro")+"" ) != -1 ){
				 if( lstAttachment.indexOf( "anexo_ficha_cadastral" ) == -1 ){
					 throw "Favor anexar Ficha cadastral.";
				 }
			 }
		 }

		 if( hAPI.getCardValue("termo_lgpd") == "S" ){
		  	 if( lstAttachment.indexOf( "anexo_termo_lgpd" ) == -1 ){
				 throw "Favor anexar termo LGPD.";
			 }
		 }
	}*/
}