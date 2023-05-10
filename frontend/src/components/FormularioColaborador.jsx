import { useState } from 'react';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

const FormularioColaborador = () => {

  const [email, setEmail] = useState('');
  const { alerta, showAlerta, submitColaborador } = useProyectos();

  const handleSubmit = e => {
    e.preventDefault();

    if (email.trim().length === 0)
    return showAlerta({
      visible: true,
      tipo: 'warning',
      msg: 'El email es obligatorio'
    });

    submitColaborador(email);
  }

  return (
    <form
      className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
      onSubmit={handleSubmit}>

      { alerta.visible && <Alerta alerta={alerta} />}

      <div className='mb-5'>
        <label 
          htmlFor='inpEmailColaborador'
          className='text-gray-700 uppercase font-bold text-sm'>Email colaborador</label>
        <input 
          id='inpEmailColaborador'
          type='email'
          placeholder='Email del usuario'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <input 
        type='submit'
        className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white text-sm uppercase font-bold cursor-pointer transition-colors rounded'
        value='Buscar colaborador'/>
      
    </form>
  )
}

export default FormularioColaborador