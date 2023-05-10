import Task from '../models/Tarea.js';
import Project from '../models/Proyecto.js';

const addTask = async (req, res) => {
  const { project: idProject } = req.body;
  const projectExists = await Project.findById(idProject);

  if (!projectExists) {
    const error = new Error('El proyecto no existe');
    return res.status(404).json({ msg: error.message });
  }

  if (projectExists.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes los permisos para añadir tareas');
    return res.status(401).json({ msg: error.message });
  }

  try {
    const storedTask = await Task.create(req.body);
    // almacenar el id de tarea en el Project
    projectExists.tasks.push(storedTask._id);
    await projectExists.save();

    res.json(storedTask);

  } catch (error) {
    console.error(error);
  }

};

const getTask = async (req, res) => {
  const { id } = req.params;

  /* 
    necesitamos buscar la tarea y también a que proyecto pertenece 
    pero no sería optimo buscar una tarea luego y proyecto y luego cruzar si coincide
    para eso metimos la propiedad "project" a nuestro modelo de Task
    y solo con usar el metodo "populate" ya nos trae la información de ambas colecciones ya cruzadas
  */
  const tarea = await Task.findById(id).populate('project');

  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);

};

const updateTask = async (req, res) => {
  const { id } = req.params;

  const tarea = await Task.findById(id).populate('project');

  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  tarea.name = req.body.name || tarea.name;
  tarea.description = req.body.description || tarea.description;
  tarea.priority = req.body.priority || tarea.priority;
  tarea.dueDate = req.body.dueDate || tarea.dueDate;

  try {
    const storedTask = await tarea.save();
    res.json(storedTask);
  } catch (error) {
    console.error(error);
    return res.status(422).json({ msg: 'Los datos proporcionados no son validos', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const tarea = await Task.findById(id).populate('project');

  if (!tarea) {
    const error = new Error('No encontrada');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(401).json({ msg: error.message });
  }

  try {
    // se borra tanto la tarea en si, como la referencia en el Project
    const proyecto = await Project.findById(tarea.project);
    proyecto.tasks.pull(tarea._id);

    const dataResultado = await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);

    res.json({ msg: 'Tarea eliminada', removedTask: dataResultado[1].value })

  } catch (error) {
    console.error(error);
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const tarea = await Task.findById(id).populate('project');

  if (!tarea) {
    const error = new Error('No encontrada');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.project.creator.toString() !== req.user._id.toString() && !tarea.project.collaborators.some(collab => collab._id.toString() === req.user._id.toString())) {
    const error = new Error('Acción no valida');
    return res.status(401).json({ msg: error.message });
  }

  tarea.status = !tarea.status;
  tarea.completedBy = req.user._id;
  await tarea.save();

  const tareaAlmacenada = await Task.findById(id).populate('project').populate('completedBy');

  res.json(tareaAlmacenada);
};

export {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus
}