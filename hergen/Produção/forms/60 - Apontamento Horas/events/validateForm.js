function validateForm(form) {
    var activity = getValue('WKNumState');
    log.info("Atividade" + activity)

    var result = "";
    var breakLine = "\n";
    
        if (form.getValue('codAprov') == "") {
            result += '- Preencha o campo <b>Responsável Aprovação</b>! ' + breakLine;
        }
    
}