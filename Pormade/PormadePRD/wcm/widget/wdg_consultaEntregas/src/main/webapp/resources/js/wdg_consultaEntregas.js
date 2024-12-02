var $this = null;
var loadWindow = null;

var MyWidget = SuperWidget.extend({
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function () {
        $this = this;

        if (!this.isEditMode) {

            //Carrega Título da página
            $('#page_title').html(WCMAPI.getPageTitle());

            // Usuario Logado.
            user_code = WCMAPI.getUserCode();
            //Load do fluig
            loadWindow = FLUIGC.loading(window);

            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'left', html: true, content: 'Versão: 11/11/2021 09:38<br>Técnico: Marcio Silva' });

            // setMask();
            loadDataTable('manifesto');
        }
    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-entregas': ['click_entregas'],
            'load-checklist': ['click_checklist'],
            'order-by': ['click_orderBy'],

        },
        global: {
            'load-logviagem': ['click_logViagem'],
            'load-mapaLog': ['click_mapaLog'],
            'load-fotoLog': ['click_fotoLog'],

        }
    },

    filtrar: function (htmlElement, event) {
        loadDadosDataTable('manifesto');
    },

    orderBy: function (htmlElement, event) {
        var order = htmlElement.getAttribute('data-order-by');

        dados = dataTable.getData();

        if (htmlElement.children[1].classList.contains("dropup")) {
            this.orderAscDesc = "ASC";
        } else {
            this.orderAscDesc = "DESC";
        }

        if (htmlElement.children[1].classList.contains("dropup")) {
            //this.orderAscDesc = "ASC";
            dados.sort(function (a, b) {
                var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });
        } else {
            //this.orderAscDesc = "DESC";
            dados.sort(function (a, b) {
                var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                if (a1 == b1) return 0;
                return a1 < b1 ? 1 : -1;
            });
        }

        dataTable.reload(dados);
    },

    entregas: function () {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        var htmlM = '<div class="row"> ' +
            '	<div class="col-md-12"> ' +
            '		<div id="idtableEntregas_' + $this.instanceId + '"></div> ' +
            '	</div> ' +
            '</div>';

        var md_entregas = FLUIGC.modal({
            title: 'Entregas',
            content: htmlM,
            id: 'fluig-modalEntregas',
            size: 'large',
            actions: []
        }, function (err, data) {
            if (err) {
                // do error handling
            } else {
                // do something with data

                loadDataTable('entregas');
                loadDadosDataTable('entregas', selected.num_manifesto);
            }
        });

    },
    checklist: function () {
        var index = dataTable.selectedRows()[0];
        var selected = dataTable.getRow(index);

        var htmlM = '<div class="row"> ' +
            '	<div class="col-md-12"> ' +
            '       <div class="row"> ' +
            '	        <div class="col-md-3"> ' +
            '               <label class="control-label" for="datRegistro_' + $this.instanceId + '">Data Registro</label>' +
            '               <input name="datRegistro_' + $this.instanceId + '" id="datRegistro_' + $this.instanceId + '" type="text" class="form-control grp_solic" readonly>' +
            '           </div>' +
            '           <div class="col-md-3"> ' +
            '               <label class="control-label" for="horRegistro_' + $this.instanceId + '">Hora Registro</label>' +
            '               <input name="horRegistro_' + $this.instanceId + '" id="horRegistro_' + $this.instanceId + '" type="text" class="form-control grp_solic" readonly>' +
            '           </div> ' +
            '	        <div class="col-md-6"> ' +
            '               <label class="control-label" for="obsMotorista_' + $this.instanceId + '">Obs. Motorista</label>' +
            '               <textarea name="obsMotorista_' + $this.instanceId + '" id="obsMotorista_' + $this.instanceId + '" class="form-control valida" rows="3" readonly></textarea>' +
            '           </div>' +
            '       </div> ' +
            '       <div class="row"> ' +
            '	        <div class="col-md-6"> ' +
            '               Os Freios estão OK? <strong><span id="indFreio_' + $this.instanceId + '" class="text-success">  </span></strong>' +
            '           </div>' +
            '       </div> ' +
            '       <div class="row"> ' +
            '	        <div class="col-md-6"> ' +
            '               Os pneus estão OK? <strong><span id="indPneus_' + $this.instanceId + '" class="text-success">  </span></strong>' +
            '           </div>' +
            '       </div> ' +
            '       <div class="row"> ' +
            '	        <div class="col-md-6"> ' +
            '               Você está Apto pra viagem? <strong><span id="indMotorista_' + $this.instanceId + '" class="text-success">  </span></strong>' +
            '           </div>' +
            '       </div> ' +
            '       <div class="row"> ' +

            '       </div> ' +
            '       <div class="row"> ' +
            '	        <div class="col-md-12"> ' +
            '           &nbsp; ' +
            '           </div> ' +
            '       </div> ' +
            '		<div id="idmap_' + $this.instanceId + '" style="width:100%;height:300px;"></div> ' +
            '	</div> ' +
            '</div>';


        var md_checklist = FLUIGC.modal({
            title: 'Check list',
            content: htmlM,
            id: 'fluig-modalCheckList',
            size: 'large',
            actions: []
        }, function (err, data) {
            if (err) {
                // do error handling
            } else {
                // do something with data
                var objCheck = loadDadosDataTable('checklist', selected.num_manifesto);

                if (objCheck.length > 0) {

                    $('#datRegistro_' + $this.instanceId).val(objCheck[0].datRegistro);
                    $('#horRegistro_' + $this.instanceId).val(objCheck[0].horRegistro);

                    if (objCheck[0].indFreios == 'S') {
                        $('#indFreio_' + $this.instanceId).html('Sim');
                        $('#indFreio_' + $this.instanceId).removeClass("text-danger").addClass("text-success");
                    } else {
                        $('#indFreio_' + $this.instanceId).html('Não');
                        $('#indFreio_' + $this.instanceId).removeClass("text-success").addClass("text-danger");
                    }

                    if (objCheck[0].indPneus == 'S') {
                        $('#indPneus_' + $this.instanceId).html('Sim');
                        $('#indPneus_' + $this.instanceId).removeClass("text-danger").addClass("text-success");
                    } else {
                        $('#indPneus_' + $this.instanceId).html('Não');
                        $('#indPneus_' + $this.instanceId).removeClass("text-success").addClass("text-danger");
                    }

                    if (objCheck[0].indMotorista == 'S') {
                        $('#indMotorista_' + $this.instanceId).html('Sim');
                        $('#indMotorista_' + $this.instanceId).removeClass("text-danger").addClass("text-success");
                    } else {
                        $('#indMotorista_' + $this.instanceId).html('Não');
                        $('#indMotorista_' + $this.instanceId).removeClass("text-success").addClass("text-danger");
                    }

                    $('#obsMotorista_' + $this.instanceId).val(objCheck[0].obsMotorista);

                    loadMap("idmap_" + $this.instanceId, objCheck[0].latitudade, objCheck[0].longitude);
                }
            }
        });

    },
    logViagem: function () {
        var index = dataTable.selectedRows()[0];
        var dtPai = dataTable.getRow(index);

        var index = dataTableEntrega.selectedRows()[0];
        var dtEntrega = dataTableEntrega.getRow(index);

        var htmlM = '<div class="row"> ' +
            '	<div class="col-md-12"> ' +
            '		<div id="idtableLogViagem_' + $this.instanceId + '"></div> ' +
            '		<div id="idmapLog_' + $this.instanceId + '" style="width:100%;height:300px;display:none;"></div> ' +
            '       <div class="progress" id="pgrLoad_' + $this.instanceId + '" style="display:none;"> ' +
            '           <div class="progress-bar-gif" role="progressbar" style="width: 100%;"></div> ' +
            '       </div>             ' +
            '       <div class="row clearfix" id="idThumbnail_' + $this.instanceId + '"> ' +
            '       </div> ' +
            '	</div> ' +
            '</div>';

        var md_logViagem = FLUIGC.modal({
            title: 'Registros da Viagem',
            content: htmlM,
            id: 'fluig-modalLogViagem',
            size: 'large',
            actions: []
        }, function (err, data) {
            if (err) {

            } else {
                loadDataTable('logviagem');
                loadDadosDataTable('logviagem', dtPai.num_manifesto, dtEntrega.numEntrega);
            }
        });

    },
    mapaLog: function () {
        var index = dataTableViagem.selectedRows()[0];
        var dtViagem = dataTableViagem.getRow(index);
        $('#idThumbnail_' + $this.instanceId).hide();
        loadMap("idmapLog_" + $this.instanceId, dtViagem.latitude, dtViagem.longitude);
    },

    fotoLog: function () {

        $('#pgrLoad_' + $this.instanceId).show();

        var index = dataTable.selectedRows()[0];
        var dtPai = dataTable.getRow(index);

        var index = dataTableEntrega.selectedRows()[0];
        var dtEntrega = dataTableEntrega.getRow(index);

        var index = dataTableViagem.selectedRows()[0];
        var dtViagem = dataTableViagem.getRow(index);

        var objFotos = loadDadosDataTable('logfotos', dtPai.num_manifesto, dtEntrega.numEntrega, dtViagem.codParada);
        if (objFotos.length > 0) {
            var html = "";

            for (var i = 0; i < objFotos.length; i++) {

                html += '           <div class="col-sm-6 col-md-4"> ' +
                    '               <div class="thumbnail"> ' +
                    '                   <img src="' + montaFoto(objFotos[i].foto64) + '" alt="..."> ' +
                    '                    <div class="caption"> ' +
                    '                        <h3>' + objFotos[i].nomFoto + '</h3> ' +
                    '                   </div> ' +
                    '                </div> ' +
                    '            </div> ';
            }

            if (html != "") {
                $('#idmapLog_' + $this.instanceId).hide();
                $('#idThumbnail_' + $this.instanceId).show();
                $('#idThumbnail_' + $this.instanceId).html(html);
            }
        }
        $('#pgrLoad_' + $this.instanceId).hide();
    },
    executeAction: function (htmlElement, event) {
    }

});

function loadMap(idDivMap, pLatitude, pLongitude) {

    if (markers.length > 0) {
        info_Window = new google.maps.InfoWindow();
        info_Window.close();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    }
    var objMapa = document.getElementById(idDivMap);
    objMapa.style.display = "";

    map = new google.maps.Map(objMapa, {
        center: new google.maps.LatLng(parseFloat(pLatitude), parseFloat(pLongitude)),
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(parseFloat(pLatitude), parseFloat(pLongitude)),
        title: 'CheckList'
    });

    var html = '<div class="test">Local do CheckList</div>';
    info_Window = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", function () {
        info_Window.setContent(html);
        info_Window.open(map, marker);
    });

    markers.push(marker);
}

function montaFoto(base64String) {
    var image = new Image();
    image.src = 'data:image/jpg;base64,' + base64String;
    return image.src;
}


