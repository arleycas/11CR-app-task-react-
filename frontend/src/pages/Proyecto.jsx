import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import useCreator from '../hooks/useCreator';
import Loader from '../components/Loader';
import ModalFormularioTarea from '../components/ModalFormularioTarea';
import ModalEliminarTarea from '../components/ModalEliminarTarea';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import Tarea from '../components/Tarea';
import Colaborador from '../components/Colaborador';
import Alerta from '../components/Alerta';
import io from 'socket.io-client';

let socket;

const Proyecto = () => {

  const { id: idProyecto } = useParams();
  const { getProject, proyecto, cargando, alerta, updateStateNuevaTarea, updateStateEliminarTarea, updateStateActualizarTarea, updateStateEstadoTarea } = useProyectos();
  const { handleModalTarea } = useProyectos();

  const isCreator = useCreator();

  useEffect(() => {
    getProject(idProyecto);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('client:abrir_proyecto', idProyecto); // pasa info al server
  });

  useEffect(() => {
    socket.on('server:tarea_agregada', newTask => {
      if (newTask.project === proyecto._id) updateStateNuevaTarea(newTask);
    })

    socket.on('server:tarea_eliminada', removedTask => {
      if (removedTask.project._id === proyecto._id) updateStateEliminarTarea(removedTask)
    });

    socket.on('server:tarea_actualizada', updatedTask => {
      if (updatedTask.project._id === proyecto._id) updateStateActualizarTarea(updatedTask)
    });

    socket.on('server:nuevo_estado_tarea', updatedTask => {
      if (updatedTask.project._id === proyecto._id) updateStateEstadoTarea(updatedTask)
    });

  }); // se ejecuta todo el tiempo, ya que no tiene dependencias
  
  const { name, description } = proyecto;

  // console.log(proyecto);
  // console.log(isCreator);

  if (cargando) return <Loader />

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='font-black text-4xl'>{name}</h1>

        { isCreator && (
          <div className='flex items-center gap-2 text-gray-400 hover:text-gray-500'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>

            <Link
              to={`/proyectos/editar/${idProyecto}`}
              className='uppercase font-bold'>Editar</Link>
          </div>
        )}
      </div>

      { isCreator && (
        <button
          onClick={handleModalTarea}
          type='button'
          className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
            </svg>
            Nueva Tarea
        </button>
      )}

      <p className='font-bold text-xl mt-10'>Tareas del proyecto</p>

      <div className='flex justify-center'>
        <div className='w-full md:w-1/3 lg:w-1/4'>
          { alerta.visible && <Alerta alerta={alerta} />}
        </div>
      </div>

      <div className='bg-white shadow mt-10 rounded-lg'>
        {proyecto.tasks?.length 
          ? proyecto.tasks?.map(tarea => (
            <Tarea
              key={tarea._id}
              tarea={tarea} />
          ))
          : <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
      </div>

      { isCreator && (
        <>
          <div className='flex items-center justify-between mt-10'>
                <p className='font-bold text-xl'>Colaboradores</p>
                <Link
                  to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                  className='text-gray-400 uppercase hover:text-gray-500 font-bold'>
                    Añadir
                </Link>
          </div>

          <div className='bg-white shadow mt-10 rounded-lg'>
            {proyecto.collaborators?.length ?
              proyecto.collaborators?.map(colaborador => (
                <Colaborador
                  key={colaborador._id}
                  colaborador={colaborador} />
              )) : 
              <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
          </div>
        </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto