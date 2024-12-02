const abrirFormulario = (registros, documentIdForm) => {
  const titulo = registros ? 'Editar evento' : 'Novo evento';
  const documentid = documentIdForm;
  const link = `/webdesk/streamcontrol/${documentid}/0/0/`;
  const iframe = `<iframe id="iframeForm" style="border: 0px; width: 100%; height: 65vh" src="${link}"></iframe>`;

  return new Promise((resolve, reject) => {
    const modalFormulario = FLUIGC.modal(
      {
        title: titulo,
        content: iframe,
        id: 'documentEdit',
        size: 'full',
        actions: [
          {
            label: 'Salvar',
            bind: 'data-salvar',
            classType: 'btn-success confirmar'
          },
          {
            label: 'Cancelar',
            bind: 'data-fechar'
          }
        ]
      },
      function (err) {
        if (err) reject(err);

        const iframe = document.getElementById('iframeForm');

        iframe.addEventListener('load', () => {
          const iframeDocument = iframe.contentDocument;

          if (registros) {
            // iframeDocument.form.solicitacao.value = solicitacao.solicitacao;
          } else {
            iframeDocument.form.codigo_autor.value = WCMAPI.userCode;
            iframeDocument.form.autor.value = WCMAPI.user;
            iframeDocument.form.createdAt.value = new Date().getTime();
          }
        });

        const btnSalvar = document.querySelector('[data-salvar]');
        btnSalvar.addEventListener('click', () => {
          const iframeDocument = iframe.contentDocument;
          const fields = iframeDocument.querySelectorAll('input, select');
          const form = Array.from(fields)
            .filter(input => {
              if (input.type == 'radio') return input.checked;
              return true;
            })
            .map(input => ({ [input.name]: input.value }))
            .reduce((acm, act) => {
              acm = { ...act, ...acm };
              return acm;
            }, {});

          const errosForm = validarFormulario(form);
          if (errosForm.length) {
            const mensagens = errosForm.reduce((acm, act) => {
              acm += act.mensagem + '\n';
              return acm;
            }, '');
            return FLUIGC.message.alert({ message: mensagens, title: 'Atenção' }, () => {});
          }

          modalFormulario.remove();
          resolve(form);
        });

        const btnFechar = document.querySelector('[data-fechar]');
        btnFechar.addEventListener('click', () => {
          modalFormulario.remove();
          resolve(null);
        });
      }
    );
  });
};

function validarFormulario(form) {
  const isEmpty = value => value == null || value == undefined || value.toString().trim() == '';

  const erros = [];

  if (isEmpty(form.origem)) erros.push({ campo: 'origem', mensagem: 'Selecione a Origem' });
  if (isEmpty(form.descricao)) erros.push({ campo: 'descricao', mensagem: 'Informe a Descrição' });
  if (isEmpty(form.data_inicio)) erros.push({ campo: 'data_inicio', mensagem: 'Informe a Data de Início' });
  if (isEmpty(form.data_fim)) erros.push({ campo: 'data_fim', mensagem: 'Informe a Data de Fim' });
  if (isEmpty(form.cidade)) erros.push({ campo: 'cidade', mensagem: 'Informe a Cidade' });

  return erros;
  //   const isInvalidEmail = email => (email + '').replace(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '') != '';
  //   if (form.nome_cliente.trim() == '') return 'Informe o cliente';
  //   if (isInvalidEmail(form.email_cliente)) return 'Informe um e-mail válido';
  //   if (form.quantidade.trim() == '') return 'Informe a quantidade';
  //   else if (Number(form.quantidade) < 1) return 'Informe uma quantidade maior que zero';
  //   return null;
}

window.formularioUtils = { abrirFormulario };
