<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
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
                <div class="col-md-3">
                    <label for="txtNome">Usuário</label>
                    <div class="input-group">
                        <input type="hidden" class="grp_user" name="matricula_${instanceId}" id="matricula_${instanceId}"/>
                        <input type="text" class="form-control grp_user valida" name="nome_usuario_${instanceId}" id="nome_usuario_${instanceId}" valida="field" readonly/>
                        <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
                        <span id="bt_user" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                    </div>
                </div> 
                <div class="col-md-3">
                    <div class="col-md-6" style="padding-left: 0px; padding-right: 0px">
                        <label for="exampleTag">Data Ini</label>
                        <input type="text" name="data_ini" id="data_ini_${instanceId}" class="form-control data-fluig">
                    </div>
                    <div class="col-md-6" style="padding-left: 0px; padding-right: 0px">
                        <label for="exampleTag">Data Fim</label>
                        <input type="text" name="data_fim" id="data_fim_${instanceId}" class="form-control data-fluig">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <div class="col-md-6" style="padding-left: 0px; padding-right: 0px">
                        <label for="exampleTag">Documento Ini</label>
                        <input type="tel" name="doc_ini" id="doc_ini_${instanceId}" class="form-control">
                    </div>
                    <div class="col-md-6" style="padding-left: 0px; padding-right: 0px">
                        <label for="exampleTag">Documento Fim</label>
                        <input type="tel" name="doc_fim" id="doc_fim_${instanceId}" class="form-control">
                    </div>
                </div>

                <div class="col-sm-2">
                    <label for="txtNome">Terceiro</label>
                    <select name="terceiro" id="terceiro_${instanceId}" class="form-control" >
                        <option value="">Todos</option>
                        <option value="S">Sim</option>
                        <option value="N">Não</option>
                    </select>
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
        <li class="view-adm" id="li_consulta"><a href="#aba_consulta" role="tab" data-toggle="tab" >Consulta</a></li>
    </ul>
    <div class="tab-content" style="padding-left: 0px; padding-bottom: 0px; padding-right: 0px; padding-top: 0px; ">
        <div class="tab-pane active" id="aba_dashboard">
            <div class="panel panel-info" style="margin-bottom: 0px;">
                <div class="panel-heading fs-txt-center">
                <b>Dashboard</b>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-sm-12" style="text-align: center;">
                            <label><b>Setor x Mês</b></label>
                            <div id="chart1"></div>
                            <div id="legend_chart1" class="legend"></div>
                        </div>
                    </div>
                    &nbsp;
                    <div class="row">
                        <div class="col-sm-12" style="text-align: center;">
                            <label><b>Categorias</b></label>
                            <div id="chart2"></div>
                            <div id="legend_chart2" class="legend"></div>
                        </div>
                    </div>
                    &nbsp;
                    <div class="row">
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Reação das Pessoas</b></label>
                            <div id="pieChart1"></div>
                            <div id="legend_pieChart1" class="legend"></div>
                        </div>
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Posição das Pessoas</b></label>
                            <div id="pieChart2"></div>
                            <div id="legend_pieChart2" class="legend"></div>
                        </div>
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Proteção das Pessoas</b></label>
                            <div id="pieChart3"></div>
                            <div id="legend_pieChart3" class="legend"></div>
                        </div>
                    </div>
                    &nbsp;
                    <div class="row">
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Ferramentas e Equipamentos</b></label>
                            <div id="pieChart4"></div>
                            <div id="legend_pieChart4" class="legend"></div>
                        </div>
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Procedimentos</b></label>
                            <div id="pieChart5"></div>
                            <div id="legend_pieChart5" class="legend"></div>
                        </div>
                        <div class="col-sm-4" style="text-align: center;">
                            <label><b>Padrões de Ordem e Limpeza</b></label>
                            <div id="pieChart6"></div>
                            <div id="legend_pieChart6" class="legend"></div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
        <div class="tab-pane" id="aba_consulta">
            <div class="panel panel-info" style="margin-bottom: 0px;">
                <div class="panel-heading fs-txt-center">
                    <b>Consulta Programa Stop</b>
                    <button type="button" class="btn btn-default btDataTable" data-load-excel style="float: right">Excel</button>
                    <button type="button" class="btn btn-primary btDataTable" data-load-imprimir style="float: right">Imprimir</button>                
                </div>
                <div class="panel-body">
                    <div id="divScrollTbConsulta_${instanceId}" class="row">
                        <div class="col-sm-12" style="padding-left: 0px; padding-right: 0px;">
                            <div class="form-group col-md-12" style="padding:0px 0px 0px 0px;">
                                <div class="col-md-12 table table-datatable table-responsive table-striped" data-edit-tbl id="table_${instanceId}" style="padding-left: 0px;padding-right: 0px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
    V 0.001g
</div>