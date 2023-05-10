import jwt from 'jsonwebtoken';
import User from '../models/Usuario.js';

// verifica que el usuario esté autenticado e inserta en req la info del usuario en caso de que si
const checkAuth = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // guardar user en el req de la api
      req.user = await User.findById(decoded.idUser).select('-password -confirmed -token -createdAt -updatedAt -__v'); // ingora alguna info que no es necesaria tenerla publica en los endpoints

      return next();

    } catch (error) {
      return res.status(404).json({ msg: 'Hubo un error' });
    }
  }

  if (!token) {
    const error = new Error('Token no valido');
    return res.status(401).json({ msg: error.message });
  }

  next();
}

export default checkAuth;