import useProyectos from './useProyectos';
import useAuth from './useAuth';

const useCreator = () => { 
  const { proyecto } = useProyectos();
  const { auth } = useAuth(); 

  return proyecto.creator === auth._id; // valida si el creador del proyecto es igual al usuario autenticado
}

export default useCreator;