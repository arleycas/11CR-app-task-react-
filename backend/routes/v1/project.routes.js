import express from 'express';
const router = express.Router();
import {
  getProjects,
  getProject,
  newProject,
  editProject,
  deleteProject,
  getCollaborator,
  addCollaborator,
  deleteCollaborator
} from '../../controllers/project.controller.js';
import checkAuth from '../../middleware/checkAuth.js';

router.route('/')
  .get(checkAuth, getProjects)
  .post(checkAuth, newProject);

router.route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

// no sé por que el de udemy dejó todas estas como post
router.post('/colaborador/', checkAuth, getCollaborator);
router.post('/colaborador/:id', checkAuth, addCollaborator);
router.post('/eliminar-colaborador/:id', checkAuth, deleteCollaborator); // el id es el del proyecto no del colaborador a eliminar

export default router;