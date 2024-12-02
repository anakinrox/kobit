function servicetask16(attempt, message) {
	var docs = hAPI.listAttachments();
	
	if( docs.size() == 0 ){
		return true;
	}
	
	var parentFolder = 27228;
	
	//var parentFolder = 117;
	
	
	// Carrega Pasta Pai
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("parentDocumentId", parentFolder , parentFolder , ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("deleted",false, false, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );
	var like = DatasetFactory.createConstraint("documentDescription", hAPI.getCardValue('num_cgc_cpf') + '%', hAPI.getCardValue('num_cgc_cpf') + '%', ConstraintType.SHOULD);
	like.setLikeSearch(true)
	constraints.push( like );
	var dsPasta = DatasetFactory.getDataset("document", null, constraints, null);

	if ( dsPasta.rowsCount > 0 ) {
		var folderCli = parseInt( dsPasta.getValue(0, 'documentPK.documentId') );
	} else {
		var vo = new com.fluig.sdk.api.document.FolderVO;
		vo.setParentFolderId( parentFolder );
		vo.setDocumentDescription( hAPI.getCardValue('num_cgc_cpf') + ' - ' + hAPI.getCardValue('nom_cliente') );
		var folderVO = fluigAPI.getFolderDocumentService().create(vo);
		
		var folderCli = folderVO.getDocumentId();
	}
		
	var calendar = java.util.Calendar.getInstance().getTime();
    
//    var pasta = parseInt( folderCli );
//    var temAnexo = false;
    
    var formatter = new java.text.SimpleDateFormat('dd/MM/yyyy');
    //var expirationDate = formatter.parse( hAPI.getCardValue('datavencimento').split("-").reverse().join("/") );
    var docsTXT = "";
    
    for (var i = 0; i < docs.size(); i++) {
        var doc = docs.get(i);
        
        if (doc.getDocumentType() == "7") {
        	
        	log.info('Entrou Post documento');
//        	log.info(  calendar );
//        	log.info(  doc.getDocumentDescription() );
        	var description = doc.getDocumentDescription().split(' | '); 
        	var typeId = description[0];
//        	log.info(  description );
//        	log.info(  description[0] );
//        	log.info(  description[1] );
//        	log.info(  doc.getPhisicalFile() );
        	var seq = 1;
        	
        	var constraints = new Array();
            constraints.push( DatasetFactory.createConstraint("parentDocumentId", folderCli, folderCli, ConstraintType.MUST) );
            constraints.push( DatasetFactory.createConstraint("documentTypeId", typeId, typeId, ConstraintType.MUST) );
            constraints.push( DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST) );
            constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );
            var ds = DatasetFactory.getDataset("document", null, constraints, null);

            if ( ds.rowsCount > 0 ) seq = ds.rowsCount + 1;
        	
        	doc.setParentDocumentId(folderCli);
            doc.setVersionDescription("Processo: " + getValue("WKNumProces"));
            //doc.setExpires(true);
            //doc.setExpirationDate( expirationDate );
            doc.setDocumentDescription( doc.getPhisicalFile() )
            doc.setCreateDate(calendar);
            doc.setInheritSecurity(true);
            doc.setTopicId(1);
            doc.setUserNotify(false);
            doc.setValidationStartDate(calendar);
            doc.setVersionOption("0");
            doc.setUpdateIsoProperties(true);
            doc.setDocumentTypeId( typeId );
            doc.setInternalVisualizer(true);
            
            hAPI.publishWorkflowAttachment(doc);
            
        };
    };
	
	return true;
}