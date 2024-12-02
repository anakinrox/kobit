var gCodNumRemetente = null;
var gCodNumDestinatario = null;
var gCodNomDestinatario = null;
var gIntervalID;

if ($this == undefined) {
  var $this = this;
}

function f_zenvia_visualizarConversa(pNumRemetente, pNumDestinatario, pNomDestinatario, pPlaceHolder) {

  gCodNumRemetente = pNumRemetente;
  gCodNumDestinatario = pNumDestinatario;
  gCodNomDestinatario = pNomDestinatario;

  var wCodigo = "";
  var descricao = "";

  var htmlM = '<div class="row"> ' +
    '   <div class="col-md-12" align="center"> ' +

    '     <div class="panel panel-info"> ' +
    '       <div class="panel-heading">Conversando com ' + pNomDestinatario + '</div> ' +
    '       <div class="panel-body" st> ' +
    '         <div id="CorpoMensagem" class="scrollable"> ' +

    '         </div"> ' +
    '       </div> ' +
    '       <div class="panel-footer"> ' +
    '         <div class="row">' +
    '           <div class="col-md-3">' +
    '             <select name="cod_mensagem_' + $this.instanceId + '" id="cod_mensagem_' + $this.instanceId + '" class="form-control" style="width:200px;" dataset="kbt_t_whatsmensagem" datasetkey="codigo" datasetvalue="titulo"><option value="-1" selected>Mensagens</option></select> ' +
    '           </div> ' +
    '           <div class="col-md-7">' +
    '             <input type="text" class="form-control valida" name="mensagem_' + $this.instanceId + '" id="mensagem_' + $this.instanceId + '" valida="field" " placeholder="' + pPlaceHolder + '"/> ' +
    '           </div> ' +
    '           <div class="col-md-2">' +
    '             <button type="button" class="btn btn-success btn-block" title="Enviar Mensagem" onclick="f_zenvia_enviarMensagem(\'' + pNumRemetente + '\',\'' + pNumDestinatario + '\',\'' + pNomDestinatario + '\');"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Enviar</button>' +
    '           </div> ' +
    '         </div> ' +
    '       </div > ' +
    '     </div>     ' +
    '   </div> ' +
    '</div>';


  md_ZenvaWhats = FLUIGC.modal({
    // title: 'Conversando com ' + pNomDestinatario,
    title: '',
    content: htmlM,
    id: 'fluig-ZenvaWhats',
    size: 'large',
    actions: [],
    actionClose: {
      label: "",
      bind: 'data-close-message-page'
    }

  }, function (err, data) {
    if (err) {
      // do error handling
    } else {

    }
  });

  $('#fluig-ZenvaWhats').ready(function () {

    f_zenvia_loadMensagemPadrao();
    f_zenvia_loadMensagens(pNumRemetente, pNumDestinatario);

    gIntervalID = setInterval(f_zenvia_validaNovaMensagem, 10000, pNumRemetente, pNumDestinatario);

  });

  $('#fluig-ZenvaWhats').on('click', '[data-close-message-page]', function (ev) {
    // alert('Fechando aqui');
    f_zenvia_cancelaAtualizacao();
    md_ZenvaWhats.remove();
  });
}


function f_zenvia_loadMensagemPadrao() {
  var constraints = new Array();
  DatasetFactory.getDataset("kbt_t_whatsmensagem", null, constraints, null, {
    success: (data) => {
      if (data.hasOwnProperty("values") && data.values.length > 0) {
        var regs = new Array();
        for (var i = 0; i < data.values.length; i++) {
          $("#cod_mensagem_" + $this.instanceId).append('<option value=' + data.values[i]["codigo"] + '>' + data.values[i]["titulo"] + '</option>');
        }
      }
      // loadWindow.hide();
    },
    error: (err) => {
      // loadWindow.hide();
    },
  });
}

