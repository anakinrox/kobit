const salvarFormulario = async (documentId, valoresFormulario) => {
  const URL = `/ecm-forms/api/v2/cardindex/${documentId}/cards`;
  const headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });

  const body = JSON.stringify({
    values: Object.entries(valoresFormulario).map(([key, value]) => ({ fieldId: key, value }))
  });

  const init = {
    headers,
    method: 'POST',
    body
  };

  const response = await fetch(URL, init);
  if (response.ok)
    return {
      success: true,
      data: await response.json()
    };

  return {
    success: false,
    data: await response.text()
  };
};

window.fluigAPI = { salvarFormulario };
