function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	
	try{
		
	    var campos = '1 as fixo';
	    var where = '';
	    var order = '1 ';
	    var limit = 300;
	    var distinct = '';
	    var table = 'crm.tb_origem';
	    var dataBase = 'java:/jdbc/CRMDS';
	    
	    log.info("Passo 01");
	   
	    
	    if (fields != null) {
	    	for (var i = 0; i < fields.length; i++) {
	    		if ( fields[i] != 'distinct' ){
	    			campos += ', '+fields[i].replace('___int___','');
	    		}else{
	    			distinct = 'distinct';
	    		}
	    	}
	    }
	   
	    log.info("Passo 02");
	    
		if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	        	log.info( constraints[i] );
	    		if ( constraints[i].fieldName == 'sqlLimit' ){
	    				limit = constraints[i].initialValue;
	    		}else if( constraints[i].fieldName == 'order' )  {
	    				order = constraints[i].initialValue.replace('|',',');   			
	    		}else{ var not = '';
	    			  var campo = constraints[i].getFieldName().toString();
	    			  log.info( '###### campo ' + campo);
	    	    	  if ( constraints[i].constraintType == 'MUST_NOT' )
	    	    		  not = 'not';
	    	    	  log.info( '######' + constraints[i].constraintType);
	    	    			   
	    	    	  if ( campo.indexOf('___not___') >= 0 ){
	    	    		  not = 'not';
	    	    		  campo = campo.replace('___not___','');
	    	    	  }
	    	    	  var upper_lower = "upper";
	    	    	  var campoInt = false;
	    	    	  if ( campo.indexOf('___lower___') >= 0  ){
	    	    		  upper_lower = "lower";
	    	    		  campo = campo.replace('___lower___','');
	    	    	  } else if ( campo.indexOf('___int___') >= 0  ){
	    	    		   log.info( '###### entrei ___int___ campo'+ campo);
	    	    		   upper_lower = "";
	    	    		   campo = campo.replace('___int___','');
	    	    		   campoInt = true;
	    	    	  }
	    	    			   
	    	    	  log.info( '###### entrei ___int___ campo'+ campo +' '+campoInt);
	    	    			   
	    	    	  log.info('CheckDate....... '+ CheckDate( constraints[i].initialValue ) );
	    	    	  if( constraints[i].initialValue == 'true' 
	    	    	   || constraints[i].initialValue == 'false'
	    	    	   || CheckDate( constraints[i].initialValue )  ){
	    	    		  upper_lower = '';
	    	    	  }
	    	    	  if ( campo.indexOf('___in___') >= 0 ){
	    	    		  where += " and "+ campo.replace('___in___','') +" "+
	  				            	" "+not+" in ( '"+ constraints[i].initialValue.replaceAll( '\\|', '\',\'' ) +"' ) ";
	    	    	  }else if ( ( constraints[i].likeSearch || constraints[i].constraintType == 'SHOULD' ) && !campoInt ){
	    	    		  where += " and unaccent( "+campo +" ) "+
	    	    		  			" "+not+" ilike unaccent( '%"+ constraints[i].initialValue +"%' ) ";
	    	    	  }else{
	    	    		  if( campoInt ){
	    	    			  where += " and  "+ campo +" "+
   	    				    			" "+not+" between "+ constraints[i].initialValue +" and "+ constraints[i].finalValue +" ";	    	    					   
	    	    		   }else{
	    	    			   where += " and "+ upper_lower +" ("+ campo +") "+
		    	    		   			 " "+not+" between "+ upper_lower +"( '"+ constraints[i].initialValue +"' ) and "+ upper_lower +"( '"+ constraints[i].finalValue +"' )";
	    	    		   }
	    	    	  }
	    		}
	    	}
		}
	
		log.info("Passo 03");
		
	    if (sortFields != null) {
	    	for (var i = 0; i < sortFields.length; i++) {
	    		order += ', '+sortFields[i];
	    	}
	    }
	
	    if( campos == '1 as fixo' ){
	    	campos = '1 as fixo, *'
	    }
	    
	    if( order = '1 ' ){
	    	order = 'descricao '
	    }
	    
	    log.info( '$$$$$$$$$$$ '+ campos );
	    log.info( '$$$$$$$$$$$ '+ where );
	    log.info( '$$$$$$$$$$$ '+ order );
	    log.info( '$$$$$$$$$$$ '+ limit );
	    log.info( '$$$$$$$$$$$ '+ table );
	    log.info( '$$$$$$$$$$$ '+ dataBase );
		
		
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		var connectionWD = dataSourceWD.getConnection();
		
	    SQL = " select " +
	    	  "  "+ distinct +" "+ campos +
		      "  from "+ table +  
			  "  where 1=1 and ativo = true "+ where ;
		if ( order != '' )
			 SQL += " order by "+ order ;

    	SQL +=	" limit "+ limit ;	
		
		log.info( SQL );
		 
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
		
		log.info( ' statementWD.executeQuery() OK ' );
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}finally {
    	log.info('##### 6 #####');
    	if(statementWD != null) statementWD.close();
        if(connectionWD != null) connectionWD.close();
    }

		
    return dataset;

}

function isNumeric( obj ) {
	return !isNaN( parseFloat(obj) ) && isFinite( obj );
}

function onMobileSync(user) { }


function CheckDate( dataPar ) {
		data = dataPar+"";
		log.info('arguments[0].....'+data );
		log.info('typeof (data).....'+typeof (data) );
		
		if( typeof (data) != "string" ){
			log.info(' return if 0001 ' );
			return false;
		}
	    var aAr = data.split("/");
	    if( aAr.length != 3 ){
	    	return false;
	    	log.info(' return if 0002 ' );
	    }
	    var lDay = parseInt(aAr[0]);
	    var lMon = parseInt(aAr[1]); 
	    var lYear = parseInt(aAr[2]);
	    
	    BiY = ( lYear % 4 == 0 
	    	 && lYear % 100 != 0 ) || lYear % 400 == 0,
	    
	     MT = [1, BiY ? -1 : -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
	    
	    log.info('antes retorno.....'+lMon+' '+lDay );
	    if( lMon <= 12 && lMon > 0 && lDay <= MT[lMon - 1] + 30 && lDay > 0 ){
	    	return true;
	    	log.info(' return if 0003 ' );
	    }else{
	    	return false;
	    	log.info(' return else 0003 ' );
	    }
	}