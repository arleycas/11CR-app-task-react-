import FormularioColaborador from '../components/FormularioColaborador';
import { useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Alerta from '../components/Alerta';

const NuevoColaborador = () => {

  const params = useParams(); 
  const { getProject, proyecto, cargando, colaborador, addColaborador, alerta } = useProyectos();

  useEffect(() => {
    getProject(params.id); // recordar que esta funcion setea a 'proyecto' en el provider
  }, []);

  // console.log(colaborador);

  // if (cargando) return <Loader />
  
  if (!proyecto?._id) return <Alerta alerta={alerta} />

  return (
    <>
      <h1 className='text-4xl font-black'>Añadir Colaborador(a) al proyecto <span className='text-sky-700'>{proyecto.name}</span></h1>

      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>

      { cargando ? <Loader /> : colaborador?._id && (
        <div className='flex justify-center mt-10'>
          <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full'>
            <h1 className='text-center mb-10 text-2xl font-bold'>Resultado</h1>

            <div className='flex justify-between items-center'>
              <p>{colaborador.name}</p>

              <button
                type='button'
                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                onClick={() => addColaborador({email: colaborador.email})}>
                  Agregar al proyecto
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  )
}

export default NuevoColaborador