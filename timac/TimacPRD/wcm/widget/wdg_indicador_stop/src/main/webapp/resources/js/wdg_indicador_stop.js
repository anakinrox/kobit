var $this = null;
var myLoading1 = null;
var myLoading2 = null;
var gAno = "";
var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function () {
        $this = this;


        if (this.isEditMode) {
            // código para ser executado quando estiver em modo de edição
        } else {
            myLoading2 = FLUIGC.loading(window);

            //Carrega Título da página
            $('#page_title').html(WCMAPI.getPageTitle());
            var mydate = new Date();
            var year = mydate.getFullYear();
            var daym = mydate.getDate();

            if (daym < 10) {
                daym = "0" + daym;
            }

            var monthm = mydate.getMonth() + 1;
            if (monthm < 10) {
                monthm = "0" + monthm;
            }

            month_anterior = (monthm - 1);
            if (month_anterior < 10) {
                month_anterior = "0" + month_anterior;
            }


            // loadBarChart();
            // loadBarChartAnual();
        }

    },

    //BIND de eventos
    bindings: {
        local: {
            'load-filtrar': ['click_filtrar'],
            'load-imprimir ': ['click_imprimir'],
            'load-excel': ['click_loadExcel'],
            'consulta-processo': ['click_consultaProcesso'],
            'order-by': ['click_orderBy'],
        },
        global: {}
    },

    filtrar: function (htmlElement, event) {

        if ($('#myTab').find('li.active')[0].id == 'li_dashboard') {
            loadBarChart();
            loadBarChartAnual();
        }
    },

});

function loadBarChart() {

    if ($('#mes_ano_' + $this.instanceId).val() != '') {
        var ano = $('#mes_ano_' + $this.instanceId).val().split('-')[0];
        var mes = $('#mes_ano_' + $this.instanceId).val().split('-')[1];
    } else {
        FLUIGC.toast({
            message: 'Para o gráfico "Meta x Realizado" o Filtro de Mês deve ser selecionado.',
            type: 'danger'
        });

        return false;
    }


    myLoading1 = FLUIGC.loading("#grafico1")
    myLoading1.show();

    var tPai = getTable('stop', '');
    var SQL =
        "select " +
        " distinct " +
        "LOGIN," +
        "first_name, " +
        "case" +
        "    when ( select META_" + mes + " from TIM_STOP_METAS tsm where tsm.login = t.login and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S' ) is null" +
        "    then ISNULL(( select META_" + mes + " from TIM_STOP_METAS tsm where tsm.cargo collate database_default = t.cargo collate database_default and tsm.AREA collate database_default = t.area collate database_default and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S'),0)" +
        "    else ISNULL(( select META_" + mes + " from TIM_STOP_METAS tsm where tsm.login = t.login and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S' ),0)" +
        "end as meta," +
        "sum(total) total " +
        "from  " +
        "( " +
        "    select" +
        "            rm.cargo," +
        "            rm.area," +
        "            na.LOGIN ," +
        "        ra.first_name ," +
        "        count(distinct an.NUM_PROCES) as total     " +
        "    from " +
        "      " + tPai + " sc  " +
        "        join documento dc on (dc.cod_empresa = sc.companyid and dc.nr_documento = sc.documentid and dc.nr_versao = sc.version)  " +
        "        join anexo_proces an on (an.COD_EMPRESA = sc.companyid and an.NR_DOCUMENTO = sc.documentid)  " +
        "        join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA and u.NUM_PROCES = an.NUM_PROCES )  " +
        "        join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT )  " +
        "        join fdn_user ra on ( ra.USER_ID = na.USER_ID )" +
        "        join TIM_FLUIG_USUARIOS rm on ( na.login = rm.login COLLATE Latin1_General_CI_AS )" +
        "    where " +
        "        dc.versao_ativa = 1 " +
        "        and u.status <> 1         ";

    if ($('#zona_' + $this.instanceId).val() != '') {
        SQL += " and sc.zona = '" + $('#zona_' + $this.instanceId).val() + "' ";
    }

    if ($('#area_' + $this.instanceId).val() != '') {
        SQL += " and sc.area = '" + $('#area_' + $this.instanceId).val() + "' ";
    }

    if ($('#setor_' + $this.instanceId).val() != '') {
        SQL += " and sc.setor = '" + $('#setor_' + $this.instanceId).val() + "' ";
    }

    if ($('#matricula_' + $this.instanceId).val() != '') {
        SQL += " and u.COD_MATR_REQUISIT = '" + $('#matricula_' + $this.instanceId).val() + "' ";
    }

    if ($('#mes_ano_' + $this.instanceId).val() != '') {
        SQL += " and (YEAR(CAST(u.START_DATE AS DATE)) = '" + ano + "' ";
        SQL += " and MONTH(CAST(u.START_DATE AS DATE)) = '" + mes + "' )";
    }


    SQL += " group by rm.cargo, rm.area, na.LOGIN, ra.first_name, u.START_DATE " +
        "    ) T " +
        " group by  " +
        "     cargo, " +
        "     area, " +
        "     LOGIN, " +
        "     first_name  " +
        " order by " +
        "     first_name ";

    console.log("SQL: " + SQL);

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS', null, ConstraintType.MUST));

    var callback = {
        success: function (dataSet) {

            var array_label = new Array();
            var array_previsto = new Array();
            var array_realizado = new Array();
            for (var i = 0; i < dataSet.values.length; i++) {
                array_label.push(dataSet.values[i]['first_name']);
                array_previsto.push(parseInt(dataSet.values[i]['meta']));
                array_realizado.push(parseInt(dataSet.values[i]['total']));
            }

            var data = {
                labels: array_label,
                datasets: [
                    {
                        label: "Previsto",
                        data: array_previsto
                    },
                    {
                        label: "Realizado",
                        data: array_realizado
                    }
                ]
            };

            var options = {
                legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>;border: 1px solid <%=datasets[i].strokeColor%>;"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>: <%=datasets[i].value%></li><%}%></ul>'
            };

            var width = $("#chart1").width() * 1.07;
            var height = $("#chart1").width() * 100 / 400;

            var barChart1 = FLUIGC.chart('#chart1', {
                id: 'bar_chart',
                width: width,
                height: height,
                /* See the list of options */
            });
            var barChart = barChart1.bar(data, options);
            var legend = barChart.generateLegend();
            document.getElementById('legend_chart1').innerHTML = legend;
            myLoading1.hide();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    };

    dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);
}

