<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <#--  Título  -->
    <div class="row page-header">
        <div class="col-md-10 fs-no-padding fs-cursor-pointer">
            <h1 id="page_title"></h1>
        </div>
        <div class="col-md-2 text-right fs-no-padding">
            <h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
        </div>
    </div>    
    <div class="panel panel-info" style="margin-bottom: 0px;">
        <div class="panel-heading fs-txt-center">
        <b>Parâmetros</b>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-2">
                    <label for="txtNome">Zona</label>
                    <div class="input-group">
                        <input type="text" class="form-control grp_zona valida" name="zona_${instanceId}" id="zona_${instanceId}" valida="field" readonly/>
                        <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_zona').val('')"></span>
                        <span id="bt_zona" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                    </div>
                </div>
                <div class="col-md-2">
                    <label for="txtNome">Area</label>
                    <div class="input-group">
                        <input type="text" class="form-control grp_area valida" name="area_${instanceId}" id="area_${instanceId}" valida="field" readonly/>
                        <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_area').val('')"></span>
                        <span id="bt_area" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                    </div>
                </div>
                <div class="col-md-2">
                    <label for="txtNome">Setor</label>
                    <div class="input-group">
                        <input type="text" class="form-control grp_setor valida" name="setor_${instanceId}" id="setor_${instanceId}" valida="field" readonly/>
                        <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_setor').val('')"></span>
                        <span id="bt_setor" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                    </div>
                </div>
                <div class="col-md-2">
                    <label for="txtNome">Usuário</label>
                    <div class="input-group">
                        <input type="hidden" class="grp_user" name="matricula_${instanceId}" id="matricula_${instanceId}"/>
                        <input type="text" class="form-control grp_user valida" name="nome_usuario_${instanceId}" id="nome_usuario_${instanceId}" valida="field" readonly/>
                        <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
                        <span id="bt_user" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                    </div>
                </div> 
                <div class="col-md-3">
                    <div class="col-md-10" style="padding-left: 0px; padding-right: 0px">
                        <label for="exampleTag">Mês</label>
                        <input type="month" name="mes_ano" id="mes_ano_${instanceId}" class="form-control data-fluig">
                    </div>  
                </div>
                <div class="col-md-1">
                    <label class="control-label">&nbsp;</label>
                    <div class="input-group btDataTable" style="width: 100%;">
                        <div class="btn-group">
                            <button type="button" class="btn btn-default btDataTable" data-load-filtrar >&nbsp;&nbsp;&nbsp;&nbsp;Filtro&nbsp;&nbsp;&nbsp;&nbsp;</button>
                            <#--  <button type="button" class="btn btn-default btDataTable dropdown-toggle" data-toggle="dropdown">  -->
                                <#--  <span class="caret"></span>  -->
                                <#--  <span class="sr-only">Toggle Dropdown</span>  -->
                            <#--  </button>  -->
                            <#--  <ul class="dropdown-menu" role="menu">  -->
                                <#--  <li data-load-filtrar ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Filtro&nbsp;&nbsp;&nbsp;&nbsp;</a></li>  -->
                                <#--  <li class="divider"></li>  -->
                                <#--  <li data-load-imprimir id="btImprimir" ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Imprimir&nbsp;&nbsp;&nbsp;&nbsp;</a></li>  -->
                                <#--  <li data-load-excel id="loadExcel" ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Excel&nbsp;&nbsp;&nbsp;&nbsp;</a></li>  -->
                            <#--  </ul>  -->
                        </div>
                    </div>												
                </div>
            </div>
        </div>
    </div>
    <ul class="nav nav-tabs nav-justified" role="tablist" id="myTab" >
        <li class="active" id="li_dashboard"><a href="#aba_dashboard" role="tab" data-toggle="tab" onclick="loadGraficos()" >Dashboard</a></li>
    </ul>
    <div class="tab-content" style="padding-left: 0px; padding-bottom: 0px; padding-right: 0px; padding-top: 0px; ">
        <div class="tab-pane active" id="aba_dashboard">
            <div class="panel panel-info" style="margin-bottom: 0px;">
                <div class="panel-heading fs-txt-center">
                <b>Dashboard</b>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-sm-12" style="text-align: center;" id="grafico1">
                            <label><b>STOP: Meta x Realizado</b></label>
                            <div id="chart1"></div>
                            <div id="legend_chart1" class="legend"></div>
                        </div>
                    </div>
                    &nbsp;
                    <div class="row">
                        <div class="col-sm-12" style="text-align: center;" id="grafico2">
                            <label><b> STOP: % Realizado anual</b></label>
                            <div id="chart2"></div>
                            <div id="legend_chart2" class="legend"></div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>       
    </div>
</div>