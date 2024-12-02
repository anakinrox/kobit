function servicetask88(attempt, message) {
	
	var nome = String( hAPI.getCardValue("nome").toUpperCase() );
	var cupom = String( hAPI.getCardValue("cupon").toUpperCase() );
	var destinatario = String( hAPI.getCardValue("email") );
	
	var html = 	'<!DOCTYPE html> '+
    '<html>  '+
    '	<head>  '+
    '		<style>  '+
    ' 			table{border-collapse:collapse}td,th{vertical-align:bottom;padding:5px;font-size:12px;font-weight:400}hr{border-width:2px}.title{font-size:20px;border:none}.left{text-align:left}.p-title{font-size:16px}.p-subtitle{font-size:14px}.v-align-middle{vertical-align:middle} '+
    '		</style>  '+
    '	</head>  '+
    '	<body>		 '+
    '		<table width="100%"> '+
    '			<tr> '+
    '				<th class="left" width="20%"> '+
    '					<p class="p-title">Olá, '+ nome +'. Seu cadastro de parceria foi finalizado com sucesso!</p> '+
    '					<p class="p-title">A partir de agora você se tornou oficialmente um parceiro Pormade e estará levando soluções para os seus clientes ao indicar nossos produtos. '+
    '					<p class="p-title">Para iniciarmos, fique atento em algumas informações importantes para você: '+
    '					<p class="p-title">Seu código de parceria é '+ cupom +' '+
    '					<p class="p-title">Ao tornar-se Parceiro Pormade, você recebe esse código para uso em todas as suas propostas geradas em nossos canais de vendas, sejam físicos, digitais ou televendas. '+
    '					<p class="p-title">Importante: É fundamental que o código seja vinculado nas propostas geradas por sua indicação. Para validar sua participação nos orçamentos, basta informar ao Consultor de Vendas que estiver lhe atendendo. '+
    '					<p class="p-title">Lembrando que, para qualquer duvida, você terá contato direto com o seu Consultor de Relacionamento, que estará à disposição sempre que precisar. Ele será responsável por lhe informar sobre detalhes referentes a produtos, parceria e demais assuntos relacionados.'+
    '					<p class="p-title">Agradeço a sua ajuda e para qualquer dúvida estou à disposição.'+
    '					<hr> '+
    '                   <p>Att:</p> '+
    '					<p class="p-title"><b>Canais de Relacionamento Pormade</b></p> '+
	'					<img src="http://fluig.pormade.com.br:8080/portal/api/servlet/image/1/custom/logo_image.png" width="205" height="63"> '+
    '               </tr> '+
    '		</table> '+
    '	<body> '+
    '</html> ';

	var assunto = 'Solicitação de Parceria Pormade'
//	destinatario += ',adrian.malat@pormade.com.br';
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("EMAILS", 'admlog' , destinatario, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("CONTEUDO", html, assunto, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("TIPO", 'notify', null, ConstraintType.MUST));
	var dsRetorno = DatasetFactory.getDataset("enviaEmail", null, constraints, null);
	
}