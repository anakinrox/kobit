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

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Cargo</label>
							<div class="input-group">
								<input type="hidden" class="grp_cargo" name="cargo_${instanceId}" id="cargo_${instanceId}"/>
								<input type="text" class="form-control grp_cargo valida" name="nome_cargo_${instanceId}" id="nome_cargo_${instanceId}" valida="field" readonly/>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_cargo').val('')"></span>
								<span id="bt_cargo" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
							</div>
						</div>

                        <div class="col-sm-2">
							<label class="control-label" for="area_${instanceId}">Área</label>
							<select name="area_${instanceId}" id="area_${instanceId}" class="form-control">
								<option value="" selected> </option>
								<option value="COM">COM</option>
								<option value="ADM">ADM</option>
								<option value="IND">IND</option>
								<option value="ER">ER</option>
							</select>
						</div>

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Usuário</label>
							<div class="input-group">
								<input type="hidden" class="grp_user" name="matricula_${instanceId}" id="matricula_${instanceId}"/>
								<input type="text" class="form-control grp_user valida" name="nome_usuario_${instanceId}" id="nome_usuario_${instanceId}" valida="field" readonly/>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
								<span id="bt_user" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
							</div>
						</div>

						<div class="col-sm-2">
							<div class="col-md-10" style="padding-left: 0px; padding-right: 0px">
								<label for="exampleTag">Ano</label>
								<input type="Number" name="ano" id="ano_${instanceId}" maxlength="4" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" class="form-control data-fluig">
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
                                        <#--  <li class="divider"></li>  -->
                                        <li data-load-editarMeta id="btNovaMeta" onclick="localChamado='inc';"><a href="#">Incluir Meta</a></li>
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