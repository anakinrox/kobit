function createDataset(fields, constraints, sortFields) {
    log.info("###ds_sys_buscar_proposta_pdf");
    var dataset = DatasetBuilder.newDataset();
    var orderId = '32421';
    dataset.addColumn("SUCESS");
    dataset.addColumn("MENSAGEM");
    dataset.addColumn("ORDER_ID");
    dataset.addColumn("NOME_ARQUIVO");
    dataset.addColumn("BASE64");


    // log.info("### INICIO TRY -- ds_sys_buscar_proposta_pdf");

    try {
        for (var i in constraints) {
            if (constraints[i]['fieldName'] == "NUM_PROPOSTA") {
                log.info("constraints[i]['fieldName'] " + constraints[i]['fieldName']);
                log.info("constraints[i]['initialValue'] " + constraints[i]['initialValue']);
                log.info("orderId: " + constraints[i]['initialValue']);
                orderId = constraints[i]['initialValue'];
            }
        }
        // log.info("orderId: " + orderId);
        // dataset.addRow(["orderId: " + orderId, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        if (orderId != null && orderId != undefined && orderId != '') {


            var wRretorno = requisicao(orderId)
            if (wRretorno.success == true) {

                // log.info("json[i].success: " + wRretorno.success);
                // log.info("json[i].message: " + wRretorno.message);
                // log.info("json[i].orderId: " + wRretorno.data.orderId);
                // log.info("json[i].fileName: " + wRretorno.data.fileName);
                // log.info("json[i].base64: " + wRretorno.data.base64);

                var SUCESS = (wRretorno.success != null ? wRretorno.success : "") + "";
                var MESSAGE = (wRretorno.message != null ? wRretorno.message : "") + "";
                var ORDER_ID = (wRretorno.data.orderId != null ? wRretorno.data.orderId : "") + "";
                var NOME_ARQUIVO = (wRretorno.data.fileName != null ? wRretorno.data.fileName : "") + "";
                var BASE64 = (wRretorno.data.base64 != null ? wRretorno.data.base64 : "") + "";


                dataset.addRow([SUCESS, MESSAGE, ORDER_ID, NOME_ARQUIVO, BASE64])
            }
        }


    } catch (e) {
        log.info('---ERROR---');
        dataset.addRow([e, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        throw (e);
    }
    log.info("### FIM TRY -- ds_sys_buscar_proposta_pdf");
    return dataset;
}
function requisicao(orderId) {

    var clientService = fluigAPI.getAuthorizeClientService();
    var data = {
        companyId: "1",
        serviceCode: "SYSPROD",
        timeoutService: "240",
        endpoint: "/api.rule?sys=PON&service=imprimirProposta",
        method: "POST"
    };
    var params = {
        imprimirProposta: {
            orderId: parseInt(orderId)
        }
    }

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Token"] = "c72c53905d28d2eaaee0d1d2cd11a287";
    data["headers"] = headers;
    data["params"] = params;
    var gson = new com.google.gson.Gson();
    var datajson = gson.toJson(data);

    var jj = datajson;
    var vo = clientService.invoke(jj);
    log.info("vo.getResult(): " + vo.getResult());

    if (vo.getResult() == "" || vo.getResult().isEmpty()) {
        throw "Retorno esta vazio";
    } else {
        var jr = JSON.parse(vo.getResult());
        return jr;
    }

}