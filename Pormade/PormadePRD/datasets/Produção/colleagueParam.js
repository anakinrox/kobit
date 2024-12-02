function defineStructure() {}

function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    var dataBase = 'java:/jdbc/FluigDS';
    var param = '';
    var user = '';
    var empresa = '';
    var val_param = "";
    
    dataset.addColumn( "val_param" );
    dataset.addColumn( "chave" );

	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
        	log.info( 'Campo....  '+constraints[i].fieldName+' ... '+constraints[i].initialValue );
    		if ( constraints[i].fieldName == 'colleaguePK.companyId' ){
    			empresa = constraints[i].initialValue.trim();
    		}else if( constraints[i].fieldName == 'colleaguePK.colleagueId' )  {
    			user = constraints[i].initialValue.trim();    			
    		}else if( constraints[i].fieldName == 'chave' )  {
    			param = constraints[i].initialValue.trim();    			
    		} if( constraints[i].fieldName == 'val_param' )  {
    			val_param = constraints[i].initialValue.trim();    			
    		}
    	}
	}

	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		var connectionWD = dataSourceWD.getConnection();

		var SQL = "";
		
		if ( val_param == "" ){
			if( param == 'user_logix' || param == 'cnpj_raiz' || param == 'fortics' ){
				SQL = " select d.DATA_VALUE, d.DATA_KEY "+ 
			      "   from fdn_usertenant u "+
			      "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
			      "  where u.user_state = '1' " +
			      "	   and u.TENANT_ID = "+empresa+" "+
			      "    and u.USER_CODE = '"+user+"' "+
			      "    and d.DATA_KEY like '"+param+"%'  ";			
			}else{
				SQL = " select d.DATA_VALUE, d.DATA_KEY "+ 
				      "   from fdn_usertenant u "+
				      "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
				      "  where u.TENANT_ID = "+empresa+" "+
				      "    and u.USER_CODE = '"+user+"' "+
				      "    and d.DATA_KEY = '"+param+"'  ";
			}
		}else{
			if( param == 'user_logix' || param == 'cnpj_raiz' || param == 'fortics' ){
				SQL = " select u.USER_CODE as DATA_VALUE, d.DATA_KEY "+ 
		      	  "   from fdn_usertenant u "+
		      	  "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
		      	  "  where u.TENANT_ID = "+empresa+" "+
		      	  "    and d.DATA_VALUE = '"+val_param+"' "+
		      	  "    and d.DATA_KEY like '"+param+"%'  ";			
			}else{
				SQL = " select u.USER_CODE as DATA_VALUE, d.DATA_KEY "+ 
		      	  "   from fdn_usertenant u "+
		      	  "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
		      	  "  where u.TENANT_ID = "+empresa+" "+
		      	  "    and d.DATA_VALUE = '"+val_param+"' "+
		      	  "    and d.DATA_KEY = '"+param+"'  ";
			}
		}	
		
		log.info( "SQL..... "+SQL );
		
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while(rsWD.next()){
			var dados = new Array();
			dados.push( rsWD.getString( "DATA_VALUE" )  );
			dados.push( rsWD.getString( "DATA_KEY" )  );
			dataset.addRow( dados );		
		}

		rsWD.close();

	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
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

function onMobileSync(user) { }