
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clientAxios from '../config/clientAxios.js';

const OlvidePassword = () => {
  const [ email, setEmail ] = useState('');
  const [ alerta, setAlerta ] = useState({visible: false});

  const handleSubmit = async e => {
    e.preventDefault();

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return setAlerta({
        visible: true,
        tipo: 'warning',
        msg: 'Ingrese un email valido'
      });
    }

    // enviar email de reestableciemiento de cuenta
    try {
      const { data } = await clientAxios.post('/usuario/v1/olvide-password', {email});

      setAlerta({
        visible: true,
        tipo: 'success',
        msg: data.msg
      });
      setEmail('');

    } catch (error) {
      console.error(error);
      setAlerta({
        visible: true,
        tipo: 'error',
        msg: error.response.data.msg
      });
    }
  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Recupera tu acceso, no pierdas tus <span className='text-slate-700'>proyectos</span></h1>

      { alerta.visible && <Alerta alerta={alerta} />}
      
      <form 
        className='my-10 bg-white shadow rounded-lg px-10 py-10'
        onSubmit={handleSubmit}>

        <div className='my-5'>
          <label 
            htmlFor='inpEmail'
            className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input 
            id='inpEmail'
            type='email'
            placeholder='Email de registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <input 
          type='submit'
          value={'Enviar instrucciones'}
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'  
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'>
            Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/registrar'>
            No tienes una cuenta? Registrate
        </Link>
      </nav>
    </>
  )
}

export default OlvidePassword