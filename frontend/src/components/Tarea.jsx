import { formatearFecha } from '../helpers/formatearFecha';
import useProyectos from '../hooks/useProyectos';
import useCreator from '../hooks/useCreator';
import Loader from './Loader';

const Tarea = ({tarea}) => {

  const { _id, name, description, status, dueDate, priority, createdAt, updatedAt } = tarea;
  const { handleModalEditarTarea, handleModalEliminarTarea, completeTask, cargandoStatus } = useProyectos();
  const isCreator = useCreator();

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div className='flex flex-col items-start'>
        <p className='mb-1 text-xl'>{name}</p>
        <p className='mb-1 text-sm text-gray-500 uppercase'>{description}</p>
        <p className='mb-1 text-xs'>{formatearFecha(dueDate)}</p>
        <p className='mb-1 text-gray-600'>Prioridad: {priority}</p>
        { status && <p className='text-xs bg-green-600 text-white p-1 rounded-md uppercase'>Completada por: {tarea.completedBy.name}</p> }
      </div>

        <div className='flex flex-col lg:flex-row gap-2'>
          { isCreator && (
            <button
              className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
              onClick={() => handleModalEditarTarea(tarea)}>
                Editar
            </button>
          )}    

          <button
            onClick={() => completeTask(_id)}
            className={`${status ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}>
              { status ?  'Completada' : 'Incompleta'}
          </button>

          { isCreator && (

            <button
              className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
              onClick={() => handleModalEliminarTarea(tarea)}>
                Eliminar
            </button>
          )}    
        </div>
    </div>
  )
}

export default Tarea