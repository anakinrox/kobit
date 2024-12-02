function servicetask141(attempt, message) {
	
	var cod_empresa = hAPI.getCardValue( "empresa" );
	var num_pedido = hAPI.getCardValue( "num_pedido" );
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'cod_empresa', cod_empresa, cod_empresa, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'num_pedido', num_pedido, num_pedido, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'tipo', 'B', 'B', ConstraintType.MUST) );
    //Busca o dataset
    var dataset = DatasetFactory.getDataset( 'pedido_bloqueio', null, constraints, null);
    log.dir(dataset);
	if ( dataset != null ){
		for (var x = 0; x < dataset.rowsCount; x++) {
			log.info( "code......"+dataset.getValue(x, "code") );
			if( dataset.getValue(x, "code") != 201 ){
				throw dataset.getValue(x, "menssage");
			}
		}
	}
	
}