function loadBarChartAnual() {

    if ($('#mes_ano_' + $this.instanceId).val() != '') {
        var ano = $('#mes_ano_' + $this.instanceId).val().split('-')[0]; 7
        var mes = $('#mes_ano_' + $this.instanceId).val().split('-')[1];
    } else {
        FLUIGC.toast({
            message: 'Para o gráfico "Meta x Realizado" o Filtro de Mês deve ser selecionado.',
            type: 'danger'
        });

        return false;
    }

    myLoading2 = FLUIGC.loading("#grafico2")
    myLoading2.show();

    var tPai = getTable('stop', '');

    var nMes = "";

    for (var i = 1; i <= parseInt(mes); i++) {
        var comp = "";
        if (i < 10) {
            comp = '0';
        }

        if (nMes == "") {
            nMes = '(META_' + comp + i;
        } else {
            nMes += ' + META_' + comp + i;
        }

    }
    nMes += ')'

    var SQL =
        "select " +
        " distinct " +
        "LOGIN," +
        "first_name, " +
        "case" +
        "    when ( select 1 from TIM_STOP_METAS tsm where tsm.login = t.login and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S' ) is null" +
        "    then ISNULL(( select " + nMes + " from TIM_STOP_METAS tsm where tsm.cargo collate database_default = t.cargo collate database_default and tsm.AREA collate database_default = t.area collate database_default and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S' ),0)" +
        "    else ISNULL(( select " + nMes + " from TIM_STOP_METAS tsm where tsm.login = t.login and ANO_VIGENCIA = " + ano + " and IND_ATIVO = 'S' ),0)" +
        "end as meta," +
        "sum(total) total " +
        "from  " +
        "( " +
        "    select" +
        "            rm.cargo," +
        "            rm.area," +
        "            na.LOGIN ," +
        "        ra.first_name ," +
        "        count(distinct an.NUM_PROCES) as total     " +
        "    from " +
        "      " + tPai + " sc  " +
        "        join documento dc on (dc.cod_empresa = sc.companyid and dc.nr_documento = sc.documentid and dc.nr_versao = sc.version)  " +
        "        join anexo_proces an on (an.COD_EMPRESA = sc.companyid and an.NR_DOCUMENTO = sc.documentid)  " +
        "        join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA and u.NUM_PROCES = an.NUM_PROCES )  " +
        "        join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT )  " +
        "        join fdn_user ra on ( ra.USER_ID = na.USER_ID )" +
        "        join TIM_FLUIG_USUARIOS rm on ( na.login = rm.login COLLATE Latin1_General_CI_AS )" +
        "    where " +
        "        dc.versao_ativa = 1 " +
        "        and u.status <> 1         ";

    if ($('#zona_' + $this.instanceId).val() != '') {
        SQL += " and sc.zona = '" + $('#zona_' + $this.instanceId).val() + "' ";
    }

    if ($('#area_' + $this.instanceId).val() != '') {
        SQL += " and sc.area = '" + $('#area_' + $this.instanceId).val() + "' ";
    }

    if ($('#setor_' + $this.instanceId).val() != '') {
        SQL += " and sc.setor = '" + $('#setor_' + $this.instanceId).val() + "' ";
    }

    if ($('#matricula_' + $this.instanceId).val() != '') {
        SQL += " and u.COD_MATR_REQUISIT = '" + $('#matricula_' + $this.instanceId).val() + "' ";
    }

    if ($('#mes_ano_' + $this.instanceId).val() != '') {
        var ano = $('#mes_ano_' + $this.instanceId).val().split('-')[0];
        SQL += " and YEAR(CAST(u.START_DATE AS DATE)) = '" + ano + "' ";
    }

    SQL += " group by rm.cargo, rm.area, na.LOGIN, ra.first_name, u.START_DATE " +
        "    ) T " +
        " group by  " +
        "     cargo, " +
        "     area, " +
        "     LOGIN, " +
        "     first_name  " +
        " order by " +
        "     first_name  ";

    console.log("SQL: " + SQL);

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS', null, ConstraintType.MUST));

    var callback = {
        success: function (dataSet) {

            var array_label = new Array();
            var array_realizado = new Array();
            for (var i = 0; i < dataSet.values.length; i++) {
                array_label.push(dataSet.values[i]['first_name']);
                var wPercent = ((parseInt(dataSet.values[i]['total']) / parseInt(dataSet.values[i]['meta'])) * 100);
                array_realizado.push(wPercent.toFixed(2));
            }

            var data = {
                labels: array_label,
                datasets: [
                    {
                        label: "Realizado",
                        data: array_realizado
                    }
                ]
            };

            var options = {
                responsive: true,
                legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>;border: 1px solid <%=datasets[i].strokeColor%>;"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%>: <%=datasets[i].value%></li><%}%></ul>',
                scaleOverride: true,
                scaleSteps: 10, // number of ticks
                scaleStepWidth: 10, // tick interval
                scaleBeginAtZero: true
            };

            var width = $("#chart2").width() * 1.07;
            var height = $("#chart2").width() * 100 / 400;

            var barChart2 = FLUIGC.chart('#chart2', {
                id: 'bar_chart2',
                width: width,
                height: height,
                /* See the list of options */
            });
            var barChart = barChart2.bar(data, options);
            var legend = barChart.generateLegend();
            document.getElementById('legend_chart2').innerHTML = legend;
            myLoading2.hide();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    };

    dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);
}


function loadGraficos() {

    if ($('#myTab').find('li.active')[0].id == 'li_consulta') {
        // loadPieChart();
        // loadPieChartDetail();
    }
}

function dataAtualFormatada(indRetorno) {
    var retorno;
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();

    if (indRetorno == 'D') { retorno = diaF; }
    if (indRetorno == 'M') { retorno = mesF; }
    if (indRetorno == 'D') { retorno = anoF; }

    // return "'" + anoF + "-" + mesF + "-" + diaF + "'";
    return retorno;
}