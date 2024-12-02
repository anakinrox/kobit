function defineStructure() {
	

	addColumn("cod_erp");	
	addColumn("id_cidade");	
	addColumn("cidade");	
	addColumn("cod_uf");	
	addColumn("uf");	
	addColumn("nome");	
	addColumn("cod_pais");	
	addColumn("pais");	
	addColumn("cod_cidade");	
	
    setKey([ "id_cidade" ]);
    addIndex([ "id_cidade" ]);
    addIndex([ "cod_cidade" ]);
    addIndex([ "cod_erp" ]);  
    
}

function onSync(lastSyncDate) {
    
    
    var connectionWD;
    var statementWD;

try{
	
	
	log.info( 'Inicio......' );	
    var dataset = DatasetBuilder.newDataset();
    log.info( 'Entrei...... 1' );
        

		var contextWD = new javax.naming.InitialContext();
		log.info( 'Entrei...... 3 a' );
		var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
		log.info( 'Entrei...... 3 b' );
		connectionWD = dataSourceWD.getConnection();
		log.info( 'Entrei...... 3 c' );
	
	log.info( 'Entrei...... 4' );
	
	var SQL = " select cod_erp, "+     
        	"			id, "+
        	"			upper(cidade) as cidade, "+
        	"			cod_uf, "+
        	"			upper(uf) as uf, "+
        	"			upper(nome) as nome, "+
        	"			cod_pais, "+
        	"			upper(pais) as pais, "+
        	"			cod_cidade "+
        	"	   from fluig_v_cidade ";
	
	//SQL = SQL + " and ob.obra_sequencia = '37786'";
   		   
	log.info( SQL );
	
	statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	var i = 0;
	
	while(rsWD.next()){
		
		log.info( 'cidade'+ rsWD.getString("cidade") );
		
		var obra = new Array();
		
		obra.push( rsWD.getString("cod_erp") );	
		obra.push( rsWD.getString("id") );	
		obra.push( rsWD.getString("cidade") );	
		obra.push( rsWD.getString("cod_uf") );	
		obra.push( rsWD.getString("uf") );	
		obra.push( rsWD.getString("nome") );	
		obra.push( rsWD.getString("cod_pais") );	
		obra.push( rsWD.getString("pais") );	
		obra.push( rsWD.getString("cod_cidade") );		
		dataset.addOrUpdateRow( obra );
	}
	
	log.info( 'FIM LOOP...... ');
	rsWD.close();
	log.info( 'FIM CLASE WD...... ');
    
} catch (e){
	log.info( "ERROOOOOO"+ e.toString() );
} finally {
	if (statementWD !== null) {
		statementWD.close();
	}
	if (connectionWD !== null) {
		connectionWD.close();
	}
}
	
	 return dataset;
}

function createDataset(fields, constraints, sortFields) {
	
}

function onMobileSync(user) {

	log.info( 'inicio sync clientes logix 2.......'+user.userCode );
	
	
    var sortingFields = new Array();
    var constraints = new Array();
  
    var colunastitulo = new Array( 'cod_erp','id_cidade','cidade','cod_uf','uf','nome','cod_pais','pais','cod_cidade' );

         
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( 'Result Sync clientes logix 2......'+result );
    return result;
    
}