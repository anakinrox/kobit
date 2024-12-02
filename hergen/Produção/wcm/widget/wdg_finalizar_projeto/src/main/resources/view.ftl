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
                    <div class="col-sm-4">
                        <label class="control-label" for="txtNome">Empresa</label>
                        <div class="input-group">
                            <input type="hidden" class="grp_user" name="cod_empresa_${instanceId}" id="cod_empresa_${instanceId}" value="02"/>
                            <input type="text" class="form-control grp_user valida" name="nome_empresa_${instanceId}" id="nome_empresa_${instanceId}" valida="field" value="HERGEN EMPRESA 02" readonly/>
                            <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" ></span>
                            <span id="bt_empresa" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" ></span> 
                        </div>
                    </div>

					<div class="col-sm-1">
						<label class="control-label" for="nomeUF">Nº Projeto</label>
						<input type="text" class="form-control grp_user valida" name="num_projeto_${instanceId}" id="num_projeto_${instanceId}" valida="field" value=""/>
					</div>

                    <div class="col-sm-2">
                        <label class="control-label" for="txtNome">Item</label>
                        <div class="input-group">
                            <input type="text" class="form-control grp_item valida" name="cod_item_${instanceId}" id="cod_item_${instanceId}" valida="field" />
                            <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_item').val('')"></span>
                            <span id="bt_item" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                        </div>
                    </div>					


				    <div class="col-md-2">
						<#--  <label class="control-label">&nbsp;</label>  -->
						<button type="button" class="btn btn-default" data-load-filtrar>Consultar</button>						
					</div> 
            </div>

			
        </div>
        <div class="bs-example">
            <div id="idtable_${instanceId}"></div>
        </div>
		<div class="panel-footer" id="dvbtConfirma" align="right" style="display:none;">
			<button type="button" class="btn btn-default" data-load-checkbox>Marcar Todos</button>
			<button type="button" class="btn btn-default" data-load-confirmar>Confirmar</button>
		</div>		
	</form>
</div>

<script type="text/template" class="template_datatable_edit">
    <tr id="area-edit" class="{{classSelected}}">
        <td>{{codItem}}<input type="hidden" value="{{codItem}}" id="datatable-input-id"></td>
		<td>{{nomeItem}}<input type="hidden" value="{{nomeItem}}" id="datatable-input-nomeItem"></td>
		<td>{{multiplo}}<input type="hidden" value="{{multiplo}}" id="datatable-input-multiplo"></td>
		<td>{{valorCusto}}<input type="hidden"  value="{{valorCusto}}" id="datatable-input-valorCusto"></td>
		<td>{{valorCal}}<input type="hidden"  value="{{valorCal}}" id="datatable-input-valorCal"></td>
		<td><input type="text" value="{{percVenda}}" size="3" onblur="f_aplicaPerce('datatable-input-valorCal','datatable-input-percVenda','datatable-input-valorVenda','S');" onkeypress="return onlynumber();" id="datatable-input-percVenda"></td>
		<td><input type="text" value="{{valorVenda}}" size="5" id="datatable-input-valorVenda"></td>

		<td>{{estqHome}}<input type="hidden"  value="{{estqHome}}" id="datatable-input-estqHome"></td>
		<td><input type="text" value="{{percEstoque}}" size="3"onblur="f_aplicaPerce('datatable-input-estqHome','datatable-input-percEstoque','datatable-input-estqDisp','N','datatable-input-multiplo');" onkeypress="return onlynumber();" id="datatable-input-percEstoque"></td>
		<td><input type="text" value="{{estqDisp}}" size="5" onkeypress="return onlynumber();" id="datatable-input-estqDisp" readonly></td>
		<td>{{estqSite}}<input type="hidden" value="{{estqSite}}" id="datatable-input-estqSite"></td>

		<td>
			<div class="input-group">
				<input type="text" value="{{refFlexy}}" size="8" id="datatable-input-refFlexy" readonly>
				<span id="bt_refFlex" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
			</div>
		</td>

		<td>{{sincroniazado}}<input type="hidden" value="{{sincroniazado}}" id="datatable-input-sincroniazado"></td>
		<td>{{usuarioCriado}}<input type="hidden" value="{{usuarioCriado}}" id="datatable-input-usuarioCriado"></td>
		<td>{{datRegistro}}<input type="hidden" value="{{datRegistro}}" id="datatable-input-datRegistro"></td>

		<td><button class="btn btn-default" data-update-row>Atualizar</button></td>
    </tr>
</script>