function f_zenvia_loadMensagens(pNumRemetente, pNumDestinatario) {
  $("#CorpoMensagem").html("");
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('indacao', 'LER', 'LER', ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('numremetente', pNumRemetente, pNumRemetente, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('numdestinatario', pNumDestinatario, pNumDestinatario, ConstraintType.MUST));
  DatasetFactory.getDataset("dsk_whats", null, constraints, null, {
    success: (data) => {
      if (data.hasOwnProperty("values") && data.values.length > 0) {
        var regs = new Array();
        for (var i = 0; i < data.values.length; i++) {
          var wlinkAnexo = (data.values[i]["documento"] != '0' && data.values[i]["documento"] != 'null' ? ' - <a href="/portal/p/99/ecmnavigation?app_ecm_navigation_doc=' + data.values[i]["documento"] + '" target="_blank">Anexo</a>' : '');
          // /portal/p/99/ecmnavigation?app_ecm_navigation_doc=
          var mensagem = data.values[i]["texto"] + wlinkAnexo;

          var wDivMensagem = '<div class="mensagem msg_' + (data.values[i]["direcao"] == 'IN' ? 'in' : 'out') + '"> ';
          // wDivMensagem += ' <p>' + data.values[i]["texto"] + ' ' + wlinkAnexo + ' <br> <span> ' + data.values[i]["data"] + ' - ' + data.values[i]["hora"] + '</span></p> ';
          wDivMensagem += ' <p>' + mensagem + ' <br> <span> ' + data.values[i]["data"] + ' - ' + data.values[i]["hora"] + '</span> </p> ';
          wDivMensagem += '</div> ';

          $("#CorpoMensagem").append(wDivMensagem);
        }

        $('#CorpoMensagem').animate({ scrollTop: $('#CorpoMensagem')[0].scrollHeight }, 500);
      }
      // loadWindow.hide();
    },
    error: (err) => {
      // loadWindow.hide();
    },
  });
}

function f_zenvia_novaMensagem(pNumRemetente, pNumDestinatario) {
  return new Promise((resolve) => {

    var wRetorno = false;
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'NAOLIDA', 'NAOLIDA', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('numremetente', pNumRemetente, pNumRemetente, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('numdestinatario', pNumDestinatario, pNumDestinatario, ConstraintType.MUST));
    DatasetFactory.getDataset("dsk_whats", null, constraints, null, {
      success: (data) => {
        if (data.hasOwnProperty("values") && data.values.length > 0) {
          var regs = new Array();
          for (var i = 0; i < data.values.length; i++) {
            if (data.values[i]["nova"]) {
              wRetorno = true;
            }
          }
        }
        resolve(wRetorno);
      },
      error: (err) => {
        resolve(wRetorno);
      },
    });
  });
}

function f_zenvia_enviarMensagem(pNumRemetente, pNumDestinatario, pNomDestinatario) {

  var wCodMensagemP = $("#cod_mensagem_" + $this.instanceId).val();
  var wMensagem = $("#mensagem_" + $this.instanceId).val();
  var user_code = WCMAPI.getUserCode();

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('indacao', 'ENVIAR', 'ENVIAR', ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('numremetente', pNumRemetente, pNumRemetente, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('numdestinatario', pNumDestinatario, pNumDestinatario, ConstraintType.MUST));
  if ((pNomDestinatario != '') && (pNomDestinatario != undefined)) {
    constraints.push(DatasetFactory.createConstraint('nomdestinatario', pNomDestinatario, pNomDestinatario, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('codmensagem', wCodMensagemP, wCodMensagemP, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('mensagem', wMensagem, wMensagem, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('userfluig', user_code, user_code, ConstraintType.MUST));
  DatasetFactory.getDataset("dsk_whats", null, constraints, null, {
    success: (data) => {
      if (data.hasOwnProperty("values") && data.values.length > 0) {
        var regs = new Array();
        for (var i = 0; i < data.values.length; i++) {
          if (data.values[i]["status"] == true) {
            f_zenvia_loadMensagens(pNumRemetente, pNumDestinatario);
            $("#cod_mensagem_" + $this.instanceId).val('-1');
            $("#mensagem_" + $this.instanceId).val('')
          }
        }
      }
      // loadWindow.hide();
    },
    error: (err) => {
      // loadWindow.hide();
    },
  });
}

async function f_zenvia_validaNovaMensagem(pNumRemetente, pNumDestinatario) {
  const wRetorno = await f_zenvia_novaMensagem(pNumRemetente, pNumDestinatario);
  if (wRetorno) {
    f_zenvia_loadMensagens(pNumRemetente, pNumDestinatario);
    // console.log('Tem mensagens novas');
  }
}

function f_zenvia_cancelaAtualizacao() {
  clearInterval(gIntervalID);
  // release our intervalID from the variable
  gIntervalID = null;
}
