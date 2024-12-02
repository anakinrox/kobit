function servicetask25(attempt, message) {
	trataAnexosAdiantamento();
}

function trataAnexosAdiantamento(){

	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
				
		if ( campo == "seqImagem" 
			|| campo == "seqImagemKM_ini"
			|| campo == "seqImagemKM_fim" ) {
				
			hAPI.setCardValue( idItem, "" );
		}
	}

    var calendar = java.util.Calendar.getInstance().getTime();
    var docs = hAPI.listAttachments();
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
    for (var i = 0; i < docs.size(); i++) {
        var doc = docs.get(i);
        if (doc.getDocumentType() != "7") {
            continue;
        }
        
        var desc = doc.getDocumentDescription();
        log.info('doc.............'+doc.getDocumentId() );
        log.info('doc.............'+doc.getDocumentDescription() );
        
		var iesKM = 'N';
		var iesIni = 'N';
		
		if( desc.indexOf('KM') >= 0 || desc.indexOf('km') >= 0 ){
			iesKM = 'S';
		}
		if( desc.indexOf('INI') >= 0 || desc.indexOf('ini') >= 0 ){
			iesIni = 'S';
		}
        
        var seq = desc.split('_')[0];
        var seqImg = desc.split('_')[1];
        if( iesKM == 'S' ){
        	seq = desc.split('_')[1];
        	seqImg = desc.split('_')[2];
        }
        

		var contadorItem = camposItem.keySet().iterator();
		
		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			
			log.info('idItem..............'+idItem );
			log.info('campo...............'+campo );
			log.info('seqItem.............'+seqItem );
			log.info('seq.................'+seq );
			log.info('seqForm.................'+hAPI.getCardValue( idItem ) );

			
			log.info('iesKM.............'+iesKM );
			log.info('iesIni.................'+iesIni );
			
			if( iesKM == 'N' ){
				if (seqItem != undefined && campo == "seqLinha") {
					
					if( hAPI.getCardValue( idItem ) == seq ){
						log.info('Entrei Set Valor................');
						if( hAPI.getCardValue( 'docum___'+seqItem ) == ""
						 || hAPI.getCardValue( 'docum___'+seqItem ) == undefined
						 || parseFloat( hAPI.getCardValue( 'docum___'+seqItem ) ) <= doc.getDocumentId() ){
							hAPI.setCardValue( 'docum___'+seqItem, doc.getDocumentId() );
							hAPI.setCardValue( 'versao___'+seqItem, doc.getVersion() );
							hAPI.setCardValue( 'seqImagem___'+seqItem, seqImg );
						}
					}
				}
			}else if( iesKM == 'S' ){
				if (seqItem != undefined && campo == "seqLinhaKM") {

					if( hAPI.getCardValue( idItem ) == seq ){
						log.info('Entrei Set Valor KM ');
						if( iesIni == 'S' ){
							log.info('Entrei Set Valor KM INI ');
							if( hAPI.getCardValue( 'documKM_ini___'+seqItem ) == ""
							 || hAPI.getCardValue( 'documKM_ini___'+seqItem ) == undefined
							 || parseFloat( hAPI.getCardValue( 'documKM_ini___'+seqItem ) ) <= doc.getDocumentId() ){
								hAPI.setCardValue( 'documKM_ini___'+seqItem, doc.getDocumentId() );
								hAPI.setCardValue( 'versaoKM_ini___'+seqItem, doc.getVersion() );
								hAPI.setCardValue( 'seqImagemKM_ini___'+seqItem, seqImg );
							}
						}else{
							log.info('Entrei Set Valor KM FIM ');
							if( hAPI.getCardValue( 'documKM_ini___'+seqItem ) == ""
								 || hAPI.getCardValue( 'documKM_ini___'+seqItem ) == undefined
								 || parseFloat( hAPI.getCardValue( 'documKM_ini___'+seqItem ) ) <= doc.getDocumentId() ){
								hAPI.setCardValue( 'documKM_fim___'+seqItem, doc.getDocumentId() );
								hAPI.setCardValue( 'versaoKM_fim___'+seqItem, doc.getVersion() );
								hAPI.setCardValue( 'seqImagemKM_fim___'+seqItem, seqImg );
							}
						}
					}
				}
			}
		}
        
        /*doc.setParentDocumentId(108);
        doc.setVersionDescription("Processo: " + getValue("WKNumProces"));
        doc.setExpires(false);
        doc.setCreateDate(calendar);
        doc.setInheritSecurity(true);
        doc.setTopicId(1);
        doc.setUserNotify(false);
        doc.setValidationStartDate(calendar);
        doc.setVersionOption("0");
        doc.setUpdateIsoProperties(true);
          */
        //var numDoc = hAPI.publishWorkflowAttachment(doc);
        
    }
	
	
}