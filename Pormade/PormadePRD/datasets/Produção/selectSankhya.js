function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	
    var dataset = DatasetBuilder.newDataset();
        
    var campos = '1 as fixo';
    var where = '';
    var order = '1 ';
    var limit = 300;
    var distinct = '';
    var whereCuston = '';
    var table = 'pmd_deparapis';
    var dataBase = 'java:/jdbc/SankhyaDSRO'; 
    
    var created = false;	
    
    log.info('### selectLogix.js Start ###');
    
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
    if( campos == '' || campos == '1 as fixo' ){
    	campos = ' * ';
    }
    
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
        	log.info( constraints[i] );
    		if ( constraints[i].fieldName == 'sqlLimit' ){
    				limit = constraints[i].initialValue;
    		}else if( constraints[i].fieldName == 'table' )  {
    				table = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'dataBase' )  {
    				dataBase = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'where' )  {
				whereCuston = constraints[i].initialValue;  		
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
		
		log.info( '$005... ' );
		var SQL = " select "+ distinct +" "+ campos +
			      "   from "+ table +  
			      "  where 1=1 "+ where ;
		log.info( 'SQL 1....'+SQL );
		if ( limit != 0 )
			SQL += " and rownum <= "+limit+" ";
		log.info( 'SQL 2....'+SQL );
		if ( whereCuston != "" ){
			if ( whereCuston.substring(0, 3).toLowerCase() == 'and' ){
				SQL += whereCuston;
			}else{
				SQL += ' and '+whereCuston; 
			}
		}
		log.info( 'SQL 3....'+SQL );
		if ( order != '' )
			 SQL += " order by "+ order ;
		log.info( 'SQL 4....'+SQL );
		
		statementWD = connectionWD.prepareStatement(SQL);
		rsWD = statementWD.executeQuery();
	
		var columnCount = rsWD.getMetaData().getColumnCount(); 	
		 	
		for(var i=1;i<=columnCount; i++) {
			dataset.addColumn( rsWD.getMetaData().getColumnName(i) );
		}
		
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
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	} finally{
		if(statementWD != null) statementWD.close();
		if(connectionWD != null) connectionWD.close();
	}
	
    return dataset;

}

function onMobileSync(user) { }