import { useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import PreviewProyecto from '../components/PreviewProyecto';
import Alerta from '../components/Alerta';
import io from 'socket.io-client';

let socket;

const Proyectos = () => {

  const { arrProyectos, alerta } = useProyectos();

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('cliente:prueba', { nombre: 'Arley' }); // pasa info al server

    socket.on('server:respuesta', (data) => {
      console.log('Desde el front', data);
    });
  }, [])

  return (
    <>
      <h1 className='text-4xl font-black'>Proyectos</h1>

      { alerta.visible && <Alerta alerta={alerta} /> }

      <div className='bg-white shadow mt-10 rounded-lg'>
        { 
          arrProyectos.length > 0 
            ? (arrProyectos.map(proyecto => <PreviewProyecto key={proyecto._id} proyecto={proyecto} />)) 
            : <p className='text-center text-gray-600 uppercase font-bold p-5'>No Hay proyetos aún prro </p> 
        }
      </div>
    </>
  )
}

export default Proyectos