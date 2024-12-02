var dataTable = null;
var dadosDatatable = [];

var rContent = [];
var rHeader = [];
var circulos = [];



function loadDataTable(pCodTable) {

    rContent = ['solicitacao', 'data', 'nome', 'percMoodle', 'status', 'idmoodle', 'usuarioMoodle', 'ts'];

    rHeader = [
        { 'title': 'Solicitação', 'dataorder': 'solicitacao', 'width': '5%', 'display': true },
        { 'title': 'Data', 'dataorder': 'data', 'width': '5%' },
        { 'title': 'Nome', 'dataorder': 'nome', 'width': '5%' },
        { 'title': '% Conclusão', 'dataorder': 'percMoodle', 'width': '30%' },
        { 'title': 'Situação', 'dataorder': 'status', 'width': '30%' },
        { 'title': 'idmoodle', 'dataorder': 'idmoodle', 'width': '10%', 'display': false },
        { 'title': 'usuarioMoodle', 'dataorder': 'usuarioMoodle', 'width': '10%', 'display': false },
        { 'title': '', 'width': '0%' }

    ];

    dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
        dataRequest: dadosDatatable,
        renderContent: rContent,
        scrollY: "200px",
        scrollCollapse: true,
        paging: true,
        limit: 30,
        offset: 0,
        patternKey: 'text',
        limitkey: 'per_page',
        offsetKey: 'page',
        // responsive: true,
        tableStyle: 'table table-striped table-responsive table-bordered table-condensed',
        emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
        header: rHeader,
        search: {
            enabled: false,
            onSearch: function (res) {
                // console.log( res );
                var data = dadosDatatable;
                var search = data.filter(function (el) {
                    return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                        el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                        el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 ||
                        el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0)
                });
                dataTable.reload(search);
            },
            onlyEnterkey: false,
            searchAreaStyle: 'col-md-3'
        },
        scroll: {
            target: '#idtable_' + $this.instanceId,
            enabled: false
        },
        navButtons: {
            enabled: false,
        },
        draggable: {
            enabled: false
        },

    }, function (err, data) {
        if (err) {
            FLUIGC.toast({
                message: err,
                type: 'danger'
            });
        } else {
            loadWindow.hide();
        }
    });


}

function loadDadosDataTable() {
    loadWindow.show();


    var tbl_multa = getTable('ds_solicitacao_usuario', '');
    var SQL = "";
    SQL += "select ";
    SQL += "    sc.solicitacao, ";
    SQL += "    sc.createdAt as data, ";
    SQL += "    sc.nome, ";
    SQL += "    sc.sobrenome, ";
    SQL += "    sc.idmoodle as id_usuario, ";
    SQL += "    sc.percentualMoodle as concluido, ";
    SQL += "    sc.usuarioMoodle as nome_usuario, ";
    SQL += "    sc.status "
    SQL += "FROM " + tbl_multa + " sc  ";
    SQL += "join documento dc on (dc.cod_empresa = sc.companyid      ";
    SQL += "        and dc.nr_documento = sc.documentid      ";
    SQL += "        and dc.nr_versao = sc.version ";
    SQL += "        and dc.versao_ativa = 1) ";
    SQL += "where 1=1 ";
    SQL += "    and (sc.idMoodle is not null and sc.idMoodle <> '')";

    if (($('#dt_ini_' + $this.instanceId).val() != "") && ($('#dt_ini_' + $this.instanceId).val()) != "") {
        var wDataIni = new Date($('#dt_ini_' + $this.instanceId).val());
        var wDataFim = new Date($('#dt_fim_' + $this.instanceId).val());
        SQL += "  and sc.createdAt between " + wDataIni.getTime() + " and " + wDataFim.getTime();
    }

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('SQL', SQL, null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('database', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
    var userMoodle = DatasetFactory.getDataset("select", null, constraints, null);


    if (userMoodle.rowsCount == 0) {
        throw "Não cadastrato parametro para esse tipo de integração.";
    } else {
        // alert(userMoodle.values.length);
        // alert(JSON.stringify(userMoodle.values));

        if (userMoodle != null && userMoodle != undefined) {
            var regs = new Array();
            for (var i = 0; i < userMoodle.values.length; i++) {

                var strIcone = "";
                var strProgresso = "";
                var perc_concluido = 0;


                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('indacao', 'FINDCOURSE', 'FINDCOURSE', ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('idUser', userMoodle.values[i].id_usuario, userMoodle.values[i].id_usuario, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint('idCurso', '30', '30', ConstraintType.MUST));
                var moodle = DatasetFactory.getDataset("dsk_moodle", null, constraints, null);

                // console.log("Num Registros: " + moodle.rowsCount);
                // console.log("Registros: " + JSON.stringify(moodle.values));

                if (moodle.rowsCount == 0) {
                } else {
                    for (var x = 0; x < moodle.values.length; x++) {
                        // userMoodle.values[i]["status"]
                        perc_concluido = moodle.values[x]["perc_concluido"]
                    }
                }

                strProgresso += "<div class='progress'>";
                strProgresso += "    <div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow=" + perc_concluido + "' aria-valuemin='0' aria-valuemax='100' style='width: " + perc_concluido + "%;'>";
                strProgresso += "        " + perc_concluido + "%";
                strProgresso += "    </div>";
                strProgresso += "</div>";

                var wmilis = userMoodle.values[i].data;
                var wdata = new Date(Number(wmilis));

                var datatableRow = {
                    solicitacao: parseInt(userMoodle.values[i].solicitacao, 10),
                    data: f_formatData(wdata, 'D', 'N'),
                    nome: userMoodle.values[i].nome + ' ' + userMoodle.values[i].sobrenome,
                    percMoodle: strProgresso,
                    status: userMoodle.values[i].status,
                    idmoodle: userMoodle.values[i].id_usuario,
                    usuarioMoodle: userMoodle.values[i].nome_usuario,
                    ts: strIcone
                }
                regs.push(datatableRow);
            }
            dataTable.reload(regs);
        }
    }


    loadWindow.hide();

}


function f_formatData(data, indAcao, inc) {

    if (indAcao == 'D') {
        var dtRegistro = new Date(data),
            dia = (inc == 'S') ? (dtRegistro.getDate() + 1) : (dtRegistro.getDate()),
            diaF = (dia.toString().length == 1) ? '0' + dia : dia,
            mes = (dtRegistro.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.toString().length == 1) ? '0' + mes : mes,
            anoF = dtRegistro.getFullYear();
        var datFormatado = diaF + "/" + mesF + "/" + anoF;
    }

    if (indAcao == 'H') {
        var dtRegistro = new Date(data),
            h = dtRegistro.getHours(),
            m = dtRegistro.getMinutes(),
            s = dtRegistro.getSeconds();
        var datFormatado = h + ":" + m;
    }

    if (indAcao == 'R') {
        var dtRegistro = new Date(data),
            dia = (dtRegistro.getDate() + 1),
            diaF = (dia.toString().length == 1) ? '0' + dia : dia,
            mes = (dtRegistro.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.toString().length == 1) ? '0' + mes : mes,
            anoF = dtRegistro.getFullYear();
        var datFormatado = anoF + "-" + mesF + "-" + diaF;
    }

    return datFormatado;
}