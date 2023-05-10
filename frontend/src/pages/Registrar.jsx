import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clientAxios from '../config/clientAxios.js';

const Registrar = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repetirPassword, setRepetirPassword ] = useState('');
  const [ alerta, setAlerta ] = useState({visible: false});
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if([name, email, password].includes('')) return setAlerta({visible: true, tipo: 'error', msg: 'Todos los campos son obligatorios'});
    if (password !== repetirPassword) return setAlerta({visible: true, tipo: 'error', msg: 'Los passwords no coinciden'});
    if (password.length < 4) return setAlerta({visible: true, tipo: 'error', msg: 'El password es muy corto, debe de ser al menos de 4 carácteres'});

    setAlerta({visible: false});

    // crear usuario
    try {
      const { data } = await clientAxios.post(`/usuario/v1/`, {name, email, password});

      setAlerta({
        visible: true,
        tipo: 'success',
        msg: data.msg
      });

      setName('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');  

    } catch (error) {
      console.error(error.response);
      setAlerta({
        visible: true,
        tipo: 'error',
        msg: error.response.data.msg
      });
    }
    
  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y adiministra tus <span className='text-slate-700'>proyectos</span></h1>

      {
        alerta.visible && <Alerta alerta={alerta} />
      }
      
      <form
        className='my-10 bg-white shadow rounded-lg px-10 py-10'
        onSubmit={handleSubmit}  
      >

        <div className='my-5'>
          <label 
            htmlFor='inpNombre'
            className='uppercase text-gray-600 block text-xl font-bold'>Nombre</label>
          <input 
            id='inpNombre'
            type='text'
            placeholder='Tu nombre'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

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

        <div className='my-5'>
          <label 
            htmlFor='inpPassword'
            className='uppercase text-gray-600 block text-xl font-bold'>Password</label>
          <input 
            id='inpPassword'
            type='password'
            placeholder='Password de registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className='my-5'>
          <label 
            htmlFor='inpRepetirPassword'
            className='uppercase text-gray-600 block text-xl font-bold'>Repetir Password</label>
          <input 
            id='inpRepetirPassword'
            type='password'
            placeholder='Repetir tu Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>

        <input 
          type='submit'
          value={'Crear Cuenta'}
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
          to='/olvide-password'>
            Olvidé mi password
        </Link>
      </nav>
    </>
  )
}

export default Registrar