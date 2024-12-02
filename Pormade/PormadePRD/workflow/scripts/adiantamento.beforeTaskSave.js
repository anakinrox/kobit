function beforeTaskSave(colleagueId,nextSequenceId,userList){

	hAPI.setCardValue("datadespesa", (hAPI.getCardValue("datadespesa")+"").split("-").reverse().join("/") );
	
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
		
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];		
		if( seqItem != undefined ){
			if ( campo == "seqLinha") {				
				hAPI.setCardValue('datadespesanf___'+seqItem, (hAPI.getCardValue('datadespesanf___'+seqItem)+"").split("-").reverse().join("/") );
			}else if( campo == "seqLinhaKM") {
				hAPI.setCardValue('datadespesa_km___'+seqItem, (hAPI.getCardValue('datadespesa_km___'+seqItem)+"").split("-").reverse().join("/") );
			}
		}
	}
 
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    var strDate = sdf.format( new Date() );
	if( hAPI.getCardValue("descricao") != ""){	
        var childData = new java.util.HashMap();
        childData.put("data_hist", strDate );
        childData.put("user_hist", hAPI.getCardValue("user_fup") );
        childData.put("cod_user_hist", hAPI.getCardValue("cod_user_fup") );
        childData.put("desc_hist", hAPI.getCardValue("descricao") );
        hAPI.addCardChild("folowup", childData);
        hAPI.setCardValue("descricao", "");
	}
	
    
}