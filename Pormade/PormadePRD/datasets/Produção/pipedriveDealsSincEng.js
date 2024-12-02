function defineStructure() {
	addColumn( 'status' );
}
function onSync(lastSyncDate) {
	
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'status' );
    
    
	var listaConstraits = {};
	var params = {};
	
	var area = "E";
	var token = "";
	log.info('Leitura Parametros......' );
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
	var pipe = DatasetFactory.getDataset("pipedrive", null, constraints, null);
	if( pipe.rowsCount === 0 ){
		throw "Não cadastrato parametro para esse tipo de integração.";
	}else{
		if( token === "" ){
			token = pipe.getValue(0,"token_api");
		}
	}
	
	//log.info(' FONE '+ listaConstraits['fone'] );
	
	var connectionWD = null;
	var statementWD = null;
	
	var ontem = new Date( new Date().setHours(-24*10) );
	var endpoint = "/v1/deals/timeline?start_date="+ ontem.toJSON().substring(0,10) +"&interval=day&amount=11&field_key=update_time&api_token="+token;
    //var ontem = new Date( new Date().setHours(-24*120) );
	
	//var endpoint = "/v1/deals/timeline?start_date="+ ontem.toJSON().substring(0,10) +"&interval=day&amount=30&field_key=update_time&api_token="+token;
	 	
	try{
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId : getValue("WKCompany") + "",
			serviceCode : "pipedrive",
			endpoint : endpoint,
			timeoutService : "240",
			method : "GET"
		};
		printLog( 'info', "## DADOS CABECALHO ##");
			
		var headers = {};
		headers["Content-Type"] = "application/json";
		data["headers"] = headers;

		
		//params["title"] = listaConstraits['title'];
		
		data["params"] = params;
		
		printLog( 'info', "## antes do stringify ## " + data );
		var jj = JSON.stringify(data);
	
		printLog( 'info', "## RESULT POST jj ## " + jj);
			
		var vo = clientService.invoke(jj);
		printLog( 'info', "## RESULT POST VO ## " + vo.toString() );
		if (vo.getResult() === "" || vo.getResult().isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			//printLog( 'info', "## success ## " + JSON.stringify(jr));
			//printLog( 'info', "## success ## " + jr.success);
			
			
			if( !jr.success ){
				throw 'Erro na integração com PipeDrive';
			} 
			
			
			if( jr.data !== null ){
				
				var contextWD = new javax.naming.InitialContext();
				var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
				connectionWD = dataSourceWD.getConnection();
				
				printLog( 'info', "## LOOP DEAL I ## " + jr.data.length);
				
				for( var i = 0; i < jr.data.length; i++ ){
					
					printLog( 'info', "## LOOP DEAL J ## " + jr.data[i].deals.length);
					for( var j = 0; j < jr.data[i].deals.length; j++ ){
						/*if( j > 10 ){
							return newDataset;
						}*/
						
						printLog( 'info', "## LOOP DEAL Data ## " + jr.data[i].deals[j].expected_close_date );
						
						if( jr.data[i].deals[j].expected_close_date !== null
						 && jr.data[i].deals[j].expected_close_date !== ""
						 && jr.data[i].deals[j].expected_close_date != "null"
						 && jr.data[i].deals[j].expected_close_date !== undefined ){
									
							printLog( 'info', "## PROPOSTA ## " + jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c'] );
							if( jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c']+"" !== ""
							 && jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c'] !== undefined
							 && jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c'] !== null ){
										
								var proposta =  jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c']+""; 
								var sql = "update pmd_proposta " +
										"     set prev_fechamento = '"+ jr.data[i].deals[j].expected_close_date +"' "+
										"	where num_proposta = "+ proposta +" " +
										"	  and versao_proposta = (select max(versao_proposta) "+ 
										"	 						   from pmd_proposta "+
										"   						  where num_proposta = "+ proposta +" ) ";
	
								statementWD = connectionWD.prepareStatement( sql );
								statementWD.executeUpdate();
							}
									
							printLog( 'info', "## PROPOSTA CPL ## " + jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963'] );
							if( jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963']+"" !== ""
							 && jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963'] !== undefined
							 && jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963'] !== null ){
								var aProposta = ( jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963']+"").split(','); 
								printLog( 'info', ' length proposta.......'+aProposta.length );
								for( var r = 0; r < aProposta.length; r ++ ){
									var proposta = parseInt(  aProposta[r] );
									if( !isNaN( proposta ) ){
										var sql = "update pmd_proposta " +
												"     set prev_fechamento = '"+ jr.data[i].deals[j].expected_close_date +"' "+
												"	where num_proposta = "+ proposta +" " +
												"	  and versao_proposta = (select max(versao_proposta) "+ 
												"	 						   from pmd_proposta "+
												"   						  where num_proposta = "+ proposta +" ) ";
		
										statementWD = connectionWD.prepareStatement( sql );
										statementWD.executeUpdate();
									}
								}
							}
						}
					}
				}
			}
							
							
						/*	var endpointSub = "/v1/deals/"+jr.data[i].deals[j].id+"?&api_token="+token;
							var clientServiceSub = fluigAPI.getAuthorizeClientService();
							
							var dataSub = {
								companyId : getValue("WKCompany") + "",
								serviceCode : "pipedrive",
								endpoint : endpointSub,
								timeoutService : "240",
								method : "GET"
							};
							printLog( 'info', "## DADOS CABECALHO ##");
								
							var headersSub = {};
							var paramsSub = {};
							headersSub["Content-Type"] = "application/json";
							dataSub["headers"] = headersSub;
							dataSub["params"] = paramsSub;
							printLog( 'info', "## antes do stringify Sub ## " + dataSub );
							var jjSub = JSON.stringify(dataSub);
							printLog( 'info', "## RESULT POST jj ## Sub " + jjSub);
							var voSub = clientServiceSub.invoke(jjSub);
							printLog( 'info', "## RESULT POST VO ## " + voSub.toString() );
							if (voSub.getResult() !== "" && !voSub.getResult().isEmpty()) {
								var jrSub = JSON.parse(voSub.getResult());
								printLog( 'info', "## success ## " + JSON.stringify(jrSub));
								printLog( 'info', "## success ## " + jrSub.success);
								if( jrSub.success ){
									if( jrSub.data !== null ){
										if( jrSub.data.expected_close_date !== null
										 && jrSub.data.expected_close_date !== ""
										 && jrSub.data.expected_close_date != "null"
										 && jrSub.data.expected_close_date !== undefined ){
											
											//log.info('proposta.......'+jrSub.data['40331fcfd443f28b0fd610f1f14d096cda39c19c']);
											if( jrSub.data['40331fcfd443f28b0fd610f1f14d096cda39c19c']+"" !== ""
											  && jrSub.data['40331fcfd443f28b0fd610f1f14d096cda39c19c'] !== undefined
											  && jrSub.data['40331fcfd443f28b0fd610f1f14d096cda39c19c'] !== null ){
												
												var proposta =  jrSub.data['40331fcfd443f28b0fd610f1f14d096cda39c19c']+""; 

												var sql = "update pmd_proposta " +
														"     set prev_fechamento = '"+ jrSub.data.expected_close_date +"' "+
														"	where num_proposta = "+ proposta +" " +
														"	  and versao_proposta = (select max(versao_proposta) "+ 
														"	 						   from pmd_proposta "+
														"   						  where num_proposta = "+ proposta +" ) ";
			
												statementWD = connectionWD.prepareStatement( sql );
												statementWD.executeUpdate();
											}
											
											//log.info('proposta.......'+jrSub.data['6be8abfa06949351119d00d3fb3ad27bce8fc963']);
											if( jrSub.data['6be8abfa06949351119d00d3fb3ad27bce8fc963']+"" !== ""
											  && jrSub.data['6be8abfa06949351119d00d3fb3ad27bce8fc963'] !== undefined
											  && jrSub.data['6be8abfa06949351119d00d3fb3ad27bce8fc963'] !== null ){
												
												var aProposta = ( jrSub.data['6be8abfa06949351119d00d3fb3ad27bce8fc963']+"").split(','); 
												//log.info('length proposta.......'+aProposta.length );
											
												
												for( var r = 0; r < aProposta.length; r ++ ){
												    
												    
												    var proposta = parseInt(  aProposta[r] );
												    
												    if( !isNaN( proposta ) ){
												    
    													var sql = "update pmd_proposta " +
    															"     set prev_fechamento = '"+ jrSub.data.expected_close_date +"' "+
    															"	where num_proposta = "+ proposta +" " +
    															"	  and versao_proposta = (select max(versao_proposta) "+ 
    															"	 						   from pmd_proposta "+
    															"   						  where num_proposta = "+ proposta +" ) ";
    			
    													statementWD = connectionWD.prepareStatement( sql );
    													statementWD.executeUpdate();
												    }
												}
											}
										}
									}
								}
							}
						}						
					}
				}
			}*/
		}
		
	} catch(erro) { 
		printLog( 'erro', "ERROOOOOO" + erro.toString() );
		throw erro.toString();
	}finally {
		if(statementWD !== null) statementWD.close();
		if(connectionWD !== null) connectionWD.close();
	} 
	
	return newDataset;
	
}
function createDataset(fields, constraints, sortFields) {
	
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'id' );
    newDataset.addColumn( 'title' );

	
	return newDataset;
	
}

function onMobileSync(user) {

}

var debug = false;

function printLog( tipo, msg ){
	
	if( debug ){
		var msgs = getValue("WKDef")+" - "+getValue("WKNumProces")+" - "+msg
		if( tipo == 'info'){
			log.info( msgs );
		}else if( tipo == 'error' ){
			log.error( msgs );
		}else if( tipo == 'fatal' ){
			log.fatal( msgs );
		}else{
			log.warn( msgs );
		}
	}
}