function defineStructure() {

	addColumn("ORCAMENTO_CARACTERISTICA_COD");
	addColumn("CARACTERISTICA");
	addColumn("ITEM_CLASSIFICACAO_COD");
	addColumn("ITEM_MEDIDA_COD");
	
    setKey([ "ORCAMENTO_CARACTERISTICA_COD" ]);
    addIndex([ "ORCAMENTO_CARACTERISTICA_COD" ]);	
    addIndex([ "ITEM_CLASSIFICACAO_COD" ]);
     
}

function onSync(lastSyncDate) {
	
	log.info( 'Inicio......' );	
    var dataset = DatasetBuilder.newDataset();

	try{		
	    log.info( 'Entrei...... 1' );
	 
		var contextWD = new javax.naming.InitialContext();
		log.info( 'Entrei...... 3 a' );
		var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
		log.info( 'Entrei...... 3 b' );
		var connectionWD = dataSourceWD.getConnection();
		log.info( 'Entrei...... 3 c' );
		
		var SQL = " Select c.orcamento_caracteristica_cod, "+
				"		c.caracteristica, "+
				"		c.item_classificacao_cod, "+
				"		COALESCE( m.item_medida_cod, 0 ) as item_medida_cod "+
				"	From pmd_orcamento_caracteristica_vw c "+
				"	left Join pmd_orcamento_caract_medida m "+
				"				On m.orcamento_caracteristica_cod = c.orcamento_caracteristica_cod "+
				"	Where c.oct_ativo = True  "+
				"	order by caracteristica " ;
		
		log.info( SQL );
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();
		while(rsWD.next()){
			var reg = new Array();
			reg.push( rsWD.getString("orcamento_caracteristica_cod") );
			reg.push( rsWD.getString("caracteristica") );
			reg.push( rsWD.getString("item_classificacao_cod") );
			reg.push( rsWD.getString("item_medida_cod") );
			dataset.addOrUpdateRow( reg );
		}

		rsWD.close();
		log.info( 'FIM CLASE WD...... ');
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	} finally {
		if (statementWD != null) {
			statementWD.close();
		}
		if (connectionWD != null) {
			connectionWD.close();
		}
	}
	return dataset;	
}

function createDataset(fields, constraints, sortFields) { }

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    	
    var colunastitulo = new Array( 'ORCAMENTO_CARACTERISTICA_COD','CARACTERISTICA','ITEM_CLASSIFICACAO_COD','ITEM_MEDIDA_COD' );
		
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( 'Result Sync clientes logix 2......'+result );
    return result;

}
