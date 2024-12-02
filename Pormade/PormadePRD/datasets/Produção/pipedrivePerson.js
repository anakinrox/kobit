function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	
	printLog( 'info', "## CREATE DATASET PIPEDRIVE ## ");
	
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'id' );
    newDataset.addColumn( 'name' );
    newDataset.addColumn( 'email' );
    newDataset.addColumn( 'org_name' );
    newDataset.addColumn( 'org_id' );
    newDataset.addColumn( 'phone' );
    newDataset.addColumn( 'statusADVI' );
    newDataset.addColumn( 'statusADVA' );
    newDataset.addColumn( 'statusOUTER' );
    
    var listaIDs = [];
    
    var temReg = false; 
    
	var listaConstraits = {};
	listaConstraits['phone'] = "";
	listaConstraits['name'] = "";
	listaConstraits['status_pipeline'] = "N";
	var params = {};
	var area = "V";
	if (constraints != null) {
		 for (var i = 0; i < constraints.length; i++) {
	       	if( constraints[i].fieldName.trim() == "area" ){
	       		area = constraints[i].initialValue;
	       	}else{
		   		listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
		   		params[ constraints[i].fieldName.trim() ] = constraints[i].initialValue + "";
		   		log.info('fieldName.....'+constraints[i].fieldName+'...value....' + constraints[i].initialValue);
	       }
		}
    }
    
	var user = getValue("WKUser");	
	
	var chave = 'pipedrive';
	if( area == 'E' ){
		chave = 'pipedrive_eng';
	}
	
	var token = "";
	var constraints = new Array();		
	constraints.push( DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("chave", chave, chave, ConstraintType.MUST) );
	var usuario = DatasetFactory.getDataset("colleagueParam", null, constraints, null);
	var path = ''; 
	if ( usuario.values.length > 0 ) {
		token = usuario.getValue(0, "val_param");
		log.info( 'ENTREI..... ' );
	}

	log.info('Leitura Parametros......' );
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST) );
	var pipe = DatasetFactory.getDataset("pipedrive", null, constraints, null);
	if( pipe.rowsCount == 0 ){
		throw "Não cadastrato parametro para esse tipo de integração.";
	}else{
		if( token == "" ){
			token = pipe.getValue(0,"token_api");
		}
	}
	
	if( listaConstraits['phone'] != "" ){
		log.info(' FONE '+ listaConstraits['phone'] );
		listaConstraits['phone'] = "+55"+listaConstraits['phone'].replace('(','').replace(')','').replace(' ','').replace('-','');
		//var endpoint = "/v1/persons/find?term=%2B"+listaConstraits['phone']+"&search_by_fone=1&api_token="+token;
			
		var endpoint = encodeURI( "/v1/persons/search?term="+listaConstraits['phone']+"&fields=phone&start=0&api_token="+token );
		
		//https://api.pipedrive.com/v1/persons/search?term=5225&fields=phone&start=0&api_token=65502f0743f6f2f6bf4f730aadff15734f0a47c1
		
		//https://api.pipedrive.com/v1/persons/search?term=joao&fields=name&start=0&api_token=65502f0743f6f2f6bf4f730aadff15734f0a47c1
		
		
		try{
			var clientService = fluigAPI.getAuthorizeClientService();
			var data = {
				companyId : getValue("WKCompany") + "",
				serviceCode : "pipedrive",
				endpoint : endpoint,
				timeoutService : "240",
				method : "get"
			};
			printLog( 'info', "## DADOS CABECALHO ##");
				
			var headers = {};
			headers["Content-Type"] = "application/json;charset=UTF-8";
			headers["Accept"] = "application/json";
			data["headers"] = headers;
			
			printLog( 'info', "## antes do stringify ## " + data.toString());
			var jj = JSON.stringify(data);
		
			printLog( 'info', "## RESULT POST jj ## " + jj);
				
			var vo = clientService.invoke(jj);
			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno esta vazio";
			} else {
				var jr = JSON.parse(vo.getResult());
				printLog( 'info', "## success ## " + jr);
				printLog( 'info', "## success ## " + jr.success);
				
				if( !jr.success ){
					throw 'Erro na integração com PipeDrive';
				} 
				
				if( jr.data != null ){
					
					for( var i = 0; i < jr.data.items.length; i++ ){
						temReg = true;
						
						printLog( 'info', "## ID.......... ## " + jr.data.items[i].item.id);	
						printLog( 'info', "## Organization ## " + jr.data.items[i].item.organization);
						
						if( listaIDs.indexOf( jr.data.items[i].item.id ) == -1 ){
							listaIDs.push(jr.data.items[i].item.id);
							if( jr.data.items[i].item.organization == null ){
								
								jr.data.items[i].item.organization = {}
								jr.data.items[i].item.organization['name'] = "";
							    jr.data.items[i].item.organization['id'] = "";
							}
							   			
							var status = {};
							status["statusADVI"] = "";
							status["statusADVA"] = "";
							status["statusOUTER"] = "";
							if( listaConstraits['status_pipeline'] == "S" ){
								status = statusDeal( jr.data.items[i].item.name, jr.data.items[i].item.id, token );
							}
							
							newDataset.addRow( 
										new Array( jr.data.items[i].item.id+"",
												   jr.data.items[i].item.name+"",
												   jr.data.items[i].item.emails[0]+"",
												   jr.data.items[i].item.organization.name+"",
												   jr.data.items[i].item.organization.id+"",
												   jr.data.items[i].item.phones[0]+"",
												   status["statusADVI"],
												   status["statusADVA"],
												   status["statusOUTER"]
												   
												) );
						}
					}
				}
			}
			
		} catch(erro) { 
			printLog( 'erro', "ERROOOOOO" + erro.toString() );
			throw erro.toString();
		}
	}
	
	if( listaConstraits['name'] != "" ){
		log.info(' NAME '+ listaConstraits['name'] );
			
		var endpoint = encodeURI( "/v1/persons/search?term="+listaConstraits['name']+"&fields=name&start=0&api_token="+token );
		
		try{
			var clientService = fluigAPI.getAuthorizeClientService();
			var data = {
				companyId : getValue("WKCompany") + "",
				serviceCode : "pipedrive",
				endpoint : endpoint,
				timeoutService : "240",
				method : "get"
			};
			printLog( 'info', "## DADOS CABECALHO ##");
				
			var headers = {};
			headers["Content-Type"] = "application/json;charset=UTF-8";
			headers["Accept"] = "application/json";
			data["headers"] = headers;
			
			printLog( 'info', "## antes do stringify ## " + data.toString());
			var jj = JSON.stringify(data);
		
			printLog( 'info', "## RESULT POST jj ## " + jj);
				
			var vo = clientService.invoke(jj);
			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno esta vazio";
			} else {
				var jr = JSON.parse(vo.getResult());
				printLog( 'info', "## success ## " + jr);
				printLog( 'info', "## success ## " + jr.success);
				
				if( !jr.success ){
					throw 'Erro na integração com PipeDrive';
				} 
				
				/*if( jr.data != null ){
					printLog( 'info', "## data ## " + jr.data[0].id);
					for( var i = 0; i < jr.data.length; i++ ){
						temReg = true;
						newDataset.addRow( 
									new Array( jr.data[i].id+"",
											   jr.data[i].name+"",
											   jr.data[i].email+"",
											   jr.data[i].org_name+"",
											   jr.data[i].org_id+"",
											   jr.data[i].phone+""
											) );
					}
				}*/
				if( jr.data != null ){
					
					for( var i = 0; i < jr.data.items.length; i++ ){
						temReg = true;
						
						printLog( 'info', "## ID.......... ## " + jr.data.items[i].item.id);	
						printLog( 'info', "## Organization ## " + jr.data.items[i].item.organization);
						
						if( listaIDs.indexOf( jr.data.items[i].item.id ) == -1 ){
							listaIDs.push(jr.data.items[i].item.id);
							
							if( jr.data.items[i].item.organization == null ){
								
								jr.data.items[i].item.organization = {}
								jr.data.items[i].item.organization['name'] = "";
							    jr.data.items[i].item.organization['id'] = "";
							}
							
							var status = {};
							status["statusADVI"] = "";
							status["statusADVA"] = "";
							status["statusOUTER"] = "";
							if( listaConstraits['status_pipeline'] == "S" ){
								status = statusDeal( jr.data.items[i].item.name, jr.data.items[i].item.id, token );
							}
							
							newDataset.addRow( 
										new Array( jr.data.items[i].item.id+"",
												   jr.data.items[i].item.name+"",
												   jr.data.items[i].item.emails[0]+"",
												   jr.data.items[i].item.organization.name+"",
												   jr.data.items[i].item.organization.id+"",
												   jr.data.items[i].item.phones[0]+"",
												   status["statusADVI"],
												   status["statusADVA"],
												   status["statusOUTER"]
												) );
						}
					}
				}
			}
			
		} catch(erro) { 
			printLog( 'erro', "ERROOOOOO" + erro.toString() );
			throw erro.toString();
		}
	}
	
	
	return newDataset;
	
	
}
function onMobileSync(user) {

}


