function afterTaskSave(colleagueId,nextSequenceId,userList){
	log.info('#### afterTaskSave ####');

	var task = getValue("WKNumState");
	var solicitante = getValue("WKUser");
	
	
	if ( task == 0 || task == 1 || task == 2 || task == 4 || task == 8 || task == 22) {
		
		log.info('Entrou !!');
			
		if (task == 0 || task == 1){
//			var action = 'I';
			var status_proces = '0';
		}
		
		if (task == 2 || task == 4 || task == 8){
//			var action = 'U';
			var status_proces = '0';
		}
		
		if (task == 22){
//			var action = 'U';
			var status_proces = '2';
		}
	
		sincTableERP(status_proces);
		
		
	}
}
