import jwt from 'jsonwebtoken';

// genera un JWT, que se guarda en DB al usuario. Con eso podemos confirmar que el usuario ha sido autenticado de forma correcta
const generarJWT = (idUser) => {
  return jwt.sign(
    { idUser },
    process.env.JWT_SECRET,
    { expiresIn: '30d' });
}

// https://github.com/auth0/node-jsonwebtoken -> Buscar con f3 "expiresIn" para ver los formatos de tiempo


export default generarJWT;