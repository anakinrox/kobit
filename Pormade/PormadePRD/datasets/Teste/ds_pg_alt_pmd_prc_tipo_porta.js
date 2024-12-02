function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();

	newDataset.addColumn("STATUS");
	newDataset.addColumn("ERROR");
	
    var dataSource = "java:/jdbc/CRMDS";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var conn = ds.getConnection();
    
	var cod_tipoPorta_edit = '';
	var descricao_tipoPorta_edit = '';
	var porta_dupla_edit = '';
	var material_tipoPorta_edit = '';
	var preco_tipoPorta_edit = '';
	var status_tipoPorta_edit = '';
	
	
    for (var i in constraints){
    	
    	if ( constraints[i].getFieldName().toString() == 'cod_tipoPorta_edit' ) {
    		cod_tipoPorta_edit = constraints[i].initialValue;
    	}
	    if ( constraints[i].getFieldName().toString() == 'descricao_tipoPorta_edit' ) {
	    	descricao_tipoPorta_edit = constraints[i].initialValue;
    	}
	    if( constraints[i].getFieldName().toString() == 'porta_dupla_edit'){
	    	porta_dupla_edit = constraints[i].initialValue;
	    }
	    if ( constraints[i].getFieldName().toString() == 'material_tipoPorta_edit' ) {
	    	material_tipoPorta_edit = constraints[i].initialValue;
	    }
	    if ( constraints[i].getFieldName().toString() == 'preco_tipoPorta_edit' ) {
	    	preco_tipoPorta_edit = constraints[i].initialValue;
	    }
	    if ( constraints[i].getFieldName().toString() == 'status_tipoPorta_edit' ) {
	    	status_tipoPorta_edit = constraints[i].initialValue;
	    }
	       	
    }
    
    
    try {
       
    	var SQL_UPDATE = "UPDATE pmd_prc_tipo_porta " +
    					 "SET descricao_tipoporta='" + descricao_tipoPorta_edit + "', " +
    					 	"porta_dupla = '" + porta_dupla_edit + "', " +
    						" material_tipoporta='" + material_tipoPorta_edit + "', " +
    						" preco_tipoporta='" + preco_tipoPorta_edit + "', " +
    						" status_tipoporta='" + status_tipoPorta_edit + "' " +
    					 "WHERE cod_tipoporta=" + cod_tipoPorta_edit;
    	
    	log.info("SQL ALTERACAO TIPO DE PORTA: " + SQL_UPDATE);
		
		var statemGravacao = conn.prepareStatement(SQL_UPDATE);
		var rsWD1 = statemGravacao.executeUpdate();
		
		newDataset.addRow(new Array(  "SUCCESS"  , "" ));
    	
        
    } catch (e) {
        log.error("NÃO FOI POSSIVEL GRAVAR NO BANCO DE DADOS, ENTRE EM CONTATO COM A EQUIPE DE TI");
        
        var error = "NÃO FOI POSSIVEL GRAVAR NO BANCO DE DADOS, ENTRE EM CONTATO COM A EQUIPE DE TI";
		newDataset.addRow(new Array(  "ERROR"  , error ));
		
    } finally {
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
	

}function onMobileSync(user) {

}