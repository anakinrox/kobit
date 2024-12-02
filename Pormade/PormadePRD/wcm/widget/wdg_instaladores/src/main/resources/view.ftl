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

					    <div class="col-sm-2">
							<label class="control-label" for="txtNome">Equipe</label>
							<div class="input-group">
								<input name="nome_equipe_${instanceId}" id="nome_equipe_${instanceId}" type="text" class="form-control grp_equipe" readonly>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_equipe').val('')"></span>
								<span id="bt_equipe" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)">

								</span>
							</div>
						</div>	

					    <div class="col-sm-2">
							<label class="control-label" for="txtNome">Status</label>
							<#--  <div class="input-group">  -->
								<select class="form-control" id="idstatus_${instanceId}" name="idstatus_${instanceId}"></select>
							<#--  </div>  -->
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
				<div class="panel panel-success class">
					<div class="panel-heading fs-txt-center">
						<table width="100%">
							<tr>
								<td width="5%" align=left><button type="button" class="fluigicon fluigicon-plus-sign fluigicon-sm" onclick="f_addProposta();" style="display:none"></button></td>
								<td width="90%" align=center><b></b></td>
								<td width="5%" align=right><b></b></td>
							</tr>
						</table>
					</div>
					<div class="panel-body">
						<div id="idtable_${instanceId}" data-dbclick-tbl></div>
					</div>
				</div>
								
			</div>
			<div class="panel-body text-right">
				<input type="hidden" class="" name="idVersao" id="idVersao"/>
				<span id="strVersao">Ver. X.X.X</span>
			</div>
		</div> 

 
    </form>
</div>

<script type="text/template" class="template_datatable_edit">
    <tr id="area-edit" class="{{classSelected}}">
        <td>{{proposta}}<input type="hidden" value="{{proposta}}" id="datatable-input-proposta"></td>
		<td>{{seq}}<input type="hidden" value="{{seq}}" id="datatable-input-seq"></td>
		<td>{{produto}}<input type="hidden" value="{{produto}}" id="datatable-input-produto"></td>
		<td>{{descricao}}<input type="hidden" value="{{descricao}}" id="datatable-input-descricao"></td>
		<td><input type="text"  value="{{local}}" id="datatable-input-local"></td>
		<td><button class="btn btn-default" data-update-row>Atualizar</button></td>
    </tr>
</script>