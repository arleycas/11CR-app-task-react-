import User from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegister, emailForgotPassword } from '../helpers/emails.js';

const createUser = async (req, res) => {

  // evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await User.findOne({ email });

  if (existeUsuario) {
    const error = new Error('Usuario ya registrado');
    return res.status(400).json({ msg: error.message })
  }

  try {
    const user = new User(req.body);
    user.token = generarId();
    await user.save();

    // enviar email de configuración
    emailRegister({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({ msg: 'Usuario creado correctamente. Revisa tu email para confirmar tu cuenta' });
  } catch (error) {
    console.error(error);
  }

}

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  // comprobar si el usuario existe

  const usuario = await User.findOne({ email });

  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(404).json({ msg: error.message })
  }

  // comprobar si está confirmado
  if (!usuario.confirmed) {
    const error = new Error('Tu cuenta no ha sido confirmada');
    return res.status(403).json({ msg: error.message })
  }

  // comprobar su password
  if (await usuario.checkPassword(password)) {
    res.json({
      _id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      token: generarJWT(usuario._id),
    })
  } else {
    const error = new Error('El password es incorrecto');
    return res.status(403).json({ msg: error.message })
  }
}

const confirmar = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message })
  }

  try {
    userConfirm.confirmed = true;
    userConfirm.token = ''; // se limpia ya que se confirmó
    await userConfirm.save();
    res.json({ msg: 'Usuario confirmado correctamente' });

  } catch (error) {
    console.error(error);
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await User.findOne({ email });

  // comprobar si usuario existe

  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(404).json({ msg: error.message })
  }

  try {
    usuario.token = generarId()
    await usuario.save()

    emailForgotPassword({
      email: usuario.email,
      name: usuario.name,
      token: usuario.token
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" })
  } catch (error) {
    console.log(error);
  }

}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await User.findOne({ token });

  if (tokenValido) {
    res.json({ msg: 'Token valido, el usuario existe' })
  } else {

    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message })
  }

}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log('token', token);
  console.log('password', password);

  const usuario = await User.findOne({ token });

  if (usuario) {

    try {
      usuario.password = password; // recordar que en el modelo de Usuario, está la verificación de que si es un nuevo password, lo agrega y lo agrega
      usuario.token = '';
      await usuario.save();
      res.json({ msg: 'Password actualizado correctamente' })

    } catch (error) {
      console.error(error);
    }

  } else {

    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message })
  }

}

const perfil = async (req, res) => {
  const { user } = req;

  // console.log('Desde perfil', user);
  res.json(user)

}


export {
  createUser,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil
}