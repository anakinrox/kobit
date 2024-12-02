function servicetask127(attempt, message) {
	
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();		
		if( idItem.indexOf("___") == -1 ){
			continue;
		}
		var campo = idItem.split('___')[0];
		var seqItem = '0';
		seqItem = idItem.split('___')[1];
		if( seqItem != 0 && seqItem != undefined && campo == "COD_ITEM" ) {
			log.info('Atualizando sequencia de controle '+seqItem+' com valor '+seqItem);
			hAPI.setCardValue("seq_controle___"+seqItem, seqItem+"" );
			log.info('Valor atualizado na sequencia de controle '+seqItem+' com valor '+hAPI.getCardValue("seq_controle___"+seqItem) );
		}
	}
	
	return true;
	
}


