import express from 'express';
const router = express.Router();
import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus
} from '../../controllers/task.controller.js';
import checkAuth from '../../middleware/checkAuth.js';

// http://localhost:4000/api/task/v1/

router.post('/', checkAuth, addTask);
router.route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);
router.post('/estado/:id', checkAuth, changeStatus); // es una actualización, pero no es PUT ya que este se recomienda cuando la actualización es de todo el registro no solo de una parte


export default router;