var debug = true;

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

function statusDeal( name, id, token ){
	
	printLog( 'info', "## STATUS DEAL ##");
	
	var endpoint = encodeURI( "/v1/deals/search?term=="+name+"&person_id="+id+"&api_token="+token );	
	try{
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId : getValue("WKCompany") + "",
			serviceCode : "pipedrive",
			endpoint : endpoint,
			timeoutService : "240",
			method : "get"
		};
		printLog( 'info', "## DADOS CABECALHO ##");
			
		var headers = {};
		headers["Content-Type"] = "application/json;charset=UTF-8";
		headers["Accept"] = "application/json";
		data["headers"] = headers;
		
		printLog( 'info', "## antes do stringify ## " + data.toString());
		var jj = JSON.stringify(data);
	
		printLog( 'info', "## RESULT POST jj ## " + jj);
			
		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			//throw "Retorno esta vazio";
			return "";
		} else {
			var jr = JSON.parse(vo.getResult());
			printLog( 'info', "## success ## " + jr);
			printLog( 'info', "## success ## " + jr.success);
			
			if( !jr.success ){
				//throw 'Erro na integração com PipeDrive';
				return "";
			} 
			
			if( jr.data != null ){
				
				var status = {};
				status["statusADVI"] = "";
				status["statusADVA"] = "";
				status["statusOUTER"] = "";
				
				statusRetorno = "";
				for( var i = 0; i < jr.data.items.length; i++ ){
					
					var funil = pipeLineDeal( jr.data.items[i].item.id, token );
					
					printLog( 'info', "## funil teste............... ## " + jr.data.items[i].item.id + " - " + funil);
					
					 
					if( funil == "1" ){ //advi
						if( status["statusADVI"] != "open" ){
							status["statusADVI"] = jr.data.items[i].item.status;
						}
					}else if( funil == "7" ){ //advi
						if( status["statusADVA"] != "open" ){
							status["statusADVA"] = jr.data.items[i].item.status;
						}
					}else{
						if( status["statusOUTER"] != "open" ){
							status["statusOUTER"] = jr.data.items[i].item.status;
						}
					}
				}
				return status;
			}
		}
		
	} catch(erro) { 
		printLog( 'erro', "ERROOOOOO" + erro.toString() );
		return "";
		//throw erro.toString();
	}

}


