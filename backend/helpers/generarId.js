/**
 * Genera un "token" aleatorio al momento de crear el usuario
 * @returns token aleatorio
 */
const generarId = () => {
  const random = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32);
  return random + fecha;
}

export default generarId;