const removeDuplicatedUsers = usuarios => [...new Map(usuarios.map(usuario => [usuario.codigo_usuario, usuario])).values()];

const extractUserFromEvents = eventos => {
  const usuarios = eventos.reduce((acm, act) => {
    acm.push(...act.usuarios);
    return acm;
  }, []);

  return removeDuplicatedUsers(usuarios);
};

const getRandomIntegerNumber = (min = 0, max = 100) => Math.floor(Math.random() * (max - min)) + min;

const getRandomColor = () => {
  const red = getRandomIntegerNumber(0, 255);
  const green = getRandomIntegerNumber(0, 255);
  const blue = getRandomIntegerNumber(0, 255);

  return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
};

window.utils = { extractUserFromEvents, removeDuplicatedUsers, getRandomColor };
