function validateForm(form){
	
	
	var task = getValue('WKNumState');
	var processo = getValue('WKDef');
	var numProcess = getValue("WKNumProces");
	var user = getValue("WKUser");
    
	if( getValue("WKCompletTask") && getValue('WKNumState') == 157 && getValue('WKNextState') == 54 ){
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'cod_empresa', form.getValue('cod_empresa'), form.getValue('cod_empresa'), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'num_pedido', form.getValue('pedido'), form.getValue('pedido'), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'num_pedido_repres', form.getValue('num_orc_logix'), form.getValue('num_orc_logix'), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'ies_sit_pedido', '9', '9', ConstraintType.MUST_NOT) );
		
		constraints.push( DatasetFactory.createConstraint( 'dataBase', 'java:/jdbc/LogixDS', null, ConstraintType.MUST_NOT) );
		constraints.push( DatasetFactory.createConstraint( 'table', 'pedidos', null, ConstraintType.MUST_NOT) );
		
	    var dataset = DatasetFactory.getDataset( 'selectTable', null, constraints, null);
		if ( dataset == null || dataset.rowsCount == 0 ){
			throw 'Não localizado chave (Empresa,Pedido,Orcamento) no ERP.';
		}
	}
}