function defineStructure() {}
function onSync(lastSyncDate) {}
function onMobileSync(user) {}
function createDataset(fields, constraints, sortFields) {
	
	var obraCidade = '';
	var ufCidade = '';

	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	if ( constraints[i].fieldName == "obraCidade" ){
        		obraCidade = '%'+constraints[i].initialValue+'%';
        	}
        	
        	if ( constraints[i].fieldName == "ufCidade" ){
        		ufCidade = '%'+constraints[i].initialValue+'%';
        	}
    		
        	
        }
	}
	
	var dataset = DatasetBuilder.newDataset();
    
    var connectionWD;
    var statementWD;
    try{    

    	var dataBase = 'java:/jdbc/CRMDS';
    	var SQLconstrat =
    		'SELECT cod_cidade, den_cidade, cod_uni_feder ' +
			' FROM cidades ' +
			' WHERE 1=1 and upper( den_cidade) like upper (?) ' +
			'			and upper( cod_uni_feder ) like upper (?)';
    	
	    var created = false;
	    
	    log.info( SQLconstrat );
	    log.info( obraCidade );
	    log.info( ufCidade );

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		connectionWD = dataSourceWD.getConnection();

		statementWD = connectionWD.prepareStatement(SQLconstrat);
		
		statementWD.setString(1, obraCidade);
		statementWD.setString(2, ufCidade);
		
		rsWD = statementWD.executeQuery();
	    var columnCount = rsWD.getMetaData().getColumnCount();
	    
	    for(var i=1;i<=columnCount; i++) {
			dataset.addColumn(rsWD.getMetaData().getColumnLabel(i).toLowerCase());
		}
	    created = true;
	    
	    while(rsWD.next()) {
	    	
	        var Arr = new Array();
	                                           
	        for(var i=1;i<=columnCount; i++) {
	          	var obj = rsWD.getObject( rsWD.getMetaData().getColumnLabel(i) );
	            if(null!=obj){                                                                    
	               	Arr[i-1] = rsWD.getObject( rsWD.getMetaData().getColumnLabel(i) ).toString();
	            }else{
	                Arr[i-1] = "null";
	            }
	        }
	        dataset.addRow(Arr);
		}
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
    } catch (e){
		dataset.addColumn('status');
		dataset.addRow( new Array('Erro: '+e.getMessage()) );
	}
	finally {
    	if(statementWD != null) statementWD.close();
        if(connectionWD != null) connectionWD.close();
    }	
	
    return dataset;
	
	

}