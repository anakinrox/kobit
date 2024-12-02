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

						<div class="col-sm-3">
							<label class="control-label" for="indParametro_">Parâmetros</label>
							<div class="input-group">
								<select id="indParametro_${instanceId}" name="indParametro_${instanceId}" class="form-control grp_user valida" onchange="loadDataTable(this.value);" >
									<option value="" selected>Escolha uma opção</option>
									<option value="TC">Tipo Cadastro</option>
									<option value="PA">Parâmetros</option>
									<option value="CA">Categorias</option>
									<option value="NI">Níveis</option>
									<option value="PE">Perfil</option>
									<option value="US">Usuários</option>
								</select>
							</div>
						</div>						


						<div class="col-md-2">
							
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Consultar</button>
                      
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
				<div class="panel panel-success class">
					<div class="panel-heading fs-txt-center">
						<table width="100%">
							<tr>
								<td width="5%" align=left><button type="button" class="fluigicon fluigicon-plus-sign fluigicon-sm" onclick="f_incluirItem();"></button></td>
								<td width="90%" align=center><b></b></td>
								<td width="5%" align=right><b></b></td>
							</tr>
						</table>
					</div>
					<div class="panel-body"><div id="idtable_${instanceId}"></div></div>
				</div>

								
			</div>
		</div>      
    </form>
</div>