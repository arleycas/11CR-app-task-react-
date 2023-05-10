import { useParams, Link } from 'react-router-dom';
import clientAxios from '../config/clientAxios.js';
import Alerta from '../components/Alerta';
import { useEffect, useState } from 'react';

const ConfirmarCuenta = () => {

  const params = useParams();
  const { token } = params;
  const [ alerta, setAlerta ] = useState({visible: false});
  const [ isConfirmedAccount, setIsConfirmedAccount ] = useState(false);
  
  useEffect(() => {
    const confirmarCuenta = async () => {
        try {
          const url = `/usuario/v1/confirmar/${token}`;
          const { data } = await clientAxios.get(url);

          setAlerta({
            visible: true,
            tipo: 'success',
            msg: data.msg
          });

          setIsConfirmedAccount(true);
          
        } catch (error) {
          console.error(error);
          setAlerta({
            visible: true,
            tipo: 'error',
            msg: error.response.data.msg
          });
        }
      }
      
      confirmarCuenta();

  }, []);

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Confirma tu <span className='text-slate-700'>cuenta</span></h1>

      <div className='mt-20 md:mt-5 shadow-lg px-10 py-10 rounded-xl bg-white'>
        { alerta.visible && <Alerta alerta={alerta} />}

        {isConfirmedAccount && (
          <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'>
            Inicia sesión
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta