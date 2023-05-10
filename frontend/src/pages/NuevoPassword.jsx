import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Alerta from '../components/Alerta';
import clientAxios from '../config/clientAxios.js';

const NuevoPassword = () => {

  const params = useParams();
  const { token } = params;

  const [ isTokenValid, setIsTokenValid ] = useState(false);
  const [ alerta, setAlerta ] = useState({visible: false});
  const [ password, setPassword ] = useState('');
  const [ isConfirmedPassUpdate, setIsConfirmedPassUpdate ] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data } = await clientAxios.get(`/usuario/v1/olvide-password/${token}`);
        setIsTokenValid(true);

      } catch (error) {
        console.error(error);
        setAlerta({
          visible: true,
          tipo: 'error',
          msg: error.response.data.msg
        });
      }
    }

    checkToken();

  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if(password.length < 4) return setAlerta({visible: true, tipo: 'error', msg: 'El password debe ser minimo de 4 carácteres'});

    try {
      const url = `/usuario/v1/olvide-password/${token}`;
      const { data } = await clientAxios.post(url, {password});
  
      setAlerta({
        visible: true,
        tipo: 'success',
        msg: data.msg
      });

      setPassword('');
      setIsConfirmedPassUpdate(true);
      setIsTokenValid(false); // para ocultar el form
      
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
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Reestablece tu <span className='text-slate-700'>password</span></h1>

      { alerta.visible && <Alerta alerta={alerta} />}

      { isTokenValid && (
        <form 
          className='my-10 bg-white shadow rounded-lg px-10 py-10'
          onSubmit={handleSubmit}>

        <div className='my-5'>
          <label 
            htmlFor='inpNuevoPassword'
            className='uppercase text-gray-600 block text-xl font-bold'>Nuevo Password</label>
          <input 
            id='inpNuevoPassword'
            type='password'
            placeholder='Escribe tu Nuevo Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input 
          type='submit'
          value={'Guardar nuevo password'}
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'  
        />
      </form>
      ) }

      {
        isConfirmedPassUpdate && (
          <nav className='lg:flex lg:justify-between'>
            <Link
              className='block text-center my-5 text-slate-500 uppercase text-sm'
              to='/'>
                Inicia sesión
            </Link>
          </nav>
        )
      }
    </>
  )
}

export default NuevoPassword