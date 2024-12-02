function beforeCancelProcess(colleagueId,processId){
	
	log.info( 'State cancelamento.......'+getValue('WKNumState') );
	log.info( 'State cancelamento.......'+getValue("WKUser") );
	
	if( !( getValue('WKNumState') == 4
	    || getValue('WKNumState') == 43
	    || getValue('WKNumState') == 45 )
	   && getValue("WKUser") != 'admlog' ) {
		
		throw "Esse processo somente pode ser cancelado pelo administrador (admlog).";
		
	}
	
}