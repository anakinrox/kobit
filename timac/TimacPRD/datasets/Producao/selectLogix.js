function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	
    var dataset = DatasetBuilder.newDataset();
        
    var campos = '1 as fixo';
    var where = '';
    var order = '1 ';
    var limit = 300;
    var distinct = '';
    var table = 'empresa';
    var dataBase = 'java:/jdbc/LogixDS';
    
    var created = false;	
    
    if (fields != null) {
    	for (var i = 0; i < fields.length; i++) {
    		if ( fields[i] != 'distinct' ){
    			campos += ', '+fields[i];
//    			dataset.addColumn( fields[i] );
    		}else{
    			distinct = 'distinct';
    		}
    	}
    }
    if( campos == '1 as fixo' ){
    	campos = ' * ';
    }
    var sqlWhere = "";
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
        	log.info( constraints[i] );
    		if ( constraints[i].fieldName == 'sqlLimit' ){
    				limit = constraints[i].initialValue;
    		}else if( constraints[i].fieldName == 'table' )  {
    				table = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'dataBase' )  {
    				dataBase = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'sqlWhere' )  {
    				sqlWhere = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'order' )  {
    				order = constraints[i].initialValue.replace('|',','); 
    		}else{ var not = '';
    					   var campo = constraints[i].getFieldName().toString();
    	    			   if ( constraints[i].constraintType == 'MUST_NOT' )
    	    				  	not = 'not';
    	    			   log.info( '######' + constraints[i].constraintType);
    	    			   
    	    			   if ( campo.indexOf('___not___') >= 0 ){
   	    				  		not = 'not';
   	    				  		campo = campo.replace('___not___','');
    	    			   }
    	    			   
    	    			   caseSen = 'upper';
    	    			   if ( campo.indexOf('___lower___') >= 0 ){
    	    				   caseSen = 'lower';
  	    				  		campo = campo.replace('___lower___','');
    	    			   }
    	    			   
    	    			   
    	    			   if ( campo.indexOf('___in___') >= 0 ){
    	    				   where += " and "+ campo.replace('___in___','') +
  				   			            " "+not+" in ( '"+ constraints[i].initialValue.replaceAll( '\\|', '\',\'' ) +"' ) ";
    	    			   }else if  ( constraints[i].likeSearch || constraints[i].constraintType == 'SHOULD' ){
    	    				   	where += " and "+campo +
    	    				   			 " "+not+" like "+ caseSen +"( '%"+ constraints[i].initialValue +"%' ) ";
    	    			   }else{
    	    				   	where += " and "+campo +
    	    				   			 " "+not+" between "+ caseSen +"( '"+ constraints[i].initialValue +"' ) and "+ caseSen +"( '"+ constraints[i].finalValue +"' )";
    	    			   }
    			}
    	}
	}

    if (sortFields != null) {
    	for (var i = 0; i < sortFields.length; i++) {
    		order += ', '+sortFields[i];
    	}
    }

    log.info( '$$$$$$$$$$$ '+ campos );
    log.info( '$$$$$$$$$$$ '+ where );
    log.info( '$$$$$$$$$$$ '+ order );
    log.info( '$$$$$$$$$$$ '+ limit );
    log.info( '$$$$$$$$$$$ '+ table );
    log.info( '$$$$$$$$$$$ '+ dataBase );
	
	
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		var connectionWD = dataSourceWD.getConnection();
		
		var SQL = "set isolation to dirty read";
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeUpdate();
		
		    SQL = " select first "+ limit +" "+ distinct +" "+ campos +
			      "   from "+ table +  
			      "  where 1=1 "+ where +" "+sqlWhere;
		if ( order != '' )
			 SQL += " order by "+ order ;
	
		log.info( SQL );
		 
		statementWD = connectionWD.prepareStatement(SQL);
		rsWD = statementWD.executeQuery();
	
		var columnCount = rsWD.getMetaData().getColumnCount(); 	
	
		for(var i=1;i<=columnCount; i++) {
			dataset.addColumn(rsWD.getMetaData().getColumnName(i).toLowerCase());
		}
		created = true;
		
		while(rsWD.next()){
	
			var Arr = new Array();
			
	        for(var i=1;i<=columnCount; i++) {
	          	var obj = rsWD.getObject(rsWD.getMetaData().getColumnName(i));
	            if(null!=obj){                                                                    
	               	Arr[i-1] = rsWD.getObject(rsWD.getMetaData().getColumnName(i)).toString();
	            }else{
	                Arr[i-1] = "null";
	            }
	        }	
			
			dataset.addRow(Arr);
		}
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}finally{	
		if( rsWD != null ) rsWD.close();
		if( statementWD != null ) statementWD.close();
		if( connectionWD != null ) connectionWD.close();
	}	
    return dataset;

}

function onMobileSync(user) { }