import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clientAxios from '../config/clientAxios';
import useAuth from '../hooks/useAuth';

const Login = () => {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ alerta, setAlerta ] = useState({visible: false});
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  
  const handleSubmit = async e => {
    e.preventDefault();

    if ([email, password].some(elem => elem.trim().length === 0)) return setAlerta({visible: true, tipo: 'error', msg: 'Debe rellenar todos los campos'});

    setAlerta({visible: false});

    try {
      const { data } = await clientAxios.post('/usuario/v1/login', {email, password});
      localStorage.setItem('jwtoken', data.token);
      setAuth(data);
      navigate('/proyectos');
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
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Inicia sesión y adiministra tus <span className='text-slate-700'>proyectos</span></h1>

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

        <input 
          type='submit'
          value={'Iniciar Sesión'}
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'  
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/registrar'>
            No tienes una cuenta? Registrate
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

export default Login