var debug = false;

function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    var documentId = 955774;


    var responseVO = fluigAPI.getCardAPIService().findChildrenByCardId(documentId, null, null, ['placas']);
    log.info('#### RESPONSEVO ##### ');
    log.dir(responseVO);

    var cardFieldVOs = new java.util.ArrayList();
    var placa = new com.fluig.sdk.api.cardindex.CardFieldVO;

    placa.setFieldId("placas");
    placa.setValue("SEG5H26");
    // Adiciona os campos na lista
    cardFieldVOs.add(placa);
    try {
        //		var cardId = fluigAPI.getCardAPIService().edit(documentId, cardFieldVOs);
        var cardId = fluigAPI.getCardAPIService().createChild(parseInt(documentId), cardFieldVOs);
        log.info('#### CARDID ####');
        log.dir(cardId);
    } catch (e) {
        log.info('#### ERRROOO ####');
        log.dir(e.toString());
        throw e.toString();
    }
    //    try {
    //        var newDataset = DatasetBuilder.newDataset();
    //        newDataset.addColumn('teste');
    //        
    //        var documentId = 965242;        
    //        
    //        var placa = "SDS 0H62";
    //        
    //        var rowId = findRowId(documentId, placa);
    //        
    //        log.info( '### dsk teste ###' );
    //        log.info( rowId );

    //    	try {
    //    		var cardId = fluigAPI.getCardAPIService().removeChild(documentId, parseInt( rowId ));
    //    		log.info( '### dsk teste ###2' );
    //    		log.info( cardId );
    //    		log.dir( cardId );
    //    	} catch (e) {
    //    		throw e.toString();
    //    	}


    //    } catch (error) {
    //        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    //    } finally {
    //        return newDataset;
    //    }
}

function findRowId(documentId, placa) {

    var responseVO = fluigAPI.getCardAPIService().findChildrenByCardId(documentId, null, null, ['placas']);

    var rowId = parseInt(responseVO.total) + 1;

    var itemsList = responseVO.items.toArray();

    itemsList.forEach(function (item) {

        var valuesList = item.values.toArray();
        var rowSeq = 0;

        valuesList.forEach(function (row) {

            if (row.getFieldId() == 'rowId') {
                rowSeq = row.getValue();
            }

            if (row.getFieldId().indexOf('placas___') != -1 && row.getValue() == placa) {
                rowId = rowSeq;
            }

        });
    });

    return rowId;
}

function onMobileSync(user) {

}

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

function getTable(dataSet, table) {
    var ct = new Array();
    ct.push(DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST));
    if (table != ""
        && table != null
        && table != undefined) {
        ct.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
    }
    var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);

    if (table != ""
        && table != null
        && table != undefined) {
        return ds.getValue(0, "tableFilha");
    } else {
        return ds.getValue(0, "table");
    }
}