<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyDataTable_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyDataTable.instance()">

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
						<div class="col-sm-4">
							<label class="control-label" for="txtNome">Número SV</label>
                            <input type="text" class="form-control grp_user valida" name="num_sv_${instanceId}" id="num_sv_${instanceId}" valida="field" />
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
                                    <button type="button" class="btn btn-default" data-load-filtrar>Consultar</button>
                                </div>
                            </div>
                        </div>					
					</div>                
				</div>
			</div>
        </div>

		<div class="row">
			<div class="col-md-12">
				<div id="idtable_${instanceId}"></div>					
			</div>
		</div>        

	</form>
</div>

