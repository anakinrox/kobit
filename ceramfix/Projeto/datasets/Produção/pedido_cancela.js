function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var cod_empresa = '10';
	var num_pedido = 123429;
	var motivo = '99';
	var sit_pedido = 'N';
	
	
	log.info( "passo 0001 ");
	
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'cod_empresa' ){
    			cod_empresa = constraints[i].initialValue;
    			log.info('Entrei empresa........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'num_pedido' ){
    			num_pedido = constraints[i].initialValue;
    			log.info('Entrei pedido........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'motivo' ){
    			motivo = constraints[i].initialValue;
    			log.info('Entrei pedido........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'sit_pedido' ){
    			sit_pedido = constraints[i].initialValue;
    			log.info('Entrei pedido........... '+constraints[i].initialValue );
    		}
        }
	}
				
	
	log.info( "passo 0002 ");	
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn( "resultado" );
	dataset.addColumn( "menssagem" );
	dataset.addColumn( "code" );
	
	try{
		
		var urlEndPoint = '';
		
		if( sit_pedido != 'E' && sit_pedido != 'W' ){
			urlEndPoint = '/logixrest/vdpr0006/cancelaPedidoTotal/'+cod_empresa+'/'+num_pedido+'/'+motivo;
		}else{
			urlEndPoint = '/logixrest/vdpr0006/excluiPedidoAnalise/'+cod_empresa+'/'+num_pedido+'/'+motivo;
		}
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
		    	companyId : "1",
		        serviceCode : 'Logix_PRD',
		        endpoint : urlEndPoint,
		        method : 'post' //'post', 'delete', 'patch', 'put', 'get'     
			};
		log.info( "passo 0004 " );
		var vo = clientService.invoke( JSON.stringify( data )  );
		log.info( "passo 0004 F ");
		if(vo.getResult()== null || vo.getResult().isEmpty()){
			log.info( "passo 0004 T ");
			throw "Retorno está vazio";
		}else{
		   	var jr = JSON.parse( vo.getResult() );
		   	log.info( "passo 0004 U "+jr);
		   	if ( jr.messages.length > 0 ){
		   		log.info( "passo 0004 X2 "+jr.messages[0].type+" - "+jr.messages[0].detail+" - "+jr.messages[0].code ); 
		   		dataset.addRow( new Array( jr.messages[0].type, jr.messages[0].detail, jr.messages[0].code ) );
		    	log.info( "passo 0004 X3 ");
		    }else{
		    	log.info( "passo 0004 X4 ");
		    	dataset.addRow( new Array( 	'ERRO', 'Rest não retornou mensagens.' ) );
		    	log.info( "passo 0004 X5 ");
		    }
		}
	}catch( e ){
		dataset.addRow( new Array( 	'ERRO', 'Ocorreu erro não mapeado oa processar DataSet de bloqueio de pedidos. '+e.toString() ) );
	}
	return dataset;
}

function onMobileSync(user) {

}
