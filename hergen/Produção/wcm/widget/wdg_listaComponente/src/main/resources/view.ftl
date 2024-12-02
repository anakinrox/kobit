<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

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

						<div class="col-md-2">
							<label class="control-label" for="projeto_${instanceId}">Projeto</label>
							<input type="number" class="form-control" name="projeto_${instanceId}" id="projeto_${instanceId}" />
						</div>

                        <div class="col-sm-4">
							<label class="control-label" for="cliente_${instanceId}">Cliente</label>
							<input name="cliente_${instanceId}" id="cliente_${instanceId}" type="text" class="form-control">
						</div>

						<div class="col-md-2">
							<label class="control-label" for="padrao_tinta_${instanceId}">Padrão Tinta</label>
							<input type="number" class="form-control" name="padrao_tinta_${instanceId}" id="padrao_tinta_${instanceId}" />
						</div>

						<div class="col-sm-4">
							<label class="control-label" for="responsavel_${instanceId}">Responsável</label>
							<div class="input-group">
								<input name="responsavel_${instanceId}" id="responsavel_${instanceId}" type="text" class="form-control grp_respon" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_respon').val('')"></span>
								<span id="bt_solic" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_responsavel_${instanceId}" id="cod_responsavel_${instanceId}" type="hidden" class="grp_respon">
								</span>
							</div>
						</div>
					</div>
					
					<div class="row">
					
						<div class="col-md-2">
							<label class="control-label" for="dat_fim_producao_${instanceId}">Data Final Producao</label>
							<input type="number" class="form-control" name="dat_fim_producao_${instanceId}" id="dat_fim_producao_${instanceId}" />
						</div>

						<div class="col-md-2">
							<label class="control-label" for="dias_producao_${instanceId}">Dias Producao</label>
							<input type="number" class="form-control" name="dias_producao_${instanceId}" id="dias_producao_${instanceId}" />
						</div>

						<div class="col-md-2">
							<label class="control-label" for="dat_inicio_producao_${instanceId}">Data Inicio Producao</label>
							<input type="number" class="form-control" name="dat_inicio_producao_${instanceId}" id="dat_inicio_producao_${instanceId}" />
						</div>
						
						<div class="col-md-3">
							<label class="control-label" for="visao_${instanceId}">Visão</label>
							<select class="form-control" name="visao_${instanceId}" id="visao_${instanceId}">
								<option value='TOT' selected>Total</option>
								<option value='KP' >KP - Pinos</option>
								<option value='KB' >KB - Buchas</option>
								<option value='KM' >KM - Micelanea afins pinos e buchas</option>
								<option value='KECP' >KECP - Estrutura Carbono Pesada</option>
								<option value='KEI' >KEI - Estrutura Inox</option>
								<option value='KEIT' >KEIT - Estrutura inox terceirizada</option>
								<option value='KECL' >KECL - Estrutura carbono leve</option>
								<option value='KIC' >KIC - Itens comprados</option>
								<option value='KAP' >KAP - Acessorios Passadiços</option>
								<option value='KCF' >KCF - Chapas Finas</option>
								<option value='KC' >KC - Itens Comerciais</option>
								<option value='EP' >EP - Equipamento padrão</option>
							</select>
						</div>
						
						<div class="col-md-3">
							<label class="control-label" for="fornecimento_${instanceId}">Fornecimento</label>
							<select class="form-control" name="fornecimento_${instanceId}" id="fornecimento_${instanceId}">
								<option value='T' selected>Todos</option>
								<option value='SC' >SC - Sempre Comprado</option>
								<option value='ET' >ET - Eventualmente Terceirizado</option>
								<option value='SHG' >SHG - Sempre Produzido Hergen</option>
							</select>
						</div>
						
					</div>	
					
					<div class="row"> 
					
						<div class="col-md-2">
							<label class="control-label" for="tipo_${instanceId}">Tipo Item</label>
							<select class="form-control" name="tipo_${instanceId}" id="tipo_${instanceId}">
								<option value='T' selected>Todos</option>
								<option value='P' >Produzido</option>
								<option value='C' >Comprado</option>
								<option value='F' >Final</option>
								<option value='T' >Fantasma</option>
							</select>
						</div>

						<div class="col-md-2">
							<label class="control-label" for="status_${instanceId}">Status</label>
							<select class="form-control" name="status_${instanceId}" id="status_${instanceId}">
								<option value='T' selected>Todos</option>
								<option value='L' >Liberado</option>
								<option value='N' >Não Liberado</option>
							</select>
						</div>
			
						<div class="col-md-2">
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Filtro</button>
                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu" role="menu">
                                        <!--  <li data-gera-pagamento-bloco id="btGeraPagamento" ><a href="#">Gerar Pagamento</a></li>  -->
                                        <!--  <li class="divider"></li>  -->
                                        <li data-load-imprimir id="btImprimir" ><a href="#">Imprimir</a></li>
                                        <li data-load-excel id="loadExcel" ><a href="#">Exportar Excel</a></li>
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

