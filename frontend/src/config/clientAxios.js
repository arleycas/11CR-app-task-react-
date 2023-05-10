import axios from 'axios';

const clientAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
});

/*
  ahora para usar axios no hay que escribir toda la url: ❌ ej: axios.get('localhost:666/api/usuario/v1/123')
  como ya se importa la url desde .env, solo se pone el resto del endpoint que se necesite ✅ ej: clientAxios.get('/usuario/v1/123')
  por que como lo congfiguramos aquí el 'localhost:666/api' ya está predeterminado como base
*/

export default clientAxios;