function pipeLineDeal( id, token ){
	
	printLog( 'info', "## PIPELINE ##");
	
	var endpoint = encodeURI( "/v1/deals/"+ id +"?api_token="+token );
	try{
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId : getValue("WKCompany") + "",
			serviceCode : "pipedrive",
			endpoint : endpoint,
			timeoutService : "240",
			method : "get"
		};
		printLog( 'info', "## DADOS CABECALHO ##");
			
		var headers = {};
		headers["Content-Type"] = "application/json;charset=UTF-8";
		headers["Accept"] = "application/json";
		data["headers"] = headers;
		
		printLog( 'info', "## antes do stringify ## " + data.toString());
		var jj = JSON.stringify(data);
	
		printLog( 'info', "## RESULT POST jj ## " + jj);
			
		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			//throw "Retorno esta vazio";
			return "";
		} else {
			var jr = JSON.parse(vo.getResult());
			printLog( 'info', "## success ## " + jr);
			printLog( 'info', "## success ## " + jr.success);
			
			if( !jr.success ){
				//throw 'Erro na integração com PipeDrive';	
				return "";
			} 
			
			if( jr.data != null ){
				return jr.data.pipeline_id;
			}
		}
		
	} catch(erro) { 
		printLog( 'erro', "ERROOOOOO" + erro.toString() );
		return "";
		//throw erro.toString();
	}

}

