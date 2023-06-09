import express from 'express';
const router = express.Router();
import { createUser, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../../controllers/usuario.controller.js';
import checkAuth from '../../middleware/checkAuth.js';

router.post('/', createUser); // crea un nuevo usuario

router.post('/login', autenticar);

router.get('/confirmar/:token', confirmar);

router.post('/olvide-password', olvidePassword);

router.route('/olvide-password/:token')
  .get(comprobarToken)
  .post(nuevoPassword)

router.get('/perfil', checkAuth, perfil);

export default router;