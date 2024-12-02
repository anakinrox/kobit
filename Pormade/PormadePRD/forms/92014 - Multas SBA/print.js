	function print(){

		if( WO != undefined ){
			WO.document.close();
			WO.focus();
			WO.close();
		}

		var mydate = new Date();
		console.log(mydate);
		var year = mydate.getFullYear();
		console.log(year);
		var month = mydate.getMonth();
		var daym = mydate.getDate();

		if (daym < 10) {
			daym = "0" + daym;
		}

		var monthm = mydate.getMonth()+1;
		if (monthm < 10) {
			monthm = "0" + monthm;
		}

		var dateNow = daym + "/" + monthm + "/" + year;
		var timeNow = mydate.getHours() + ":" + mydate.getMinutes();

		var montharray = new Array(" de Janeiro de ", " de Fevereiro de ", " de Março de ", "de Abril de ", "de Maio de ", "de Junho de", "de Julho de ", "de Agosto de ", "de Setembro de ", " de Outubro de ", " de Novembro de ", " de Dezembro de ");
		var hoje = daym + " " + montharray[month] + year;

		// var cpf = $('#cod_motorista').val();
		// cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

		var total_parcelas = $('table[tablename=tbl_parcelas] tbody tr').length - 1;
		
		var html =  "<!DOCTYPE html> "+
								"<html> "+
								"  <head> "+
								"    <style> "+
								"      table, th, td { "+
								" 		   border: 1px solid black; "+
								" 			 border-collapse: collapse; "+
								" 		 } "+
								" 		 th, td { "+
								" 		   padding: 5px; "+
								" 		 } "+
								"			 .title { "+
								"			   background-color: #ccc; "+
								"				 text-align: center; "+
								"			 } "+
								"    </style> "+
								"  </head> "+
								"  <body> ";
			
				$("input[name*=n_parcela___]").each(function(index, value){			
					
					var linha = $(this).attr('id').split('___')[1];

					var parcela = index + 1;

					if	($(this).attr("id")[0] != '_' ){
												
					html += "   <table style='width: 100%;' font size = 2 > " +
									"		  <tr> " +
									"			  <td class='title' colspan='12' > " +
									"				  <b>RECIBO MULTA  "+  parcela + "/" + total_parcelas +"</b> " +
									"			  </td> " +
									"	 	  </tr> " +
									"		  <tr> " +
									"			  <td colspan='6' >Data Infração: "+ $('#data_infracao').val() + "</td> " +
									"			  <td colspan='6' style='text-align: right;'>Valor: R$ " + $('#valor_parcela___'+ linha).val() + "</b></td> " +
									"	 	  </tr> " +
									"		  <tr> " +
									"			<td colspan='12' >" +
									"			<b>Infração: " + $('#cod_infracao').val() + " - " + $('#infracao').val() + "</b>" +
									"<br>" +
									"<br>" +
									"				Recebi de TRANSPORTES RODOVIARIOS SBA LTDA, a importância de R$ " + $('#valor_parcela___'+ linha).val() + ", referente pagamento da multa da viagem" +
									"<br>" +
									"<br>" +
									"Por ser verdade firmo o presente recibo." +
									"<br>" +
									"</td> " +
									"	 	  </tr> " +
									"		  <tr style='text-align: right;'> " +
									"			  <td colspan='12' >" +
									"União da Vitória, " + hoje +
									"<br>" +
									"<br>" +
									"<b>________________________________________</b>" +
									"<br>" +
									$('#motorista').val() +
									"<br>" +
									$('#cod_motorista').val()+
									"</td> " +
									"	 	  </tr> " +
									"   </table>" +
									" </div>"+
									" <div style='page-break-after:always'></div>";
						
					}

				});	
			
				html += "    </table>" +
								"  </body> "+
								"</html> "; 	
				//console.log('html.....',html);
		WO = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        //WindowObject.document.writeln(DocumentContainer.innerHTML);
		WO.document.writeln(html);
        //setTimeout("imprime();", 100);
   
        
	};
	
	var WO;
	
	function imprime( ){
		WO.document.close();
		WO.focus();
		WO.print();
		WO.close();		
	}
	
	function pad (str, max) {
	  str = str.toString();
	  return str.length < max ? pad("0" + str, max) : str;
	};
		
	function sortChar(a,b) {
		return a - b;
	};	
	
	
	function movimentActivity(completeTask, formData, selectedColleague, selectedState, showMessage, isAutomatic, onComplete, isReturn, passValue, subProcessId, subProcessSequence, hideModal, transferTaskAfterSelection) {

		var comments = "";
		var newObservations = [];
		if (parent.ECM_WKFView.wkfViewObservation) {
			comments = parent.ECM_WKFView.wkfViewObservation.getObservation();
			newObservations = parent.ECM_WKFView.wkfViewObservation.getUnsentObservations()
		}
		var _this = parent.ECM_WKFView,
			message = "",
			attachments = [];
		var pID = parent.ECM.workflowView.processDefinition.processInstanceId;
		this.newRequest = pID === 0;
		if (this.newRequest) {
			attachments = parent.WKFViewAttachment.getAllAttachments()
		}
		var senddata = {
			processInstanceId: pID,
			processId: parent.ECM.workflowView.processId,
			version: parent.ECM.workflowView.version,
			taskUserId: parent.ECM.workflowView.processDefinition.taskUserId,
			completeTask: completeTask,
			currentMovto: parent.ECM.workflowView.processDefinition.currentMovto,
			managerMode: parent.ECM.workflowView.processDefinition.managerMode ? true : false,
			selectedDestinyAfterAutomatic: _this.conditionsAutomatic.selectedDestinyAfterAutomatic,
			conditionAfterAutomatic: _this.conditionsAutomatic.conditionAfterAutomatic,
			selectedColleague: selectedColleague,
			comments: comments,
			newObservations: newObservations,
			appointments: parent.ECM.workflowView.appointments,
			attachments: attachments,
			pass: passValue,
			digitalSignature: parent.ECM.workflowView.digitalSignature,
			formData: formData,
			deleteUploadFiles: parent.ECM.workflowView.deleteUploadFiles,
			isDigitalSigned: parent.ECM.workflowView.isDigitalSigned,
			isLinkReturn: isReturn,
			versionDoc: parent.ECM.workflowView.processDefinition.versionDoc,
			selectedState: selectedState,
			internalFields: parent.ECM.workflowView.internalFields,
			subProcessId: subProcessId,
			subProcessSequence: subProcessSequence,
			transferTaskAfterSelection: transferTaskAfterSelection,
			currentState: parent.ECM.workflowView.sequence
		};
		parent.WCMAPI.Create({
			url: parent.ECM.restUrl + "workflowView/send",
			async: true,
			data: senddata,
			styleGuide: true,
			success: function (data) {

				parent.window.onbeforeunload = null;
				parent.location.reload(true);

			},
			error: function (err) {
				alert("error")
				//loading2.hide()
			},
			complete: function () {

			}
		})
	}