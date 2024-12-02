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

						<div class="col-md-1">
							<label class="control-label" for="num_chamado_${instanceId}">Chamado</label>
							<input type="number" class="form-control" name="num_chamado_${instanceId}" id="num_chamado_${instanceId}" />
						</div>

						<div class="col-md-4">
							<label class="control-label" for="situacao_${instanceId}">Situação</label><p>
							<div class="custom-checkbox custom-checkbox-inline custom-checkbox-info">
								<input type="checkbox" id="checkbox-1_${instanceId}" name="checkbox-1_${instanceId}" checked="true">
								<label for="checkbox-1_${instanceId}">Aberto</label>
							</div>
							<div class="custom-checkbox custom-checkbox-inline custom-checkbox-info">
								<input type="checkbox" id="checkbox-2_${instanceId}" name="checkbox-2_${instanceId}">
								<label for="checkbox-2_${instanceId}">Finalizado</label>
							</div>
							<div class="custom-checkbox custom-checkbox-inline custom-checkbox-info">
								<input type="checkbox" id="checkbox-4_${instanceId}" name="checkbox-4_${instanceId}">
								<label for="checkbox-4_${instanceId}">Encerrado</label>
							</div>							
							<div class="custom-checkbox custom-checkbox-inline custom-checkbox-info">
								<input type="checkbox" id="checkbox-3_${instanceId}" name="checkbox-3_${instanceId}">
								<label for="checkbox-3_${instanceId}">Cancelado</label>
							</div>
						</div>

                        <div class="col-sm-3">
							<label class="control-label" for="txtNome">Título</label>
							<input name="titulo_${instanceId}" id="titulo_${instanceId}" type="text" class="form-control">
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Solicitante</label>
							<div class="input-group">
								<input name="solicitante_${instanceId}" id="solicitante_${instanceId}" type="text" class="form-control grp_solic" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_solic').val('')"></span>
								<span id="bt_solic" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_solicitante_${instanceId}" id="cod_solicitante_${instanceId}" type="hidden" class="grp_solic">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Usuario que atuou</label>
							<div class="input-group">
								<input name="atendente_${instanceId}" id="atendente_${instanceId}" type="text" class="form-control grp_atend" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_atend').val('')"></span>
								<span id="bt_atend" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_atendente_${instanceId}" id="cod_atendente_${instanceId}" type="hidden" class="grp_atend">
								</span>
							</div>
						</div>


						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Atividade</label>
							<div class="input-group">
								<input name="atividade_${instanceId}" id="atividade_${instanceId}" type="text" class="form-control grp_atividade" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_atividade').val('')"></span>
								<span id="bt_atividade" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_atividade_${instanceId}" id="cod_atividade_${instanceId}" type="hidden" class="grp_atividade">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Seção</label>
							<div class="input-group">
								<input name="secao_${instanceId}" id="secao_${instanceId}" type="text" class="form-control grp_secao" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_secao').val('')"></span>
								<span id="bt_secao" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_secao_${instanceId}" id="cod_secao_${instanceId}" type="hidden" class="grp_secao">
								</span>
							</div>
						</div>

						<div class="col-sm-2">
							<label class="control-label" for="txtNome">Tipo</label>
							<div class="input-group">
								<input name="tipo_${instanceId}" id="tipo_${instanceId}" type="text" class="form-control grp_tipo" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_tipo').val('')"></span>
								<span id="bt_tipo" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_tipo_${instanceId}" id="cod_tipo_${instanceId}" type="hidden" class="grp_tipo">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Setor</label>
							<div class="input-group">
								<input name="setor_${instanceId}" id="setor_${instanceId}" type="text" class="form-control grp_setor" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_setor').val('')"></span>
								<span id="bt_setor" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_setor_${instanceId}" id="cod_setor_${instanceId}" type="hidden" class="grp_setor">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Categoria</label>
							<div class="input-group">
								<input name="categoria_${instanceId}" id="categoria_${instanceId}" type="text" class="form-control grp_categoria" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_categoria').val('')"></span>
								<span id="bt_categoria" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<input name="cod_categoria_${instanceId}" id="cod_categoria_${instanceId}" type="hidden" class="grp_categoria">
								</span>
							</div>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">SubCategoria</label>
							<div class="input-group">
								<input name="subcategoria_${instanceId}" id="subcategoria_${instanceId}" type="text" class="form-control grp_subcategoria" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_subcategoria').val('')"></span>
								<span id="bt_subcategoria" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">
									<#--  <input name="cod_subcategoria_${instanceId}" id="cod_subcategoria_${instanceId}" type="hidden" class="grp_subcategoria">  -->
								</span>
							</div>
						</div>

						<div class="col-sm-4">
							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Abertura Ini</label>
								<input type="date" class="form-control" id="dt_ini_${instanceId}" name="dt_ini_${instanceId}"/>
							</div>

							<div class="col-sm-6 fs-no-padding">
								<label class="control-label" for="exampleTag">Data Abertura Fim;</label>
								<input type="date" class="form-control" id="dt_fim_${instanceId}" name="dt_fim_${instanceId}"/>
							</div>
						</div>

						<div class="col-md-2" style="display: none">
							<label for="exampleTag">&nbsp;</label>
							<button type="button" class="btn btn-primary form-control" data-aponta-horas >Apontar Horas</button>
						</div>

						<div class="col-md-2">
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Filtro</button>
									<button type="button" class="btn btn-default" data-load-excel >Exportar Excel</button>
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