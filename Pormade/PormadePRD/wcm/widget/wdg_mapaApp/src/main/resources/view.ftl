<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCl0_mNZ9TkYs9hOwh_wouxt--iLyFojxA" type="text/javascript"></script>

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
							<label class="control-label" for="txtNome">UF</label>
							<div class="input-group">
								<input name="UF_${instanceId}" id="UF_${instanceId}" type="text" class="form-control grp_uf" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_uf').val('')"></span>
								<span id="bt_uf" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_UF_${instanceId}" id="cod_UF_${instanceId}" type="hidden" class="grp_uf">
								</span>
							</div>
						</div>

					    <div class="col-sm-2">
							<label class="control-label" for="txtNome">Cidade</label>
							<div class="input-group">
								<input name="cidade_${instanceId}" id="cidade_${instanceId}" type="text" class="form-control grp_cidade" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_cidade').val('')"></span>
								<span id="bt_cidade" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_cidade_${instanceId}" id="cod_cidade_${instanceId}" type="hidden" class="grp_cidade">
								</span>
							</div>
						</div>						


						<#--  <div class="col-sm-3">
							<label class="control-label" for="txtNome">Motorista</label>
							<div class="input-group">
								<input name="motorista_${instanceId}" id="motorista_${instanceId}" type="text" class="form-control grp_motorista" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_motorista').val('')"></span>
								<span id="bt_motorista" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_motorista_${instanceId}" id="cod_motorista_${instanceId}" type="hidden" class="grp_motorista">
								</span>
							</div>
						</div>  -->

						<div class="col-sm-2">
							<label class="control-label" for="txtNome">Show</label>
							<div class="input-group">

								<div class="custom-checkbox custom-checkbox-success">
									<input type="checkbox" id="chk_movel">
									<label for="chk_movel">Movel</label>
								</div>
								<div class="custom-checkbox custom-checkbox-success">
									<input type="checkbox" id="chk_condominio">
									<label for="chk_condominio">Condomínio</label>
								</div>
								<div class="custom-checkbox custom-checkbox-success">
									<input type="checkbox" id="chk_carretinha">
									<label for="chk_carretinha">Carretinha</label>
								</div>	
							</div>
						</div>						

						<div class="col-sm-3">
							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Início</label>
								<input type="date" class="form-control" id="dt_ini_${instanceId}" name="dt_ini_${instanceId}"/>
							</div>

							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Fim</label>
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
	<script>

		$(document).ready(function() {	
			$('#dt_ini_' + $this.instanceId).val(DataHoje('rev'))
			$('#dt_fim_' + $this.instanceId).val(DataHoje('rev'))
		})

	</script>
 
		<#--  table para listar dados  -->
		<div class="row">
			<div class="col-md-12">
				<div id="idmapVisitas_${instanceId}" style="width:100%;height:600px;"></div> 
				<div id="legend"><h3>Legenda</h3></div>					
			</div>
		</div>      
    </form>
</div>