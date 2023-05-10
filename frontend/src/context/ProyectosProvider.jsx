import { useState, useEffect, createContext } from 'react';
import clientAxios from '../config/clientAxios.js';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import io from 'socket.io-client';
let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

  const [ arrProyectos, setArrProyectos ] = useState([]);
  const [ proyecto, setProyecto ] = useState({});
  const [ alerta, setAlerta ] = useState({visible: false});
  const [ cargando, setCargando ] = useState(false);
  const [ cargandoStatus, setCargandoStatus ] = useState(false);
  const [ modalFormTarea, setModalFormTarea ] = useState(false);
  const [ tarea, setTarea ] = useState({});
  const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false);
  const [ colaborador, setColaborador ] = useState({});
  const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false);
  const [ buscador, setBuscador ] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();

  // al acargar el componente se ejecuta:
  useEffect(() => {
    const getProjects = async () => {
      try {
        const jwtoken = localStorage.getItem('jwtoken');
        if (!jwtoken) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtoken}`
          }
        }

      const { data } = await clientAxios.get('/project/v1/', config);
      setArrProyectos(data);

      } catch (error) {
        console.error(error);
        setAlerta({visible: true, tipo: 'error', msg: error.response.data.msg});
        setTimeout(() => {
          setAlerta({visible: false});
        }, 3000);
      }

    }

    getProjects();

  }, [auth]);

  // se encarga de la conexión con socket.io
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);

  }, []);

  const showAlerta = alerta => {
    setAlerta(alerta);
    setTimeout(() => { setAlerta({visible: false}) }, 4000);
  }

  const createProject = async project => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.post('/project/v1/', project, config);

      // actualiza el state (y ya que la page de Proyectos utiliza este state, nos evitamos que haga una
      // consulta nuevamente a la DB para mostrar el listado de proyectos)
      setArrProyectos([...arrProyectos, data]); 

      setAlerta({
        visible: true,
        tipo: 'success',
        msg: `Proyecto ${data.name} creado satisfactoriamente`
      });

      setTimeout(() => {
        setAlerta({visible: false});
        navigate('/proyectos');
      }, 3000);
      
      
    } catch (error) {
      console.error(error);
    } 

  }
  
  const updateProject = async project => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.put(`/project/v1/${project.projectId}`, project, config);
      
      // sincronizar el state
      const arrProyectosActualizados = arrProyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState);
      setArrProyectos(arrProyectosActualizados);

      setAlerta({
        visible: true,
        tipo: 'success',
        msg: `Proyecto ${data.name} actualizado satisfactoriamente`
      });

      setTimeout(() => {
        setAlerta({visible: false});
        navigate('/proyectos');
      }, 3000);
      
      
    } catch (error) {
      console.error(error);
    } 

  }

  const submitProject = async project => {
    // Si viene con id quiere decir que va a editar
    if (project.projectId) {
      await updateProject(project);
    }else {
    // si no viene con id es que se va a crear
      await createProject(project);
    }
  }

  const getProject = async idProject => {

    setCargando(true);

    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.get(`/project/v1/${idProject}`, config);
      setProyecto(data);
      
    } catch (error) {
      console.error(error);
      navigate('/proyectos');
      showAlerta({
        visible: true,
        tipo: 'error',
        msg: error.response.data.msg
      })
    } finally {
      setCargando(false);
    }

  }

  const deleteProject = async idProject => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.delete(`/project/v1/${idProject}`, config);
      console.log('Eliminado', data);
      // sincronizar state
      const arrProyectosActualizados = arrProyectos.filter(proyectoState => proyectoState._id !== idProject);
      setArrProyectos(arrProyectosActualizados);

      setAlerta({
        visible: true,
        tipo: 'success',
        msg: data.msg
      });

      setTimeout(() => {
        setAlerta({visible: false});
        navigate('/proyectos');
      }, 3000);

      
    } catch (error) {
      console.error(error);
    }
  }

  const handleModalTarea = () => {
    // abre o cierra el modal
    setModalFormTarea(!modalFormTarea);
    setTarea({});
  }

  const handleModalEditarTarea = tarea => {
    setTarea(tarea);
    setModalFormTarea(true);
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  }

  const updateTask = async tarea => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data: updatedTask } = await clientAxios.put(`/task/v1/${tarea.taskId}`, tarea, config);

      // socket.io
      socket.emit('client:actualizar_tarea', updatedTask);

      setAlerta({visible: false})
      setModalFormTarea(false);
      
    } catch (error) {
      console.error(error);
    }
  }

  const createTask = async tarea => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data: newTask } = await clientAxios.post('/task/v1/', tarea, config);
      
      setAlerta({visible: false})
      setModalFormTarea(false);

      // SOCKET IO
      socket.emit('client:nueva_tarea', newTask);
      
    } catch (error) {
      console.error(error);
    }
  }

  const deleteTask = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.delete(`/task/v1/${tarea._id}`, config);

      socket.emit('client:eliminar_tarea', data.removedTask);
      
      setAlerta({visible: true, tipo: 'success', msg: data.msg})
      setModalEliminarTarea(false);
      setTarea({})
      setTimeout(() => {
        setAlerta({visible: false})
      }, 3000);
      
    } catch (error) {
      console.error(error);
    }
  }

  const submitTarea = async tarea => {

    if (tarea.taskId) { // si viene con el id, es por que va a editar
      updateTask(tarea);
    } else { // si no, es por que va a crear
      createTask(tarea);
    }
  }

  const submitColaborador = async email => {
    setCargando(true);

    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      // obtenemos al colaborador
      const { data } = await clientAxios.post('/project/v1/colaborador', {email}, config);
      setColaborador(data);
      setAlerta({visible: false});

    } catch (error) {
      // console.log(error.reponse);
      setAlerta({visible: true, tipo: 'error', msg: error.response.data.msg});
      setTimeout(() => {
        setAlerta({visible: false});
      }, 3000);

    }finally {
      setCargando(false);
    }
  }

  const addColaborador = async ({email}) => {
    setCargando(true);

    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      // obtenemos al colaborador
      const { data } = await clientAxios.post(`/project/v1/colaborador/${proyecto._id}`, {email}, config);
      showAlerta({visible: true, tipo: 'success', msg: data.msg});

    } catch (error) {
      // console.log(error.reponse);
      showAlerta({visible: true, tipo: 'error', msg: error.response.data.msg});

    }finally {
      setCargando(false);
    }
  }

  const handleModalEliminarColaborador = colaborador => {
    // setTarea(tarea);
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  }
  
  const deleteCollaborator = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      const { data } = await clientAxios.post(`/project/v1/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);
      
      const proyectoActualizado = {...proyecto};

      proyectoActualizado.collaborators = proyectoActualizado.collaborators.filter(colaboradorState => colaboradorState._id !== colaborador._id);
      setProyecto(proyectoActualizado);
      setModalEliminarColaborador(false);
      setAlerta({visible: true, tipo: 'success', msg: data.msg});
      setColaborador({});

    } catch (error) {
      console.error(error);
      setAlerta({visible: true, tipo: 'error', msg: error.response.data.msg});
      setTimeout(() => {
        setAlerta({visible: false});
      }, 3000);
    }
  }

  const completeTask = async idTask => {
    console.log('Complentando...', idTask);
    setCargandoStatus(true);
    
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      if (!jwtoken) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }
      
      const { data: updatedTask } = await clientAxios.post(`/task/v1/estado/${idTask}`, {}, config);

      // socket.io
      socket.emit('client:cambiar_estado_tarea', updatedTask);
      
      setTarea({});

    } catch (error) {
      console.error(error);
    }finally {
      setCargandoStatus(false);
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador);
  }

  const cerrarSesionProyectos = () => {
    setArrProyectos([]);
    setProyecto({});
    setAlerta({});
  }

  // * SOCKET.IO

  const updateStateNuevaTarea = newTask => {
    // agrega tarea al state
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tasks = [...proyectoActualizado.tasks, newTask];
    setProyecto(proyectoActualizado);
  }

  const updateStateEliminarTarea = removedTask => {
    // quita tarea del state
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tasks = proyectoActualizado.tasks.filter(tareaState => tareaState._id !== removedTask._id);
    setProyecto(proyectoActualizado);
  }

  const updateStateActualizarTarea = updatedTask => {
    // update tarea del state
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tasks = proyectoActualizado.tasks.map(tareaState => tareaState._id === updatedTask._id ? updatedTask : tareaState);
    setProyecto(proyectoActualizado);
  }

  const updateStateEstadoTarea = updatedTask => {
    // update estado de tarea del state
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tasks = proyectoActualizado.tasks.map(tareaState => tareaState._id === updatedTask._id ? updatedTask : tareaState);
    setProyecto(proyectoActualizado);
  }

  return (
    <ProyectosContext.Provider
      value={{
        arrProyectos,
        proyecto,
        showAlerta,
        alerta,
        submitProject,
        getProject,
        cargando,
        deleteProject,
        modalFormTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        deleteTask,
        submitColaborador,
        colaborador,
        addColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        deleteCollaborator,
        completeTask,
        cargandoStatus,
        handleBuscador,
        buscador,
        updateStateNuevaTarea,
        updateStateEliminarTarea,
        updateStateActualizarTarea,
        updateStateEstadoTarea,
        cerrarSesionProyectos
      }}>
      {children}
    </ProyectosContext.Provider>
  )
}

export { ProyectosProvider}
export default ProyectosContext;