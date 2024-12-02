function servicetask16(attempt, message) {
	
    var constraints = new Array();
    var wCodMotorista = hAPI.getCardValue('cod_motorista');
    constraints.push(DatasetFactory.createConstraint('cod_motorista', wCodMotorista, wCodMotorista, ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("cadastro_motorista", null, constraints, null);
    
    if (dataset != null) {    	
    	if (dataset.rowsCount > 0) { 
    		printLog("info","Achou os motorista");
    		var wNumWhatsapp =  dataset.getValue(0, "whatsapp");
    		
    		printLog("info","Nummotorista: " + wNumWhatsapp);
    		
    		if (wNumWhatsapp.substring(0,2) != '55') {
    			wNumWhatsapp = '55' + wNumWhatsapp.replace(/[^0-9,]*/g, '').replace(',', '.');
    		}
    		printLog("info","Nummotorista Alterado: " + wNumWhatsapp);
    		
    		var wNomMotorista =  dataset.getValue(0, "nome_motorista");
    		var wPlacaVeiculo =  hAPI.getCardValue('placa');
    		
    		if (wNumWhatsapp != null && wNumWhatsapp != '') {
    			var constraints = new Array();
    			constraints.push(DatasetFactory.createConstraint('endpoint', 'mensagem', 'mensagem', ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint('codMensagem', '3', "3", ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint('num_destinatario', wNumWhatsapp, wNumWhatsapp, ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint('nome_motorista', wNomMotorista, wNomMotorista, ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint('numero_placa', wPlacaVeiculo, wPlacaVeiculo, ConstraintType.MUST));
    			var fortics = DatasetFactory.getDataset("dsk_fortics", null, constraints, null);

    			if (fortics.rowsCount == 0) {
    				printLog("error","Erro ao enviar a mensagem: ");
    				throw "Erro ao enviar mensagem.";
    			} else {
    				if (fortics.values.length > 0) {
    					return true;
    			    }    
    			}    			
    		}    		
    	}
    } else {
    	throw "Erro ao Não cadastrado.";
    }
}


var debug = true;
function printLog(tipo, msg) {

    if (debug) {
        var msgs = getValue("WKDef") + " - " + getValue("WKNumProces") + " - " + msg
        if (tipo == 'info') {
            log.info(msgs);
        } else if (tipo == 'error') {
            log.error(msgs);
        } else if (tipo == 'fatal') {
            log.fatal(msgs);
        } else {
            log.warn(msgs);
        }
    }
}