import Project from '../models/Proyecto.js';
import Task from '../models/Tarea.js';
import User from '../models/Usuario.js';

const getProjects = async (req, res) => {

  const proyectos = await Project.find({
    $or: [
      { collaborators: { $in: req.user } },
      { creator: { $in: req.user } }
    ]
  })
    .select('-tasks');

  res.json(proyectos);
}

const getProject = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Project.findById(id)
    .populate({ path: 'tasks', populate: { path: 'completedBy', select: 'name' } })
    .populate('collaborators', 'name email');

  if (!proyecto) {
    const error = new Error('No encontrado');
    return res.status(404).json({ msg: error.message });
  }

  // ? solo pueden acceder los creadores del proyecto y los colaboradores
  // si el creador es diferente del usuario que esta haciendo la petición lanza error
  // y además si el usuario que esta haciendo la petición no es un colaborador también lanza error
  if (proyecto.creator.toString() !== req.user._id.toString() && !proyecto.collaborators.some(collab => collab._id.toString() === req.user._id.toString())) {
    const error = new Error('Acción no valida');
    return res.status(401).json({ msg: error.message });
  }

  // Obtener tareas del proyecto
  const tareas = await Task.find().where('project').equals(proyecto._id);

  res.json(proyecto);
}

const newProject = async (req, res) => {

  const proyecto = new Project(req.body);
  proyecto.creator = req.user._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.error(error);
  }
}

const editProject = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Project.findById(id);

  if (!proyecto) {
    const error = new Error('No encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(401).json({ msg: error.message });
  }

  try {

    proyecto.name = req.body.name || proyecto.name;
    proyecto.description = req.body.description || proyecto.description;
    proyecto.dueDate = req.body.dueDate || proyecto.dueDate;
    proyecto.client = req.body.client || proyecto.client;

    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);

  } catch (error) {
    console.error(error);
  }

}

const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Project.findById(id);

  if (!proyecto) {
    const error = new Error('No encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(401).json({ msg: error.message });
  }

  try {
    const proyectoEliminado = await proyecto.deleteOne();
    res.json({ msg: 'Proyecto eliminado', data: proyectoEliminado })
  } catch (error) {
    console.error(error);
  }
}

const getCollaborator = async (req, res) => {
  const { email } = req.body;

  const usuario = await User.findOne({ email }).select('-confirmed -createdAt -password -token -updatedAt -__v');

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
}

const addCollaborator = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Project.findById(id);

  if (!proyecto) {
    const error = new Error('No encontrado');
    return res.status(404).json({ msg: error.message });
  }

  // solo el que creó el proyecto es el mismo que podrá agregar un colaborador
  if (proyecto.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ msg: error.message });
  }

  // * se busca al usuario que se quiere agregar (mediante el email que se le pasa)
  const { email } = req.body;

  const usuario = await User.findOne({ email }).select('-confirmed -createdAt -password -token -updatedAt -__v');

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  // el colaborador que se quiera agregar no debe ser el mismo "admin" o creador del proyecto
  if (proyecto.creator.toString() === usuario._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador');
    return res.status(404).json({ msg: error.message });
  }

  // revisar que el colaborador no haya sido agregado previante al proyecto
  if (proyecto.collaborators.includes(usuario._id)) {
    const error = new Error('El colaborador ya pertenece al proyecto');
    return res.status(404).json({ msg: error.message });
  }

  // ok, se puede agregar
  proyecto.collaborators.push(usuario._id);
  await proyecto.save();

  res.json({ msg: 'Colaborador agregado correctamente' });

}

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const error = new Error('Id invalido');
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Project.findById(id);

  if (!proyecto) {
    const error = new Error('No encontrado');
    return res.status(404).json({ msg: error.message });
  }

  // solo el que creó el proyecto es el mismo que podrá agregar un colaborador
  if (proyecto.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ msg: error.message });
  }

  // ok, se puede eliminar
  proyecto.collaborators.pull(req.body.id);
  await proyecto.save();

  res.json({ msg: 'Colaborador eliminado correctamente' });

}

export {
  getProjects,
  getProject,
  newProject,
  editProject,
  deleteProject,
  getCollaborator,
  addCollaborator,
  deleteCollaborator
}
