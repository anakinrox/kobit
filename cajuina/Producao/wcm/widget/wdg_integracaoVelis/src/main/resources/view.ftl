<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <div id="app">
        <form class="form-horizontal">
            <div class="row page-header">
                <div class="col-md-10 fs-no-padding fs-cursor-pointer">
                    <h1 id="page_title"></h1>
                </div>
                <div class="col-md-2 text-right fs-no-padding">
                    <h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
                </div>
            </div> 

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseGeral" aria-expanded="true">Filtros</a>
                    </h4>
                </div>  

                <div id="collapseGeral" class="panel-collapse collapse in" aria-expanded="true">
                    <div class="panel-body">
                        <div class="row">

                            <div class="col-md-2">
                                <label class="control-label">&nbsp;</label>
                                <div class="input-group">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-default" data-execute >Consultar</button>
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">									
                                            <span class="caret"></span>
                                            <span class="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                            <#--  <li data-gera-pagamento-bloco id="btGeraPagamento" ><a href="#">Gerar Pagamento</a></li>  -->
                                            <#--  <li class="divider"></li>  -->
                                            <#--  <li data-load-imprimir id="btImprimir" ><a href="#">Imprimir</a></li>  -->
                                            <#--  <li data-load-excel id="loadExcel" ><a href="#">Exportar Excel</a></li>  -->
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div> 
            <div class="row">
                <div class="col-md-12">
                    <div class="panel panel-success class">

                    </div>
					<div class="panel-body">
						<div id="idtable_${instanceId}"></div>
					</div>                    
                </div>
            </div>

                        <div class="row">
                <div class="col-md-12">
                    <div class="panel panel-success class">

                    </div>
					<div class="panel-body">
						<div id="idtable_pend_${instanceId}"></div>
					</div>                    
                </div>
            </div>
        </form>
    </div>
</div>