function beforeStateEntry(sequenceId){
	if( sequenceId == '20' || sequenceId == '12' || sequenceId == '24' ){ 
//		log.info( 'getValue("WKNumProces") ' + getValue("WKNumProces") );
		hAPI.setCardValue("processo", getValue("WKNumProces") );
	}
	
}