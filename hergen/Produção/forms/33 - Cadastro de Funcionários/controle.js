function loadBody() {

    handleTerceiro();

}

function handleTerceiro() {
    if ($("#terceiro").val() == "S") {
        $("#matricula").prop("readonly", false);
        $("#cracha").prop("readonly", false);
        $("#nome_funcionario").prop("readonly", false);
        $(".terceiro").show();
    } else if ($("#terceiro").val() == "N") {
        $("#matricula").prop("readonly", true);
        $("#cracha").prop("readonly", true);
        $("#nome_funcionario").prop("readonly", true);
        $(".terceiro").hide();
    }
}