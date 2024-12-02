function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {	
	
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('cod_repres');
	newDataset.addColumn('lst_repres');
	newDataset.addColumn('nome_usuario');
	newDataset.addColumn('tipo_cadastro');
	
	var listaConstraits = {};
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	listaConstraits[constraints[i].fieldName] = constraints[i].initialValue;
        }
    }
	
	var user = listaConstraits['user'];
	if( user == undefined || user == "" || user == "null" || user == null   ){
		user = listaConstraits['matricula'];;
	}
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('matricula', user, user, ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset("representante_compl", null, constraints, null);
		
	var nome_responsavel = "";
	var lst_repres = [];
	var tipo_cadastro = "R";
	var nome_usuario = "";
	var cod_repres = "";
				
	var lstCarteiras = [];
	
	if (dataset != null && dataset.rowsCount > 0 ) {
		var i = 0;
		for( i = 0; i<dataset.rowsCount; i++ ){
			
			if( dataset.getValue(i,"tipo_cadastro") == "G" ){
				tipo_cadastro = 'G';
			}else if( dataset.getValue(i,"tipo_cadastro") == "A" && tipo_cadastro != 'G' ){
				tipo_cadastro = 'A';
			}
			
			if( i == 0 ){
				nome_usuario = dataset.getValue(i,"raz_social");
				cod_repres = dataset.getValue(i,"cod_repres");
			}
			lst_repres.push( dataset.getValue(i,"cod_repres") );
		}
	
	
		newDataset.addRow( [ cod_repres, lst_repres.join('|'), nome_usuario, tipo_cadastro ] );
	}

	return newDataset;
	
}
function onMobileSync(user) {

}