function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

		log.info( 'Start dataset ' );
		
	    var tableName = 'aprov_entrada_saida';
	    var dataSetName = 'centro_de_custo';
		var listaConstraits = {};
	    var newConstraintsPai = new Array();
	    var newConstraintsFilho = new Array();
	    var newConstraints = new Array();

	    log.info( 'Start dataset ' );
	    
		if (constraints != null && constraints.length > 0) {			
	        for (var i = 0; i < constraints.length; i++) {
	        	log.info( 'Constrait '+i );
	        	log.info( constraints[i] );
	    		if ( constraints[i].fieldName == 'dataSet' ){
	    			dataSetName = constraints[i].initialValue;
	    		}else if( constraints[i].fieldName == 'table' )  {
	    			tableName = constraints[i].initialValue;    			
	    		}else if( constraints[i].fieldName.substring(0, 4) == 'pai_' )  {
	    			constraints[i].fieldName = constraints[i].fieldName.substring(4);
	    			log.info( 'constrai pai....'+constraints[i].fieldName );
	    			newConstraintsPai.push( constraints[i] );
	    		}else if( constraints[i].fieldName.substring(0, 6) == 'filho_' )  {
	    			constraints[i].fieldName = constraints[i].fieldName.substring(6);
	    			log.info( 'constrai filho....'+constraints[i].fieldName );
	    			newConstraintsFilho.push( constraints[i] );
	    		}
	    	}
		}
		
		log.info( 'Cria newDataSet ' );
	    var newDataset = DatasetBuilder.newDataset();   
	 
	    try{    
			log.info( '$001... ' );
			var contextWD = new javax.naming.InitialContext();
			log.info( '$002... ' );
			var dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
			log.info( '$003... ' );
			var connectionWD = dataSourceWD.getConnection();
			log.info( '$004... ' );
		
	    	
			var sql = " select doc.COD_LISTA, ml.COD_LISTA_FILHO "+
				  		" from documento doc "+
				  		" join META_LISTA_REL ml on (ml.COD_EMPRESA = doc.COD_EMPRESA "+
				        "                     and ml.COD_LISTA_PAI = doc.COD_LISTA "+
				        "                     and ml.COD_TABELA = '"+ tableName +"' ) "+
				 		" where doc.COD_EMPRESA = 1 "+
				   		"   and doc.NM_DATASET = '"+ dataSetName +"' "+
				   		"   and doc.VERSAO_ATIVA = 1 ";
			
			log.info( '$005... '+sql );
			statementWD = connectionWD.prepareStatement(sql);
			rsWD = statementWD.executeQuery();

			var mlPai = '';
			var mlFilho = '';
			
		    while(rsWD.next()) {
		    	mlPai = rsWD.getString( 'COD_LISTA' );
		    	mlFilho = rsWD.getString( 'COD_LISTA_FILHO' );
		    }
			
	    	
		    var sql = " select * "+
			   			" from ML001"+ getLPad( mlPai, '000' ) +" p "+
			   			" join ML001"+ getLPad( mlFilho, '000' ) +" f on (p.companyid = f.companyid "+
						"				and p.documentid = f.documentid "+
						"				and p.version = f.version) "+
						" join DOCUMENTO d on (d.COD_EMPRESA = p.companyid "+
						"					and d.NR_DOCUMENTO = p.documentid "+
						"					and d.NR_VERSAO = p.version) "+
						" where p.companyid = 1 "+
						"   and d.VERSAO_ATIVA = 1 ";
						
		    log.info( '$006... '+sql );
		    
			if (newConstraintsPai != null) {			
		        for (var i = 0; i < newConstraintsPai.length; i++) {
		        	log.info( 'newConstraintsPai '+constraints[i] );
		        	sql += " and "+newConstraintsPai[i].fieldName+" = '"+newConstraintsPai[i].initialValue+"' "
		        }
			}

		    log.info( '$007... '+sql );
		    
			if (newConstraintsFilho != null) {			
		        for (var i = 0; i < newConstraintsFilho.length; i++) {
		        	log.info( 'newConstraintsPai '+constraints[i] );
		        	sql += " and "+newConstraintsFilho[i].fieldName+" = '"+newConstraintsFilho[i].initialValue+"' "
		        }
			}
						
		    log.info( '$008... '+sql );

			statementWD = connectionWD.prepareStatement(sql);
			rsWD = statementWD.executeQuery();
			
		    var columnCount = rsWD.getMetaData().getColumnCount();
		    var created = false;	
		    
		    while(rsWD.next()) {
		    	if(!created) {
		    		for(var i=1;i<=columnCount; i++) {
		    			newDataset.addColumn(rsWD.getMetaData().getColumnName(i).toLowerCase());
		    		}
		    		created = true;
		        }
		        var Arr = new Array();
		                                           
		        for(var i=1;i<=columnCount; i++) {
		          	var obj = rsWD.getObject(rsWD.getMetaData().getColumnName(i));
		            if(null!=obj){                                                                    
		               	Arr[i-1] = rsWD.getObject(rsWD.getMetaData().getColumnName(i)).toString();
		            }else{
		                Arr[i-1] = "null";
		            }
		        }
		        newDataset.addRow(Arr);
			}
			
			
			rsWD.close();
			statementWD.close();
			connectionWD.close();
			
			
		} catch (e){
			log.info( "ERROOOOOO"+ e.toString() );
		}
		finally {
			log.info('##### 6 #####');
			if(statementWD != null) statementWD.close();
		    if(statementWD != null) statementWD.close();
		}
			
		return newDataset;
		
	}	

function onMobileSync(user) {}


function onMobileSync(user) {

}

function getLPad( valor, pad){
	var str = "" + valor;
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}