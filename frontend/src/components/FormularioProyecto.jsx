import { useState, useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import Alerta from './Alerta';

const FormularioProyecto = () => {

  const [ projectId, setProjectId ] = useState(null);
  const [ projectName, setProjectName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ dueDate, setDueDate ] = useState('');
  const [ client, setClient ] = useState('');

  const params = useParams();
  const { showAlerta, alerta, submitProject, proyecto } = useProyectos();

  useEffect(() => {
    // Como este formulario se puede usar tanto para crear como para editar, se hace lo siguiente:
    // Usando el params nos fijamos en la url, si no tiene params es por que se va a usar para crear, pero si tiene paramas es por que se va a usar para Editar
    if (params.id && proyecto.name) {
      console.log('editando...')
      setProjectId(proyecto._id)
      setProjectName(proyecto.name);
      setDescription(proyecto.description);
      setDueDate(proyecto.dueDate?.split('T')[0]);
      setClient(proyecto.client);
    }
  }, [params]);

  const handleSubmit = async e => {
    e.preventDefault();

    if ([projectName, description, dueDate, client ].some(elem => elem.trim().length === 0))
      return showAlerta({
        visible: true,
        tipo: 'error',
        msg: 'Todos los campos son requeridos'
      });

    // Pasar los datos hacia le Provider
    await submitProject({ projectId, name: projectName, description, dueDate, client });
    setProjectId(null);
    setProjectName('');
    setDescription('');
    setDueDate('');
    setClient('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'>

        { alerta.visible && <Alerta alerta={alerta} />}

        <div className='mb-5'>
          <label 
            className='text-gray-700 uppercase font-bold text-sm'
            htmlFor='inpProjectName'>Nombre del proyecto</label>

            <input 
              id='inpProjectName'
              type='text'
              className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
              placeholder='Nombre del Proyecto'
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              />
        </div>

        <div className='mb-5'>
          <label 
            className='text-gray-700 uppercase font-bold text-sm'
            htmlFor='taDescription'>Descripción del proyecto</label>

            <textarea 
              id='taDescription'
              className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
              placeholder='Descripción del proyecto'
              value={description}
              onChange={e => setDescription(e.target.value)}
              />
        </div>

        <div className='mb-5'>
          <label 
            className='text-gray-700 uppercase font-bold text-sm'
            htmlFor='inpDueDate'>Fecha de entrega</label>

            <input 
              id='inpDueDate'
              type='date'
              className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              />
        </div>

        <div className='mb-5'>
          <label 
            className='text-gray-700 uppercase font-bold text-sm'
            htmlFor='inpClient'>Cliente</label>

            <input 
              id='inpClient'
              type='text'
              className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
              placeholder='Cliente'
              value={client}
              onChange={e => setClient(e.target.value)}
              />
        </div>

        <input 
          type='submit'
          value={projectId ? 'Actualizar Proyecto' : 'Crear Proyecto'}
          className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors'/>
    </form>
  )
}

export default FormularioProyecto;