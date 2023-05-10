import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../config/clientAxios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

  const [ auth, setAuth ] = useState({});
  const [ cargando, setCargando ] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUser = async () => {
      const jwtoken = localStorage.getItem('jwtoken');
      
      if (!jwtoken) return setCargando(false);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtoken}`
        }
      }

      try {
        const { data } = await clientAxios.get('/usuario/v1/perfil', config);
        if (data._id && location.pathname === '/') {
          navigate('/proyectos'); // en caso de que ya esté autenticado, lo redireccionamos a /proyectos
        } 
        
      } catch (error) {
        console.error(error);
        setAuth({});
      } finally {
        setCargando(false);
      }
    }

    autenticarUser();

  }, []);

  const cerrarSesionAuth = () => {
    setAuth({});
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesionAuth
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
export default AuthContext;