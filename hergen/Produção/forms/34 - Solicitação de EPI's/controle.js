function loadBody() {
	handleTerceiro();
}


function handleTerceiro() {

    $("#terceiro").prop("pointer-event", 'none');
    $("#terceiro").prop("touch-action", 'none');

    if ( $("#terceiro").val() == "S") {
        $("#matricula").prop("readonly", false);
        $("#cracha").prop("readonly", false);
        $(".terceiro").show();
    } else if ( $("#terceiro").val() == "N" ) {
        $("#matricula").prop("readonly", true);
        $("#cracha").prop("readonly", true);
        $(".terceiro").hide();
    }
}