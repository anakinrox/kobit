<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<div id="body_${instanceId}">
	<div id="MyDataTable_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyDataTable.instance()">
	
	
		<div class="bs-example" id="tablepai">
			<div class="row">
				<br>
			</div>
			<div class="row">
				<div class="col-md-12 scrooltable" id="target" data-isolated-scroll>
					<a href="/portal/p/1/pageworkflowview?processID=cadastroTipoPortaCRM" class="btn btn-info" role="button">Novo Tipo de Porta  <span class="fluigicon fluigicon-plus-circle"></span></a>
					<br>
					<div id="idtable_${instanceId}"></div>
					<br>
					<a href="/portal/p/1/pageworkflowview?processID=cadastroTipoPortaCRM" class="btn btn-info" role="button">Novo Tipo de Porta  <span class="fluigicon fluigicon-plus-circle"></span></a>
				</div>
			</div>
		</div>
		
		<div id='dadosAlteracao' style="display:none;">
			
			<div class="row">
				<br>
			</div>
			<div class="row">
				<div class="col-md-4 col-md-offset-5" align="left">
					<button class="btn btn-info" data-voltar><span class="fluigicon fluigicon-login"></span>  Voltar  </button>
				</div>			
			</div>
			<div class="row">
				<br>
				<hr>
				<br>
			</div>
			
			<input name="cod_tipoPorta_edit" id="cod_tipoPorta_edit" type="hidden" class="form-control">
			
			<div id="divCabecalho">  <!-- INICIO divCabecalho -->
				<div class="col-sm-12">
					<div class="row" style="background:#B0E0E6; height=28; text-align:center">
						<strong>Dados Tipo de Porta</strong>
					</div>
				</div>
				<div class="col-sm-12">
					<div class="row" >
							&nbsp;
					</div>
				</div>
				<div class="col-sm-12">
					<div class="row">
					
						<div class="col-sm-4 col-md-offset-3" >
				   			<label for="txtNome">Descrição Tipo de Porta</label>   	 
							<div class="input-grup">
				   				<input name="descricao_tipoPorta_edit" id="descricao_tipoPorta_edit" type="text" class="form-control">
				   			</div>
				   		</div>
				   		<div class="col-sm-2" >
				   			<label for="txtNome">Porta Dupla</label>   	 
							<div class="input-grup">
				   				<select name="porta_dupla_edit" id="porta_dupla_edit" class="form-control">
						          	<option value=""></option>
									<option value="S">Sim</option>
									<option value="N">Não</option>
						      	</select> 
				   			</div>
				   		</div>					   		
				   	</div>
				</div>
				
				<div class="col-sm-12">
					<div class="row" >
							&nbsp;
					</div>
				</div>
				
				<div class="col-sm-12">
					<div class="row">
				   		<div class="col-sm-2 col-md-offset-3" >
				   			<label for="txtNome">Material</label>   	 
							<div class="input-grup">
				   				<select name="material_tipoPorta_edit" id="material_tipoPorta_edit" class="form-control">
						          	<option value=""></option>
									<option value="P">PVC</option>
									<option value="M">Madeira</option>
						      	</select> 
				   			</div>
				   		</div>
				   		
				   		<div class="col-sm-2" >
				   			<label for="txtNome">Preço</label>   	 
							<div class="input-grup">
				   				<input name="preco_tipoPorta_edit" id="preco_tipoPorta_edit" type="text" class="form-control" onKeyPress="validafunctions.setMoeda(this.id, 2, false , '')">
				   			</div>
				   		</div>
				   		
				   		<div class="col-sm-2" >
				   			<label for="txtNome">Status</label>   	 
							<div class="input-grup">
				   				<select name="status_tipoPorta_edit" id="status_tipoPorta_edit" class="form-control">
						          	<option value=""></option>
									<option value="A">Ativo</option>
									<option value="I">Inativo</option>
						      	</select> 
				   			</div>
				   		</div>
				   	</div>
				</div>
				
				<div class="col-sm-12">
					<div class="row" >
							&nbsp;
					</div>
				</div>
				
			</div> <!-- FIM divCabecalho -->			
			
			<div class="row">
				<br>
				<br>
			</div>
			
		    <div class="row">
				<br>
				<hr>
				<br>
			</div>
			
			<div class="row">
				<div class="col-md-2" align="left">
					<button class="btn btn-info" data-voltar><span class="fluigicon fluigicon-login"></span>  Voltar  </button>
				</div>			
				<div class="col-md-8" align="left">
				 		&nbsp;
				</div>	
				<div class="col-md-2" align="left">
					<button class="btn btn-success fs-full-width" data-confirma-alterar><span class="fluigicon fluigicon-verified"></span> Alterar Tipo de Porta </button>
				</div>	
			</div>
		</div>
		
	</div>	
</div>
