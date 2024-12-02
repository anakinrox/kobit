<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDsLMZpmTErG2w7R-XUUCvE1te1uAU029U" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <form class="form-horizontal">
		<#--  Título  -->
        <div class="row page-header">
            <div class="col-md-10 fs-no-padding fs-cursor-pointer">
                <h1 id="page_title"></h1>
            </div>
            <div class="col-md-2 text-right fs-no-padding">
                <h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
            </div>
        </div>

        <#--  Painel  -->
        <div class="panel panel-default">
            <#--  Header  -->
			<div class="panel-heading">
				<h4 class="panel-title">
					<a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseGeral" aria-expanded="true">Filtros</a>
				</h4>
			</div>
            <#--  Body  -->
            <div id="collapseGeral" class="panel-collapse collapse in" aria-expanded="true">
				<div class="panel-body">
					<div class="row">

						<div class="col-sm-2">
							<label class="control-label" for="num_pedido_${instanceId}">Pedido BLA</label>
							<input type="number" class="form-control" name="num_pedido_${instanceId}" id="num_pedido_${instanceId}" />
						</div>

                        <div class="col-sm-2">
							<label class="control-label" for="num_nota_${instanceId}">Nota Fiscal</label>
							<input type="number" class="form-control" name="num_nota_${instanceId}" id="num_nota_${instanceId}" />
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Motorista</label>
							<div class="input-group">
								<input name="motorista_${instanceId}" id="motorista_${instanceId}" type="text" class="form-control grp_solic" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_solic').val('')"></span>
								<span id="bt_motorista" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_motorista_${instanceId}" id="cod_motorista_${instanceId}" type="hidden" class="grp_solic">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Liberação Ini</label>
								<input type="date" class="form-control" id="dt_ini_${instanceId}" name="dt_ini_${instanceId}"/>
							</div>

							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Liberação Fim</label>
								<input type="date" class="form-control" id="dt_fim_${instanceId}" name="dt_fim_${instanceId}"/>
							</div>
						</div>

						<div class="col-md-2">
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Consultar</button>
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

		<#--  table para listar dados  -->
		<div class="row">
			<div class="col-md-12">
				<div id="idtable_${instanceId}"></div>					
			</div>
		</div>      
    </form>
</div>