function print() {

	var html = '';

	$("input[name^=cod_item___]").each(function (index, value) {
		var linha = parseInt($(this).attr("id").substring($(this).attr("id").indexOf("___") + 3));
		if (index == 0){
			html += " <!DOCTYPE html> " +
					" <html> " +
					" 	<head> " +
					" 		<style> " +
					"				table {" +
					"					border-collapse: collapse; " +
					"				}" +
					" 			th, td { " +
					" 				border: 1px solid black; " +
					" 				border-collapse: collapse; " +
					" 				padding: 5px; " +
					" 				font-size: 12px; " +
					" 			} " +
					"				.title { " +
					"					background-color: #ccc; " +
					"					text-align: center; " +
					"				} " +
					"				.center { " +
					"					text-align: center; " +
					"				} " +
					"				.right { " +
					"					text-align: right; " +
					"				} " +
					"				.noBorder { " +
					"					border: none; " +
					"				} " +
					" 		</style> " +
					" 	</head> " +
					" <body> " +
					" <table style='width: 100%;' font size = 1 > "+
					"	<tr> "+
					"		<td class='title' colspan='6'><b>Itens par inventário</b></td> "+
					"	</tr> "+
					"	<tr> "+
					"		<td style='width: 45%;'><b>Item:</b></td> "+
					"		<td style='width: 10%;'><b>Local:</b></td> "+
					"		<td style='width: 10%;'><b>Lote:</b></td> "+
					"		<td style='width: 10%;'><b>Sit:</b></td> "+
					"		<td style='width: 10%;'><b>Qtd. Estoque:</b></td> "+
					"		<td style='width: 15%;'><b>Qtd Contada:</b></td> "+
					"	</tr> ";
					// " </table> ";
		}

		html += 
				"	<tr> "+
				"		<td style='width: 45%;'>"+ $('#cod_den_item___' + linha ).val() +" </td>"+
				"		<td style='width: 10%;'>"+ $('#local_est___' + linha ).val() +" </td>"+
				"		<td style='width: 10%;'>"+ $('#lote___' + linha ).val() +" </td>"+
				"		<td style='width: 10%;'>"+ $('#ies_situa_qtd___' + linha ).val() +" </td>"+
				"		<td style='width: 10%;'>"+ $('#qtd_estoque___' + linha ).val() +" </td>"+
				"		<td style='width: 15%;'>&nbsp;</td>"+
				"	</tr> ";
				


	});

	if ( html != '' ){
		html += " 		</table> "+
				"	</body> " +
				"</html> ";	

		var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
		// WindowObject.document.writeln(DocumentContainer.innerHTML);
		WindowObject.document.writeln(html);
		// WindowObject.document.close();
		// WindowObject.focus();
		// WindowObject.print();
		// WindowObject.close();  
	} else {
		FLUIGC.toast({
			title: 'Alerta',
			message: 'Nenhum item adicionado',
			type: 'warning'
		});
	}

	 

};